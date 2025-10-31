import React, { useState } from 'react';
import AdminNavigation from '../../components/ui/AdminNavigation';
import MetricsOverview from './components/MetricsOverview';
import RecentActivity from './components/RecentActivity';
import SystemHealth from './components/SystemHealth';
import MerchantOverview from './components/MerchantOverview';
import TransactionMonitoring from './components/TransactionMonitoring';

const AdminPanel = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation */}
      <AdminNavigation 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      {/* Main Content */}
      <main 
        className={`transition-all duration-300 ease-smooth ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
      >
        <div className="p-6 lg:p-8 space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground mt-1">
                System overview and platform management
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Last updated:</span>
              <span className="text-foreground font-medium">
                {new Date()?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Metrics Overview */}
          <section>
            <MetricsOverview />
          </section>

          {/* System Health & Recent Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <SystemHealth />
            <RecentActivity />
          </div>

          {/* Merchant Overview */}
          <section>
            <MerchantOverview />
          </section>

          {/* Transaction Monitoring */}
          <section>
            <TransactionMonitoring />
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;