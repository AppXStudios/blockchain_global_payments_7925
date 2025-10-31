# Blockchain Global Payments (BGP) Platform

A comprehensive cryptocurrency payment processing platform built with React, Express.js, Supabase, and NOWPayments integration.

## 🚀 Features

### Frontend (React + Vite)
- **Modern React Architecture**: Functional components with hooks
- **Authentication System**: Complete signup/login with Supabase Auth
- **Payment Management**: Create and track cryptocurrency payments
- **Invoice System**: Generate and manage payment invoices
- **Withdrawal Management**: Handle cryptocurrency withdrawals
- **Payment Links**: Create shareable payment links
- **Hosted Checkout**: Public payment pages for customers
- **Admin Dashboard**: System monitoring and merchant management
- **Real-time Updates**: Live payment status updates
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### Backend (Express.js API)
- **NOWPayments Integration**: Complete custody API implementation
- **Supabase Database**: PostgreSQL with Row Level Security
- **Email Notifications**: Resend integration for transactional emails
- **SMS Alerts**: Twilio integration for important notifications
- **Webhook Processing**: Secure IPN handling with HMAC verification
- **JWT Authentication**: Secure API access with Supabase tokens
- **RESTful API**: Clean, documented API endpoints
- **Error Handling**: Comprehensive error management

## 🏗️ Architecture

```
BGP Platform
├── Frontend (React/Vite)
│   ├── Authentication & User Management
│   ├── Payment Processing Interface
│   ├── Merchant Dashboard
│   ├── Admin Panel
│   └── Hosted Checkout Pages
│
├── Backend (Express.js API)
│   ├── Auth Routes (/auth)
│   ├── Payment Routes (/payments)
│   ├── Invoice Routes (/invoices)
│   ├── Withdrawal Routes (/withdrawals)
│   ├── Payment Links (/links)
│   ├── Checkout Routes (/checkout)
│   ├── Admin Routes (/admin)
│   └── Webhook Routes (/webhooks)
│
├── Database (Supabase/PostgreSQL)
│   ├── User Management
│   ├── Merchant Accounts
│   ├── Payment Tracking
│   ├── Transaction History
│   └── Webhook Logs
│
└── External Integrations
    ├── NOWPayments (Crypto Processing)
    ├── Resend (Email Service)
    └── Twilio (SMS Service)
```

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- NOWPayments account
- Resend account (optional)
- Twilio account (optional)

### Frontend Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
```bash
# Required
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:3001/api
```

3. **Start development server**:
```bash
npm start
```

### Backend Setup

1. **Navigate to API directory**:
```bash
cd api
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
```bash
# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret

# NOWPayments
NOWPAYMENTS_API_KEY=your-nowpayments-api-key
NOWPAYMENTS_IPN_SECRET=your-ipn-secret
NOWPAYMENTS_BASE_URL=https://api.nowpayments.io

# Email & SMS (Optional)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=notifications@yourdomain.com
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_FROM_NUMBER=your-phone-number

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
PORT=3001
```

4. **Start API server**:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### Database Setup

1. **Create Supabase project** at [supabase.com](https://supabase.com)

2. **Run the migration**:
   - Copy the SQL from `supabase/migrations/20251031071315_create_bgp_schema.sql`
   - Execute in your Supabase SQL editor

3. **Verify tables created**:
   - Check that all tables, policies, and functions are created
   - Sample data should be inserted automatically

## 🔧 Configuration

### NOWPayments Setup
1. Create account at [NOWPayments](https://nowpayments.io)
2. Get API key from dashboard
3. Configure IPN callback URL: `https://yourdomain.com/api/webhooks/nowpayments`
4. Set up custody accounts for merchant isolation

### Resend Email Setup (Optional)
1. Create account at [Resend](https://resend.com)
2. Verify your sending domain
3. Get API key from dashboard

### Twilio SMS Setup (Optional) 
1. Create account at [Twilio](https://twilio.com)
2. Get Account SID and Auth Token
3. Purchase phone number for SMS sending

## 🚦 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create merchant account
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user profile

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment details
- `GET /api/payments` - List payments

### Invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice details
- `GET /api/invoices` - List invoices

### Withdrawals
- `POST /api/withdrawals` - Request withdrawal
- `GET /api/withdrawals/:id` - Get withdrawal status
- `GET /api/withdrawals` - List withdrawals

### Payment Links
- `POST /api/links` - Create payment link
- `GET /api/links` - List payment links
- `PUT /api/links/:id` - Update payment link
- `DELETE /api/links/:id` - Delete payment link

### Hosted Checkout (Public)
- `GET /api/checkout/:paymentId` - Get checkout details
- `GET /api/checkout/:paymentId/status` - Get payment status

### Admin (Admin Only)
- `GET /api/admin/merchants` - List merchants
- `GET /api/admin/transactions` - List transactions
- `GET /api/admin/system` - System health

### Webhooks
- `POST /api/webhooks/nowpayments` - NOWPayments IPN

## 🔐 Security Features

- **Row Level Security**: Database-level access control
- **JWT Authentication**: Secure API access
- **HMAC Verification**: Webhook signature validation
- **Role-based Access**: Admin/Merchant permission system
- **Input Validation**: Request data sanitization
- **CORS Protection**: Cross-origin request filtering
- **Helmet Security**: HTTP security headers

## 🎯 Usage Examples

### Create Payment
```javascript
import { paymentService } from './services/paymentService';

const createPayment = async () => {
  const { data, error } = await paymentService.createPayment({
    price_amount: 100,
    price_currency: 'USD',
    pay_currency: 'BTC',
    order_id: 'order_123'
  });
  
  if (error) {
    console.error('Payment creation failed:', error);
    return;
  }
  
  console.log('Payment created:', data.payment);
  console.log('Checkout URL:', data.checkout_url);
};
```

### Real-time Status Updates
```javascript
import { checkoutService } from './services/paymentService';

const pollPaymentStatus = async (paymentId) => {
  const { data, error } = await checkoutService.getCheckoutStatus(paymentId);
  
  if (!error && data) {
    console.log('Current status:', data.status);
    
    if (['finished', 'failed', 'expired'].includes(data.status)) {
      // Payment completed
      return data.status;
    }
  }
  
  // Continue polling
  setTimeout(() => pollPaymentStatus(paymentId), 5000);
};
```

## 🚨 Environment Security

- Never commit `.env` files
- Use different keys for development/production
- Rotate API keys regularly
- Monitor webhook logs for suspicious activity
- Use HTTPS in production

## 📈 Monitoring

The platform includes comprehensive monitoring:

- **System Health**: API status, database connectivity
- **Transaction Monitoring**: Real-time payment tracking
- **Error Logging**: Webhook failures and API errors
- **Performance Metrics**: Response times and throughput
- **Security Alerts**: Failed authentication attempts

## 🛠️ Development

### Running Tests
```bash
# Frontend tests
npm run test

# Backend tests  
cd api && npm run test
```

### Database Migrations
New migrations should be placed in `supabase/migrations/` with timestamp naming:
```
YYYYMMDDHHMMSS_description.sql
```

### Adding New Features
1. Update database schema if needed
2. Add backend API routes
3. Create frontend service functions
4. Update UI components
5. Test end-to-end functionality

## 📞 Support

For support and questions:
- Email: support@blockchainpay.com
- Documentation: [Internal Wiki]
- Issue Tracker: [GitHub Issues]

## 📄 License

This project is proprietary software for Blockchain Global Payments LLC.