import { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Sparkles, Layers, Image as ImageIcon, FileText, Database, Search, User, LogOut, Menu, X, ArrowUpRight } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { getJSON } from '../utils/storage';

export default function Navbar({ onOpenCommand, onOpenSupabase }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(getJSON('toolery_user', null));
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasSupabase, setHasSupabase] = useState(isSupabaseConfigured());

  useEffect(() => {
    const syncUser = () => {
      setUser(getJSON('toolery_user', null));
      setHasSupabase(isSupabaseConfigured());
    };

    window.addEventListener('storage', syncUser);
    const interval = setInterval(() => {
      setHasSupabase(isSupabaseConfigured());
    }, 2000);

    return () => {
      window.removeEventListener('storage', syncUser);
      clearInterval(interval);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('toolery_user');
    setUser(null);
    setMenuOpen(false);
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
      isActive
        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="site-header sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles size={18} className="text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              TOOLERY
            </span>
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
              3D Studio
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
          <NavLink to="/image" className={navClass}>
            <ImageIcon size={14} className="text-cyan-400" />
            Image Studio
          </NavLink>
          <NavLink to="/pdf" className={navClass}>
            <FileText size={14} className="text-indigo-400" />
            PDF & Word
          </NavLink>
          <NavLink to="/ai" className={navClass}>
            <Sparkles size={14} className="text-amber-400" />
            AI Document
          </NavLink>
          <NavLink to="/dashboard" className={navClass}>
            <Layers size={14} className="text-emerald-400" />
            Dashboard
          </NavLink>
        </nav>

        {/* Right Action Tools & Supabase Button */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Quick Search Shortcut */}
          <button
            onClick={onOpenCommand}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-all shadow-sm"
          >
            <Search size={14} className="text-slate-400" />
            <span>Search tools</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Supabase Status Pill */}
          <button
            onClick={onOpenSupabase}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              hasSupabase
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                hasSupabase ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <Database size={13} className={hasSupabase ? 'text-emerald-400' : 'text-amber-400'} />
            <span>{hasSupabase ? 'Supabase Active' : 'Connect Supabase'}</span>
          </button>

          {/* User Account / Sign In */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-white"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user.name || 'User'}</span>
              </Link>
              <button
                onClick={logout}
                title="Log Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold tracking-wide shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
              <User size={13} />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Burger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenCommand}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <Search size={18} />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl px-5 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <NavLink
            to="/image"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 p-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/5"
          >
            <ImageIcon size={18} className="text-cyan-400" />
            Image Studio (AI Background Remover)
          </NavLink>
          <NavLink
            to="/pdf"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 p-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/5"
          >
            <FileText size={18} className="text-indigo-400" />
            PDF Tools & Word Converter
          </NavLink>
          <NavLink
            to="/ai"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 p-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/5"
          >
            <Sparkles size={18} className="text-amber-400" />
            AI Document Assistant
          </NavLink>
          <NavLink
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 p-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/5"
          >
            <Layers size={18} className="text-emerald-400" />
            Dashboard & History
          </NavLink>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenSupabase();
              }}
              className="flex items-center justify-between w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200"
            >
              <span className="flex items-center gap-2">
                <Database size={15} className="text-emerald-400" />
                Supabase Settings
              </span>
              <span className="text-emerald-400">{hasSupabase ? 'Connected' : 'Configure'}</span>
            </button>
            {user ? (
              <button
                onClick={logout}
                className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl bg-rose-950/40 border border-rose-800 text-xs font-semibold text-rose-300"
              >
                <LogOut size={15} />
                Sign Out ({user.name})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white"
              >
                <User size={15} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}