import React, { useState, useEffect, useMemo } from 'react';
import MainSidebar from '../../components/ui/MainSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import InvoiceTable from './components/InvoiceTable';
import CreateInvoiceModal from './components/CreateInvoiceModal';
import InvoiceFilters from './components/InvoiceFilters';
import InvoicePreviewModal from './components/InvoicePreviewModal';
import PaymentHistoryModal from './components/PaymentHistoryModal';

const InvoiceManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filters, setFilters] = useState({});
  const [invoices, setInvoices] = useState([]);

  // Mock invoice data
  const mockInvoices = [
    {
      id: 'inv_001',
      invoiceNumber: 'INV-2024-001',
      customerName: 'Acme Corporation',
      customerEmail: 'billing@acme.com',
      customerAddress: '123 Business Ave, Suite 100\nNew York, NY 10001',
      amount: 2500.00,
      currency: 'USD',
      status: 'paid',
      created: '2024-10-15T10:00:00Z',
      dueDate: '2024-11-15T00:00:00Z',
      paymentProgress: 100,
      lineItems: [
        { description: 'Web Development Services', quantity: 40, rate: 50.00, amount: 2000.00 },
        { description: 'Domain Registration', quantity: 1, rate: 15.00, amount: 15.00 },
        { description: 'SSL Certificate', quantity: 1, rate: 99.00, amount: 99.00 }
      ],
      subtotal: 2114.00,
      tax: 211.40,
      total: 2325.40,
      notes: 'Thank you for choosing our services. Payment due within 30 days.',
      isRecurring: false
    },
    {
      id: 'inv_002',
      invoiceNumber: 'INV-2024-002',
      customerName: 'TechStart Inc.',
      customerEmail: 'finance@techstart.io',
      customerAddress: '456 Innovation Drive\nSan Francisco, CA 94105',
      amount: 1800.00,
      currency: 'USD',
      status: 'sent',
      created: '2024-10-20T14:30:00Z',
      dueDate: '2024-11-20T00:00:00Z',
      paymentProgress: 45,
      lineItems: [
        { description: 'Mobile App Development', quantity: 30, rate: 60.00, amount: 1800.00 }
      ],
      subtotal: 1800.00,
      tax: 0,
      total: 1800.00,
      notes: 'Monthly development retainer for Q4 2024.',
      isRecurring: true,
      recurringInterval: 'monthly'
    },
    {
      id: 'inv_003',
      invoiceNumber: 'INV-2024-003',
      customerName: 'Global Enterprises Ltd.',
      customerEmail: 'accounts@globalent.com',
      customerAddress: '789 Corporate Blvd\nLondon, UK EC1A 1BB',
      amount: 5200.00,
      currency: 'EUR',
      status: 'overdue',
      created: '2024-09-25T09:15:00Z',
      dueDate: '2024-10-25T00:00:00Z',
      paymentProgress: 0,
      lineItems: [
        { description: 'Enterprise Software License', quantity: 1, rate: 4000.00, amount: 4000.00 },
        { description: 'Implementation Services', quantity: 20, rate: 60.00, amount: 1200.00 }
      ],
      subtotal: 5200.00,
      tax: 0,
      total: 5200.00,
      notes: 'Annual enterprise license with implementation support.',
      isRecurring: false
    },
    {
      id: 'inv_004',
      invoiceNumber: 'INV-2024-004',
      customerName: 'Digital Solutions Co.',
      customerEmail: 'billing@digitalsol.net',
      customerAddress: '321 Tech Park Way\nAustin, TX 78701',
      amount: 950.00,
      currency: 'USD',
      status: 'draft',
      created: '2024-10-30T16:45:00Z',
      dueDate: '2024-11-30T00:00:00Z',
      paymentProgress: 0,
      lineItems: [
        { description: 'UI/UX Design Services', quantity: 15, rate: 55.00, amount: 825.00 },
        { description: 'Design Assets License', quantity: 1, rate: 125.00, amount: 125.00 }
      ],
      subtotal: 950.00,
      tax: 0,
      total: 950.00,
      notes: 'Design package for new product launch.',
      isRecurring: false
    },
    {
      id: 'inv_005',
      invoiceNumber: 'INV-2024-005',
      customerName: 'Blockchain Ventures',
      customerEmail: 'payments@blockventures.io',
      customerAddress: '555 Crypto Street\nMiami, FL 33101',
      amount: 3200.00,
      currency: 'BTC',
      status: 'sent',
      created: '2024-10-28T11:20:00Z',
      dueDate: '2024-11-28T00:00:00Z',
      paymentProgress: 25,
      lineItems: [
        { description: 'Smart Contract Development', quantity: 40, rate: 80.00, amount: 3200.00 }
      ],
      subtotal: 3200.00,
      tax: 0,
      total: 3200.00,
      notes: 'DeFi protocol smart contract development and audit.',
      isRecurring: false
    },
    {
      id: 'inv_006',
      invoiceNumber: 'INV-2024-006',
      customerName: 'E-commerce Plus',
      customerEmail: 'finance@ecomplus.com',
      customerAddress: '888 Retail Plaza\nChicago, IL 60601',
      amount: 1500.00,
      currency: 'USD',
      status: 'cancelled',
      created: '2024-10-10T13:00:00Z',
      dueDate: '2024-11-10T00:00:00Z',
      paymentProgress: 0,
      lineItems: [
        { description: 'E-commerce Integration', quantity: 25, rate: 60.00, amount: 1500.00 }
      ],
      subtotal: 1500.00,
      tax: 0,
      total: 1500.00,
      notes: 'Project cancelled by mutual agreement.',
      isRecurring: false
    }
  ];

  useEffect(() => {
    setInvoices(mockInvoices);
  }, []);

  // Filter invoices based on current filters
  const filteredInvoices = useMemo(() => {
    return invoices?.filter(invoice => {
      // Search filter
      if (filters?.search) {
        const searchTerm = filters?.search?.toLowerCase();
        const matchesSearch = 
          invoice?.invoiceNumber?.toLowerCase()?.includes(searchTerm) ||
          invoice?.customerName?.toLowerCase()?.includes(searchTerm) ||
          invoice?.customerEmail?.toLowerCase()?.includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters?.status && invoice?.status !== filters?.status) {
        return false;
      }

      // Currency filter
      if (filters?.currency && invoice?.currency !== filters?.currency) {
        return false;
      }

      // Amount filters
      if (filters?.amountMin && invoice?.amount < parseFloat(filters?.amountMin)) {
        return false;
      }
      if (filters?.amountMax && invoice?.amount > parseFloat(filters?.amountMax)) {
        return false;
      }

      // Date range filter
      if (filters?.dateRange) {
        const invoiceDate = new Date(invoice.created);
        const now = new Date();
        
        switch (filters?.dateRange) {
          case 'today':
            if (invoiceDate?.toDateString() !== now?.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (invoiceDate < weekAgo) return false;
            break;
          case 'month':
            if (invoiceDate?.getMonth() !== now?.getMonth() || invoiceDate?.getFullYear() !== now?.getFullYear()) return false;
            break;
          case 'quarter':
            const currentQuarter = Math.floor(now?.getMonth() / 3);
            const invoiceQuarter = Math.floor(invoiceDate?.getMonth() / 3);
            if (invoiceQuarter !== currentQuarter || invoiceDate?.getFullYear() !== now?.getFullYear()) return false;
            break;
          case 'year':
            if (invoiceDate?.getFullYear() !== now?.getFullYear()) return false;
            break;
        }
      }

      return true;
    });
  }, [invoices, filters]);

  const handleCreateInvoice = (invoiceData) => {
    const newInvoice = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      customerAddress: invoiceData?.customerAddress || ''
    };
    
    setInvoices(prev => [newInvoice, ...prev]);
    setShowCreateModal(false);
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPreviewModal(false);
    setShowCreateModal(true);
  };

  const handlePreviewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPreviewModal(true);
  };

  const handleSendReminder = (invoice) => {
    // Mock sending reminder
    console.log('Sending reminder for invoice:', invoice?.invoiceNumber);
    // In a real app, this would trigger email/SMS via Resend/Twilio
  };

  const handleViewPayments = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentHistoryModal(true);
  };

  const getStatusCounts = () => {
    return {
      total: invoices?.length,
      draft: invoices?.filter(inv => inv?.status === 'draft')?.length,
      sent: invoices?.filter(inv => inv?.status === 'sent')?.length,
      paid: invoices?.filter(inv => inv?.status === 'paid')?.length,
      overdue: invoices?.filter(inv => inv?.status === 'overdue')?.length
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
        <div className="p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Invoice Management</h1>
              <p className="text-muted-foreground mt-1">
                Create, manage, and track professional invoices with hosted checkout pages
              </p>
            </div>
            
            <Button
              variant="default"
              onClick={() => setShowCreateModal(true)}
              iconName="Plus"
              iconPosition="left"
              className="gradient-primary"
            >
              Create Invoice
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="FileText" size={16} className="text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{statusCounts?.total}</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="FileEdit" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Draft</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{statusCounts?.draft}</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Send" size={16} className="text-blue-400" />
                <span className="text-sm font-medium text-muted-foreground">Sent</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{statusCounts?.sent}</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm font-medium text-muted-foreground">Paid</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{statusCounts?.paid}</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertCircle" size={16} className="text-destructive" />
                <span className="text-sm font-medium text-muted-foreground">Overdue</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{statusCounts?.overdue}</p>
            </div>
          </div>

          {/* Filters */}
          <InvoiceFilters
            onFiltersChange={setFilters}
            totalInvoices={invoices?.length}
            filteredCount={filteredInvoices?.length}
          />

          {/* Invoice Table */}
          <InvoiceTable
            invoices={filteredInvoices}
            onEdit={handleEditInvoice}
            onPreview={handlePreviewInvoice}
            onSendReminder={handleSendReminder}
            onViewPayments={handleViewPayments}
          />

          {/* Empty State */}
          {filteredInvoices?.length === 0 && invoices?.length > 0 && (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No invoices found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button
                variant="outline"
                onClick={() => setFilters({})}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {filteredInvoices?.length === 0 && invoices?.length === 0 && (
            <div className="text-center py-12">
              <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No invoices yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first invoice to start billing customers
              </p>
              <Button
                variant="default"
                onClick={() => setShowCreateModal(true)}
                iconName="Plus"
                iconPosition="left"
                className="gradient-primary"
              >
                Create Your First Invoice
              </Button>
            </div>
          )}
        </div>
      </main>
      {/* Modals */}
      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedInvoice(null);
        }}
        onSubmit={handleCreateInvoice}
      />
      <InvoicePreviewModal
        invoice={selectedInvoice}
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedInvoice(null);
        }}
        onEdit={handleEditInvoice}
        onSendReminder={handleSendReminder}
      />
      <PaymentHistoryModal
        invoice={selectedInvoice}
        isOpen={showPaymentHistoryModal}
        onClose={() => {
          setShowPaymentHistoryModal(false);
          setSelectedInvoice(null);
        }}
      />
    </div>
  );
};

export default InvoiceManagement;