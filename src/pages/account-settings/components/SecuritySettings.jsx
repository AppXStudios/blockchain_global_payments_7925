import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SecuritySettings = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showQrCode, setShowQrCode] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);

  const loginHistory = [
    {
      id: 1,
      timestamp: "2024-10-31T05:45:00Z",
      location: "San Francisco, CA",
      device: "Chrome on macOS",
      ip: "192.168.1.100",
      status: "success"
    },
    {
      id: 2,
      timestamp: "2024-10-30T18:30:00Z",
      location: "San Francisco, CA",
      device: "Safari on iPhone",
      ip: "192.168.1.101",
      status: "success"
    },
    {
      id: 3,
      timestamp: "2024-10-30T09:15:00Z",
      location: "San Francisco, CA",
      device: "Chrome on macOS",
      ip: "192.168.1.100",
      status: "success"
    },
    {
      id: 4,
      timestamp: "2024-10-29T14:22:00Z",
      location: "Unknown Location",
      device: "Chrome on Windows",
      ip: "203.0.113.1",
      status: "blocked"
    }
  ];

  const activeSessions = [
    {
      id: 1,
      device: "Chrome on macOS",
      location: "San Francisco, CA",
      lastActive: "2024-10-31T05:45:00Z",
      current: true
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "San Francisco, CA",
      lastActive: "2024-10-30T18:30:00Z",
      current: false
    }
  ];

  const handlePasswordChange = async () => {
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setIsChangingPassword(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleToggle2FA = async () => {
    if (twoFactorEnabled) {
      if (confirm("Are you sure you want to disable two-factor authentication? This will make your account less secure.")) {
        setTwoFactorEnabled(false);
      }
    } else {
      setShowQrCode(true);
    }
  };

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTwoFactorEnabled(true);
    setShowQrCode(false);
    setIsEnabling2FA(false);
  };

  const handleRevokeSession = async (sessionId) => {
    if (confirm("Are you sure you want to revoke this session?")) {
      // Simulate API call
      console.log("Revoking session:", sessionId);
    }
  };

  const formatDate = (dateString) => {
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
      <div>
        <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account security and authentication preferences
        </p>
      </div>
      {/* Password Change */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="Lock" size={20} className="text-primary" />
          </div>
          <div>
            <h4 className="text-md font-medium text-foreground">Change Password</h4>
            <p className="text-sm text-muted-foreground">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="md:col-span-2">
            <Input
              label="Current Password"
              type="password"
              value={passwordData?.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e?.target?.value }))}
              placeholder="Enter current password"
              required
            />
          </div>
          <Input
            label="New Password"
            type="password"
            value={passwordData?.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e?.target?.value }))}
            placeholder="Enter new password"
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData?.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e?.target?.value }))}
            placeholder="Confirm new password"
            required
          />
        </div>

        <div className="mt-6">
          <Button
            variant="default"
            loading={isChangingPassword}
            onClick={handlePasswordChange}
            disabled={!passwordData?.currentPassword || !passwordData?.newPassword || !passwordData?.confirmPassword}
          >
            Update Password
          </Button>
        </div>
      </div>
      {/* Two-Factor Authentication */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-success" />
            </div>
            <div>
              <h4 className="text-md font-medium text-foreground">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium ${twoFactorEnabled ? 'text-success' : 'text-muted-foreground'}`}>
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <Button
              variant={twoFactorEnabled ? "outline" : "default"}
              onClick={handleToggle2FA}
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>

        {twoFactorEnabled && (
          <div className="bg-success/5 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <p className="text-sm text-success">
                Two-factor authentication is active. Your account is protected with an additional security layer.
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Active Sessions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Icon name="Monitor" size={20} className="text-secondary" />
          </div>
          <div>
            <h4 className="text-md font-medium text-foreground">Active Sessions</h4>
            <p className="text-sm text-muted-foreground">
              Manage devices that are currently signed in to your account
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {activeSessions?.map((session) => (
            <div key={session?.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                  <Icon name="Smartphone" size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {session?.device}
                    {session?.current && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-success/10 text-success">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session?.location} • Last active {formatDate(session?.lastActive)}
                  </p>
                </div>
              </div>
              {!session?.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevokeSession(session?.id)}
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Login History */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Icon name="History" size={20} className="text-accent" />
          </div>
          <div>
            <h4 className="text-md font-medium text-foreground">Login History</h4>
            <p className="text-sm text-muted-foreground">
              Recent login attempts and security events
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {loginHistory?.map((login) => (
            <div key={login?.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  login?.status === 'success' ? 'bg-success' : 'bg-destructive'
                }`} />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {login?.device}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {login?.location} • {login?.ip}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {formatDate(login?.timestamp)}
                </p>
                <p className={`text-xs font-medium capitalize ${
                  login?.status === 'success' ? 'text-success' : 'text-destructive'
                }`}>
                  {login?.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 2FA Setup Modal */}
      {showQrCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Enable Two-Factor Authentication</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowQrCode(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="text-center space-y-4">
                <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
                  <div className="w-40 h-40 bg-black rounded-lg flex items-center justify-center">
                    <Icon name="QrCode" size={80} color="white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-foreground">
                    Scan this QR code with your authenticator app
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Or enter this code manually: <code className="bg-muted px-2 py-1 rounded">ABCD EFGH IJKL MNOP</code>
                  </p>
                </div>

                <Input
                  label="Verification Code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="text-center"
                />

                <div className="flex items-center justify-end space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowQrCode(false)}
                    disabled={isEnabling2FA}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    loading={isEnabling2FA}
                    onClick={handleEnable2FA}
                  >
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;