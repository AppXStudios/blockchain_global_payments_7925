import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const AdminNavigation = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Overview',
      path: '/admin-panel',
      icon: 'BarChart3',
      tooltip: 'System overview and metrics'
    },
    {
      label: 'Merchants',
      path: '/admin-panel/merchants',
      icon: 'Users',
      tooltip: 'Merchant management'
    },
    {
      label: 'Transactions',
      path: '/admin-panel/transactions',
      icon: 'Activity',
      tooltip: 'Transaction monitoring'
    },
    {
      label: 'System Health',
      path: '/admin-panel/system',
      icon: 'Server',
      tooltip: 'System status and health'
    },
    {
      label: 'Reports',
      path: '/admin-panel/reports',
      icon: 'FileBarChart',
      tooltip: 'Analytics and reporting'
    },
    {
      label: 'Settings',
      path: '/admin-panel/settings',
      icon: 'Settings',
      tooltip: 'System configuration'
    }
  ];

  const quickActions = [
    {
      label: 'System Status',
      icon: 'Zap',
      status: 'operational',
      tooltip: 'All systems operational'
    },
    {
      label: 'Active Users',
      icon: 'Users',
      count: '1,247',
      tooltip: 'Currently active users'
    },
    {
      label: 'Pending Reviews',
      icon: 'AlertCircle',
      count: '23',
      tooltip: 'Items requiring attention'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    // Handle admin logout
    navigate('/merchant-authentication');
  };

  const isActivePath = (path) => {
    return location?.pathname === path || location?.pathname?.startsWith(path + '/');
  };

  const Logo = () => (
    <div className="flex items-center space-x-3 px-4 py-6">
      <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center">
        <Icon name="Shield" size={20} color="white" />
      </div>
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-foreground">Admin Panel</span>
          <span className="text-xs text-muted-foreground">System Control</span>
        </div>
      )}
    </div>
  );

  const NavigationItem = ({ item }) => {
    const isActive = isActivePath(item?.path);
    
    return (
      <button
        onClick={() => handleNavigation(item?.path)}
        className={`
          w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth
          ${isActive 
            ? 'bg-destructive text-destructive-foreground shadow-glow' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }
          ${isCollapsed ? 'justify-center' : ''}
        `}
        title={isCollapsed ? item?.tooltip : ''}
      >
        <Icon 
          name={item?.icon} 
          size={20} 
          className={isActive ? 'text-destructive-foreground' : ''} 
        />
        {!isCollapsed && (
          <span className="text-sm font-medium">{item?.label}</span>
        )}
      </button>
    );
  };

  const QuickActionItem = ({ action }) => (
    <div 
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-md bg-muted/50
        ${isCollapsed ? 'justify-center' : ''}
      `}
      title={isCollapsed ? action?.tooltip : ''}
    >
      <Icon 
        name={action?.icon} 
        size={16} 
        className={
          action?.status === 'operational' ? 'text-success' : action?.count ?'text-warning' : 'text-muted-foreground'
        }
      />
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground">{action?.label}</span>
          {action?.status && (
            <span className="text-xs text-success capitalize">{action?.status}</span>
          )}
          {action?.count && (
            <span className="text-xs text-warning">{action?.count}</span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-1000 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-1100 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Icon name="Menu" size={20} />
      </Button>
      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 h-full bg-card border-r border-border z-1000
          transition-all duration-300 ease-smooth
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <Logo />

          {/* Quick Actions */}
          {!isCollapsed && (
            <div className="px-2 mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                Quick Status
              </h3>
              <div className="space-y-1">
                {quickActions?.map((action, index) => (
                  <QuickActionItem key={index} action={action} />
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-2 space-y-1">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                Administration
              </h3>
            )}
            {navigationItems?.map((item) => (
              <NavigationItem key={item?.path} item={item} />
            ))}
          </nav>

          {/* Admin Actions */}
          <div className="p-2 border-t border-border space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              {!isCollapsed && "Sign Out"}
            </Button>
            
            {/* Collapse Toggle (Desktop Only) */}
            {!isMobileOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="w-full justify-center"
              >
                <Icon 
                  name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                  size={16} 
                />
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminNavigation;