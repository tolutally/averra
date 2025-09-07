import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';


const CaseFiltersBar = ({ onFiltersChange = () => {} }) => {
  const [filters, setFilters] = useState({
    workflowType: '',
    status: '',
    coordinator: '',
    dateRange: '',
    search: ''
  });

  const workflowTypeOptions = [
    { value: '', label: 'All Workflow Types' },
    { value: 'fintech-kyc', label: 'FinTech KYC' },
    { value: 'saas-vendor', label: 'SaaS Vendor' },
    { value: 'compliance-audit', label: 'Compliance Audit' },
    { value: 'partner-onboarding', label: 'Partner Onboarding' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'not-started', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'pending-review', label: 'Pending Review' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const coordinatorOptions = [
    { value: '', label: 'All Coordinators' },
    { value: 'sarah-chen', label: 'Sarah Chen' },
    { value: 'mike-rodriguez', label: 'Mike Rodriguez' },
    { value: 'emma-wilson', label: 'Emma Wilson' },
    { value: 'david-kim', label: 'David Kim' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-30-days', label: 'Last 30 Days' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      workflowType: '',
      status: '',
      coordinator: '',
      dateRange: '',
      search: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="w-full sm:w-48">
            <Input
              type="search"
              placeholder="Search cases..."
              value={filters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="w-full"
            />
          </div>

          <div className="w-full sm:w-40">
            <Select
              options={workflowTypeOptions}
              value={filters?.workflowType}
              onChange={(value) => handleFilterChange('workflowType', value)}
              placeholder="Workflow Type"
            />
          </div>

          <div className="w-full sm:w-32">
            <Select
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => handleFilterChange('status', value)}
              placeholder="Status"
            />
          </div>

          <div className="w-full sm:w-36">
            <Select
              options={coordinatorOptions}
              value={filters?.coordinator}
              onChange={(value) => handleFilterChange('coordinator', value)}
              placeholder="Coordinator"
            />
          </div>

          <div className="w-full sm:w-32">
            <Select
              options={dateRangeOptions}
              value={filters?.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
              placeholder="Date Range"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={clearFilters}
              className="whitespace-nowrap"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
        </div>
      </div>
    </div>
  );
};

export default CaseFiltersBar;