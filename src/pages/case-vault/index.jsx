import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import CaseFiltersBar from '../coordinator-dashboard/components/CaseFiltersBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CaseStatusBadge from '../coordinator-dashboard/components/CaseStatusBadge';

const CaseVault = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    workflowType: '',
    status: '',
    coordinator: '',
    dateRange: '',
    search: ''
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Mock case data for the vault
  const allCases = [
    {
      id: 'CASE-2024-001',
      clientName: 'TechFlow Solutions',
      workflowType: 'fintech-kyc',
      status: 'in-progress',
      progress: 65,
      coordinator: 'sarah-chen',
      lastActivity: new Date('2024-08-19T14:20:00'),
      createdAt: new Date('2024-08-15T09:30:00'),
      documentCount: 12,
      thumbnail: '/api/placeholder/200/150'
    },
    {
      id: 'CASE-2024-002',
      clientName: 'DataVault Inc',
      workflowType: 'saas-vendor',
      status: 'pending-review',
      progress: 85,
      coordinator: 'mike-rodriguez',
      lastActivity: new Date('2024-08-18T16:45:00'),
      createdAt: new Date('2024-08-10T11:15:00'),
      documentCount: 8,
      thumbnail: '/api/placeholder/200/150'
    },
    {
      id: 'CASE-2024-003',
      clientName: 'NextGen Analytics',
      workflowType: 'partner-onboarding',
      status: 'completed',
      progress: 100,
      coordinator: 'emma-wilson',
      lastActivity: new Date('2024-08-17T09:30:00'),
      createdAt: new Date('2024-08-05T14:20:00'),
      documentCount: 15,
      thumbnail: '/api/placeholder/200/150'
    },
    {
      id: 'CASE-2024-004',
      clientName: 'CloudTech Dynamics',
      workflowType: 'compliance-audit',
      status: 'overdue',
      progress: 45,
      coordinator: 'david-kim',
      lastActivity: new Date('2024-08-16T13:15:00'),
      createdAt: new Date('2024-08-12T10:45:00'),
      documentCount: 6,
      thumbnail: '/api/placeholder/200/150'
    },
    {
      id: 'CASE-2024-005',
      clientName: 'InnovateSoft Corp',
      workflowType: 'fintech-kyc',
      status: 'in-progress',
      progress: 30,
      coordinator: 'sarah-chen',
      lastActivity: new Date('2024-08-15T11:30:00'),
      createdAt: new Date('2024-08-14T16:00:00'),
      documentCount: 4,
      thumbnail: '/api/placeholder/200/150'
    },
    {
      id: 'CASE-2024-006',
      clientName: 'SecureFlow Systems',
      workflowType: 'saas-vendor',
      status: 'completed',
      progress: 100,
      coordinator: 'mike-rodriguez',
      lastActivity: new Date('2024-08-14T17:20:00'),
      createdAt: new Date('2024-08-01T09:00:00'),
      documentCount: 18,
      thumbnail: '/api/placeholder/200/150'
    }
  ];

  // Helper function for date range filtering
  const isInDateRange = (date, range) => {
    if (!range) return true;
    
    const now = new Date();
    const caseDate = new Date(date);
    
    switch (range) {
      case 'today':
        return caseDate.toDateString() === now.toDateString();
      case 'this-week':
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        return caseDate >= weekStart;
      case 'this-month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return caseDate >= monthStart;
      case 'last-30-days':
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        return caseDate >= thirtyDaysAgo;
      default:
        return true;
    }
  };

  // Filter and sort cases
  const filteredCases = allCases.filter(case_ => {
    const matchesSearch = !filters.search || 
                         case_.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         case_.id.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = !filters.status || case_.status === filters.status;
    const matchesWorkflow = !filters.workflowType || case_.workflowType === filters.workflowType;
    const matchesCoordinator = !filters.coordinator || case_.coordinator === filters.coordinator;
    const matchesDateRange = !filters.dateRange || isInDateRange(case_.lastActivity, filters.dateRange);
    
    return matchesSearch && matchesStatus && matchesWorkflow && matchesCoordinator && matchesDateRange;
  }).sort((a, b) => {
    // Default sort by most recent activity
    return new Date(b.lastActivity) - new Date(a.lastActivity);
  });

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCaseClick = (caseId) => {
    navigate(`/case-detail-audit-trail/${caseId}`);
  };

  const getWorkflowColor = (workflowType) => {
    switch (workflowType) {
      case 'fintech-kyc':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'saas-vendor':
        return 'bg-slate-200 text-slate-700 border-slate-400';
      case 'partner-onboarding':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'compliance-audit':
        return 'bg-blue-200 text-blue-700 border-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getWorkflowLabel = (workflowType) => {
    switch (workflowType) {
      case 'fintech-kyc':
        return 'FinTech KYC';
      case 'saas-vendor':
        return 'SaaS Vendor';
      case 'partner-onboarding':
        return 'Partner Onboarding';
      case 'compliance-audit':
        return 'Compliance Audit';
      default:
        return workflowType;
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Case Vault</h1>
                  <p className="mt-2 text-gray-600">
                    Browse and access all your case files in one secure location
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-white text-slate-700 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Icon name="Grid" size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-white text-slate-700 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Icon name="List" size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center">
                    <Icon name="FolderOpen" size={20} className="text-slate-700 mr-2" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Total Cases</p>
                      <p className="text-2xl font-bold text-slate-800">{allCases.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <Icon name="CheckCircle" size={20} className="text-blue-700 mr-2" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Completed</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {allCases.filter(c => c.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg border border-slate-300">
                  <div className="flex items-center">
                    <Icon name="Clock" size={20} className="text-slate-600 mr-2" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium">In Progress</p>
                      <p className="text-2xl font-bold text-slate-700">
                        {allCases.filter(c => c.status === 'in-progress').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
                  <div className="flex items-center">
                    <Icon name="AlertCircle" size={20} className="text-blue-700 mr-2" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Overdue</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {allCases.filter(c => c.status === 'overdue').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CaseFiltersBar onFiltersChange={handleFiltersChange} />

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredCases.length} of {allCases.length} cases
            </p>
          </div>

          {/* Cases Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCases.map((case_) => (
                <div
                  key={case_.id}
                  onClick={() => handleCaseClick(case_.id)}
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  {/* Thumbnail */}
                  <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon name="FileText" size={40} className="text-slate-400" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <CaseStatusBadge status={case_.status} size="sm" />
                    </div>
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-slate-700">
                      {case_.documentCount} docs
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-slate-700 transition-colors">
                        {case_.clientName}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">{case_.id}</p>
                    </div>

                    <div className="mb-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getWorkflowColor(case_.workflowType)}`}>
                        {getWorkflowLabel(case_.workflowType)}
                      </span>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{case_.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div 
                          className="bg-slate-600 h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${case_.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Updated {formatDate(case_.lastActivity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="divide-y divide-slate-200">
                {filteredCases.map((case_) => (
                  <div
                    key={case_.id}
                    onClick={() => handleCaseClick(case_.id)}
                    className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                          <Icon name="FileText" size={20} className="text-slate-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-slate-700 transition-colors">
                            {case_.clientName}
                          </h3>
                          <p className="text-sm text-gray-500 font-mono">{case_.id}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getWorkflowColor(case_.workflowType)}`}>
                            {getWorkflowLabel(case_.workflowType)}
                          </span>
                        </div>

                        <div className="text-center">
                          <CaseStatusBadge status={case_.status} />
                        </div>

                        <div className="text-center min-w-[100px]">
                          <div className="text-sm text-gray-900 font-medium">{case_.progress}%</div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${case_.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="text-center min-w-[80px]">
                          <div className="text-sm text-gray-900 font-medium">{case_.documentCount}</div>
                          <div className="text-xs text-gray-500">docs</div>
                        </div>

                        <div className="text-center min-w-[100px]">
                          <div className="text-xs text-gray-500">
                            {formatDate(case_.lastActivity)}
                          </div>
                        </div>

                        <Icon name="ChevronRight" size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredCases.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CaseVault;
