import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ApiKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState([
    {
      id: "key_1",
      name: "Production API Key",
      key: "bp_live_sk_1234567890abcdef",
      created: "2024-10-15T10:30:00Z",
      lastUsed: "2024-10-31T05:45:00Z",
      permissions: ["read", "write"],
      status: "active",
      usage: 1247
    },
    {
      id: "key_2",
      name: "Development API Key",
      key: "bp_test_sk_abcdef1234567890",
      created: "2024-10-20T14:20:00Z",
      lastUsed: "2024-10-30T18:30:00Z",
      permissions: ["read"],
      status: "active",
      usage: 89
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState(new Set());

  const permissions = [
    { id: "read", label: "Read Access", description: "View payments and invoices" },
    { id: "write", label: "Write Access", description: "Create payments and invoices" },
    { id: "webhook", label: "Webhook Management", description: "Manage webhook endpoints" }
  ];

  const handleCreateKey = async () => {
    if (!newKeyName?.trim()) return;
    
    setIsCreating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newKey = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      key: `bp_live_sk_${Math.random()?.toString(36)?.substring(2, 18)}`,
      created: new Date()?.toISOString(),
      lastUsed: null,
      permissions: selectedPermissions,
      status: "active",
      usage: 0
    };

    setApiKeys(prev => [newKey, ...prev]);
    setShowCreateModal(false);
    setNewKeyName("");
    setSelectedPermissions([]);
    setIsCreating(false);
  };

  const handleRevokeKey = async (keyId) => {
    if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
      return;
    }

    setApiKeys(prev => prev?.map(key => 
      key?.id === keyId ? { ...key, status: "revoked" } : key
    ));
  };

  const toggleKeyVisibility = (keyId) => {
    setRevealedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(keyId)) {
        newSet?.delete(keyId);
      } else {
        newSet?.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const maskKey = (key) => {
    return key?.substring(0, 12) + "•"?.repeat(20) + key?.substring(key?.length - 4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">API Keys</h3>
          <p className="text-sm text-muted-foreground">
            Manage your API keys for secure integration with BlockPay
          </p>
        </div>
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={() => setShowCreateModal(true)}
        >
          Create API Key
        </Button>
      </div>
      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys?.map((apiKey) => (
          <div key={apiKey?.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  apiKey?.status === 'active' ? 'bg-success' : 'bg-destructive'
                }`} />
                <div>
                  <h4 className="text-md font-medium text-foreground">{apiKey?.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Created {formatDate(apiKey?.created)} • Last used {formatDate(apiKey?.lastUsed)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {apiKey?.status === 'active' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="RotateCcw"
                    onClick={() => handleRevokeKey(apiKey?.id)}
                  >
                    Rotate
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  onClick={() => handleRevokeKey(apiKey?.id)}
                  disabled={apiKey?.status === 'revoked'}
                >
                  Revoke
                </Button>
              </div>
            </div>

            {/* API Key Display */}
            <div className="bg-muted rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-foreground">
                  {revealedKeys?.has(apiKey?.id) ? apiKey?.key : maskKey(apiKey?.key)}
                </code>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName={revealedKeys?.has(apiKey?.id) ? "EyeOff" : "Eye"}
                    onClick={() => toggleKeyVisibility(apiKey?.id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Copy"
                    onClick={() => copyToClipboard(apiKey?.key)}
                  />
                </div>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Permissions
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {apiKey?.permissions?.map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Usage (30 days)
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {apiKey?.usage?.toLocaleString()} requests
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </p>
                <p className={`text-sm font-medium mt-1 capitalize ${
                  apiKey?.status === 'active' ? 'text-success' : 'text-destructive'
                }`}>
                  {apiKey?.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Create API Key</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateModal(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Key Name"
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e?.target?.value)}
                  placeholder="e.g., Production API Key"
                  required
                />

                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Permissions</p>
                  <div className="space-y-2">
                    {permissions?.map((permission) => (
                      <label
                        key={permission?.id}
                        className="flex items-start space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions?.includes(permission?.id)}
                          onChange={(e) => {
                            if (e?.target?.checked) {
                              setSelectedPermissions(prev => [...prev, permission?.id]);
                            } else {
                              setSelectedPermissions(prev => prev?.filter(p => p !== permission?.id));
                            }
                          }}
                          className="mt-1 w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">{permission?.label}</p>
                          <p className="text-xs text-muted-foreground">{permission?.description}</p>
                        </div>
                      </label>
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
                  onClick={handleCreateKey}
                  disabled={!newKeyName?.trim() || selectedPermissions?.length === 0}
                >
                  Create Key
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManagement;