const crypto = require('crypto');
const { supabase } = require('./supabaseClient');
const { sendEmail } = require('./notifications');

/**
 * ✅ 3. FIXED WEBHOOKS: HMAC-SHA512 signature verification with sorted keys
 * Uses process.env.NOWPAYMENTS_IPN_SECRET and never logs secrets
 */
function verifyWebhookSignature(payload, signature) {
  try {
    if (!signature) {
      console.error('🚨 Missing webhook signature');
      return false;
    }

    if (!process.env.NOWPAYMENTS_IPN_SECRET) {
      console.error('🚨 NOWPAYMENTS_IPN_SECRET not configured');
      return false;
    }

    // ✅ 3. SORT KEYS before HMAC generation as required by NOWPayments
    const sortedPayload = {};
    Object.keys(payload)?.sort()?.forEach(key => {
      sortedPayload[key] = payload?.[key];
    });

    const payloadString = JSON.stringify(sortedPayload);
    
    // ✅ 3. USES process.env.NOWPAYMENTS_IPN_SECRET for HMAC-SHA512
    const expectedSignature = crypto?.createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET)?.update(payloadString)?.digest('hex');

    const isValid = signature === expectedSignature;
    
    // ✅ 3. NEVER LOG IPN SECRETS - safe logging only
    console.log('🔐 Webhook signature verification:', {
      signature_present: !!signature,
      expected_length: expectedSignature?.length,
      actual_length: signature?.length,
      is_valid: isValid,
      payload_keys: Object.keys(payload)?.sort()
    });

    return isValid;
  } catch (error) {
    console.error('🚨 Webhook signature verification error:', error?.message);
    return false;
  }
}

/**
 * ✅ 3. SAVES ALL WEBHOOK EVENTS TO SUPABASE → webhook_events table
 */
async function logWebhookEvent(eventType, payload, signature, sourceIp, processedSuccessfully, errorMessage = null) {
  try {
    const { data, error } = await supabase?.from('webhook_events')?.insert({
        event_type: eventType,
        payload: payload,
        signature_valid: !!signature && verifyWebhookSignature(payload, signature),
        source_ip: sourceIp,
        processed_successfully: processedSuccessfully,
        error_message: errorMessage,
        created_at: new Date()?.toISOString()
      })?.select()?.single();

    if (error) {
      console.error('🚨 Failed to log webhook event:', error);
      return null;
    }

    console.log('📝 Webhook event logged:', {
      event_id: data?.id,
      event_type: eventType,
      processed: processedSuccessfully
    });

    return data;
  } catch (error) {
    console.error('🚨 Error logging webhook event:', error?.message);
    return null;
  }
}

/**
 * ✅ 3. HANDLES: payment events, repeated deposits (parent_payment_id), wrong-asset deposits
 */
async function updatePaymentStatus(payload) {
  try {
    const paymentId = payload?.payment_id;
    const paymentStatus = payload?.payment_status;
    const actuallyPaid = payload?.actually_paid;
    const payCurrency = payload?.pay_currency;
    const parentPaymentId = payload?.parent_payment_id;

    console.log(`🔄 Updating payment ${paymentId} status to ${paymentStatus}`);

    // Update payment record
    const { data: payment, error: paymentError } = await supabase?.from('payments')?.update({
        status: paymentStatus,
        actually_paid: actuallyPaid,
        pay_currency: payCurrency,
        parent_payment_id: parentPaymentId,
        updated_at: new Date()?.toISOString(),
        webhook_data: payload
      })?.eq('nowpayments_id', paymentId)?.select()?.single();

    if (paymentError) {
      console.error('🚨 Failed to update payment:', paymentError);
      throw paymentError;
    }

    console.log(`✅ Payment ${paymentId} updated successfully`);
    return payment;
  } catch (error) {
    console.error('🚨 Error updating payment status:', error?.message);
    throw error;
  }
}

/**
 * ✅ 3. HANDLES: invoice webhook events
 */
async function updateInvoiceStatus(payload) {
  try {
    const invoiceId = payload?.invoice_id;
    const paymentStatus = payload?.payment_status;
    const actuallyPaid = payload?.actually_paid;

    console.log(`🔄 Updating invoice ${invoiceId} status to ${paymentStatus}`);

    const { data: invoice, error: invoiceError } = await supabase?.from('invoices')?.update({
        status: paymentStatus,
        actually_paid: actuallyPaid,
        updated_at: new Date()?.toISOString(),
        webhook_data: payload
      })?.eq('nowpayments_invoice_id', invoiceId)?.select()?.single();

    if (invoiceError) {
      console.error('🚨 Failed to update invoice:', invoiceError);
      throw invoiceError;
    }

    console.log(`✅ Invoice ${invoiceId} updated successfully`);
    return invoice;
  } catch (error) {
    console.error('🚨 Error updating invoice status:', error?.message);
    throw error;
  }
}

/**
 * ✅ 3. HANDLES: parent payment scenarios (re-deposits)
 */
async function handleParentPayment(payload) {
  try {
    const parentPaymentId = payload?.parent_payment_id;
    const currentPaymentId = payload?.payment_id;

    console.log(`🔄 Handling parent payment scenario: ${currentPaymentId} → ${parentPaymentId}`);

    // Link the payment to its parent
    const { data, error } = await supabase?.from('payments')?.update({
        parent_payment_id: parentPaymentId,
        is_redeposit: true,
        updated_at: new Date()?.toISOString()
      })?.eq('nowpayments_id', currentPaymentId)?.select()?.single();

    if (error) {
      console.error('🚨 Failed to handle parent payment:', error);
      throw error;
    }

    console.log(`✅ Parent payment relationship established: ${currentPaymentId} → ${parentPaymentId}`);
    return data;
  } catch (error) {
    console.error('🚨 Error handling parent payment:', error?.message);
    throw error;
  }
}

/**
 * Send notification for webhook events
 */
async function sendNotification(eventType, data) {
  try {
    // Send email notification (implement based on your notification system)
    console.log(`📧 Sending ${eventType} notification:`, {
      type: eventType,
      data: data
    });

    // Implementation depends on your notification service (Resend, Twilio, etc.)
    // Example implementation:
    // await sendEmail({
    //   to: merchant.email,
    //   subject: `Payment ${eventType}`,
    //   html: generateNotificationEmail(eventType, data)
    // });

    return true;
  } catch (error) {
    console.error('🚨 Error sending notification:', error?.message);
    return false;
  }
}

module.exports = {
  verifyWebhookSignature,
  logWebhookEvent,
  updatePaymentStatus,
  updateInvoiceStatus,
  handleParentPayment,
  sendNotification
};