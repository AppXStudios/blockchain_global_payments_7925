import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentDetails = ({ 
  amount = "0.00",
  currency = "USD",
  cryptoAmount = "0.00000000",
  cryptoCurrency = "BTC",
  description = "Payment for services",
  orderId = "#12345",
  expiresAt = null
}) => {
  const formatTimeRemaining = (expiryTime) => {
    if (!expiryTime) return null;
    
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry - now;
    
    if (diff <= 0) return "Expired";
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds?.toString()?.padStart(2, '0')}`;
  };

  const timeRemaining = formatTimeRemaining(expiresAt);

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="space-y-6">
        {/* Order Information */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Complete Payment</h1>
          <p className="text-muted-foreground">{description}</p>
          {orderId && (
            <p className="text-sm text-muted-foreground mt-1">Order: {orderId}</p>
          )}
        </div>

        {/* Amount Display */}
        <div className="text-center py-6 border-y border-border">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-foreground">
              {amount} {currency}
            </div>
            <div className="text-lg text-muted-foreground">
              ≈ {cryptoAmount} {cryptoCurrency}
            </div>
          </div>
        </div>

        {/* Payment Timer */}
        {timeRemaining && (
          <div className="flex items-center justify-center space-x-2 p-3 bg-warning/10 rounded-lg">
            <Icon name="Clock" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">
              {timeRemaining === "Expired" ? "Payment Expired" : `Time remaining: ${timeRemaining}`}
            </span>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={14} className="text-success" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Lock" size={14} className="text-success" />
            <span>Encrypted</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Zap" size={14} className="text-primary" />
            <span>Instant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;