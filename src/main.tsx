import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import './index.css';
import SignIn from './components/SignIn.tsx';
import Inbox from './components/Inbox/Inbox.tsx';
import KnowledgeBase from './components/KnowledgeBase/KnowledgeBase.tsx';
import Settings from './components/Settings/Settings.tsx';
import NotFound from './components/NotFound.tsx';
import AvengersHotline from './components/AvengersHotline/AvengersHotline.tsx';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="bottom-left" toastOptions={{ duration: 4000 }} />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/inbox" />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/avengers" element={<AvengersHotline />} />
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
