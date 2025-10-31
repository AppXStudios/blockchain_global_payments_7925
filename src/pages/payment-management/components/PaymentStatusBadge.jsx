import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentStatusBadge = ({ status, size = 'default' }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          label: 'Pending',
          icon: 'Clock',
          className: 'bg-warning/10 text-warning border-warning/20',
          iconColor: 'text-warning'
        };
      case 'completed':
        return {
          label: 'Completed',
          icon: 'CheckCircle',
          className: 'bg-success/10 text-success border-success/20',
          iconColor: 'text-success'
        };
      case 'expired':
        return {
          label: 'Expired',
          icon: 'XCircle',
          className: 'bg-muted text-muted-foreground border-muted',
          iconColor: 'text-muted-foreground'
        };
      case 'failed':
        return {
          label: 'Failed',
          icon: 'AlertCircle',
          className: 'bg-destructive/10 text-destructive border-destructive/20',
          iconColor: 'text-destructive'
        };
      case 'processing':
        return {
          label: 'Processing',
          icon: 'Loader',
          className: 'bg-primary/10 text-primary border-primary/20',
          iconColor: 'text-primary'
        };
      default:
        return {
          label: 'Unknown',
          icon: 'HelpCircle',
          className: 'bg-muted text-muted-foreground border-muted',
          iconColor: 'text-muted-foreground'
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <div className={`
      inline-flex items-center space-x-1.5 rounded-full border font-medium
      ${config?.className} ${sizeClasses}
    `}>
      <Icon 
        name={config?.icon} 
        size={iconSize} 
        className={`${config?.iconColor} ${status === 'processing' ? 'animate-spin' : ''}`}
      />
      <span>{config?.label}</span>
    </div>
  );
};

export default PaymentStatusBadge;