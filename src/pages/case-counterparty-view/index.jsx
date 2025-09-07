import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import HeaderBar from '../tokenized-onboarding-step/components/HeaderBar';
import RequestSummary from '../tokenized-onboarding-step/components/RequestSummary';
import ProvideAccordion from '../tokenized-onboarding-step/components/ProvideAccordion';
import MessagesPanel from '../tokenized-onboarding-step/components/MessagesPanel';
import { getAllCases } from '../../services/caseConverter';

const CaseCounterpartyView = () => {
  const { caseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedRequirements, setExpandedRequirements] = useState(new Set());
  const [expandAll, setExpandAll] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load case data
  useEffect(() => {
    const loadCaseData = async () => {
      try {
        // Get cases from localStorage and add mock cases for demonstration (same logic as cockpit)
        const storedCases = await getAllCases();
        const mockCases = generateMockCases();
        const allCases = [...storedCases, ...mockCases];
        
        const currentCase = allCases.find(c => c.id === caseId);
        if (currentCase) {
          setCaseData(currentCase);
        } else {
          // If case not found, redirect back to cockpit
          navigate('/cases-cockpit');
          return;
        }
      } catch (error) {
        console.error('Error loading case data:', error);
        navigate('/cases-cockpit');
        return;
      }
      setLoading(false);
    };

    loadCaseData();
  }, [caseId, navigate]);

  // Generate same mock cases as cockpit
  const generateMockCases = () => {
    return [
      {
        id: 'CASE-2024-101',
        name: 'Acme Corp KYC Review',
        clientName: 'Acme Corporation',
        status: 'pending-review',
        priority: 'high',
        deadline: '2024-08-25T17:00:00Z',
        coordinatorId: 'coord-1',
        templateName: 'Standard Fintech KYB',
        createdAt: '2024-08-20T09:00:00Z',
        updatedAt: '2024-08-22T14:30:00Z',
        metrics: { totalSteps: 8, completedSteps: 6, progress: 75 }
      },
      {
        id: 'CASE-2024-102',
        name: 'TechFlow Vendor Onboarding',
        clientName: 'TechFlow Solutions',
        status: 'in-progress',
        priority: 'medium',
        deadline: '2024-08-28T17:00:00Z',
        coordinatorId: 'coord-2',
        templateName: 'Vendor Onboarding',
        createdAt: '2024-08-21T10:00:00Z',
        metrics: { totalSteps: 6, completedSteps: 3, progress: 50 }
      },
      {
        id: 'CASE-2024-103',
        name: 'GlobalTech Partnership Setup',
        clientName: 'GlobalTech Industries',
        status: 'not-started',
        priority: 'low',
        deadline: '2024-09-05T17:00:00Z',
        coordinatorId: 'coord-3',
        templateName: 'Partnership Agreement',
        createdAt: '2024-08-22T11:00:00Z',
        metrics: { totalSteps: 5, completedSteps: 0, progress: 0 }
      },
      {
        id: 'CASE-2024-104',
        name: 'FinanceFlow Integration',
        clientName: 'FinanceFlow Ltd',
        status: 'completed',
        priority: 'urgent',
        deadline: '2024-08-20T17:00:00Z',
        coordinatorId: 'coord-1',
        templateName: 'API Integration',
        createdAt: '2024-08-18T08:00:00Z',
        metrics: { totalSteps: 4, completedSteps: 4, progress: 100 }
      }
    ];
  };

  if (loading || !caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading case data...</p>
        </div>
      </div>
    );
  }

  // Generate dynamic requirements based on case data and template
  const generateRequirements = (templateName, progress, completedSteps, totalSteps) => {
    const baseRequirements = [
      {
        id: 'req_identity',
        title: 'Government-Issued Photo ID',
        instructions: 'Please upload a clear photo of your government-issued ID (passport, driver\'s license, or national ID card). Ensure all text is readable and the photo is clear.',
        category: 'Identity Verification'
      },
      {
        id: 'req_address',
        title: 'Proof of Address',
        instructions: 'Upload a recent utility bill, bank statement, or official correspondence showing your current address. Document must be dated within the last 3 months.',
        category: 'Address Verification'
      },
      {
        id: 'req_financial',
        title: 'Financial Documentation',
        instructions: 'Provide bank statements for the last 3 months or other financial documents as requested by your case coordinator.',
        category: 'Financial Verification'
      },
      {
        id: 'req_employment',
        title: 'Employment Verification',
        instructions: 'Upload an official employment letter from your current employer or other proof of income source.',
        category: 'Employment Verification'
      },
      {
        id: 'req_business',
        title: 'Business Registration',
        instructions: 'If applicable, provide business registration documents, tax certificates, or other corporate documentation.',
        category: 'Business Verification'
      }
    ];

    // Determine how many requirements based on template and generate realistic statuses
    const numRequirements = Math.min(totalSteps || 4, baseRequirements.length);
    const requirements = baseRequirements.slice(0, numRequirements);
    
    const completedCount = completedSteps || Math.floor(progress / 100 * numRequirements);
    const progressCount = Math.min(1, numRequirements - completedCount); // At most 1 in progress
    
    return requirements.map((req, index) => {
      let status, uploadedFiles, uploads;
      
      if (index < completedCount) {
        status = index < completedCount - 1 ? 'approved' : 'completed';
        uploadedFiles = 1;
        uploads = [{
          id: `file_${index + 1}`,
          name: `document_${index + 1}.pdf`,
          size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
          type: 'PDF',
          status: status,
          uploadedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          messages: Math.floor(Math.random() * 2)
        }];
      } else if (index === completedCount && progressCount > 0) {
        status = 'in_progress';
        uploadedFiles = Math.random() > 0.5 ? 1 : 0;
        uploads = uploadedFiles > 0 ? [{
          id: `file_${index + 1}`,
          name: `document_${index + 1}.pdf`,
          size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
          type: 'PDF',
          status: 'uploaded',
          uploadedAt: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
          messages: Math.floor(Math.random() * 3)
        }] : [];
      } else {
        status = 'requested';
        uploadedFiles = 0;
        uploads = [];
      }

      return {
        ...req,
        status,
        uploadedFiles,
        totalFiles: 1,
        messages: uploads.length > 0 ? uploads[0].messages : Math.floor(Math.random() * 3),
        uploads
      };
    });
  };

  // Create request data based on actual case
  const requestData = {
    id: caseData.id,
    title: caseData.templateName || caseData.name || 'Onboarding Request',
    status: caseData.status === 'completed' ? 'Completed' : 'In Progress',
    company: {
      name: caseData.clientName,
      subsidiary: caseData.subsidiary || ''
    },
    requestSent: new Date(caseData.createdAt || Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    requestDueDate: new Date(caseData.deadline).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    hardCopiesAfterApproval: 'Not required',
    completionDate: caseData.status === 'completed' ? new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : null,
    requirements: generateRequirements(
      caseData.templateName || caseData.name,
      caseData.progress || caseData.metrics?.progress || 0,
      caseData.completedSteps || caseData.metrics?.completedSteps || 0,
      caseData.totalSteps || caseData.metrics?.totalSteps || 4
    )
  };

  const handleRequirementClick = (reqId) => {
    setExpandedRequirements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reqId)) {
        newSet.delete(reqId);
      } else {
        newSet.add(reqId);
      }
      return newSet;
    });
  };

  const handleToggleAll = () => {
    if (expandAll) {
      setExpandedRequirements(new Set());
    } else {
      setExpandedRequirements(new Set(requestData.requirements.map(req => req.id)));
    }
    setExpandAll(!expandAll);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <HeaderBar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Request Summary */}
          <RequestSummary 
            request={requestData}
            showInstructions={showInstructions}
            onToggleInstructions={() => setShowInstructions(!showInstructions)}
          />

          {/* Requirements Section */}
          <div className="p-6 border-t border-gray-200">
            <ProvideAccordion
              requirements={requestData.requirements}
              expandedRequirements={expandedRequirements}
              expandAll={expandAll}
              selectedRequirement={selectedRequirement}
              onRequirementClick={handleRequirementClick}
              onToggleAll={handleToggleAll}
              onRequirementSelect={setSelectedRequirement}
            />
          </div>

          {/* Messages Panel */}
          {selectedRequirement && (
            <div className="border-t border-gray-200">
              <MessagesPanel
                requirement={requestData.requirements.find(req => req.id === selectedRequirement)}
                onClose={() => setSelectedRequirement(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Coordinator Notice */}
      <div className="fixed bottom-4 right-4 bg-purple-100 border border-purple-300 rounded-lg p-3 shadow-lg max-w-sm">
        <div className="flex items-start space-x-2">
          <div className="w-5 h-5 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center">
            <span className="text-white text-xs font-bold">👁</span>
          </div>
          <div>
            <p className="text-sm font-medium text-purple-900">Coordinator Preview</p>
            <p className="text-xs text-purple-700 mt-1">
              This is how {caseData.clientName} sees their onboarding progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseCounterpartyView;
