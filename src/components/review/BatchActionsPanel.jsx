import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTelemetry } from '../../hooks/useTelemetry.jsx';

const BatchActionsPanel = ({ selectedSteps, onBatchComplete }) => {
  const dispatch = useDispatch();
  const { trackCustomEvent } = useTelemetry();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [batchAction, setBatchAction] = useState(null);
  const [batchComments, setBatchComments] = useState('');
  const [processing, setProcessing] = useState(false);
  const [identicalSteps, setIdenticalSteps] = useState([]);

  useEffect(() => {
    if (selectedSteps.length > 1) {
      findIdenticalSteps();
    }
  }, [selectedSteps]);

  const findIdenticalSteps = () => {
    // Group steps by similarity criteria
    const stepGroups = {};
    
    selectedSteps.forEach(step => {
      const key = `${step.type}_${step.templateId}_${JSON.stringify(step.acceptanceCriteria?.map(c => c.id).sort())}`;
      if (!stepGroups[key]) {
        stepGroups[key] = [];
      }
      stepGroups[key].push(step);
    });

    // Find groups with multiple steps (identical)
    const identical = Object.values(stepGroups)
      .filter(group => group.length > 1)
      .flat();

    setIdenticalSteps(identical);
  };

  const handleBatchAction = (action) => {
    setBatchAction(action);
    setShowConfirmModal(true);
    
    trackCustomEvent('batch_action_initiated', {
      action,
      step_count: selectedSteps.length,
      identical_count: identicalSteps.length,
    });
  };

  const executeBatchAction = async () => {
    setProcessing(true);
    try {
      const batchData = {
        action: batchAction,
        stepIds: selectedSteps.map(s => s.id),
        comments: batchComments,
        timestamp: new Date().toISOString(),
      };

      // Process each step
      const results = await Promise.allSettled(
        selectedSteps.map(async (step) => {
          // Mock batch processing - replace with actual API calls
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                stepId: step.id,
                success: true,
                action: batchAction,
              });
            }, 100);
          });
        })
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      trackCustomEvent('batch_action_completed', {
        action: batchAction,
        total_steps: selectedSteps.length,
        successful,
        failed,
      });

      if (onBatchComplete) {
        onBatchComplete({
          action: batchAction,
          successful,
          failed,
          results,
        });
      }

      setShowConfirmModal(false);
      setBatchComments('');
    } catch (error) {
      console.error('Batch action failed:', error);
      trackCustomEvent('batch_action_error', {
        action: batchAction,
        error: error.message,
      });
    } finally {
      setProcessing(false);
    }
  };

  if (selectedSteps.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Batch Actions</h3>
            <p className="text-sm text-gray-600">
              {selectedSteps.length} steps selected
              {identicalSteps.length > 0 && (
                <span className="ml-2 text-blue-600">
                  ({identicalSteps.length} identical)
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => onBatchComplete && onBatchComplete({ action: 'clear' })}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Identical Steps Highlight */}
        {identicalSteps.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-blue-800">
                {identicalSteps.length} identical steps detected
              </span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              These steps have the same type and acceptance criteria, making them ideal for batch processing.
            </p>
          </div>
        )}

        {/* Selected Steps Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Steps</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {selectedSteps.map(step => (
              <div key={step.id} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1">
                <span className="font-medium">Case #{step.caseId}</span>
                <span className="text-gray-600">{step.title || step.type}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  step.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                  step.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleBatchAction('approve')}
            disabled={processing}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Batch Approve
          </button>
          
          <button
            onClick={() => handleBatchAction('request_changes')}
            disabled={processing}
            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Batch Reject
          </button>
        </div>

        {/* Batch-specific options */}
        {identicalSteps.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={() => handleBatchAction('approve_identical')}
              disabled={processing}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quick Approve Identical ({identicalSteps.length})
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Batch {batchAction === 'approve' || batchAction === 'approve_identical' ? 'Approval' : 'Rejection'}
              </h3>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                You are about to {batchAction === 'approve' || batchAction === 'approve_identical' ? 'approve' : 'reject'} {' '}
                {batchAction === 'approve_identical' ? identicalSteps.length : selectedSteps.length} steps.
                This action cannot be undone.
              </p>

              <div className="mb-4">
                <label htmlFor="batch-comments" className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Comments {batchAction !== 'approve' && batchAction !== 'approve_identical' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  id="batch-comments"
                  value={batchComments}
                  onChange={(e) => setBatchComments(e.target.value)}
                  placeholder={
                    batchAction === 'approve' || batchAction === 'approve_identical'
                      ? 'Optional: Add notes for this batch approval...'
                      : 'Required: Explain why these steps need changes...'
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  required={batchAction !== 'approve' && batchAction !== 'approve_identical'}
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={processing}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={executeBatchAction}
                  disabled={processing || (batchAction !== 'approve' && batchAction !== 'approve_identical' && !batchComments.trim())}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 ${
                    batchAction === 'approve' || batchAction === 'approve_identical'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {processing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Confirm ${batchAction === 'approve' || batchAction === 'approve_identical' ? 'Approval' : 'Rejection'}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BatchActionsPanel;
