import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import supabase from "./supabase";
import {
  useSessionStore,
  useCustomerStore,
  useConversationStore,
  useMessageStore,
  useUserStore,
  useTagsStore,
  useRolesStore,
} from "./store";
import LandingPage from "./components/LandingPage";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";
import { Message, User, Conversation, Customer } from "./types";

function App() {
  const { isLoading, session, fetchSession } = useSessionStore();
  const { fetchUsers, addUser, updateUser } = useUserStore();
  const { fetchCustomers, addCustomer, updateCustomer } = useCustomerStore();
  const {
    fetchConversations,
    addConversation,
    conversations,
    updateConversation,
  } = useConversationStore();
  const { fetchMessages, addMessage, updateMessage } = useMessageStore();
  const { fetchTags } = useTagsStore();
  const { fetchRoles } = useRolesStore();

  // Initial data fetch
  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    if (session) {
      fetchCustomers();
      fetchUsers();
      fetchConversations();
      fetchMessages();
      fetchTags();
      fetchRoles();
    }
  }, [session]);

  // Realtime subscriptions for users, customers, conversations
  useEffect(() => {
    if (!session) {
      return;
    }

    const conversationsSubscription = supabase
      .channel("conversations")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversations",
          filter: `org_id=eq.${session.org_id}`,
        },
        (payload) => {
          const newConversation = payload.new as Conversation;
          addConversation(newConversation);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `org_id=eq.${session.org_id}`,
        },
        (payload) => {
          const updatedConversation = payload.new as Conversation;
          updateConversation(updatedConversation);
        }
      )
      .subscribe();

    const usersSubscription = supabase
      .channel("users")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "users",
          filter: `org_id=eq.${session.org_id}`,
        },
        (payload) => {
          const newUser = payload.new as User;
          addUser(newUser);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `org_id=eq.${session.org_id}`,
        },
        (payload) => {
          const updatedUser = payload.new as User;
          updateUser(updatedUser);
        }
      )
      .subscribe();

    const customersSubscription = supabase
      .channel("customers")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "customers",
          filter: `org_id=eq.${session.org_id}`,
        },
        (payload) => {
          const newCustomer = payload.new as Customer;
          addCustomer(newCustomer);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "customers",
          filter: `org_id=eq.${session.org_id}`,
        },
        (payload) => {
          const updatedCustomer = payload.new as Customer;
          updateCustomer(updatedCustomer);
        }
      )
      .subscribe();

    return () => {
      conversationsSubscription.unsubscribe();
      customersSubscription.unsubscribe();
      usersSubscription.unsubscribe();
    };
  }, [session]);

  // Messages subscription
  useEffect(() => {
    if (!conversations.length || !session) {
      return;
    }

    const messagesSubscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=in.(${conversations
            .map((c) => c.id)
            .join(",")})`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          addMessage(newMessage);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=in.(${conversations
            .map((c) => c.id)
            .join(",")})`,
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
          updateMessage(updatedMessage);
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [conversations, session]);

  // Auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        window.location.href = "/login";
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <LandingPage />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
