import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import CaseStatusBadge from './CaseStatusBadge';
import CaseProgressBar from './CaseProgressBar';

const CasesTable = ({ cases = [], onBulkAction = () => {} }) => {
  const navigate = useNavigate();
  const [selectedCases, setSelectedCases] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  // Load cases from localStorage (created cases)
  const createdCases = JSON.parse(localStorage.getItem('averra_cases') || '[]').map(caseData => ({
    id: caseData.id,
    clientName: caseData.clientName,
    workflowType: caseData.templateName,
    status: caseData.status,
    progress: caseData.metrics?.progress || 0,
    coordinator: 'Sarah Chen', // Default coordinator for demo
    slaDeadline: new Date(caseData.deadline),
    createdAt: new Date(caseData.createdAt),
    lastActivity: new Date(caseData.updatedAt),
    priority: caseData.priority,
    blockerReason: null,
    isNewlyCreated: true // Flag to identify newly created cases
  }));

  // Helper function to get workflow type styling
  const getWorkflowTypeClass = (workflowType) => {
    switch (workflowType?.toLowerCase()) {
      case 'fintech kyc':
      case 'partner onboarding':
        return 'workflow--onboarding';
      case 'compliance audit':
        return 'workflow--compliance';
      case 'saas vendor':
        return 'workflow--review';
      default:
        return 'workflow--approval';
    }
  };

  const mockCases = [
    {
      id: 'CASE-2024-001',
      clientName: 'TechFlow Solutions',
      workflowType: 'FinTech KYC',
      status: 'in-progress',
      progress: 65,
      coordinator: 'Sarah Chen',
      slaDeadline: new Date('2024-08-22T17:00:00'),
      createdAt: new Date('2024-08-15T09:30:00'),
      lastActivity: new Date('2024-08-19T14:20:00'),
      priority: 'high',
      blockerReason: null
    },
    {
      id: 'CASE-2024-002',
      clientName: 'DataVault Inc',
      workflowType: 'SaaS Vendor',
      status: 'pending-review',
      progress: 85,
      coordinator: 'Mike Rodriguez',
      slaDeadline: new Date('2024-08-20T17:00:00'),
      createdAt: new Date('2024-08-14T11:15:00'),
      lastActivity: new Date('2024-08-19T10:45:00'),
      priority: 'medium',
      blockerReason: null
    },
    {
      id: 'CASE-2024-003',
      clientName: 'SecureBank Corp',
      workflowType: 'Compliance Audit',
      status: 'overdue',
      progress: 40,
      coordinator: 'Emma Wilson',
      slaDeadline: new Date('2024-08-18T17:00:00'),
      createdAt: new Date('2024-08-12T14:20:00'),
      lastActivity: new Date('2024-08-17T16:30:00'),
      priority: 'high',
      blockerReason: 'Missing documentation'
    },
    {
      id: 'CASE-2024-004',
      clientName: 'CloudSync Ltd',
      workflowType: 'Partner Onboarding',
      status: 'completed',
      progress: 100,
      coordinator: 'David Kim',
      slaDeadline: new Date('2024-08-25T17:00:00'),
      createdAt: new Date('2024-08-10T08:45:00'),
      lastActivity: new Date('2024-08-19T12:15:00'),
      priority: 'low',
      blockerReason: null
    },
    {
      id: 'CASE-2024-005',
      clientName: 'InnovatePay Systems',
      workflowType: 'FinTech KYC',
      status: 'not-started',
      progress: 0,
      coordinator: 'Sarah Chen',
      slaDeadline: new Date('2024-08-26T17:00:00'),
      createdAt: new Date('2024-08-19T13:00:00'),
      lastActivity: new Date('2024-08-19T13:00:00'),
      priority: 'medium',
      blockerReason: null
    }
  ];

  // Combine created cases with mock cases, putting newly created ones first
  const allCases = [...createdCases, ...mockCases];
  const data = cases?.length > 0 ? cases : allCases;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCases(new Set(data.map(case_ => case_.id)));
    } else {
      setSelectedCases(new Set());
    }
  };

  const handleSelectCase = (caseId, checked) => {
    const newSelected = new Set(selectedCases);
    if (checked) {
      newSelected?.add(caseId);
    } else {
      newSelected?.delete(caseId);
    }
    setSelectedCases(newSelected);
  };

  const handleSort = (key) => {
    const direction = sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    return [...data]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];
      
      if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const formatTimeRemaining = (deadline) => {
    const now = new Date();
    const diff = deadline?.getTime() - now?.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diff < 0) return 'Overdue';
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getSLAColor = (deadline, status) => {
    if (status === 'completed') return 'text-slate-600';
    
    const now = new Date();
    const diff = deadline?.getTime() - now?.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 0) return 'text-slate-700';
    if (hours < 24) return 'text-slate-600';
    return 'text-slate-500';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority--high';
      case 'medium': return 'priority--medium';
      case 'low': return 'priority--low';
      default: return 'priority--low';
    }
  };

  const handleCaseClick = (caseId) => {
    navigate(`/case-detail-audit-trail/${caseId}`);
  };

  const sortedData = getSortedData();
  const allSelected = selectedCases?.size === data?.length && data?.length > 0;
  const someSelected = selectedCases?.size > 0 && selectedCases?.size < data?.length;

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      {/* Bulk Actions Bar */}
      {selectedCases?.size > 0 && (
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-800">
              {selectedCases?.size} case{selectedCases?.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onBulkAction('send-reminder', Array.from(selectedCases))}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                <Icon name="Send" size={16} className="mr-2" />
                Send Reminder
              </button>
              <button
                onClick={() => onBulkAction('extend-deadline', Array.from(selectedCases))}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                <Icon name="Calendar" size={16} className="mr-2" />
                Extend Deadline
              </button>
              <button
                onClick={() => onBulkAction('assign-coordinator', Array.from(selectedCases))}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                <Icon name="UserCheck" size={16} className="mr-2" />
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="w-12 px-6 py-4">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('clientName')}
                  className="flex items-center space-x-1 text-sm font-semibold text-gray-900 hover:text-slate-700 transition-colors"
                >
                  <span>Client</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('workflowType')}
                  className="flex items-center space-x-1 text-sm font-semibold text-gray-900 hover:text-slate-700 transition-colors"
                >
                  <span>Workflow</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <span>Status</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <span className="text-sm font-semibold text-gray-900">Progress</span>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('coordinator')}
                  className="flex items-center space-x-1 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <span>Coordinator</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('slaDeadline')}
                  className="flex items-center space-x-1 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <span>SLA</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <span className="text-sm font-semibold text-gray-900">Priority</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedData?.map((case_) => (
              <tr
                key={case_?.id}
                className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                  case_?.isNewlyCreated ? 'bg-slate-50 border-l-4 border-slate-400' : ''
                }`}
                onClick={() => handleCaseClick(case_?.id)}
              >
                <td className="px-6 py-4" onClick={(e) => e?.stopPropagation()}>
                  <Checkbox
                    checked={selectedCases?.has(case_?.id)}
                    onChange={(e) => handleSelectCase(case_?.id, e?.target?.checked)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{case_?.clientName}</span>
                      {case_?.isNewlyCreated && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 font-mono">{case_?.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getWorkflowTypeClass(case_?.workflowType)}`}>
                    {case_?.workflowType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <CaseStatusBadge status={case_?.status} size="sm" />
                  {case_?.blockerReason && (
                    <div className="text-xs text-slate-600 mt-1 bg-slate-100 px-2 py-1 rounded">
                      {case_?.blockerReason}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[80px]">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          case_?.progress >= 80 ? 'bg-slate-600' :
                          case_?.progress >= 50 ? 'bg-slate-500' :
                          case_?.progress >= 25 ? 'bg-slate-400' : 'bg-slate-300'
                        }`}
                        style={{ width: `${case_?.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                      {case_?.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-700">
                        {case_?.coordinator?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900">{case_?.coordinator}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm font-medium ${getSLAColor(case_?.slaDeadline, case_?.status)}`}>
                    {formatTimeRemaining(case_?.slaDeadline)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(case_?.priority)}`}>
                    {case_?.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card Layout */}
      <div className="lg:hidden divide-y divide-slate-200">
        {sortedData?.map((case_) => (
          <div
            key={case_?.id}
            className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={() => handleCaseClick(case_?.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div onClick={(e) => e?.stopPropagation()}>
                  <Checkbox
                    checked={selectedCases?.has(case_?.id)}
                    onChange={(e) => handleSelectCase(case_?.id, e?.target?.checked)}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{case_?.clientName}</div>
                  <div className="text-sm text-gray-500 font-mono">{case_?.id}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(case_?.priority)}`}>
                  {case_?.priority}
                </span>
                <CaseStatusBadge status={case_?.status} size="sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Workflow:</span>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getWorkflowTypeClass(case_?.workflowType)}`}>
                  {case_?.workflowType}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Coordinator:</span>
                <div className="font-medium text-gray-900">{case_?.coordinator}</div>
              </div>
              <div>
                <span className="text-gray-500">SLA:</span>
                <div className={`font-medium ${getSLAColor(case_?.slaDeadline, case_?.status)}`}>
                  {formatTimeRemaining(case_?.slaDeadline)}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Progress:</span>
                <div className="font-medium text-gray-900">{case_?.progress}%</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-medium text-gray-900">{case_?.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    case_?.progress >= 80 ? 'bg-emerald-500' :
                    case_?.progress >= 50 ? 'bg-blue-500' :
                    case_?.progress >= 25 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${case_?.progress}%` }}
                />
              </div>
            </div>

            {case_?.blockerReason && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md mb-4">
                <Icon name="AlertTriangle" size={14} className="inline mr-1" />
                Blocked: {case_?.blockerReason}
              </div>
            )}

            <div className="flex justify-end" onClick={(e) => e?.stopPropagation()}>
              <button
                onClick={() => handleCaseClick(case_?.id)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 transition-colors"
              >
                <Icon name="ExternalLink" size={16} className="mr-2" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {data?.length === 0 && (
        <div className="text-center py-16 px-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No cases found</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Get started by creating your first case or adjust your filters to see existing cases.
          </p>
          <button
            onClick={() => onBulkAction('create-case')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Create Case
          </button>
        </div>
      )}
    </div>
  );
};

export default CasesTable;