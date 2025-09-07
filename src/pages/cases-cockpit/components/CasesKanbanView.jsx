import React from 'react';
import Icon from '../../../components/AppIcon';

const CasesKanbanView = ({ cases, isLoading, onCaseClick, highlightedCase, onCounterpartyView }) => {
  const columns = [
    { id: 'not-started', title: 'Not Started', color: 'bg-gray-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'pending-review', title: 'Pending Review', color: 'bg-yellow-100' },
    { id: 'completed', title: 'Completed', color: 'bg-green-100' },
    { id: 'on-hold', title: 'On Hold', color: 'bg-red-100' }
  ];

  const getCasesByStatus = (status) => {
    return cases.filter(case_ => case_.status === status);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'border-l-gray-400',
      'medium': 'border-l-blue-400',
      'high': 'border-l-orange-400',
      'urgent': 'border-l-red-400'
    };
    return colors[priority] || colors['medium'];
  };

  const getSLAIndicator = (slaStatus) => {
    const indicators = {
      'on-time': { color: 'text-green-600', icon: 'CheckCircle' },
      'at-risk': { color: 'text-yellow-600', icon: 'Clock' },
      'overdue': { color: 'text-red-600', icon: 'AlertCircle' }
    };
    return indicators[slaStatus] || indicators['on-time'];
  };

  const getCoordinatorName = (coordinatorId) => {
    const coordinators = {
      'coord-1': 'Sarah Johnson',
      'coord-2': 'Mike Chen',
      'coord-3': 'Lisa Wang',
      'coord-4': 'John Davis'
    };
    return coordinators[coordinatorId] || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex space-x-6 p-6 min-w-max h-full">
        {columns.map(column => {
          const columnCases = getCasesByStatus(column.id);
          
          return (
            <div key={column.id} className="flex-shrink-0 w-80">
              {/* Column Header */}
              <div className={`${column.color} rounded-lg p-4 mb-4`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{column.title}</h3>
                  <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                    {columnCases.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="space-y-4 max-h-full overflow-y-auto">
                {columnCases.map(case_ => {
                  const slaIndicator = getSLAIndicator(case_.slaStatus);
                  
                  return (
                    <div
                      key={case_.id}
                      onClick={() => onCaseClick(case_.id)}
                      className={`bg-white rounded-lg border-l-4 ${getPriorityColor(case_.priority)} p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                        highlightedCase === case_.id ? 'ring-2 ring-green-300 bg-green-50' : ''
                      }`}
                    >
                      {/* Case Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 text-sm">{case_.id}</h4>
                            {highlightedCase === case_.id && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{case_.clientName}</p>
                        </div>
                        
                        {/* SLA Indicator */}
                        <Icon 
                          name={slaIndicator.icon} 
                          size={16} 
                          className={slaIndicator.color}
                        />
                      </div>

                      {/* Template */}
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {case_.templateName}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Progress</span>
                          <span className="text-xs font-medium text-gray-900">
                            {case_.progress || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              case_.progress >= 80 ? 'bg-green-500' :
                              case_.progress >= 60 ? 'bg-blue-500' :
                              case_.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${case_.progress || 0}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {case_.completedSteps || 0} of {case_.totalSteps || 0} steps completed
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className="mb-3">
                        <div className="flex items-center text-xs text-gray-500">
                          <Icon name="Calendar" size={12} className="mr-1" />
                          <span>Due {new Date(case_.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Blocker */}
                      {case_.blockerReason && (
                        <div className="mb-3">
                          <div className="flex items-center px-2 py-1 bg-red-50 rounded-md">
                            <Icon name="AlertTriangle" size={12} className="text-red-500 mr-1" />
                            <span className="text-xs text-red-600 font-medium">Blocked</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {case_.blockerReason}
                          </p>
                        </div>
                      )}

                      {/* Coordinator & Participants */}
                      <div className="flex items-center justify-between">
                        {/* Coordinator */}
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs font-medium text-gray-600">
                              {getCoordinatorName(case_.coordinatorId).split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-xs text-gray-600">
                            {getCoordinatorName(case_.coordinatorId)}
                          </span>
                        </div>

                        {/* Participants Count */}
                        <div className="flex items-center text-xs text-gray-500">
                          <Icon name="Users" size={12} className="mr-1" />
                          <span>{case_.participantCount || 0}</span>
                        </div>
                      </div>

                      {/* Priority Badge */}
                      <div className="mt-3 flex justify-between items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          case_.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          case_.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          case_.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {case_.priority.charAt(0).toUpperCase() + case_.priority.slice(1)}
                        </span>

                        {/* Quick Actions */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCaseClick(case_.id);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Review Case"
                          >
                            <Icon name="Eye" size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCounterpartyView && onCounterpartyView(case_);
                            }}
                            className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                            title="View as Counterparty - See what external participants see"
                          >
                            <Icon name="ExternalLink" size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle quick action
                            }}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Quick Approve"
                          >
                            <Icon name="CheckCircle" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Empty State */}
                {columnCases.length === 0 && (
                  <div className="text-center py-8">
                    <Icon name="FileX" size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No cases in {column.title.toLowerCase()}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CasesKanbanView;
