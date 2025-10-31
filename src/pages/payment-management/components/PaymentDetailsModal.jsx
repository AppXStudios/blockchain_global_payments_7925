import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import PaymentStatusBadge from './PaymentStatusBadge';

const PaymentDetailsModal = ({ isOpen, onClose, payment }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen || !payment) return null;

  const handleCopyToClipboard = async (text) => {
    try {
      await navigator.clipboard?.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatAmount = (amount, currency) => {
    return `${parseFloat(amount)?.toFixed(8)} ${currency}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  const mockTransactionHistory = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 300000)?.toISOString(),
      event: 'Payment Created',
      description: 'Payment request generated and sent to customer',
      status: 'info'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 240000)?.toISOString(),
      event: 'Email Sent',
      description: 'Payment notification sent to customer@example.com',
      status: 'success'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 180000)?.toISOString(),
      event: 'Payment Viewed',
      description: 'Customer opened the payment page',
      status: 'info'
    }
  ];

  const tabs = [
    { id: 'details', label: 'Payment Details', icon: 'FileText' },
    { id: 'history', label: 'Transaction History', icon: 'Clock' },
    { id: 'customer', label: 'Customer Info', icon: 'User' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="CreditCard" size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Payment Details
              </h2>
              <p className="text-sm text-muted-foreground">
                Transaction ID: {payment?.transactionId}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <PaymentStatusBadge status={payment?.status} />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`
                  flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-micro
                  ${activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Payment Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Payment Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Amount
                      </label>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {formatAmount(payment?.amount, payment?.currency)}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Description
                      </label>
                      <p className="text-sm text-foreground mt-1">
                        {payment?.description || 'No description provided'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Created
                      </label>
                      <p className="text-sm text-foreground mt-1">
                        {formatDate(payment?.createdAt)}
                      </p>
                    </div>
                    
                    {payment?.expiresAt && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Expires
                        </label>
                        <p className="text-sm text-foreground mt-1">
                          {formatDate(payment?.expiresAt)}
                        </p>
                        <p className="text-xs text-warning mt-1">
                          {getTimeRemaining(payment?.expiresAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Payment Address</h3>
                  
                  <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Deposit Address
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-mono text-foreground break-all">
                          {payment?.depositAddress}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 flex-shrink-0"
                          onClick={() => handleCopyToClipboard(payment?.depositAddress)}
                        >
                          <Icon name="Copy" size={12} />
                        </Button>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="inline-block p-4 bg-white rounded-lg">
                        <img 
                          src={payment?.qrCode} 
                          alt="QR code for cryptocurrency payment address"
                          className="w-32 h-32"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        QR Code for easy payment
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment URL */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Payment URL
                </label>
                <div className="flex items-center space-x-2 mt-1 p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-primary break-all flex-1">
                    {payment?.paymentUrl}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 flex-shrink-0"
                    onClick={() => handleCopyToClipboard(payment?.paymentUrl)}
                  >
                    <Icon name="Copy" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 flex-shrink-0"
                    onClick={() => window.open(payment?.paymentUrl, '_blank')}
                  >
                    <Icon name="ExternalLink" size={14} />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
              
              <div className="space-y-3">
                {mockTransactionHistory?.map((event) => (
                  <div key={event?.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                      ${event?.status === 'success' ? 'bg-success/10' : 
                        event?.status === 'warning' ? 'bg-warning/10' : 'bg-primary/10'}
                    `}>
                      <Icon 
                        name={
                          event?.status === 'success' ? 'CheckCircle' :
                          event?.status === 'warning' ? 'AlertCircle' : 'Info'
                        }
                        size={16}
                        className={
                          event?.status === 'success' ? 'text-success' :
                          event?.status === 'warning' ? 'text-warning' : 'text-primary'
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground">{event?.event}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(event?.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'customer' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Customer Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Email Address
                    </label>
                    <p className="text-sm text-foreground mt-1">
                      {payment?.customerEmail}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Customer Name
                    </label>
                    <p className="text-sm text-foreground mt-1">
                      {payment?.customerName || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    iconName="Mail"
                    iconPosition="left"
                    fullWidth
                  >
                    Send Reminder Email
                  </Button>
                  
                  <Button
                    variant="outline"
                    iconName="MessageSquare"
                    iconPosition="left"
                    fullWidth
                  >
                    Send SMS Notification
                  </Button>
                  
                  <Button
                    variant="outline"
                    iconName="ExternalLink"
                    iconPosition="left"
                    fullWidth
                    onClick={() => window.open(payment?.paymentUrl, '_blank')}
                  >
                    Open Payment Page
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border p-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
            >
              Export Details
            </Button>
            {payment?.status === 'pending' && (
              <Button
                variant="destructive"
                iconName="XCircle"
                iconPosition="left"
              >
                Cancel Payment
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;