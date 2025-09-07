import React from 'react';
import Icon from '../../../components/AppIcon';

const TimelineTab = ({ caseData }) => {
  // Generate comprehensive timeline events from case data
  const generateTimelineEvents = () => {
    const events = [];
    
    // Case creation
    events.push({
      id: 'case-created',
      type: 'case-created',
      title: 'Case Created',
      description: `Case "${caseData.title}" was created and assigned to ${caseData.coordinator}`,
      timestamp: caseData.createdAt,
      user: 'System',
      ip: '192.168.1.100',
      icon: 'FileText',
      color: 'blue'
    });

    // Step events from case steps
    caseData.steps?.forEach((step, index) => {
      // Step submission
      if (step.submittedAt) {
        events.push({
          id: `step-${step.id}-submitted`,
          type: 'step-submitted',
          title: `Step ${index + 1} Submitted`,
          description: `"${step.title}" submitted by participant`,
          timestamp: step.submittedAt,
          user: caseData.participantName || 'Participant',
          ip: '203.0.113.45',
          icon: 'Upload',
          color: 'green',
          stepId: step.id
        });
      }

      // Step review events
      if (step.reviewedAt) {
        const action = step.status === 'approved' ? 'approved' : 'requested changes for';
        events.push({
          id: `step-${step.id}-reviewed`,
          type: 'step-reviewed',
          title: `Step ${index + 1} Reviewed`,
          description: `${step.reviewedBy} ${action} "${step.title}"`,
          timestamp: step.reviewedAt,
          user: step.reviewedBy,
          ip: '10.0.0.25',
          icon: step.status === 'approved' ? 'CheckCircle' : 'XCircle',
          color: step.status === 'approved' ? 'green' : 'red',
          stepId: step.id,
          notes: step.reviewNotes
        });
      }
    });

    // Status changes
    if (caseData.statusHistory) {
      caseData.statusHistory.forEach(statusChange => {
        events.push({
          id: `status-${statusChange.timestamp}`,
          type: 'status-change',
          title: 'Status Changed',
          description: `Case status changed from "${statusChange.from}" to "${statusChange.to}"`,
          timestamp: statusChange.timestamp,
          user: statusChange.changedBy,
          ip: statusChange.ip || '10.0.0.25',
          icon: 'RefreshCw',
          color: 'blue'
        });
      });
    }

    // Comments
    if (caseData.comments) {
      caseData.comments.forEach(comment => {
        events.push({
          id: `comment-${comment.id}`,
          type: 'comment',
          title: 'Comment Added',
          description: comment.isInternal ? 'Internal note added' : 'Comment added',
          timestamp: comment.createdAt,
          user: comment.author,
          ip: comment.ip || '10.0.0.25',
          icon: 'MessageSquare',
          color: comment.isInternal ? 'purple' : 'gray',
          content: comment.content
        });
      });
    }

    // Document uploads/downloads
    caseData.steps?.forEach((step, stepIndex) => {
      step.files?.forEach(file => {
        if (file.uploadedAt) {
          events.push({
            id: `file-${file.id}-uploaded`,
            type: 'file-uploaded',
            title: 'Document Uploaded',
            description: `"${file.name}" uploaded for Step ${stepIndex + 1}`,
            timestamp: file.uploadedAt,
            user: caseData.participantName || 'Participant',
            ip: '203.0.113.45',
            icon: 'Paperclip',
            color: 'blue',
            stepId: step.id,
            fileName: file.name
          });
        }
      });
    });

    // Sort by timestamp (newest first)
    return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const events = generateTimelineEvents();

  const getEventColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      gray: 'bg-gray-500'
    };
    return colors[color] || colors.gray;
  };

  const getEventIconColor = (color) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      purple: 'text-purple-600',
      gray: 'text-gray-600'
    };
    return colors[color] || colors.gray;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${date.toLocaleTimeString()} (${Math.floor(diffInHours)}h ago)`;
    } else if (diffInHours < 168) { // 7 days
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()} (${Math.floor(diffInHours / 24)}d ago)`;
    }
    
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const getLocationInfo = (ip) => {
    // Mock location data - in real app would do IP geolocation
    const locations = {
      '192.168.1.100': 'Internal System',
      '10.0.0.25': 'Office Network - Toronto, CA',
      '203.0.113.45': 'Remote - San Francisco, CA'
    };
    return locations[ip] || `External - ${ip}`;
  };

  if (!events.length) {
    return (
      <div className="text-center py-12">
        <Icon name="Clock" size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Timeline Events</h3>
        <p className="text-gray-500">Timeline events will appear here as the case progresses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Case Timeline</h3>
        <p className="text-sm text-gray-500 mt-1">
          Chronological history of all activities and changes
        </p>
      </div>

      <div className="flow-root">
        <ul className="-mb-8">
          {events.map((event, eventIndex) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIndex !== events.length - 1 && (
                  <span
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className={`h-10 w-10 rounded-full ${getEventColor(event.color)} flex items-center justify-center ring-8 ring-white`}>
                      <Icon name={event.icon} size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {event.title}
                            </h4>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800`}>
                              {event.type.replace('-', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {event.description}
                          </p>
                          
                          {/* Additional content for specific event types */}
                          {event.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Notes:</span> {event.notes}
                              </p>
                            </div>
                          )}
                          
                          {event.content && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-md">
                              <p className="text-sm text-gray-700">
                                {event.content.length > 150 
                                  ? `${event.content.substring(0, 150)}...` 
                                  : event.content}
                              </p>
                            </div>
                          )}

                          {event.fileName && (
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <Icon name="Paperclip" size={14} className="mr-1" />
                              {event.fileName}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Icon name="User" size={12} className="mr-1" />
                            {event.user}
                          </div>
                          <div className="flex items-center">
                            <Icon name="MapPin" size={12} className="mr-1" />
                            {getLocationInfo(event.ip)}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Icon name="Clock" size={12} className="mr-1" />
                          {formatTimestamp(event.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">
          All times shown in local timezone • IP addresses logged for security
        </p>
      </div>
    </div>
  );
};

export default TimelineTab;
