import { Message } from "../../../types";
import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";
import Avatar from "../../__shared/Avatar";
import { useCustomerStore, useUserStore } from "../../../store";

interface MessageListProps {
  messages: Message[];
  channel: string;
}

const MessageList = ({ messages, channel }: MessageListProps) => {
  const { customers } = useCustomerStore();
  const { users } = useUserStore();
  const getChannelColor = (channel: string) => {
    switch (channel?.toLowerCase()) {
      case "email":
        return "bg-blue-500 text-blue-50";
      case "chat":
        return "bg-green-500 text-green-50";
      default:
        return "bg-green-500 text-green-50";
    }
  };

  const shouldShowTimestamp = (
    message: Message,
    nextMessage: Message | undefined
  ) => {
    if (!nextMessage) return true; // Last message
    if (message.sender_id !== nextMessage.sender_id) return true; // Different sender

    // More than 5 minutes apart
    const timeDiff = differenceInMinutes(
      new Date(nextMessage.created_at),
      new Date(message.created_at)
    );
    return timeDiff > 5;
  };

  const formatMessageDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  const groupedMessages = messages.reduce(
    (groups: Record<string, Message[]>, message) => {
      const date = format(new Date(message.created_at), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {}
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <div className="min-h-full">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-base-300"></div>
              <div className="mx-4 text-xs font-medium text-base-content/60">
                {formatMessageDate(new Date(date))}
              </div>
              <div className="flex-1 border-t border-base-300"></div>
            </div>

            <div>
              {dateMessages.map((message, index) => {
                const nextMessage = dateMessages[index + 1];
                const showTimestamp = shouldShowTimestamp(message, nextMessage);
                const sender = message.sender_type === "customer" ? customers.find((c) => c.id === message.sender_id) : users.find((u) => u.id === message.sender_id);

                return (
                  <div
                    key={message.id}
                    className={`chat ${
                      message.sender_type === "customer"
                        ? "chat-start"
                        : "chat-end"
                    }`}
                  >
                    <div
                      className={`chat-image ${
                        message.sender_type === "customer" ? "mr-2" : "ml-2"
                      }`}
                    >
                      <Avatar 
                        user={sender} 
                        size={28}
                      />
                    </div>
                    <div
                      className={`chat-bubble ${
                        message.sender_type === "customer"
                          ? getChannelColor(channel)
                          : "chat-bubble-base-200"
                      }`}
                    >
                      {message.content}
                    </div>
                    {showTimestamp && (
                      <div className="chat-footer mt-1 mb-3">
                        <time className="text-xs text-base-content/50">
                          Sent at {format(new Date(message.created_at), "h:mm a")}
                        </time>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
