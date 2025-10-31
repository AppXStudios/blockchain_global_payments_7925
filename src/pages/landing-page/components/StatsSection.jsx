import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsSection = () => {
  const stats = [
    {
      id: 1,
      icon: "DollarSign",
      value: "$2.4B+",
      label: "Total Volume Processed",
      description: "Secure transactions processed globally",
      color: "text-success"
    },
    {
      id: 2,
      icon: "Coins",
      value: "300+",
      label: "Supported Cryptocurrencies",
      description: "Major coins and tokens supported",
      color: "text-primary"
    },
    {
      id: 3,
      icon: "Globe",
      value: "180+",
      label: "Countries Supported",
      description: "Global reach and compliance",
      color: "text-secondary"
    },
    {
      id: 4,
      icon: "Users",
      value: "10,000+",
      label: "Active Merchants",
      description: "Businesses trust our platform",
      color: "text-accent"
    },
    {
      id: 5,
      icon: "Zap",
      value: "99.9%",
      label: "Platform Uptime",
      description: "Reliable service guarantee",
      color: "text-warning"
    },
    {
      id: 6,
      icon: "Clock",
      value: "<30s",
      label: "Average Settlement",
      description: "Lightning-fast confirmations",
      color: "text-success"
    }
  ];

  return (
    <section className="py-20 bg-card/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Businesses Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of merchants who have chosen our platform for secure, reliable cryptocurrency payments.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats?.map((stat) => (
            <div
              key={stat?.id}
              className="bg-card border border-border rounded-xl p-8 text-center hover-lift transition-smooth group"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6 group-hover:scale-110 transition-smooth">
                <Icon 
                  name={stat?.icon} 
                  size={32} 
                  className={`${stat?.color} group-hover:animate-pulse-subtle`} 
                />
              </div>

              {/* Value */}
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                {stat?.value}
              </div>

              {/* Label */}
              <div className="text-lg font-semibold text-foreground mb-2">
                {stat?.label}
              </div>

              {/* Description */}
              <div className="text-sm text-muted-foreground">
                {stat?.description}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              Growing by 40% month-over-month
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;