"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';

import MainSidebar from '../../components/ui/MainSidebar';
import ProfileSettings from './components/ProfileSettings';
import ApiKeyManagement from './components/ApiKeyManagement';
import NotificationSettings from './components/NotificationSettings';
import SecuritySettings from './components/SecuritySettings';
import WebhookSettings from './components/WebhookSettings';
import IntegrationSettings from './components/IntegrationSettings';

const AccountSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Determine active tab from URL path
  useEffect(() => {
    const path = location?.pathname;
    if (path?.includes('/api')) {
      setActiveTab('api');
    } else if (path?.includes('/notifications')) {
      setActiveTab('notifications');
    } else if (path?.includes('/security')) {
      setActiveTab('security');
    } else if (path?.includes('/webhooks')) {
      setActiveTab('webhooks');
    } else if (path?.includes('/integrations')) {
      setActiveTab('integrations');
    } else {
      setActiveTab('profile');
    }
  }, [location?.pathname]);

  const tabs = [
    {
      id: 'profile',
      label: 'Profile Settings',
      path: '/account-settings',
      icon: 'User',
      component: ProfileSettings
    },
    {
      id: 'api',
      label: 'API Keys',
      path: '/account-settings/api',
      icon: 'Key',
      component: ApiKeyManagement
    },
    {
      id: 'notifications',
      label: 'Notifications',
      path: '/account-settings/notifications',
      icon: 'Bell',
      component: NotificationSettings
    },
    {
      id: 'security',
      label: 'Security',
      path: '/account-settings/security',
      icon: 'Shield',
      component: SecuritySettings
    },
    {
      id: 'webhooks',
      label: 'Webhooks',
      path: '/account-settings/webhooks',
      icon: 'Webhook',
      component: WebhookSettings
    },
    {
      id: 'integrations',
      label: 'Integrations',
      path: '/account-settings/integrations',
      icon: 'Puzzle',
      component: IntegrationSettings
    }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab?.id);
    navigate(tab?.path);
  };

  const activeTabData = tabs?.find(tab => tab?.id === activeTab);
  const ActiveComponent = activeTabData?.component || ProfileSettings;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <MainSidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <div className="p-6 pt-20 lg:pt-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your account preferences and security settings
                </p>
              </div>
            </div>
          </div>

          {/* Settings Navigation */}
          <div className="bg-card rounded-lg border border-border mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6" aria-label="Settings Navigation">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => handleTabChange(tab)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-micro
                      ${activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                      }
                    `}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <ActiveComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;