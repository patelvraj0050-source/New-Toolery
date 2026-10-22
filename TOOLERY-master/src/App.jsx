import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import CommandPalette from './components/CommandPalette';
import SupabaseModal from './components/SupabaseModal';

import Home from './pages/Home';
import PDF from './pages/PDF';
import Image from './pages/Image';
import AI from './pages/AI';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import Contact from './pages/Contact';

export default function App() {
  const location = useLocation();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);

  // Show footer on main landing and informational pages
  const showFooter = ['/', '/contact', '/settings'].includes(location.pathname);

  return (
    <div className="app min-h-screen bg-[#07080E] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      <Navbar
        onOpenCommand={() => setIsCommandOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
      />

      <div className="page-content flex-1">
        <Routes>
          <Route path="/" element={<Home onOpenSupabase={() => setIsSupabaseOpen(true)} />} />
          <Route path="/pdf" element={<PDF />} />
          <Route path="/image" element={<Image />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/dashboard" element={<Dashboard onOpenSupabase={() => setIsSupabaseOpen(true)} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/settings" element={<Settings onOpenSupabase={() => setIsSupabaseOpen(true)} />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

      {showFooter && <Footer />}

      <Toast />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenSupabase={() => {
          setIsCommandOpen(false);
          setIsSupabaseOpen(true);
        }}
      />

      {/* Global Supabase Setup Modal */}
      <SupabaseModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />
    </div>
  );
}