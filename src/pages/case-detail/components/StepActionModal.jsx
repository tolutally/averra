import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StepActionModal = ({ isOpen, onClose, onConfirm, actionType, stepTitle }) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Require notes for rejection
    if (actionType === 'reject' && !notes.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onConfirm({ notes: notes.trim() });
      setNotes('');
    } catch (error) {
      console.error('Error submitting action:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isApproval = actionType === 'approve';
  const title = isApproval ? 'Approve Step' : 'Request Changes';
  const confirmText = isApproval ? 'Approve' : 'Request Changes';
  const iconName = isApproval ? 'CheckCircle' : 'XCircle';
  const iconColor = isApproval ? 'text-green-600' : 'text-red-600';
  const buttonColor = isApproval 
    ? 'bg-green-600 hover:bg-green-700' 
    : 'bg-red-600 hover:bg-red-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              isApproval ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Icon name={iconName} size={20} className={iconColor} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{stepTitle}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isApproval ? 'Notes (Optional)' : 'Reason for Changes (Required)'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  isApproval 
                    ? 'Add any additional notes about this approval...'
                    : 'Please specify what changes are needed...'
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required={!isApproval}
              />
              {!isApproval && (
                <p className="mt-1 text-xs text-gray-500">
                  Please provide clear instructions on what needs to be changed.
                </p>
              )}
            </div>

            {isApproval && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex">
                  <Icon name="Info" size={16} className="text-green-600 mr-2 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">Confirming Approval</p>
                    <p>This will mark the step as approved and move to the next pending review.</p>
                  </div>
                </div>
              </div>
            )}

            {!isApproval && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex">
                  <Icon name="AlertTriangle" size={16} className="text-yellow-600 mr-2 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Requesting Changes</p>
                    <p>The participant will be notified and asked to resubmit with your feedback.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || (!isApproval && !notes.trim())}
                className={buttonColor}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StepActionModal;
