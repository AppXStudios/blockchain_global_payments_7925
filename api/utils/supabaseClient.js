const { createClient } = require('@supabase/supabase-js');

/**
 * ▶ 5.1 — BACKEND / API QA: Fixed Supabase client with service role for server operations
 * Ensuring no server secrets are referenced in client bundles
 */

// Environment validation
function validateEnvironment() {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'SUPABASE_SERVICE_KEY'  // Server-only service role key
  ];

  const missing = requiredVars?.filter(varName => !process.env[varName]);
  
  if (missing?.length > 0) {
    throw new Error(`Missing required environment variables: ${missing?.join(', ')}`);
  }

  return {
    url: process.env.VITE_SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY  // Service role for server operations
  };
}

// Initialize Supabase client with service role key (server-side only)
let supabaseClient;

try {
  const { url, serviceKey } = validateEnvironment();
  
  supabaseClient = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('✅ Supabase client initialized with service role');

} catch (error) {
  console.error('🚨 Failed to initialize Supabase client:', error?.message);
  process.exit(1);
}

module.exports = {
  supabaseClient
};