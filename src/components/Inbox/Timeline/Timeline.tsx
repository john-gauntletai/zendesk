import { useState } from 'react';
import { useConversationStore, useCustomerStore, useMessageStore } from '../../../store';
import { format } from 'date-fns';
import { EnvelopeIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

const Timeline = () => {
  const { conversations, selectedConversationId } = useConversationStore();
  const { customers } = useCustomerStore();
  const { messages } = useMessageStore();
  const [expandedConversations, setExpandedConversations] = useState<string[]>([selectedConversationId]);
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>({});

  // Get the selected conversation and its customer
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const selectedCustomer = selectedConversation 
    ? customers.find(c => c.id === selectedConversation.customer_id)
    : null;

  // Get all conversations for this customer
  const customerConversations = conversations.filter(
    c => c.customer_id === selectedConversation?.customer_id
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const getChannelIcon = (channel: string) => {
    switch (channel?.toLowerCase()) {
      case 'email':
        return <EnvelopeIcon className="w-4 h-4 text-blue-500" />;
      case 'chat':
        return <ChatBubbleLeftIcon className="w-4 h-4 text-green-500" />;
      default:
        return <ChatBubbleLeftIcon className="w-4 h-4 text-green-500" />;
    }
  };

  const toggleConversation = (conversationId: string) => {
    setExpandedConversations(prev => 
      prev.includes(conversationId)
        ? prev.filter(id => id !== conversationId)
        : [...prev, conversationId]
    );
  };

  const handleMessageSubmit = (conversationId: string) => {
    // TODO: Implement message submission
    console.log('Sending message:', messageInputs[conversationId]);
    setMessageInputs(prev => ({ ...prev, [conversationId]: '' }));
  };

  if (!selectedConversationId || !selectedCustomer) return null;

  return (
    <div className="w-96 border-l border-base-300 bg-base-100 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">
        History with {selectedCustomer.full_name}
      </h2>

      <div className="space-y-4">
        {customerConversations.map(conversation => {
          const isExpanded = expandedConversations.includes(conversation.id);
          const conversationMessages = messages.filter(m => m.conversation_id === conversation.id)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

          return (
            <div
              key={conversation.id}
              className={`border rounded-lg transition-all ${
                conversation.id === selectedConversationId
                  ? 'border-primary'
                  : 'border-base-300'
              }`}
            >
              {/* Conversation Header */}
              <div
                className={`p-3 cursor-pointer ${isExpanded ? 'border-b border-base-300' : ''}`}
                onClick={() => toggleConversation(conversation.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(conversation.channel)}
                    <span className="font-medium">{conversation.title || 'No subject'}</span>
                  </div>
                  <span className="text-xs text-base-content/60">
                    {format(new Date(conversation.created_at), 'MMM d')}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    conversation.status === 'open'
                      ? 'bg-success/20 text-success'
                      : 'bg-base-300 text-base-content/60'
                  }`}>
                    {conversation.status}
                  </span>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-3 space-y-3">
                  {/* Messages */}
                  <div className="space-y-2">
                    {conversationMessages.map(message => (
                      <div key={message.id} className="text-sm">
                        <div className="font-medium">{message.from}</div>
                        <div className="text-base-content/70">{message.content}</div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={messageInputs[conversation.id] || ''}
                      onChange={e => setMessageInputs(prev => ({
                        ...prev,
                        [conversation.id]: e.target.value
                      }))}
                      placeholder="Type your message..."
                      className="input input-bordered input-sm flex-1"
                    />
                    <button
                      onClick={() => handleMessageSubmit(conversation.id)}
                      className="btn btn-primary btn-sm"
                    >
                      <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
