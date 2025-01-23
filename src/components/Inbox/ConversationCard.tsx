import { Message, Customer, Conversation } from "../../types";
import { EnvelopeIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import { format, isWithinInterval, subDays, subHours } from "date-fns";

interface ConversationCardProps {
  conversation: Conversation;
  customer: Customer | undefined;
  lastMessage: Message | undefined;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationCard = ({
  conversation,
  customer,
  lastMessage,
  isSelected,
  onClick,
}: ConversationCardProps) => {
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

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    
    if (isWithinInterval(date, { start: subHours(now, 24), end: now })) {
      const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      return `${hours}h`;
    }
    
    if (isWithinInterval(date, { start: subDays(now, 30), end: now })) {
      const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      return `${days}d`;
    }
    
    return format(date, "MMM d");
  };

  const getPreviewText = (message: Message | undefined) => {
    if (!message?.content) return 'No messages';
    return message.content.length > 100 
      ? message.content.substring(0, 100) + '...'
      : message.content;
  };

  return (
    <div
      onClick={onClick}
      className={`w-80 rounded-lg p-3 shadow-sm hover:shadow cursor-pointer ${
        isSelected 
          ? 'bg-primary text-primary-content' 
          : 'bg-base-100'
      }`}
    >
      <div className="flex">
        {/* Icon Column */}
        <div className="flex-shrink-0 w-6 flex items-center justify-center">
          {getChannelIcon(conversation.channel)}
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0 ml-3">
          {/* Customer Name and Subject Line */}
          <div className={`text-sm font-bold ${
            isSelected ? 'text-primary-content' : ''
          }`}>
            {customer?.full_name || 'Unknown Customer'}
          </div>

          <div className={`text-sm mt-1 ${
            isSelected ? 'text-primary-content' : ''
          }`}>
            {conversation.title || 'No subject'}
          </div>

          {/* Last Message and Timestamp */}
          <div className="flex items-start justify-between mt-1">
            <div className={`text-sm line-clamp-1 flex-1 ${
              isSelected ? 'text-primary-content/90' : 'text-base-content/60'
            }`}>
              {getPreviewText(lastMessage)}
            </div>
            <div className={`text-[13px] ml-4 whitespace-nowrap ${
              isSelected ? 'text-primary-content/80' : 'text-base-content/50'
            }`}>
              {formatLastUpdated(new Date(conversation.created_at))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard; 