import { useEffect } from "react";
import supabase from "../../supabase";
import { useCustomerStore, useConversationStore, useMessageStore } from "../../store";
import CustomerList from './CustomerList';
import ConversationList from './ConversationList';
import MessagesPanel from './MessagesPanel';
import InsightsPanel from './InsightsPanel';
import { Conversation, Message } from "../../types";

const Inbox = () => {
  const { customers, selectedCustomerId, setSelectedCustomerId } = useCustomerStore();
  const { 
    conversations, 
    selectedConversationId, 
    setSelectedConversationId, 
    addConversation 
  } = useConversationStore();
  const { messages, fetchMessagesByConversationId, addMessage } = useMessageStore();

  useEffect(() => {
    if (selectedCustomerId) {
      const customerConversations = conversations.filter(
        (conversation) => conversation.customer_id === selectedCustomerId
      );
      
      customerConversations.forEach((conversation) => {
        fetchMessagesByConversationId(conversation.id);
      });

      // Subscribe to new conversations for this customer
      const conversationsSubscription = supabase
        .channel('conversations')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'conversations',
            filter: `customer_id=eq.${selectedCustomerId}`
          },
          (payload) => {
            const newConversation = payload.new as Conversation;
            addConversation(newConversation);
          }
        )
        .subscribe();

      // Subscribe to new messages in this customer's conversations
      const messagesSubscription = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT', 
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=in.(${customerConversations.map(c => c.id).join(',')})`
          },
          (payload) => {
            const newMessage = payload.new as Message;
            addMessage(newMessage);
          }
        )
        .subscribe();

      return () => {
        conversationsSubscription.unsubscribe();
        messagesSubscription.unsubscribe();
      };
    }
  }, [selectedCustomerId]);

  const handleClickCustomer = async (customerId: string) => {
    setSelectedConversationId(null);
    setSelectedCustomerId(customerId);
  }

  const handleClickConversation = async (conversationId: string) => {
    setSelectedConversationId(conversationId);
  }

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || null;
  const customerConversations = conversations.filter(
    (conversation) => conversation.customer_id === selectedCustomerId
  );
  const selectedConversation = conversations.find(conversation => conversation.id === selectedConversationId);
  const conversationMessages = messages.filter(
    (message) => message.conversation_id === selectedConversationId
  );

  return (
    <div className="flex h-screen py-2 pr-2">
      <CustomerList 
        customers={customers}
        selectedCustomerId={selectedCustomerId}
        onSelectCustomer={handleClickCustomer}
      />

      <ConversationList 
        conversations={customerConversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleClickConversation}
        isCustomerSelected={!!selectedCustomerId}
      />

      <MessagesPanel 
        messages={conversationMessages}
        selectedConversation={selectedConversation}
      />

      <InsightsPanel 
        selectedCustomer={selectedCustomer}
        selectedConversation={selectedConversation}
      />
    </div>
  );
};

export default Inbox;
