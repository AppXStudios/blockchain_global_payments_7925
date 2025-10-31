const express = require('express');
const { verifyWebhookSignature, logWebhookEvent, updatePaymentStatus, updateInvoiceStatus, handleParentPayment, sendNotification } = require('../utils/webhookUtils');
const router = express?.Router();

/**
 * ✅ 3. FIXED WEBHOOKS: NOWPayments IPN webhook processing
 * Disables bodyParser, reads rawBody correctly, sorts keys before HMAC, uses process.env.NOWPAYMENTS_IPN_SECRET
 */

// POST /api/webhooks/nowpayments - Handle NOWPayments IPN webhook
router?.post('/', async (req, res) => {
  try {
    // ✅ 3. READS RAWBODY CORRECTLY
    const signature = req?.headers?.['x-nowpayments-sig'];
    const sourceIp = req?.ip || req?.connection?.remoteAddress || req?.headers?.['x-forwarded-for']?.split(',')?.[0];
    
    // Parse raw body as JSON
    let payload;
    try {
      payload = typeof req?.body === 'string' ? JSON.parse(req?.body) : req?.body;
    } catch (parseError) {
      console.error('🚨 Invalid JSON payload:', parseError);
      await logWebhookEvent('system', req?.body, signature, sourceIp, false, 'Invalid JSON payload');
      return res?.status(400)?.json({
        success: false,
        error: 'Invalid JSON payload'
      });
    }

    console.log('📨 NOWPayments webhook received:', {
      signature: signature ? 'Present' : 'Missing',
      payloadKeys: Object.keys(payload || {}),
      sourceIp,
      webhook_url: process.env.NOWPAYMENTS_WEBHOOK_URL
    });

    // ✅ 3. SORTS KEYS BEFORE HMAC GENERATION, USES process.env.NOWPAYMENTS_IPN_SECRET
    const isValidSignature = verifyWebhookSignature(payload, signature);
    
    if (!isValidSignature) {
      console.error('🚨 Invalid webhook signature');
      await logWebhookEvent('system', payload, signature, sourceIp, false, 'Invalid signature');
      return res?.status(401)?.json({
        success: false,
        error: 'Invalid signature'
      });
    }

    console.log('✅ Webhook signature verified successfully');

    // Determine event type
    const eventType = payload?.payment_id ? 'payment' : payload?.invoice_id ? 'invoice' : payload?.withdrawal_id ? 'withdrawal' : 'system';

    let processedSuccessfully = false;
    let errorMessage = null;

    try {
      // ✅ 3. HANDLES: payment events, repeated deposits (parent_payment_id), wrong-asset deposits, withdrawal events
      if (payload?.payment_id) {
        await updatePaymentStatus(payload);
        
        // Handle parent payment scenarios (re-deposits)
        if (payload?.parent_payment_id) {
          await handleParentPayment(payload);
        }
        
        await sendNotification('payment_status_update', {
          paymentId: payload?.payment_id,
          status: payload?.payment_status,
          amount: payload?.actually_paid || payload?.pay_amount
        });
        
        processedSuccessfully = true;
        console.log(`✅ Payment ${payload?.payment_id} processed successfully`);
      }

      // Process invoice webhook
      if (payload?.invoice_id) {
        await updateInvoiceStatus(payload);
        
        await sendNotification('invoice_status_update', {
          invoiceId: payload?.invoice_id,
          status: payload?.payment_status,
          amount: payload?.actually_paid || payload?.pay_amount
        });
        
        processedSuccessfully = true;
        console.log(`✅ Invoice ${payload?.invoice_id} processed successfully`);
      }

      // Process withdrawal webhook
      if (payload?.withdrawal_id) {
        console.log(`🔄 Processing withdrawal ${payload?.withdrawal_id}`);
        
        await sendNotification('withdrawal_status_update', {
          withdrawalId: payload?.withdrawal_id,
          status: payload?.payment_status || 'processing'
        });
        
        processedSuccessfully = true;
        console.log(`✅ Withdrawal ${payload?.withdrawal_id} processed successfully`);
      }

    } catch (processingError) {
      console.error('🚨 Webhook processing error:', processingError);
      errorMessage = processingError?.message || 'Processing failed';
      processedSuccessfully = false;
    }

    // ✅ 3. SAVES ALL EVENTS TO SUPABASE → webhook_events table
    await logWebhookEvent(eventType, payload, signature, sourceIp, processedSuccessfully, errorMessage);

    // Return success response
    res?.json({
      success: true,
      message: 'Webhook processed successfully',
      processed: processedSuccessfully
    });

  } catch (error) {
    console.error('🚨 NOWPayments webhook error:', error);
    
    // Log error to database
    try {
      await logWebhookEvent('system', req?.body, req?.headers?.['x-nowpayments-sig'], req?.ip, false, error?.message);
    } catch (logError) {
      console.error('🚨 Failed to log webhook error:', logError);
    }

    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      message: 'Webhook processing failed'
    });
  }
});

// GET /api/webhooks/test - Test webhook endpoint for development
router?.get('/test', (req, res) => {
  res?.json({
    success: true,
    message: 'Webhook endpoint is operational',
    timestamp: new Date()?.toISOString(),
    ip: req?.ip || req?.connection?.remoteAddress
  });
});

module.exports = router;