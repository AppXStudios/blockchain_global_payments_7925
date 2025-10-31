import React from 'react';
import Icon from '../../../components/AppIcon';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: "Shield",
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance, multi-signature wallets, and advanced fraud protection to keep your funds safe.",
      benefits: ["SOC 2 Type II Certified", "Multi-signature Wallets", "Advanced Fraud Detection", "24/7 Security Monitoring"]
    },
    {
      id: 2,
      icon: "Zap",
      title: "Instant Settlements",
      description: "Receive payments in under 30 seconds with real-time confirmations and automatic currency conversion capabilities.",
      benefits: ["Sub-30 Second Settlements", "Real-time Confirmations", "Auto Currency Conversion", "Instant Notifications"]
    },
    {
      id: 3,
      icon: "Globe",
      title: "Global Reach",
      description: "Accept payments from customers worldwide with support for 300+ cryptocurrencies across 180+ countries.",
      benefits: ["300+ Cryptocurrencies", "180+ Countries", "Multi-language Support", "Local Compliance"]
    },
    {
      id: 4,
      icon: "CreditCard",
      title: "Easy Integration",
      description: "Get started in minutes with our simple APIs, hosted checkout pages, and comprehensive developer documentation.",
      benefits: ["5-minute Setup", "RESTful APIs", "Hosted Checkout", "Comprehensive Docs"]
    },
    {
      id: 5,
      icon: "BarChart3",
      title: "Advanced Analytics",
      description: "Track performance with detailed analytics, transaction insights, and customizable reporting dashboards.",
      benefits: ["Real-time Analytics", "Custom Reports", "Transaction Insights", "Performance Metrics"]
    },
    {
      id: 6,
      icon: "Headphones",
      title: "24/7 Support",
      description: "Get help when you need it with our dedicated support team available around the clock via multiple channels.",
      benefits: ["24/7 Availability", "Multiple Channels", "Expert Team", "Priority Support"]
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Icon name="Star" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need to Accept
            <span className="block gradient-primary bg-clip-text text-transparent">
              Crypto Payments
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and features you need to integrate cryptocurrency payments seamlessly into your business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features?.map((feature) => (
            <div
              key={feature?.id}
              className="bg-card border border-border rounded-xl p-8 hover-lift transition-smooth group"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg gradient-primary mb-6 group-hover:scale-110 transition-smooth">
                <Icon name={feature?.icon} size={24} color="white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {feature?.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {feature?.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-2">
                {feature?.benefits?.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <Icon name="Check" size={16} className="text-success flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to Transform Your Payment Experience?
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of businesses already using our platform to accept cryptocurrency payments securely and efficiently.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={16} className="text-success" />
                  <span>5-minute setup</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="CreditCard" size={16} className="text-success" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Shield" size={16} className="text-success" />
                  <span>Enterprise security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;