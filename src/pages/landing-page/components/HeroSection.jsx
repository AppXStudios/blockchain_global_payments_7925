import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleViewPricing = () => {
    navigate('/pricing');
  };

  const handleLearnMore = () => {
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-card overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-card border border-border rounded-full px-4 py-2 mb-8">
            <Icon name="Zap" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Trusted by 10,000+ merchants worldwide</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Accept Crypto Payments
            <span className="block gradient-primary bg-clip-text text-transparent">
              Across 180+ Countries
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade cryptocurrency payment processing platform supporting 300+ currencies with instant settlements, custody integration, and real-time tracking.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Button
              variant="default"
              size="lg"
              onClick={handleGetStarted}
              className="gradient-primary text-lg px-8 py-4 shadow-glow hover-lift"
              iconName="ArrowRight"
              iconPosition="right"
            >
              Start Accepting Crypto
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleViewPricing}
              className="text-lg px-8 py-4"
              iconName="DollarSign"
              iconPosition="left"
            >
              View Pricing
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Lock" size={16} className="text-success" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Globe" size={16} className="text-primary" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-16 relative">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Payment Interface Preview */}
              <div className="md:col-span-2 bg-muted rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                  </div>
                  <span className="text-xs text-muted-foreground">Secure Checkout</span>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-background rounded w-3/4"></div>
                  <div className="h-8 bg-primary/20 rounded"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-6 bg-background rounded"></div>
                    <div className="h-6 bg-background rounded"></div>
                    <div className="h-6 bg-background rounded"></div>
                  </div>
                </div>
              </div>

              {/* Stats Preview */}
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">$2.4B+</div>
                  <div className="text-xs text-muted-foreground">Processed</div>
                </div>
                <div className="bg-secondary/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">300+</div>
                  <div className="text-xs text-muted-foreground">Currencies</div>
                </div>
                <div className="bg-accent/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-accent">180+</div>
                  <div className="text-xs text-muted-foreground">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;