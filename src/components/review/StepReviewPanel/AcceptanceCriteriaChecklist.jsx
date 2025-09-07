import React, { useState } from 'react';
import { useTelemetry } from '../../../hooks/useTelemetry.jsx';

const AcceptanceCriteriaChecklist = ({ criteria, onChange }) => {
  const { trackCustomEvent } = useTelemetry();
  const [expandedNotes, setExpandedNotes] = useState({});

  const handleCriteriaCheck = (criteriaId, checked) => {
    onChange(criteriaId, checked, criteria.find(c => c.id === criteriaId)?.notes || '');
    
    trackCustomEvent('acceptance_criteria_toggled', {
      criteria_id: criteriaId,
      checked,
    });
  };

  const handleNotesChange = (criteriaId, notes) => {
    const criteriaItem = criteria.find(c => c.id === criteriaId);
    onChange(criteriaId, criteriaItem.checked, notes);
  };

  const toggleNotesExpansion = (criteriaId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [criteriaId]: !prev[criteriaId]
    }));
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  if (!criteria || criteria.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p>No acceptance criteria defined for this step</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {criteria.map((criteriaItem) => (
        <div
          key={criteriaItem.id}
          className={`border rounded-lg p-4 transition-colors ${
            criteriaItem.checked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
          }`}
        >
          {/* Criteria Header */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={criteriaItem.checked || false}
                  onChange={(e) => handleCriteriaCheck(criteriaItem.id, e.target.checked)}
                  className="form-checkbox h-5 w-5 text-green-600 transition duration-150 ease-in-out"
                />
              </label>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                {getPriorityIcon(criteriaItem.priority)}
                <h4 className={`text-sm font-medium ${
                  criteriaItem.checked ? 'text-green-800 line-through' : 'text-gray-900'
                }`}>
                  {criteriaItem.title}
                </h4>
                {criteriaItem.required && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    Required
                  </span>
                )}
              </div>
              
              <p className={`mt-1 text-xs ${
                criteriaItem.checked ? 'text-green-700' : 'text-gray-600'
              }`}>
                {criteriaItem.description}
              </p>

              {/* Help Text */}
              {criteriaItem.helpText && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                  <div className="flex items-start space-x-1">
                    <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>{criteriaItem.helpText}</span>
                  </div>
                </div>
              )}

              {/* Examples */}
              {criteriaItem.examples && criteriaItem.examples.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-600 mb-1">Examples:</div>
                  <div className="space-y-1">
                    {criteriaItem.examples.map((example, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <span className={`w-2 h-2 rounded-full ${
                          example.type === 'good' ? 'bg-green-400' : 'bg-red-400'
                        }`}></span>
                        <a
                          href={example.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {example.label}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              <div className="mt-3">
                <button
                  onClick={() => toggleNotesExpansion(criteriaItem.id)}
                  className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800"
                >
                  <svg className={`w-3 h-3 transition-transform ${
                    expandedNotes[criteriaItem.id] ? 'rotate-90' : ''
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Add notes</span>
                </button>

                {expandedNotes[criteriaItem.id] && (
                  <div className="mt-2">
                    <textarea
                      value={criteriaItem.notes || ''}
                      onChange={(e) => handleNotesChange(criteriaItem.id, e.target.value)}
                      placeholder="Add review notes for this criteria..."
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Timestamp */}
              {criteriaItem.checkedAt && (
                <p className="mt-2 text-xs text-gray-500">
                  Checked on {new Date(criteriaItem.checkedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">Progress</span>
          <span className="text-sm text-gray-600">
            {criteria.filter(c => c.checked).length} of {criteria.length} completed
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(criteria.filter(c => c.checked).length / criteria.length) * 100}%`
            }}
          ></div>
        </div>
        
        {/* Required criteria check */}
        {criteria.some(c => c.required) && (
          <div className="mt-2">
            {criteria.filter(c => c.required && !c.checked).length > 0 ? (
              <p className="text-xs text-red-600">
                ⚠️ {criteria.filter(c => c.required && !c.checked).length} required criteria remaining
              </p>
            ) : (
              <p className="text-xs text-green-600">
                ✅ All required criteria completed
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptanceCriteriaChecklist;
