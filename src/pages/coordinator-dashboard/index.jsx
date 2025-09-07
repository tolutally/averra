import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import CaseFiltersBar from './components/CaseFiltersBar';
import CasesTable from './components/CasesTable';
import RightSidebar from './components/RightSidebar';

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState({});
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Check for success message from case creation
  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        type: 'success',
        message: location.state.message
      });
      
      // Clear the message after showing it
      setTimeout(() => {
        setNotification(null);
        // Clear the location state
        window.history.replaceState({}, document.title);
      }, 5000);
    }
  }, [location.state]);

  // Load created cases from localStorage
  useEffect(() => {
    const existingCases = JSON.parse(localStorage.getItem('vouchline_cases') || '[]');
    setCases(existingCases);
  }, []);

  const userProfile = {
    name: 'Sarah Chen',
    role: 'Senior Coordinator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  };

  const metrics = {
    totalCases: 156,
    activeCases: 89,
    completedToday: 12,
    overdueCases: 8,
    avgCompletionTime: "4.2 days",
    completionRate: 78
  };

  useEffect(() => {
    // Simulate loading cases based on filters
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleBulkAction = (action, selectedCases) => {
    console.log('Bulk action:', action, 'Cases:', selectedCases);
    
    switch (action) {
      case 'send-reminder':
        // Simulate sending reminders
        alert(`Sending reminders to ${selectedCases?.length} case(s)`);
        break;
      case 'extend-deadline':
        // Simulate deadline extension
        alert(`Extending deadlines for ${selectedCases?.length} case(s)`);
        break;
      case 'assign-coordinator':
        // Simulate coordinator assignment
        alert(`Assigning coordinator to ${selectedCases?.length} case(s)`);
        break;
      default:
        console.log('Unknown bulk action:', action);
    }
  };

  const handleSidebarAction = (action, data) => {
    console.log('Sidebar action:', action, 'Data:', data);
    
    switch (action) {
      case 'send-reminder':
        alert(`Sending reminder for case: ${data}`);
        break;
      case 'contact-client':
        alert(`Contacting client for case: ${data}`);
        break;
      case 'manage-templates': navigate('/workflow-template-configuration');
        break;
      case 'view-all-overdue':
        setFilters({ ...filters, status: 'overdue' });
        break;
      default:
        console.log('Unknown sidebar action:', action);
    }
  };

  return (
    <AppLayout userProfile={userProfile}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Success Notification */}
          {notification && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {notification.message}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setNotification(null)}
                    className="inline-flex text-green-400 hover:text-green-500"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Page Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor and manage onboarding cases across all workflows
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/cases')}
                className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Review Cases</span>
              </button>
              <button
                onClick={() => navigate('/case-creation')}
                className="flex items-center space-x-2 bg-action-800 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create New Case</span>
              </button>
            </div>
          </div>

          {/* Top Row Cards */}
          <div className="mb-4 grid grid-cols-1 lg:grid-cols-10 gap-4">
            {/* Open Requests Card - 65% */}
            <div className="lg:col-span-6 bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-base font-medium text-gray-900 mb-3">Open Requests</h2>
              
              {/* Donut Chart and Stats */}
              <div className="flex items-start space-x-4">
                {/* Donut Chart */}
                <div className="flex-shrink-0">
                  <div className="relative w-20 h-20">
                    {/* SVG Donut Chart */}
                    <svg viewBox="0 0 36 36" className="w-20 h-20 transform -rotate-90">
                      {/* Background circle */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="3"
                      />
                      {/* Critical - 37.5% (135 degrees) - Sky/Cyan (largest slice) */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#77BCE7"
                        strokeWidth="3"
                        strokeDasharray="37.5, 62.5"
                        strokeDashoffset="0"
                      />
                      {/* Warning - 37.5% (135 degrees) - Royal Blue */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#213FE4"
                        strokeWidth="3"
                        strokeDasharray="37.5, 62.5"
                        strokeDashoffset="-37.5"
                      />
                      {/* Recent - 25% (90 degrees) - Purple */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#832CE1"
                        strokeWidth="3"
                        strokeDasharray="25, 75"
                        strokeDashoffset="-75"
                      />
                    </svg>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">8</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#77BCE7'}}></div>
                    <div>
                      <div className="text-xs font-medium text-gray-900">Critical (7+ days)</div>
                      <div className="text-base font-bold text-gray-900">3</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#213FE4'}}></div>
                    <div>
                      <div className="text-xs font-medium text-gray-900">Warning (3-7 days)</div>
                      <div className="text-base font-bold text-gray-900">3</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#832CE1'}}></div>
                    <div>
                      <div className="text-xs font-medium text-gray-900">Recent (1-3 days)</div>
                      <div className="text-base font-bold text-gray-900">2</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div>
                      <div className="text-xs font-medium text-gray-900">Completed</div>
                      <div className="text-base font-bold text-gray-900">0</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Summary Section */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Performance Summary</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Avg Completion Time</div>
                      <div className="text-sm font-semibold text-gray-900">4.2 days</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <span className="text-xs text-green-600">0.3 days</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Success Rate</div>
                      <div className="text-sm font-semibold text-gray-900">94%</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5-5m0 0l5 5m-5-5v18" />
                      </svg>
                      <span className="text-xs text-green-600">2%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Active Coordinators</div>
                      <div className="text-sm font-semibold text-gray-900">8</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                      <span className="text-xs text-gray-400">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Who to Ping Next Card - 35% */}
            <div className="lg:col-span-4 bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-base font-medium text-gray-900 mb-3">Who to Ping Next</h2>
              <div className="space-y-2">
                <div className="border border-gray-200 rounded-lg p-2">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">TechFlow Solutions</div>
                      <div className="text-xs text-gray-500">Follow up on document upload</div>
                    </div>
                    <div className="priority--medium px-2 py-1 rounded-full text-xs">
                      medium
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Last contact: 2 days ago</span>
                    <button className="px-2 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50">
                      Contact
                    </button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-2">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">DataVault Inc</div>
                      <div className="text-xs text-gray-500">Schedule review call</div>
                    </div>
                    <div className="priority--high px-2 py-1 rounded-full text-xs">
                      high
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Last contact: 1 day ago</span>
                    <button className="px-2 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Main Content Area */}
            <div className="space-y-6">
              {/* Filters */}
              <CaseFiltersBar
                onFiltersChange={handleFiltersChange}
              />

              {/* Cases Table */}
              <div className="relative">
                {loading && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-muted-foreground">Loading cases...</span>
                    </div>
                  </div>
                )}
                <CasesTable
                  cases={cases}
                  onBulkAction={handleBulkAction}
                />
              </div>
            </div>

            {/* Right Sidebar - Disabled */}
            {/* 
            <div className="xl:col-span-1">
              <div className="sticky top-20">
                <RightSidebar onActionClick={handleSidebarAction} />
              </div>
            </div>
            */}
          </div>
        </div>
    </AppLayout>
  );
};

export default CoordinatorDashboard;