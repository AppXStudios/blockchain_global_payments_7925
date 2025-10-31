import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const MainSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Overview and analytics'
    },
    {
      label: 'Payments',
      path: '/payment-management',
      icon: 'CreditCard',
      tooltip: 'Transaction management'
    },
    {
      label: 'Invoices',
      path: '/invoice-management',
      icon: 'FileText',
      tooltip: 'Billing and invoicing'
    },
    {
      label: 'Payment Links',
      path: '/payment-links',
      icon: 'Link',
      tooltip: 'Reusable payment URLs'
    },
    {
      label: 'Withdrawals',
      path: '/withdrawals',
      icon: 'ArrowUpRight',
      tooltip: 'Fund management'
    },
    {
      label: 'Account Settings',
      path: '/account-settings',
      icon: 'Settings',
      tooltip: 'Account configuration'
    },
    {
      label: 'Support',
      path: '/contact',
      icon: 'HelpCircle',
      tooltip: 'Help and support'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    
    // Navigate to login page
    navigate('/login');
    setIsMobileOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const Logo = () => (
    <div className="flex items-center space-x-3 px-4 py-6">
      <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
        <Icon name="Zap" size={20} color="white" />
      </div>
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-foreground">BlockPay</span>
          <span className="text-xs text-muted-foreground">Global Payments</span>
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
            ? 'bg-primary text-primary-foreground shadow-glow' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }
          ${isCollapsed ? 'justify-center' : ''}
        `}
        title={isCollapsed ? item?.tooltip : ''}
      >
        <Icon 
          name={item?.icon} 
          size={20} 
          className={isActive ? 'text-primary-foreground' : ''} 
        />
        {!isCollapsed && (
          <span className="text-sm font-medium">{item?.label}</span>
        )}
      </button>
    );
  };

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
          ${isCollapsed ? 'w-16' : 'w-60'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <Logo />

          {/* Navigation */}
          <nav className="flex-1 px-2 space-y-1">
            {navigationItems?.map((item) => (
              <NavigationItem key={item?.path} item={item} />
            ))}
          </nav>

          {/* Collapse Toggle & Logout (Desktop Only) */}
          {!isMobileOpen && (
            <div className="p-2 border-t border-border space-y-2">
              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start'} text-destructive hover:text-destructive-foreground hover:bg-destructive`}
                title={isCollapsed ? 'Logout' : ''}
              >
                <Icon name="LogOut" size={16} />
                {!isCollapsed && <span className="ml-2">Logout</span>}
              </Button>
              
              {/* Collapse Toggle */}
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
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default MainSidebar;