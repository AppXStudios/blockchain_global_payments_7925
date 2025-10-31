import React, { useState, useEffect } from 'react';
import MainSidebar from '../../components/ui/MainSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PaymentFilters from './components/PaymentFilters';
import PaymentTable from './components/PaymentTable';
import CreatePaymentModal from './components/CreatePaymentModal';
import PaymentDetailsModal from './components/PaymentDetailsModal';

const PaymentManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [filters, setFilters] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock payment data
  const mockPayments = [
    {
      id: 'pay_001',
      transactionId: 'TXN7K9M2P4Q1',
      amount: '0.00125000',
      currency: 'BTC',
      customerEmail: 'alice.johnson@techcorp.com',
      customerName: 'Alice Johnson',
      description: 'Premium subscription payment for Q4 2024',
      status: 'completed',
      depositAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      paymentUrl: 'https://checkout.blockpay.com/pay/001',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)?.toISOString(),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)?.toISOString()
    },
    {
      id: 'pay_002',
      transactionId: 'TXN3H8L5N9R2',
      amount: '150.000000',
      currency: 'USDT',
      customerEmail: 'bob.smith@retailplus.com',
      customerName: 'Bob Smith',
      description: 'Bulk inventory purchase - Electronics batch #2024-10',
      status: 'pending',
      depositAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF',
      paymentUrl: 'https://checkout.blockpay.com/pay/002',
      expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000)?.toISOString(),
      createdAt: new Date(Date.now() - 45 * 60 * 1000)?.toISOString()
    },
    {
      id: 'pay_003',
      transactionId: 'TXN9B4F7X1M6',
      amount: '2.50000000',
      currency: 'ETH',
      customerEmail: 'carol.davis@designstudio.io',
      customerName: 'Carol Davis',
      description: 'Website redesign project - Final milestone payment',
      status: 'processing',
      depositAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF',
      paymentUrl: 'https://checkout.blockpay.com/pay/003',
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000)?.toISOString(),
      createdAt: new Date(Date.now() - 30 * 60 * 1000)?.toISOString()
    },
    {
      id: 'pay_004',
      transactionId: 'TXN6D2K8W5T3',
      amount: '75.000000',
      currency: 'USDC',
      customerEmail: 'david.wilson@consultancy.biz',
      customerName: 'David Wilson',
      description: 'Business consultation services - October 2024',
      status: 'expired',
      depositAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF',
      paymentUrl: 'https://checkout.blockpay.com/pay/004',
      expiresAt: new Date(Date.now() - 2 * 60 * 60 * 1000)?.toISOString(),
      createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000)?.toISOString()
    },
    {
      id: 'pay_005',
      transactionId: 'TXN1Y7P3Z9Q4',
      amount: '0.05000000',
      currency: 'LTC',
      customerEmail: 'emma.brown@startup.tech',
      customerName: 'Emma Brown',
      description: 'SaaS platform subscription - Annual plan',
      status: 'failed',
      depositAddress: 'LTC1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LTC1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
      paymentUrl: 'https://checkout.blockpay.com/pay/005',
      expiresAt: new Date(Date.now() - 1 * 60 * 60 * 1000)?.toISOString(),
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)?.toISOString()
    },
    {
      id: 'pay_006',
      transactionId: 'TXN8V5C2N7L1',
      amount: '500.000000',
      currency: 'USDT',
      customerEmail: 'frank.miller@enterprise.com',
      customerName: 'Frank Miller',
      description: 'Enterprise software license - Multi-year agreement',
      status: 'completed',
      depositAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF',
      paymentUrl: 'https://checkout.blockpay.com/pay/006',
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000)?.toISOString(),
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)?.toISOString()
    },
    {
      id: 'pay_007',
      transactionId: 'TXN4R9S6E3A8',
      amount: '0.75000000',
      currency: 'ETH',
      customerEmail: 'grace.lee@marketing.agency',
      customerName: 'Grace Lee',
      description: 'Digital marketing campaign - Social media package',
      status: 'pending',
      depositAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF',
      paymentUrl: 'https://checkout.blockpay.com/pay/007',
      expiresAt: new Date(Date.now() + 36 * 60 * 60 * 1000)?.toISOString(),
      createdAt: new Date(Date.now() - 15 * 60 * 1000)?.toISOString()
    },
    {
      id: 'pay_008',
      transactionId: 'TXN2M1J4U7I9',
      amount: '0.00250000',
      currency: 'BTC',
      customerEmail: 'henry.garcia@freelance.dev',
      customerName: 'Henry Garcia',
      description: 'Mobile app development - Phase 2 completion',
      status: 'completed',
      depositAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      paymentUrl: 'https://checkout.blockpay.com/pay/008',
      expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000)?.toISOString(),
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)?.toISOString()
    }
  ];

  useEffect(() => {
    // Simulate loading payments
    const loadPayments = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
      setIsLoading(false);
    };

    loadPayments();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...payments];

    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(payment => 
        payment?.transactionId?.toLowerCase()?.includes(searchTerm) ||
        payment?.customerEmail?.toLowerCase()?.includes(searchTerm) ||
        payment?.customerName?.toLowerCase()?.includes(searchTerm) ||
        payment?.description?.toLowerCase()?.includes(searchTerm)
      );
    }

    if (filters?.status) {
      filtered = filtered?.filter(payment => payment?.status === filters?.status);
    }

    if (filters?.currency) {
      filtered = filtered?.filter(payment => payment?.currency === filters?.currency);
    }

    if (filters?.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered?.filter(payment => new Date(payment.createdAt) >= fromDate);
    }

    if (filters?.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate?.setHours(23, 59, 59, 999);
      filtered = filtered?.filter(payment => new Date(payment.createdAt) <= toDate);
    }

    if (filters?.amountMin) {
      filtered = filtered?.filter(payment => parseFloat(payment?.amount) >= parseFloat(filters?.amountMin));
    }

    if (filters?.amountMax) {
      filtered = filtered?.filter(payment => parseFloat(payment?.amount) <= parseFloat(filters?.amountMax));
    }

    setFilteredPayments(filtered);
  }, [filters, payments]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCreatePayment = (newPayment) => {
    setPayments(prev => [newPayment, ...prev]);
  };

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  const handleBulkAction = (action, paymentIds) => {
    console.log(`Bulk action: ${action}`, paymentIds);
    // Implement bulk actions here
  };

  const getStatusCounts = () => {
    return {
      total: payments?.length,
      pending: payments?.filter(p => p?.status === 'pending')?.length,
      completed: payments?.filter(p => p?.status === 'completed')?.length,
      expired: payments?.filter(p => p?.status === 'expired')?.length,
      failed: payments?.filter(p => p?.status === 'failed')?.length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Payment Management</h1>
              <p className="text-muted-foreground">
                Create, track, and manage cryptocurrency payment requests
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                Export All
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full sm:w-auto gradient-primary"
              >
                Create Payment
              </Button>
            </div>
          </div>

          {/* Status Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="CreditCard" size={16} className="text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{statusCounts?.total}</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Clock" size={16} className="text-warning" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Pending
                </span>
              </div>
              <p className="text-2xl font-bold text-warning">{statusCounts?.pending}</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Completed
                </span>
              </div>
              <p className="text-2xl font-bold text-success">{statusCounts?.completed}</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="XCircle" size={16} className="text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Expired
                </span>
              </div>
              <p className="text-2xl font-bold text-muted-foreground">{statusCounts?.expired}</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertCircle" size={16} className="text-destructive" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Failed
                </span>
              </div>
              <p className="text-2xl font-bold text-destructive">{statusCounts?.failed}</p>
            </div>
          </div>

          {/* Filters */}
          <PaymentFilters 
            onFiltersChange={handleFiltersChange}
            resultsCount={filteredPayments?.length}
          />

          {/* Payments Table */}
          {isLoading ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <Icon name="Loader" size={48} className="mx-auto text-muted-foreground mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-foreground mb-2">Loading payments...</h3>
              <p className="text-muted-foreground">Please wait while we fetch your payment data.</p>
            </div>
          ) : (
            <PaymentTable
              payments={filteredPayments}
              onPaymentSelect={handlePaymentSelect}
              onBulkAction={handleBulkAction}
            />
          )}
        </div>
      </main>
      {/* Modals */}
      <CreatePaymentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreatePayment={handleCreatePayment}
      />
      <PaymentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        payment={selectedPayment}
      />
    </div>
  );
};

export default PaymentManagement;