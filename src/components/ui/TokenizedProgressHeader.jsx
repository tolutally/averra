import React from 'react';
import Icon from '../AppIcon';

const TokenizedProgressHeader = ({ 
  currentStep = 1, 
  totalSteps = 4, 
  stepTitle = "Verification Step",
  onExit = null 
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">Averra</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">{stepTitle}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">
                  {currentStep} of {totalSteps}
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
                {currentStep}/{totalSteps}
              </span>
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-smooth rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Exit Button */}
            {onExit && (
              <button
                onClick={onExit}
                className="p-2 text-muted-foreground hover:text-foreground transition-smooth rounded-md hover:bg-muted"
                aria-label="Exit onboarding"
              >
                <Icon name="X" size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TokenizedProgressHeader;