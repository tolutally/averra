import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const CasesTableView = ({ 
  cases, 
  isLoading, 
  selectedCases, 
  onCaseSelect, 
  onSelectAll, 
  onCaseClick,
  onCounterpartyView,
  highlightedCase 
}) => {
  const getStatusBadge = (status) => {
    const badges = {
      'not-started': { color: 'bg-gray-100 text-gray-800', text: 'Not Started' },
      'in-progress': { color: 'bg-blue-100 text-blue-800', text: 'In Progress' },
      'pending-review': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Review' },
      'completed': { color: 'bg-green-100 text-green-800', text: 'Completed' },
      'on-hold': { color: 'bg-red-100 text-red-800', text: 'On Hold' }
    };
    
    const badge = badges[status] || badges['not-started'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      'low': { color: 'bg-gray-100 text-gray-600', icon: 'ArrowDown' },
      'medium': { color: 'bg-blue-100 text-blue-600', icon: 'Minus' },
      'high': { color: 'bg-orange-100 text-orange-600', icon: 'ArrowUp' },
      'urgent': { color: 'bg-red-100 text-red-600', icon: 'AlertTriangle' }
    };
    
    const badge = badges[priority] || badges['medium'];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${badge.color}`}>
        <Icon name={badge.icon} size={12} className="mr-1" />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getSLABadge = (slaStatus) => {
    const badges = {
      'on-time': { color: 'bg-green-100 text-green-800', icon: 'CheckCircle', text: 'On Time' },
      'at-risk': { color: 'bg-yellow-100 text-yellow-800', icon: 'Clock', text: 'At Risk' },
      'overdue': { color: 'bg-red-100 text-red-800', icon: 'AlertCircle', text: 'Overdue' }
    };
    
    const badge = badges[slaStatus] || badges['on-time'];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${badge.color}`}>
        <Icon name={badge.icon} size={12} className="mr-1" />
        {badge.text}
      </span>
    );
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

  const formatTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return '1 day remaining';
    } else {
      return `${diffDays} days remaining`;
    }
  };

  const allSelected = cases.length > 0 && selectedCases.size === cases.length;
  const someSelected = selectedCases.size > 0 && selectedCases.size < cases.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto h-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="w-12 px-6 py-3">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Case
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SLA
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Coordinator
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deadline
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Blockers
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cases.map((case_) => (
            <tr
              key={case_.id}
              className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                highlightedCase === case_.id ? 'bg-green-50 border-l-4 border-green-500 shadow-sm' : ''
              }`}
              onClick={() => onCaseClick(case_.id)}
            >
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedCases.has(case_.id)}
                  onChange={(e) => onCaseSelect(case_.id, e.target.checked)}
                />
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={16} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-gray-900">{case_.id}</div>
                      {case_.isNewlyCreated && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{case_.templateName}</div>
                  </div>
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{case_.clientName}</div>
                <div className="text-sm text-gray-500">{case_.name}</div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(case_.status)}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                {getPriorityBadge(case_.priority)}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        case_.progress >= 80 ? 'bg-green-500' :
                        case_.progress >= 60 ? 'bg-blue-500' :
                        case_.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${case_.progress || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {case_.progress || 0}%
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {case_.completedSteps || 0}/{case_.totalSteps || 0} steps
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                {getSLABadge(case_.slaStatus)}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                    <span className="text-xs font-medium text-gray-600">
                      {getCoordinatorName(case_.coordinatorId).split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {getCoordinatorName(case_.coordinatorId)}
                  </span>
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(case_.deadline).toLocaleDateString()}
                </div>
                <div className={`text-xs ${
                  case_.slaStatus === 'overdue' ? 'text-red-600' :
                  case_.slaStatus === 'at-risk' ? 'text-yellow-600' : 'text-gray-500'
                }`}>
                  {formatTimeRemaining(case_.deadline)}
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                {case_.blockerReason ? (
                  <div className="flex items-center">
                    <Icon name="AlertTriangle" size={16} className="text-red-500 mr-1" />
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                      Blocked
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">None</span>
                )}
                {case_.blockerReason && (
                  <div className="text-xs text-gray-500 mt-1 truncate max-w-24" title={case_.blockerReason}>
                    {case_.blockerReason}
                  </div>
                )}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCounterpartyView && onCounterpartyView(case_);
                    }}
                    className="text-slate-600 hover:text-slate-800 transition-colors flex items-center space-x-1"
                    title="View as counterparty"
                  >
                    <Icon name="Eye" size={14} />
                    <span className="text-xs">Counterparty</span>
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCaseClick(case_.id);
                    }}
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    Review
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {cases.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
          <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CasesTableView;
