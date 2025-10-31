import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecurityNotice = ({ onEnable2FA }) => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Two-Factor Authentication',
      description: 'Required for all withdrawal requests',
      status: 'enabled'
    },
    {
      icon: 'Mail',
      title: 'Email Confirmation',
      description: 'Verify withdrawals via email link',
      status: 'enabled'
    },
    {
      icon: 'Clock',
      title: 'Processing Time',
      description: '15-30 minutes for most currencies',
      status: 'info'
    },
    {
      icon: 'AlertTriangle',
      title: 'Daily Limits',
      description: 'Maximum $50,000 USD equivalent per day',
      status: 'warning'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'enabled':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
          <Icon name="Shield" size={20} className="text-success" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Security Information</h2>
          <p className="text-sm text-muted-foreground">Your withdrawal security settings</p>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
            <Icon 
              name={feature?.icon} 
              size={20} 
              className={getStatusColor(feature?.status)} 
            />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground">{feature?.title}</h4>
              <p className="text-sm text-muted-foreground">{feature?.description}</p>
            </div>
            {feature?.status === 'enabled' && (
              <Icon name="CheckCircle" size={16} className="text-success" />
            )}
          </div>
        ))}
      </div>
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Important Security Reminders</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Always verify destination addresses before submitting</li>
              <li>• Cryptocurrency transactions cannot be reversed</li>
              <li>• Network fees are deducted from your balance</li>
              <li>• Processing times vary by network congestion</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={onEnable2FA}
          iconName="Settings"
          iconPosition="left"
          className="flex-1"
        >
          Security Settings
        </Button>
        <Button
          variant="ghost"
          onClick={() => window.open('#support', '_blank')}
          iconName="HelpCircle"
          iconPosition="left"
          className="flex-1"
        >
          Get Help
        </Button>
      </div>
    </div>
  );
};

export default SecurityNotice;