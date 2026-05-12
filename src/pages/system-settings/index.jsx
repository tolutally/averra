import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import AppLayout from '../../components/layout/AppLayout';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    workflow: true,
    participants: true,
    reports: false
  });

  const [generalSettings, setGeneralSettings] = useState({
    organizationName: 'Averra Solutions',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    sessionTimeout: '60',
    defaultWorkflow: 'employee-onboarding'
  });

  const [securitySettings, setSecuritySettings] = useState({
    mfaRequired: true,
    passwordComplexity: 'high',
    sessionDuration: '8',
    ipWhitelisting: false,
    auditLogging: true,
    encryptionLevel: 'aes256'
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    apiEnabled: true,
    webhookUrl: 'https://api.yourcompany.com/webhooks',
    slackIntegration: false,
    emailProvider: 'sendgrid',
    smsProvider: 'twilio',
    storageProvider: 'aws-s3'
  });

  const tabs = [
    { id: 'general', name: 'General', icon: 'Settings' },
    { id: 'security', name: 'Security', icon: 'Shield' },
    { id: 'notifications', name: 'Notifications', icon: 'Bell' },
    { id: 'integrations', name: 'Integrations', icon: 'Plug' },
    { id: 'advanced', name: 'Advanced', icon: 'Cog' }
  ];

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'UTC', label: 'UTC' }
  ];

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Settings saved successfully!');
    }, 2000);
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      // Reset logic here
      alert('Settings reset to defaults');
    }
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Organization Name"
          value={generalSettings?.organizationName}
          onChange={(e) => setGeneralSettings(prev => ({ ...prev, organizationName: e?.target?.value }))}
          placeholder="Enter organization name"
        />
        <Select
          label="Timezone"
          value={generalSettings?.timezone}
          onChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}
          options={timezoneOptions}
        />
        <Select
          label="Date Format"
          value={generalSettings?.dateFormat}
          onChange={(value) => setGeneralSettings(prev => ({ ...prev, dateFormat: value }))}
          options={dateFormatOptions}
        />
        <Select
          label="Language"
          value={generalSettings?.language}
          onChange={(value) => setGeneralSettings(prev => ({ ...prev, language: value }))}
          options={languageOptions}
        />
        <Input
          label="Session Timeout (minutes)"
          type="number"
          value={generalSettings?.sessionTimeout}
          onChange={(e) => setGeneralSettings(prev => ({ ...prev, sessionTimeout: e?.target?.value }))}
          placeholder="60"
        />
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Checkbox
            label="Require Multi-Factor Authentication"
            checked={securitySettings?.mfaRequired}
            onChange={(checked) => setSecuritySettings(prev => ({ ...prev, mfaRequired: checked }))}
          />
          <Checkbox
            label="Enable IP Whitelisting"
            checked={securitySettings?.ipWhitelisting}
            onChange={(checked) => setSecuritySettings(prev => ({ ...prev, ipWhitelisting: checked }))}
          />
          <Checkbox
            label="Enable Audit Logging"
            checked={securitySettings?.auditLogging}
            onChange={(checked) => setSecuritySettings(prev => ({ ...prev, auditLogging: checked }))}
          />
        </div>
        <div className="space-y-4">
          <Select
            label="Password Complexity"
            value={securitySettings?.passwordComplexity}
            onChange={(value) => setSecuritySettings(prev => ({ ...prev, passwordComplexity: value }))}
            options={[
              { value: 'low', label: 'Low - 6 characters minimum' },
              { value: 'medium', label: 'Medium - 8 characters with mixed case' },
              { value: 'high', label: 'High - 12 characters with symbols' }
            ]}
          />
          <Input
            label="Session Duration (hours)"
            type="number"
            value={securitySettings?.sessionDuration}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionDuration: e?.target?.value }))}
            placeholder="8"
          />
          <Select
            label="Encryption Level"
            value={securitySettings?.encryptionLevel}
            onChange={(value) => setSecuritySettings(prev => ({ ...prev, encryptionLevel: value }))}
            options={[
              { value: 'aes128', label: 'AES-128' },
              { value: 'aes256', label: 'AES-256' },
              { value: 'rsa2048', label: 'RSA-2048' }
            ]}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Delivery Methods</h3>
          <div className="space-y-3">
            <Checkbox
              label="Email Notifications"
              checked={notifications?.email}
              onChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
            />
            <Checkbox
              label="SMS Notifications"
              checked={notifications?.sms}
              onChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
            />
            <Checkbox
              label="Push Notifications"
              checked={notifications?.push}
              onChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Event Types</h3>
          <div className="space-y-3">
            <Checkbox
              label="Workflow Updates"
              checked={notifications?.workflow}
              onChange={(checked) => setNotifications(prev => ({ ...prev, workflow: checked }))}
            />
            <Checkbox
              label="Participant Activity"
              checked={notifications?.participants}
              onChange={(checked) => setNotifications(prev => ({ ...prev, participants: checked }))}
            />
            <Checkbox
              label="System Reports"
              checked={notifications?.reports}
              onChange={(checked) => setNotifications(prev => ({ ...prev, reports: checked }))}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Checkbox
            label="Enable API Access"
            checked={integrationSettings?.apiEnabled}
            onChange={(checked) => setIntegrationSettings(prev => ({ ...prev, apiEnabled: checked }))}
          />
          <Input
            label="Webhook URL"
            value={integrationSettings?.webhookUrl}
            onChange={(e) => setIntegrationSettings(prev => ({ ...prev, webhookUrl: e?.target?.value }))}
            placeholder="https://api.yourcompany.com/webhooks"
          />
          <Checkbox
            label="Slack Integration"
            checked={integrationSettings?.slackIntegration}
            onChange={(checked) => setIntegrationSettings(prev => ({ ...prev, slackIntegration: checked }))}
          />
        </div>
        <div className="space-y-4">
          <Select
            label="Email Provider"
            value={integrationSettings?.emailProvider}
            onChange={(value) => setIntegrationSettings(prev => ({ ...prev, emailProvider: value }))}
            options={[
              { value: 'sendgrid', label: 'SendGrid' },
              { value: 'mailchimp', label: 'Mailchimp' },
              { value: 'ses', label: 'Amazon SES' }
            ]}
          />
          <Select
            label="SMS Provider"
            value={integrationSettings?.smsProvider}
            onChange={(value) => setIntegrationSettings(prev => ({ ...prev, smsProvider: value }))}
            options={[
              { value: 'twilio', label: 'Twilio' },
              { value: 'nexmo', label: 'Nexmo' },
              { value: 'aws-sns', label: 'AWS SNS' }
            ]}
          />
          <Select
            label="Storage Provider"
            value={integrationSettings?.storageProvider}
            onChange={(value) => setIntegrationSettings(prev => ({ ...prev, storageProvider: value }))}
            options={[
              { value: 'aws-s3', label: 'Amazon S3' },
              { value: 'google-cloud', label: 'Google Cloud Storage' },
              { value: 'azure', label: 'Azure Blob Storage' }
            ]}
          />
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start">
          <Icon name="AlertTriangle" size={20} className="text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Advanced Settings</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
              These settings can affect system performance and should only be modified by technical administrators.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Database Connection Pool Size"
          type="number"
          placeholder="50"
        />
        <Input
          label="Cache TTL (seconds)"
          type="number"
          placeholder="3600"
        />
        <Input
          label="Max File Upload Size (MB)"
          type="number"
          placeholder="10"
        />
        <Input
          label="Worker Process Count"
          type="number"
          placeholder="4"
        />
      </div>
      
      <div className="pt-4 border-t border-border">
        <Button
          variant="destructive"
          iconName="Trash2"
          onClick={() => {
            if (window.confirm('This will permanently delete all data. Are you absolutely sure?')) {
              alert('System reset initiated');
            }
          }}
        >
          Reset All Data
        </Button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralTab();
      case 'security':
        return renderSecurityTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'integrations':
        return renderIntegrationsTab();
      case 'advanced':
        return renderAdvancedTab();
      default:
        return renderGeneralTab();
    }
  };

  return (
    <AppLayout>
      <main>
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
                <p className="mt-1 text-muted-foreground">
                  Configure system preferences, security, and integration settings
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Button
                  variant="outline"
                  iconName="RotateCcw"
                  onClick={handleResetSettings}
                >
                  Reset to Defaults
                </Button>
                <Button
                  iconName="Save"
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="space-y-1">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-foreground capitalize">{activeTab} Settings</h2>
                  <p className="text-muted-foreground mt-1">
                    {activeTab === 'general' && 'Configure basic system preferences and organization details'}
                    {activeTab === 'security' && 'Manage authentication, encryption, and access controls'}
                    {activeTab === 'notifications' && 'Control how and when notifications are sent'}
                    {activeTab === 'integrations' && 'Configure third-party services and API settings'}
                    {activeTab === 'advanced' && 'Advanced system configuration for technical users'}
                  </p>
                </div>
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default SystemSettings;