import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainSidebar from '../../components/ui/MainSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SupportPage = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const supportCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using our payment platform",
      icon: "PlayCircle",
      articles: [
        "Setting up your merchant account",
        "Creating your first payment",
        "Understanding payment statuses",
        "Managing withdrawals"
      ]
    },
    {
      title: "Integration",
      description: "Technical documentation for developers",
      icon: "Code",
      articles: [
        "API documentation",
        "Webhook setup",
        "Payment link integration", 
        "SDK installation"
      ]
    },
    {
      title: "Troubleshooting",
      description: "Common issues and solutions",
      icon: "AlertTriangle",
      articles: [
        "Payment failures",
        "Webhook errors",
        "Account verification",
        "Network connectivity"
      ]
    }
  ];

  const quickActions = [
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: "MessageCircle",
      action: () => navigate('/contact')
    },
    {
      title: "Documentation",
      description: "Browse our comprehensive guides",
      icon: "Book",
      action: () => navigate('/docs')
    },
    {
      title: "Back to Dashboard",
      description: "Return to your dashboard",
      icon: "ArrowLeft",
      action: () => navigate('/dashboard')
    }
  ];

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
              <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Find answers and get help with our payment platform
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/contact')}
            >
              <Icon name="MessageCircle" size={16} className="mr-2" />
              Contact Support
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions?.map((action, index) => (
              <button
                key={index}
                onClick={action?.action}
                className="p-4 bg-card border border-border rounded-xl hover:bg-muted transition-smooth text-left group"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <Icon name={action?.icon} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{action?.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{action?.description}</p>
              </button>
            ))}
          </div>

          {/* Support Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {supportCategories?.map((category, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name={category?.icon} size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{category?.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{category?.description}</p>
                <div className="space-y-2">
                  {category?.articles?.map((article, articleIndex) => (
                    <button
                      key={articleIndex}
                      className="w-full text-left text-sm text-muted-foreground hover:text-primary transition-smooth py-1"
                    >
                      • {article}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Search Section */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Search Knowledge Base</h2>
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button>
                <Icon name="Search" size={16} className="mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupportPage;