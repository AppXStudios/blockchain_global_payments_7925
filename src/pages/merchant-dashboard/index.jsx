import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainSidebar from '../../components/ui/MainSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BalanceCard from './components/BalanceCard';
import MetricsCard from './components/MetricsCard';
import RecentTransactions from './components/RecentTransactions';
import QuickActions from './components/QuickActions';
import AlertNotifications from './components/AlertNotifications';

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data for balances
  const balances = [
    {
      currency: "USD",
      balance: 12547.89,
      usdValue: 12547.89,
      change: "+5.2%",
      changeType: "increase"
    },
    {
      currency: "BTC",
      balance: 0.45672,
      usdValue: 31245.67,
      change: "+2.1%",
      changeType: "increase"
    },
    {
      currency: "ETH",
      balance: 8.92341,
      usdValue: 18456.23,
      change: "-1.3%",
      changeType: "decrease"
    },
    {
      currency: "USDT",
      balance: 5678.90,
      usdValue: 5678.90,
      change: "0.0%",
      changeType: "neutral"
    }
  ];

  // Mock data for metrics
  const metrics = [
    {
      title: "Total Volume (30d)",
      value: "$156,789",
      subtitle: "Across all currencies",
      icon: "TrendingUp",
      trend: "up",
      trendValue: "+12.5%",
      color: "success"
    },
    {
      title: "Success Rate",
      value: "98.7%",
      subtitle: "Last 30 days",
      icon: "CheckCircle",
      trend: "up",
      trendValue: "+0.3%",
      color: "primary"
    },
    {
      title: "Active Payments",
      value: "47",
      subtitle: "Currently processing",
      icon: "Clock",
      color: "warning"
    },
    {
      title: "Total Transactions",
      value: "2,847",
      subtitle: "This month",
      icon: "Activity",
      trend: "up",
      trendValue: "+18.2%",
      color: "primary"
    }
  ];

  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: "TXN-2024-001234",
      status: "Completed",
      amount: 1250.00,
      currency: "USD",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      customer: "john.doe@example.com",
      customerAlt: "Professional headshot of middle-aged man with brown hair in business suit"
    },
    {
      id: "TXN-2024-001235",
      status: "Processing",
      amount: 0.0234,
      currency: "BTC",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      customer: "sarah.wilson@company.com",
      customerAlt: "Young professional woman with blonde hair in blue blazer smiling"
    },
    {
      id: "TXN-2024-001236",
      status: "Pending",
      amount: 2.5678,
      currency: "ETH",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      customer: "mike.chen@startup.io",
      customerAlt: "Asian businessman with glasses in dark suit at office desk"
    },
    {
      id: "TXN-2024-001237",
      status: "Completed",
      amount: 890.50,
      currency: "USDT",
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      customer: "emma.rodriguez@tech.com",
      customerAlt: "Hispanic woman with curly hair in professional attire"
    },
    {
      id: "TXN-2024-001238",
      status: "Failed",
      amount: 156.78,
      currency: "USD",
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      customer: "david.kim@enterprise.org",
      customerAlt: "Korean professional man in navy suit with confident expression"
    },
    {
      id: "TXN-2024-001239",
      status: "Completed",
      amount: 0.1234,
      currency: "BTC",
      timestamp: new Date(Date.now() - 18000000), // 5 hours ago
      customer: "lisa.thompson@business.net",
      customerAlt: "Blonde woman in white shirt smiling at camera in modern office"
    }
  ];

  // Mock data for alerts
  const alerts = [
    {
      id: "alert-1",
      type: "warning",
      title: "Pending Withdrawal",
      message: "You have a withdrawal request of $5,000 USD pending approval. Processing typically takes 1-2 business days.",
      action: {
        label: "View Details",
        onClick: () => navigate('/withdrawals')
      },
      dismissible: true
    },
    {
      id: "alert-2",
      type: "info",
      title: "API Rate Limit Notice",
      message: "You\'re approaching 80% of your monthly API rate limit. Consider upgrading your plan for higher limits.",
      action: {
        label: "Upgrade Plan",
        onClick: () => navigate('/account-settings')
      },
      dismissible: true
    }
  ];

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleViewAllTransactions = () => {
    navigate('/payment-management');
  };

  const handleAlertDismiss = (alertId) => {
    console.log(`Alert ${alertId} dismissed`);
  };

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(date);
  };

  const totalUsdBalance = balances?.reduce((sum, balance) => sum + balance?.usdValue, 0);

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDateTime(currentTime)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={16} className="text-success" />
                <span>All Systems Operational</span>
              </div>
              <Button
                variant="default"
                onClick={() => navigate('/payment-management')}
                className="gradient-primary"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Create Payment
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Alert Notifications */}
          <AlertNotifications 
            alerts={alerts}
            onDismiss={handleAlertDismiss}
          />

          {/* Total Balance Summary */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Total Portfolio Value</h2>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })?.format(totalUsdBalance)}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-success">
                  <Icon name="TrendingUp" size={16} />
                  <span className="text-sm font-medium">+8.7% (24h)</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  +${((totalUsdBalance * 0.087) / 100)?.toFixed(2)} USD
                </p>
              </div>
            </div>
          </div>

          {/* Balance Cards */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Currency Balances</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {balances?.map((balance, index) => (
                <BalanceCard
                  key={index}
                  currency={balance?.currency}
                  balance={balance?.balance}
                  usdValue={balance?.usdValue}
                  change={balance?.change}
                  changeType={balance?.changeType}
                />
              ))}
            </div>
          </div>

          {/* Metrics Cards */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Key Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {metrics?.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  subtitle={metric?.subtitle}
                  icon={metric?.icon}
                  trend={metric?.trend}
                  trendValue={metric?.trendValue}
                  color={metric?.color}
                />
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="xl:col-span-2">
              <RecentTransactions 
                transactions={recentTransactions}
                onViewAll={handleViewAllTransactions}
              />
            </div>

            {/* Quick Actions */}
            <div className="xl:col-span-1">
              <QuickActions />
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Active Customers</h3>
                  <p className="text-2xl font-bold text-foreground">1,247</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                +23 new customers this week
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Icon name="Globe" size={20} className="text-success" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Countries Served</h3>
                  <p className="text-2xl font-bold text-foreground">47</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Across 6 continents
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Icon name="Zap" size={20} className="text-warning" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Avg. Processing Time</h3>
                  <p className="text-2xl font-bold text-foreground">2.3s</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                98.7% under 5 seconds
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MerchantDashboard;