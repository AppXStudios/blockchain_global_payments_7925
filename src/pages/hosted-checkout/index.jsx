import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CheckoutNavigation from '../../components/ui/CheckoutNavigation';

import PaymentDetails from './components/PaymentDetails';
import CurrencySelector from './components/CurrencySelector';
import PaymentInstructions from './components/PaymentInstructions';
import PaymentStatus from './components/PaymentStatus';
import SupportSection from './components/SupportSection';

const HostedCheckout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCurrency, setSelectedCurrency] = useState("BTC");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [confirmations, setConfirmations] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  // Mock payment data - in real app, this would come from URL params or API
  const paymentData = {
    merchantName: "TechStore Pro",
    merchantLogo: "https://images.unsplash.com/photo-1662397315021-30c862c10451",
    amount: "299.99",
    currency: "USD",
    description: "Premium Wireless Headphones - Model XM4",
    orderId: "#ORD-2024-10-31-001",
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    depositAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    transactionHash: paymentStatus !== "pending" ? "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456" : null
  };

  // Mock crypto amounts based on selected currency
  const getCryptoAmount = (currency) => {
    const rates = {
      BTC: "0.00446789",
      ETH: "0.11234567",
      USDT: "299.99000000",
      USDC: "300.12000000",
      LTC: "4.23456789",
      ADA: "753.45678901",
      DOT: "67.89012345",
      MATIC: "456.78901234"
    };
    return rates?.[currency] || "0.00000000";
  };

  // Simulate payment status updates
  useEffect(() => {
    let interval;

    if (paymentStatus === "confirming") {
      interval = setInterval(() => {
        setConfirmations((prev) => {
          const next = prev + 1;
          if (next >= 3) {
            setPaymentStatus("completed");
            setCurrentStep(3);
            return 3;
          }
          return next;
        });
      }, 10000); // Update every 10 seconds for demo
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentStatus]);

  // Simulate receiving payment after currency selection
  useEffect(() => {
    const timer = setTimeout(() => {
      if (paymentStatus === "pending" && currentStep === 2) {
        setPaymentStatus("confirming");
        setConfirmations(1);
      }
    }, 15000); // Simulate payment received after 15 seconds

    return () => clearTimeout(timer);
  }, [currentStep, paymentStatus]);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handlePaymentComplete = () => {
    // In real app, redirect to merchant success URL
    navigate('/merchant-dashboard');
  };

  const handlePaymentRetry = () => {
    setPaymentStatus("pending");
    setConfirmations(0);
    setCurrentStep(1);
  };

  const handleSupport = () => {
    // In real app, open support chat or modal
    console.log('Opening support...');
  };

  const cryptoAmount = getCryptoAmount(selectedCurrency);
  const networkFee = selectedCurrency === "BTC" ? "0.00001500" :
  selectedCurrency === "ETH" ? "0.00234000" : "0.00000100";

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <CheckoutNavigation
        merchantName={paymentData?.merchantName}
        merchantLogo={paymentData?.merchantLogo}
        showBackButton={true}
        onBack={() => navigate(-1)}
        showProgress={true}
        currentStep={currentStep}
        totalSteps={3} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Details & Instructions */}
          <div className="space-y-6">
            {/* Payment Details */}
            <PaymentDetails
              amount={paymentData?.amount}
              currency={paymentData?.currency}
              cryptoAmount={cryptoAmount}
              cryptoCurrency={selectedCurrency}
              description={paymentData?.description}
              orderId={paymentData?.orderId}
              expiresAt={paymentData?.expiresAt} />


            {/* Currency Selection */}
            <CurrencySelector
              selectedCurrency={selectedCurrency}
              onCurrencyChange={handleCurrencyChange}
              amount={cryptoAmount} />


            {/* Payment Instructions - Show after currency selection */}
            {currentStep >= 2 &&
            <PaymentInstructions
              depositAddress={paymentData?.depositAddress}
              amount={cryptoAmount}
              currency={selectedCurrency}
              networkFee={networkFee} />

            }
          </div>

          {/* Right Column - Status & Support */}
          <div className="space-y-6">
            {/* Payment Status */}
            <PaymentStatus
              status={paymentStatus}
              confirmations={confirmations}
              requiredConfirmations={3}
              transactionHash={paymentData?.transactionHash}
              onRetry={handlePaymentRetry}
              onComplete={handlePaymentComplete}
              explorerUrl={selectedCurrency === "BTC" ? "https://blockstream.info/tx" : "https://etherscan.io/tx"} />


            {/* Support Section */}
            <SupportSection
              supportEmail="support@blockpay.com"
              supportPhone="+1 (555) 123-4567"
              onContactSupport={handleSupport} />


            {/* Trust Indicators */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-foreground text-center">
                  Secure Payment Processing
                </h4>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                      <span className="text-success font-bold text-lg">256</span>
                    </div>
                    <div className="text-xs text-muted-foreground">SSL Encryption</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">99.9</span>
                    </div>
                    <div className="text-xs text-muted-foreground">% Uptime</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto bg-warning/10 rounded-full flex items-center justify-center">
                      <span className="text-warning font-bold text-lg">24/7</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Support</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                      <span className="text-accent font-bold text-lg">300+</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Currencies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Powered by BlockPay • Secure cryptocurrency payments • 
              <button
                onClick={() => navigate('/landing-page')}
                className="text-primary hover:underline ml-1">

                Learn more
              </button>
            </p>
            <p className="mt-2">
              © {new Date()?.getFullYear()} BlockPay Global Payments. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>);

};

export default HostedCheckout;