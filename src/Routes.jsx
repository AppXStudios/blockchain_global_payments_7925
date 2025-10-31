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

/**
 * ▶ 5.3 — FRONTEND QA: Fixed routing configuration with all required routes
 * Ensuring all router.push() routes exist and match application flow
 */

function Routes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<MerchantAuthentication />} />
          <Route path="/login" element={<MerchantAuthentication />} />
          <Route path="/signup" element={<MerchantAuthentication />} />
          
          {/* Hosted Checkout Routes (Public) */}
          <Route path="/checkout/:paymentId" element={<HostedCheckout />} />
          <Route path="/pay/:linkId" element={<HostedCheckout />} />
          
          {/* Protected Merchant Routes */}
          <Route path="/dashboard" element={<MerchantDashboard />} />
          <Route path="/payments" element={<PaymentManagement />} />
          <Route path="/invoices" element={<InvoiceManagement />} />
          <Route path="/links" element={<PaymentLinks />} />
          <Route path="/withdrawals" element={<Withdrawals />} />
          <Route path="/settings" element={<AccountSettings />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default Routes;