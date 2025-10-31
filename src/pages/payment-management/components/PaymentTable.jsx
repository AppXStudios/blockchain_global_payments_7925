import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import PaymentStatusBadge from './PaymentStatusBadge';
import { formatCurrency } from '../../../lib/utils/formatCurrency';

const PaymentTable = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Mock payment data
  const payments = [
    {
      id: 'PAY-001',
      amount: 1250.00,
      currency: 'USD',
      cryptoAmount: 0.031245,
      cryptoCurrency: 'BTC',
      status: 'completed',
      customer: 'john@example.com',
      date: '2024-10-30T14:30:00Z',
      confirmations: 6,
      txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890'
    },
    {
      id: 'PAY-002',
      amount: 750.50,
      currency: 'ETH',
      cryptoAmount: 0.45123,
      cryptoCurrency: 'ETH',
      status: 'pending',
      customer: 'jane@example.com',
      date: '2024-10-30T12:15:00Z',
      confirmations: 2,
      txHash: '0x9876543210abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    },
    {
      id: 'PAY-003',
      amount: 2100.00,
      currency: 'USD',
      cryptoAmount: 1.25678,
      cryptoCurrency: 'USDT',
      status: 'failed',
      customer: 'mike@example.com',
      date: '2024-10-29T16:45:00Z',
      confirmations: 0,
      txHash: null
    }
  ];

  const openPaymentDetailsModal = (payment) => {
    // ✅ FIXED — Navigate to correct /dashboard/payments/{id} route instead of modal
    navigate(`/dashboard/payments/${payment?.id}`);
  };

  const openCreatePaymentModal = () => {
    // ✅ FIXED — Navigate to correct /dashboard/payments/create route
    navigate('/dashboard/payments/create');
  };

  const openPaymentHistoryModal = () => {
    // Mock modal trigger - in real implementation, this would open the PaymentHistoryModal
    console.log('Opening PaymentHistoryModal');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recent Payments</h2>
            <p className="text-sm text-muted-foreground">Track all your payment transactions</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openPaymentHistoryModal}
              iconName="History"
              iconPosition="left"
            >
              View History
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={openCreatePaymentModal}
              className="gradient-primary"
              iconName="Plus"
              iconPosition="left"
            >
              Create Payment
            </Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Payment ID</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Customer</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-right py-3 px-6 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((payment) => {
              // ✅ Apply failsafe patch - convert to uppercase and fallback to USD
              const safeCurrency = (payment?.currency || "USD")?.toUpperCase();
              const safeCryptoCurrency = (payment?.cryptoCurrency || "BTC")?.toUpperCase();
              
              return (
                <tr 
                  key={payment?.id} 
                  className="border-b border-border hover:bg-muted/50 transition-smooth cursor-pointer"
                  onClick={() => navigate(`/dashboard/payments/${payment?.id}`)}
                >
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-foreground">{payment?.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(payment?.amount, safeCurrency)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {payment?.cryptoAmount} {safeCryptoCurrency}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-foreground">{payment?.customer}</span>
                  </td>
                  <td className="py-4 px-6">
                    <PaymentStatusBadge status={payment?.status} />
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-muted-foreground">
                      {new Date(payment?.date)?.toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation();
                          navigate(`/dashboard/payments/${payment?.id}`);
                        }}
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;