import { Message, Customer, Conversation } from "../../types";
import { EnvelopeIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import { format, isWithinInterval, subDays, subHours } from "date-fns";
import Avatar from "../__shared/Avatar";
import TagList from "../TagList";
import ConversationStatusBadge from "../ConversationStatusBadge";

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
  console.log(conversation.tags);
  return (
    <div
      onClick={onClick}
      className={`w-80 bg-base-100 rounded-lg p-3 shadow-sm hover:shadow cursor-pointer ${
        isSelected ? "border-2 border-primary" : "border-2 border-base-300"
      }`}
    >
      <div className="flex gap-3">
        {/* Column 1: Avatar with Channel Icon */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="relative">
            <Avatar user={customer} size={32} />
            <div className="absolute -bottom-1 -right-1">
              {getChannelIcon(conversation.channel)}
            </div>
          </div>
        </div>

        {/* Column 2: Customer Info and Message */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold">
            {customer?.full_name || "Unknown Customer"}
          </div>

          <div className="text-sm">
            {conversation.subject || "No subject"}
          </div>

          <div className="text-sm text-base-content/60 line-clamp-1">
            {getPreviewText(lastMessage)}
          </div>
        </div>

        {/* Column 3: Status and Timestamp */}
        <div className="flex-shrink-0 flex flex-col justify-between items-end">
          <ConversationStatusBadge conversation={conversation} />
          <div className="text-[13px] text-base-content/50 whitespace-nowrap">
            {formatLastUpdated(new Date(conversation.created_at))}
          </div>
        </div>
      </div>
      <div className="mt-2">
        <TagList conversation={conversation} />
      </div>
    </div>
  );
};

export default ConversationCard;
