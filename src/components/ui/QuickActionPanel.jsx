import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionPanel = ({ 
  context = 'coordinator', // 'coordinator' | 'external'
  caseId = null,
  actions = [],
  isFloating = false,
  position = 'bottom-right', // 'bottom-right' | 'bottom-left' | 'sidebar'
  onAction = () => {},
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Default actions based on context
  const getDefaultActions = () => {
    if (context === 'external') {
      return [
        {
          id: 'save-continue',
          label: 'Save & Continue',
          icon: 'ArrowRight',
          variant: 'default',
          primary: true
        },
        {
          id: 'save-draft',
          label: 'Save Draft',
          icon: 'Save',
          variant: 'outline'
        },
        {
          id: 'help',
          label: 'Get Help',
          icon: 'HelpCircle',
          variant: 'ghost'
        }
      ];
    } else {
      return [
        {
          id: 'approve-case',
          label: 'Approve Case',
          icon: 'Check',
          variant: 'default',
          primary: true
        },
        {
          id: 'request-info',
          label: 'Request Info',
          icon: 'MessageSquare',
          variant: 'outline'
        },
        {
          id: 'reject-case',
          label: 'Reject Case',
          icon: 'X',
          variant: 'outline',
          className: 'negative-action'
        },
        {
          id: 'export-data',
          label: 'Export Data',
          icon: 'Download',
          variant: 'ghost'
        }
      ];
    }
  };

  const actionItems = actions?.length > 0 ? actions : getDefaultActions();
  const primaryActions = actionItems?.filter(action => action?.primary);
  const secondaryActions = actionItems?.filter(action => !action?.primary);

  const handleActionClick = (actionId) => {
    onAction(actionId, caseId);
    if (isFloating) {
      setIsExpanded(false);
    }
  };

  // Floating Panel (for external users)
  if (isFloating) {
    const positionClasses = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6'
    };

    return (
      <div className={`fixed ${positionClasses?.[position]} z-40 ${className}`}>
        <div className="flex flex-col items-end space-y-2">
          {/* Expanded Actions */}
          {isExpanded && (
            <div className="bg-card border border-border rounded-lg shadow-elevated p-2 space-y-1 animate-slide-in">
              {secondaryActions?.map((action) => (
                <Button
                  key={action?.id}
                  variant={action?.variant || 'ghost'}
                  size="sm"
                  iconName={action?.icon}
                  iconPosition="left"
                  onClick={() => handleActionClick(action?.id)}
                  className={`w-full justify-start ${action?.className || ''}`}
                >
                  {action?.label}
                </Button>
              ))}
            </div>
          )}

          {/* Primary Action Button */}
          <div className="flex items-center space-x-2">
            {secondaryActions?.length > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="rounded-full shadow-subtle"
              >
                <Icon name={isExpanded ? "X" : "MoreVertical"} size={16} />
              </Button>
            )}

            {primaryActions?.map((action) => (
              <Button
                key={action?.id}
                variant={action?.variant || 'default'}
                iconName={action?.icon}
                iconPosition="left"
                onClick={() => handleActionClick(action?.id)}
                className={`shadow-subtle ${action?.className || ''}`}
              >
                {action?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Sidebar Panel (for coordinators)
  if (position === 'sidebar') {
    return (
      <div className={`bg-card border border-border rounded-lg p-4 space-y-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={16} className="text-accent" />
          <h3 className="font-medium text-foreground">Quick Actions</h3>
        </div>
        <div className="space-y-2">
          {primaryActions?.map((action) => (
            <Button
              key={action?.id}
              variant={action?.variant || 'default'}
              iconName={action?.icon}
              iconPosition="left"
              onClick={() => handleActionClick(action?.id)}
              fullWidth
              className={action?.className}
            >
              {action?.label}
            </Button>
          ))}

          {secondaryActions?.length > 0 && (
            <>
              <div className="border-t border-border pt-2 mt-3">
                {secondaryActions?.map((action) => (
                  <Button
                    key={action?.id}
                    variant={action?.variant || 'ghost'}
                    iconName={action?.icon}
                    iconPosition="left"
                    onClick={() => handleActionClick(action?.id)}
                    fullWidth
                    className={`justify-start ${action?.className || ''}`}
                  >
                    {action?.label}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Bottom Action Bar (mobile)
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40 ${className}`}>
      <div className="max-w-md mx-auto flex items-center space-x-3">
        {primaryActions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant || 'default'}
            iconName={action?.icon}
            iconPosition="left"
            onClick={() => handleActionClick(action?.id)}
            fullWidth
          >
            {action?.label}
          </Button>
        ))}

        {secondaryActions?.length > 0 && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name="MoreHorizontal" size={16} />
          </Button>
        )}
      </div>
      {/* Expanded Secondary Actions */}
      {isExpanded && (
        <div className="max-w-md mx-auto mt-3 pt-3 border-t border-border">
          <div className="grid grid-cols-2 gap-2">
            {secondaryActions?.map((action) => (
              <Button
                key={action?.id}
                variant={action?.variant || 'ghost'}
                iconName={action?.icon}
                iconPosition="left"
                onClick={() => handleActionClick(action?.id)}
                size="sm"
              >
                {action?.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionPanel;