import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import {
  useCustomerStore,
  useConversationStore,
  useMessageStore,
  useSessionStore,
} from "../../store";
import { Conversation } from "../../types";
import InboxSidebar from "./InboxSidebar";
import ConversationCard from "./ConversationCard";
import ConversationView from "./ConversationView/ConversationView";

const Inbox = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { customers } = useCustomerStore();
  const { conversations, selectedConversationId, setSelectedConversationId } =
    useConversationStore();
  const { messages } = useMessageStore();
  const { session } = useSessionStore();

  const [expandedSections, setExpandedSections] = useState({
    all: true,
    assigned: true,
  });

  useEffect(() => {
    if (searchParams.size === 0) {
      setSearchParams({ status: "open" });
    }
  }, [searchParams]);

  const handleClickConversation = async (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const toggleSection = (section: "all" | "assigned") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Update URL and filter when clicking a filter option
  const handleFilterClick = (query: Record<string, string>) => {
    setSearchParams(query);
  };

  // Filter conversations based on URL params
  const filteredConversations = conversations.filter((conv) => {
    for (const [key, value] of searchParams.entries()) {
      if (key in conv) {
        if (conv[key as keyof Conversation] !== value) {
          return false;
        }
      }
    }
    return true;
  });

  // Add this helper function to check if a filter is active
  const isFilterActive = (filterQuery: Record<string, string>) => {
    // Check if searchParams has exactly the same keys and values as filterQuery
    if (Object.keys(filterQuery).length !== searchParams.size) return false;

    return Object.entries(filterQuery).every(
      ([key, value]) => searchParams.get(key) === value
    );
  };

  const conversationCounts = {
    all: {
      open: conversations.filter((c) => c.status === "open").length,
      closed: conversations.filter((c) => c.status === "closed").length,
    },
    assigned: {
      open: conversations.filter(
        (c) => c.status === "open" && c.assigned_to === session?.id
      ).length,
      closed: conversations.filter(
        (c) => c.status === "closed" && c.assigned_to === session?.id
      ).length,
    },
  };

  return (
    <div className="flex h-screen bg-base-200">
      <InboxSidebar
        expandedSections={expandedSections}
        onToggleSection={toggleSection}
        onFilterClick={handleFilterClick}
        isFilterActive={isFilterActive}
        conversationCounts={conversationCounts}
        userId={session?.id}
      />

      {/* Main Content Area */}
      <div className="px-2 pt-1 overflow-y-auto space-y-1 flex-shrink-0">
        {[...filteredConversations]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .map((conversation) => {
            const customer = customers.find(
              (c) => c.id === conversation.customer_id
            );
            const conversationMessages = messages.filter(
              (m) => m.conversation_id === conversation.id
            );
            const lastMessage =
              conversationMessages[conversationMessages.length - 1];

            return (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                customer={customer}
                lastMessage={lastMessage}
                isSelected={selectedConversationId === conversation.id}
                onClick={() => handleClickConversation(conversation.id)}
              />
            );
          })}

        {filteredConversations.length === 0 && (
          <div className="w-80 flex-shrink-0 h-full flex flex-col items-center justify-center text-center text-base-content/70 space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>No conversations found</span>
          </div>
        )}
      </div>
      <ConversationView />
    </div>
  );
};

export default Inbox;
