// NOWPayments API Integration Wrapper
// Comprehensive cryptocurrency payment processing through NOWPayments API
// Provides secure, validated methods for all payment operations

const axios = require('axios');

// Environment variables
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_BASE_URL = process.env.NOWPAYMENTS_BASE_URL || 'https://api.nowpayments.io';
const NOWPAYMENTS_IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;

if (!NOWPAYMENTS_API_KEY) {
  throw new Error('NOWPAYMENTS_API_KEY is required');
}

// Base API client with default headers
const nowPaymentsAPI = axios?.create({
  baseURL: NOWPAYMENTS_BASE_URL,
  timeout: 30000,
  headers: {
    'x-api-key': NOWPAYMENTS_API_KEY,
    'Content-Type': 'application/json'
  }
});

// Response interceptor for consistent error handling
nowPaymentsAPI?.interceptors?.response?.use(
  response => response,
  error => {
    console.error('NOWPayments API Error:', {
      url: error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status,
      data: error?.response?.data
    });
    return Promise.reject(error);
  }
);

// Conversion-safe numeric handling
function safeParseNumber(value) {
  if (!value) return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

// Create custody sub-account (POST /v1/custody/users)
async function createCustodyUser(name) {
  try {
    const response = await nowPaymentsAPI?.post('/v1/custody/users', {
      name: String(name)?.trim()
    });
    return { data: response?.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error?.response?.data?.message || error?.message,
        status: error?.response?.status,
        code: error?.response?.data?.code || 'API_ERROR'
      }
    };
  }
}

// Get user balance (GET /v1/custody/balance)
async function getUserBalance(apiKey) {
  try {
    const response = await axios?.get(`${NOWPAYMENTS_BASE_URL}/v1/custody/balance`, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    return { data: response?.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error?.response?.data?.message || error?.message,
        status: error?.response?.status,
        code: error?.response?.data?.code || 'API_ERROR'
      }
    };
  }
}

// Create payment (POST /v1/payment)
async function createPayment(payload) {
  try {
    // Validate and format payload
    const formattedPayload = {
      price_amount: safeParseNumber(payload?.price_amount),
      price_currency: payload?.price_currency || 'USD',
      pay_currency: payload?.pay_currency,
      order_id: payload?.order_id,
      order_description: payload?.order_description,
      ipn_callback_url: payload?.ipn_callback_url,
      success_url: payload?.success_url,
      cancel_url: payload?.cancel_url
    };

    // Remove null/undefined values
    Object.keys(formattedPayload)?.forEach(key => {
      if (formattedPayload?.[key] === null || formattedPayload?.[key] === undefined) {
        delete formattedPayload?.[key];
      }
    });

    const response = await nowPaymentsAPI?.post('/v1/payment', formattedPayload);
    return { data: response?.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error?.response?.data?.message || error?.message,
        status: error?.response?.status,
        code: error?.response?.data?.code || 'API_ERROR'
      }
    };
  }
}

// Get payment status (GET /v1/payment/:id)
async function getPaymentStatus(paymentId) {
  try {
    const response = await nowPaymentsAPI?.get(`/v1/payment/${paymentId}`);
    return { data: response?.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error?.response?.data?.message || error?.message,
        status: error?.response?.status,
        code: error?.response?.data?.code || 'API_ERROR'
      }
    };
  }
}

// Create invoice (POST /v1/invoice)
async function createInvoice(payload) {
  try {
    // Validate and format payload
    const formattedPayload = {
      price_amount: safeParseNumber(payload?.price_amount),
      price_currency: payload?.price_currency || 'USD',
      pay_currency: payload?.pay_currency,
      order_id: payload?.order_id,
      order_description: payload?.order_description,
      success_url: payload?.success_url,
      cancel_url: payload?.cancel_url,
      due_date: payload?.due_date,
      fixed_rate: payload?.fixed_rate || false,
      ipn_callback_url: payload?.ipn_callback_url
    };

    // Remove null/undefined values
    Object.keys(formattedPayload)?.forEach(key => {
      if (formattedPayload?.[key] === null || formattedPayload?.[key] === undefined) {
        delete formattedPayload?.[key];
      }
    });

    const response = await nowPaymentsAPI?.post('/v1/invoice', formattedPayload);
    return { data: response?.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error?.response?.data?.message || error?.message,
        status: error?.response?.status,
        code: error?.response?.data?.code || 'API_ERROR'
      }
    };
  }
}

// Get invoice status (GET /v1/invoice/:id)
async function getInvoiceStatus(invoiceId) {
  try {
    const response = await nowPaymentsAPI?.get(`/v1/invoice/${invoiceId}`);
    return { data: response?.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error?.response?.data?.message || error?.message,
        status: error?.response?.status,
        code: error?.response?.data?.code || 'API_ERROR'
      }
    };
  }
}

// Write-off (withdrawal) - POST /v1/custody/withdrawal
async function writeOff(apiKey, amount, currency, address, extraId = null) {
  try {
    const payload = {
      amount: safeParseNumber(amount),
      currency: currency?.toLowerCase(),
      address: address
    };
    
    if (extraId) {
      payload.extra_id = extraId;
    }

    const response = await axios?.post(`${NOWPAYMENTS_BASE_URL}/v1/custody/withdrawal`, payload, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    return { data: response?.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error?.response?.data?.message || error?.message,
        status: error?.response?.status,
        code: error?.response?.data?.code || 'API_ERROR'
      }
    };
  }
}

// Get withdrawal status (GET /v1/custody/withdrawal/:id)
async function getWithdrawalStatus(withdrawalId) {
  try {
    const response = await nowPaymentsAPI?.get(`/v1/custody/withdrawal/${withdrawalId}`);
    return { data: response?.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error?.response?.data?.message || error?.message,
        status: error?.response?.status,
        code: error?.response?.data?.code || 'API_ERROR'
      }
    };
  }
}

// Get estimated price (GET /v1/estimate)
async function getEstimatedPrice(amount, currencyFrom, currencyTo) {
  try {
    const response = await nowPaymentsAPI?.get('/v1/estimate', {
      params: {
        amount: safeParseNumber(amount),
        currency_from: currencyFrom?.toLowerCase(),
        currency_to: currencyTo?.toLowerCase()
      }
    });
    return { data: response?.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error?.response?.data?.message || error?.message,
        status: error?.response?.status,
        code: error?.response?.data?.code || 'API_ERROR'
      }
    };
  }
}

// Get minimum amount (GET /v1/min-amount)
async function getMinimumAmount(currencyFrom, currencyTo) {
  try {
    const response = await nowPaymentsAPI?.get('/v1/min-amount', {
      params: {
        currency_from: currencyFrom?.toLowerCase(),
        currency_to: currencyTo?.toLowerCase()
      }
    });
    return { data: response?.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error?.response?.data?.message || error?.message,
        status: error?.response?.status,
        code: error?.response?.data?.code || 'API_ERROR'
      }
    };
  }
}

// Get available currencies (GET /v1/currencies)
async function getAvailableCurrencies() {
  try {
    const response = await nowPaymentsAPI?.get('/v1/currencies');
    return { data: response?.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error?.response?.data?.message || error?.message,
        status: error?.response?.status,
        code: error?.response?.data?.code || 'API_ERROR'
      }
    };
  }
}

// API status check (GET /v1/status)
async function getApiStatus() {
  try {
    const response = await nowPaymentsAPI?.get('/v1/status');
    return { data: response?.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error?.response?.data?.message || error?.message,
        status: error?.response?.status,
        code: error?.response?.data?.code || 'API_ERROR'
      }
    };
  }
}

// Verify IPN signature for webhook validation
function verifyIPNSignature(payload, signature) {
  if (!NOWPAYMENTS_IPN_SECRET) {
    console.error('NOWPAYMENTS_IPN_SECRET is not configured');
    return false;
  }

  try {
    const crypto = require('crypto');
    const expectedSignature = crypto?.createHmac('sha512', NOWPAYMENTS_IPN_SECRET)?.update(JSON.stringify(payload))?.digest('hex');

    return crypto?.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('IPN signature verification failed:', error);
    return false;
  }
}

module.exports = {
  createCustodyUser,
  getUserBalance,
  createPayment,
  getPaymentStatus,
  createInvoice,
  getInvoiceStatus,
  writeOff,
  getWithdrawalStatus,
  getEstimatedPrice,
  getMinimumAmount,
  getAvailableCurrencies,
  getApiStatus,
  verifyIPNSignature,
  safeParseNumber
};