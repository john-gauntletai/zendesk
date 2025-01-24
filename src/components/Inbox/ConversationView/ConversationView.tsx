import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { EnvelopeIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import Avatar from "../../__shared/Avatar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import InsightsPanel from "./InsightsPanel";
import {
  useSessionStore,
  useMessageStore,
  useConversationStore,
} from "../../../store";

const ConversationView = () => {
  const [messageInput, setMessageInput] = useState("");
  const { conversations, selectedConversationId } = useConversationStore();
  const { messages } = useMessageStore();
  const { session } = useSessionStore();

  if (!selectedConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-100 border-l-2 border-base-300 shadow-sm">
        <div className="text-center text-base-content/70">
          <svg
            className="w-12 h-12 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-lg font-medium">Select a conversation</p>
          <p className="text-sm">Choose a conversation to view messages</p>
        </div>
      </div>
    );
  }

  const conversation = conversations.find(
    (c) => c.id === selectedConversationId
  );
  const conversationMessages = messages.filter(
    (m) => m.conversation_id === selectedConversationId
  );

  const getChannelIcon = (channel: string) => {
    switch (channel?.toLowerCase()) {
      case "email":
        return <EnvelopeIcon className="w-5 h-5 text-blue-500" />;
      case "chat":
        return <ChatBubbleLeftIcon className="w-5 h-5 text-green-500" />;
      default:
        return <ChatBubbleLeftIcon className="w-5 h-5 text-green-500" />;
    }
  };

  const onMessageChange = (value: string) => {
    setMessageInput(value);
  };

  const onMessageSubmit = () => {
    console.log("Message submitted:", messageInput);
  };

  const lastMessage = conversationMessages[conversationMessages.length - 1];

  return (
    <div className="flex flex-1 bg-base-100 border-l-2 border-base-300 shadow-sm transition-all">
      <div className="flex flex-1 flex-col">
        <div className="p-3 shadow-md border-b-2 border-base-300">
          <div className="flex gap-4">
            {/* Channel Icon Column */}
            <div className="flex-shrink-0 w-6 flex items-center justify-center">
              {getChannelIcon(conversation.channel)}
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0">
              <div className="font-medium mb-1">
                {conversation.title || "No subject"}
              </div>
              <div className="text-sm text-base-content/70 mb-1 line-clamp-1">
                {lastMessage &&
                  formatDistanceToNow(new Date(lastMessage.created_at), {
                    addSuffix: true,
                  })}{" "}
                • {lastMessage?.content || "No messages"}
              </div>
              <div className="flex gap-2 mt-2">
                {conversation.tags?.map((tag) => (
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
              <span
                className={`text-xs px-2 py-0.5 rounded-lg capitalize font-bold ${
                  conversation.status === "open"
                    ? "bg-error/20 text-error"
                    : "bg-success/20 text-success"
                }`}
              >
                {conversation.status}
              </span>
              {conversation.assigned_to && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/60">
                    Assigned to
                  </span>
                  <div className="flex items-center gap-1">
                    <Avatar user={{ id: conversation.assigned_to }} size={16} />
                    <span className="text-xs">{conversation.assigned_to}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden relative">
          <MessageList
            messages={conversationMessages}
            channel={conversation.channel}
          />

          <MessageInput
            value={messageInput}
            onChange={onMessageChange}
            onSubmit={onMessageSubmit}
          />
        </div>
      </div>

      <InsightsPanel />
    </div>
  );
};

export default ConversationView;
