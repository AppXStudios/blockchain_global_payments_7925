const express = require('express');
const { supabaseClient } = require('../utils/supabaseClient');
const router = express?.Router();

/**
 * ▶ 5.1 — BACKEND / API QA: Fixed withdrawal routes with schema alignment
 * All routes match SDK paths with consistent JSON response shapes
 */

// POST /api/withdrawals - Create withdrawal
router?.post('/', async (req, res) => {
  try {
    const merchantId = req?.user?.merchantId;
    const {
      address,
      currency,
      requested_amount,
      extra_id,
      ipn_callback_url
    } = req?.body;

    // Validate required fields
    if (!address || !currency || !requested_amount) {
      return res?.status(400)?.json({
        success: false,
        error: 'address, currency, and requested_amount are required',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Validate amount
    const amount = parseFloat(requested_amount);
    if (isNaN(amount) || amount <= 0) {
      return res?.status(400)?.json({
        success: false,
        error: 'requested_amount must be a positive number',
        code: 'INVALID_AMOUNT'
      });
    }

    // Generate unique withdrawal ID
    const withdrawalId = `WD-${Date.now()}-${Math.random()?.toString(36)?.substring(2, 8)?.toUpperCase()}`;

    // Create withdrawal using exact schema column names
    const { data: withdrawal, error: dbError } = await supabaseClient?.from('withdrawals')?.insert({
      merchant_id: merchantId,
      withdrawal_id: withdrawalId,
      address: address,
      currency: currency?.toUpperCase(),
      requested_amount: amount,
      extra_id: extra_id || null,
      ipn_callback_url: ipn_callback_url || null,
      status: 'pending'
    })?.select()?.single();

    if (dbError) {
      console.error('Withdrawal creation error:', dbError);
      return res?.status(500)?.json({
        success: false,
        error: 'Failed to create withdrawal',
        code: 'DATABASE_ERROR',
        details: dbError?.message
      });
    }

    res?.status(201)?.json({
      success: true,
      data: withdrawal,
      message: 'Withdrawal created successfully'
    });

  } catch (error) {
    console.error('Create withdrawal error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/withdrawals/:id - Get withdrawal by ID
router?.get('/:id', async (req, res) => {
  try {
    const merchantId = req?.user?.merchantId;
    const { id } = req?.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex?.test(id)) {
      return res?.status(400)?.json({
        success: false,
        error: 'Invalid withdrawal ID format',
        code: 'INVALID_ID_FORMAT'
      });
    }

    const { data: withdrawal, error } = await supabaseClient?.from('withdrawals')?.select('*')?.eq('id', id)?.eq('merchant_id', merchantId)?.single();

    if (error || !withdrawal) {
      return res?.status(404)?.json({
        success: false,
        error: 'Withdrawal not found',
        code: 'WITHDRAWAL_NOT_FOUND'
      });
    }

    res?.json({
      success: true,
      data: withdrawal
    });

  } catch (error) {
    console.error('Get withdrawal error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/withdrawals/history - Get withdrawal history with pagination
router?.get('/history', async (req, res) => {
  try {
    const merchantId = req?.user?.merchantId;
    const { page = 1, limit = 20, status, currency, from_date, to_date } = req?.query;

    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));

    let query = supabaseClient?.from('withdrawals')?.select('*', { count: 'exact' })?.eq('merchant_id', merchantId)?.order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query?.eq('status', status);
    }

    if (currency) {
      query = query?.eq('currency', currency?.toUpperCase());
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

    const { data: withdrawals, error, count } = await query;

    if (error) {
      console.error('Withdrawal history error:', error);
      return res?.status(500)?.json({
        success: false,
        error: 'Failed to fetch withdrawal history',
        code: 'DATABASE_ERROR',
        details: error?.message
      });
    }

    res?.json({
      success: true,
      data: withdrawals || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        pages: Math.ceil((count || 0) / limitNum)
      }
    });

  } catch (error) {
    console.error('Withdrawal history error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;