import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StepActions = ({
  canSubmit = false,
  isSubmitting = false,
  onSubmit = () => {},
  onRequestExtension = () => {},
  onSaveDraft = () => {},
  showExtensionRequest = true,
  showSaveDraft = true
}) => {
  const [showExtensionForm, setShowExtensionForm] = useState(false);
  const [extensionReason, setExtensionReason] = useState('');
  const [extensionDays, setExtensionDays] = useState('3');

  const handleExtensionSubmit = () => {
    onRequestExtension({
      reason: extensionReason,
      days: parseInt(extensionDays),
      requestedAt: new Date()?.toISOString()
    });
    setShowExtensionForm(false);
    setExtensionReason('');
    setExtensionDays('3');
  };

  return (
    <div className="space-y-4">
      {/* Extension Request Form */}
      {showExtensionForm && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Request Extension</h3>
            <button
              onClick={() => setShowExtensionForm(false)}
              className="p-2 text-muted-foreground hover:text-foreground transition-smooth rounded-md hover:bg-muted"
            >
              <Icon name="X" size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reason for extension
              </label>
              <textarea
                value={extensionReason}
                onChange={(e) => setExtensionReason(e?.target?.value)}
                placeholder="Please explain why you need additional time..."
                className="w-full p-3 border border-border rounded-md text-foreground bg-background resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Additional days needed
              </label>
              <select
                value={extensionDays}
                onChange={(e) => setExtensionDays(e?.target?.value)}
                className="w-full p-3 border border-border rounded-md text-foreground bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="5">5 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="default"
              iconName="Clock"
              iconPosition="left"
              onClick={handleExtensionSubmit}
              disabled={!extensionReason?.trim()}
            >
              Submit Request
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowExtensionForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {/* Main Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Secondary Actions */}
        <div className="flex items-center space-x-3">
          {showSaveDraft && (
            <Button
              variant="ghost"
              iconName="Save"
              iconPosition="left"
              onClick={onSaveDraft}
              size="sm"
            >
              Save Draft
            </Button>
          )}

          {showExtensionRequest && (
            <Button
              variant="ghost"
              iconName="Clock"
              iconPosition="left"
              onClick={() => setShowExtensionForm(true)}
              size="sm"
            >
              Request Extension
            </Button>
          )}
        </div>

        {/* Primary Action */}
        <Button
          variant="default"
          iconName="ArrowRight"
          iconPosition="right"
          onClick={onSubmit}
          disabled={!canSubmit}
          loading={isSubmitting}
          className="sm:min-w-[200px]"
        >
          {isSubmitting ? 'Processing...' : 'Submit & Continue'}
        </Button>
      </div>
      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Your progress is automatically saved. You can return to this step anytime using your secure link.
        </p>
      </div>
    </div>
  );
};

export default StepActions;