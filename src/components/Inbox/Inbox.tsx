import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import supabase from "../../supabase";
import {
  useCustomerStore,
  useConversationStore,
  useMessageStore,
  useSessionStore,
} from "../../store";
import { Conversation, Message, Customer } from "../../types";
import InboxSidebar from "./InboxSidebar";
import ConversationCard from "./ConversationCard";
import Timeline from "./Timeline/Timeline";
import InsightsPanel from "./InsightsPanel/InsightsPanel";

const Inbox = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { customers, selectedCustomerId, addCustomer } = useCustomerStore();
  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    addConversation,
  } = useConversationStore();
  const { messages, fetchMessagesByConversationId, addMessage } =
    useMessageStore();
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

  useEffect(() => {
    if (selectedCustomerId) {
      const customerConversations = conversations.filter(
        (conversation) => conversation.customer_id === selectedCustomerId
      );

      customerConversations.forEach((conversation) => {
        fetchMessagesByConversationId(conversation.id);
      });

      // Subscribe to new conversations for this customer
      const conversationsSubscription = supabase
        .channel("conversations")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "conversations",
            filter: `customer_id=eq.${selectedCustomerId}`,
          },
          (payload) => {
            const newConversation = payload.new as Conversation;
            addConversation(newConversation);
          }
        )
        .subscribe();

      // Subscribe to new messages in this customer's conversations
      const messagesSubscription = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=in.(${customerConversations
              .map((c) => c.id)
              .join(",")})`,
          },
          (payload) => {
            const newMessage = payload.new as Message;
            addMessage(newMessage);
          }
        )
        .subscribe();

      // Subscribe to new customers
      const customersSubscription = supabase
        .channel("customers")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "customers",
            filter: `org_id=eq.b6a0fc05-e31c-4b0d-a987-345c8b6e05ad`,
          },
          (payload) => {
            const newCustomer = payload.new as Customer;
            addCustomer(newCustomer);
          }
        )
        .subscribe();

      return () => {
        conversationsSubscription.unsubscribe();
        messagesSubscription.unsubscribe();
        customersSubscription.unsubscribe();
      };
    }
  }, [selectedCustomerId, conversations]);

  const handleClickConversation = async (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId
  );

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
      <div className="pl-2 pt-1">
        <div className="overflow-y-auto space-y-1">
          {filteredConversations.map((conversation) => {
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
            <div className="p-8 text-center text-base-content/70">
              No conversations found
            </div>
          )}
        </div>
      </div>
      <Timeline />
      {selectedConversationId && <InsightsPanel />}
    </div>

);
};

export default Inbox;
