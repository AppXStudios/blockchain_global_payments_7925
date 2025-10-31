import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertNotifications = ({ alerts, onDismiss }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'border-warning bg-warning/10 text-warning';
      case 'error': return 'border-destructive bg-destructive/10 text-destructive';
      case 'info': return 'border-primary bg-primary/10 text-primary';
      case 'success': return 'border-success bg-success/10 text-success';
      default: return 'border-muted bg-muted/10 text-muted-foreground';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      case 'info': return 'Info';
      case 'success': return 'CheckCircle';
      default: return 'Bell';
    }
  };

  const handleDismiss = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    if (onDismiss) {
      onDismiss(alertId);
    }
  };

  const visibleAlerts = alerts?.filter(alert => !dismissedAlerts?.has(alert?.id));

  if (visibleAlerts?.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {visibleAlerts?.map((alert) => (
        <div
          key={alert?.id}
          className={`border rounded-lg p-4 ${getAlertColor(alert?.type)} transition-smooth`}
        >
          <div className="flex items-start space-x-3">
            <Icon 
              name={getAlertIcon(alert?.type)} 
              size={20} 
              className="flex-shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold mb-1">{alert?.title}</h4>
              <p className="text-sm opacity-90">{alert?.message}</p>
              {alert?.action && (
                <div className="mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={alert?.action?.onClick}
                    className="text-current hover:bg-current/10"
                  >
                    {alert?.action?.label}
                    <Icon name="ArrowRight" size={14} className="ml-1" />
                  </Button>
                </div>
              )}
            </div>
            {alert?.dismissible !== false && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDismiss(alert?.id)}
                className="text-current hover:bg-current/10 flex-shrink-0"
              >
                <Icon name="X" size={16} />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertNotifications;