const { supabaseClient } = require('../utils/supabaseClient');

/**
 * ▶ 5.1 — BACKEND / API QA: Fixed authentication middleware with proper JWT validation
 * Ensuring proper Supabase JWT validation and role-based access control
 */

/**
 * Extract and validate Supabase JWT token
 */
async function extractAndValidateToken(req, res, returnUser = false) {
  try {
    const authHeader = req?.headers?.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return { valid: false, error: 'Missing or invalid authorization header' };
    }

    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return { valid: false, error: 'No token provided' };
    }

    // Verify JWT token with Supabase
    const { data: userData, error: userError } = await supabaseClient?.auth?.getUser(token);

    if (userError || !userData?.user) {
      return { valid: false, error: 'Invalid or expired token' };
    }

    if (returnUser) {
      return { valid: true, user: userData?.user };
    }

    return { valid: true };

  } catch (error) {
    console.error('🚨 Token validation error:', error);
    return { valid: false, error: 'Token validation failed' };
  }
}

/**
 * Get merchant data for authenticated user
 */
async function getMerchantData(userId) {
  try {
    const { data: merchant, error } = await supabaseClient?.from('merchants')?.select('*')?.eq('user_id', userId)?.single();

    if (error || !merchant) {
      return null;
    }

    return merchant;
  } catch (error) {
    console.error('🚨 Merchant fetch error:', error);
    return null;
  }
}

/**
 * Get user profile data
 */
async function getUserProfile(userId) {
  try {
    const { data: profile, error } = await supabaseClient?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();

    if (error || !profile) {
      return null;
    }

    return profile;
  } catch (error) {
    console.error('🚨 Profile fetch error:', error);
    return null;
  }
}

/**
 * Authentication middleware - Validates JWT token
 */
async function authMiddleware(req, res, next) {
  try {
    const { valid, error, user } = await extractAndValidateToken(req, res, true);

    if (!valid) {
      return res?.status(401)?.json({
        success: false,
        error: error || 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Get user profile
    const profile = await getUserProfile(user?.id);
    
    if (!profile) {
      return res?.status(404)?.json({
        success: false,
        error: 'User profile not found',
        code: 'PROFILE_NOT_FOUND'
      });
    }

    // Attach user data to request
    req.user = {
      id: user?.id,
      email: user?.email,
      profile: profile
    };

    next();

  } catch (error) {
    console.error('🚨 Auth middleware error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Authentication error',
      code: 'AUTH_ERROR'
    });
  }
}

/**
 * Optional authentication middleware - Validates token if present
 */
async function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req?.headers?.authorization;
    
    if (!authHeader) {
      // No authentication provided, continue without user data
      req.user = null;
      return next();
    }

    const { valid, user } = await extractAndValidateToken(req, res, true);

    if (valid && user) {
      const profile = await getUserProfile(user?.id);
      
      if (profile) {
        req.user = {
          id: user?.id,
          email: user?.email,
          profile: profile
        };
      }
    }

    next();

  } catch (error) {
    console.error('🚨 Optional auth middleware error:', error);
    // Don't fail the request, just continue without user data
    req.user = null;
    next();
  }
}

/**
 * Merchant middleware - Ensures user is a merchant and loads merchant data
 */
async function merchantMiddleware(req, res, next) {
  try {
    if (!req?.user) {
      return res?.status(401)?.json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Check if user is a merchant
    if (req?.user?.profile?.role !== 'merchant') {
      return res?.status(403)?.json({
        success: false,
        error: 'Merchant access required',
        code: 'MERCHANT_ACCESS_REQUIRED'
      });
    }

    // Get merchant data
    const merchant = await getMerchantData(req?.user?.id);
    
    if (!merchant) {
      return res?.status(404)?.json({
        success: false,
        error: 'Merchant account not found',
        code: 'MERCHANT_NOT_FOUND'
      });
    }

    // Check merchant status
    if (merchant?.status === 'suspended') {
      return res?.status(403)?.json({
        success: false,
        error: 'Merchant account suspended',
        code: 'MERCHANT_SUSPENDED'
      });
    }

    // Attach merchant data to request
    req.user.merchant = merchant;
    req.user.merchantId = merchant?.id;

    next();

  } catch (error) {
    console.error('🚨 Merchant middleware error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Merchant validation error',
      code: 'MERCHANT_ERROR'
    });
  }
}

/**
 * Admin middleware - Ensures user has admin role
 */
async function adminMiddleware(req, res, next) {
  try {
    if (!req?.user) {
      return res?.status(401)?.json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Check if user is an admin
    if (req?.user?.profile?.role !== 'admin') {
      return res?.status(403)?.json({
        success: false,
        error: 'Admin access required',
        code: 'ADMIN_ACCESS_REQUIRED'
      });
    }

    next();

  } catch (error) {
    console.error('🚨 Admin middleware error:', error);
    res?.status(500)?.json({
      success: false,
      error: 'Admin validation error',
      code: 'ADMIN_ERROR'
    });
  }
}

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  merchantMiddleware,
  adminMiddleware
};