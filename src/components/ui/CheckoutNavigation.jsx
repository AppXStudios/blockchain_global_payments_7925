import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const CheckoutNavigation = ({ 
  merchantName = "BlockPay Merchant",
  merchantLogo = null,
  showBackButton = true,
  onBack = null,
  supportUrl = "#support",
  showProgress = true,
  currentStep = 1,
  totalSteps = 3
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleSupport = () => {
    if (supportUrl?.startsWith('#')) {
      // Handle anchor links or show support modal
      console.log('Show support');
    } else {
      window.open(supportUrl, '_blank');
    }
  };

  const Logo = () => (
    <div className="flex items-center space-x-3">
      {merchantLogo ? (
        <img 
          src={merchantLogo} 
          alt={`${merchantName} logo`}
          className="w-8 h-8 rounded-lg object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Icon name="Store" size={18} color="white" />
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-foreground">{merchantName}</span>
        <span className="text-xs text-muted-foreground">Secure Checkout</span>
      </div>
    </div>
  );

  const ProgressIndicator = () => (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-smooth ${
              index < currentStep 
                ? 'bg-primary' 
                : index === currentStep 
                ? 'bg-primary animate-pulse-subtle' :'bg-muted'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );

  return (
    <header className="sticky top-0 z-1000 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="ArrowLeft" size={18} />
              </Button>
            )}
            <Logo />
          </div>

          {/* Center Section - Progress (Desktop) */}
          {showProgress && (
            <div className="hidden sm:block">
              <ProgressIndicator />
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Security Badge */}
            <div className="hidden sm:flex items-center space-x-1 text-xs text-muted-foreground">
              <Icon name="Shield" size={14} className="text-success" />
              <span>Secure</span>
            </div>

            {/* Support Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSupport}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="HelpCircle" size={16} className="mr-1" />
              <span className="hidden sm:inline">Support</span>
            </Button>
          </div>
        </div>

        {/* Mobile Progress */}
        {showProgress && (
          <div className="sm:hidden pb-3">
            <ProgressIndicator />
          </div>
        )}
      </div>
    </header>
  );
};

export default CheckoutNavigation;