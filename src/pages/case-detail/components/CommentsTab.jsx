import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CommentsTab = ({ caseData, onAddComment }) => {
  const [comment, setComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);

  // Mock team members for @mentions
  const teamMembers = [
    { id: 'john-doe', name: 'John Doe', role: 'Senior Coordinator', avatar: 'JD' },
    { id: 'jane-smith', name: 'Jane Smith', role: 'Compliance Manager', avatar: 'JS' },
    { id: 'mike-wilson', name: 'Mike Wilson', role: 'Team Lead', avatar: 'MW' },
    { id: 'sarah-johnson', name: 'Sarah Johnson', role: 'Quality Assurance', avatar: 'SJ' },
    { id: 'david-brown', name: 'David Brown', role: 'Legal Advisor', avatar: 'DB' }
  ];

  const comments = caseData.comments || [
    {
      id: 1,
      author: 'Jane Smith',
      content: 'Initial documents look good. Need clarification on item 3 in the compliance checklist.',
      createdAt: '2024-01-15T10:30:00Z',
      isInternal: false,
      mentions: [],
      slackThread: null
    },
    {
      id: 2,
      author: 'John Doe',
      content: '@mike-wilson Can you review the KYC documentation? The format seems non-standard.',
      createdAt: '2024-01-15T14:20:00Z',
      isInternal: true,
      mentions: ['mike-wilson'],
      slackThread: 'T1234567/C1234567/p1705329600123456'
    },
    {
      id: 3,
      author: 'Mike Wilson',
      content: '@john-doe Reviewed the docs. Format is acceptable but we should request additional verification for the address proof.',
      createdAt: '2024-01-15T16:45:00Z',
      isInternal: true,
      mentions: ['john-doe'],
      slackThread: 'T1234567/C1234567/p1705337100123456'
    }
  ];

  useEffect(() => {
    // Handle @ mention detection
    const handleKeyUp = (e) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const text = textarea.value;
      const position = textarea.selectionStart;
      
      // Find @ symbol before cursor
      const beforeCursor = text.substring(0, position);
      const atIndex = beforeCursor.lastIndexOf('@');
      
      if (atIndex !== -1 && atIndex === beforeCursor.length - 1) {
        // Just typed @
        setShowMentions(true);
        setMentionQuery('');
        setCursorPosition(position);
      } else if (atIndex !== -1) {
        // Check if we're in a mention
        const afterAt = beforeCursor.substring(atIndex + 1);
        if (afterAt.length > 0 && !afterAt.includes(' ')) {
          setShowMentions(true);
          setMentionQuery(afterAt);
          setCursorPosition(position);
        } else {
          setShowMentions(false);
        }
      } else {
        setShowMentions(false);
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keyup', handleKeyUp);
      return () => textarea.removeEventListener('keyup', handleKeyUp);
    }
  }, []);

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const insertMention = (member) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = textarea.value;
    const beforeCursor = text.substring(0, cursorPosition);
    const afterCursor = text.substring(cursorPosition);
    
    // Find the @ symbol position
    const atIndex = beforeCursor.lastIndexOf('@');
    const beforeAt = text.substring(0, atIndex);
    const mention = `@${member.name}`;
    const newText = beforeAt + mention + ' ' + afterCursor;
    
    setComment(newText);
    setShowMentions(false);
    
    // Focus and set cursor position
    setTimeout(() => {
      const newPosition = beforeAt.length + mention.length + 1;
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      // Extract mentions from comment
      const mentions = [];
      const mentionRegex = /@([A-Za-z\s]+)/g;
      let match;
      while ((match = mentionRegex.exec(comment)) !== null) {
        const memberName = match[1].trim();
        const member = teamMembers.find(m => m.name === memberName);
        if (member) {
          mentions.push(member.id);
        }
      }

      const newComment = {
        id: Date.now(),
        author: 'Current User', // In real app, get from auth
        content: comment,
        createdAt: new Date().toISOString(),
        isInternal,
        mentions
      };

      await onAddComment(newComment);
      setComment('');
      setIsInternal(false);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);
    
    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    }
    return date.toLocaleDateString();
  };

  const renderCommentContent = (content, mentions) => {
    if (!mentions || mentions.length === 0) {
      return content;
    }

    let processedContent = content;
    mentions.forEach(mentionId => {
      const member = teamMembers.find(m => m.id === mentionId);
      if (member) {
        const mentionRegex = new RegExp(`@${member.name}`, 'g');
        processedContent = processedContent.replace(
          mentionRegex,
          `<span class="bg-blue-100 text-blue-800 px-1 rounded font-medium">@${member.name}</span>`
        );
      }
    });

    return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Comments & Notes</h3>
        <p className="text-sm text-gray-500 mt-1">
          Internal team discussions and participant communications
        </p>
      </div>

      {/* Add Comment Form */}
      <div className="bg-gray-50 rounded-lg p-4">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment... Use @name to mention team members"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            
            {/* Mentions Dropdown */}
            {showMentions && filteredMembers.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                {filteredMembers.map(member => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => insertMention(member)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Internal note</span>
              </label>
              
              {isInternal && (
                <div className="flex items-center text-xs text-gray-500">
                  <Icon name="Lock" size={12} className="mr-1" />
                  Only visible to team members
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={!comment.trim() || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : (
                'Post Comment'
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="MessageSquare" size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Comments Yet</h3>
            <p className="text-gray-500">Start the conversation with your first comment.</p>
          </div>
        ) : (
          comments.map(comment => (
            <div
              key={comment.id}
              className={`border rounded-lg p-4 ${
                comment.isInternal ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {comment.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {comment.author}
                      </span>
                      {comment.isInternal && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          <Icon name="Lock" size={10} className="mr-1" />
                          Internal
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(comment.createdAt)}
                    </span>
                  </div>
                </div>

                {comment.slackThread && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://slack.com/app_redirect?thread=${comment.slackThread}`, '_blank')}
                      className="text-xs"
                    >
                      <Icon name="MessageSquare" size={12} className="mr-1" />
                      View in Slack
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-3 text-sm text-gray-700">
                {renderCommentContent(comment.content, comment.mentions)}
              </div>

              {comment.mentions && comment.mentions.length > 0 && (
                <div className="mt-3 flex items-center space-x-2">
                  <Icon name="AtSign" size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Mentioned: {comment.mentions.map(id => {
                      const member = teamMembers.find(m => m.id === id);
                      return member ? member.name : id;
                    }).join(', ')}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Integration Status */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Slack Integration Active
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              Teams Notifications Enabled
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Icon name="Settings" size={12} className="mr-1" />
            Configure
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentsTab;
