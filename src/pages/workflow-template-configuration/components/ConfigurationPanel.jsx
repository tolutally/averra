import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ConfigurationPanel = ({ 
  template, 
  onConfigUpdate,
  onSave,
  onTest,
  onDeploy 
}) => {
  const [activeTab, setActiveTab] = useState('general');

  const configTabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'advanced', label: 'Advanced', icon: 'Cog' }
  ];

  const defaultConfig = {
    general: {
      templateName: template?.name || 'New Template',
      description: template?.description || '',
      businessHours: {
        start: '09:00',
        end: '17:00',
        timezone: 'America/New_York',
        workdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      },
      slaTimeframe: 72,
      autoAdvance: true,
      mobileOptimized: true
    },
    security: {
      strictMode: false,
      ipAllowlist: [],
      otpRequired: false,
      dataRetentionDays: 2555, // 7 years
      encryptionEnabled: true,
      auditLogging: true
    },
    notifications: {
      reminderEnabled: true,
      escalationEnabled: true,
      completionNotification: true,
      coordinatorAlerts: true,
      emailTemplate: 'default'
    },
    advanced: {
      versionControl: true,
      conditionalLogic: false,
      externalIntegrations: [],
      customFields: [],
      webhookUrl: ''
    }
  };

  const [config, setConfig] = useState(template?.config || defaultConfig);

  const updateConfig = (section, key, value) => {
    const updatedConfig = {
      ...config,
      [section]: {
        ...config?.[section],
        [key]: value
      }
    };
    setConfig(updatedConfig);
    onConfigUpdate(updatedConfig);
  };

  const updateNestedConfig = (section, parentKey, childKey, value) => {
    const updatedConfig = {
      ...config,
      [section]: {
        ...config?.[section],
        [parentKey]: {
          ...config?.[section]?.[parentKey],
          [childKey]: value
        }
      }
    };
    setConfig(updatedConfig);
    onConfigUpdate(updatedConfig);
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Template Information</h3>
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={config?.general?.templateName}
            onChange={(e) => updateConfig('general', 'templateName', e?.target?.value)}
            placeholder="Enter template name"
          />
          <Input
            label="Description"
            value={config?.general?.description}
            onChange={(e) => updateConfig('general', 'description', e?.target?.value)}
            placeholder="Describe this workflow template"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Business Hours</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              value={config?.general?.businessHours?.start}
              onChange={(e) => updateNestedConfig('general', 'businessHours', 'start', e?.target?.value)}
            />
            <Input
              label="End Time"
              type="time"
              value={config?.general?.businessHours?.end}
              onChange={(e) => updateNestedConfig('general', 'businessHours', 'end', e?.target?.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Working Days
            </label>
            <div className="flex flex-wrap gap-2">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']?.map((day) => (
                <Checkbox
                  key={day}
                  label={day?.charAt(0)?.toUpperCase() + day?.slice(1)}
                  checked={config?.general?.businessHours?.workdays?.includes(day)}
                  onChange={(e) => {
                    const current = config?.general?.businessHours?.workdays;
                    const updated = e?.target?.checked
                      ? [...current, day]
                      : current?.filter(d => d !== day);
                    updateNestedConfig('general', 'businessHours', 'workdays', updated);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Workflow Settings</h3>
        <div className="space-y-4">
          <Input
            label="SLA Timeframe (hours)"
            type="number"
            value={config?.general?.slaTimeframe}
            onChange={(e) => updateConfig('general', 'slaTimeframe', parseInt(e?.target?.value))}
          />
          <div className="space-y-2">
            <Checkbox
              label="Auto-advance to next step after submission"
              checked={config?.general?.autoAdvance}
              onChange={(e) => updateConfig('general', 'autoAdvance', e?.target?.checked)}
            />
            <Checkbox
              label="Mobile-optimized interface"
              checked={config?.general?.mobileOptimized}
              onChange={(e) => updateConfig('general', 'mobileOptimized', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Security Settings</h3>
        <div className="space-y-4">
          <Checkbox
            label="Enable Security Strict Mode"
            description="Prevents email attachments and enforces additional security measures"
            checked={config?.security?.strictMode}
            onChange={(e) => updateConfig('security', 'strictMode', e?.target?.checked)}
          />
          <Checkbox
            label="Require OTP for sensitive steps"
            checked={config?.security?.otpRequired}
            onChange={(e) => updateConfig('security', 'otpRequired', e?.target?.checked)}
          />
          <Checkbox
            label="Enable file encryption"
            checked={config?.security?.encryptionEnabled}
            onChange={(e) => updateConfig('security', 'encryptionEnabled', e?.target?.checked)}
          />
          <Checkbox
            label="Enable audit logging"
            checked={config?.security?.auditLogging}
            onChange={(e) => updateConfig('security', 'auditLogging', e?.target?.checked)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">IP Allowlist Management</h3>
        <div className="space-y-4">
          <Input
            label="Add IP Address"
            placeholder="192.168.1.1 or 192.168.1.0/24"
          />
          <div className="space-y-2">
            {config?.security?.ipAllowlist?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No IP restrictions configured</p>
            ) : (
              config?.security?.ipAllowlist?.map((ip, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="font-mono text-sm">{ip}</span>
                  <Button variant="ghost" size="sm" iconName="Trash2" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Data Retention</h3>
        <Input
          label="Data Retention Period (days)"
          type="number"
          value={config?.security?.dataRetentionDays}
          onChange={(e) => updateConfig('security', 'dataRetentionDays', parseInt(e?.target?.value))}
          description="How long to retain case data after completion"
        />
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <Checkbox
            label="Enable reminder notifications"
            description="Send reminders based on configured cadence"
            checked={config?.notifications?.reminderEnabled}
            onChange={(e) => updateConfig('notifications', 'reminderEnabled', e?.target?.checked)}
          />
          <Checkbox
            label="Enable escalation notifications"
            description="Notify coordinators when steps are overdue"
            checked={config?.notifications?.escalationEnabled}
            onChange={(e) => updateConfig('notifications', 'escalationEnabled', e?.target?.checked)}
          />
          <Checkbox
            label="Send completion notifications"
            checked={config?.notifications?.completionNotification}
            onChange={(e) => updateConfig('notifications', 'completionNotification', e?.target?.checked)}
          />
          <Checkbox
            label="Coordinator alerts"
            description="Real-time alerts for coordinators"
            checked={config?.notifications?.coordinatorAlerts}
            onChange={(e) => updateConfig('notifications', 'coordinatorAlerts', e?.target?.checked)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Email Templates</h3>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Template
          </label>
          <select
            value={config?.notifications?.emailTemplate}
            onChange={(e) => updateConfig('notifications', 'emailTemplate', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="default">Default Template</option>
            <option value="professional">Professional Template</option>
            <option value="minimal">Minimal Template</option>
            <option value="branded">Branded Template</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Advanced Features</h3>
        <div className="space-y-4">
          <Checkbox
            label="Enable version control"
            description="Track template changes and allow rollbacks"
            checked={config?.advanced?.versionControl}
            onChange={(e) => updateConfig('advanced', 'versionControl', e?.target?.checked)}
          />
          <Checkbox
            label="Enable conditional logic"
            description="Allow steps to show/hide based on previous responses"
            checked={config?.advanced?.conditionalLogic}
            onChange={(e) => updateConfig('advanced', 'conditionalLogic', e?.target?.checked)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">External Integrations</h3>
        <div className="space-y-4">
          <Input
            label="Webhook URL"
            value={config?.advanced?.webhookUrl}
            onChange={(e) => updateConfig('advanced', 'webhookUrl', e?.target?.value)}
            placeholder="https://your-api.com/webhook"
            description="Receive real-time updates about workflow progress"
          />
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Available Integrations
            </label>
            <div className="space-y-2">
              {['Slack', 'Microsoft Teams', 'Salesforce', 'HubSpot']?.map((integration) => (
                <div key={integration} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Plug" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium">{integration}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
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
      case 'advanced':
        return renderAdvancedTab();
      default:
        return renderGeneralTab();
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Configure workflow settings and behavior
        </p>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {configTabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>
      {/* Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              iconName="Eye"
              iconPosition="left"
              onClick={onTest}
            >
              Preview
            </Button>
            <Button
              variant="outline"
              iconName="Play"
              iconPosition="left"
              onClick={onTest}
            >
              Test
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              iconName="Save"
              iconPosition="left"
              onClick={onSave}
            >
              Save Template
            </Button>
            <Button
              variant="default"
              iconName="Rocket"
              iconPosition="left"
              onClick={onDeploy}
            >
              Deploy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;