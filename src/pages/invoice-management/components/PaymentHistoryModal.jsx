import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentHistoryModal = ({ invoice, isOpen, onClose }) => {
  if (!isOpen || !invoice) return null;

  // Mock payment history data
  const paymentHistory = [
    {
      id: 1,
      date: '2024-10-30T14:30:00Z',
      amount: 250.00,
      currency: 'USD',
      method: 'Bitcoin',
      status: 'completed',
      transactionId: 'tx_1a2b3c4d5e6f',
      confirmations: 6,
      blockHash: '0x1234567890abcdef...',
      notes: 'Partial payment received'
    },
    {
      id: 2,
      date: '2024-10-28T09:15:00Z',
      amount: 150.00,
      currency: 'USD',
      method: 'Ethereum',
      status: 'completed',
      transactionId: 'tx_9z8y7x6w5v4u',
      confirmations: 12,
      blockHash: '0xfedcba0987654321...',
      notes: 'Initial payment'
    },
    {
      id: 3,
      date: '2024-10-25T16:45:00Z',
      amount: 100.00,
      currency: 'USD',
      method: 'USDT',
      status: 'pending',
      transactionId: 'tx_3t2s1r0q9p8o',
      confirmations: 2,
      blockHash: null,
      notes: 'Awaiting confirmations'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    })?.format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-success/10 text-success', icon: 'CheckCircle' },
      pending: { color: 'bg-warning/10 text-warning', icon: 'Clock' },
      failed: { color: 'bg-destructive/10 text-destructive', icon: 'XCircle' },
      cancelled: { color: 'bg-muted text-muted-foreground', icon: 'Minus' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const getMethodIcon = (method) => {
    const methodIcons = {
      'Bitcoin': 'Bitcoin',
      'Ethereum': 'Ethereum',
      'USDT': 'DollarSign',
      'Litecoin': 'Coins',
      'Cardano': 'Heart',
      'Polkadot': 'Circle'
    };

    return methodIcons?.[method] || 'CreditCard';
  };

  const totalPaid = paymentHistory?.filter(payment => payment?.status === 'completed')?.reduce((sum, payment) => sum + payment?.amount, 0);

  const remainingAmount = (invoice?.total || invoice?.amount) - totalPaid;

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="History" size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Payment History</h2>
              <p className="text-sm text-muted-foreground">{invoice?.invoiceNumber}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Payment Summary */}
          <div className="p-6 border-b border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="DollarSign" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Total Invoice</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {formatAmount(invoice?.total || invoice?.amount, invoice?.currency)}
                </p>
              </div>

              <div className="bg-success/10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm font-medium text-foreground">Total Paid</span>
                </div>
                <p className="text-2xl font-bold text-success">
                  {formatAmount(totalPaid, invoice?.currency)}
                </p>
              </div>

              <div className="bg-warning/10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Clock" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-foreground">Remaining</span>
                </div>
                <p className="text-2xl font-bold text-warning">
                  {formatAmount(remainingAmount, invoice?.currency)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Transaction History</h3>
            
            {paymentHistory?.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No payments received yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop View */}
                <div className="hidden md:block">
                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="bg-muted/50 px-6 py-3 border-b border-border">
                      <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-foreground">
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2">Amount</div>
                        <div className="col-span-2">Method</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-3">Transaction ID</div>
                        <div className="col-span-1">Actions</div>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-border">
                      {paymentHistory?.map((payment) => (
                        <div key={payment?.id} className="px-6 py-4 hover:bg-muted/30 transition-micro">
                          <div className="grid grid-cols-12 gap-4 items-center text-sm">
                            <div className="col-span-2 text-foreground">
                              {formatDate(payment?.date)}
                            </div>
                            <div className="col-span-2">
                              <span className="font-semibold text-foreground">
                                {formatAmount(payment?.amount, payment?.currency)}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center space-x-2">
                                <Icon name={getMethodIcon(payment?.method)} size={16} className="text-primary" />
                                <span className="text-foreground">{payment?.method}</span>
                              </div>
                            </div>
                            <div className="col-span-2">
                              {getStatusBadge(payment?.status)}
                            </div>
                            <div className="col-span-3">
                              <div className="flex items-center space-x-2">
                                <code className="text-xs bg-muted px-2 py-1 rounded font-mono truncate max-w-32">
                                  {payment?.transactionId}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyToClipboard(payment?.transactionId)}
                                >
                                  <Icon name="Copy" size={12} />
                                </Button>
                              </div>
                            </div>
                            <div className="col-span-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(`https://blockchain.info/tx/${payment?.transactionId}`, '_blank')}
                              >
                                <Icon name="ExternalLink" size={14} />
                              </Button>
                            </div>
                          </div>
                          
                          {payment?.notes && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              <Icon name="MessageSquare" size={12} className="inline mr-1" />
                              {payment?.notes}
                            </div>
                          )}
                          
                          {payment?.confirmations !== undefined && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              <Icon name="Shield" size={12} className="inline mr-1" />
                              {payment?.confirmations} confirmations
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                  {paymentHistory?.map((payment) => (
                    <div key={payment?.id} className="bg-card rounded-lg border border-border p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon name={getMethodIcon(payment?.method)} size={16} className="text-primary" />
                          <span className="font-medium text-foreground">{payment?.method}</span>
                        </div>
                        {getStatusBadge(payment?.status)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Amount:</span>
                          <span className="text-sm font-semibold text-foreground">
                            {formatAmount(payment?.amount, payment?.currency)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Date:</span>
                          <span className="text-sm text-foreground">{formatDate(payment?.date)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Transaction:</span>
                          <div className="flex items-center space-x-1">
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                              {payment?.transactionId?.substring(0, 12)}...
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(payment?.transactionId)}
                            >
                              <Icon name="Copy" size={12} />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {payment?.notes && (
                        <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2">
                          <Icon name="MessageSquare" size={12} className="inline mr-1" />
                          {payment?.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryModal;