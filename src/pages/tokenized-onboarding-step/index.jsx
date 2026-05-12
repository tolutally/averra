import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import HeaderBar from './components/HeaderBar';
import RequestSummary from './components/RequestSummary';
import ProvideAccordion from './components/ProvideAccordion';
import MessagesPanel from './components/MessagesPanel';

const TokenizedOnboardingStep = () => {
  const { slug, token } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [expandedRequirements, setExpandedRequirements] = useState(new Set());
  const [expandAll, setExpandAll] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState(new Set());
  const [notification, setNotification] = useState(null);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-expand requirement from URL param
  useEffect(() => {
    const reqId = searchParams.get('req');
    if (reqId) {
      setExpandedRequirements(prev => new Set([...prev, reqId]));
    }
  }, [searchParams]);

  // Mock request data based on token or case context from coordinator
  const caseContext = location.state;
  const requestData = {
    id: caseContext?.caseId || 'req_123',
    title: caseContext?.templateName || 'New Onboarding',
    status: 'In Progress',
    company: {
      name: 'Averra', // Company sending the request
      subsidiary: caseContext?.clientName || 'Clarivue' // Client/receiving company
    },
    requestSent: '19 Jun 2025 03:39 am',
    requestDueDate: '17 September 2025',
    hardCopiesAfterApproval: 'Not required',
    completionDate: null,
    requirements: [
      {
        id: 'req_1',
        title: 'Government-Issued Photo ID',
        status: 'requested',
        uploadedFiles: 0,
        totalFiles: 1,
        instructions: 'Please upload a clear photo of your government-issued ID...',
        messages: 2,
        uploads: []
      },
      {
        id: 'req_2', 
        title: 'Proof of Address',
        status: 'in_progress',
        uploadedFiles: 1,
        totalFiles: 1,
        instructions: 'Upload a recent utility bill or bank statement...',
        messages: 0,
        uploads: [
          {
            id: 'file_1',
            name: 'utility_bill.pdf',
            size: '2.4 MB',
            type: 'PDF',
            status: 'uploaded',
            uploadedAt: '2025-08-20T10:30:00Z',
            messages: 0
          }
        ]
      },
      {
        id: 'req_3',
        title: 'Bank Statement',
        status: 'approved',
        uploadedFiles: 1,
        totalFiles: 1,
        instructions: 'Upload your most recent bank statement (last 3 months)...',
        messages: 1,
        uploads: [
          {
            id: 'file_2',
            name: 'bank_statement_july.pdf',
            size: '1.8 MB',
            type: 'PDF',
            status: 'approved',
            uploadedAt: '2025-08-15T14:20:00Z',
            messages: 1
          }
        ]
      },
      {
        id: 'req_4',
        title: 'Employment Letter',
        status: 'completed',
        uploadedFiles: 1,
        totalFiles: 1,
        instructions: 'Upload an official employment letter from your current employer...',
        messages: 0,
        uploads: [
          {
            id: 'file_3',
            name: 'employment_letter.pdf',
            size: '850 KB',
            type: 'PDF',
            status: 'completed',
            uploadedAt: '2025-08-10T09:15:00Z',
            messages: 0
          }
        ]
      }
    ]
  };

  const providedCount = requestData.requirements.reduce((acc, req) => acc + req.uploadedFiles, 0);
  const completedCount = requestData.requirements.filter(req => req.status === 'approved').length;
  const totalRequirements = requestData.requirements.length;
  const progressPercentage = Math.round((completedCount / totalRequirements) * 100);

  // File upload handler
  const handleFileUpload = (requirementId, file) => {
    console.log('File uploaded for requirement:', requirementId, file);
    setNotification({
      type: 'success',
      message: `File "${file.name}" uploaded successfully!`
    });
    // Auto-hide notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderBar 
          title="Loading..."
          subtitle=""
          expandAll={false}
          onExpandAll={() => {}}
        />
        <div className="max-w-[1440px] mx-auto px-6 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar 
        title={requestData.company.name}
        subtitle={requestData.company.subsidiary}
        expandAll={expandAll}
        onExpandAll={() => setExpandAll(!expandAll)}
      />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Progress Indicator */}
        <div className="py-4 mb-2">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-semibold text-gray-900">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-purple-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between mt-2 text-xs text-gray-500 space-y-1 sm:space-y-0">
              <span>{completedCount} of {totalRequirements} requirements completed</span>
              <span>{providedCount} files uploaded</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
          {/* Main Content */}
          <div className="flex-1">
            <div className="py-6 space-y-6">
              <RequestSummary data={requestData} />
              
              <ProvideAccordion 
                requirements={requestData.requirements}
                count={providedCount}
                expandAll={expandAll}
                uploadingFiles={uploadingFiles}
                onFileUpload={handleFileUpload}
                onRequirementToggle={(reqId) => {
                  setExpandedRequirements(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(reqId)) {
                      newSet.delete(reqId);
                    } else {
                      newSet.add(reqId);
                    }
                    return newSet;
                  });
                }}
                onViewInstructions={(requirement) => {
                  setSelectedRequirement(requirement);
                  setShowInstructions(true);
                }}
              />
            </div>
          </div>
          
          {/* Messages Panel - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:w-80">
            <MessagesPanel 
              selectedRequirement={selectedRequirement}
              onSelectRequirement={setSelectedRequirement}
            />
          </div>
        </div>
      </div>
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`rounded-lg px-4 py-3 shadow-lg ${
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            'bg-purple-400 text-white'
          }`}>
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                {notification.type === 'success' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TokenizedOnboardingStep;