import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentHeader = ({ 
  merchantName = "BlockPay Merchant",
  merchantLogo = null,
  onSupport = () => {},
  isSecure = true 
}) => {
  const Logo = () => (
    <div className="flex items-center space-x-3">
      {merchantLogo ? (
        <img 
          src={merchantLogo} 
          alt={`${merchantName} company logo with brand colors`}
          className="w-10 h-10 rounded-lg object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
          <Icon name="Store" size={20} color="white" />
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-foreground">{merchantName}</span>
        <span className="text-sm text-muted-foreground">Secure Checkout</span>
      </div>
    </div>
  );

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Merchant Logo & Name */}
          <Logo />

          {/* Security & Support */}
          <div className="flex items-center space-x-4">
            {/* Security Badge */}
            {isSecure && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-success/10 rounded-full">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="text-sm font-medium text-success">Secure</span>
              </div>
            )}

            {/* Support Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSupport}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="HelpCircle" size={16} className="mr-2" />
              Support
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PaymentHeader;