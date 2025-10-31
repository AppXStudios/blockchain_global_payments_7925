import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

// Import all page components
import LandingPage from './pages/landing-page';
import MerchantAuthentication from './pages/merchant-authentication';
import AdminPanel from './pages/admin-panel';
import HostedCheckout from './pages/hosted-checkout';
import NotFound from './pages/NotFound';

// Support and documentation pages
import SupportPage from './pages/support';
import DocumentationPage from './pages/documentation';
import PricingPage from './pages/pricing';
import ContactPage from './pages/contact';
import PrivacyPolicyPage from './pages/legal/privacy';
import TermsOfServicePage from './pages/legal/terms';

// Dashboard pages
import DashboardPage from './pages/dashboard';
import DashboardPayments from './pages/dashboard/payments';
import DashboardInvoices from './pages/dashboard/invoices';
import DashboardLinks from './pages/dashboard/links';
import DashboardWithdrawals from './pages/dashboard/withdrawals';
import DashboardSettings from './pages/dashboard/settings';

// Admin pages
import AdminPage from './pages/admin';
import AdminMerchantsPage from './pages/admin/merchants';
import AdminPaymentsPage from './pages/admin/payments';
import AdminHealthPage from './pages/admin/health';

// Create pages
import CreateInvoicePage from './pages/dashboard/invoices/create';
import CreatePaymentPage from './pages/dashboard/payments/create';
import CreateLinkPage from './pages/dashboard/links/create';
import CreateWithdrawalPage from './pages/dashboard/withdrawals/create';

// ✅ CORRECTED DYNAMIC [ID] PAGES - EXACT REQUIRED STRUCTURE
import PaymentDetailsPage from './pages/dashboard/payments/[id]';
import InvoiceDetailsPage from './pages/dashboard/invoices/[id]';
import LinkDetailsPage from './pages/dashboard/links/[id]';
import WithdrawalDetailsPage from './pages/dashboard/withdrawals/[id]';
import CheckoutSessionPage from './pages/checkout/[sessionId]';
import PayLinkPage from './pages/pay/[linkId]';
import AdminMerchantDetailsPage from './pages/admin/merchants/[id]';
import AdminPaymentDetailsPage from './pages/admin/payments/[id]';

/**
 * ✅ FINAL CORRECTED ROUTING CONFIGURATION
 * All 8 required dynamic [id] pages properly structured according to user specifications
 * Routes match the exact directory structure: /dashboard/*, /checkout/*, /pay/*, /admin/*
 */
function Routes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<MerchantAuthentication />} />
          <Route path="/login" element={<MerchantAuthentication />} />
          <Route path="/signup" element={<MerchantAuthentication />} />
          
          {/* ===== PUBLIC PAGES ===== */}
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />

          {/* ===== LEGAL PAGES ===== */}
          <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/legal/terms" element={<TermsOfServicePage />} />
          
          {/* ===== MAIN DASHBOARD ROUTE ===== */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* ===== DASHBOARD SUB-ROUTES (PROPER /dashboard/* STRUCTURE) ===== */}
          <Route path="/dashboard/payments" element={<DashboardPayments />} />
          <Route path="/dashboard/invoices" element={<DashboardInvoices />} />
          <Route path="/dashboard/links" element={<DashboardLinks />} />
          <Route path="/dashboard/withdrawals" element={<DashboardWithdrawals />} />
          <Route path="/dashboard/settings" element={<DashboardSettings />} />
          
          {/* ===== DASHBOARD CREATE PAGES ===== */}
          <Route path="/dashboard/invoices/create" element={<CreateInvoicePage />} />
          <Route path="/dashboard/payments/create" element={<CreatePaymentPage />} />
          <Route path="/dashboard/links/create" element={<CreateLinkPage />} />
          <Route path="/dashboard/withdrawals/create" element={<CreateWithdrawalPage />} />
          
          {/* ===== ✅ REQUIRED DYNAMIC [ID] PAGES - ALL 8 ROUTES ===== */}
          <Route path="/dashboard/payments/:id" element={<PaymentDetailsPage />} />
          <Route path="/dashboard/invoices/:id" element={<InvoiceDetailsPage />} />
          <Route path="/dashboard/links/:id" element={<LinkDetailsPage />} />
          <Route path="/dashboard/withdrawals/:id" element={<WithdrawalDetailsPage />} />
          
          {/* ===== ✅ CHECKOUT & PAY ROUTES (PUBLIC) ===== */}
          <Route path="/checkout/:sessionId" element={<CheckoutSessionPage />} />
          <Route path="/pay/:linkId" element={<PayLinkPage />} />
          <Route path="/hosted-checkout" element={<HostedCheckout />} />
          
          {/* ===== ADMIN ROUTES ===== */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/merchants" element={<AdminMerchantsPage />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
          <Route path="/admin/health" element={<AdminHealthPage />} />
          
          {/* ===== ✅ ADMIN DYNAMIC [ID] PAGES ===== */}
          <Route path="/admin/merchants/:id" element={<AdminMerchantDetailsPage />} />
          <Route path="/admin/payments/:id" element={<AdminPaymentDetailsPage />} />
          
          {/* ===== BACKWARD COMPATIBILITY ROUTES (EXISTING PATHS) ===== */}
          <Route path="/payment-management" element={<DashboardPayments />} />
          <Route path="/invoice-management" element={<DashboardInvoices />} />
          <Route path="/payment-links" element={<DashboardLinks />} />
          <Route path="/withdrawals" element={<DashboardWithdrawals />} />
          <Route path="/account-settings" element={<DashboardSettings />} />

          {/* ===== SIMPLIFIED ALIASES FOR BETTER UX ===== */}
          <Route path="/payments" element={<DashboardPayments />} />
          <Route path="/invoices" element={<DashboardInvoices />} />
          <Route path="/links" element={<DashboardLinks />} />
          <Route path="/settings" element={<DashboardSettings />} />
          
          {/* ===== 404 FALLBACK ===== */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default Routes;