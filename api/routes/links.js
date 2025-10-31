const express = require('express');
const { supabaseClient } = require('../utils/supabaseClient');
const router = express?.Router();

/**
 * ▶ 5.1 — BACKEND / API QA: Fixed payment links routes with schema alignment
 * All routes match SDK paths with consistent JSON response shapes
 */

// POST /api/links - Create payment link
router?.post('/', async (req, res) => {
  try {
    const merchantId = req?.user?.merchantId;
    const {
      title,
      description,
      price_amount,
      price_currency = 'USD',
      pay_currency,
      success_url,
      cancel_url,
      max_uses,
      expires_at
    } = req?.body;

    // Validate required fields
    if (!title || !price_amount || !price_currency) {
      return res?.status(400)?.json({
        success: false,
        error: 'title, price_amount, and price_currency are required',
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

    // Generate unique link URL
    const linkSlug = `${title?.toLowerCase()?.replace(/[^a-z0-9]/g, '-')?.substring(0, 20)}-${Math.random()?.toString(36)?.substring(2, 8)}`;
    const linkUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/pay/${linkSlug}`;

    // Create payment link using exact schema column names
    const { data: link, error: dbError } = await supabaseClient?.from('payment_links')?.insert({
      merchant_id: merchantId,
      title: title,
      description: description || null,
      price_amount: priceAmount,
      price_currency: price_currency?.toUpperCase(),
      pay_currency: pay_currency?.toUpperCase() || null,
      link_url: linkUrl,
      success_url: success_url || null,
      cancel_url: cancel_url || null,
      max_uses: max_uses ? parseInt(max_uses) : null,
      expires_at: expires_at || null,
      is_active: true,
      usage_count: 0
    })?.select()?.single();

    if (dbError) {
      console.error('Payment link creation error:', dbError);
      return res?.status(500)?.json({
        success: false,
        error: 'Failed to create payment link',
        code: 'DATABASE_ERROR',
        details: dbError?.message
      });
    }

    res?.status(201)?.json({
      success: true,
      data: link,
      message: 'Payment link created successfully'
    });

  } catch (error) {
    console.error('Create payment link error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/links - Get all payment links with pagination
router?.get('/', async (req, res) => {
  try {
    const merchantId = req?.user?.merchantId;
    const { page = 1, limit = 20, is_active, search } = req?.query;

    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));

    let query = supabaseClient?.from('payment_links')?.select('*', { count: 'exact' })?.eq('merchant_id', merchantId)?.order('created_at', { ascending: false });

    // Apply filters
    if (is_active !== undefined) {
      query = query?.eq('is_active', is_active === 'true');
    }

    if (search) {
      query = query?.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply pagination
    const offset = (pageNum - 1) * limitNum;
    query = query?.range(offset, offset + limitNum - 1);

    const { data: links, error, count } = await query;

    if (error) {
      console.error('Payment links fetch error:', error);
      return res?.status(500)?.json({
        success: false,
        error: 'Failed to fetch payment links',
        code: 'DATABASE_ERROR',
        details: error?.message
      });
    }

    res?.json({
      success: true,
      data: links || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        pages: Math.ceil((count || 0) / limitNum)
      }
    });

  } catch (error) {
    console.error('Payment links fetch error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/links/:id - Get payment link by ID
router?.get('/:id', async (req, res) => {
  try {
    const merchantId = req?.user?.merchantId;
    const { id } = req?.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex?.test(id)) {
      return res?.status(400)?.json({
        success: false,
        error: 'Invalid payment link ID format',
        code: 'INVALID_ID_FORMAT'
      });
    }

    const { data: link, error } = await supabaseClient?.from('payment_links')?.select('*')?.eq('id', id)?.eq('merchant_id', merchantId)?.single();

    if (error || !link) {
      return res?.status(404)?.json({
        success: false,
        error: 'Payment link not found',
        code: 'LINK_NOT_FOUND'
      });
    }

    res?.json({
      success: true,
      data: link
    });

  } catch (error) {
    console.error('Get payment link error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// PUT /api/links/:id - Update payment link
router?.put('/:id', async (req, res) => {
  try {
    const merchantId = req?.user?.merchantId;
    const { id } = req?.params;
    const {
      title,
      description,
      price_amount,
      price_currency,
      pay_currency,
      success_url,
      cancel_url,
      max_uses,
      expires_at,
      is_active
    } = req?.body;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex?.test(id)) {
      return res?.status(400)?.json({
        success: false,
        error: 'Invalid payment link ID format',
        code: 'INVALID_ID_FORMAT'
      });
    }

    // Prepare update data
    const updateData = { updated_at: new Date()?.toISOString() };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price_amount !== undefined) {
      const priceAmount = parseFloat(price_amount);
      if (isNaN(priceAmount) || priceAmount <= 0) {
        return res?.status(400)?.json({
          success: false,
          error: 'price_amount must be a positive number',
          code: 'INVALID_AMOUNT'
        });
      }
      updateData.price_amount = priceAmount;
    }
    if (price_currency !== undefined) updateData.price_currency = price_currency?.toUpperCase();
    if (pay_currency !== undefined) updateData.pay_currency = pay_currency?.toUpperCase();
    if (success_url !== undefined) updateData.success_url = success_url;
    if (cancel_url !== undefined) updateData.cancel_url = cancel_url;
    if (max_uses !== undefined) updateData.max_uses = max_uses ? parseInt(max_uses) : null;
    if (expires_at !== undefined) updateData.expires_at = expires_at;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data: link, error } = await supabaseClient?.from('payment_links')?.update(updateData)?.eq('id', id)?.eq('merchant_id', merchantId)?.select()?.single();

    if (error) {
      console.error('Payment link update error:', error);
      return res?.status(500)?.json({
        success: false,
        error: 'Failed to update payment link',
        code: 'DATABASE_ERROR',
        details: error?.message
      });
    }

    if (!link) {
      return res?.status(404)?.json({
        success: false,
        error: 'Payment link not found',
        code: 'LINK_NOT_FOUND'
      });
    }

    res?.json({
      success: true,
      data: link,
      message: 'Payment link updated successfully'
    });

  } catch (error) {
    console.error('Update payment link error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// DELETE /api/links/:id - Delete payment link
router?.delete('/:id', async (req, res) => {
  try {
    const merchantId = req?.user?.merchantId;
    const { id } = req?.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex?.test(id)) {
      return res?.status(400)?.json({
        success: false,
        error: 'Invalid payment link ID format',
        code: 'INVALID_ID_FORMAT'
      });
    }

    const { error } = await supabaseClient?.from('payment_links')?.delete()?.eq('id', id)?.eq('merchant_id', merchantId);

    if (error) {
      console.error('Payment link deletion error:', error);
      return res?.status(500)?.json({
        success: false,
        error: 'Failed to delete payment link',
        code: 'DATABASE_ERROR',
        details: error?.message
      });
    }

    res?.json({
      success: true,
      data: { message: 'Payment link deleted successfully' }
    });

  } catch (error) {
    console.error('Delete payment link error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;