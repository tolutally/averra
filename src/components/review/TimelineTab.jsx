import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTelemetry } from '../../hooks/useTelemetry.jsx';
import LoadingState from '../ui/LoadingState';

const TimelineTab = ({ caseId }) => {
  const { trackCustomEvent } = useTelemetry();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    actor: 'all',
    action: 'all',
    dateRange: 'all',
  });
  const [expandedEvents, setExpandedEvents] = useState(new Set());

  useEffect(() => {
    if (caseId) {
      loadTimelineEvents();
      trackCustomEvent('timeline_viewed', { case_id: caseId });
    }
  }, [caseId, filters]);

  const loadTimelineEvents = async () => {
    setLoading(true);
    try {
      // Mock timeline data - replace with actual API call
      const mockEvents = generateMockTimelineEvents(caseId);
      const filteredEvents = applyFilters(mockEvents, filters);
      setEvents(filteredEvents);
    } catch (error) {
      console.error('Failed to load timeline events:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTimelineEvents = (caseId) => {
    return [
      {
        id: '1',
        timestamp: '2024-12-20T14:30:00Z',
        actor: {
          id: 'user1',
          name: 'John Doe',
          role: 'Coordinator',
          avatar: '/avatars/john.jpg',
        },
        action: 'case_created',
        description: 'Case created from template "Vendor Onboarding"',
        details: {
          templateName: 'Vendor Onboarding',
          priority: 'high',
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
      },
      {
        id: '2',
        timestamp: '2024-12-20T14:35:00Z',
        actor: {
          id: 'user1',
          name: 'John Doe',
          role: 'Coordinator',
        },
        action: 'step_assigned',
        description: 'Step 1 assigned to external party',
        details: {
          stepId: 'step1',
          stepTitle: 'Company Registration Documents',
          assignedTo: 'vendor@company.com',
        },
        ipAddress: '192.168.1.100',
      },
      {
        id: '3',
        timestamp: '2024-12-20T16:45:00Z',
        actor: {
          id: 'external1',
          name: 'vendor@company.com',
          role: 'External User',
        },
        action: 'file_uploaded',
        description: 'Document uploaded: business_license.pdf',
        details: {
          fileName: 'business_license.pdf',
          fileSize: '2.4 MB',
          stepId: 'step1',
        },
        ipAddress: '203.0.113.1',
        userAgent: 'Mozilla/5.0...',
      },
      {
        id: '4',
        timestamp: '2024-12-21T09:15:00Z',
        actor: {
          id: 'user2',
          name: 'Jane Smith',
          role: 'Reviewer',
        },
        action: 'step_reviewed',
        description: 'Step 1 approved',
        details: {
          stepId: 'step1',
          decision: 'approved',
          comments: 'All documents look good.',
        },
        ipAddress: '192.168.1.102',
      },
      {
        id: '5',
        timestamp: '2024-12-21T10:30:00Z',
        actor: {
          id: 'system',
          name: 'System',
          role: 'System',
        },
        action: 'nudge_sent',
        description: 'Reminder sent for overdue step',
        details: {
          stepId: 'step2',
          nudgeType: 'overdue_reminder',
          recipient: 'vendor@company.com',
        },
        ipAddress: null,
      },
    ];
  };

  const applyFilters = (events, filters) => {
    return events.filter(event => {
      if (filters.actor !== 'all' && event.actor.role.toLowerCase() !== filters.actor) {
        return false;
      }
      if (filters.action !== 'all' && event.action !== filters.action) {
        return false;
      }
      if (filters.dateRange !== 'all') {
        const eventDate = new Date(event.timestamp);
        const now = new Date();
        const daysDiff = (now - eventDate) / (1000 * 60 * 60 * 24);
        
        if (filters.dateRange === 'today' && daysDiff > 1) return false;
        if (filters.dateRange === 'week' && daysDiff > 7) return false;
        if (filters.dateRange === 'month' && daysDiff > 30) return false;
      }
      return true;
    });
  };

  const toggleEventExpansion = (eventId) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
    
    trackCustomEvent('timeline_event_expanded', {
      event_id: eventId,
      expanded: !expandedEvents.has(eventId),
    });
  };

  const getEventIcon = (action) => {
    const icons = {
      case_created: (
        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      step_assigned: (
        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      file_uploaded: (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      step_reviewed: (
        <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      nudge_sent: (
        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 17H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V12" />
        </svg>
      ),
    };
    return icons[action] || (
      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'coordinator': return 'bg-blue-100 text-blue-800';
      case 'reviewer': return 'bg-purple-100 text-purple-800';
      case 'external user': return 'bg-green-100 text-green-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportTimeline = () => {
    trackCustomEvent('timeline_export_initiated', {
      case_id: caseId,
      event_count: events.length,
    });
    
    // Mock export functionality
    const csvContent = events.map(event => ({
      timestamp: event.timestamp,
      actor: event.actor.name,
      role: event.actor.role,
      action: event.action,
      description: event.description,
      ip_address: event.ipAddress || 'N/A',
    }));
    
    console.log('Exporting timeline:', csvContent);
    alert('Timeline export started. This would download a CSV file in production.');
  };

  if (loading) {
    return <LoadingState message="Loading timeline events..." />;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Case Timeline</h2>
          <button
            onClick={exportTimeline}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Timeline
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Actor</label>
            <select
              value={filters.actor}
              onChange={(e) => setFilters({ ...filters, actor: e.target.value })}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="all">All Actors</option>
              <option value="coordinator">Coordinators</option>
              <option value="reviewer">Reviewers</option>
              <option value="external user">External Users</option>
              <option value="system">System</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Action</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="all">All Actions</option>
              <option value="case_created">Case Created</option>
              <option value="step_assigned">Step Assigned</option>
              <option value="file_uploaded">File Uploaded</option>
              <option value="step_reviewed">Step Reviewed</option>
              <option value="nudge_sent">Nudge Sent</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="p-6">
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No timeline events found for the selected filters</p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {events.map((event, eventIdx) => (
                <li key={event.id}>
                  <div className="relative pb-8">
                    {eventIdx !== events.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    )}
                    <div className="relative flex space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-white border-2 border-gray-200 rounded-full">
                        {getEventIcon(event.action)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {event.actor.name}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(event.actor.role)}`}>
                              {event.actor.role}
                            </span>
                          </div>
                          <time className="text-sm text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </time>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">{event.description}</p>
                        </div>
                        
                        {/* Expandable Details */}
                        {(event.details || event.ipAddress) && (
                          <div className="mt-2">
                            <button
                              onClick={() => toggleEventExpansion(event.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <svg className={`w-3 h-3 mr-1 transition-transform ${
                                expandedEvents.has(event.id) ? 'rotate-90' : ''
                              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              {expandedEvents.has(event.id) ? 'Hide' : 'Show'} details
                            </button>
                            
                            {expandedEvents.has(event.id) && (
                              <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs">
                                {event.details && (
                                  <div className="space-y-1">
                                    {Object.entries(event.details).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="font-medium text-gray-700">
                                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                        </span>
                                        <span className="text-gray-600">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {event.ipAddress && (
                                  <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                                    <span className="font-medium text-gray-700">IP Address:</span>
                                    <span className="text-gray-600 font-mono">{event.ipAddress}</span>
                                  </div>
                                )}
                                {event.userAgent && (
                                  <div className="flex justify-between mt-1">
                                    <span className="font-medium text-gray-700">User Agent:</span>
                                    <span className="text-gray-600 truncate max-w-xs" title={event.userAgent}>
                                      {event.userAgent}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineTab;
