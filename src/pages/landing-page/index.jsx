import React from 'react';
import { Helmet } from 'react-helmet';
import PublicHeader from '../../components/ui/PublicHeader';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import TrustSection from './components/TrustSection';
import FooterSection from './components/FooterSection';

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>BlockPay - Enterprise Cryptocurrency Payment Processing Platform</title>
        <meta 
          name="description" 
          content="Accept cryptocurrency payments across 300+ currencies and 180+ countries. Enterprise-grade security, instant settlements, and comprehensive merchant tools." 
        />
        <meta name="keywords" content="cryptocurrency payments, crypto payment processor, blockchain payments, merchant services, digital currency" />
        <meta property="og:title" content="BlockPay - Enterprise Cryptocurrency Payment Processing" />
        <meta property="og:description" content="Transform your business with secure cryptocurrency payments. Support for 300+ currencies, instant settlements, and enterprise-grade security." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/landing-page" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header Navigation */}
        <PublicHeader />

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <HeroSection />

          {/* Statistics Section */}
          <StatsSection />

          {/* Features Section */}
          <FeaturesSection />

          {/* Pricing Section */}
          <PricingSection />

          {/* Trust & Security Section */}
          <TrustSection />
        </main>

        {/* Footer */}
        <FooterSection />
      </div>
    </>
  );
};

export default LandingPage;