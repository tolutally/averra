import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import StepReviewPanel from './StepReviewPanel';
import TimelineTab from './TimelineTab';
import CommentsTab from './CommentsTab';

const CaseReviewPane = ({ case_, onClose, onCaseUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStep, setSelectedStep] = useState(null);
  const [caseData, setCaseData] = useState(case_);

  useEffect(() => {
    setCaseData(case_);
  }, [case_]);

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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      'low': { color: 'bg-gray-100 text-gray-600', icon: 'ArrowDown' },
      'medium': { color: 'bg-blue-100 text-blue-600', icon: 'Minus' },
      'high': { color: 'bg-orange-100 text-orange-600', icon: 'ArrowUp' },
      'urgent': { color: 'bg-red-100 text-red-600', icon: 'AlertTriangle' }
    };
    
    const badge = badges[priority] || badges['medium'];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${badge.color}`}>
        <Icon name={badge.icon} size={12} className="mr-1" />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getCoordinatorName = (coordinatorId) => {
    const coordinators = {
      'coord-1': 'Sarah Johnson',
      'coord-2': 'Mike Chen',
      'coord-3': 'Lisa Wang',
      'coord-4': 'John Davis'
    };
    return coordinators[coordinatorId] || 'Unknown';
  };

  const handleStepReview = (step) => {
    setSelectedStep(step);
    setActiveTab('step-review');
  };

  const handleStepDecision = (reviewData) => {
    // Update the step in the case data
    const updatedSteps = caseData.steps?.map(step => 
      step.id === reviewData.stepId 
        ? { 
            ...step, 
            status: reviewData.decision === 'approve' ? 'approved' : 'needs-changes',
            lastReviewedAt: reviewData.timestamp,
            reviewComments: reviewData.comments
          }
        : step
    ) || [];

    const updatedCase = {
      ...caseData,
      steps: updatedSteps,
      lastActivity: new Date().toISOString()
    };

    setCaseData(updatedCase);
    
    if (onCaseUpdate) {
      onCaseUpdate(updatedCase);
    }

    // Go back to overview after decision
    setActiveTab('overview');
    setSelectedStep(null);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Case Header */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{caseData.name}</h3>
            <p className="text-sm text-gray-600">{caseData.id}</p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(caseData.status)}
            {getPriorityBadge(caseData.priority)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Client:</span>
            <span className="ml-2 font-medium">{caseData.clientName}</span>
          </div>
          <div>
            <span className="text-gray-500">Coordinator:</span>
            <span className="ml-2 font-medium">{getCoordinatorName(caseData.coordinatorId)}</span>
          </div>
          <div>
            <span className="text-gray-500">Deadline:</span>
            <span className="ml-2 font-medium">{new Date(caseData.deadline).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-500">Progress:</span>
            <span className="ml-2 font-medium">{caseData.progress || 0}%</span>
          </div>
        </div>
      </div>

      {/* Steps Review */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
          <Icon name="CheckSquare" size={16} className="mr-2" />
          Workflow Steps
        </h4>
        
        {caseData.steps && caseData.steps.length > 0 ? (
          <div className="space-y-3">
            {caseData.steps.map((step, index) => (
              <div 
                key={step.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.status === 'approved' ? 'bg-green-100 text-green-800' :
                      step.status === 'needs-changes' ? 'bg-red-100 text-red-800' :
                      step.status === 'pending-review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{step.title}</h5>
                      <p className="text-xs text-gray-500">{step.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {step.status === 'pending-review' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStepReview(step)}
                      >
                        Review
                      </Button>
                    )}
                    
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      step.status === 'approved' ? 'bg-green-100 text-green-800' :
                      step.status === 'needs-changes' ? 'bg-red-100 text-red-800' :
                      step.status === 'pending-review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {step.status || 'Not Started'}
                    </div>
                  </div>
                </div>
                
                {step.reviewComments && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <p className="text-xs text-blue-800">
                      <strong>Review Notes:</strong> {step.reviewComments}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Icon name="FileText" size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No workflow steps found for this case</p>
          </div>
        )}
      </div>

      {/* Participants */}
      {caseData.participants && caseData.participants.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
            <Icon name="Users" size={16} className="mr-2" />
            Participants ({caseData.participants.length})
          </h4>
          <div className="space-y-2">
            {caseData.participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                  <p className="text-xs text-gray-500">{participant.email}</p>
                </div>
                <div className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">
                  {participant.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStepReview = () => {
    if (!selectedStep) return null;
    
    return (
      <div>
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            iconName="ArrowLeft"
            onClick={() => {
              setActiveTab('overview');
              setSelectedStep(null);
            }}
          >
            Back to Overview
          </Button>
        </div>
        <StepReviewPanel 
          step={selectedStep} 
          onDecision={handleStepDecision}
        />
      </div>
    );
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Case Review</h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'timeline'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'comments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Comments
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'step-review' && renderStepReview()}
        {activeTab === 'timeline' && <TimelineTab caseId={caseData.id} />}
        {activeTab === 'comments' && <CommentsTab caseId={caseData.id} />}
      </div>
    </div>
  );
};

export default CaseReviewPane;
