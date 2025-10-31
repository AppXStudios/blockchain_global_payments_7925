# ✅ PART 3 - CREATE /docs/DEPLOYMENT.md
# Blockchain Global Payments — Deployment Guide

## 🚀 Production Deployment Checklist

### 1. Environment Variables Configuration

**Required Environment Variables:**

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# API Configuration
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# NOWPayments Configuration
NOWPAYMENTS_BASE_URL=https://api.nowpayments.io/v1
NOWPAYMENTS_MASTER_API_KEY=your-api-key
NOWPAYMENTS_IPN_SECRET=your-ipn-secret
NOWPAYMENTS_WEBHOOK_URL=https://your-domain.com/api/webhooks/nowpayments

# Security Configuration
JWT_SECRET=your-strong-jwt-secret-256-bits
ENCRYPTION_KEY=your-encryption-key-256-bits

# Platform Configuration
PLATFORM_NAME=Blockchain Global Payments LLC

# Service Integrations
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_FROM_NUMBER=your-twilio-number
```

### 2. Vercel Deployment Setup

**Step-by-Step Vercel Deployment:**

1. **Import GitHub Repository**
   - Connect your GitHub account to Vercel
   - Import the `blockchain_global_payments_7925` repository
   - Set "main" as the production branch

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`
   - Node.js Version: 18.x

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required environment variables from section 1
   - Set Environment: Production, Preview, Development as needed

4. **Enable Functions**
   - API routes are automatically handled by Vercel
   - `/api/server.js` mapped via `vercel.json`
   - Ensure serverless Node.js runtime

### 3. Supabase Database Setup

**Database Configuration Checklist:**

1. **Tables Verification**
   - ✅ `users` table exists
   - ✅ `user_profiles` table exists  
   - ✅ `merchants` table exists
   - ✅ `payments` table exists
   - ✅ `invoices` table exists
   - ✅ `withdrawals` table exists
   - ✅ `payment_links` table exists
   - ✅ `webhook_events` table exists

2. **RLS Policies**
   - ✅ Row Level Security enabled where appropriate
   - ✅ Authentication policies configured
   - ✅ Merchant isolation policies active

3. **API Permissions**
   - ✅ Service role key has full access
   - ✅ Anon key has limited public access only
   - ✅ Database functions accessible

### 4. NOWPayments Integration Setup

**NOWPayments Configuration:**

1. **API Key Setup**
   - Generate production API key in NOWPayments dashboard
   - Add to `NOWPAYMENTS_MASTER_API_KEY` environment variable

2. **IPN Configuration**
   - Set IPN URL: `https://your-domain.com/api/webhooks/nowpayments`
   - Generate IPN secret and add to `NOWPAYMENTS_IPN_SECRET`
   - Enable HMAC-SHA512 signature verification

3. **Test Webhook Integration**
   ```bash
   # Test webhook endpoint
   curl -X POST https://your-domain.com/api/webhooks/nowpayments \
     -H "Content-Type: application/json" \
     -H "x-nowpayments-sig: test-signature" \
     -d '{"payment_id": "test", "payment_status": "finished"}'
   ```

4. **Payment Flow Testing**
   - ✅ Create test payment
   - ✅ Verify invoice generation
   - ✅ Test payment link creation
   - ✅ Confirm webhook receipt

### 5. Security & Performance Verification

**Security Checklist:**

1. **Headers & CSP**
   - ✅ Security headers configured in `next.config.js`
   - ✅ Content Security Policy active
   - ✅ HSTS enabled for HTTPS

2. **API Security**
   - ✅ CORS configured for production domains
   - ✅ Rate limiting implemented
   - ✅ Input validation active
   - ✅ JWT authentication working

3. **Data Protection**
   - ✅ No secrets in client-side code
   - ✅ Webhook signature verification
   - ✅ Database queries sanitized

**Performance Optimization:**

1. **Build Optimization**
   - ✅ SWC minification enabled
   - ✅ Image optimization configured
   - ✅ Bundle size optimized

2. **Caching Strategy**
   - ✅ Static assets CDN cached
   - ✅ API responses cached appropriately
   - ✅ Database query optimization

### 6. Monitoring & Logging

**Production Monitoring Setup:**

1. **Error Tracking**
   - Configure error logging service
   - Set up real-time alerts
   - Monitor API response times

2. **Payment Monitoring**
   - Track payment success rates
   - Monitor webhook delivery
   - Alert on failed transactions

3. **System Health**
   - `/api/health` endpoint monitoring
   - Database connection health
   - Third-party service status

### 7. CI/CD Pipeline

**GitHub Actions Workflow:**

1. **Automated Deployment**
   - Push to `main` branch triggers deployment
   - Automatic Vercel deployment on merge

2. **Branch Protection**
   - Protect `main` branch from force pushes
   - Require pull request reviews
   - Run tests before merge

3. **Environment Management**
   - Never commit `.env.local` files
   - Use Vercel environment variables
   - Separate staging/production configs

### 8. Domain & SSL Configuration

**Custom Domain Setup:**

1. **Domain Configuration**
   - Add custom domain in Vercel dashboard
   - Configure DNS records (A/CNAME)
   - Verify domain ownership

2. **SSL Certificate**
   - Automatic SSL via Vercel/Let's Encrypt
   - Force HTTPS redirect
   - Configure HSTS headers

3. **API URL Updates**
   - Update `NEXT_PUBLIC_API_URL` to production domain
   - Update NOWPayments webhook URL
   - Test all API endpoints

### 9. Go-Live Checklist

**Final Pre-Launch Verification:**

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Payment integration tested
- [ ] Webhook endpoints verified
- [ ] SSL certificate active
- [ ] Monitoring systems active
- [ ] Error tracking configured
- [ ] Performance optimized
- [ ] Security headers active
- [ ] API documentation updated

### 10. Post-Deployment Tasks

**After Successful Deployment:**

1. **Functional Testing**
   - Test user registration/login
   - Create test payment/invoice
   - Verify webhook delivery
   - Test all user flows

2. **Performance Monitoring**
   - Monitor initial traffic patterns
   - Check API response times
   - Verify database performance

3. **Support Preparation**
   - Update documentation
   - Train support team
   - Prepare troubleshooting guides

---

## 🆘 Troubleshooting Common Issues

### Build Errors
- **TypeScript errors**: Check SDK imports in `lib/sdk/api.ts`
- **Missing dependencies**: Run `npm ci` to clean install
- **Environment variables**: Verify all required vars set

### Runtime Errors
- **Database connection**: Check Supabase credentials
- **API failures**: Verify `NEXT_PUBLIC_API_URL` format
- **Webhook issues**: Test signature verification

### Performance Issues
- **Slow API**: Check database indexes
- **High memory**: Optimize React components
- **Timeout errors**: Increase Vercel function timeout

---

## 📞 Support Contacts

- **Technical Issues**: Check GitHub Issues
- **NOWPayments Support**: [NOWPayments Documentation](https://documenter.getpostman.com/view/7907941/S1a32n38)
- **Vercel Support**: [Vercel Documentation](https://vercel.com/docs)
- **Supabase Support**: [Supabase Documentation](https://supabase.com/docs)

---

**Last Updated**: January 31, 2025  
**Version**: 1.0.0  
**Platform**: Blockchain Global Payments LLC