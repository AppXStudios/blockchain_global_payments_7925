const express = require('express');
const router = express?.Router();
const { supabaseClient } = require('../utils/supabaseClient');

/**
 * ▶ 5.1 — BACKEND / API QA: Fixed auth routes with proper Supabase integration
 * Ensuring all routes exist and match SDK paths with consistent JSON response shapes
 */

/**
 * POST /api/auth/signup - Register new merchant account
 * Fixed to use correct database column names from schema
 */
router?.post('/signup', async (req, res) => {
  try {
    const { email, password, full_name, business_name, business_email, business_phone, website_url } = req?.body;

    // Input validation
    if (!email || !password || !full_name || !business_name) {
      return res?.status(400)?.json({
        success: false,
        error: 'Missing required fields',
        code: 'VALIDATION_ERROR',
        details: {
          required: ['email', 'password', 'full_name', 'business_name']
        }
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex?.test(email)) {
      return res?.status(400)?.json({
        success: false,
        error: 'Invalid email format',
        code: 'INVALID_EMAIL'
      });
    }

    // Password strength validation
    if (password?.length < 8) {
      return res?.status(400)?.json({
        success: false,
        error: 'Password must be at least 8 characters long',
        code: 'WEAK_PASSWORD'
      });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseClient?.auth?.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          business_name
        }
      }
    });

    if (authError) {
      console.error('🚨 Supabase auth signup error:', authError);
      return res?.status(400)?.json({
        success: false,
        error: authError?.message,
        code: 'AUTH_ERROR'
      });
    }

    if (!authData?.user) {
      return res?.status(400)?.json({
        success: false,
        error: 'Failed to create user account',
        code: 'USER_CREATION_FAILED'
      });
    }

    // Create user profile using exact schema column names
    const { data: profileData, error: profileError } = await supabaseClient?.from('user_profiles')?.insert({
        id: authData?.user?.id,
        email: email,
        full_name: full_name,
        phone: business_phone || null,
        role: 'merchant'
      })?.select()?.single();

    if (profileError) {
      console.error('🚨 Profile creation error:', profileError);
      return res?.status(500)?.json({
        success: false,
        error: 'Failed to create user profile',
        code: 'PROFILE_CREATION_FAILED'
      });
    }

    // Create merchant record using exact schema column names
    const { data: merchantData, error: merchantError } = await supabaseClient?.from('merchants')?.insert({
        user_id: authData?.user?.id,
        business_name: business_name,
        business_email: business_email || email,
        business_phone: business_phone || null,
        website_url: website_url || null,
        status: 'pending'
      })?.select()?.single();

    if (merchantError) {
      console.error('🚨 Merchant creation error:', merchantError);
      return res?.status(500)?.json({
        success: false,
        error: 'Failed to create merchant account',
        code: 'MERCHANT_CREATION_FAILED'
      });
    }

    // Return structured response matching SDK expectations
    res?.status(201)?.json({
      success: true,
      data: {
        user: {
          id: authData?.user?.id,
          email: authData?.user?.email,
          created_at: authData?.user?.created_at
        },
        profile: profileData,
        merchant: merchantData,
        session: authData?.session
      },
      message: 'Account created successfully'
    });

  } catch (error) {
    console.error('🚨 Signup error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /api/auth/login - Authenticate merchant
 * Fixed to include proper merchant data fetching with schema-aware queries
 */
router?.post('/login', async (req, res) => {
  try {
    const { email, password } = req?.body;

    // Input validation
    if (!email || !password) {
      return res?.status(400)?.json({
        success: false,
        error: 'Email and password are required',
        code: 'VALIDATION_ERROR'
      });
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabaseClient?.auth?.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('🚨 Login error:', authError);
      return res?.status(401)?.json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    if (!authData?.user || !authData?.session) {
      return res?.status(401)?.json({
        success: false,
        error: 'Authentication failed',
        code: 'AUTH_FAILED'
      });
    }

    // Fetch user profile with schema-aware query
    const { data: profileData, error: profileError } = await supabaseClient?.from('user_profiles')?.select('*')?.eq('id', authData?.user?.id)?.single();

    if (profileError) {
      console.error('🚨 Profile fetch error:', profileError);
      return res?.status(404)?.json({
        success: false,
        error: 'User profile not found',
        code: 'PROFILE_NOT_FOUND'
      });
    }

    // Fetch merchant data if user is a merchant
    let merchantData = null;
    if (profileData?.role === 'merchant') {
      const { data: merchant, error: merchantError } = await supabaseClient?.from('merchants')?.select('*')?.eq('user_id', authData?.user?.id)?.single();

      if (merchantError) {
        console.error('🚨 Merchant fetch error:', merchantError);
      } else {
        merchantData = merchant;
      }
    }

    // Return structured response matching SDK expectations
    res?.json({
      success: true,
      data: {
        user: {
          id: authData?.user?.id,
          email: authData?.user?.email,
          created_at: authData?.user?.created_at
        },
        profile: profileData,
        merchant: merchantData,
        session: authData?.session
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('🚨 Login error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/auth/me - Get current user profile
 * Fixed with proper JWT validation and complete user data fetching
 */
router?.get('/me', async (req, res) => {
  try {
    const token = req?.headers?.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res?.status(401)?.json({
        success: false,
        error: 'Authorization token required',
        code: 'TOKEN_REQUIRED'
      });
    }

    // Verify JWT token with Supabase
    const { data: userData, error: userError } = await supabaseClient?.auth?.getUser(token);

    if (userError || !userData?.user) {
      return res?.status(401)?.json({
        success: false,
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
    }

    // Fetch user profile
    const { data: profileData, error: profileError } = await supabaseClient?.from('user_profiles')?.select('*')?.eq('id', userData?.user?.id)?.single();

    if (profileError) {
      console.error('🚨 Profile fetch error:', profileError);
      return res?.status(404)?.json({
        success: false,
        error: 'User profile not found',
        code: 'PROFILE_NOT_FOUND'
      });
    }

    // Fetch merchant data if user is a merchant
    let merchantData = null;
    let balanceData = [];

    if (profileData?.role === 'merchant') {
      // Get merchant info
      const { data: merchant, error: merchantError } = await supabaseClient?.from('merchants')?.select('*')?.eq('user_id', userData?.user?.id)?.single();

      if (merchantError) {
        console.error('🚨 Merchant fetch error:', merchantError);
      } else {
        merchantData = merchant;
        
        // Get custody account balance if merchant exists
        if (merchant) {
          const { data: balances, error: balanceError } = await supabaseClient?.from('custody_accounts')?.select('*')?.eq('merchant_id', merchant?.id);

          if (!balanceError && balances) {
            balanceData = balances;
          }
        }
      }
    }

    // Return structured response matching SDK expectations
    res?.json({
      success: true,
      data: {
        user: {
          id: userData?.user?.id,
          email: userData?.user?.email,
          created_at: userData?.user?.created_at
        },
        profile: profileData,
        merchant: merchantData,
        balance: balanceData
      }
    });

  } catch (error) {
    console.error('🚨 /me error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /api/auth/logout - Logout user
 * Fixed to handle Supabase session invalidation
 */
router?.post('/logout', async (req, res) => {
  try {
    const token = req?.headers?.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Sign out from Supabase
      const { error } = await supabaseClient?.auth?.signOut();
      
      if (error) {
        console.error('🚨 Logout error:', error);
      }
    }

    res?.json({
      success: true,
      data: {
        message: 'Logout successful'
      }
    });

  } catch (error) {
    console.error('🚨 Logout error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;