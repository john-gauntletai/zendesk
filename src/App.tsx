import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import supabase from './supabase';
import { useSessionStore, useCustomerStore, useConversationStore } from './store';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar/Sidebar';
import Inbox from './components/Inbox/Inbox';
import KnowledgeBase from './components/KnowledgeBase/KnowledgeBase';
import Settings from './components/Settings/Settings';
import './App.css';

function App() {
  const { session, fetchSession, logout } = useSessionStore();
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

  if (!session) {
    return <LandingPage />;
  }

  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      logout();
    }
  })

  return (
    <div className="flex bg-base-200 gap-1">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/inbox" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
