import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: '256-bit encryption'
    },
    {
      icon: 'Award',
      title: 'SOC 2 Compliant',
      description: 'Enterprise security'
    },
    {
      icon: 'Zap',
      title: '99.9% Uptime',
      description: 'Guaranteed availability'
    },
    {
      icon: 'Users',
      title: '10,000+ Merchants',
      description: 'Trusted worldwide'
    }
  ];

  return (
    <div className="bg-card/50 rounded-xl p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
        Trusted by Businesses Worldwide
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {trustBadges?.map((badge, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name={badge?.icon} size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{badge?.title}</p>
              <p className="text-xs text-muted-foreground">{badge?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Lock" size={12} className="text-success" />
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Globe" size={12} className="text-primary" />
            <span>180+ Countries</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Coins" size={12} className="text-warning" />
            <span>300+ Currencies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;