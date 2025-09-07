import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ActivityTab = ({ activities, onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState(['all']);
  const [dateRange, setDateRange] = useState('all');

  const eventTypes = [
    { id: 'all', label: 'All Events', color: 'text-foreground' },
    { id: 'token-events', label: 'Token Events', color: 'text-accent' },
    { id: 'coordinator-actions', label: 'Coordinator Actions', color: 'text-primary' },
    { id: 'reminder-sends', label: 'Reminder Sends', color: 'text-warning' },
    { id: 'participant-interactions', label: 'Participant Interactions', color: 'text-success-foreground' },
    { id: 'system-events', label: 'System Events', color: 'text-muted-foreground' }
  ];

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'token-events':
        return 'Key';
      case 'coordinator-actions':
        return 'UserCheck';
      case 'reminder-sends':
        return 'Bell';
      case 'participant-interactions':
        return 'MessageSquare';
      case 'system-events':
        return 'Settings';
      case 'document-upload':
        return 'Upload';
      case 'status-change':
        return 'RefreshCw';
      case 'deadline-extension':
        return 'Calendar';
      default:
        return 'Activity';
    }
  };

  const getEventColor = (eventType) => {
    const type = eventTypes?.find(t => t?.id === eventType);
    return type ? type?.color : 'text-muted-foreground';
  };

  const handleFilterToggle = (filterId) => {
    if (filterId === 'all') {
      setSelectedFilters(['all']);
    } else {
      const newFilters = selectedFilters?.includes('all') 
        ? [filterId]
        : selectedFilters?.includes(filterId)
          ? selectedFilters?.filter(f => f !== filterId)
          : [...selectedFilters?.filter(f => f !== 'all'), filterId];
      
      setSelectedFilters(newFilters?.length === 0 ? ['all'] : newFilters);
    }
  };

  const filteredActivities = activities?.filter(activity => {
    if (selectedFilters?.includes('all')) return true;
    return selectedFilters?.includes(activity?.eventType);
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date?.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Filter by Event Type</h4>
            <div className="flex flex-wrap gap-2">
              {eventTypes?.map((type) => (
                <button
                  key={type?.id}
                  onClick={() => handleFilterToggle(type?.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-smooth ${
                    selectedFilters?.includes(type?.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {type?.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Date Range</h4>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e?.target?.value)}
              className="text-sm border border-border rounded-md px-3 py-1 bg-background"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>
      {/* Activity Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold text-foreground">Activity Timeline</h4>
          <p className="text-sm text-muted-foreground">
            {filteredActivities?.length} event{filteredActivities?.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border"></div>

          {/* Timeline Events */}
          <div className="space-y-6">
            {filteredActivities?.map((activity, index) => {
              const timestamp = formatTimestamp(activity?.timestamp);
              return (
                <div key={activity?.id} className="relative flex items-start space-x-4">
                  {/* Timeline Dot */}
                  <div className={`w-12 h-12 rounded-full border-2 border-background flex items-center justify-center z-10 ${
                    activity?.eventType === 'coordinator-actions' ? 'bg-primary' :
                    activity?.eventType === 'participant-interactions' ? 'bg-success' :
                    activity?.eventType === 'reminder-sends' ? 'bg-warning' :
                    activity?.eventType === 'token-events'? 'bg-accent' : 'bg-muted'
                  }`}>
                    <Icon 
                      name={getEventIcon(activity?.eventType)} 
                      size={16} 
                      color="white"
                    />
                  </div>
                  {/* Event Content */}
                  <div className="flex-1 bg-card border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="text-sm font-medium text-foreground">{activity?.title}</h5>
                        <p className="text-xs text-muted-foreground mt-1">{activity?.description}</p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>{timestamp?.date}</p>
                        <p>{timestamp?.time}</p>
                      </div>
                    </div>

                    {/* Metadata */}
                    {activity?.metadata && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {activity?.metadata?.ipAddress && (
                            <div>
                              <p className="text-muted-foreground">IP Address</p>
                              <p className="font-mono text-foreground">{activity?.metadata?.ipAddress}</p>
                            </div>
                          )}
                          {activity?.metadata?.userAgent && (
                            <div>
                              <p className="text-muted-foreground">Device</p>
                              <p className="text-foreground truncate" title={activity?.metadata?.userAgent}>
                                {activity?.metadata?.userAgent}
                              </p>
                            </div>
                          )}
                          {activity?.metadata?.tokenId && (
                            <div>
                              <p className="text-muted-foreground">Token ID</p>
                              <p className="font-mono text-foreground">{activity?.metadata?.tokenId}</p>
                            </div>
                          )}
                          {activity?.metadata?.performedBy && (
                            <div>
                              <p className="text-muted-foreground">Performed By</p>
                              <p className="text-foreground">{activity?.metadata?.performedBy}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {filteredActivities?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Activities Found</h3>
            <p className="text-muted-foreground">
              No activities match the selected filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTab;