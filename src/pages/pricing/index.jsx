import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../../components/ui/PublicHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const PricingPage = () => {
  const navigate = useNavigate();

  const pricingPlans = [
    {
      name: 'Starter',
      price: '2.9%',
      description: 'Perfect for small businesses and startups',
      features: [
        'Up to $10K monthly volume',
        '50+ cryptocurrencies',
        'Basic dashboard',
        'Email support',
        'Standard settlement (24-48h)',
        'API access'
      ],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: 'Professional',
      price: '1.9%',
      description: 'Ideal for growing businesses',
      features: [
        'Up to $100K monthly volume',
        '300+ cryptocurrencies',
        'Advanced dashboard',
        'Priority support',
        'Fast settlement (4-12h)',
        'API access',
        'Webhook notifications',
        'Custom payment pages'
      ],
      buttonText: 'Choose Professional',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large-scale operations',
      features: [
        'Unlimited volume',
        '500+ cryptocurrencies',
        'White-label solution',
        'Dedicated support',
        'Instant settlement',
        'Full API suite',
        'Advanced webhooks',
        'Custom integrations',
        'SLA guarantees'
      ],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  const handleGetStarted = (plan) => {
    if (plan?.name === 'Enterprise') {
      navigate('/support');
    } else {
      navigate('/signup');
    }
  };

  return (
    <>
      <Helmet>
        <title>Pricing - BlockPay Cryptocurrency Payment Processing</title>
        <meta 
          name="description" 
          content="Choose the perfect plan for your business. Transparent pricing with no hidden fees. Start accepting cryptocurrency payments today." 
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <PublicHeader />
        
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that fits your business needs. All plans include our core features with no setup fees or hidden costs.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {pricingPlans?.map((plan) => (
              <div
                key={plan?.name}
                className={`
                  relative bg-card border rounded-2xl p-8 shadow-lg
                  ${plan?.popular 
                    ? 'border-primary ring-2 ring-primary/20' :'border-border'
                  }
                `}
              >
                {plan?.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan?.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">
                      {plan?.price}
                    </span>
                    {plan?.name !== 'Enterprise' && (
                      <span className="text-muted-foreground ml-2">per transaction</span>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {plan?.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan?.features?.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Icon name="CheckCircle" size={20} className="text-success mr-3" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan?.popular ? "default" : "outline"}
                  fullWidth
                  onClick={() => handleGetStarted(plan)}
                  className={plan?.popular ? "gradient-primary" : ""}
                >
                  {plan?.buttonText}
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h3 className="font-semibold text-foreground mb-2">
                  Are there any setup fees?
                </h3>
                <p className="text-muted-foreground">
                  No, there are no setup fees, monthly fees, or hidden costs. You only pay per transaction.
                </p>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground mb-2">
                  How quickly do I receive funds?
                </h3>
                <p className="text-muted-foreground">
                  Settlement times vary by plan. Enterprise customers enjoy instant settlements.
                </p>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground mb-2">
                  Can I upgrade my plan anytime?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time through your dashboard.
                </p>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground mb-2">
                  What cryptocurrencies do you support?
                </h3>
                <p className="text-muted-foreground">
                  We support all major cryptocurrencies including Bitcoin, Ethereum, and 300+ altcoins.
                </p>
              </div>
            </div>
            
            <div className="mt-12">
              <Button
                variant="outline"
                onClick={() => navigate('/support')}
                iconName="MessageCircle"
                iconPosition="left"
              >
                Have more questions? Contact us
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PricingPage;