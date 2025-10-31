import React, { useState, useEffect } from 'react';
import MainSidebar from '../../components/ui/MainSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PaymentLinkCard from './components/PaymentLinkCard';
import CreateLinkModal from './components/CreateLinkModal';
import LinkAnalyticsModal from './components/LinkAnalyticsModal';
import BulkActionsBar from './components/BulkActionsBar';
import LinkFilters from './components/LinkFilters';

const PaymentLinksPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [selectedLinkForAnalytics, setSelectedLinkForAnalytics] = useState(null);
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_desc');
  const [paymentLinks, setPaymentLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLinkId, setCopiedLinkId] = useState(null);

  // Mock payment links data
  const mockPaymentLinks = [
    {
      id: "1",
      name: "Monthly Subscription",
      description: "Recurring monthly payment for premium service",
      amount: 29.99,
      currency: "USD",
      url: "https://pay.blockpay.com/link/monthly-sub-001",
      status: "active",
      isActive: true,
      stats: {
        clicks: 245,
        payments: 67,
        conversionRate: 27.3
      },
      createdAt: "10/15/2024",
      expiresAt: null,
      maxUses: null,
      usedCount: 67
    },
    {
      id: "2", 
      name: "Product Purchase - Premium Plan",
      description: "One-time payment for premium product access",
      amount: 0.05,
      currency: "BTC",
      url: "https://pay.blockpay.com/link/premium-plan-002",
      status: "active",
      isActive: true,
      stats: {
        clicks: 189,
        payments: 42,
        conversionRate: 22.2
      },
      createdAt: "10/20/2024",
      expiresAt: "12/31/2024",
      maxUses: 100,
      usedCount: 42
    },
    {
      id: "3",
      name: "Consultation Fee",
      description: "Professional consultation service payment",
      amount: 150.00,
      currency: "USD",
      url: "https://pay.blockpay.com/link/consultation-003",
      status: "active",
      isActive: true,
      stats: {
        clicks: 78,
        payments: 23,
        conversionRate: 29.5
      },
      createdAt: "10/25/2024",
      expiresAt: null,
      maxUses: 50,
      usedCount: 23
    },
    {
      id: "4",
      name: "Digital Course Access",
      description: "Lifetime access to online learning platform",
      amount: 2.5,
      currency: "ETH",
      url: "https://pay.blockpay.com/link/course-access-004",
      status: "inactive",
      isActive: false,
      stats: {
        clicks: 156,
        payments: 34,
        conversionRate: 21.8
      },
      createdAt: "10/10/2024",
      expiresAt: "11/30/2024",
      maxUses: null,
      usedCount: 34
    },
    {
      id: "5",
      name: "Event Ticket",
      description: "VIP access ticket for blockchain conference",
      amount: 500.00,
      currency: "USDT",
      url: "https://pay.blockpay.com/link/event-ticket-005",
      status: "expired",
      isActive: false,
      stats: {
        clicks: 324,
        payments: 89,
        conversionRate: 27.5
      },
      createdAt: "09/15/2024",
      expiresAt: "10/30/2024",
      maxUses: 100,
      usedCount: 89
    },
    {
      id: "6",
      name: "Software License",
      description: "Annual software license renewal payment",
      amount: 299.99,
      currency: "USD",
      url: "https://pay.blockpay.com/link/software-license-006",
      status: "active",
      isActive: true,
      stats: {
        clicks: 92,
        payments: 18,
        conversionRate: 19.6
      },
      createdAt: "10/28/2024",
      expiresAt: null,
      maxUses: null,
      usedCount: 18
    }
  ];

  useEffect(() => {
    // Simulate loading payment links
    const loadPaymentLinks = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPaymentLinks(mockPaymentLinks);
      setIsLoading(false);
    };

    loadPaymentLinks();
  }, []);

  const handleCreateLink = async (linkData) => {
    // Simulate API call to create payment link
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newLink = {
      ...linkData,
      id: Date.now()?.toString(),
      url: `https://pay.blockpay.com/link/${Date.now()}`,
      status: 'active',
      isActive: true,
      stats: {
        clicks: 0,
        payments: 0,
        conversionRate: 0
      },
      usedCount: 0,
      createdAt: new Date()?.toLocaleDateString()
    };

    setPaymentLinks(prev => [newLink, ...prev]);
  };

  const handleCopyLink = (linkId) => {
    const link = paymentLinks?.find(l => l?.id === linkId);
    if (link) {
      navigator.clipboard?.writeText(link?.url);
      setCopiedLinkId(linkId);
      setTimeout(() => setCopiedLinkId(null), 2000);
    }
  };

  const handleViewAnalytics = (linkId) => {
    const link = paymentLinks?.find(l => l?.id === linkId);
    if (link) {
      setSelectedLinkForAnalytics(link);
      setIsAnalyticsModalOpen(true);
    }
  };

  const handleEditLink = (link) => {
    // For now, just show create modal with pre-filled data
    // In a real app, this would be a separate edit modal
    console.log('Edit link:', link);
  };

  const handleToggleStatus = (linkId, newStatus) => {
    setPaymentLinks(prev => 
      prev?.map(link => 
        link?.id === linkId 
          ? { ...link, isActive: newStatus, status: newStatus ? 'active' : 'inactive' }
          : link
      )
    );
  };

  const handleDeleteLink = (linkId) => {
    setPaymentLinks(prev => prev?.filter(link => link?.id !== linkId));
  };

  const handleBulkActivate = (linkIds) => {
    setPaymentLinks(prev => 
      prev?.map(link => 
        linkIds?.includes(link?.id)
          ? { ...link, isActive: true, status: 'active' }
          : link
      )
    );
  };

  const handleBulkDeactivate = (linkIds) => {
    setPaymentLinks(prev => 
      prev?.map(link => 
        linkIds?.includes(link?.id)
          ? { ...link, isActive: false, status: 'inactive' }
          : link
      )
    );
  };

  const handleBulkDelete = (linkIds) => {
    setPaymentLinks(prev => prev?.filter(link => !linkIds?.includes(link?.id)));
  };

  const handleClearSelection = () => {
    setSelectedLinks([]);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrencyFilter('all');
    setSortBy('created_desc');
  };

  // Filter and sort payment links
  const filteredAndSortedLinks = paymentLinks?.filter(link => {
      const matchesSearch = link?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           link?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesStatus = statusFilter === 'all' || link?.status === statusFilter;
      const matchesCurrency = currencyFilter === 'all' || link?.currency === currencyFilter;
      
      return matchesSearch && matchesStatus && matchesCurrency;
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'created_asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'created_desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name_asc':
          return a?.name?.localeCompare(b?.name);
        case 'name_desc':
          return b?.name?.localeCompare(a?.name);
        case 'amount_asc':
          return a?.amount - b?.amount;
        case 'amount_desc':
          return b?.amount - a?.amount;
        case 'clicks_desc':
          return b?.stats?.clicks - a?.stats?.clicks;
        case 'conversion_desc':
          return b?.stats?.conversionRate - a?.stats?.conversionRate;
        default:
          return 0;
      }
    });

  const totalLinks = paymentLinks?.length;
  const activeLinks = paymentLinks?.filter(link => link?.isActive)?.length;
  const totalClicks = paymentLinks?.reduce((sum, link) => sum + link?.stats?.clicks, 0);
  const totalPayments = paymentLinks?.reduce((sum, link) => sum + link?.stats?.payments, 0);

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Payment Links
              </h1>
              <p className="text-muted-foreground">
                Create and manage reusable payment URLs for your customers
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                onClick={() => window.open('/hosted-checkout', '_blank')}
              >
                <Icon name="ExternalLink" size={16} className="mr-2" />
                Preview Checkout
              </Button>
              <Button
                variant="default"
                onClick={() => setIsCreateModalOpen(true)}
                className="gradient-primary"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Create Payment Link
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="Link" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{totalLinks}</div>
                  <div className="text-sm text-muted-foreground">Total Links</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{activeLinks}</div>
                  <div className="text-sm text-muted-foreground">Active Links</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Icon name="MousePointer" size={20} className="text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{totalClicks?.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Clicks</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Icon name="CreditCard" size={20} className="text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{totalPayments?.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Payments</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <LinkFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            currencyFilter={currencyFilter}
            onCurrencyFilterChange={setCurrencyFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
          />

          {/* Bulk Actions */}
          <BulkActionsBar
            selectedLinks={selectedLinks}
            onBulkActivate={handleBulkActivate}
            onBulkDeactivate={handleBulkDeactivate}
            onBulkDelete={handleBulkDelete}
            onClearSelection={handleClearSelection}
          />

          {/* Payment Links Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="h-8 bg-muted rounded"></div>
                    <div className="h-8 bg-muted rounded"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredAndSortedLinks?.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Icon name="Link" size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {paymentLinks?.length === 0 ? 'No payment links yet' : 'No links match your filters'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {paymentLinks?.length === 0 
                  ? 'Create your first payment link to start accepting payments' :'Try adjusting your search or filter criteria'
                }
              </p>
              {paymentLinks?.length === 0 && (
                <Button
                  variant="default"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="gradient-primary"
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Create Your First Link
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedLinks?.map((link) => (
                <PaymentLinkCard
                  key={link?.id}
                  link={link}
                  onCopyLink={handleCopyLink}
                  onViewAnalytics={handleViewAnalytics}
                  onEdit={handleEditLink}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteLink}
                />
              ))}
            </div>
          )}

          {/* Success Message */}
          {copiedLinkId && (
            <div className="fixed bottom-4 right-4 bg-success text-success-foreground px-4 py-2 rounded-lg shadow-lg z-50">
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={16} />
                <span className="text-sm font-medium">Link copied to clipboard!</span>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Modals */}
      <CreateLinkModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateLink={handleCreateLink}
      />
      <LinkAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        linkData={selectedLinkForAnalytics}
      />
    </div>
  );
};

export default PaymentLinksPage;