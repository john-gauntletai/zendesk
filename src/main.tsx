import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import "./index.css";
import SignIn from "./components/SignIn.tsx";
import NewUserResetPassword from "./components/NewUserResetPassword.tsx";
import Inbox from "./components/Inbox/Inbox.tsx";
import Reports from "./components/Reports/Reports.tsx";
import KnowledgeBase from "./components/KnowledgeBase/KnowledgeBase.tsx";
import Settings from "./components/Settings/Settings.tsx";
import NotFound from "./components/NotFound.tsx";
import AvengersHotline from "./components/AvengersHotline/AvengersHotline.tsx";
import App from "./App.tsx";
import Profile from "./components/Settings/Profile";
import Teammates from "./components/Settings/Teammates";
import Teams from "./components/Settings/Teams";
import Tags from "./components/Settings/Tags";
import Routing from "./components/Settings/Routing";
import Subscription from "./components/Settings/Subscription";

document.documentElement.setAttribute(
  'data-theme', 
  localStorage.getItem('theme') || 'light'
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="inbox" />} />
          <Route path="inbox" element={<Inbox />}>
            <Route index element={<Navigate to="?status=all" />} />
          </Route>
          <Route path="settings" element={<Settings />}>
            <Route index element={<Navigate to="profile" />} />
            <Route path="profile" element={<Profile />} />
            <Route path="teammates" element={<Teammates />} />
            <Route path="teams" element={<Teams />} />
            <Route path="tags" element={<Tags />} />
            <Route path="routing" element={<Routing />} />
            <Route path="subscription" element={<Subscription />} />
          </Route>
          <Route path="reports" element={<Reports />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="new-user-reset-password" element={<NewUserResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/avengers-hotline" element={<AvengersHotline />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
