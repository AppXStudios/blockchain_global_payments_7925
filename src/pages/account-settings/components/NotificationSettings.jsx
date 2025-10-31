import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const NotificationSettings = () => {
  const [emailSettings, setEmailSettings] = useState({
    paymentReceived: true,
    paymentFailed: true,
    withdrawalCompleted: true,
    withdrawalFailed: false,
    invoiceCreated: true,
    invoicePaid: true,
    systemUpdates: false,
    securityAlerts: true,
    weeklyReports: true,
    monthlyReports: false
  });

  const [smsSettings, setSmsSettings] = useState({
    paymentReceived: false,
    paymentFailed: true,
    withdrawalCompleted: true,
    withdrawalFailed: true,
    securityAlerts: true,
    systemCritical: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const emailNotifications = [
    {
      id: 'paymentReceived',
      title: 'Payment Received',
      description: 'When a customer completes a payment',
      category: 'Payments'
    },
    {
      id: 'paymentFailed',
      title: 'Payment Failed',
      description: 'When a payment fails or expires',
      category: 'Payments'
    },
    {
      id: 'invoiceCreated',
      title: 'Invoice Created',
      description: 'When a new invoice is generated',
      category: 'Invoices'
    },
    {
      id: 'invoicePaid',
      title: 'Invoice Paid',
      description: 'When an invoice is successfully paid',
      category: 'Invoices'
    },
    {
      id: 'withdrawalCompleted',
      title: 'Withdrawal Completed',
      description: 'When a withdrawal is processed successfully',
      category: 'Withdrawals'
    },
    {
      id: 'withdrawalFailed',
      title: 'Withdrawal Failed',
      description: 'When a withdrawal fails or is rejected',
      category: 'Withdrawals'
    },
    {
      id: 'securityAlerts',
      title: 'Security Alerts',
      description: 'Login attempts, API key usage, and security events',
      category: 'Security'
    },
    {
      id: 'systemUpdates',
      title: 'System Updates',
      description: 'Platform updates and maintenance notifications',
      category: 'System'
    },
    {
      id: 'weeklyReports',
      title: 'Weekly Reports',
      description: 'Weekly summary of transactions and performance',
      category: 'Reports'
    },
    {
      id: 'monthlyReports',
      title: 'Monthly Reports',
      description: 'Monthly business analytics and insights',
      category: 'Reports'
    }
  ];

  const smsNotifications = [
    {
      id: 'paymentReceived',
      title: 'Payment Received',
      description: 'High-value payments only',
      category: 'Payments'
    },
    {
      id: 'paymentFailed',
      title: 'Payment Failed',
      description: 'Critical payment failures',
      category: 'Payments'
    },
    {
      id: 'withdrawalCompleted',
      title: 'Withdrawal Completed',
      description: 'All withdrawal confirmations',
      category: 'Withdrawals'
    },
    {
      id: 'withdrawalFailed',
      title: 'Withdrawal Failed',
      description: 'Failed withdrawal attempts',
      category: 'Withdrawals'
    },
    {
      id: 'securityAlerts',
      title: 'Security Alerts',
      description: 'Suspicious activity and login alerts',
      category: 'Security'
    },
    {
      id: 'systemCritical',
      title: 'Critical System Alerts',
      description: 'System outages and critical issues',
      category: 'System'
    }
  ];

  const handleEmailChange = (id, checked) => {
    setEmailSettings(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleSmsChange = (id, checked) => {
    setSmsSettings(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const groupNotificationsByCategory = (notifications) => {
    return notifications?.reduce((groups, notification) => {
      const category = notification?.category;
      if (!groups?.[category]) {
        groups[category] = [];
      }
      groups?.[category]?.push(notification);
      return groups;
    }, {});
  };

  const emailGroups = groupNotificationsByCategory(emailNotifications);
  const smsGroups = groupNotificationsByCategory(smsNotifications);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Configure how you want to receive notifications about your account activity
          </p>
        </div>
        <Button
          variant="default"
          loading={isSaving}
          iconName="Save"
          iconPosition="left"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
      {/* Email Notifications */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="Mail" size={20} className="text-primary" />
          </div>
          <div>
            <h4 className="text-md font-medium text-foreground">Email Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Receive notifications via email at admin@techcorp.com
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(emailGroups)?.map(([category, notifications]) => (
            <div key={category}>
              <h5 className="text-sm font-medium text-foreground mb-3">{category}</h5>
              <div className="space-y-3">
                {notifications?.map((notification) => (
                  <div key={notification?.id} className="flex items-start space-x-3">
                    <Checkbox
                      checked={emailSettings?.[notification?.id]}
                      onChange={(e) => handleEmailChange(notification?.id, e?.target?.checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{notification?.title}</p>
                      <p className="text-xs text-muted-foreground">{notification?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* SMS Notifications */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Icon name="MessageSquare" size={20} className="text-secondary" />
          </div>
          <div>
            <h4 className="text-md font-medium text-foreground">SMS Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Receive critical alerts via SMS at +1 (555) 123-4567
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(smsGroups)?.map(([category, notifications]) => (
            <div key={category}>
              <h5 className="text-sm font-medium text-foreground mb-3">{category}</h5>
              <div className="space-y-3">
                {notifications?.map((notification) => (
                  <div key={notification?.id} className="flex items-start space-x-3">
                    <Checkbox
                      checked={smsSettings?.[notification?.id]}
                      onChange={(e) => handleSmsChange(notification?.id, e?.target?.checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{notification?.title}</p>
                      <p className="text-xs text-muted-foreground">{notification?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Notification Frequency */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Icon name="Clock" size={20} className="text-accent" />
          </div>
          <div>
            <h4 className="text-md font-medium text-foreground">Delivery Settings</h4>
            <p className="text-sm text-muted-foreground">
              Configure when and how often you receive notifications
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-foreground">Email Frequency</h5>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="emailFrequency"
                  value="instant"
                  defaultChecked
                  className="w-4 h-4 text-primary bg-background border-border focus:ring-primary"
                />
                <span className="text-sm text-foreground">Instant notifications</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="emailFrequency"
                  value="hourly"
                  className="w-4 h-4 text-primary bg-background border-border focus:ring-primary"
                />
                <span className="text-sm text-foreground">Hourly digest</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="emailFrequency"
                  value="daily"
                  className="w-4 h-4 text-primary bg-background border-border focus:ring-primary"
                />
                <span className="text-sm text-foreground">Daily summary</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-medium text-foreground">Quiet Hours</h5>
            <div className="space-y-2">
              <Checkbox
                label="Enable quiet hours"
                description="Pause non-critical notifications during specified hours"
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="text-xs text-muted-foreground">From</label>
                  <input
                    type="time"
                    defaultValue="22:00"
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">To</label>
                  <input
                    type="time"
                    defaultValue="08:00"
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;