import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const PublicHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Features',
      href: '#features',
      path: '/',
      external: false
    },
    {
      label: 'Pricing',
      href: '/pricing',
      path: '/pricing',
      external: false
    },
    {
      label: 'Documentation',
      href: '/docs',
      path: '/docs',
      external: false
    },
    {
      label: 'Support',
      href: '/contact',
      path: '/contact',
      external: false
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleNavigationClick = (item) => {
    if (item?.href?.startsWith('#') && location?.pathname === '/') {
      // If we're on landing page and it's an anchor link, scroll to section
      const element = document.querySelector(item?.href);
      if (element) {
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Otherwise navigate to the page
      handleNavigation(item?.path);
    }
    setIsMobileMenuOpen(false);
  };

  const Logo = () => (
    <div 
      className="flex items-center space-x-3 cursor-pointer"
      onClick={() => handleNavigation('/')}
    >
      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
        <Icon name="Zap" size={24} color="white" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-foreground">BlockPay</span>
        <span className="text-xs text-muted-foreground">Global Payments</span>
      </div>
    </div>
  );

  const isAuthPage = location?.pathname === '/merchant-authentication' || 
                     location?.pathname === '/login' || 
                     location?.pathname === '/signup';

  return (
    <header className="sticky top-0 z-1000 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems?.map((item) => (
              <button
                key={item?.label}
                onClick={() => handleNavigationClick(item)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-micro"
              >
                {item?.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthPage ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => handleNavigation('/login')}
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleNavigation('/signup')}
                  className="gradient-primary"
                >
                  Get Started
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => handleNavigation('/')}
              >
                Back to Home
              </Button>
            )}
          </div>

          {/* Mobile Navigation Items */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems?.map((item) => (
                  <button
                    key={item?.label}
                    onClick={() => handleNavigationClick(item)}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-micro"
                  >
                    {item?.label}
                  </button>
                ))}
                
                <div className="pt-4 space-y-2">
                  {!isAuthPage ? (
                    <>
                      <Button
                        variant="ghost"
                        fullWidth
                        onClick={() => handleNavigation('/login')}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="default"
                        fullWidth
                        onClick={() => handleNavigation('/signup')}
                        className="gradient-primary"
                      >
                        Get Started
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => handleNavigation('/')}
                    >
                      Back to Home
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;