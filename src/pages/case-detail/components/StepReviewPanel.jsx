import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StepActionModal from './StepActionModal';

const StepReviewPanel = ({ caseData, selectedStep, onStepSelect, onStepAction }) => {
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const getStepStatusColor = (status) => {
    const colors = {
      'pending': 'bg-gray-100 text-gray-800',
      'pending-review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'requires-changes': 'bg-red-100 text-red-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return colors[status] || colors['pending'];
  };

  const getStepStatusIcon = (status) => {
    const icons = {
      'pending': 'Circle',
      'pending-review': 'Clock',
      'approved': 'CheckCircle',
      'requires-changes': 'XCircle',
      'completed': 'CheckCircle'
    };
    return icons[status] || icons['pending'];
  };

  const handleAction = (type) => {
    setActionType(type);
    setShowActionModal(true);
  };

  const handleConfirmAction = async (data) => {
    try {
      await onStepAction(selectedStep.id, actionType, data);
      setShowActionModal(false);
      setActionType(null);
    } catch (error) {
      console.error('Error processing step action:', error);
    }
  };

  const handlePreviewFile = (file) => {
    // In real app, this would open a proper file preview
    if (file.type === 'PDF') {
      setPreviewUrl(`/api/files/preview/${file.id}`);
    } else {
      window.open(file.url, '_blank');
    }
  };

  const renderAcceptanceCriteria = () => {
    if (!selectedStep?.acceptanceCriteria?.length) {
      return null;
    }

    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Acceptance Criteria</h4>
        <div className="space-y-2">
          {selectedStep.acceptanceCriteria.map((criteria, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
              </div>
              <p className="text-sm text-gray-700">{criteria}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFilePreview = (file) => {
    if (file.type === 'PDF') {
      return (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">{file.size} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                iconName="Eye"
                onClick={() => handlePreviewFile(file)}
              >
                Preview
              </Button>
              <Button
                size="sm"
                variant="outline"
                iconName="Download"
                onClick={() => window.open(file.url, '_blank')}
              >
                Download
              </Button>
            </div>
          </div>
          
          {/* PDF Preview Placeholder */}
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <Icon name="FileText" size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">PDF Preview</p>
              <p className="text-xs text-gray-400">Click Preview to view full document</p>
            </div>
          </div>
        </div>
      );
    }

    // Image preview
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="Image" size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500">{file.size} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              iconName="Download"
              onClick={() => window.open(file.url, '_blank')}
            >
              Download
            </Button>
          </div>
        </div>
        
        {/* Image Preview */}
        <div className="bg-white border rounded-lg p-2">
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-48 object-contain"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgODBMMTIwIDEwMEgxMDBIMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDEyMEw4MCAxMDBIMTAwSDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex">
      {/* Steps Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Requirements</h3>
          
          <div className="space-y-2">
            {caseData.steps?.map((step) => (
              <button
                key={step.id}
                onClick={() => onStepSelect(step)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedStep?.id === step.id
                    ? 'bg-white border-blue-200 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                    {step.title}
                  </h4>
                  <Icon 
                    name={getStepStatusIcon(step.status)} 
                    size={16} 
                    className={`ml-2 flex-shrink-0 ${
                      step.status === 'approved' ? 'text-green-600' :
                      step.status === 'requires-changes' ? 'text-red-600' :
                      step.status === 'pending-review' ? 'text-yellow-600' :
                      'text-gray-400'
                    }`} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStepStatusColor(step.status)}`}>
                    {step.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  
                  {step.uploads?.length > 0 && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Icon name="Paperclip" size={12} className="mr-1" />
                      {step.uploads.length}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Review Area */}
      <div className="flex-1 overflow-y-auto">
        {selectedStep ? (
          <div className="p-6">
            {/* Step Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedStep.title}
                  </h2>
                  <p className="text-gray-600">{selectedStep.description}</p>
                </div>
                
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStepStatusColor(selectedStep.status)}`}>
                  {selectedStep.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>

              {/* Action Buttons */}
              {selectedStep.status === 'pending-review' && (
                <div className="flex space-x-3">
                  <Button
                    iconName="CheckCircle"
                    onClick={() => handleAction('approve')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    iconName="XCircle"
                    onClick={() => handleAction('reject')}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Request Changes
                  </Button>
                </div>
              )}

              {selectedStep.status === 'approved' && selectedStep.approvedBy && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <Icon name="CheckCircle" size={16} className="text-green-600 mr-2" />
                    <span className="text-sm text-green-800">
                      Approved by {selectedStep.approvedBy} on {new Date(selectedStep.approvedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              {selectedStep.status === 'requires-changes' && selectedStep.reviewNotes && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <Icon name="XCircle" size={16} className="text-red-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800 mb-1">Changes Requested</p>
                      <p className="text-sm text-red-700">{selectedStep.reviewNotes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Acceptance Criteria */}
            {renderAcceptanceCriteria()}

            {/* Uploaded Files */}
            {selectedStep.uploads?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Uploaded Documents</h4>
                <div className="space-y-4">
                  {selectedStep.uploads.map((file) => (
                    <div key={file.id}>
                      {renderFilePreview(file)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Files State */}
            {(!selectedStep.uploads || selectedStep.uploads.length === 0) && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Icon name="Upload" size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No documents uploaded yet</p>
                  <p className="text-xs text-gray-400">Participant needs to upload required documents</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Icon name="CheckSquare" size={64} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Step to Review</h3>
              <p className="text-gray-500">Choose a requirement from the sidebar to start reviewing</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <StepActionModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          onConfirm={handleConfirmAction}
          actionType={actionType}
          stepTitle={selectedStep?.title}
        />
      )}

      {/* File Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Document Preview</h3>
              <Button
                variant="ghost"
                iconName="X"
                onClick={() => setPreviewUrl(null)}
              />
            </div>
            <div className="p-4">
              <iframe
                src={previewUrl}
                className="w-full h-96"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step Action Modal */}
      <StepActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onConfirm={handleConfirmAction}
        actionType={actionType}
        stepTitle={selectedStep?.title}
      />
    </div>
  );
};

export default StepReviewPanel;
