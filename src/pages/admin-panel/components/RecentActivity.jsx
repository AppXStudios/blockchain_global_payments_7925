import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "merchant_registration",
      title: "New Merchant Registration",
      description: "TechCorp Solutions completed onboarding",
      timestamp: "2 minutes ago",
      icon: "UserPlus",
      iconColor: "text-success"
    },
    {
      id: 2,
      type: "transaction_alert",
      title: "High Volume Transaction",
      description: "Payment of $125,000 processed successfully",
      timestamp: "5 minutes ago",
      icon: "AlertCircle",
      iconColor: "text-warning"
    },
    {
      id: 3,
      type: "system_update",
      title: "System Maintenance",
      description: "Scheduled maintenance completed successfully",
      timestamp: "15 minutes ago",
      icon: "Settings",
      iconColor: "text-primary"
    },
    {
      id: 4,
      type: "security_alert",
      title: "Security Scan Complete",
      description: "Weekly security audit passed all checks",
      timestamp: "1 hour ago",
      icon: "Shield",
      iconColor: "text-success"
    },
    {
      id: 5,
      type: "merchant_suspension",
      title: "Account Suspended",
      description: "Merchant account suspended for policy violation",
      timestamp: "2 hours ago",
      icon: "UserX",
      iconColor: "text-destructive"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <button className="text-sm text-primary hover:text-primary/80 transition-micro">
            View All
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-4">
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${activity?.iconColor}`}>
                <Icon name={activity?.icon} size={18} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity?.title}</p>
                <p className="text-sm text-muted-foreground">{activity?.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity?.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;