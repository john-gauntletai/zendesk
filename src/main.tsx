import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import './index.css';
import SignIn from './components/SignIn.tsx';
import AvengersHotline from './components/AvengersHotline/AvengersHotline.tsx';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="bottom-left" toastOptions={{ duration: 4000 }} />
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/avengers" element={<AvengersHotline />} />
        <Route path="/" element={<App/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
