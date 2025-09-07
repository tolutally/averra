import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import StepBuilder from '../workflow-template-configuration/components/StepBuilder';
import ConfigurationPanel from '../workflow-template-configuration/components/ConfigurationPanel';
import TemplatePreview from '../workflow-template-configuration/components/TemplatePreview';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const WorkflowBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isSaving, setIsSaving] = useState(false);

  const userProfile = {
    name: "Alex Thompson",
    role: "Workflow Coordinator",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
  };

  // Initialize with template from navigation state or create new
  useEffect(() => {
    if (location.state?.template) {
      setSelectedTemplate(location.state.template);
    } else {
      // Create a new blank template
      const newTemplate = {
        id: `template-${Date.now()}`,
        name: 'New Custom Workflow',
        category: 'custom',
        description: 'Custom workflow for new case',
        steps: [],
        avgCompletion: '0 days',
        completionRate: 0,
        isStarter: false,
        tags: ['Custom', 'New'],
        config: {
          general: {
            templateName: 'New Custom Workflow',
            description: '',
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
            dataRetentionDays: 2555,
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
        }
      };
      setSelectedTemplate(newTemplate);
    }
  }, [location.state]);

  const handleStepUpdate = (stepId, updates) => {
    if (!selectedTemplate) return;
    
    const updatedSteps = selectedTemplate?.steps?.map(step =>
      step?.id === stepId ? { ...step, ...updates } : step
    );
    
    setSelectedTemplate({
      ...selectedTemplate,
      steps: updatedSteps
    });
  };

  const handleStepAdd = (newStep) => {
    if (!selectedTemplate) return;
    
    setSelectedTemplate({
      ...selectedTemplate,
      steps: [...selectedTemplate?.steps, newStep]
    });
  };

  const handleStepDelete = (stepId) => {
    if (!selectedTemplate) return;
    
    const updatedSteps = selectedTemplate?.steps?.filter(step => step?.id !== stepId);
    setSelectedTemplate({
      ...selectedTemplate,
      steps: updatedSteps
    });
  };

  const handleStepReorder = (draggedStepId, targetStepId) => {
    if (!selectedTemplate) return;
    
    const steps = [...selectedTemplate?.steps];
    const draggedIndex = steps?.findIndex(step => step?.id === draggedStepId);
    const targetIndex = steps?.findIndex(step => step?.id === targetStepId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedStep] = steps?.splice(draggedIndex, 1);
      steps?.splice(targetIndex, 0, draggedStep);
      
      // Update order numbers
      const reorderedSteps = steps?.map((step, index) => ({
        ...step,
        order: index + 1
      }));
      
      setSelectedTemplate({
        ...selectedTemplate,
        steps: reorderedSteps
      });
    }
  };

  const handleConfigUpdate = (config) => {
    if (!selectedTemplate) return;
    
    setSelectedTemplate({
      ...selectedTemplate,
      config
    });
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;
    
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Workflow saved:', selectedTemplate);
      // Show success notification
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Error saving workflow:', error);
      // Show error notification
      alert('Error saving workflow');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = () => {
    setShowPreview(true);
    setPreviewMode('desktop');
  };

  const handleDeploy = async () => {
    if (!selectedTemplate) return;
    
    try {
      // Simulate deployment
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Workflow deployed:', selectedTemplate);
      // Show success notification
      alert('Workflow deployed successfully!');
      // Navigate back to templates or dashboard
      navigate('/workflow-template-configuration');
    } catch (error) {
      console.error('Error deploying workflow:', error);
      // Show error notification
      alert('Error deploying workflow');
    }
  };

  const handleGoBack = () => {
    navigate('/workflow-template-configuration');
  };

  return (
    <AppLayout userProfile={userProfile}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={handleGoBack}
              >
                Back to Templates
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {selectedTemplate?.name || 'Workflow Builder'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Design and configure your workflow steps
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                iconName="Eye"
                iconPosition="left"
                onClick={handleTest}
              >
                Preview
              </Button>
              <Button
                variant="outline"
                iconName="Save"
                iconPosition="left"
                onClick={handleSave}
                loading={isSaving}
              >
                Save
              </Button>
              <Button
                variant="default"
                iconName="Rocket"
                iconPosition="left"
                onClick={handleDeploy}
              >
                Deploy
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Step Builder - Main Area */}
          <div className="flex-1 min-w-0">
            {selectedTemplate ? (
              <StepBuilder
                template={selectedTemplate}
                onStepUpdate={handleStepUpdate}
                onStepAdd={handleStepAdd}
                onStepDelete={handleStepDelete}
                onStepReorder={handleStepReorder}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-background">
                <div className="text-center max-w-md mx-auto p-6">
                  <Icon name="Workflow" size={64} className="text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Loading Workflow Builder...
                  </h2>
                  <p className="text-muted-foreground">
                    Setting up your workflow building environment
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Configuration Panel - Right Panel */}
          {selectedTemplate && (
            <div className="w-80 lg:w-96 flex-shrink-0 hidden lg:block">
              <ConfigurationPanel
                template={selectedTemplate}
                onConfigUpdate={handleConfigUpdate}
                onSave={handleSave}
                onTest={handleTest}
                onDeploy={handleDeploy}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Actions Bar */}
      {selectedTemplate && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 lg:hidden z-40">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Eye"
              iconPosition="left"
              onClick={handleTest}
              className="flex-1"
            >
              Preview
            </Button>
            <Button
              variant="outline"
              iconName="Save"
              iconPosition="left"
              onClick={handleSave}
              loading={isSaving}
              className="flex-1"
            >
              Save
            </Button>
            <Button
              variant="default"
              iconName="Rocket"
              iconPosition="left"
              onClick={handleDeploy}
              className="flex-1"
            >
              Deploy
            </Button>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      <TemplatePreview
        template={selectedTemplate}
        isVisible={showPreview}
        onClose={() => setShowPreview(false)}
        viewMode={previewMode}
      />
    </AppLayout>
  );
};

export default WorkflowBuilder;
