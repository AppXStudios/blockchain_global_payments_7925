# Blockchain Global Payments — Deployment Guide

## 1. Environment Variables

List all required environment variables exactly as defined in .env.local:

### Core Supabase Configuration
```bash
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### API Configuration
```bash
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
```

### NOWPayments Integration
```bash
NOWPAYMENTS_BASE_URL=https://api.nowpayments.io/v1
NOWPAYMENTS_MASTER_API_KEY=your-nowpayments-api-key
NOWPAYMENTS_IPN_SECRET=your-nowpayments-ipn-secret
NOWPAYMENTS_WEBHOOK_URL=https://your-domain.vercel.app/api/webhooks/nowpayments
```

### Security Keys
```bash
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=your-encryption-key
```

### Platform Settings
```bash
PLATFORM_NAME=Blockchain Global Payments LLC
NODE_ENV=production
PORT=3001
```

### Optional Services
```bash
RESEND_API_KEY=your-resend-api-key
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_FROM_NUMBER=your-twilio-phone-number
```

## 2. Vercel Setup

1. **Import GitHub Repository**
   - Connect your GitHub account to Vercel
   - Import the BGP repository
   - Select "main" branch as default

2. **Add Environment Variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add ALL environment variables from above list
   - Ensure each variable is set for Production, Preview, and Development

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

4. **Serverless Configuration**
   - Enable serverless Node for server.js
   - Ensure /api routes forward to server.js
   - Max function duration: 30 seconds
   - Memory allocation: 1024 MB

## 3. Supabase Setup

### Database Requirements
- Confirm all required tables exist (merchants, payments, invoices, withdrawals, payment_links, webhook_events)
- Verify RLS policies are properly configured
- Ensure API permissions are correct for service role key

### Authentication Setup
- Enable Email/Password authentication
- Configure JWT settings to match your JWT_SECRET
- Set up proper redirect URLs for production domain

### Database Policies
- Review RLS policies for production security
- Ensure proper merchant isolation
- Verify admin access controls

## 4. NOWPayments Setup

### API Configuration
1. **Set IPN URL**
   ```
   https://your-domain.vercel.app/api/webhooks/nowpayments
   ```

2. **Add IPN Secret**
   - Generate secure IPN secret key
   - Add to NOWPAYMENTS_IPN_SECRET environment variable
   - Configure in NOWPayments dashboard

3. **Test Webhook Signature**
   - Verify HMAC-SHA512 signature validation
   - Test with sample webhook payloads
   - Monitor webhook logs for errors

4. **Payment Flow Testing**
   - Test payment creation
   - Verify invoice generation
   - Test payment link functionality
   - Confirm withdrawal processing

## 5. CI/CD Pipeline

### Automatic Deployment
- Push to `main` branch triggers production deployment
- Preview deployments for pull requests
- Automatic builds on code changes

### Security Measures
- **NEVER commit .env.local** to version control
- Use Vercel's environment variable system
- Protect main branch with required reviews
- Enable branch protection rules

### Monitoring
- Set up deployment notifications
- Monitor build logs for errors
- Configure error tracking (Sentry, LogRocket, etc.)

## 6. Production Checklist

### Pre-Deployment
- [ ] All environment variables configured in Vercel
- [ ] Supabase database schema deployed
- [ ] NOWPayments webhook URL configured
- [ ] SSL certificates validated
- [ ] Custom domain configured (if applicable)

### Post-Deployment
- [ ] Health endpoint responding: `/api/health`
- [ ] Authentication flow working
- [ ] Payment creation successful
- [ ] Webhook processing functional
- [ ] Database connections stable

### Testing
- [ ] Complete user registration flow
- [ ] Payment processing end-to-end
- [ ] Invoice generation and payment
- [ ] Withdrawal functionality
- [ ] Admin panel access
- [ ] Error handling and logging

## 7. Troubleshooting

### Common Issues
1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies installed
   - Review build logs for missing modules

2. **API Connection Issues**
   - Validate NEXT_PUBLIC_API_URL format
   - Check CORS configuration
   - Verify Vercel function routing

3. **Database Errors**
   - Confirm Supabase credentials
   - Check RLS policy configurations
   - Verify table schemas match code

### Support Resources
- Vercel Documentation: https://vercel.com/docs
- Supabase Documentation: https://supabase.com/docs
- NOWPayments API: https://documenter.getpostman.com/view/7907941/S1a32n38

## 8. Maintenance

### Regular Tasks
- Monitor webhook success rates
- Review error logs weekly
- Update dependencies monthly
- Backup database regularly

### Security Updates
- Rotate API keys quarterly
- Update Supabase policies as needed
- Review access logs monthly
- Audit user permissions regularly