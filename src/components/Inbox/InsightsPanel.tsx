import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { Customer, Conversation } from '../../types';
import classNames from 'classnames';
import { useState } from 'react';

interface InsightsPanelProps {
  selectedCustomer: Customer | null;
  selectedConversation: Conversation | null;
  onClose: () => void;
}

const InsightsPanel = ({ selectedCustomer, selectedConversation, onClose }: InsightsPanelProps) => {
  const [activeTab, setActiveTab] = useState('details');
  const [aiMessage, setAiMessage] = useState('');
  const [aiChat, setAiChat] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you with customer service today?' }
  ]);

  const handleSendAiMessage = () => {
    if (!aiMessage.trim()) return;
    
    // Add user message
    setAiChat(prev => [...prev, { role: 'user', content: aiMessage.trim() }]);
    
    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      setAiChat(prev => [...prev, { 
        role: 'assistant', 
        content: "I understand your question. Let me help you with that..." 
      }]);
    }, 1000);
    
    setAiMessage('');
  };

  const renderDetailsTab = () => (
    <div className="p-4 space-y-6">
      {/* Customer Info Section */}
      <div className="bg-base-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-base-content/70 mb-3">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-base-content/50">Full Name</label>
            <p className="font-medium">{selectedCustomer?.full_name}</p>
          </div>
          <div>
            <label className="text-xs text-base-content/50">Email</label>
            <p className="font-medium">{selectedCustomer?.email}</p>
          </div>
          <div>
            <label className="text-xs text-base-content/50">Customer Since</label>
            <p className="font-medium">
              {new Date(selectedCustomer?.created_at || '').toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-xs text-base-content/50">Total Conversations</label>
            <p className="font-medium">{selectedCustomer?.conversations?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Current Conversation */}
      {selectedConversation && (
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-base-content/70 mb-3">Current Conversation</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Case #{selectedConversation.id.slice(-4)}</span>
              <span className={classNames(
                "badge badge-sm",
                {
                  'badge-info': selectedConversation.status === 'new',
                  'badge-success': selectedConversation.status === 'open',
                  'badge-neutral': selectedConversation.status === 'closed'
                }
              )}>
                {selectedConversation.status}
              </span>
            </div>
            <div>
              <label className="text-xs text-base-content/50">Started</label>
              <p className="text-sm">
                {new Date(selectedConversation.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Activity Summary */}
      <div className="bg-base-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-base-content/70 mb-3">Activity Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Average Response Time</span>
            <span className="font-medium">~2.5 minutes</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Satisfaction Score</span>
            <span className="font-medium">4.8/5.0</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Common Topics</span>
            <span className="font-medium">Support, Billing</span>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="bg-base-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-base-content/70 mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-primary">VIP Customer</span>
          <span className="badge">Premium Plan</span>
          <span className="badge">Quick Response</span>
        </div>
      </div>
    </div>
  );

  const renderAiCopilotTab = () => (
    <div className="flex flex-col h-full bg-base-200/30">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {aiChat.map((message, index) => (
            <div
              key={index}
              className={classNames(
                'chat',
                message.role === 'user' ? 'chat-end' : 'chat-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="chat-header opacity-75 text-xs mb-1">
                  AI Copilot
                </div>
              )}
              <div className={classNames(
                'chat-bubble max-w-[80%]',
                message.role === 'user' 
                  ? 'chat-bubble-primary' 
                  : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg border border-white/10'
              )}>
                {message.content}
              </div>
              {message.role === 'user' && (
                <div className="chat-header opacity-75 text-xs mb-1 text-right">
                  You
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-base-100 border-t border-base-200 shadow-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={aiMessage}
            onChange={(e) => setAiMessage(e.target.value)}
            placeholder="Ask me anything about customer service..."
            className="input input-bordered flex-1 bg-base-200/50 border-base-300"
            onKeyPress={(e) => e.key === 'Enter' && handleSendAiMessage()}
          />
          <button 
            className={classNames(
              "btn btn-circle bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 border-none",
              !aiMessage.trim() && "opacity-50"
            )}
            onClick={handleSendAiMessage}
            disabled={!aiMessage.trim()}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-base-content/50 mt-2 text-center">
          AI Copilot helps you provide better customer service
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col border-l border-base-200 bg-base-100 rounded-box ml-1 min-w-72 max-w-md">
      <div className="flex items-center justify-between p-4 border-b border-base-200">
        <div role="tablist" className="tabs tabs-boxed">
          <a
            role="tab"
            className={classNames("tab", activeTab === 'details' && "tab-active")}
            onClick={() => setActiveTab('details')}
          >
            Details
          </a>
          <a
            role="tab"
            className={classNames("tab", activeTab === 'ai' && "tab-active")}
            onClick={() => setActiveTab('ai')}
          >
            AI Copilot
          </a>
        </div>
        <button 
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-square"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'details' ? renderDetailsTab() : renderAiCopilotTab()}
      </div>
    </div>
  );
};

export default InsightsPanel; 