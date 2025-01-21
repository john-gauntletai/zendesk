import { Conversation } from '../../types';
import { 
  ChatBubbleLeftIcon, 
  EnvelopeIcon 
} from "@heroicons/react/24/solid";
import { useMessageStore } from '../../store';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  isCustomerSelected: boolean;
}

const ConversationList = ({ 
  conversations, 
  selectedConversationId, 
  onSelectConversation,
  isCustomerSelected 
}: ConversationListProps) => {
  const { messages } = useMessageStore();

  const getConversationMessages = (conversationId: string) => {
    const conversationMessages = messages.filter(m => m.conversation_id === conversationId);
    const sortedMessages = [...conversationMessages].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    return {
      firstMessage: sortedMessages[0]?.content || 'No messages',
      lastMessage: sortedMessages[sortedMessages.length - 1]?.content || 'No messages'
    };
  };

  const groupedConversations = conversations.reduce((acc, conversation) => {
    const status = conversation.status || 'new';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(conversation);
    return acc;
  }, {} as Record<string, Conversation[]>);

  const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
    const { firstMessage, lastMessage } = getConversationMessages(conversation.id);
    return (
      <button
        key={conversation.id}
        onClick={() => onSelectConversation(conversation.id)}
        className={`w-full px-3 py-2 text-left rounded-lg text-sm transition-colors ${
          selectedConversationId === conversation.id 
            ? "bg-base-200" 
            : "hover:bg-base-200/50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {conversation.channel === 'email' ? (
              <EnvelopeIcon className="w-4 h-4 text-primary" />
            ) : (
              <ChatBubbleLeftIcon className="w-4 h-4 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">
              {firstMessage}
            </div>
            <div className="text-xs text-base-content/70 truncate">
              {lastMessage}
            </div>
          </div>
        </div>
      </button>
    );
  };

  const ConversationSection = ({ title, conversations }: { title: string, conversations: Conversation[] }) => {
    
    return (
      <div>
        <div className="px-4 py-2 text-sm font-semibold text-base-content/70 bg-base-200/50">
          {title} ({conversations?.length || 0})
        </div>
        <div className="space-y-1 p-2">
          {conversations?.map(conversation => (
            <ConversationItem key={conversation.id} conversation={conversation} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-72 border-r border-base-200 flex flex-col bg-base-100 mr-1 rounded-tr-box rounded-br-box">
      <div className="p-4 border-b border-base-200">
        <h2 className="text-lg font-bold">Conversations</h2>
      </div>
      <div className="overflow-y-auto flex-1">
        {isCustomerSelected ? (
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <ConversationSection title="New" conversations={groupedConversations['new']} />
              <ConversationSection title="Open" conversations={groupedConversations['open']} />
            </div>
            <div className="border-t border-base-200">
              <ConversationSection title="Closed" conversations={groupedConversations['closed']} />
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-base-content/70">
            Select a customer to view conversations
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList; 