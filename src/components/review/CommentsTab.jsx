import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTelemetry } from '../../hooks/useTelemetry.jsx';
import LoadingState from '../ui/LoadingState';

const CommentsTab = ({ caseId, stepId }) => {
  const { trackCustomEvent } = useTelemetry();
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [notificationPreview, setNotificationPreview] = useState(null);
  const textareaRef = useRef(null);
  const mentionsRef = useRef(null);

  useEffect(() => {
    if (caseId) {
      loadComments();
      trackCustomEvent('comments_viewed', { 
        case_id: caseId,
        step_id: stepId,
      });
    }
  }, [caseId, stepId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      // Mock comments data - replace with actual API call
      const mockComments = generateMockComments(caseId, stepId);
      setComments(mockComments);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockComments = (caseId, stepId) => {
    return [
      {
        id: '1',
        author: {
          id: 'user1',
          name: 'John Doe',
          role: 'Coordinator',
          avatar: '/avatars/john.jpg',
        },
        content: 'The business license document looks good, but we need the tax ID verification as well.',
        mentions: [],
        timestamp: '2024-12-20T14:30:00Z',
        edited: false,
        notifications: {
          slack: false,
          teams: false,
          email: true,
        },
      },
      {
        id: '2',
        author: {
          id: 'user2',
          name: 'Jane Smith',
          role: 'Reviewer',
          avatar: '/avatars/jane.jpg',
        },
        content: '@john.doe Can you follow up with the vendor on the missing tax documentation? @sarah.wilson should be CC\'d on this.',
        mentions: [
          { id: 'user1', name: 'John Doe', username: 'john.doe' },
          { id: 'user3', name: 'Sarah Wilson', username: 'sarah.wilson' },
        ],
        timestamp: '2024-12-20T15:45:00Z',
        edited: true,
        editedAt: '2024-12-20T15:50:00Z',
        notifications: {
          slack: true,
          teams: false,
          email: true,
        },
      },
      {
        id: '3',
        author: {
          id: 'user3',
          name: 'Sarah Wilson',
          role: 'Compliance Officer',
          avatar: '/avatars/sarah.jpg',
        },
        content: 'I\'ve reviewed the documents. The business license is valid but expires in 30 days. We should flag this for renewal tracking.',
        mentions: [],
        timestamp: '2024-12-21T09:15:00Z',
        edited: false,
        notifications: {
          slack: true,
          teams: true,
          email: false,
        },
      },
    ];
  };

  const getAvailableUsers = () => {
    return [
      { id: 'user1', name: 'John Doe', username: 'john.doe', role: 'Coordinator' },
      { id: 'user2', name: 'Jane Smith', username: 'jane.smith', role: 'Reviewer' },
      { id: 'user3', name: 'Sarah Wilson', username: 'sarah.wilson', role: 'Compliance Officer' },
      { id: 'user4', name: 'Mike Johnson', username: 'mike.johnson', role: 'Legal Team' },
      { id: 'user5', name: 'Lisa Chen', username: 'lisa.chen', role: 'Operations' },
    ];
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);

    // Check for @ mentions
    const mentionMatch = value.match(/@([a-zA-Z.]*)$/);
    if (mentionMatch) {
      const query = mentionMatch[1];
      setMentionQuery(query);
      
      const users = getAvailableUsers();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      
      setMentionSuggestions(filtered);
      setShowMentions(true);
      setSelectedMentionIndex(0);
    } else {
      setShowMentions(false);
      setMentionSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (showMentions && mentionSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => 
          prev < mentionSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => 
          prev > 0 ? prev - 1 : mentionSuggestions.length - 1
        );
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        selectMention(mentionSuggestions[selectedMentionIndex]);
      } else if (e.key === 'Escape') {
        setShowMentions(false);
      }
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const selectMention = (user) => {
    const mentionMatch = newComment.match(/@([a-zA-Z.]*)$/);
    if (mentionMatch) {
      const beforeMention = newComment.substring(0, mentionMatch.index);
      setNewComment(`${beforeMention}@${user.username} `);
    }
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const extractMentions = (text) => {
    const mentionRegex = /@([a-zA-Z.]+)/g;
    const matches = [...text.matchAll(mentionRegex)];
    const users = getAvailableUsers();
    
    return matches.map(match => {
      const username = match[1];
      const user = users.find(u => u.username === username);
      return user ? { id: user.id, name: user.name, username: user.username } : null;
    }).filter(Boolean);
  };

  const generateNotificationPreview = (comment, mentions) => {
    if (mentions.length === 0) return null;

    return {
      slack: {
        enabled: true,
        preview: `💬 New comment in Case #${caseId}: "${comment.substring(0, 100)}${comment.length > 100 ? '...' : ''}"`,
        channels: ['#legal-review', '#vendor-onboarding'],
        mentions: mentions.map(m => `@${m.username}`),
      },
      teams: {
        enabled: false,
        preview: `📝 Comment added to case review`,
        channel: 'Legal Reviews',
        mentions: mentions.map(m => `@${m.name}`),
      },
      email: {
        enabled: true,
        subject: `Case #${caseId} - New Comment`,
        recipients: mentions.map(m => `${m.name} <${m.username}@company.com>`),
        preview: `A new comment has been added to Case #${caseId}...`,
      },
    };
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const mentions = extractMentions(newComment);
      const preview = generateNotificationPreview(newComment, mentions);
      
      // Show notification preview if there are mentions
      if (mentions.length > 0) {
        setNotificationPreview(preview);
        // In real app, this would be a modal confirmation
        const confirmed = window.confirm(
          `This comment mentions ${mentions.length} users. Notifications will be sent via:\n` +
          `• Email: ${preview.email.recipients.join(', ')}\n` +
          `• Slack: ${preview.slack.channels.join(', ')}\n\n` +
          `Continue?`
        );
        if (!confirmed) {
          setSubmitting(false);
          return;
        }
      }

      // Mock API call to save comment
      const newCommentObj = {
        id: Date.now().toString(),
        author: {
          id: 'current_user',
          name: 'Current User',
          role: 'Coordinator',
          avatar: '/avatars/current.jpg',
        },
        content: newComment,
        mentions,
        timestamp: new Date().toISOString(),
        edited: false,
        notifications: {
          slack: preview?.slack.enabled || false,
          teams: preview?.teams.enabled || false,
          email: preview?.email.enabled || false,
        },
      };

      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
      setNotificationPreview(null);

      trackCustomEvent('comment_added', {
        case_id: caseId,
        step_id: stepId,
        mention_count: mentions.length,
        has_slack_notification: preview?.slack.enabled || false,
        has_teams_notification: preview?.teams.enabled || false,
        has_email_notification: preview?.email.enabled || false,
      });

    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderCommentContent = (content, mentions) => {
    if (!mentions || mentions.length === 0) {
      return content;
    }

    let rendered = content;
    mentions.forEach(mention => {
      const mentionRegex = new RegExp(`@${mention.username}\\b`, 'g');
      rendered = rendered.replace(
        mentionRegex,
        `<span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">@${mention.username}</span>`
      );
    });

    return <div dangerouslySetInnerHTML={{ __html: rendered }} />;
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'coordinator': return 'bg-blue-100 text-blue-800';
      case 'reviewer': return 'bg-purple-100 text-purple-800';
      case 'compliance officer': return 'bg-green-100 text-green-800';
      case 'legal team': return 'bg-red-100 text-red-800';
      case 'operations': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingState message="Loading comments..." />;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Comments & Discussion</h2>
        <p className="text-sm text-gray-500 mt-1">
          Use @username to mention team members and send notifications
        </p>
      </div>

      {/* New Comment Form */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={handleCommentChange}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment... Use @username to mention someone"
            className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          
          {/* Mention Suggestions */}
          {showMentions && mentionSuggestions.length > 0 && (
            <div 
              ref={mentionsRef}
              className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto"
            >
              {mentionSuggestions.map((user, index) => (
                <button
                  key={user.id}
                  onClick={() => selectMention(user)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                    index === selectedMentionIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">@{user.username}</div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-gray-500">
            Tip: Use Cmd+Enter (Mac) or Ctrl+Enter (Windows) to submit
          </div>
          <button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || submitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </>
            ) : (
              'Post Comment'
            )}
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="px-6 py-4 space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No comments yet</p>
            <p className="text-sm">Start the discussion by adding the first comment</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {comment.author.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.author.name}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(comment.author.role)}`}>
                    {comment.author.role}
                  </span>
                  <time className="text-xs text-gray-500">
                    {new Date(comment.timestamp).toLocaleString()}
                  </time>
                  {comment.edited && (
                    <span className="text-xs text-gray-400">(edited)</span>
                  )}
                </div>
                <div className="mt-1 text-sm text-gray-700">
                  {renderCommentContent(comment.content, comment.mentions)}
                </div>
                
                {/* Notification Indicators */}
                {(comment.notifications.slack || comment.notifications.teams || comment.notifications.email) && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Notifications sent:</span>
                    {comment.notifications.slack && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        📢 Slack
                      </span>
                    )}
                    {comment.notifications.teams && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        💬 Teams
                      </span>
                    )}
                    {comment.notifications.email && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        ✉️ Email
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsTab;
