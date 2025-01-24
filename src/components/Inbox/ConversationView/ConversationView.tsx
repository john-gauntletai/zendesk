import { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { EnvelopeIcon, ChatBubbleLeftIcon, PlusIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "../../__shared/Avatar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import InsightsPanel from "./InsightsPanel";
import {
  useSessionStore,
  useMessageStore,
  useConversationStore,
  useTagsStore,
  useUserStore,
} from "../../../store";
import { Tag } from "../../../types";
import toast from "react-hot-toast";
import TagList from "../../TagList";
import ConversationStatusBadge from "../../ConversationStatusBadge";
import Portal from "../../Portal";

const ConversationView = () => {
  const [messageInput, setMessageInput] = useState("");
  const [isTagSelectorOpen, setIsTagSelectorOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [assigneePosition, setAssigneePosition] = useState({ top: 0, left: 0 });
  
  const assigneeTriggerRef = useRef<HTMLDivElement>(null);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);
  
  const { conversations, selectedConversationId, updateConversation, addTagToConversation } = useConversationStore();
  const { messages } = useMessageStore();
  const { session } = useSessionStore();
  const { tags } = useTagsStore();
  const { users } = useUserStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        assigneeDropdownRef.current && 
        !assigneeDropdownRef.current.contains(event.target as Node) &&
        !assigneeTriggerRef.current?.contains(event.target as Node)
      ) {
        setIsAssigneeOpen(false);
        setAssigneeSearch("");
      }
    };

    const updatePosition = () => {
      if (assigneeTriggerRef.current) {
        const rect = assigneeTriggerRef.current.getBoundingClientRect();
        setAssigneePosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
        });
      }
    };

    if (isAssigneeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      updatePosition();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isAssigneeOpen]);

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

  const handleAddTag = async (tag: Tag) => {
    if (!conversation) return;
    
    await addTagToConversation(conversation.id, tag.id);

    setIsTagSelectorOpen(false);
    setTagSearch("");
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
    !conversation?.tags?.some(t => t.id === tag.id)
  );

  const handleAssign = async (userId: string) => {
    if (!conversation) return;
    
    await updateConversation(conversation.id, {
      assigned_to: userId
    });
    
    setIsAssigneeOpen(false);
    setAssigneeSearch("");
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(assigneeSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(assigneeSearch.toLowerCase())
  );

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
              <div className="mt-2">
                <TagList conversation={conversation} showAddButton />
              </div>
            </div>

            {/* Status & Assignment Column */}
            <div className="flex-shrink-0 flex flex-col items-end gap-2">
              <ConversationStatusBadge conversation={conversation} />
              
              <div 
                ref={assigneeTriggerRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAssigneeOpen(!isAssigneeOpen);
                  if (!isAssigneeOpen) {
                    const rect = assigneeTriggerRef.current?.getBoundingClientRect();
                    if (rect) {
                      setAssigneePosition({
                        top: rect.bottom + window.scrollY + 4,
                        left: rect.left + window.scrollX,
                      });
                    }
                  }
                }}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80"
              >
                {conversation.assigned_to ? (
                  <>
                    <span className="text-xs text-base-content/60">Assigned to</span>
                    <div className="flex items-center gap-1">
                      <Avatar user={{ id: conversation.assigned_to }} size={16} />
                      <span className="text-xs">{conversation.assigned_to}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1 text-base-content/60">
                    <UserCircleIcon className="w-4 h-4" />
                    <span className="text-xs">Assign</span>
                  </div>
                )}
              </div>

              {isAssigneeOpen && (
                <Portal>
                  <div
                    ref={assigneeDropdownRef}
                    style={{
                      position: 'absolute',
                      top: assigneePosition.top,
                      left: assigneePosition.left,
                    }}
                    className="z-50 w-64 bg-base-100 rounded-lg shadow-lg border border-base-300"
                  >
                    <div className="p-2">
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="input input-sm input-bordered w-full"
                        value={assigneeSearch}
                        onChange={(e) => setAssigneeSearch(e.target.value)}
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredUsers.length === 0 ? (
                        <div className="p-2 text-sm text-base-content/70 text-center">
                          No users found
                        </div>
                      ) : (
                        filteredUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => handleAssign(user.id)}
                            className={`w-full px-3 py-2 text-left hover:bg-base-200 flex items-center gap-2 ${
                              user.id === conversation.assigned_to ? 'text-primary font-medium' : ''
                            }`}
                          >
                            <Avatar user={user} size={20} />
                            <div className="flex flex-col">
                              <span className="text-sm">{user.full_name}</span>
                              <span className="text-xs text-base-content/60">{user.email}</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </Portal>
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
