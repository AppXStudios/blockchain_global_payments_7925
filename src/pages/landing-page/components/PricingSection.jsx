import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PricingSection = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handleGetStarted = (plan) => {
    navigate('/merchant-authentication', { state: { selectedPlan: plan } });
  };

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small businesses and startups',
      monthlyPrice: 0,
      yearlyPrice: 0,
      transactionFee: '2.9%',
      features: [
        'Up to $10K monthly volume',
        '50+ supported cryptocurrencies',
        'Basic dashboard and analytics',
        'Email support',
        'Standard API access',
        'Hosted checkout pages'
      ],
      limitations: [
        'Limited customization',
        'Standard settlement times'
      ],
      popular: false,
      cta: 'Start Free'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing businesses',
      monthlyPrice: 99,
      yearlyPrice: 990,
      transactionFee: '2.4%',
      features: [
        'Up to $100K monthly volume',
        '300+ supported cryptocurrencies',
        'Advanced analytics and reporting',
        'Priority email & chat support',
        'Full API access with webhooks',
        'Custom checkout branding',
        'Multi-user dashboard access',
        'Advanced fraud protection'
      ],
      limitations: [],
      popular: true,
      cta: 'Start Professional'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large-scale operations',
      monthlyPrice: 'Custom',
      yearlyPrice: 'Custom',
      transactionFee: '1.9%',
      features: [
        'Unlimited monthly volume',
        'All supported cryptocurrencies',
        'Custom analytics and reporting',
        'Dedicated account manager',
        'White-label solutions',
        'Custom integrations',
        'SLA guarantees',
        'Advanced security features',
        'Custom settlement terms'
      ],
      limitations: [],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  const additionalFeatures = [
    {
      feature: 'Setup Fee',
      starter: 'Free',
      professional: 'Free',
      enterprise: 'Free'
    },
    {
      feature: 'Settlement Time',
      starter: '24-48 hours',
      professional: '2-24 hours',
      enterprise: 'Instant'
    },
    {
      feature: 'API Rate Limits',
      starter: '1,000/hour',
      professional: '10,000/hour',
      enterprise: 'Unlimited'
    },
    {
      feature: 'Webhook Events',
      starter: 'Basic',
      professional: 'Advanced',
      enterprise: 'Custom'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-2 mb-6">
            <Icon name="DollarSign" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-secondary">Pricing</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the plan that fits your business needs. No hidden fees, no long-term contracts. Scale as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                billingCycle === 'monthly' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                billingCycle === 'yearly' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-success text-success-foreground px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans?.map((plan) => (
            <div
              key={plan?.id}
              className={`relative bg-card border rounded-2xl p-8 transition-smooth hover-lift ${
                plan?.popular
                  ? 'border-primary shadow-glow'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {/* Popular Badge */}
              {plan?.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {plan?.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {plan?.description}
                </p>

                {/* Price */}
                <div className="mb-4">
                  {typeof plan?.monthlyPrice === 'number' ? (
                    <div>
                      <span className="text-4xl font-bold text-foreground">
                        ${billingCycle === 'monthly' ? plan?.monthlyPrice : plan?.yearlyPrice}
                      </span>
                      <span className="text-muted-foreground">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-foreground">
                      {plan?.monthlyPrice}
                    </div>
                  )}
                </div>

                {/* Transaction Fee */}
                <div className="text-sm text-muted-foreground">
                  + {plan?.transactionFee} per transaction
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <ul className="space-y-3">
                  {plan?.features?.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Button
                variant={plan?.popular ? "default" : "outline"}
                fullWidth
                onClick={() => handleGetStarted(plan?.id)}
                className={plan?.popular ? "gradient-primary" : ""}
              >
                {plan?.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-border">
            <h3 className="text-xl font-semibold text-foreground">
              Feature Comparison
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-8 text-sm font-medium text-muted-foreground">
                    Feature
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                    Starter
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                    Professional
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {additionalFeatures?.map((row, index) => (
                  <tr key={index} className="border-b border-border last:border-b-0">
                    <td className="py-4 px-8 text-sm font-medium text-foreground">
                      {row?.feature}
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-muted-foreground">
                      {row?.starter}
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-muted-foreground">
                      {row?.professional}
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-muted-foreground">
                      {row?.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-muted-foreground mb-8">
            Have questions? We're here to help.
          </p>
          <Button variant="outline" iconName="MessageCircle" iconPosition="left">
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;