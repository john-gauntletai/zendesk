import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import supabase from './supabase';
import { useSessionStore, useCustomerStore, useConversationStore } from './store';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar/Sidebar';
import Inbox from './components/Inbox/Inbox';
import KnowledgeBase from './components/KnowledgeBase/KnowledgeBase';
import Settings from './components/Settings/Settings';
import './App.css';

function App() {
  const { isLoading,session, fetchSession } = useSessionStore();
  const { fetchCustomers } = useCustomerStore();
  const { fetchConversations } = useConversationStore();
  useEffect(() => {
    fetchSession();
  }, []);
  
  useEffect(() => {
    if (session) {
      fetchCustomers();
      fetchConversations();
    }
  }, [session]);

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <LandingPage />;
  }

  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      window.location.href = '/login';
    }
  })

  return (
    <div className="flex bg-base-200 gap-1">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
