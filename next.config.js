/** @type {import('next').NextConfig} */

// ✅ 5. PRODUCTION HARDENING: Security headers configuration
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin" },
  { key: "Permissions-Policy", value: "accelerometer=(), camera=(), microphone=()" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }
];

const nextConfig = {
  // ✅ 5. SECURITY HEADERS: Apply to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      }
    ];
  },

  // Experimental features
  experimental: {
    serverActions: true
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    PLATFORM_NAME: process.env.PLATFORM_NAME || 'Blockchain Global Payments LLC'
  },

  // ✅ 4. VERCEL BUILD CONFIG: Ensure backend server.js is not overridden
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ];
  },

  // Optimize for production
  swcMinify: true,
  compress: true,
  
  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif']
  },

  // Performance optimizations
  poweredByHeader: false,
  generateEtags: false,

  // Build output configuration
  distDir: '.next',
  cleanDistDir: true
};

module.exports = nextConfig;