import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoicePreviewModal = ({ invoice, isOpen, onClose, onEdit, onSendReminder }) => {
  if (!isOpen || !invoice) return null;

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
      draft: { color: 'bg-muted text-muted-foreground', icon: 'FileEdit' },
      sent: { color: 'bg-blue-500/10 text-blue-400', icon: 'Send' },
      paid: { color: 'bg-success/10 text-success', icon: 'CheckCircle' },
      overdue: { color: 'bg-destructive/10 text-destructive', icon: 'AlertCircle' },
      cancelled: { color: 'bg-muted text-muted-foreground', icon: 'XCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.draft;

    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={14} />
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const generateCheckoutUrl = () => {
    return `${window.location?.origin}/hosted-checkout?invoice=${invoice?.id}`;
  };

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
              <Icon name="FileText" size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Invoice Preview</h2>
              <p className="text-sm text-muted-foreground">{invoice?.invoiceNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusBadge(invoice?.status)}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Invoice Content */}
          <div className="p-8 bg-background">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <Icon name="Zap" size={24} color="white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">BlockPay</h1>
                    <p className="text-sm text-muted-foreground">Global Payments</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>123 Blockchain Street</p>
                  <p>Crypto City, CC 12345</p>
                  <p>support@blockpay.com</p>
                </div>
              </div>
              
              <div className="text-right">
                <h2 className="text-3xl font-bold text-foreground mb-2">INVOICE</h2>
                <p className="text-lg font-semibold text-primary">{invoice?.invoiceNumber}</p>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Date: {formatDate(invoice?.created)}</p>
                  <p>Due: {formatDate(invoice?.dueDate)}</p>
                </div>
              </div>
            </div>

            {/* Bill To Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-3">Bill To:</h3>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="font-semibold text-foreground">{invoice?.customerName}</p>
                <p className="text-muted-foreground">{invoice?.customerEmail}</p>
                {invoice?.customerAddress && (
                  <p className="text-muted-foreground mt-1">{invoice?.customerAddress}</p>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="bg-muted/50 px-6 py-3 border-b border-border">
                  <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-foreground">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Rate</div>
                    <div className="col-span-2 text-right">Amount</div>
                  </div>
                </div>
                
                <div className="divide-y divide-border">
                  {invoice?.lineItems?.map((item, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="grid grid-cols-12 gap-4 text-sm">
                        <div className="col-span-6 text-foreground">{item?.description}</div>
                        <div className="col-span-2 text-center text-muted-foreground">{item?.quantity}</div>
                        <div className="col-span-2 text-center text-muted-foreground">
                          {formatAmount(item?.rate, invoice?.currency)}
                        </div>
                        <div className="col-span-2 text-right font-medium text-foreground">
                          {formatAmount(item?.amount, invoice?.currency)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium text-foreground">
                    {formatAmount(invoice?.subtotal || invoice?.amount, invoice?.currency)}
                  </span>
                </div>
                
                {invoice?.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax:</span>
                    <span className="font-medium text-foreground">
                      {formatAmount(invoice?.tax, invoice?.currency)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span className="text-foreground">Total:</span>
                  <span className="text-primary">
                    {formatAmount(invoice?.total || invoice?.amount, invoice?.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-muted/30 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-3">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment URL:</p>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-background px-2 py-1 rounded border flex-1 truncate">
                      {generateCheckoutUrl()}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(generateCheckoutUrl())}
                    >
                      <Icon name="Copy" size={14} />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Progress:</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-smooth"
                        style={{ width: `${invoice?.paymentProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">{invoice?.paymentProgress}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice?.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-3">Notes:</h3>
                <p className="text-muted-foreground">{invoice?.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
              <p>Thank you for your business!</p>
              <p>For questions about this invoice, contact us at support@blockpay.com</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(generateCheckoutUrl())}
              iconName="Copy"
              iconPosition="left"
            >
              Copy Payment Link
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              iconName="Printer"
              iconPosition="left"
            >
              Print
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            
            {invoice?.status !== 'paid' && invoice?.status !== 'cancelled' && (
              <Button
                variant="secondary"
                onClick={() => onSendReminder(invoice)}
                iconName="Send"
                iconPosition="left"
              >
                Send Reminder
              </Button>
            )}
            
            <Button
              variant="default"
              onClick={() => onEdit(invoice)}
              iconName="Edit"
              iconPosition="left"
              className="gradient-primary"
            >
              Edit Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewModal;