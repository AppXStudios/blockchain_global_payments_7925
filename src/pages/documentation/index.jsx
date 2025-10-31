import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainSidebar from '../../components/ui/MainSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const DocumentationPage = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const docSections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: 'Book',
      content: `
        Welcome to BlockPay Global Payments documentation. This comprehensive guide will help you integrate 
        and use our cryptocurrency payment processing platform effectively.

        Key Features:
        • Multi-currency crypto payments
        • Real-time transaction monitoring
        • Secure webhook notifications
        • Global payment processing
        • Advanced reporting and analytics
      `
    },
    {
      id: 'quickstart',
      title: 'Quick Start',
      icon: 'PlayCircle',
      content: `
        Get started with BlockPay in just a few minutes:

        1. Create your merchant account
        2. Verify your business information
        3. Generate your API keys
        4. Make your first payment request
        5. Set up webhook notifications

        Follow our step-by-step integration guide to start accepting payments today.
      `
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: 'Code',
      content: `
        Our REST API provides programmatic access to all BlockPay features:

        Base URL: https://api.blockchainglobalpayments.com/v1

        Authentication:
        • API Key authentication required
        • Include X-API-Key header in all requests
        • Use test keys for development environment

        Core Endpoints:
        • POST /payments - Create payment
        • GET /payments/:id - Get payment status
        • POST /invoices - Create invoice
        • GET /invoices - List invoices
      `
    },
    {
      id: 'webhooks',
      title: 'Webhooks',
      icon: 'Zap',
      content: `
        Webhooks provide real-time notifications about payment events:

        Supported Events:
        • payment.created
        • payment.completed
        • payment.failed
        • invoice.paid
        • withdrawal.processed

        Webhook Security:
        • HMAC-SHA256 signature verification
        • IP whitelist verification
        • Retry mechanism with exponential backoff
      `
    },
    {
      id: 'sdks',
      title: 'SDKs & Libraries',
      icon: 'Package',
      content: `
        Official SDKs and libraries for popular programming languages:

        JavaScript/Node.js:
        npm install @blockpay/nodejs-sdk

        Python:
        pip install blockpay-python

        PHP:
        composer require blockpay/php-sdk

        Go:
        go get github.com/blockpay/go-sdk
      `
    }
  ];

  const quickLinks = [
    { title: 'Create Account', path: '/signup', icon: 'UserPlus' },
    { title: 'API Keys', path: '/account-settings', icon: 'Key' },
    { title: 'Contact Support', path: '/contact', icon: 'MessageCircle' },
    { title: 'Back to Dashboard', path: '/dashboard', icon: 'ArrowLeft' }
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
              <h1 className="text-2xl font-bold text-foreground">Documentation</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive guides and API reference for BlockPay
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate('/support')}
              >
                <Icon name="HelpCircle" size={16} className="mr-2" />
                Get Help
              </Button>
              <Button
                onClick={() => navigate('/contact')}
              >
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-card border-r border-border min-h-screen p-4">
            <div className="space-y-2">
              {docSections?.map((section) => (
                <button
                  key={section?.id}
                  onClick={() => setActiveSection(section?.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-smooth text-left ${
                    activeSection === section?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={section?.icon} size={18} />
                  <span className="text-sm font-medium">{section?.title}</span>
                </button>
              ))}
            </div>

            {/* Quick Links */}
            <div className="mt-8 pt-4 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-2">Quick Links</h3>
              <div className="space-y-2">
                {quickLinks?.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(link?.path)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    <Icon name={link?.icon} size={14} />
                    <span>{link?.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="bg-card border border-border rounded-xl p-8">
              {(() => {
                const activeDoc = docSections?.find(section => section?.id === activeSection);
                return (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon name={activeDoc?.icon} size={24} className="text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">{activeDoc?.title}</h2>
                    </div>
                    <div className="prose prose-gray max-w-none">
                      <div className="text-foreground whitespace-pre-line leading-relaxed">
                        {activeDoc?.content}
                      </div>
                    </div>
                    {/* Code Examples (for API section) */}
                    {activeSection === 'api' && (
                      <div className="mt-8 space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Example Request</h3>
                        <div className="bg-muted p-4 rounded-lg">
                          <code className="text-sm text-foreground">
{`curl -X POST https://api.blockchainglobalpayments.com/v1/payments \\
  -H "X-API-Key: your_api_key_here" \ -H"Content-Type: application/json" \\
  -d '{
    "amount": 100.00,
    "currency": "USD",
    "payment_currency": "BTC",
    "description": "Payment for order #1234"
  }'`}
                          </code>
                        </div>
                      </div>
                    )}
                    {/* Navigation */}
                    <div className="mt-12 flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const currentIndex = docSections?.findIndex(s => s?.id === activeSection);
                          if (currentIndex > 0) {
                            setActiveSection(docSections?.[currentIndex - 1]?.id);
                          }
                        }}
                        disabled={docSections?.findIndex(s => s?.id === activeSection) === 0}
                      >
                        <Icon name="ChevronLeft" size={16} className="mr-2" />
                        Previous
                      </Button>
                      
                      <Button
                        onClick={() => {
                          const currentIndex = docSections?.findIndex(s => s?.id === activeSection);
                          if (currentIndex < docSections?.length - 1) {
                            setActiveSection(docSections?.[currentIndex + 1]?.id);
                          }
                        }}
                        disabled={docSections?.findIndex(s => s?.id === activeSection) === docSections?.length - 1}
                      >
                        Next
                        <Icon name="ChevronRight" size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentationPage;