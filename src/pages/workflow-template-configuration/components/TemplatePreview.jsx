import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TemplatePreview = ({ 
  template, 
  isVisible, 
  onClose,
  viewMode = 'desktop' // 'desktop' | 'mobile'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [previewMode, setPreviewMode] = useState(viewMode);

  if (!isVisible || !template) return null;

  const steps = template?.steps || [];
  const currentStepData = steps?.[currentStep];

  const mockParticipantData = {
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    company: "TechCorp Solutions",
    progress: Math.round(((currentStep + 1) / steps?.length) * 100)
  };

  const renderStepContent = (step) => {
    switch (step?.type) {
      case 'document':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground mb-1">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Accepted: {step?.acceptedFiles?.join(', ')} • Max size: {step?.maxFileSize}
              </p>
            </div>
            {step?.validationRules && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Requirements:</h4>
                <ul className="space-y-1">
                  {step?.validationRules?.map((rule, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                      <Icon name="Check" size={14} className="text-success mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'form':
        return (
          <div className="space-y-4">
            {step?.fields?.map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {field?.name?.charAt(0)?.toUpperCase() + field?.name?.slice(1)}
                  {field?.required && <span className="text-error ml-1">*</span>}
                </label>
                {field?.type === 'textarea' ? (
                  <textarea
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    rows={3}
                    placeholder={`Enter ${field?.name}`}
                  />
                ) : (
                  <input
                    type={field?.type}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    placeholder={`Enter ${field?.name}`}
                  />
                )}
              </div>
            ))}
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Identity Verification</h3>
              <p className="text-sm text-muted-foreground">
                We need to verify your identity to proceed with the onboarding process.
              </p>
            </div>
            {step?.otpRequired && (
              <div className="bg-muted/50 rounded-lg p-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Enter OTP sent to your phone
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5, 6]?.map((digit) => (
                    <input
                      key={digit}
                      type="text"
                      maxLength={1}
                      className="w-10 h-10 text-center border border-border rounded-md bg-background text-foreground"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <Icon name="FileText" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Step content preview</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-background rounded-lg shadow-elevated max-h-[90vh] overflow-hidden ${
        previewMode === 'mobile' ? 'w-full max-w-sm' : 'w-full max-w-4xl'
      }`}>
        {/* Preview Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-foreground">Template Preview</h2>
            <div className="flex items-center space-x-1 bg-muted rounded-md p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`px-2 py-1 rounded text-xs transition-smooth ${
                  previewMode === 'desktop' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="Monitor" size={14} />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`px-2 py-1 rounded text-xs transition-smooth ${
                  previewMode === 'mobile' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="Smartphone" size={14} />
              </button>
            </div>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Simulated Browser/Mobile Frame */}
          <div className={`${previewMode === 'mobile' ? 'p-4' : 'p-6'}`}>
            {/* Progress Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Shield" size={16} color="white" />
                  </div>
                  <span className="font-semibold text-foreground">OnboardFlow</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps?.length}
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div 
                  className="bg-primary h-2 rounded-full transition-smooth"
                  style={{ width: `${mockParticipantData?.progress}%` }}
                />
              </div>
              
              <div className="text-center">
                <h1 className="text-xl font-semibold text-foreground mb-1">
                  Welcome, {mockParticipantData?.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {mockParticipantData?.company} • {mockParticipantData?.email}
                </p>
              </div>
            </div>

            {/* Current Step */}
            {currentStepData && (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      STEP {currentStep + 1}
                    </span>
                    {currentStepData?.required && (
                      <span className="text-xs text-error">Required</span>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    {currentStepData?.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {currentStepData?.description}
                  </p>
                </div>

                {renderStepContent(currentStepData)}

                {/* Step Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    iconName="ArrowLeft"
                    iconPosition="left"
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      Save Draft
                    </Button>
                    <Button
                      variant="default"
                      iconName="ArrowRight"
                      iconPosition="right"
                      onClick={() => setCurrentStep(Math.min(steps?.length - 1, currentStep + 1))}
                    >
                      {currentStep === steps?.length - 1 ? 'Complete' : 'Continue'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation */}
            <div className="mt-6">
              <div className="flex items-center justify-center space-x-2">
                {steps?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-smooth ${
                      index === currentStep
                        ? 'bg-primary'
                        : index < currentStep
                        ? 'bg-success' :'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Footer */}
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Preview Mode • {previewMode === 'mobile' ? 'Mobile' : 'Desktop'} View
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">
                {steps?.length} steps • ~{template?.avgCompletion || '2.5 days'} completion
              </span>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;