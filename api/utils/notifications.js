// ✅ PLACEHOLDER NOTIFICATION FUNCTIONS ONLY
// DO NOT use real email/SMS - log placeholders only

/**
 * Placeholder email function - logs instead of sending actual emails
 * @param {string} to - Email recipient
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 */
async function sendEmail(to, subject, html) {
  console.log("EMAIL_PLACEHOLDER", { 
    to, 
    subject,
    timestamp: new Date()?.toISOString(),
    service: "Blockchain Global Payments LLC"
  });
  
  return {
    success: true,
    message: "Email placeholder logged",
    data: { to, subject }
  };
}

/**
 * Placeholder SMS function - logs instead of sending actual SMS
 * @param {string} to - Phone number
 * @param {string} body - SMS message body
 */
async function sendSMS(to, body) {
  console.log("SMS_PLACEHOLDER", { 
    to, 
    body,
    timestamp: new Date()?.toISOString(),
    service: "Blockchain Global Payments LLC"
  });
  
  return {
    success: true,
    message: "SMS placeholder logged",
    data: { to, body }
  };
}

// Email templates for placeholder logging
const emailTemplates = {
  welcome: (merchantName, dashboardUrl) => ({
    subject: `Welcome to Blockchain Global Payments LLC - ${merchantName}`,
    html: `Welcome ${merchantName}! Your account is ready. Dashboard: ${dashboardUrl}`
  }),

  paymentConfirmed: (merchantName, paymentId, amount, currency) => ({
    subject: `Payment Confirmed - ${paymentId}`,
    html: `Payment confirmed for ${merchantName}: ${amount} ${currency} (ID: ${paymentId})`
  }),

  invoiceCreated: (merchantName, invoiceId, amount, currency, invoiceUrl) => ({
    subject: `Invoice Created - ${invoiceId}`,
    html: `Invoice created for ${merchantName}: ${amount} ${currency}. URL: ${invoiceUrl}`
  }),

  withdrawalCompleted: (merchantName, withdrawalId, amount, currency) => ({
    subject: `Withdrawal Completed - ${withdrawalId}`,
    html: `Withdrawal completed for ${merchantName}: ${amount} ${currency} (ID: ${withdrawalId})`
  }),

  paymentCreated: (merchantName, paymentId, amount, currency) => ({
    subject: `Payment Created - ${paymentId}`,
    html: `New payment created for ${merchantName}: ${amount} ${currency} (ID: ${paymentId})`
  }),

  securityAlert: (merchantName, action) => ({
    subject: `Security Alert - ${action}`,
    html: `Security alert for ${merchantName}: ${action} detected`
  })
};

// SMS templates for placeholder logging
const smsTemplates = {
  paymentAlert: (amount, currency, paymentId) =>
    `BGP: Payment ${amount} ${currency} confirmed. ID: ${paymentId}`,
  
  withdrawalAlert: (amount, currency, withdrawalId) =>
    `BGP: Withdrawal ${amount} ${currency} completed. ID: ${withdrawalId}`,
  
  securityAlert: (action) =>
    `BGP Security: ${action} on your account. Check dashboard.`,
    
  highValuePayment: (amount, currency, paymentId) =>
    `BGP High Value: ${amount} ${currency} received. ID: ${paymentId}`,
    
  withdrawalRequest: (amount, currency) =>
    `BGP: Withdrawal request ${amount} ${currency} processing.`
};

/**
 * High-level merchant notification function using ONLY placeholders
 * @param {string} merchantEmail - Merchant email address
 * @param {string} merchantPhone - Merchant phone number 
 * @param {string} type - Notification type
 * @param {Object} data - Notification data
 * @param {boolean} enableEmail - Enable email notifications
 * @param {boolean} enableSMS - Enable SMS notifications
 */
async function notifyMerchant(merchantEmail, merchantPhone, type, data, enableEmail = true, enableSMS = false) {
  const results = { email: null, sms: null };

  // Send placeholder email notification
  if (enableEmail && merchantEmail) {
    let template;
    switch (type) {
      case 'welcome':
        template = emailTemplates?.welcome(data?.merchantName, data?.dashboardUrl);
        break;
      case 'payment_confirmed':
        template = emailTemplates?.paymentConfirmed(data?.merchantName, data?.paymentId, data?.amount, data?.currency);
        break;
      case 'payment_created':
        template = emailTemplates?.paymentCreated(data?.merchantName, data?.paymentId, data?.amount, data?.currency);
        break;
      case 'invoice_created':
        template = emailTemplates?.invoiceCreated(data?.merchantName, data?.invoiceId, data?.amount, data?.currency, data?.invoiceUrl);
        break;
      case 'withdrawal_completed':
        template = emailTemplates?.withdrawalCompleted(data?.merchantName, data?.withdrawalId, data?.amount, data?.currency);
        break;
      case 'security_alert':
        template = emailTemplates?.securityAlert(data?.merchantName, data?.action);
        break;
      default:
        console.warn('📧 Unknown email template type:', type);
        return results;
    }

    results.email = await sendEmail(merchantEmail, template?.subject, template?.html);
  }

  // Send placeholder SMS notification
  if (enableSMS && merchantPhone) {
    let message;
    switch (type) {
      case 'payment_confirmed':
        message = smsTemplates?.paymentAlert(data?.amount, data?.currency, data?.paymentId);
        break;
      case 'withdrawal_completed':
        message = smsTemplates?.withdrawalAlert(data?.amount, data?.currency, data?.withdrawalId);
        break;
      case 'security_alert':
        message = smsTemplates?.securityAlert(data?.action);
        break;
      case 'high_value_payment':
        message = smsTemplates?.highValuePayment(data?.amount, data?.currency, data?.paymentId);
        break;
      case 'withdrawal_request':
        message = smsTemplates?.withdrawalRequest(data?.amount, data?.currency);
        break;
      default:
        console.warn('📱 Unknown SMS template type:', type);
        return results;
    }

    results.sms = await sendSMS(merchantPhone, message);
  }

  return results;
}

/**
 * Admin notification function using ONLY placeholders
 * @param {string} type - Admin notification type
 * @param {Object} data - Notification data
 */
async function notifyAdmin(type, data) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@blockchainpay.com';
  
  console.log("ADMIN_NOTIFICATION_PLACEHOLDER", {
    type,
    data,
    timestamp: new Date()?.toISOString(),
    service: "Blockchain Global Payments LLC",
    recipient: adminEmail
  });

  return {
    success: true,
    message: "Admin notification placeholder logged",
    data: { type, adminEmail }
  };
}

module.exports = {
  sendEmail,
  sendSMS,
  notifyMerchant,
  notifyAdmin,
  emailTemplates,
  smsTemplates
};