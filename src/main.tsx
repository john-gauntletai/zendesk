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
import Profile from './components/Settings/Profile';
import Teammates from './components/Settings/Teammates';
import Teams from './components/Settings/Teams';
import Tags from './components/Settings/Tags';
import Routing from './components/Settings/Routing';
import Subscription from './components/Settings/Subscription';
import { createBrowserRouter, RouterProvider } from 'react-router';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "inbox",
        element: <Inbox />,
      },
      {
        path: "settings",
        element: <Settings />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "teammates",
            element: <Teammates />,
          },
          {
            path: "teams",
            element: <Teams />,
          },
          {
            path: "tags",
            element: <Tags />,
          },
          {
            path: "routing",
            element: <Routing />,
          },
          {
            path: "subscription",
            element: <Subscription />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <SignIn />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
    <RouterProvider router={router} />
  </StrictMode>
);
