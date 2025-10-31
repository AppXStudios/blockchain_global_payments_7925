import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainSidebar from '../../components/ui/MainSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BalanceCard from './components/BalanceCard';
import WithdrawalForm from './components/WithdrawalForm';
import WithdrawalHistory from './components/WithdrawalHistory';
import SecurityNotice from './components/SecurityNotice';

const WithdrawalsPage = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('withdraw');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for balances
  const mockBalances = [
    {
      id: 1,
      currency: 'BTC',
      name: 'Bitcoin',
      available: 0.15432876,
      usdValue: 6789.45,
      minWithdrawal: 0.001,
      networkFee: 0.0005
    },
    {
      id: 2,
      currency: 'ETH',
      name: 'Ethereum',
      available: 2.87654321,
      usdValue: 4567.89,
      minWithdrawal: 0.01,
      networkFee: 0.002
    },
    {
      id: 3,
      currency: 'USDT',
      name: 'Tether USD',
      available: 1250.00,
      usdValue: 1250.00,
      minWithdrawal: 10,
      networkFee: 1.5
    },
    {
      id: 4,
      currency: 'LTC',
      name: 'Litecoin',
      available: 5.67890123,
      usdValue: 432.10,
      minWithdrawal: 0.1,
      networkFee: 0.001
    },
    {
      id: 5,
      currency: 'ADA',
      name: 'Cardano',
      available: 0,
      usdValue: 0,
      minWithdrawal: 10,
      networkFee: 1
    }
  ];

  // Mock data for withdrawal history
  const mockWithdrawals = [
    {
      id: 1,
      txId: 'wd_1a2b3c4d5e6f7g8h9i0j',
      currency: 'BTC',
      amount: 0.05,
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      status: 'completed',
      networkFee: 0.0005,
      createdAt: '2025-10-30T14:30:00Z',
      completedAt: '2025-10-30T14:45:00Z'
    },
    {
      id: 2,
      txId: 'wd_2b3c4d5e6f7g8h9i0j1k',
      currency: 'ETH',
      amount: 1.5,
      address: '0x742d35Cc6634C0532925a3b8D4C0C8b3C2F6D5E7',
      status: 'processing',
      networkFee: 0.002,
      createdAt: '2025-10-31T09:15:00Z',
      completedAt: null
    },
    {
      id: 3,
      txId: 'wd_3c4d5e6f7g8h9i0j1k2l',
      currency: 'USDT',
      amount: 500,
      address: '0x8ba1f109551bD432803012645Hac136c22C501e5',
      status: 'pending',
      networkFee: 1.5,
      createdAt: '2025-10-31T05:45:00Z',
      completedAt: null
    },
    {
      id: 4,
      txId: 'wd_4d5e6f7g8h9i0j1k2l3m',
      currency: 'LTC',
      amount: 2.0,
      address: 'LQTpS7rEzGXbqj8YgHn4L5K9M2N3O4P5Q6R7S8T9',
      status: 'failed',
      networkFee: 0.001,
      createdAt: '2025-10-29T16:20:00Z',
      completedAt: null,
      failureReason: 'Invalid destination address'
    },
    {
      id: 5,
      txId: 'wd_5e6f7g8h9i0j1k2l3m4n',
      currency: 'BTC',
      amount: 0.1,
      address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
      status: 'completed',
      networkFee: 0.0005,
      createdAt: '2025-10-28T11:30:00Z',
      completedAt: '2025-10-28T12:15:00Z'
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleWithdrawalSubmit = async (withdrawalData) => {
    console.log('Processing withdrawal:', withdrawalData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show success message or handle error
    alert(`Withdrawal of ${withdrawalData?.amount} ${withdrawalData?.currency} submitted successfully!`);
    
    // Refresh data or navigate
    setActiveTab('history');
  };

  const handleEnable2FA = () => {
    navigate('/account-settings');
  };

  const totalUSDValue = mockBalances?.reduce((sum, balance) => sum + balance?.usdValue, 0);

  const tabs = [
    { id: 'withdraw', label: 'New Withdrawal', icon: 'ArrowUpRight' },
    { id: 'history', label: 'History', icon: 'Clock' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <MainSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
          <div className="p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3]?.map(i => (
                  <div key={i} className="h-32 bg-muted rounded-lg"></div>
                ))}
              </div>
              <div className="h-96 bg-muted rounded-lg"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <MainSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Withdrawals</h1>
                <p className="text-muted-foreground">
                  Transfer your cryptocurrency to external wallets
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-foreground">
                  ${new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })?.format(totalUSDValue)}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Wallet" size={20} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Available Balances</span>
                </div>
                <p className="text-xl font-semibold text-foreground mt-1">
                  {mockBalances?.filter(b => b?.available > 0)?.length} Currencies
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="ArrowUpRight" size={20} className="text-success" />
                  <span className="text-sm text-muted-foreground">Total Withdrawals</span>
                </div>
                <p className="text-xl font-semibold text-foreground mt-1">
                  {mockWithdrawals?.length}
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                </div>
                <p className="text-xl font-semibold text-foreground mt-1">
                  {Math.round((mockWithdrawals?.filter(w => w?.status === 'completed')?.length / mockWithdrawals?.length) * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Available Balances</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockBalances?.map((balance) => (
                <BalanceCard key={balance?.id} balance={balance} />
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-smooth ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'withdraw' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <WithdrawalForm 
                    balances={mockBalances} 
                    onSubmit={handleWithdrawalSubmit} 
                  />
                </div>
                <div>
                  <SecurityNotice onEnable2FA={handleEnable2FA} />
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <WithdrawalHistory withdrawals={mockWithdrawals} />
            )}

            {activeTab === 'security' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SecurityNotice onEnable2FA={handleEnable2FA} />
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Icon name="AlertTriangle" size={20} className="text-warning" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Withdrawal Limits</h2>
                      <p className="text-sm text-muted-foreground">Current account limits</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">Daily Limit</span>
                      <span className="text-sm font-medium text-foreground">$50,000 USD</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">Monthly Limit</span>
                      <span className="text-sm font-medium text-foreground">$500,000 USD</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">Used Today</span>
                      <span className="text-sm font-medium text-foreground">$2,450 USD</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    fullWidth
                    className="mt-6"
                    onClick={() => navigate('/account-settings')}
                  >
                    Request Limit Increase
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WithdrawalsPage;