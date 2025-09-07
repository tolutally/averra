import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import AppLayout from '../../components/layout/AppLayout';
import { convertTemplateToCase } from '../../services/caseConverter';
import { generateParticipantLinks, sendInvitationEmails, generateCaseInvitationSummary } from '../../services/caseInitiation';

const CaseCreation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedTemplate = location.state?.template;

  const [currentStep, setCurrentStep] = useState(preselectedTemplate ? 1 : 0); // 0: template selection, 1: case details, 2: review
  const [selectedTemplate, setSelectedTemplate] = useState(preselectedTemplate);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    caseDescription: '',
    priority: 'medium',
    deadline: '',
    coordinatorId: '',
    templateId: selectedTemplate?.id || '',
    caseName: ''
  });

  const [participants, setParticipants] = useState([
    { id: 1, email: '', role: 'participant', name: '' }
  ]);

  const [errors, setErrors] = useState({});

  // Mock coordinators data
  const coordinators = [
    { value: 'coord-1', label: 'Sarah Johnson' },
    { value: 'coord-2', label: 'Mike Chen' },
    { value: 'coord-3', label: 'Lisa Wang' },
    { value: 'coord-4', label: 'John Davis' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const roleOptions = [
    { value: 'participant', label: 'Participant' },
    { value: 'reviewer', label: 'Reviewer' },
    { value: 'observer', label: 'Observer' }
  ];

  // Auto-generate case name when client name or template changes
  useEffect(() => {
    if (formData.clientName && selectedTemplate) {
      const dateSuffix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      setFormData(prev => ({
        ...prev,
        caseName: `${formData.clientName} - ${selectedTemplate.name} - ${dateSuffix}`
      }));
    }
  }, [formData.clientName, selectedTemplate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const addParticipant = () => {
    const newId = Math.max(...participants.map(p => p.id)) + 1;
    setParticipants(prev => [
      ...prev,
      { id: newId, email: '', role: 'participant', name: '' }
    ]);
  };

  const removeParticipant = (id) => {
    if (participants.length > 1) {
      setParticipants(prev => prev.filter(p => p.id !== id));
    }
  };

  const updateParticipant = (id, field, value) => {
    setParticipants(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.caseDescription.trim()) {
      newErrors.caseDescription = 'Case description is required';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }

    if (!formData.coordinatorId) {
      newErrors.coordinatorId = 'Coordinator assignment is required';
    }

    // Validate participants
    const participantErrors = [];
    participants.forEach((participant, index) => {
      const participantError = {};
      
      if (!participant.email.trim()) {
        participantError.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(participant.email)) {
        participantError.email = 'Invalid email format';
      }

      if (!participant.name.trim()) {
        participantError.name = 'Name is required';
      }

      if (Object.keys(participantError).length > 0) {
        participantErrors[index] = participantError;
      }
    });

    if (participantErrors.length > 0) {
      newErrors.participants = participantErrors;
    }

    // Check for duplicate emails
    const emails = participants.map(p => p.email.toLowerCase().trim()).filter(email => email);
    const duplicateEmails = emails.filter((email, index) => emails.indexOf(email) !== index);
    if (duplicateEmails.length > 0) {
      newErrors.duplicateEmails = 'Duplicate email addresses are not allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateCaseId = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CASE-${year}${month}${day}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Convert template to case using the service
      const newCase = convertTemplateToCase(selectedTemplate, formData, participants);
      
      // Generate participant links
      const participantLinks = generateParticipantLinks(newCase.id, newCase.participants);
      
      // Send invitations
      const emailResults = await sendInvitationEmails(participantLinks, newCase);
      
      // Generate summary
      const invitationSummary = generateCaseInvitationSummary(newCase, emailResults);
      
      // Store case in localStorage (in real app, this would be a backend call)
      const existingCases = JSON.parse(localStorage.getItem('vouchline_cases') || '[]');
      existingCases.push(newCase);
      localStorage.setItem('vouchline_cases', JSON.stringify(existingCases));
      
      console.log('Case created successfully:', invitationSummary);
      
      // Navigate to Review Cockpit with success message
      navigate('/cases', { 
        state: { 
          message: `Case "${newCase.name}" created successfully! Invitations sent to ${participants.length} participant(s).`,
          newCaseId: newCase.id,
          invitationSummary,
          highlightCase: newCase.id
        }
      });
      
    } catch (error) {
      console.error('Error creating case:', error);
      setErrors({ submit: 'Failed to create case. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Step navigation
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      templateId: template?.id || ''
    }));
    nextStep(); // Move to case details step
  };

  const handleCustomWorkflow = () => {
    // Navigate to workflow builder for custom requirements
    navigate('/workflow-builder', {
      state: {
        returnTo: '/case-creation',
        context: 'case-creation'
      }
    });
  };

  const renderTemplateSelection = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Choose Your Workflow</h2>
        <p className="text-muted-foreground">
          Select from our pre-built templates or create a custom workflow for your case
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Template Selection Option */}
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 mx-auto">
            <Icon name="Layout" size={24} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-foreground text-center mb-2">
            Use Template
          </h3>
          <p className="text-muted-foreground text-center mb-4">
            Choose from pre-built workflows designed for common use cases
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/workflow-template-configuration', {
              state: { 
                mode: 'select',
                returnTo: '/case-creation'
              }
            })}
          >
            Browse Templates
          </Button>
        </div>

        {/* Custom Workflow Option */}
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 mx-auto">
            <Icon name="Plus" size={24} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-foreground text-center mb-2">
            Build Custom
          </h3>
          <p className="text-muted-foreground text-center mb-4">
            Create a custom workflow tailored to your specific requirements
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleCustomWorkflow}
          >
            Build Workflow
          </Button>
        </div>
      </div>

      {/* Quick Templates */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4">Quick Start Templates</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {getQuickTemplates().map((template) => (
            <div 
              key={template.id}
              className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900">{template.name}</h5>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {template.steps.length} steps
                </span>
              </div>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getQuickTemplates = () => [
    {
      id: 'kyc-basic',
      name: 'Basic KYC',
      description: 'Standard identity verification process',
      steps: [
        { id: '1', title: 'Identity Documents', type: 'upload' },
        { id: '2', title: 'Address Verification', type: 'upload' },
        { id: '3', title: 'Final Review', type: 'review' }
      ],
      estimatedDuration: '3-5 days'
    },
    {
      id: 'vendor-onboarding',
      name: 'Vendor Onboarding',
      description: 'Complete vendor setup and verification',
      steps: [
        { id: '1', title: 'Company Information', type: 'form' },
        { id: '2', title: 'Tax Documents', type: 'upload' },
        { id: '3', title: 'Insurance Proof', type: 'upload' },
        { id: '4', title: 'Banking Details', type: 'form' }
      ],
      estimatedDuration: '7-10 days'
    },
    {
      id: 'compliance-check',
      name: 'Compliance Review',
      description: 'Regulatory compliance verification',
      steps: [
        { id: '1', title: 'Regulatory Forms', type: 'form' },
        { id: '2', title: 'Compliance Documents', type: 'upload' },
        { id: '3', title: 'Legal Review', type: 'review' }
      ],
      estimatedDuration: '5-7 days'
    }
  ];

  return (
    <AppLayout>
      {currentStep === 0 && renderTemplateSelection()}
      {currentStep === 1 && (
        <main>
          {/* Header */}
          <div className="bg-card border-b border-border">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    type="button"
                    onClick={prevStep}
                    className="flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="ArrowLeft" size={20} className="mr-2" />
                    Back
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Case Details</h1>
                    <p className="mt-1 text-muted-foreground">
                      Configure your case settings and add participants
                    </p>
                  </div>
                </div>
                {selectedTemplate && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Using Template:</p>
                    <p className="font-medium text-foreground">{selectedTemplate.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Case Details */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="FileText" size={20} className="mr-2" />
                  Case Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input
                      label="Client Name"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="Enter client or company name"
                      error={errors.clientName}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Input
                      label="Case Name"
                      value={formData.caseName}
                      onChange={(e) => handleInputChange('caseName', e.target.value)}
                      placeholder="Auto-generated or enter custom name"
                      error={errors.caseName}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Case Description
                    </label>
                    <textarea
                      value={formData.caseDescription}
                      onChange={(e) => handleInputChange('caseDescription', e.target.value)}
                      placeholder="Describe the purpose and scope of this case"
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm text-foreground bg-background ${
                        errors.caseDescription 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    />
                    {errors.caseDescription && (
                      <p className="mt-1 text-sm text-red-600">{errors.caseDescription}</p>
                    )}
                  </div>
                  
                  <Select
                    label="Priority"
                    value={formData.priority}
                    onChange={(value) => handleInputChange('priority', value)}
                    options={priorityOptions}
                    error={errors.priority}
                  />
                  
                  <Input
                    label="Deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    error={errors.deadline}
                    required
                  />
                  
                  <div className="md:col-span-2">
                    <Select
                      label="Assign Coordinator"
                      value={formData.coordinatorId}
                      onChange={(value) => handleInputChange('coordinatorId', value)}
                      options={coordinators}
                      placeholder="Select a coordinator"
                      error={errors.coordinatorId}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Participant Management */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center">
                    <Icon name="Users" size={20} className="mr-2" />
                    Participants
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    iconName="Plus"
                    onClick={addParticipant}
                  >
                    Add Participant
                  </Button>
                </div>
                
                {errors.duplicateEmails && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errors.duplicateEmails}</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  {participants.map((participant, index) => (
                    <div key={participant.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Participant {index + 1}
                        </h4>
                        {participants.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            iconName="X"
                            onClick={() => removeParticipant(participant.id)}
                            className="text-red-600 hover:text-red-700"
                          />
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Full Name"
                          value={participant.name}
                          onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                          placeholder="Enter participant name"
                          error={errors.participants?.[index]?.name}
                        />
                        
                        <Input
                          label="Email Address"
                          type="email"
                          value={participant.email}
                          onChange={(e) => updateParticipant(participant.id, 'email', e.target.value)}
                          placeholder="participant@company.com"
                          error={errors.participants?.[index]?.email}
                        />
                        
                        <Select
                          label="Role"
                          value={participant.role}
                          onChange={(value) => updateParticipant(participant.id, 'role', value)}
                          options={roleOptions}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                >
                  Back to Templates
                </Button>
                <div className="space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.clientName || !formData.deadline}
                  >
                    Continue to Review
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </main>
      )}
      
      {currentStep === 2 && (
        <main>
          {/* Header */}
          <div className="bg-card border-b border-border">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    type="button"
                    onClick={prevStep}
                    className="flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="ArrowLeft" size={20} className="mr-2" />
                    Back
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Review & Launch</h1>
                    <p className="mt-1 text-muted-foreground">
                      Review your case details and launch
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Step 3 of 3
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              {/* Case Summary */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Case Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Case Name:</span> {formData.caseName}</div>
                  <div><span className="font-medium">Client:</span> {formData.clientName}</div>
                  <div><span className="font-medium">Priority:</span> {formData.priority}</div>
                  <div><span className="font-medium">Deadline:</span> {formData.deadline}</div>
                  <div><span className="font-medium">Template:</span> {selectedTemplate?.name || 'Custom'}</div>
                  <div><span className="font-medium">Participants:</span> {participants.length}</div>
                </div>
              </div>

              {/* Template Preview */}
              {selectedTemplate && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Icon name="Layout" size={20} className="mr-2" />
                    Workflow Preview
                  </h2>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-blue-900">{selectedTemplate.name}</h3>
                        <p className="text-sm text-blue-700">{selectedTemplate.description}</p>
                      </div>
                      <div className="text-right text-sm text-blue-700">
                        <p>{selectedTemplate.steps.length} steps</p>
                        <p>{selectedTemplate.estimatedDuration}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedTemplate.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                        <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-700">{step.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Participants List */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Participants</h3>
                <div className="space-y-3">
                  {participants.map((participant, index) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{participant.name}</div>
                        <div className="text-sm text-muted-foreground">{participant.email}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{participant.role}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Errors */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <Icon name="AlertCircle" size={20} className="text-red-600 mr-2" />
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                >
                  Back to Details
                </Button>
                <div className="space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    iconName="Send"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Case...' : 'Create Case & Send Invitations'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </AppLayout>
  );
};

export default CaseCreation;
