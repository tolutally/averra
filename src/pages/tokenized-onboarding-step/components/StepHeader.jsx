import React from 'react';
import Icon from '../../../components/AppIcon';

const StepHeader = ({ 
  stepNumber = 1, 
  totalSteps = 4, 
  stepTitle = "Document Verification",
  onRequestExtension = null 
}) => {
  const progressPercentage = (stepNumber / totalSteps) * 100;

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">OnboardFlow</span>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">{stepTitle}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">
                  {stepNumber} of {totalSteps}
                </span>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-smooth rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Progress */}
            <div className="sm:hidden flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground">
                {stepNumber}/{totalSteps}
              </span>
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-smooth rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step Title Mobile */}
        <div className="sm:hidden pb-3">
          <h1 className="text-lg font-semibold text-foreground">{stepTitle}</h1>
        </div>

        {/* Request Extension Link */}
        {onRequestExtension && (
          <div className="pb-3">
            <button
              onClick={onRequestExtension}
              className="text-sm text-accent hover:text-accent/80 transition-smooth flex items-center space-x-1"
            >
              <Icon name="Clock" size={14} />
              <span>Request Extension</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepHeader;