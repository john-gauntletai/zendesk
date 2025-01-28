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
  useTeamsStore,
} from "./store";
import LandingPage from "./components/LandingPage";
import Onboarding from "./components/Onboarding";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";
import { Message, User, Conversation, Customer, Tag, Team } from "./types";

function App() {
  const { isLoading, session, fetchSession } = useSessionStore();
  const { fetchUsers, addUser, updateUser } = useUserStore();
  const { fetchCustomers, addCustomer, updateCustomer } = useCustomerStore();
  const {
    fetchConversations,
    conversations,
    receiveConversationUpdate,
    fetchConversationById,
  } = useConversationStore();
  const { fetchMessages, addMessage, updateMessage } = useMessageStore();
  const { fetchTags, addTag, removeTag, updateTag } = useTagsStore();
  const { fetchRoles } = useRolesStore();
  const { teams, fetchTeams, fetchTeamById } = useTeamsStore();

  // Initial data fetch
  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    if (session) {
      fetchCustomers(session.org_id);
      fetchUsers();
      fetchConversations();
      fetchMessages();
      fetchTags();
      fetchRoles();
      fetchTeams();
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
          fetchConversationById(newConversation.id);
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
          receiveConversationUpdate(updatedConversation);
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

    const teamsSubscription = supabase
      .channel("teams")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "teams",
          filter: `org_id=eq.${session.org_id}`,
        },
        (payload) => {
          const newTeam = payload.new as Team;
          fetchTeamById(newTeam.id);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "teams",
          filter: `org_id=eq.${session.org_id}`,
        },
        (payload) => {
          const updatedTeam = payload.new as Team;
          fetchTeamById(updatedTeam.id);
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
      teamsSubscription.unsubscribe();
    };
  }, [session]);

  // Messages subscription
  useEffect(() => {
    if (!session) {
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
          filter: `org_id=eq.${session.org_id}`,
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
          filter: `org_id=eq.${session.org_id}`,
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
  }, [session]);

  // Tags subscription
  useEffect(() => {
    if (!session) return;

    const tagsSubscription = supabase
      .channel("tags")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tags",
          filter: `org_id=eq.${session.org_id}`,
        },
        (payload) => {
          const newTag = payload.new as Tag;
          addTag(newTag);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tags",
          filter: `org_id=eq.${session.org_id}`,
        },
        (payload) => {
          const updatedTag = payload.new as Tag;
          updateTag(updatedTag);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "tags",
          filter: `org_id=eq.${session.org_id}`,
        },
        (payload) => {
          const deletedTag = payload.old as Tag;
          removeTag(deletedTag);
        }
      );

    const conversationsTagsSubscription = supabase
      .channel("conversations_tags")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversations_tags",
          filter: `conversation_id=in.(${conversations
            .map((c) => c.id)
            .join(",")})`,
        },
        (payload) => {
          console.log("New conversation tag:", payload.new);
          const newConversationTag = payload.new as ConversationTag;
          fetchConversationById(newConversationTag.conversation_id);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "conversations_tags",
          filter: `conversation_id=in.(${conversations
            .map((c) => c.id)
            .join(",")})`,
        },
        (payload) => {
          const deletedConversationTag = payload.old as ConversationTag;
          fetchConversationById(deletedConversationTag.conversation_id);
        }
      );

    return () => {
      tagsSubscription.unsubscribe();
      conversationsTagsSubscription.unsubscribe();
    };
  }, [session, conversations]);

  useEffect(() => {
    if (!session || !teams?.length) { 
      return; 
    }

    const usersTeamsSubscription = supabase
      .channel("users_teams")
      .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "users_teams",
            filter: `team_id=in.(${teams.map((t) => t.id).join(",")})`,
          },
          (payload) => {
            const newUserTeam = payload.new as UserTeam;
            fetchTeamById(newUserTeam.team_id);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "users_teams",
            filter: `team_id=in.(${teams.map((t) => t.id).join(",")})`,
          },
          (payload) => {
            const deletedUserTeam = payload.old as UserTeam;
            fetchTeamById(deletedUserTeam.team_id);
          }
        )
      .subscribe();

    return () => {
      usersTeamsSubscription.unsubscribe();
    };
  }, [session, teams]);

  // Auth state change listener
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        window.location.href = "/";
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
        <Onboarding />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
