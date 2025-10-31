import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActionItems = [
    {
      title: "Create Payment",
      description: "Generate a new payment request",
      icon: "Plus",
      color: "primary",
      action: () => navigate('/payment-management')
    },
    {
      title: "Create Invoice",
      description: "Send an invoice to customer",
      icon: "FileText",
      color: "secondary",
      action: () => navigate('/invoice-management')
    },
    {
      title: "Generate Payment Link",
      description: "Create reusable payment URL",
      icon: "Link",
      color: "accent",
      action: () => navigate('/payment-links')
    },
    {
      title: "Request Withdrawal",
      description: "Transfer funds to your account",
      icon: "ArrowUpRight",
      color: "success",
      action: () => navigate('/withdrawals')
    },
    {
      title: "View All Transactions",
      description: "See complete payment history",
      icon: "History",
      color: "warning",
      action: () => navigate('/payment-management')
    },
    {
      title: "Account Settings",
      description: "Manage your account preferences",
      icon: "Settings",
      color: "muted",
      action: () => navigate('/account-settings')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <Icon name="Zap" size={20} className="text-primary" />
      </div>

      <div className="space-y-3">
        {quickActionItems?.map((item, index) => (
          <button
            key={index}
            onClick={item?.action}
            className="w-full flex items-center space-x-3 p-4 rounded-lg bg-muted hover:bg-muted/70 transition-smooth group"
          >
            <div className={`w-10 h-10 rounded-lg bg-${item?.color}/10 flex items-center justify-center group-hover:scale-110 transition-smooth`}>
              <Icon 
                name={item?.icon} 
                size={18} 
                className={`text-${item?.color}`} 
              />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-sm font-medium text-foreground">
                {item?.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {item?.description}
              </p>
            </div>
            <Icon 
              name="ChevronRight" 
              size={16} 
              className="text-muted-foreground group-hover:text-foreground transition-smooth" 
            />
          </button>
        ))}
      </div>

      {/* Additional Help Section */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <h3 className="text-sm font-medium text-foreground mb-2">
            Need Help?
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Check our documentation or contact support
          </p>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/docs')}
              className="flex-1"
            >
              <Icon name="Book" size={14} className="mr-1" />
              Docs
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/contact')}
              className="flex-1"
            >
              <Icon name="MessageCircle" size={14} className="mr-1" />
              Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;