import React from 'react';

const CaseStatusBadge = ({ status, size = 'default' }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return {
          label: 'Completed',
          className: 'bg-success/10 text-success border-success/20'
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          className: 'bg-accent/10 text-accent border-accent/20'
        };
      case 'pending-review':
        return {
          label: 'Pending Review',
          className: 'bg-warning/10 text-warning border-warning/20'
        };
      case 'overdue':
        return {
          label: 'Overdue',
          className: 'bg-error/10 text-error border-error/20'
        };
      case 'not-started':
        return {
          label: 'Not Started',
          className: 'bg-muted text-muted-foreground border-border'
        };
      case 'blocked':
        return {
          label: 'Blocked',
          className: 'bg-destructive/10 text-destructive border-destructive/20'
        };
      default:
        return {
          label: status || 'Unknown',
          className: 'bg-muted text-muted-foreground border-border'
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${sizeClasses} ${config?.className}`}>
      {config?.label}
    </span>
  );
};

export default CaseStatusBadge;