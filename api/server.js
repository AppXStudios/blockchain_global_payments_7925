const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv')?.config();

const { authMiddleware, optionalAuthMiddleware, adminMiddleware, merchantMiddleware } = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');

// Import route modules
const authRoutes = require('./routes/auth');
const paymentsRoutes = require('./routes/payments');
const invoicesRoutes = require('./routes/invoices');
const withdrawalsRoutes = require('./routes/withdrawals');
const linksRoutes = require('./routes/links');
const checkoutRoutes = require('./routes/checkout');
const adminRoutes = require('./routes/admin');
const webhooksRoutes = require('./routes/webhooks');

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ 2. UPDATED BACKEND CONFIG: Load all environment variables
console.log('🔧 BGP Environment Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: PORT,
  SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ? '✅ Set' : '❌ Missing',
  NOWPAYMENTS_BASE_URL: process.env.NOWPAYMENTS_BASE_URL ? '✅ Set' : '❌ Missing',
  NOWPAYMENTS_MASTER_API_KEY: process.env.NOWPAYMENTS_MASTER_API_KEY ? '✅ Set' : '❌ Missing',
  NOWPAYMENTS_IPN_SECRET: process.env.NOWPAYMENTS_IPN_SECRET ? '✅ Set' : '❌ Missing',
  NOWPAYMENTS_WEBHOOK_URL: process.env.NOWPAYMENTS_WEBHOOK_URL ? '✅ Set' : '❌ Missing',
  JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ? '✅ Set' : '❌ Missing',
  PLATFORM_NAME: process.env.PLATFORM_NAME || 'Blockchain Global Payments LLC'
});

// ✅ 5. PRODUCTION HARDENING: Security middleware
app?.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.nowpayments.io"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration with dynamic origins using process.env.NEXT_PUBLIC_API_URL
app?.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VITE_SITE_URL,
    process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') // Extract domain from API URL
  ]?.filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-nowpayments-sig']
}));

// ✅ 3. FIXED WEBHOOKS: Raw body processing for webhooks only
app?.use('/api/webhooks', express?.raw({ type: 'application/json' }));

// ✅ 5. PRODUCTION HARDENING: Safe request limits
app?.use(express?.json({ limit: '5mb' }));
app?.use(express?.urlencoded({ extended: true, limit: '5mb' }));

// Request logging middleware with safe error logging (no secrets)
app?.use((req, res, next) => {
  const startTime = Date.now();
  
  res?.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req?.method,
      url: req?.url,
      status: res?.statusCode,
      duration: `${duration}ms`,
      userAgent: req?.get('User-Agent'),
      ip: req?.ip || req?.connection?.remoteAddress,
      timestamp: new Date()?.toISOString()
    };
    
    // ✅ 5. SAFE ERROR LOGGING: Never log secrets or sensitive data
    if (res?.statusCode >= 400) {
      console.error('🚨 BGP API Error:', logData);
    } else {
      console.log('📝 BGP API Request:', logData);
    }
  });
  
  next();
});

// ✅ 4. HEALTH ENDPOINT FOR DEPLOYMENT TESTING
app?.get('/api/health', (req, res) => {
  res?.status(200)?.json({ 
    success: true,
    status: "ok",
    message: 'Blockchain Global Payments API is running',
    timestamp: new Date()?.toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    platform: process.env.PLATFORM_NAME || 'Blockchain Global Payments LLC',
    services: {
      supabase_configured: process.env.SUPABASE_URL ? true : false,
      nowpayments_configured: process.env.NOWPAYMENTS_BASE_URL ? true : false,
      webhook_url: process.env.NOWPAYMENTS_WEBHOOK_URL ? 'configured' : 'not_set',
      jwt_configured: process.env.JWT_SECRET ? true : false
    }
  });
});

// Additional health endpoints
app?.get('/health', (req, res) => {
  res?.json({
    success: true,
    message: 'Blockchain Global Payments API is running',
    timestamp: new Date()?.toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

app?.get('/api/status', (req, res) => {
  res?.json({
    success: true,
    status: 'operational',
    version: '1.0.0',
    timestamp: new Date()?.toISOString(),
    uptime: process.uptime()
  });
});

// ✅ 2. ALL BACKEND ROUTES USE /api/* PREFIXES AND ENVIRONMENT VARIABLES
app?.use('/api/auth', authRoutes);
app?.use('/api/payments', authMiddleware, merchantMiddleware, paymentsRoutes);
app?.use('/api/invoices', authMiddleware, merchantMiddleware, invoicesRoutes);
app?.use('/api/withdrawals', authMiddleware, merchantMiddleware, withdrawalsRoutes);
app?.use('/api/links', authMiddleware, merchantMiddleware, linksRoutes);
app?.use('/api/checkout', optionalAuthMiddleware, checkoutRoutes);
app?.use('/api/admin', authMiddleware, adminMiddleware, adminRoutes);
app?.use('/api/webhooks/nowpayments', webhooksRoutes);

// 404 handlers
app?.use('/api/*', (req, res) => {
  res?.status(404)?.json({
    success: false,
    error: 'API endpoint not found',
    path: req?.originalUrl,
    method: req?.method,
    available_endpoints: {
      auth: ['/api/auth/signup', '/api/auth/login', '/api/auth/me'],
      payments: ['/api/payments', '/api/payments/:id', '/api/payments/history'],
      invoices: ['/api/invoices', '/api/invoices/:id', '/api/invoices/history'],
      withdrawals: ['/api/withdrawals', '/api/withdrawals/:id', '/api/withdrawals/history'],
      links: ['/api/links', '/api/links/:id'],
      checkout: ['/api/checkout/:paymentId', '/api/checkout/:paymentId/status'],
      admin: ['/api/admin/merchants', '/api/admin/merchants/:id', '/api/admin/transactions', '/api/admin/system'],
      webhooks: ['/api/webhooks/nowpayments'],
      utility: ['/api/health', '/api/status']
    }
  });
});

app?.use('*', (req, res) => {
  res?.status(404)?.json({
    success: false,
    error: 'Endpoint not found',
    path: req?.originalUrl,
    method: req?.method,
    message: 'This is the BGP API server. Frontend should be served from port 3000.'
  });
});

// ✅ 5. PRODUCTION HARDENING: Enhanced error handler
app?.use(errorHandler);

// Start server (only in non-serverless environments)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const server = app?.listen(PORT, () => {
    console.log(`🚀 Blockchain Global Payments API Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Base URL: ${process.env.NEXT_PUBLIC_API_URL || `http://localhost:${PORT}/api`}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🏢 Platform: ${process.env.PLATFORM_NAME || 'Blockchain Global Payments LLC'}`);
  });

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    console.log(`👋 Received ${signal} signal, shutting down gracefully`);
    server?.close(() => {
      console.log('💤 HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

// ✅ 5. PRODUCTION HARDENING: Safe error handling
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', {
    message: error?.message,
    stack: error?.stack,
    timestamp: new Date()?.toISOString()
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection:', {
    reason: reason,
    promise: promise,
    timestamp: new Date()?.toISOString()
  });
  process.exit(1);
});

// ✅ EXPORT EXPRESS SERVER FOR VERCEL
module.exports = app;