import { Message, Customer, Conversation } from "../../types";
import { EnvelopeIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import { format, isWithinInterval, subDays, subHours } from "date-fns";
import Avvvatars from "avvvatars-react";

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
      case "email":
        return <EnvelopeIcon className="w-4 h-4 text-blue-500" />;
      case "chat":
        return <ChatBubbleLeftIcon className="w-4 h-4 text-green-500" />;
      default:
        return <ChatBubbleLeftIcon className="w-4 h-4 text-green-500" />;
    }
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();

    if (isWithinInterval(date, { start: subHours(now, 24), end: now })) {
      const hours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      );
      return `${hours}h`;
    }

    if (isWithinInterval(date, { start: subDays(now, 30), end: now })) {
      const days = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );
      return `${days}d`;
    }

    return format(date, "MMM d");
  };

  const getPreviewText = (message: Message | undefined) => {
    if (!message?.content) return "No messages";
    return message.content.length > 100
      ? message.content.substring(0, 100) + "..."
      : message.content;
  };

  return (
    <div
      onClick={onClick}
      className={`w-80 bg-base-100 rounded-lg p-3 shadow-sm hover:shadow cursor-pointer ${
        isSelected ? "border-2 border-primary" : "border-2 border-base-300"
      }`}
    >
      <div className="flex">
        {/* Avatar Column with Channel Icon Overlay */}
        <div className="flex-shrink-0 w-8 flex items-center justify-center">
          <div className="relative">
            <Avvvatars value={customer?.full_name || "Unknown"} size={32}/>
            <div className="absolute -bottom-1 -right-1">
              {getChannelIcon(conversation.channel)}
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0 ml-3">
          {/* Customer Name and Subject Line */}
          <div className="text-sm font-bold">
            {customer?.full_name || "Unknown Customer"}
          </div>

          <div className="text-sm">
            {conversation.title || "No subject"}
          </div>

          {/* Last Message and Timestamp */}
          <div className="flex items-start justify-between">
            <div className="text-sm text-base-content/60 line-clamp-1 flex-1">
              {getPreviewText(lastMessage)}
            </div>
            <div className="text-[13px] text-base-content/50 ml-4 whitespace-nowrap">
              {formatLastUpdated(new Date(conversation.created_at))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
