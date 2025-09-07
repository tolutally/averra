import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import FileUploadZone from './FileUploadZone';
import ExampleComparison from './ExampleComparison';

const VerificationItem = ({
  id,
  title,
  description,
  acceptanceCriteria = [],
  examples = { good: [], needsRevision: [] },
  fileTypes = ['.pdf', '.jpg', '.png'],
  maxFileSize = '10MB',
  required = true,
  onFileUpload = () => {},
  uploadedFiles = [],
  validationErrors = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const hasErrors = validationErrors?.length > 0;
  const isComplete = uploadedFiles?.length > 0 && !hasErrors;

  return (
    <div className={`bg-card border rounded-lg p-4 sm:p-6 transition-smooth ${
      hasErrors ? 'border-error' : isComplete ? 'border-success' : 'border-border'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {required && (
              <span className="text-error text-sm">*</span>
            )}
            {isComplete && (
              <div className="w-5 h-5 checkmark rounded-full flex items-center justify-center">
                <Icon name="Check" size={12} />
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-muted-foreground hover:text-foreground transition-smooth rounded-md hover:bg-muted ml-4"
        >
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
        </button>
      </div>
      {/* Acceptance Criteria */}
      {isExpanded && acceptanceCriteria?.length > 0 && (
        <div className="mb-4 p-3 bg-muted/50 rounded-md">
          <h4 className="text-sm font-medium text-foreground mb-2">Acceptance Criteria:</h4>
          <ul className="space-y-1">
            {acceptanceCriteria?.map((criteria, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 checkmark rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <Icon name="Check" size={10} />
                </div>
                <span>{criteria}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Examples Toggle */}
      {(examples?.good?.length > 0 || examples?.needsRevision?.length > 0) && (
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            iconName="Eye"
            iconPosition="left"
            onClick={() => setShowExamples(!showExamples)}
          >
            {showExamples ? 'Hide Examples' : 'View Examples'}
          </Button>
        </div>
      )}
      {/* Examples */}
      {showExamples && (
        <div className="mb-6">
          <ExampleComparison 
            goodExamples={examples?.good}
            needsRevisionExamples={examples?.needsRevision}
          />
        </div>
      )}
      {/* File Upload Zone */}
      <div className="mb-4">
        <FileUploadZone
          id={id}
          acceptedTypes={fileTypes}
          maxSize={maxFileSize}
          onFileUpload={onFileUpload}
          uploadedFiles={uploadedFiles}
          errors={validationErrors}
        />
      </div>
      {/* File Requirements */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div className="flex items-center space-x-4">
          <span>Accepted: {fileTypes?.join(', ')}</span>
          <span>Max size: {maxFileSize}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={12} />
          <span>Files are automatically scanned for security</span>
        </div>
      </div>
      {/* Validation Errors */}
      {hasErrors && (
        <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-md">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              {validationErrors?.map((error, index) => (
                <p key={index} className="text-sm text-error">{error}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationItem;