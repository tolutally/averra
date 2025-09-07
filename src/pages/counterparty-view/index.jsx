import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CounterpartyView = () => {
  const { caseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [expandedRequirements, setExpandedRequirements] = useState(new Set());

  // Get case context from navigation state or fetch by ID
  const passedCaseData = location.state?.caseData;

  useEffect(() => {
    if (passedCaseData) {
      // Transform the case data into the format expected by the counterparty view
      const transformedData = transformCaseToCounterpartyView(passedCaseData);
      setCaseData(transformedData);
      setIsLoading(false);
    } else {
      // Fetch case data by ID if not passed via state
      fetchCaseData(caseId);
    }
  }, [caseId, passedCaseData]);

  const transformCaseToCounterpartyView = (case_) => {
    // Generate dynamic requirements based on case progress and template
    const requirements = generateRequirements(case_);
    
    return {
      id: case_.id,
      title: `${case_.templateName} - ${case_.clientName}`,
      status: mapCaseStatusToCounterpartyStatus(case_.status),
      company: {
        name: case_.clientName,
        subsidiary: case_.subsidiaryName || 'Main Entity'
      },
      requestSent: case_.createdDate || '6 Sep 2025 09:00 am',
      requestDueDate: case_.deadline,
      hardCopiesAfterApproval: case_.hardCopiesRequired ? 'Required' : 'Not required',
      completionDate: case_.status === 'completed' ? case_.completedDate : null,
      progress: case_.progress || 0,
      coordinatorName: getCoordinatorName(case_.coordinatorId),
      requirements: requirements,
      templateType: case_.templateName,
      priority: case_.priority,
      blockerReason: case_.blockerReason
    };
  };

  const generateRequirements = (case_) => {
    const baseRequirements = [
      {
        id: 'req_id',
        title: 'Government-Issued Photo ID',
        status: case_.progress >= 20 ? 'completed' : case_.progress >= 10 ? 'in-progress' : 'requested',
        uploadedFiles: case_.progress >= 20 ? 1 : 0,
        totalFiles: 1,
        instructions: 'Please upload a clear photo of your government-issued ID (passport, driver\'s license, or national ID card).',
        messages: case_.progress >= 10 ? Math.floor(Math.random() * 3) + 1 : 0,
        uploads: case_.progress >= 20 ? ['id_document.jpg'] : []
      },
      {
        id: 'req_address',
        title: 'Proof of Address',
        status: case_.progress >= 40 ? 'completed' : case_.progress >= 30 ? 'in-progress' : 'requested',
        uploadedFiles: case_.progress >= 40 ? 1 : 0,
        totalFiles: 1,
        instructions: 'Upload a recent utility bill, bank statement, or official document showing your current address (not older than 3 months).',
        messages: case_.progress >= 30 ? Math.floor(Math.random() * 2) + 1 : 0,
        uploads: case_.progress >= 40 ? ['proof_of_address.pdf'] : []
      }
    ];

    // Add template-specific requirements
    if (case_.templateName?.toLowerCase().includes('financial')) {
      baseRequirements.push({
        id: 'req_financial',
        title: 'Financial Statements',
        status: case_.progress >= 70 ? 'completed' : case_.progress >= 60 ? 'in-progress' : 'requested',
        uploadedFiles: case_.progress >= 70 ? 2 : case_.progress >= 60 ? 1 : 0,
        totalFiles: 2,
        instructions: 'Upload your latest financial statements including balance sheet and income statement.',
        messages: case_.progress >= 60 ? Math.floor(Math.random() * 2) + 1 : 0,
        uploads: case_.progress >= 70 ? ['balance_sheet.pdf', 'income_statement.pdf'] : case_.progress >= 60 ? ['balance_sheet.pdf'] : []
      });
    }

    if (case_.templateName?.toLowerCase().includes('business')) {
      baseRequirements.push({
        id: 'req_business',
        title: 'Business Registration',
        status: case_.progress >= 60 ? 'completed' : case_.progress >= 50 ? 'in-progress' : 'requested',
        uploadedFiles: case_.progress >= 60 ? 1 : 0,
        totalFiles: 1,
        instructions: 'Upload your business registration certificate or incorporation documents.',
        messages: case_.progress >= 50 ? Math.floor(Math.random() * 2) + 1 : 0,
        uploads: case_.progress >= 60 ? ['business_registration.pdf'] : []
      });
    }

    return baseRequirements;
  };

  const mapCaseStatusToCounterpartyStatus = (status) => {
    const statusMap = {
      'not-started': 'Pending',
      'in-progress': 'In Progress',
      'pending-review': 'Under Review',
      'completed': 'Completed',
      'on-hold': 'On Hold'
    };
    return statusMap[status] || 'In Progress';
  };

  const getCoordinatorName = (coordinatorId) => {
    const coordinators = {
      'coord-1': 'Sarah Johnson',
      'coord-2': 'Mike Chen',
      'coord-3': 'Lisa Wang',
      'coord-4': 'John Davis'
    };
    return coordinators[coordinatorId] || 'Support Team';
  };

  const fetchCaseData = async (id) => {
    // In a real app, this would fetch from an API
    // For now, we'll show a placeholder
    setIsLoading(false);
    setCaseData({
      id: id,
      title: 'Case Details Not Available',
      status: 'Unknown',
      company: { name: 'Unknown Client', subsidiary: '' },
      requirements: []
    });
  };

  const handleToggleRequirement = (reqId) => {
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

  const getStatusColor = (status) => {
    const colors = {
      'requested': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'requested': 'Clock',
      'in-progress': 'Upload',
      'completed': 'CheckCircle',
      'rejected': 'XCircle'
    };
    return icons[status] || 'Clock';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading counterparty view...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertTriangle" size={48} className="text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Case Not Found</h2>
          <p className="text-gray-600 mb-4">The requested case could not be found.</p>
          <Button onClick={() => navigate('/cases-cockpit')}>
            Back to Cases
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/cases-cockpit')}
                className="text-gray-600 hover:text-gray-900"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Back to Cases
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Counterparty View</h1>
                <p className="text-sm text-gray-500">Viewing as external participant</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Coordinator: {caseData.coordinatorName}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Request Summary */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{caseData.title}</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseData.status.toLowerCase().replace(' ', '-'))}`}>
                {caseData.status}
              </span>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Company</label>
                    <p className="text-sm text-gray-900">{caseData.company.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Request Sent</label>
                    <p className="text-sm text-gray-900">{caseData.requestSent}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Due Date</label>
                    <p className="text-sm text-gray-900">{new Date(caseData.requestDueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Progress</label>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{caseData.progress}% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${caseData.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Hard Copies After Approval</label>
                    <p className="text-sm text-gray-900">{caseData.hardCopiesAfterApproval}</p>
                  </div>
                </div>
              </div>
            </div>

            {caseData.blockerReason && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <Icon name="AlertTriangle" size={20} className="text-red-500 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Case On Hold</h4>
                    <p className="text-sm text-red-700 mt-1">{caseData.blockerReason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete all requirements to proceed with your request
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {caseData.requirements.map((requirement) => (
              <div key={requirement.id} className="px-6 py-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => handleToggleRequirement(requirement.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={getStatusIcon(requirement.status)} 
                      size={20} 
                      className={
                        requirement.status === 'completed' ? 'text-green-500' :
                        requirement.status === 'in-progress' ? 'text-blue-500' :
                        'text-gray-400'
                      }
                    />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{requirement.title}</h4>
                      <p className="text-sm text-gray-600">
                        {requirement.uploadedFiles} of {requirement.totalFiles} files uploaded
                        {requirement.messages > 0 && ` • ${requirement.messages} message${requirement.messages !== 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                      {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1).replace('-', ' ')}
                    </span>
                    <Icon 
                      name={expandedRequirements.has(requirement.id) ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                      className="text-gray-400" 
                    />
                  </div>
                </div>

                {expandedRequirements.has(requirement.id) && (
                  <div className="mt-4 pl-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Instructions</h5>
                      <p className="text-sm text-gray-700 mb-4">{requirement.instructions}</p>
                      
                      {requirement.uploads.length > 0 && (
                        <div>
                          <h6 className="text-sm font-medium text-gray-900 mb-2">Uploaded Files</h6>
                          <div className="space-y-2">
                            {requirement.uploads.map((file, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                <Icon name="File" size={16} />
                                <span>{file}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {requirement.status !== 'completed' && (
                        <div className="mt-4">
                          <Button size="sm" variant="outline">
                            Upload Files
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterpartyView;
