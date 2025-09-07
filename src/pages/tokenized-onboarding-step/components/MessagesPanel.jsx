import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

const MessagesPanel = ({ selectedRequirement, onSelectRequirement }) => {
  const [messageText, setMessageText] = useState('');
  const [messages] = useState([
    {
      id: 1,
      text: 'Document received and under review',
      timestamp: '2025-08-20T10:30:00Z',
      sender: 'system',
      requirementId: 'req_1'
    },
    {
      id: 2,
      text: 'Please ensure the photo is clearer',
      timestamp: '2025-08-20T11:15:00Z',
      sender: 'reviewer',
      requirementId: 'req_1'
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    // Handle message sending
    console.log('Sending message:', messageText);
    setMessageText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Allow new line with Shift+Enter
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const filteredMessages = selectedRequirement 
    ? messages.filter(m => m.requirementId === selectedRequirement.id)
    : messages;

  return (
    <div className="fixed right-0 top-0 h-full w-[360px] bg-[#FBFCFE] border-l border-[#ECEFF3] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#ECEFF3] bg-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Messages</h3>
          {selectedRequirement && (
            <button
              onClick={() => onSelectRequirement(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {selectedRequirement && (
          <p className="text-sm text-[#718096] mt-1">
            {selectedRequirement.title}
          </p>
        )}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-[#718096]">No messages yet</p>
            <p className="text-xs text-[#718096] mt-2">
              Messages about your documents will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg max-w-[280px] ${
                  message.sender === 'system' || message.sender === 'reviewer'
                    ? 'bg-white border border-[#ECEFF3] mr-auto'
                    : 'bg-blue-600 text-white ml-auto'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'system' || message.sender === 'reviewer'
                    ? 'text-[#718096]'
                    : 'text-blue-100'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Composer */}
      <div className="p-4 border-t border-[#ECEFF3] bg-white">
        <form onSubmit={handleSendMessage} className="space-y-2">
          <div className="relative">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write message here..."
              className="w-full px-3 py-2 border border-[#ECEFF3] rounded-md text-sm placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="absolute bottom-2 right-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#718096]">
            Press Shift + Enter for a new line
          </p>
        </form>
      </div>
    </div>
  );
};

export default MessagesPanel;
