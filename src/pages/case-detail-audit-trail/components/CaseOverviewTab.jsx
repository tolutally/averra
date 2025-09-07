import React from 'react';
import Icon from '../../../components/AppIcon';

const CaseOverviewTab = ({ caseData, onUpdateCase }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-success-foreground bg-success';
      case 'in-progress':
        return 'text-warning bg-warning/10';
      case 'blocked':
        return 'text-pastel-orange-foreground bg-pastel-orange';
      case 'pending':
        return 'text-accent bg-accent/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'priority--high';
      case 'medium':
        return 'priority--medium';
      case 'low':
        return 'priority--low';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Case Summary Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{caseData?.clientName}</h3>
            <p className="text-sm text-muted-foreground">Case ID: #{caseData?.id}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseData?.status)}`}>
              {caseData?.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(caseData?.priority)}`}>
              {caseData?.priority} Priority
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Created Date</p>
            <p className="text-sm font-medium text-foreground">{caseData?.createdDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Due Date</p>
            <p className="text-sm font-medium text-foreground">{caseData?.dueDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Assigned Coordinator</p>
            <p className="text-sm font-medium text-foreground">{caseData?.assignedCoordinator}</p>
          </div>
        </div>
      </div>
      {/* Participant Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4 flex items-center">
          <Icon name="User" size={16} className="mr-2" />
          Participant Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Contact Person</p>
              <p className="text-sm font-medium text-foreground">{caseData?.contactPerson}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
              <p className="text-sm font-medium text-foreground">{caseData?.email}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
              <p className="text-sm font-medium text-foreground">{caseData?.phone}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Company</p>
              <p className="text-sm font-medium text-foreground">{caseData?.company}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Workflow Progress */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4 flex items-center">
          <Icon name="CheckCircle" size={16} className="mr-2" />
          Workflow Progress
        </h4>
        <div className="space-y-4">
          {caseData?.workflowSteps?.map((step, index) => (
            <div key={step?.id} className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step?.status === 'completed' ? 'checkmark' :
                step?.status === 'in-progress' ? 'priority--medium' :
                step?.status === 'blocked' ? 'priority--high' :
                'bg-muted text-muted-foreground'
              }`}>
                {step?.status === 'completed' ? (
                  <Icon name="Check" size={16} />
                ) : step?.status === 'in-progress' ? (
                  <Icon name="Clock" size={16} />
                ) : step?.status === 'blocked' ? (
                  <Icon name="AlertCircle" size={16} />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{step?.name}</p>
                <p className="text-xs text-muted-foreground">{step?.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{step?.completedDate || 'Pending'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Current Blocker Status */}
      {caseData?.currentBlocker && (
        <div className="bg-pastel-orange border border-pastel-orange-foreground/20 rounded-lg p-6">
          <h4 className="text-md font-semibold text-pastel-orange-foreground mb-4 flex items-center">
            <Icon name="AlertTriangle" size={16} className="mr-2" />
            Current Blocker
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground">{caseData?.currentBlocker?.reason}</p>
              <p className="text-xs text-muted-foreground mt-1">{caseData?.currentBlocker?.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Blocked since: {caseData?.currentBlocker?.blockedSince}
              </p>
              <button
                onClick={() => onUpdateCase('resolve-blocker')}
                className="text-xs text-primary hover:text-primary/80 font-medium"
              >
                View Resolution Options →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseOverviewTab;