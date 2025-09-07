import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const CaseContextBreadcrumb = ({ 
  caseId = null,
  caseName = null,
  caseStatus = null,
  parentPath = '/coordinator-dashboard',
  parentLabel = 'Dashboard',
  currentLabel = 'Case Details',
  showStatus = true 
}) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'approved':
        return 'text-success bg-success/10';
      case 'pending': case'in-progress':
        return 'text-warning bg-warning/10';
      case 'rejected': case'failed':
        return 'text-error bg-error/10';
      case 'draft':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-accent bg-accent/10';
    }
  };

  return (
    <div className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => handleNavigation(parentPath)}
              className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>{parentLabel}</span>
            </button>

            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />

            <span className="text-foreground font-medium">{currentLabel}</span>

            {caseId && (
              <>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground font-mono text-xs">
                  #{caseId}
                </span>
              </>
            )}
          </nav>

          {/* Case Info and Status */}
          {(caseName || caseStatus) && (
            <div className="flex items-center space-x-3">
              {caseName && (
                <div className="hidden sm:block">
                  <span className="text-sm font-medium text-foreground">{caseName}</span>
                </div>
              )}

              {showStatus && caseStatus && (
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseStatus)}`}>
                  {caseStatus}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Case Info */}
        {caseName && (
          <div className="sm:hidden pb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground truncate">{caseName}</span>
              {showStatus && caseStatus && (
                <div className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(caseStatus)}`}>
                  {caseStatus}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseContextBreadcrumb;