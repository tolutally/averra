import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const RightSidebar = ({ onActionClick = () => {} }) => {
  const overdueCases = [
    {
      id: 'CASE-2024-003',
      clientName: 'SecureBank Corp',
      daysOverdue: 1,
      coordinator: 'Emma Wilson',
      priority: 'high'
    },
    {
      id: 'CASE-2024-007',
      clientName: 'FinanceFlow Ltd',
      daysOverdue: 3,
      coordinator: 'Sarah Chen',
      priority: 'medium'
    }
  ];

  const pingRecommendations = [
    {
      caseId: 'CASE-2024-001',
      clientName: 'TechFlow Solutions',
      action: 'Follow up on document upload',
      urgency: 'medium',
      lastContact: '2 days ago'
    },
    {
      caseId: 'CASE-2024-002',
      clientName: 'DataVault Inc',
      action: 'Schedule review call',
      urgency: 'high',
      lastContact: '1 day ago'
    }
  ];

  const summaryMetrics = [
    {
      label: 'Avg Completion Time',
      value: '4.2 days',
      trend: 'down',
      trendValue: '0.3 days'
    },
    {
      label: 'Success Rate',
      value: '94%',
      trend: 'up',
      trendValue: '2%'
    },
    {
      label: 'Active Coordinators',
      value: '8',
      trend: 'stable',
      trendValue: '0'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Zap" size={16} className="text-accent" />
          <h3 className="font-medium text-foreground">Quick Actions</h3>
        </div>
        <div className="space-y-2">
          <Button
            variant="outline"
            iconName="Settings"
            iconPosition="left"
            onClick={() => onActionClick('manage-templates')}
            fullWidth
            className="justify-start"
          >
            Manage Templates
          </Button>
        </div>
      </div>
      {/* Overdue Cases Alert */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="AlertTriangle" size={16} className="text-error" />
          <h3 className="font-medium text-foreground">Overdue Cases</h3>
          <span className="bg-error/10 text-error text-xs px-2 py-1 rounded-full">
            {overdueCases?.length}
          </span>
        </div>
        <div className="space-y-3">
          {overdueCases?.map((case_) => (
            <div key={case_?.id} className="border border-border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-foreground text-sm">{case_?.clientName}</div>
                  <div className="text-xs text-muted-foreground font-mono">{case_?.id}</div>
                </div>
                <div className="text-xs text-error font-medium">
                  {case_?.daysOverdue}d overdue
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{case_?.coordinator}</span>
                <Button
                  variant="outline"
                  size="xs"
                  iconName="Send"
                  onClick={() => onActionClick('send-reminder', case_?.id)}
                >
                  Remind
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="ArrowRight"
          iconPosition="right"
          onClick={() => onActionClick('view-all-overdue')}
          className="w-full mt-3"
        >
          View All Overdue
        </Button>
      </div>
    </div>
  );
};

export default RightSidebar;