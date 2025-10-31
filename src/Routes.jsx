import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

// Import all page components
import LandingPage from './pages/landing-page';
import MerchantAuthentication from './pages/merchant-authentication';
import MerchantDashboard from './pages/merchant-dashboard';
import PaymentManagement from './pages/payment-management';
import InvoiceManagement from './pages/invoice-management';
import PaymentLinks from './pages/payment-links';
import Withdrawals from './pages/withdrawals';
import AccountSettings from './pages/account-settings';
import AdminPanel from './pages/admin-panel';
import HostedCheckout from './pages/hosted-checkout';
import NotFound from './pages/NotFound';

// Support and documentation pages
import SupportPage from './pages/support';
import DocumentationPage from './pages/documentation';
import PricingPage from './pages/pricing';
import ContactPage from './pages/contact';

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
          
          {/* ===== MAIN DASHBOARD ROUTE ===== */}
          <Route path="/dashboard" element={<MerchantDashboard />} />
          
          {/* ===== DASHBOARD SUB-ROUTES (PROPER /dashboard/* STRUCTURE) ===== */}
          <Route path="/dashboard/payments" element={<PaymentManagement />} />
          <Route path="/dashboard/invoices" element={<InvoiceManagement />} />
          <Route path="/dashboard/links" element={<PaymentLinks />} />
          <Route path="/dashboard/withdrawals" element={<Withdrawals />} />
          <Route path="/dashboard/settings" element={<AccountSettings />} />
          
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
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/merchants" element={<AdminPanel />} />
          <Route path="/admin/payments" element={<AdminPanel />} />
          <Route path="/admin/health" element={<AdminPanel />} />
          
          {/* ===== ✅ ADMIN DYNAMIC [ID] PAGES ===== */}
          <Route path="/admin/merchants/:id" element={<AdminMerchantDetailsPage />} />
          <Route path="/admin/payments/:id" element={<AdminPaymentDetailsPage />} />
          
          {/* ===== BACKWARD COMPATIBILITY ROUTES (EXISTING PATHS) ===== */}
          <Route path="/payment-management" element={<PaymentManagement />} />
          <Route path="/invoice-management" element={<InvoiceManagement />} />
          <Route path="/payment-links" element={<PaymentLinks />} />
          <Route path="/withdrawals" element={<Withdrawals />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          
          {/* ===== SIMPLIFIED ALIASES FOR BETTER UX ===== */}
          <Route path="/payments" element={<PaymentManagement />} />
          <Route path="/invoices" element={<InvoiceManagement />} />
          <Route path="/links" element={<PaymentLinks />} />
          <Route path="/settings" element={<AccountSettings />} />
          
          {/* ===== 404 FALLBACK ===== */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default Routes;