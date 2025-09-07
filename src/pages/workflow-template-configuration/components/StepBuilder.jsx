import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const StepBuilder = ({ 
  template, 
  onStepUpdate, 
  onStepAdd, 
  onStepDelete, 
  onStepReorder 
}) => {
  const [draggedStep, setDraggedStep] = useState(null);
  const [editingStep, setEditingStep] = useState(null);

  const stepTypes = [
    { id: 'document', label: 'Document Upload', icon: 'Upload', color: 'text-blue-600' },
    { id: 'form', label: 'Form Fields', icon: 'FileText', color: 'text-green-600' },
    { id: 'verification', label: 'Identity Verification', icon: 'Shield', color: 'text-purple-600' },
    { id: 'approval', label: 'Manual Approval', icon: 'CheckCircle', color: 'text-orange-600' },
    { id: 'otp', label: 'OTP Verification', icon: 'Smartphone', color: 'text-red-600' },
    { id: 'signature', label: 'Digital Signature', icon: 'PenTool', color: 'text-indigo-600' }
  ];

  const defaultSteps = [
    {
      id: 'step-1',
      type: 'document',
      title: 'Business Registration',
      description: 'Upload your business registration certificate',
      required: true,
      order: 1,
      acceptedFiles: ['PDF', 'JPG', 'PNG'],
      maxFileSize: '10MB',
      validationRules: ['File must be clear and readable', 'Document must be current (within 6 months)'],
      reminderCadence: 48,
      escalationHours: 120,
      dependencies: []
    },
    {
      id: 'step-2',
      type: 'form',
      title: 'Company Information',
      description: 'Provide basic company details and contact information',
      required: true,
      order: 2,
      fields: [
        { name: 'companyName', type: 'text', required: true },
        { name: 'taxId', type: 'text', required: true },
        { name: 'address', type: 'textarea', required: true }
      ],
      reminderCadence: 24,
      escalationHours: 72,
      dependencies: ['step-1']
    },
    {
      id: 'step-3',
      type: 'verification',
      title: 'Identity Verification',
      description: 'Verify the identity of authorized signatories',
      required: true,
      order: 3,
      otpRequired: true,
      reminderCadence: 24,
      escalationHours: 48,
      dependencies: ['step-2']
    }
  ];

  const workflowSteps = template?.steps || defaultSteps;

  const handleDragStart = (e, step) => {
    setDraggedStep(step);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStep) => {
    e?.preventDefault();
    if (draggedStep && draggedStep?.id !== targetStep?.id) {
      onStepReorder(draggedStep?.id, targetStep?.id);
    }
    setDraggedStep(null);
  };

  const getStepTypeConfig = (type) => {
    return stepTypes?.find(t => t?.id === type) || stepTypes?.[0];
  };

  const addNewStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      type: 'document',
      title: 'New Step',
      description: 'Step description',
      required: true,
      order: workflowSteps?.length + 1,
      reminderCadence: 48,
      escalationHours: 120,
      dependencies: []
    };
    onStepAdd(newStep);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Workflow Builder</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Drag and drop to reorder steps, click to edit configuration
            </p>
          </div>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={addNewStep}
          >
            Add Step
          </Button>
        </div>
      </div>
      {/* Step Builder Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {workflowSteps?.map((step, index) => {
            const stepConfig = getStepTypeConfig(step?.type);
            const isEditing = editingStep === step?.id;

            return (
              <div
                key={step?.id}
                draggable
                onDragStart={(e) => handleDragStart(e, step)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, step)}
                className={`relative bg-card border border-border rounded-lg p-4 cursor-move transition-smooth ${
                  draggedStep?.id === step?.id ? 'opacity-50' : 'hover:shadow-subtle'
                }`}
              >
                {/* Step Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Icon name="GripVertical" size={16} className="text-muted-foreground" />
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-muted ${stepConfig?.color}`}>
                        <Icon name={stepConfig?.icon} size={16} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          STEP {step?.order}
                        </span>
                        {step?.required && (
                          <span className="text-xs text-error">Required</span>
                        )}
                      </div>
                      <h3 className="font-medium text-foreground">{step?.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => setEditingStep(isEditing ? null : step?.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => onStepDelete(step?.id)}
                    />
                  </div>
                </div>
                {/* Step Content */}
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{step?.description}</p>

                  {/* Step Configuration */}
                  {isEditing ? (
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Step Title"
                          value={step?.title}
                          onChange={(e) => onStepUpdate(step?.id, { title: e?.target?.value })}
                        />
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Step Type
                          </label>
                          <select
                            value={step?.type}
                            onChange={(e) => onStepUpdate(step?.id, { type: e?.target?.value })}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                          >
                            {stepTypes?.map((type) => (
                              <option key={type?.id} value={type?.id}>
                                {type?.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <Input
                        label="Description"
                        value={step?.description}
                        onChange={(e) => onStepUpdate(step?.id, { description: e?.target?.value })}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Reminder Cadence (hours)"
                          type="number"
                          value={step?.reminderCadence}
                          onChange={(e) => onStepUpdate(step?.id, { reminderCadence: parseInt(e?.target?.value) })}
                        />
                        <Input
                          label="Escalation After (hours)"
                          type="number"
                          value={step?.escalationHours}
                          onChange={(e) => onStepUpdate(step?.id, { escalationHours: parseInt(e?.target?.value) })}
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <Checkbox
                          label="Required Step"
                          checked={step?.required}
                          onChange={(e) => onStepUpdate(step?.id, { required: e?.target?.checked })}
                        />
                        {step?.type === 'verification' && (
                          <Checkbox
                            label="OTP Required"
                            checked={step?.otpRequired}
                            onChange={(e) => onStepUpdate(step?.id, { otpRequired: e?.target?.checked })}
                          />
                        )}
                      </div>

                      {step?.type === 'document' && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground">
                            Accepted File Types
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {['PDF', 'JPG', 'PNG', 'DOC', 'DOCX']?.map((fileType) => (
                              <Checkbox
                                key={fileType}
                                label={fileType}
                                checked={step?.acceptedFiles?.includes(fileType)}
                                onChange={(e) => {
                                  const current = step?.acceptedFiles || [];
                                  const updated = e?.target?.checked
                                    ? [...current, fileType]
                                    : current?.filter(t => t !== fileType);
                                  onStepUpdate(step?.id, { acceptedFiles: updated });
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4 text-muted-foreground">
                        <span>Type: {stepConfig?.label}</span>
                        <span>Reminder: {step?.reminderCadence}h</span>
                        <span>Escalation: {step?.escalationHours}h</span>
                      </div>
                      {step?.dependencies?.length > 0 && (
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Icon name="ArrowRight" size={14} />
                          <span>Depends on {step?.dependencies?.length} step(s)</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Flow Arrow */}
                {index < workflowSteps?.length - 1 && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="ArrowDown" size={16} color="white" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {workflowSteps?.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Workflow" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Steps Added</h3>
              <p className="text-muted-foreground mb-4">
                Start building your workflow by adding the first step
              </p>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={addNewStep}
              >
                Add First Step
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepBuilder;