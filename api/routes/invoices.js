const express = require('express');
const { supabaseClient } = require('../utils/supabaseClient');
const router = express?.Router();

/**
 * ▶ 5.1 — BACKEND / API QA: Fixed invoice routes with schema alignment
 * All routes match SDK paths with consistent JSON response shapes
 */

// POST /api/invoices - Create invoice
router?.post('/', async (req, res) => {
  try {
    const merchantId = req?.user?.merchantId;
    const {
      price_amount,
      price_currency = 'USD',
      pay_currency,
      order_id,
      order_description,
      ipn_callback_url,
      success_url,
      cancel_url,
      partially_paid_url,
      is_fixed_rate = false,
      is_fee_paid_by_user = false
    } = req?.body;

    // Validate required fields
    if (!price_amount || !price_currency) {
      return res?.status(400)?.json({
        success: false,
        error: 'price_amount and price_currency are required',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Validate price amount
    const priceAmount = parseFloat(price_amount);
    if (isNaN(priceAmount) || priceAmount <= 0) {
      return res?.status(400)?.json({
        success: false,
        error: 'price_amount must be a positive number',
        code: 'INVALID_AMOUNT'
      });
    }

    // Generate unique invoice ID
    const invoiceId = `INV-${Date.now()}-${Math.random()?.toString(36)?.substring(2, 8)?.toUpperCase()}`;

    // Create invoice using exact schema column names
    const { data: invoice, error: dbError } = await supabaseClient?.from('invoices')?.insert({
      merchant_id: merchantId,
      invoice_id: invoiceId,
      price_amount: priceAmount,
      price_currency: price_currency?.toUpperCase(),
      pay_currency: pay_currency?.toUpperCase() || null,
      order_id: order_id || null,
      order_description: order_description || null,
      ipn_callback_url: ipn_callback_url || null,
      success_url: success_url || null,
      cancel_url: cancel_url || null,
      partially_paid_url: partially_paid_url || null,
      fixed_rate: is_fixed_rate,
      status: 'waiting'
    })?.select()?.single();

    if (dbError) {
      console.error('Invoice creation error:', dbError);
      return res?.status(500)?.json({
        success: false,
        error: 'Failed to create invoice',
        code: 'DATABASE_ERROR',
        details: dbError?.message
      });
    }

    res?.status(201)?.json({
      success: true,
      data: invoice,
      message: 'Invoice created successfully'
    });

  } catch (error) {
    console.error('Create invoice error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/invoices/:id - Get invoice by ID
router?.get('/:id', async (req, res) => {
  try {
    const merchantId = req?.user?.merchantId;
    const { id } = req?.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex?.test(id)) {
      return res?.status(400)?.json({
        success: false,
        error: 'Invalid invoice ID format',
        code: 'INVALID_ID_FORMAT'
      });
    }

    const { data: invoice, error } = await supabaseClient?.from('invoices')?.select('*')?.eq('id', id)?.eq('merchant_id', merchantId)?.single();

    if (error || !invoice) {
      return res?.status(404)?.json({
        success: false,
        error: 'Invoice not found',
        code: 'INVOICE_NOT_FOUND'
      });
    }

    res?.json({
      success: true,
      data: invoice
    });

  } catch (error) {
    console.error('Get invoice error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/invoices/history - Get invoice history with pagination
router?.get('/history', async (req, res) => {
  try {
    const merchantId = req?.user?.merchantId;
    const { page = 1, limit = 20, status, currency, from_date, to_date } = req?.query;

    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));

    let query = supabaseClient?.from('invoices')?.select('*', { count: 'exact' })?.eq('merchant_id', merchantId)?.order('created_at', { ascending: false });

    // Apply filters
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

    const { data: invoices, error, count } = await query;

    if (error) {
      console.error('Invoice history error:', error);
      return res?.status(500)?.json({
        success: false,
        error: 'Failed to fetch invoice history',
        code: 'DATABASE_ERROR',
        details: error?.message
      });
    }

    res?.json({
      success: true,
      data: invoices || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        pages: Math.ceil((count || 0) / limitNum)
      }
    });

  } catch (error) {
    console.error('Invoice history error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;