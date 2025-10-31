import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsOverview = () => {
  const metrics = [
    {
      id: 1,
      title: "Total Merchants",
      value: "2,847",
      change: "+12.5%",
      changeType: "positive",
      icon: "Users",
      description: "Active merchant accounts"
    },
    {
      id: 2,
      title: "Transaction Volume",
      value: "$45.2M",
      change: "+8.3%",
      changeType: "positive",
      icon: "TrendingUp",
      description: "Last 30 days"
    },
    {
      id: 3,
      title: "Platform Revenue",
      value: "$892K",
      change: "+15.7%",
      changeType: "positive",
      icon: "DollarSign",
      description: "Monthly recurring revenue"
    },
    {
      id: 4,
      title: "System Uptime",
      value: "99.97%",
      change: "+0.02%",
      changeType: "positive",
      icon: "Activity",
      description: "Last 30 days average"
    },
    {
      id: 5,
      title: "Failed Transactions",
      value: "0.23%",
      change: "-0.05%",
      changeType: "positive",
      icon: "AlertTriangle",
      description: "Error rate this month"
    },
    {
      id: 6,
      title: "Support Tickets",
      value: "127",
      change: "-18.2%",
      changeType: "positive",
      icon: "HelpCircle",
      description: "Open tickets"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics?.map((metric) => (
        <div
          key={metric?.id}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-smooth"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              metric?.changeType === 'positive' ? 'bg-success/10' : 'bg-destructive/10'
            }`}>
              <Icon 
                name={metric?.icon} 
                size={24} 
                className={metric?.changeType === 'positive' ? 'text-success' : 'text-destructive'}
              />
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              metric?.changeType === 'positive' ? 'text-success' : 'text-destructive'
            }`}>
              <Icon 
                name={metric?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
              />
              <span>{metric?.change}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">{metric?.value}</h3>
            <p className="text-sm font-medium text-foreground">{metric?.title}</p>
            <p className="text-xs text-muted-foreground">{metric?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsOverview;