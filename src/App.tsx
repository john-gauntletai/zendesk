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
} from "./store";
import LandingPage from "./components/LandingPage";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const { isLoading, session, fetchSession } = useSessionStore();
  const { fetchUsers } = useUserStore();
  const { fetchCustomers } = useCustomerStore();
  const { fetchConversations } = useConversationStore();
  const { fetchMessages } = useMessageStore();
  const { fetchTags } = useTagsStore();
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
    }
  }, [session]);

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <LandingPage />;
  }

  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
      window.location.href = "/login";
    }
  });
  navigate('/inbox');
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
