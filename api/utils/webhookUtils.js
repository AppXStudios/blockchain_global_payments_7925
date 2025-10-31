// ✅ WEBHOOK UTILITIES: Enhanced webhook signature verification and processing
const crypto = require('crypto');

/**
 * ✅ 5. PRODUCTION HARDENING: Safe webhook signature verification
 * Prevents timing attacks and ensures secure HMAC validation
 */
class WebhookUtils {
  /**
   * Verify NOWPayments webhook signature with HMAC-SHA512
   */
  static verifyNOWPaymentsSignature(payload, signature, secret) {
    try {
      if (!secret || !signature || !payload) {
        return false;
      }

      // Sort keys recursively for consistent signature
      const sortedPayload = this.sortObjectKeys(payload);
      const sortedString = JSON.stringify(sortedPayload);

      // Create HMAC-SHA512
      const hmac = crypto?.createHmac('sha512', secret?.trim());
      hmac?.update(sortedString);
      const computedSignature = hmac?.digest('hex');

      // Constant-time comparison to prevent timing attacks
      return this.constantTimeEquals(computedSignature, signature?.toString());
    } catch (error) {
      console.error('🚨 Webhook signature verification error:', error);
      return false;
    }
  }

  /**
   * Sort object keys recursively for consistent webhook signatures
   */
  static sortObjectKeys(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj?.map(item => this.sortObjectKeys(item));
    }

    return Object.keys(obj)?.sort()?.reduce((result, key) => {
        result[key] = this.sortObjectKeys(obj?.[key]);
        return result;
      }, {});
  }

  /**
   * Constant-time string comparison to prevent timing attacks
   */
  static constantTimeEquals(a, b) {
    if (a?.length !== b?.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a?.length; i++) {
      result |= a?.charCodeAt(i) ^ b?.charCodeAt(i);
    }

    return result === 0;
  }

  /**
   * Extract payment information from webhook payload
   */
  static extractPaymentInfo(payload) {
    return {
      payment_id: payload?.payment_id || payload?.id,
      status: payload?.payment_status || payload?.status,
      amount: payload?.pay_amount || payload?.amount,
      currency: payload?.pay_currency || payload?.currency,
      actually_paid: payload?.actually_paid,
      outcome_amount: payload?.outcome_amount,
      outcome_currency: payload?.outcome_currency,
      created_at: payload?.created_at || new Date()?.toISOString()
    };
  }

  /**
   * Determine if webhook event should trigger payment sync
   */
  static shouldSyncPayment(status) {
    const syncStatuses = [
      'finished', 'paid', 'completed', 'confirmed',
      'partially_paid', 'failed', 'expired'
    ];
    return syncStatuses?.includes(status?.toLowerCase());
  }

  /**
   * Generate safe webhook event log (no sensitive data)
   */
  static createSafeLogEntry(payload, headers = {}) {
    return {
      event_type: payload?.payment_status || payload?.status || 'unknown',
      payment_id: payload?.payment_id || payload?.id,
      withdrawal_id: payload?.withdrawal_id,
      invoice_id: payload?.invoice_id,
      source_ip: headers?.['x-forwarded-for'] || headers?.['x-real-ip'],
      user_agent: headers?.['user-agent'],
      timestamp: new Date()?.toISOString(),
      has_signature: !!headers?.['x-nowpayments-sig']
    };
  }

  /**
   * Validate webhook payload structure
   */
  static validatePayloadStructure(payload) {
    const requiredFields = ['payment_id', 'payment_status'];
    const missingFields = requiredFields?.filter(field => 
      !payload?.hasOwnProperty(field) && !payload?.hasOwnProperty(field?.replace('payment_', ''))
    );

    return {
      isValid: missingFields?.length === 0,
      missingFields,
      hasPaymentId: !!(payload?.payment_id || payload?.id),
      hasStatus: !!(payload?.payment_status || payload?.status)
    };
  }
}

module.exports = WebhookUtils;