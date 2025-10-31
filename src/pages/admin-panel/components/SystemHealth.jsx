import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemHealth = () => {
  const healthMetrics = [
    {
      id: 1,
      service: "Payment API",
      status: "operational",
      uptime: "99.98%",
      responseTime: "142ms",
      lastCheck: "30 seconds ago"
    },
    {
      id: 2,
      service: "Webhook Service",
      status: "operational",
      uptime: "99.95%",
      responseTime: "89ms",
      lastCheck: "1 minute ago"
    },
    {
      id: 3,
      service: "Custody Integration",
      status: "operational",
      uptime: "99.99%",
      responseTime: "234ms",
      lastCheck: "45 seconds ago"
    },
    {
      id: 4,
      service: "Database",
      status: "degraded",
      uptime: "99.87%",
      responseTime: "456ms",
      lastCheck: "2 minutes ago"
    },
    {
      id: 5,
      service: "Email Service",
      status: "operational",
      uptime: "99.92%",
      responseTime: "178ms",
      lastCheck: "1 minute ago"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-success';
      case 'degraded':
        return 'text-warning';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return 'CheckCircle';
      case 'degraded':
        return 'AlertTriangle';
      case 'down':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">System Health</h3>
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={16} className="text-success" />
            <span className="text-sm text-success font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {healthMetrics?.map((metric) => (
            <div key={metric?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={getStatusIcon(metric?.status)} 
                  size={20} 
                  className={getStatusColor(metric?.status)}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{metric?.service}</p>
                  <p className="text-xs text-muted-foreground">Last check: {metric?.lastCheck}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Uptime: </span>
                    <span className="text-foreground font-medium">{metric?.uptime}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Response: </span>
                    <span className="text-foreground font-medium">{metric?.responseTime}</span>
                  </div>
                </div>
                <p className={`text-xs font-medium capitalize ${getStatusColor(metric?.status)}`}>
                  {metric?.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;