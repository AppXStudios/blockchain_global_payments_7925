const express = require('express');
const { supabaseClient } = require('../utils/supabaseClient');
const nowPayments = require('../utils/nowpayments');
const router = express?.Router();

/**
 * ▶ 5.1 — BACKEND / API QA: Fixed payment routes with proper database schema alignment
 * Ensuring all routes exist and match SDK paths with consistent JSON response shapes
 */

// POST /api/payments - Create payment
router?.post('/', async (req, res) => {
  try {
    const merchantId = req?.user?.merchantId;
    const {
      price_amount,
      price_currency = 'USD',
      pay_currency,
      ipn_callback_url,
      order_id,
      order_description,
      purchase_id,
      payout_address,
      payout_currency,
      payout_extra_id,
      fixed_rate = false,
      is_fee_paid_by_user = false
    } = req?.body;

    // Validate required fields using schema column names
    if (!price_amount || !price_currency) {
      return res?.status(400)?.json({
        success: false,
        error: 'price_amount and price_currency are required',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Validate price amount is positive number
    const priceAmount = parseFloat(price_amount);
    if (isNaN(priceAmount) || priceAmount <= 0) {
      return res?.status(400)?.json({
        success: false,
        error: 'price_amount must be a positive number',
        code: 'INVALID_AMOUNT'
      });
    }

    // Generate unique payment ID
    const paymentId = `PAY-${Date.now()}-${Math.random()?.toString(36)?.substring(2, 8)?.toUpperCase()}`;

    // Store payment in database using correct schema column names
    const { data: payment, error: dbError } = await supabaseClient?.from('payments')?.insert({
      merchant_id: merchantId,
      payment_id: paymentId,
      price_amount: priceAmount,
      price_currency: price_currency?.toUpperCase(),
      pay_currency: pay_currency?.toUpperCase() || null,
      ipn_callback_url: ipn_callback_url || null,
      order_id: order_id || null,
      status: 'waiting',
      is_fixed_rate: fixed_rate,
      is_fee_paid_by_user: is_fee_paid_by_user,
      payout_address: payout_address || null,
      payout_currency: payout_currency?.toUpperCase() || null,
      payout_extra_id: payout_extra_id || null
    })?.select()?.single();

    if (dbError) {
      console.error('Database error:', dbError);
      return res?.status(500)?.json({
        success: false,
        error: 'Failed to store payment in database',
        code: 'DATABASE_ERROR',
        details: dbError?.message
      });
    }

    // Return success response matching SDK expectations
    res?.status(201)?.json({
      success: true,
      data: payment,
      message: 'Payment created successfully'
    });

  } catch (error) {
    console.error('Create payment error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error during payment creation',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/payments/:id - Get payment by ID
router?.get('/:id', async (req, res) => {
  try {
    const merchantId = req?.user?.merchantId;
    const { id } = req?.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex?.test(id)) {
      return res?.status(400)?.json({
        success: false,
        error: 'Invalid payment ID format',
        code: 'INVALID_ID_FORMAT'
      });
    }

    const { data: payment, error } = await supabaseClient?.from('payments')?.select('*')?.eq('id', id)?.eq('merchant_id', merchantId)?.single();

    if (error || !payment) {
      return res?.status(404)?.json({
        success: false,
        error: 'Payment not found',
        code: 'PAYMENT_NOT_FOUND'
      });
    }

    res?.json({
      success: true,
      data: payment
    });

  } catch (error) {
    console.error('Get payment error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/payments/history - Get payment history with pagination
router?.get('/history', async (req, res) => {
  try {
    const merchantId = req?.user?.merchantId;
    const { page = 1, limit = 20, status, currency, from_date, to_date } = req?.query;

    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));

    let query = supabaseClient?.from('payments')?.select('*', { count: 'exact' })?.eq('merchant_id', merchantId)?.order('created_at', { ascending: false });

    // Apply filters using schema column names
    if (status) {
      query = query?.eq('status', status);
    }

    if (currency) {
      query = query?.eq('price_currency', currency?.toUpperCase());
    }

    if (from_date) {
      query = query?.gte('created_at', from_date);
    }

    if (to_date) {
      query = query?.lte('created_at', to_date);
    }

    // Apply pagination
    const offset = (pageNum - 1) * limitNum;
    query = query?.range(offset, offset + limitNum - 1);

    const { data: payments, error, count } = await query;

    if (error) {
      console.error('Payment history error:', error);
      return res?.status(500)?.json({
        success: false,
        error: 'Failed to fetch payment history',
        code: 'DATABASE_ERROR',
        details: error?.message
      });
    }

    res?.json({
      success: true,
      data: payments || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        pages: Math.ceil((count || 0) / limitNum)
      }
    });

  } catch (error) {
    console.error('Payment history error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;