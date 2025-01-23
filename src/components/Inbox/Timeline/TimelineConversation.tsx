import { Message, Conversation } from "../../../types";
import { format } from 'date-fns';
import { EnvelopeIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

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
        return <EnvelopeIcon className="w-4 h-4 text-blue-500" />;
      case 'chat':
        return <ChatBubbleLeftIcon className="w-4 h-4 text-green-500" />;
      default:
        return <ChatBubbleLeftIcon className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div
      className={`border rounded-lg transition-all ${
        isSelected ? 'border-primary' : 'border-base-300'
      }`}
    >
      {/* Conversation Header */}
      <div
        className={`p-3 cursor-pointer ${isExpanded ? 'border-b border-base-300' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getChannelIcon(conversation.channel)}
            <span className="font-medium">{conversation.subject || 'No subject'}</span>
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
            {messages.map(message => (
              <div key={message.id} className="text-sm">
                <div className="font-medium">{message.sender_name}</div>
                <div className="text-base-content/70">{message.content}</div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={messageInput}
              onChange={e => onMessageChange(e.target.value)}
              placeholder="Type your message..."
              className="input input-bordered input-sm flex-1"
            />
            <button
              onClick={onMessageSubmit}
              className="btn btn-primary btn-sm"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineConversation; 