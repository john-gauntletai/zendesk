import { useState } from 'react';
import { useConversationStore, useCustomerStore, useMessageStore } from '../../../store';
import TimelineConversation from './TimelineConversation';

const Timeline = () => {
  const { conversations, selectedConversationId } = useConversationStore();
  const { customers } = useCustomerStore();
  const { messages } = useMessageStore();
  const [expandedConversations, setExpandedConversations] = useState<string[]>(
    selectedConversationId ? [selectedConversationId] : []
  );
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
    <div className="flex-grow p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">
        {selectedCustomer.full_name}
      </h2>

      <div className="space-y-4">
        {customerConversations.map(conversation => {
          const isExpanded = expandedConversations.includes(conversation.id);
          const conversationMessages = messages.filter(m => m.conversation_id === conversation.id)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

          return (
            <TimelineConversation
              key={conversation.id}
              conversation={conversation}
              messages={conversationMessages}
              isExpanded={isExpanded}
              isSelected={conversation.id === selectedConversationId}
              messageInput={messageInputs[conversation.id] || ''}
              onToggle={() => toggleConversation(conversation.id)}
              onMessageChange={(value) => setMessageInputs(prev => ({
                ...prev,
                [conversation.id]: value
              }))}
              onMessageSubmit={() => handleMessageSubmit(conversation.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
