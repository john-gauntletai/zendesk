import { Message, Conversation } from "../../../types";
import { format, formatDistanceToNow } from 'date-fns';
import { EnvelopeIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Avvvatars from "avvvatars-react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface TimelineConversationProps {
  conversation: Conversation;
  messages: Message[];
  isExpanded: boolean;
  isSelected: boolean;
  messageInput: string;
  onToggle: () => void;
  onMessageChange: (value: string) => void;
  onMessageSubmit: () => void;
}

const TimelineConversation = ({
  conversation,
  messages,
  isExpanded,
  isSelected,
  messageInput,
  onToggle,
  onMessageChange,
  onMessageSubmit,
}: TimelineConversationProps) => {
  const getChannelIcon = (channel: string) => {
    switch (channel?.toLowerCase()) {
      case 'email':
        return <EnvelopeIcon className="w-5 h-5 text-blue-500" />;
      case 'chat':
        return <ChatBubbleLeftIcon className="w-5 h-5 text-green-500" />;
      default:
        return <ChatBubbleLeftIcon className="w-5 h-5 text-green-500" />;
    }
  };

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="relative bg-base-100 border-2 border-base-300 rounded-lg transition-all shadow-md">
      {isSelected && (
        <div className="absolute -top-2 -right-2 text-primary">
          <CheckCircleIcon className="w-4 h-4" />
        </div>
      )}
      
      {/* Conversation Header */}
      <div
        className={`p-3 cursor-pointer ${isExpanded ? 'border-b border-base-300 shadow-md' : ''}`}
        onClick={onToggle}
      >
        <div className="flex gap-4">
          {/* Channel Icon Column */}
          <div className="flex-shrink-0 w-6 flex items-center justify-center">
            {getChannelIcon(conversation.channel)}
          </div>

          {/* Content Column */}
          <div className="flex-1 min-w-0">
            <div className="font-medium mb-1">
              {conversation.title || 'No subject'}
            </div>
            <div className="text-sm text-base-content/70 mb-1 line-clamp-1">
              {lastMessage && formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: true })} • {lastMessage?.content || 'No messages'}
            </div>
            <div className="flex gap-2 mt-2">
              {conversation.tags?.map(tag => (
                <span 
                  key={tag} 
                  className="text-xs px-2 py-0.5 bg-base-200 text-base-content/70 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Status & Assignment Column */}
          <div className="flex-shrink-0 flex flex-col items-end gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-lg capitalize font-bold ${
              conversation.status === 'open'
                ? 'bg-error/20 text-error'
                : 'bg-success/20 text-success'
            }`}>
              {conversation.status}
            </span>
            {conversation.assigned_to && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-base-content/60">Assigned to</span>
                <div className="flex items-center gap-1">
                  <Avvvatars value={conversation.assigned_to} size={16} />
                  <span className="text-xs">{conversation.assigned_to}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          {/* Messages */}
          <MessageList 
            messages={messages} 
            channel={conversation.channel}
          />

          {/* Message Input */}
          <MessageInput
            value={messageInput}
            onChange={onMessageChange}
            onSubmit={onMessageSubmit}
          />
        </>
      )}
    </div>
  );
};

export default TimelineConversation; 