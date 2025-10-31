const express = require('express');
const { supabaseClient } = require('../utils/supabaseClient');
const router = express?.Router();

/**
 * ▶ 5.1 — BACKEND / API QA: Fixed checkout routes for public-facing payment processing
 * Routes accessible without authentication for public checkout flows
 */

// GET /api/checkout/:id - Get checkout payment details (public)
router?.get('/:id', async (req, res) => {
  try {
    const { id } = req?.params;

    // Validate payment ID format (UUID or payment_id string)
    if (!id || id?.length < 10) {
      return res?.status(400)?.json({
        success: false,
        error: 'Invalid payment identifier',
        code: 'INVALID_ID'
      });
    }

    let payment = null;

    // Check if it's a UUID (payment by internal ID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex?.test(id)) {
      const { data, error } = await supabaseClient?.from('payments')?.select(`
          *,
          merchants (
            business_name,
            business_email
          )
        `)?.eq('id', id)?.single();

      if (!error && data) {
        payment = data;
      }
    } else {
      // Check by payment_id (NOWPayments ID)
      const { data, error } = await supabaseClient?.from('payments')?.select(`
          *,
          merchants (
            business_name,
            business_email
          )
        `)?.eq('payment_id', id)?.single();

      if (!error && data) {
        payment = data;
      }
    }

    if (!payment) {
      return res?.status(404)?.json({
        success: false,
        error: 'Payment not found',
        code: 'PAYMENT_NOT_FOUND'
      });
    }

    // Return only public-safe payment data
    res?.json({
      success: true,
      data: {
        id: payment?.id,
        payment_id: payment?.payment_id,
        price_amount: payment?.price_amount,
        price_currency: payment?.price_currency,
        pay_amount: payment?.pay_amount,
        pay_currency: payment?.pay_currency,
        pay_address: payment?.pay_address,
        payin_extra_id: payment?.payin_extra_id,
        status: payment?.status,
        created_at: payment?.created_at,
        valid_until: payment?.valid_until,
        expiration_estimate_date: payment?.expiration_estimate_date,
        merchant: {
          business_name: payment?.merchants?.business_name,
          business_email: payment?.merchants?.business_email
        }
      }
    });

  } catch (error) {
    console.error('Checkout payment fetch error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/checkout/:id/status - Get checkout payment status (public)
router?.get('/:id/status', async (req, res) => {
  try {
    const { id } = req?.params;

    // Validate payment ID format
    if (!id || id?.length < 10) {
      return res?.status(400)?.json({
        success: false,
        error: 'Invalid payment identifier',
        code: 'INVALID_ID'
      });
    }

    let payment = null;

    // Check if it's a UUID or payment_id
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex?.test(id)) {
      const { data, error } = await supabaseClient?.from('payments')?.select('id, payment_id, status, actually_paid, pay_amount, created_at, updated_at')?.eq('id', id)?.single();

      if (!error && data) {
        payment = data;
      }
    } else {
      const { data, error } = await supabaseClient?.from('payments')?.select('id, payment_id, status, actually_paid, pay_amount, created_at, updated_at')?.eq('payment_id', id)?.single();

      if (!error && data) {
        payment = data;
      }
    }

    if (!payment) {
      return res?.status(404)?.json({
        success: false,
        error: 'Payment not found',
        code: 'PAYMENT_NOT_FOUND'
      });
    }

    // Return status information
    res?.json({
      success: true,
      data: {
        status: payment?.status,
        payment: {
          id: payment?.id,
          payment_id: payment?.payment_id,
          status: payment?.status,
          actually_paid: payment?.actually_paid,
          pay_amount: payment?.pay_amount,
          created_at: payment?.created_at,
          updated_at: payment?.updated_at
        }
      }
    });

  } catch (error) {
    console.error('Checkout status fetch error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;