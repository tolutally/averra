import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import TemplateLibrary from './components/TemplateLibrary';
import TemplateDetailsPanel from './components/TemplateDetailsPanel';
import TemplatePreview from './components/TemplatePreview';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const WorkflowTemplateConfiguration = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showMobileConfig, setShowMobileConfig] = useState(false);
  const [templateUpdates, setTemplateUpdates] = useState({});

  const userProfile = {
    name: "Alex Thompson",
    role: "Workflow Coordinator",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleTemplateUpdate = (templateId, updateType, updateValue) => {
    setTemplateUpdates(prev => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        [updateType]: updateValue
      }
    }));
    
    // Update selected template if it's the one being modified
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(prev => ({
        ...prev,
        [updateType]: updateValue
      }));
    }
  };

  const handleCreateNewCase = () => {
    // Navigate to case creation page
    navigate('/case-creation');
  };

  const handleTest = () => {
    setShowPreview(true);
    setPreviewMode('desktop');
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      // Navigate to workflow builder with selected template
      navigate('/workflow-builder', { state: { template: selectedTemplate } });
    }
  };

  return (
    <AppLayout userProfile={userProfile}>
      <div className="h-full flex">
        {/* Template Library - Left Panel */}
        <div className="w-80 lg:w-96 flex-shrink-0 hidden lg:block">
          <TemplateLibrary
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            onCreateNew={handleCreateNewCase}
            onTemplateUpdate={handleTemplateUpdate}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Central Content */}
          <div className="h-full">
            {selectedTemplate ? (
              <TemplateDetailsPanel
                template={selectedTemplate}
                onUseTemplate={handleUseTemplate}
                onTest={handleTest}
                onClose={() => setSelectedTemplate(null)}
                templateUpdates={templateUpdates}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-background">
                <div className="text-center max-w-md mx-auto p-6">
                  <Icon name="Workflow" size={64} className="text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Select a Template to Get Started
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Choose from our starter templates or create a custom workflow from scratch
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="default"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={handleCreateNewCase}
                    >
                      Create New Case
                    </Button>
                    <Button
                      variant="outline"
                      iconName="Menu"
                      iconPosition="left"
                      onClick={() => setShowMobileConfig(true)}
                      className="lg:hidden"
                    >
                      Browse Templates
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Template Library Modal */}
      {showMobileConfig && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute inset-y-0 left-0 w-80 bg-background">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Templates</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => setShowMobileConfig(false)}
                />
              </div>
              <div className="flex-1">
                <TemplateLibrary
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={(template) => {
                    handleTemplateSelect(template);
                    setShowMobileConfig(false);
                  }}
                  onCreateNew={() => {
                    handleCreateNewCase();
                    setShowMobileConfig(false);
                  }}
                  onTemplateUpdate={handleTemplateUpdate}
                />
              </div>
            </div>
          </div>
        </div>
      )}

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
              variant="default"
              iconName="Play"
              iconPosition="left"
              onClick={handleUseTemplate}
              className="flex-1"
            >
              Use Template
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

export default WorkflowTemplateConfiguration;
