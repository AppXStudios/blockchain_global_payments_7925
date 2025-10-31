// ✅ STEP E - OVERWRITE WEBHOOKS FOR RAW BODY + HMAC VERIFY
const crypto = require('crypto');
const { supabase } = require('../utils/supabaseClient');

// ✅ 3. DISABLE BODY PARSER: Raw body required for HMAC verification
export const config = { api: { bodyParser: false } };

/**
 * ✅ 3. UPDATED WEBHOOKS: Raw body + HMAC-SHA512 verification
 * Handles NOWPayments webhook events with proper signature verification
 */
export default async function handler(req, res) {
  try {
    // Only accept POST requests
    if (req?.method !== 'POST') {
      return res?.status(405)?.json({ error: 'Method not allowed' });
    }

    // ✅ 3. RAW BODY: Get raw body for HMAC verification
    const getRawBody = (req) => {
      return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          resolve(body);
        });
        req.on('error', reject);
      });
    };

    const raw = await getRawBody(req);
    const payload = JSON.parse(raw);

    // ✅ 3. HMAC VERIFICATION: Verify NOWPayments signature
    const signature = req?.headers?.['x-nowpayments-sig'] || '';
    const secret = process.env.NOWPAYMENTS_IPN_SECRET?.trim();

    if (!secret) {
      console.error('🚨 NOWPayments IPN secret not configured');
      return res?.status(500)?.json({ error: 'IPN secret missing' });
    }

    // ✅ 3. SORT KEYS: Sort payload keys for consistent signature
    const sortKeys = (obj) => {
      if (typeof obj !== 'object' || obj === null) return obj;
      if (Array.isArray(obj)) return obj?.map(sortKeys);
      
      return Object.keys(obj)?.sort()?.reduce((result, key) => {
          result[key] = sortKeys(obj?.[key]);
          return result;
        }, {});
    };

    const sortedPayload = JSON.stringify(sortKeys(payload));

    // ✅ 3. HMAC-SHA512: Create signature
    const hmac = crypto?.createHmac('sha512', secret);
    hmac?.update(sortedPayload);
    const computedSignature = hmac?.digest('hex');

    if (computedSignature !== String(signature)) {
      console.error('🚨 Invalid NOWPayments webhook signature');
      return res?.status(400)?.json({ error: 'Invalid signature' });
    }

    console.log('✅ NOWPayments webhook verified:', {
      event_type: payload?.payment_status || payload?.status || 'unknown',
      payment_id: payload?.payment_id || payload?.id
    });

    // ✅ 3. SAVE WEBHOOK EVENTS: Store in Supabase
    try {
      await supabase?.from('webhook_events')?.insert([{
          event_type: payload?.payment_status || payload?.status || 'unknown',
          payload: payload,
          source_ip: req?.headers?.['x-forwarded-for'] || req?.connection?.remoteAddress,
          payment_id: payload?.payment_id || payload?.id,
          processed: false,
          created_at: new Date()?.toISOString()
        }]);
    } catch (webhookError) {
      console.error('⚠️ Failed to save webhook event:', webhookError);
      // Continue processing even if webhook logging fails
    }

    // ✅ 3. HANDLE PAYMENT EVENTS: Process successful payments
    if (['finished', 'paid', 'completed', 'confirmed']?.includes(payload?.payment_status)) {
      try {
        // Sync payment status with internal database
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (apiUrl) {
          await fetch(`${apiUrl}/api/payments/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              payment_id: payload?.payment_id || payload?.id,
              webhook_data: payload
            })
          });
        }
      } catch (syncError) {
        console.error('⚠️ Failed to sync payment:', syncError);
        // Don't fail the webhook for sync errors
      }
    }

    // ✅ 3. HANDLE REPEATED DEPOSITS: Track overpayments
    if (payload?.payment_status === 'partially_paid' && payload?.actually_paid > payload?.pay_amount) {
      console.log('📈 Overpayment detected:', {
        expected: payload?.pay_amount,
        received: payload?.actually_paid,
        payment_id: payload?.payment_id
      });
    }

    // ✅ 3. HANDLE WRONG ASSETS: Track incorrect currency payments
    if (payload?.payment_status === 'failed' && payload?.outcome_currency !== payload?.pay_currency) {
      console.log('💱 Wrong currency payment:', {
        expected: payload?.pay_currency,
        received: payload?.outcome_currency,
        payment_id: payload?.payment_id
      });
    }

    // ✅ 3. HANDLE WITHDRAWALS: Process withdrawal events
    if (payload?.withdrawal_id) {
      console.log('💸 Withdrawal webhook received:', {
        withdrawal_id: payload?.withdrawal_id,
        status: payload?.status
      });
    }

    // Return success response
    res?.status(200)?.json({ 
      success: true,
      message: 'Webhook processed successfully' 
    });

  } catch (error) {
    console.error('🚨 NOWPayments webhook error:', {
      message: error?.message,
      stack: error?.stack,
      timestamp: new Date()?.toISOString()
    });

    res?.status(500)?.json({ 
      success: false,
      error: 'Webhook processing failed' 
    });
  }
}