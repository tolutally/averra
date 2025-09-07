import React, { useState, useRef } from 'react';
import { useTelemetry } from '../../../hooks/useTelemetry.jsx';

const ReviewDecisionModal = ({ isOpen, onClose, onSubmit, decisionType, step }) => {
  const { trackCustomEvent } = useTelemetry();
  const [comments, setComments] = useState('');
  const [examples, setExamples] = useState([]);
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [slackPreview, setSlackPreview] = useState(false);
  const [teamsPreview, setTeamsPreview] = useState(false);
  const textareaRef = useRef(null);

  const predefinedReasons = {
    request_changes: [
      'Document quality insufficient',
      'Missing required information',
      'Incorrect format or template',
      'Security requirements not met',
      'Compliance issues identified',
      'Data accuracy concerns',
    ]
  };

  const exampleTypes = [
    { value: 'good', label: 'Good Example', color: 'green' },
    { value: 'bad', label: 'Bad Example', color: 'red' },
    { value: 'reference', label: 'Reference Material', color: 'blue' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const decisionData = {
      comments: comments.trim(),
      examples,
      mentionedUsers,
      notifySlack: slackPreview,
      notifyTeams: teamsPreview,
    };

    trackCustomEvent('review_decision_submitted', {
      decision_type: decisionType,
      step_id: step.id,
      has_comments: !!comments.trim(),
      examples_count: examples.length,
      mentions_count: mentionedUsers.length,
    });

    onSubmit(decisionData);
  };

  const addExample = () => {
    setExamples([...examples, { type: 'good', label: '', url: '' }]);
  };

  const updateExample = (index, field, value) => {
    const updatedExamples = examples.map((example, i) => 
      i === index ? { ...example, [field]: value } : example
    );
    setExamples(updatedExamples);
  };

  const removeExample = (index) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const insertPredefinedReason = (reason) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = comments;
    const newText = currentText.substring(0, start) + 
                   (currentText ? '\n\n' : '') + 
                   '• ' + reason + 
                   currentText.substring(end);
    setComments(newText);
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + reason.length + 3;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleMention = (user) => {
    if (!mentionedUsers.find(u => u.id === user.id)) {
      setMentionedUsers([...mentionedUsers, user]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {decisionType === 'approve' ? 'Approve Step' : 'Request Changes'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Step: {step.title} • Case #{step.caseId}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Predefined Reasons (for request changes) */}
          {decisionType === 'request_changes' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Common Issues (click to add)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {predefinedReasons.request_changes.map((reason, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => insertPredefinedReason(reason)}
                    className="text-left px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
              {decisionType === 'approve' ? 'Approval Notes (optional)' : 'Required Changes'}
              {decisionType === 'request_changes' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              ref={textareaRef}
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required={decisionType === 'request_changes'}
              placeholder={
                decisionType === 'approve' 
                  ? 'Add any additional notes about this approval...'
                  : 'Describe what needs to be changed and why...'
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={6}
            />
            <p className="mt-1 text-xs text-gray-500">
              Use @username to mention team members
            </p>
          </div>

          {/* Examples */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Example Links (optional)
              </label>
              <button
                type="button"
                onClick={addExample}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Example
              </button>
            </div>

            {examples.map((example, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <select
                  value={example.type}
                  onChange={(e) => updateExample(index, 'type', e.target.value)}
                  className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  {exampleTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={example.label}
                  onChange={(e) => updateExample(index, 'label', e.target.value)}
                  placeholder="Example description"
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="url"
                  value={example.url}
                  onChange={(e) => updateExample(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeExample(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Notification Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Notifications
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={slackPreview}
                  onChange={(e) => setSlackPreview(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Send to Slack</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={teamsPreview}
                  onChange={(e) => setTeamsPreview(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Send to Microsoft Teams</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          {(slackPreview || teamsPreview) && comments && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Message Preview</h4>
              <div className="bg-white border rounded p-3 text-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${
                    decisionType === 'approve' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <strong>
                    Step {decisionType === 'approve' ? 'Approved' : 'Needs Changes'}
                  </strong>
                </div>
                <p className="text-gray-700">Case #{step.caseId} - {step.title}</p>
                <p className="mt-2 text-gray-600">{comments}</p>
                {examples.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Examples:</p>
                    {examples.map((example, index) => (
                      <p key={index} className="text-xs text-blue-600">
                        • {example.label}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                decisionType === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {decisionType === 'approve' ? 'Approve Step' : 'Request Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewDecisionModal;
