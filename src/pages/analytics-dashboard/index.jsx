import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import AppLayout from '../../components/layout/AppLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedMetric, setSelectedMetric] = useState('completion');
  const [workflowFilter, setWorkflowFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for analytics
  const completionData = [
    { name: 'Jan', completed: 85, started: 100, abandoned: 15 },
    { name: 'Feb', completed: 90, started: 110, abandoned: 20 },
    { name: 'Mar', completed: 78, started: 95, abandoned: 17 },
    { name: 'Apr', completed: 95, started: 115, abandoned: 20 },
    { name: 'May', completed: 88, started: 105, abandoned: 17 },
    { name: 'Jun', completed: 92, started: 108, abandoned: 16 }
  ];

  const workflowData = [
    { name: 'Employee Onboarding', value: 45, color: '#3b82f6' },
    { name: 'Vendor Registration', value: 30, color: '#10b981' },
    { name: 'Client KYC', value: 15, color: '#f59e0b' },
    { name: 'Contractor Setup', value: 10, color: '#ef4444' }
  ];

  const performanceMetrics = [
    {
      title: 'Total Cases',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: 'FileText',
      color: 'text-blue-600'
    },
    {
      title: 'Completion Rate',
      value: '89.2%',
      change: '+3.2%',
      trend: 'up',
      icon: 'CheckCircle',
      color: 'text-green-600'
    },
    {
      title: 'Avg. Completion Time',
      value: '4.2 days',
      change: '-0.8 days',
      trend: 'down',
      icon: 'Clock',
      color: 'text-orange-600'
    },
    {
      title: 'Active Participants',
      value: '1,234',
      change: '+8.7%',
      trend: 'up',
      icon: 'Users',
      color: 'text-purple-600'
    }
  ];

  const timeRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' }
  ];

  const workflowOptions = [
    { value: 'all', label: 'All Workflows' },
    { value: 'employee', label: 'Employee Onboarding' },
    { value: 'vendor', label: 'Vendor Registration' },
    { value: 'client', label: 'Client KYC' },
    { value: 'contractor', label: 'Contractor Setup' }
  ];

  const handleExportData = () => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      // In real app, trigger download
      console.log('Exporting analytics data...');
    }, 2000);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AppLayout>
      <main>
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
                <p className="mt-1 text-muted-foreground">
                  Monitor workflow performance and participant engagement metrics
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  onClick={handleRefreshData}
                  disabled={isLoading}
                  className={isLoading ? 'animate-spin' : ''}
                >
                  Refresh
                </Button>
                <Button
                  iconName="Download"
                  onClick={handleExportData}
                  disabled={isLoading}
                >
                  {isLoading ? 'Exporting...' : 'Export Data'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-4">
            <Select
              label="Time Range"
              value={dateRange}
              onChange={(value) => setDateRange(value)}
              options={timeRangeOptions}
              className="w-full sm:w-auto"
            />
            <Select
              label="Workflow Type"
              value={workflowFilter}
              onChange={(value) => setWorkflowFilter(value)}
              options={workflowOptions}
              className="w-full sm:w-auto"
            />
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {performanceMetrics?.map((metric) => (
              <div key={metric?.title} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${metric?.color}`}>
                    <Icon name={metric?.icon} size={20} />
                  </div>
                  <div className={`flex items-center text-sm ${
                    metric?.trend === 'up' ? 'text-success' : 'text-error'
                  }`}>
                    <Icon 
                      name={metric?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                      size={16} 
                      className="mr-1" 
                    />
                    {metric?.change}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-foreground">{metric?.value}</h3>
                  <p className="text-sm text-muted-foreground">{metric?.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Completion Trends */}
            <div className="xl:col-span-2 bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Completion Trends</h2>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-muted-foreground">Completed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-muted-foreground">Started</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-muted-foreground">Abandoned</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={completionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="completed" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="started" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="abandoned" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Workflow Distribution */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Workflow Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={workflowData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {workflowData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {workflowData?.map((item) => (
                  <div key={item?.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item?.color }}
                      ></div>
                      <span className="text-muted-foreground">{item?.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{item?.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Performing Workflows */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Top Performing Workflows</h2>
              <div className="space-y-4">
                {[
                  { name: 'Employee Onboarding v2.1', rate: 94, participants: 156 },
                  { name: 'Vendor KYC Standard', rate: 91, participants: 89 },
                  { name: 'Client Registration', rate: 88, participants: 67 },
                  { name: 'Contractor Verification', rate: 85, participants: 45 }
                ]?.map((workflow, index) => (
                  <div key={workflow?.name} className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                    <div>
                      <h4 className="font-medium text-foreground">{workflow?.name}</h4>
                      <p className="text-sm text-muted-foreground">{workflow?.participants} participants</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-success">{workflow?.rate}%</div>
                      <div className="text-xs text-muted-foreground">completion</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: 'Workflow completed', user: 'Sarah Johnson', time: '2 min ago', icon: 'CheckCircle', color: 'text-success' },
                  { action: 'New participant started', user: 'Mike Chen', time: '5 min ago', icon: 'UserPlus', color: 'text-blue-600' },
                  { action: 'Document uploaded', user: 'Lisa Wang', time: '12 min ago', icon: 'Upload', color: 'text-purple-600' },
                  { action: 'Step completed', user: 'John Davis', time: '18 min ago', icon: 'CheckSquare', color: 'text-orange-600' },
                  { action: 'Workflow started', user: 'Emma Wilson', time: '25 min ago', icon: 'Play', color: 'text-green-600' }
                ]?.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 hover:bg-muted/20 rounded-md transition-smooth">
                    <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${activity?.color}`}>
                      <Icon name={activity?.icon} size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity?.action}</p>
                      <p className="text-xs text-muted-foreground">{activity?.user} • {activity?.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default AnalyticsDashboard;