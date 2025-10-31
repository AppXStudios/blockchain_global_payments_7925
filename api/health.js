/**
 * ✅ 9. CREATE /api/health ROUTE FOR DEPLOYMENT TESTING
 */

export default function handler(req, res) {
  res?.status(200)?.json({ 
    success: true,
    status: "ok",
    message: 'Blockchain Global Payments API is running',
    timestamp: new Date()?.toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    platform: process.env.PLATFORM_NAME || 'Blockchain Global Payments LLC',
    config: {
      supabase_configured: process.env.SUPABASE_URL ? true : false,
      nowpayments_configured: process.env.NOWPAYMENTS_BASE_URL ? true : false,
      webhook_url: process.env.NOWPAYMENTS_WEBHOOK_URL ? 'configured' : 'not_set'
    }
  });
}