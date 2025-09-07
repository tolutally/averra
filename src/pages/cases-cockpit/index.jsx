import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import AppLayout from '../../components/layout/AppLayout';
import CasesTableView from './components/CasesTableView';
import CasesKanbanView from './components/CasesKanbanView';
import { getAllCases } from '../../services/caseConverter';

const CasesCockpit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCases, setSelectedCases] = useState(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [highlightedCase, setHighlightedCase] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    coordinator: 'all',
    blockerStatus: 'all',
    slaStatus: 'all'
  });

  // Saved views
  const [savedViews, setSavedViews] = useState([
    { id: 'overdue', name: 'Overdue Cases', filters: { slaStatus: 'overdue' } },
    { id: 'high-priority', name: 'High Priority', filters: { priority: 'high' } },
    { id: 'blocked', name: 'Blocked Cases', filters: { blockerStatus: 'blocked' } },
    { id: 'review-needed', name: 'Review Needed', filters: { status: 'pending-review' } }
  ]);

  const [activeView, setActiveView] = useState(null);

  // Filter options
  const filterOptions = {
    status: [
      { value: 'all', label: 'All Statuses' },
      { value: 'not-started', label: 'Not Started' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'pending-review', label: 'Pending Review' },
      { value: 'completed', label: 'Completed' },
      { value: 'on-hold', label: 'On Hold' }
    ],
    priority: [
      { value: 'all', label: 'All Priorities' },
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'urgent', label: 'Urgent' }
    ],
    coordinator: [
      { value: 'all', label: 'All Coordinators' },
      { value: 'coord-1', label: 'Sarah Johnson' },
      { value: 'coord-2', label: 'Mike Chen' },
      { value: 'coord-3', label: 'Lisa Wang' },
      { value: 'coord-4', label: 'John Davis' }
    ],
    blockerStatus: [
      { value: 'all', label: 'All Cases' },
      { value: 'blocked', label: 'Blocked' },
      { value: 'unblocked', label: 'Not Blocked' }
    ],
    slaStatus: [
      { value: 'all', label: 'All SLA Status' },
      { value: 'on-time', label: 'On Time' },
      { value: 'at-risk', label: 'At Risk' },
      { value: 'overdue', label: 'Overdue' }
    ]
  };

  // Load cases
  useEffect(() => {
    loadCases();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [cases, filters]);

  // Handle success messages from case creation
  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        type: 'success',
        message: location.state.message
      });
      
      // Highlight the newly created case
      if (location.state?.highlightCase) {
        setHighlightedCase(location.state.highlightCase);
        
        // Clear highlight after 5 seconds
        setTimeout(() => {
          setHighlightedCase(null);
        }, 5000);
      }
      
      // Clear the message after showing it
      setTimeout(() => {
        setNotification(null);
        // Clear the location state
        window.history.replaceState({}, document.title);
      }, 5000);
    }
  }, [location.state]);

  const loadCases = () => {
    setIsLoading(true);
    try {
      // Get cases from localStorage and add mock cases for demonstration
      const storedCases = getAllCases();
      const mockCases = generateMockCases();
      const allCases = [...storedCases, ...mockCases];
      
      // Enhance cases with review-specific data
      const enhancedCases = allCases.map(case_ => ({
        ...case_,
        slaStatus: calculateSLAStatus(case_.deadline),
        blockerStatus: case_.blockerReason ? 'blocked' : 'unblocked',
        reviewScore: Math.floor(Math.random() * 100),
        lastActivity: case_.updatedAt || case_.createdAt,
        participantCount: case_.participants?.length || 0,
        completedSteps: case_.metrics?.completedSteps || 0,
        totalSteps: case_.metrics?.totalSteps || 0
      }));

      setCases(enhancedCases);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockCases = () => {
    return [
      {
        id: 'CASE-2024-101',
        name: 'Acme Corp KYC Review',
        clientName: 'Acme Corporation',
        status: 'pending-review',
        priority: 'high',
        deadline: '2024-08-25T17:00:00Z',
        coordinatorId: 'coord-1',
        templateName: 'Standard Fintech KYB',
        createdAt: '2024-08-20T09:00:00Z',
        updatedAt: '2024-08-22T14:30:00Z',
        blockerReason: 'Missing bank statement verification',
        participants: [
          { id: 1, name: 'John Smith', email: 'john@acme.com', status: 'completed', role: 'participant' },
          { id: 2, name: 'Jane Doe', email: 'jane@acme.com', status: 'pending', role: 'participant' }
        ],
        steps: [
          {
            id: 'req-1',
            title: 'Upload Corporate Documents',
            type: 'upload',
            status: 'approved',
            acceptanceCriteria: ['Valid business registration', 'Clear document scan'],
            reviewComments: 'All documents verified and accepted'
          },
          {
            id: 'req-2',
            title: 'Bank Statement Verification',
            type: 'upload',
            status: 'pending-review',
            acceptanceCriteria: ['Recent 3-month statements', 'Bank letterhead visible']
          },
          {
            id: 'req-3',
            title: 'Beneficial Owner Information',
            type: 'form',
            status: 'needs-changes',
            acceptanceCriteria: ['Complete ownership structure', 'Valid ID documents'],
            reviewComments: 'Please provide updated ownership percentages'
          }
        ],
        metrics: { totalSteps: 8, completedSteps: 6, progress: 75 }
      },
      {
        id: 'CASE-2024-102',
        name: 'TechFlow Vendor Onboarding',
        clientName: 'TechFlow Solutions',
        status: 'in-progress',
        priority: 'medium',
        deadline: '2024-08-28T17:00:00Z',
        coordinatorId: 'coord-2',
        templateName: 'Vendor Onboarding',
        createdAt: '2024-08-21T10:00:00Z',
        updatedAt: '2024-08-22T16:45:00Z',
        participants: [
          { id: 1, name: 'Mike Johnson', email: 'mike@techflow.com', status: 'in-progress', role: 'participant' }
        ],
        steps: [
          {
            id: 'req-1',
            title: 'Company Profile',
            type: 'form',
            status: 'approved',
            acceptanceCriteria: ['Complete business information', 'Valid contact details']
          },
          {
            id: 'req-2',
            title: 'Insurance Documentation',
            type: 'upload',
            status: 'pending-review',
            acceptanceCriteria: ['Valid insurance certificate', 'Adequate coverage amounts']
          }
        ],
        metrics: { totalSteps: 10, completedSteps: 4, progress: 40 }
      }
    ];
  };

  const calculateSLAStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const hoursUntilDeadline = (deadlineDate - now) / (1000 * 60 * 60);
    
    if (hoursUntilDeadline < 0) return 'overdue';
    if (hoursUntilDeadline < 24) return 'at-risk';
    return 'on-time';
  };

  const applyFilters = () => {
    let filtered = [...cases];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(case_ =>
        case_.clientName.toLowerCase().includes(searchTerm) ||
        case_.id.toLowerCase().includes(searchTerm) ||
        case_.templateName.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(case_ => case_.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(case_ => case_.priority === filters.priority);
    }

    // Coordinator filter
    if (filters.coordinator !== 'all') {
      filtered = filtered.filter(case_ => case_.coordinatorId === filters.coordinator);
    }

    // Blocker status filter
    if (filters.blockerStatus !== 'all') {
      filtered = filtered.filter(case_ => case_.blockerStatus === filters.blockerStatus);
    }

    // SLA status filter
    if (filters.slaStatus !== 'all') {
      filtered = filtered.filter(case_ => case_.slaStatus === filters.slaStatus);
    }

    setFilteredCases(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setActiveView(null); // Clear active saved view when manually filtering
  };

  const applySavedView = (view) => {
    setFilters({ ...filters, ...view.filters });
    setActiveView(view.id);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      coordinator: 'all',
      blockerStatus: 'all',
      slaStatus: 'all'
    });
    setActiveView(null);
  };

  const handleBatchAction = async (action) => {
    const selectedCaseIds = Array.from(selectedCases);
    console.log(`Batch action ${action} on cases:`, selectedCaseIds);
    
    switch (action) {
      case 'approve':
        // Handle batch approval
        break;
      case 'reject':
        // Handle batch rejection
        break;
      case 'assign':
        // Handle batch assignment
        break;
      default:
        break;
    }
  };

  const handleExport = async (format = 'csv') => {
    setIsExporting(true);
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = filteredCases.map(case_ => ({
        'Case ID': case_.id,
        'Client Name': case_.clientName,
        'Status': case_.status,
        'Priority': case_.priority,
        'SLA Status': case_.slaStatus,
        'Progress': `${case_.progress || 0}%`,
        'Coordinator': case_.coordinatorId,
        'Deadline': new Date(case_.deadline).toLocaleDateString(),
        'Created': new Date(case_.createdAt).toLocaleDateString()
      }));

      // In real app, this would trigger actual file download
      console.log(`Exporting ${exportData.length} cases to ${format.toUpperCase()}:`, exportData);
      
      // Show success notification
      alert(`Successfully exported ${exportData.length} cases to ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCaseSelect = (caseId, selected) => {
    const newSelected = new Set(selectedCases);
    if (selected) {
      newSelected.add(caseId);
    } else {
      newSelected.delete(caseId);
    }
    setSelectedCases(newSelected);
  };

  const handleSelectAll = (selected) => {
    if (selected) {
      setSelectedCases(new Set(filteredCases.map(case_ => case_.id)));
    } else {
      setSelectedCases(new Set());
    }
  };

  // Review pane handlers - Remove these since we're navigating to pages instead
  const handleCaseClick = (caseId) => {
    navigate(`/cases/${caseId}`);
  };

  const handleCounterpartyView = (case_) => {
    // Navigate to the tokenized onboarding step with case context
    // Using the case ID as a mock token for now - in real implementation this would be a proper token
    navigate(`/tokenized-onboarding-step`, { 
      state: { 
        caseId: case_.id,
        clientName: case_.clientName,
        templateName: case_.templateName
      } 
    });
  };

  return (
    <AppLayout>
      <main className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Review Cockpit</h1>
              <p className="mt-1 text-muted-foreground">
                Review and manage case progress across all workflows
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon name="Table" size={16} className="mr-1" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'kanban'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon name="Columns" size={16} className="mr-1" />
                  Kanban
                </button>
              </div>

              {/* Export */}
              <Button
                variant="outline"
                iconName="Download"
                onClick={() => handleExport('csv')}
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>

              {/* Create Case */}
              <Button
                iconName="Plus"
                onClick={() => navigate('/case-creation')}
              >
                New Case
              </Button>
            </div>
          </div>
        </div>

        {/* Success Notification */}
        {notification && (
          <div className={`px-4 sm:px-6 lg:px-8 py-3 border-b ${
            notification.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center">
              <Icon 
                name={notification.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
                size={20} 
                className={notification.type === 'success' ? 'text-green-600 mr-3' : 'text-red-600 mr-3'} 
              />
              <p className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {notification.message}
              </p>
              <button
                onClick={() => setNotification(null)}
                className={`ml-auto ${
                  notification.type === 'success' ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'
                }`}
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Filters & Saved Views */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          {/* Saved Views */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-700">Quick Views:</span>
            {savedViews.map(view => (
              <button
                key={view.id}
                onClick={() => applySavedView(view)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  activeView === view.id
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {view.name}
              </button>
            ))}
            {activeView && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <Icon name="X" size={14} className="mr-1" />
                Clear
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search cases, clients, or IDs..."
                value={filters.search}
                onChange={(value) => handleFilterChange('search', value)}
                iconName="Search"
              />
            </div>
            
            <Select
              placeholder="Status"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              options={filterOptions.status}
            />
            
            <Select
              placeholder="Priority"
              value={filters.priority}
              onChange={(value) => handleFilterChange('priority', value)}
              options={filterOptions.priority}
            />
            
            <Select
              placeholder="SLA Status"
              value={filters.slaStatus}
              onChange={(value) => handleFilterChange('slaStatus', value)}
              options={filterOptions.slaStatus}
            />
            
            <Select
              placeholder="Blocker Status"
              value={filters.blockerStatus}
              onChange={(value) => handleFilterChange('blockerStatus', value)}
              options={filterOptions.blockerStatus}
            />
          </div>
        </div>

        {/* Batch Actions */}
        {selectedCases.size > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {selectedCases.size} case(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBatchAction('approve')}
                >
                  Batch Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBatchAction('reject')}
                >
                  Batch Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBatchAction('assign')}
                >
                  Batch Assign
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {viewMode === 'table' ? (
              <CasesTableView
                cases={filteredCases}
                isLoading={isLoading}
                selectedCases={selectedCases}
                onCaseSelect={handleCaseSelect}
                onSelectAll={handleSelectAll}
                onCaseClick={handleCaseClick}
                onCounterpartyView={handleCounterpartyView}
                highlightedCase={highlightedCase}
              />
            ) : (
              <CasesKanbanView
                cases={filteredCases}
                isLoading={isLoading}
                onCaseClick={handleCaseClick}
                onCounterpartyView={handleCounterpartyView}
                highlightedCase={highlightedCase}
              />
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default CasesCockpit;
