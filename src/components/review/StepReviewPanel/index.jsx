import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateReview } from '../../../store/slices/reviewSlice';
import { useTelemetry } from '../../../hooks/useTelemetrySimple';
import LoadingState from '../../ui/LoadingState';
import FilePreview from './FilePreview';
import AcceptanceCriteriaChecklist from './AcceptanceCriteriaChecklist';
import ReviewDecisionModal from './ReviewDecisionModal';
import TimelineTab from '../TimelineTab';
import CommentsTab from '../CommentsTab';

const StepReviewPanel = ({ step, onDecision }) => {
  const dispatch = useDispatch();
  const { trackCustomEvent } = useTelemetry();
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionType, setDecisionType] = useState(null);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('files');

  useEffect(() => {
    if (step) {
      // Initialize acceptance criteria from step configuration
      setAcceptanceCriteria(step.acceptanceCriteria || []);
      setSelectedFiles(step.files || []);
      
      // Track step review start
      trackCustomEvent('step_review_started', {
        step_id: step.id,
        step_type: step.type,
        case_id: step.caseId,
      });
    }
  }, [step, trackCustomEvent]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    trackCustomEvent('review_tab_changed', {
      step_id: step.id,
      case_id: step.caseId,
      tab,
    });
  };

  const handleApprove = () => {
    setDecisionType('approve');
    setShowDecisionModal(true);
    trackCustomEvent('review_approve_initiated', {
      step_id: step.id,
      case_id: step.caseId,
    });
  };

  const handleRequestChanges = () => {
    setDecisionType('request_changes');
    setShowDecisionModal(true);
    trackCustomEvent('review_request_changes_initiated', {
      step_id: step.id,
      case_id: step.caseId,
    });
  };

  const handleDecisionSubmit = async (decisionData) => {
    setLoading(true);
    try {
      const reviewData = {
        stepId: step.id,
        caseId: step.caseId,
        decision: decisionType,
        ...decisionData,
        timestamp: new Date().toISOString(),
        reviewerId: 'current-user-id', // Would come from auth context
      };

      await dispatch(updateReview({ reviewId: step.reviewId, updates: reviewData }));
      
      trackCustomEvent('step_review_completed', {
        step_id: step.id,
        case_id: step.caseId,
        decision: decisionType,
        has_comments: !!decisionData.comments,
        has_examples: !!decisionData.examples?.length,
      });

      if (onDecision) {
        onDecision(reviewData);
      }

      setShowDecisionModal(false);
    } catch (error) {
      console.error('Failed to submit review decision:', error);
      trackCustomEvent('step_review_error', {
        step_id: step.id,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCriteriaChange = (criteriaId, checked, notes) => {
    setAcceptanceCriteria(prev => 
      prev.map(criteria => 
        criteria.id === criteriaId 
          ? { ...criteria, checked, notes, checkedAt: checked ? new Date().toISOString() : null }
          : criteria
      )
    );

    trackCustomEvent('acceptance_criteria_checked', {
      step_id: step.id,
      criteria_id: criteriaId,
      checked,
    });
  };

  const allCriteriaMet = acceptanceCriteria.every(criteria => criteria.checked);
  const currentFile = selectedFiles[currentFileIndex];

  if (!step) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">Select a step to begin review</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingState message="Processing review decision..." />;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {step.title || `Step ${step.stepNumber}`}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {step.type} • Case #{step.caseId} • Due {new Date(step.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              step.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
              step.status === 'approved' ? 'bg-green-100 text-green-800' :
              step.status === 'needs_changes' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {step.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="mt-4">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => handleTabChange('files')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'files'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Files & Review
            </button>
            <button
              onClick={() => handleTabChange('timeline')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'timeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => handleTabChange('comments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'comments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Comments
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'files' && (
        <div className="flex h-[calc(100vh-250px)]">
          {/* File Preview Section */}
          <div className="flex-1 p-6 border-r border-gray-200">
            {selectedFiles.length > 0 ? (
              <div className="h-full flex flex-col">
                {/* File Navigation */}
                {selectedFiles.length > 1 && (
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentFileIndex(Math.max(0, currentFileIndex - 1))}
                        disabled={currentFileIndex === 0}
                        className="p-2 rounded-lg border disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="text-sm text-gray-600">
                        {currentFileIndex + 1} of {selectedFiles.length}
                      </span>
                      <button
                        onClick={() => setCurrentFileIndex(Math.min(selectedFiles.length - 1, currentFileIndex + 1))}
                        disabled={currentFileIndex === selectedFiles.length - 1}
                        className="p-2 rounded-lg border disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{currentFile?.name}</p>
                  </div>
                )}
                
                {/* File Preview */}
                <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
                  <FilePreview file={currentFile} />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No files uploaded for this step</p>
                </div>
              </div>
            )}
          </div>

          {/* Review Panel Section */}
          <div className="w-96 flex flex-col">
            {/* Acceptance Criteria */}
            <div className="flex-1 p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Acceptance Criteria</h3>
              <AcceptanceCriteriaChecklist
                criteria={acceptanceCriteria}
                onChange={handleCriteriaChange}
              />
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-gray-50">
              <div className="space-y-3">
                <button
                  onClick={handleApprove}
                  disabled={!allCriteriaMet}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    allCriteriaMet 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Approve</span>
                  </div>
                </button>
                
                <button
                  onClick={handleRequestChanges}
                  className="w-full py-3 px-4 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Request Changes</span>
                  </div>
                </button>
              </div>

              <p className="text-xs text-gray-600 mt-3 text-center">
                {allCriteriaMet 
                  ? 'All criteria met - ready to approve' 
                  : `${acceptanceCriteria.filter(c => c.checked).length} of ${acceptanceCriteria.length} criteria met`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="p-6">
          <TimelineTab caseId={step.caseId} />
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="p-6">
          <CommentsTab caseId={step.caseId} stepId={step.id} />
        </div>
      )}

      {/* Review Decision Modal */}
      {showDecisionModal && (
        <ReviewDecisionModal
          isOpen={showDecisionModal}
          onClose={() => setShowDecisionModal(false)}
          onSubmit={handleDecisionSubmit}
          decisionType={decisionType}
          step={step}
        />
      )}
    </div>
  );
};

export default StepReviewPanel;
