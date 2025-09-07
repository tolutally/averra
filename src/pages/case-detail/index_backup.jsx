import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AppLayout from '../../components/layout/AppLayout';
import StepReviewPanel from './components/StepReviewPanel';
import TimelineTab from './components/TimelineTab';
import CommentsTab from './components/CommentsTab';
import { getCaseById } from '../../services/caseConverter';

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('review');
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);

  useEffect(() => {
    loadCaseData();
  }, [id]);

  const loadCaseData = () => {
    // Get case ID from URL params
    const caseId = id;
    console.log('Loading case with ID:', caseId);
    
    // In a real app, this would fetch from backend
    // For now, we'll load from localStorage or use mock data
    const existingCases = JSON.parse(localStorage.getItem('vouchline_cases') || '[]');
    const foundCase = existingCases.find(case_ => case_.id === caseId);
    
    console.log('Found case in localStorage:', foundCase);
    console.log('All cases in localStorage:', existingCases);
    
    if (foundCase) {
      setCaseData(foundCase);
      
      // Set the first pending review step as selected
      const pendingStep = foundCase.steps?.find(step => step.status === 'pending-review');
      console.log('Found pending step:', pendingStep);
      
      if (pendingStep) {
        setSelectedStep(pendingStep);
      } else if (foundCase.steps?.length > 0) {
        setSelectedStep(foundCase.steps[0]);
        console.log('No pending step, selected first step:', foundCase.steps[0]);
      }
      return;
    }

  const generateMockCaseData = (caseId) => {
    return {
      id: caseId,
      name: 'Acme Corp KYC Review',
      clientName: 'Acme Corporation',
      description: 'Complete KYC verification for fintech compliance',
      status: 'pending-review',
      priority: 'high',
      deadline: '2024-08-25T17:00:00Z',
      createdAt: '2024-08-20T09:00:00Z',
      updatedAt: '2024-08-22T14:30:00Z',
      coordinatorId: 'coord-1',
      templateName: 'Standard Fintech KYB',
      participants: [
        {
          id: 1,
          name: 'John Smith',
          email: 'john@acme.com',
          role: 'participant',
          status: 'completed',
          tokenId: 'token123'
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'jane@acme.com',
          role: 'participant',
          status: 'pending',
          tokenId: 'token456'
        }
      ],
      steps: [
        {
          id: 'req-1',
          stepId: 'step-1',
          title: 'Company Registration Certificate',
          description: 'Upload official company registration documents',
          status: 'pending-review',
          uploads: [
            {
              id: 'upload-1',
              name: 'acme-registration.pdf',
              type: 'PDF',
              size: '2.4 MB',
              uploadedAt: '2024-08-22T10:00:00Z',
              url: '/api/files/acme-registration.pdf'
            }
          ],
          acceptanceCriteria: [
            'Document must be officially signed and stamped',
            'Registration must be current (within last 6 months)',
            'Company name must match application'
          ],
          comments: [],
          reviewNotes: ''
        },
        {
          id: 'req-2',
          stepId: 'step-2',
          title: 'Bank Statements',
          description: 'Provide last 3 months of bank statements',
          status: 'approved',
          uploads: [
            {
              id: 'upload-2',
              name: 'bank-statements-q2.pdf',
              type: 'PDF',
              size: '1.8 MB',
              uploadedAt: '2024-08-21T15:30:00Z',
              url: '/api/files/bank-statements-q2.pdf'
            }
          ],
          acceptanceCriteria: [
            'Statements must cover last 3 complete months',
            'All pages must be included',
            'Bank letterhead must be visible'
          ],
          approvedAt: '2024-08-22T09:15:00Z',
          approvedBy: 'Sarah Johnson'
        }
      ],
      auditTrail: [
        {
          id: 'audit-1',
          action: 'Case Created',
          description: 'Case created from Standard Fintech KYB template',
          user: 'System',
          timestamp: '2024-08-20T09:00:00Z',
          type: 'creation',
          ipAddress: '192.168.1.100'
        },
        {
          id: 'audit-2',
          action: 'Document Uploaded',
          description: 'John Smith uploaded company registration certificate',
          user: 'John Smith',
          timestamp: '2024-08-22T10:00:00Z',
          type: 'document',
          ipAddress: '203.0.113.45'
        },
        {
          id: 'audit-3',
          action: 'Step Approved',
          description: 'Bank statements approved by Sarah Johnson',
          user: 'Sarah Johnson',
          timestamp: '2024-08-22T09:15:00Z',
          type: 'review',
          ipAddress: '198.51.100.23'
        }
      ],
      comments: [
        {
          id: 'comment-1',
          text: 'Please expedite review for this high-priority client',
          author: 'Mike Chen',
          authorId: 'coord-2',
          timestamp: '2024-08-22T11:00:00Z',
          mentions: ['@sarah'],
          type: 'internal'
        }
      ],
      metrics: {
        totalSteps: 8,
        completedSteps: 6,
        progress: 75
      }
    };
    
    setCaseData(mockCase);
    
    // Set the first pending review step as selected
    const pendingStep = mockCase.steps?.find(step => step.status === 'pending-review');
    console.log('Found pending step:', pendingStep);
    
    if (pendingStep) {
      setSelectedStep(pendingStep);
    } else if (mockCase.steps?.length > 0) {
      setSelectedStep(mockCase.steps[0]);
      console.log('No pending step, selected first step:', mockCase.steps[0]);
    }
    
    setIsLoading(false);
  };

  const handleStepAction = async (stepId, action, data = {}) => {
    try {
      console.log(`Step ${action} for ${stepId}:`, data);
      
      // Update the case data
      setCaseData(prev => ({
        ...prev,
        steps: prev.steps.map(req => {
          if (req.id === stepId) {
            const updates = {
              ...req,
              status: action === 'approve' ? 'approved' : 'requires-changes',
              reviewNotes: data.notes || '',
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'Current Reviewer'
            };
            
            if (action === 'approve') {
              updates.approvedAt = new Date().toISOString();
              updates.approvedBy = 'Current Reviewer';
            }
            
            return updates;
          }
          return req;
        }),
        auditTrail: [
          ...prev.auditTrail,
          {
            id: `audit-${Date.now()}`,
            action: action === 'approve' ? 'Step Approved' : 'Changes Requested',
            description: `${req.title} ${action === 'approve' ? 'approved' : 'requires changes'}: ${data.notes || 'No notes provided'}`,
            user: 'Current Reviewer',
            timestamp: new Date().toISOString(),
            type: 'review',
            ipAddress: '192.168.1.50'
          }
        ]
      }));
      
      // Move to next pending step
      const currentIndex = caseData.steps.findIndex(req => req.id === stepId);
      const nextPendingStep = caseData.steps
        .slice(currentIndex + 1)
        .find(req => req.status === 'pending-review');
      
      if (nextPendingStep) {
        setSelectedStep(nextPendingStep);
      }
      
    } catch (error) {
      console.error('Error handling step action:', error);
    }
  };

  const handleGenerateAuditPDF = async () => {
    setIsGeneratingAudit(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In real app, this would call the compile endpoint
      const auditData = {
        caseId: caseData.id,
        caseName: caseData.name,
        clientName: caseData.clientName,
        generatedAt: new Date().toISOString(),
        timeline: caseData.auditTrail,
        requirements: caseData.steps,
        comments: caseData.comments
      };
      
      console.log('Generating audit PDF:', auditData);
      
      // Simulate file download
      const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-${caseData.id}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating audit PDF:', error);
    } finally {
      setIsGeneratingAudit(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  if (!caseData) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <Icon name="FileX" size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Case not found</h2>
          <p className="text-gray-500 mb-4">The case you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/cases')}>
            Back to Cases
          </Button>
        </div>
      </AppLayout>
    );
  }

  const tabs = [
    { id: 'review', label: 'Step Review', icon: 'CheckSquare' },
    { id: 'timeline', label: 'Timeline', icon: 'Clock' },
    { id: 'comments', label: 'Comments', icon: 'MessageSquare', badge: caseData.comments?.length }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      'not-started': { color: 'bg-gray-100 text-gray-800', text: 'Not Started' },
      'in-progress': { color: 'bg-blue-100 text-blue-800', text: 'In Progress' },
      'pending-review': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Review' },
      'completed': { color: 'bg-green-100 text-green-800', text: 'Completed' },
      'on-hold': { color: 'bg-red-100 text-red-800', text: 'On Hold' }
    };
    
    const badge = badges[status] || badges['not-started'];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                iconName="ArrowLeft"
                onClick={() => navigate('/cases')}
              >
                Back to Cases
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">{caseData.id}</h1>
                  {getStatusBadge(caseData.status)}
                </div>
                <p className="text-gray-600">{caseData.clientName} • {caseData.templateName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Download"
                onClick={handleGenerateAuditPDF}
                disabled={isGeneratingAudit}
              >
                {isGeneratingAudit ? 'Generating...' : 'Audit PDF'}
              </Button>
              <Button
                variant="outline"
                iconName="ExternalLink"
                onClick={() => window.open(`/steps/${caseData.participants[0]?.tokenId}`, '_blank')}
              >
                Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon name={tab.icon} size={16} className="mr-2" />
                {tab.label}
                {tab.badge && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'review' && (
            <StepReviewPanel
              caseData={caseData}
              selectedStep={selectedStep}
              onStepSelect={setSelectedStep}
              onStepAction={handleStepAction}
            />
          )}
          {activeTab === 'timeline' && (
            <TimelineTab
              caseData={caseData}
            />
          )}
          {activeTab === 'comments' && (
            <CommentsTab
              caseData={caseData}
              onAddComment={(comment) => {
                setCaseData(prev => ({
                  ...prev,
                  comments: [...(prev.comments || []), comment]
                }));
              }}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CaseDetail;
