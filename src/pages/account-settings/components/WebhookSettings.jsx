import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const WebhookSettings = () => {
  const [webhooks, setWebhooks] = useState([
    {
      id: "webhook_1",
      name: "Production Webhook",
      url: "https://api.techcorp.com/webhooks/blockpay",
      events: ["payment.completed", "payment.failed", "withdrawal.completed"],
      status: "active",
      created: "2024-10-15T10:30:00Z",
      lastDelivery: "2024-10-31T05:45:00Z",
      deliveryRate: 99.2
    },
    {
      id: "webhook_2",
      name: "Development Webhook",
      url: "https://dev-api.techcorp.com/webhooks/blockpay",
      events: ["payment.completed", "invoice.created"],
      status: "active",
      created: "2024-10-20T14:20:00Z",
      lastDelivery: "2024-10-30T18:30:00Z",
      deliveryRate: 100
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    events: [],
    secret: ""
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const availableEvents = [
    {
      id: "payment.created",
      name: "Payment Created",
      description: "When a new payment is initiated"
    },
    {
      id: "payment.completed",
      name: "Payment Completed",
      description: "When a payment is successfully processed"
    },
    {
      id: "payment.failed",
      name: "Payment Failed",
      description: "When a payment fails or expires"
    },
    {
      id: "invoice.created",
      name: "Invoice Created",
      description: "When a new invoice is generated"
    },
    {
      id: "invoice.paid",
      name: "Invoice Paid",
      description: "When an invoice is successfully paid"
    },
    {
      id: "withdrawal.created",
      name: "Withdrawal Created",
      description: "When a withdrawal request is submitted"
    },
    {
      id: "withdrawal.completed",
      name: "Withdrawal Completed",
      description: "When a withdrawal is processed"
    },
    {
      id: "withdrawal.failed",
      name: "Withdrawal Failed",
      description: "When a withdrawal fails or is rejected"
    }
  ];

  const deliveryLogs = [
    {
      id: 1,
      timestamp: "2024-10-31T05:45:00Z",
      event: "payment.completed",
      status: "success",
      responseCode: 200,
      responseTime: 245
    },
    {
      id: 2,
      timestamp: "2024-10-31T05:30:00Z",
      event: "payment.created",
      status: "success",
      responseCode: 200,
      responseTime: 189
    },
    {
      id: 3,
      timestamp: "2024-10-31T05:15:00Z",
      event: "payment.failed",
      status: "failed",
      responseCode: 500,
      responseTime: 5000
    },
    {
      id: 4,
      timestamp: "2024-10-31T05:00:00Z",
      event: "withdrawal.completed",
      status: "success",
      responseCode: 200,
      responseTime: 312
    }
  ];

  const handleCreateWebhook = async () => {
    if (!newWebhook?.name || !newWebhook?.url || newWebhook?.events?.length === 0) {
      return;
    }

    setIsCreating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const webhook = {
      id: `webhook_${Date.now()}`,
      name: newWebhook?.name,
      url: newWebhook?.url,
      events: newWebhook?.events,
      status: "active",
      created: new Date()?.toISOString(),
      lastDelivery: null,
      deliveryRate: 0
    };

    setWebhooks(prev => [webhook, ...prev]);
    setShowCreateModal(false);
    setNewWebhook({ name: "", url: "", events: [], secret: "" });
    setIsCreating(false);
  };

  const handleTestWebhook = async () => {
    setIsTesting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsTesting(false);
    setShowTestModal(false);
  };

  const handleDeleteWebhook = async (webhookId) => {
    if (!confirm("Are you sure you want to delete this webhook? This action cannot be undone.")) {
      return;
    }

    setWebhooks(prev => prev?.filter(w => w?.id !== webhookId));
  };

  const handleToggleWebhook = async (webhookId) => {
    setWebhooks(prev => prev?.map(webhook => 
      webhook?.id === webhookId 
        ? { ...webhook, status: webhook?.status === 'active' ? 'inactive' : 'active' }
        : webhook
    ));
  };

  const handleEventToggle = (eventId, checked) => {
    if (checked) {
      setNewWebhook(prev => ({
        ...prev,
        events: [...prev?.events, eventId]
      }));
    } else {
      setNewWebhook(prev => ({
        ...prev,
        events: prev?.events?.filter(e => e !== eventId)
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Webhook Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Configure webhook endpoints to receive real-time event notifications
          </p>
        </div>
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={() => setShowCreateModal(true)}
        >
          Add Webhook
        </Button>
      </div>
      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks?.map((webhook) => (
          <div key={webhook?.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  webhook?.status === 'active' ? 'bg-success' : 'bg-muted-foreground'
                }`} />
                <div>
                  <h4 className="text-md font-medium text-foreground">{webhook?.name}</h4>
                  <p className="text-sm text-muted-foreground font-mono">{webhook?.url}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Play"
                  onClick={() => {
                    setSelectedWebhook(webhook);
                    setShowTestModal(true);
                  }}
                >
                  Test
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName={webhook?.status === 'active' ? "Pause" : "Play"}
                  onClick={() => handleToggleWebhook(webhook?.id)}
                >
                  {webhook?.status === 'active' ? 'Disable' : 'Enable'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  onClick={() => handleDeleteWebhook(webhook?.id)}
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* Webhook Details */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Events
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {webhook?.events?.slice(0, 2)?.map((event) => (
                    <span
                      key={event}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
                    >
                      {event?.split('.')?.[1]}
                    </span>
                  ))}
                  {webhook?.events?.length > 2 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                      +{webhook?.events?.length - 2}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Delivery Rate
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {webhook?.deliveryRate}%
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last Delivery
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {formatDate(webhook?.lastDelivery)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </p>
                <p className={`text-sm font-medium mt-1 capitalize ${
                  webhook?.status === 'active' ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {webhook?.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Delivery Logs */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Icon name="Activity" size={20} className="text-accent" />
          </div>
          <div>
            <h4 className="text-md font-medium text-foreground">Recent Deliveries</h4>
            <p className="text-sm text-muted-foreground">
              Latest webhook delivery attempts and their status
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {deliveryLogs?.map((log) => (
            <div key={log?.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  log?.status === 'success' ? 'bg-success' : 'bg-destructive'
                }`} />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {log?.event}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(log?.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {log?.responseCode}
                </p>
                <p className="text-xs text-muted-foreground">
                  {log?.responseTime}ms
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Create Webhook Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Create Webhook</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateModal(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-6">
                <Input
                  label="Webhook Name"
                  type="text"
                  value={newWebhook?.name}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e?.target?.value }))}
                  placeholder="e.g., Production Webhook"
                  required
                />

                <Input
                  label="Endpoint URL"
                  type="url"
                  value={newWebhook?.url}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e?.target?.value }))}
                  placeholder="https://api.example.com/webhooks/blockpay"
                  description="The URL where webhook events will be sent"
                  required
                />

                <Input
                  label="Secret Key (Optional)"
                  type="password"
                  value={newWebhook?.secret}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, secret: e?.target?.value }))}
                  placeholder="Enter secret for signature verification"
                  description="Used to verify webhook authenticity"
                />

                <div>
                  <p className="text-sm font-medium text-foreground mb-4">Select Events</p>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {availableEvents?.map((event) => (
                      <div key={event?.id} className="flex items-start space-x-3">
                        <Checkbox
                          checked={newWebhook?.events?.includes(event?.id)}
                          onChange={(e) => handleEventToggle(event?.id, e?.target?.checked)}
                          className="mt-1"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">{event?.name}</p>
                          <p className="text-xs text-muted-foreground">{event?.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  loading={isCreating}
                  onClick={handleCreateWebhook}
                  disabled={!newWebhook?.name || !newWebhook?.url || newWebhook?.events?.length === 0}
                >
                  Create Webhook
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Test Webhook Modal */}
      {showTestModal && selectedWebhook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Test Webhook</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowTestModal(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Webhook Endpoint</p>
                  <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                    {selectedWebhook?.url}
                  </p>
                </div>

                <Select
                  label="Test Event"
                  options={availableEvents?.filter(event => selectedWebhook?.events?.includes(event?.id))?.map(event => ({ value: event?.id, label: event?.name }))
                  }
                  placeholder="Select event to test"
                />

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Test Payload Preview</p>
                  <pre className="text-xs text-foreground overflow-x-auto">
{`{
  "event": "payment.completed",
  "data": {
    "id": "pay_test_123",
    "amount": "100.00",
    "currency": "USD",
    "status": "completed"
  },
  "timestamp": "${new Date()?.toISOString()}"
}`}
                  </pre>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowTestModal(false)}
                  disabled={isTesting}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  loading={isTesting}
                  onClick={handleTestWebhook}
                  iconName="Send"
                  iconPosition="left"
                >
                  Send Test
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookSettings;