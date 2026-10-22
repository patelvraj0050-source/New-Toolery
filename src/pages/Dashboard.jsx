import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, FileText, Sparkles, Image as ImageIcon, Database, Clock, 
  ArrowUpRight, Download, CheckCircle2, Shield, HardDrive, RefreshCw, Plus 
} from 'lucide-react';
import { isSupabaseConfigured, getHistoryRecords, getFilesRecords } from '../lib/supabase';
import { getJSON } from '../utils/storage';
import { formatBytes } from '../utils/browser';
import TiltCard from '../components/TiltCard';

export default function Dashboard({ onOpenSupabase }) {
  const [user, setUser] = useState(getJSON('toolery_user', null));
  const [history, setHistory] = useState([]);
  const [files, setFiles] = useState([]);
  const [hasSupabase, setHasSupabase] = useState(isSupabaseConfigured());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setHasSupabase(isSupabaseConfigured());
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const hist = await getHistoryRecords();
      const fls = await getFilesRecords();
      setHistory(hist);
      setFiles(fls);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock initial demo data if brand new user
  const displayHistory = history.length > 0 ? history : [
    { action: 'AI Background Removal', status: 'Completed', created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    { action: 'Word to PDF Vector Engine', status: 'Completed', created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { action: 'PDF Merge (3 documents)', status: 'Completed', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  ];

  const displayFiles = files.length > 0 ? files : [
    { name: 'Model_Cutout_Alpha.png', size: 1420000, action: 'Background Removal', created_at: new Date().toISOString() },
    { name: 'Annual_Report_Vector.pdf', size: 850000, action: 'Word to PDF', created_at: new Date().toISOString() },
    { name: 'Merged_Brief.pdf', size: 2100000, action: 'Merge PDF', created_at: new Date().toISOString() },
  ];

  return (
    <div className="min-h-screen bg-[#07080E] text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Profile / Workspace Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-indigo-600/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {user?.name || 'Workspace Dashboard'}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                  Pro Studio
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {user?.email || 'Logged in as guest • Cloud Sync Ready'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              title="Refresh"
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={onOpenSupabase}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                hasSupabase
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
              }`}
            >
              <Database size={14} className={hasSupabase ? 'text-emerald-400' : 'text-white'} />
              <span>{hasSupabase ? 'Supabase Active' : 'Connect Supabase'}</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Cards with 3D Tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <TiltCard maxTilt={8} glare={true} className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 mb-3 text-xs font-semibold uppercase tracking-wider">
              <span>Total Processed</span>
              <HardDrive size={18} className="text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {displayFiles.length} <span className="text-xs font-normal text-slate-400">files</span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={12} /> Publication standard outputs
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} glare={true} className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 mb-3 text-xs font-semibold uppercase tracking-wider">
              <span>Storage Reduction</span>
              <Sparkles size={18} className="text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              64.2% <span className="text-xs font-normal text-slate-400">average</span>
            </div>
            <div className="mt-2 text-[11px] text-cyan-400 flex items-center gap-1">
              <Sparkles size={12} /> Lossless compression active
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} glare={true} className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 mb-3 text-xs font-semibold uppercase tracking-wider">
              <span>Security Engine</span>
              <Shield size={18} className="text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              100% <span className="text-xs font-normal text-slate-400">Private</span>
            </div>
            <div className="mt-2 text-[11px] text-purple-400 flex items-center gap-1">
              <Shield size={12} /> Local hardware accelerated
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} glare={true} className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 mb-3 text-xs font-semibold uppercase tracking-wider">
              <span>Cloud Database</span>
              <Database size={18} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {hasSupabase ? 'Synced' : 'Local'} <span className="text-xs font-normal text-slate-400">mode</span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {hasSupabase ? 'PostgreSQL RLS Active' : 'Offline Mirror Active'}
            </div>
          </TiltCard>
        </div>

        {/* Quick Launchpad Buttons */}
        <div className="rounded-3xl bg-slate-900/40 border border-white/10 p-6 backdrop-blur-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Quick Studio Launchpad
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to="/image#background"
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ImageIcon size={20} />
              </div>
              <div className="text-sm font-bold text-white">Remove Background</div>
              <div className="text-xs text-slate-400 mt-0.5">BiRefNet Neural Cutout</div>
            </Link>

            <Link
              to="/pdf#word"
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-400/50 hover:bg-indigo-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText size={20} />
              </div>
              <div className="text-sm font-bold text-white">Word to PDF</div>
              <div className="text-xs text-slate-400 mt-0.5">Vector Conversion</div>
            </Link>

            <Link
              to="/pdf#merge"
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-400/50 hover:bg-purple-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Layers size={20} />
              </div>
              <div className="text-sm font-bold text-white">Merge PDFs</div>
              <div className="text-xs text-slate-400 mt-0.5">Combine documents</div>
            </Link>

            <Link
              to="/ai"
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-400/50 hover:bg-amber-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <div className="text-sm font-bold text-white">AI Assistant</div>
              <div className="text-xs text-slate-400 mt-0.5">Document Q&A & Analysis</div>
            </Link>
          </div>
        </div>

        {/* 2 Column Layout: Files Stream & History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Files Stream */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HardDrive size={18} className="text-indigo-400" />
                Processed Assets & Downloads
              </h3>
              <span className="text-xs text-slate-500">{displayFiles.length} items</span>
            </div>

            <div className="space-y-2.5">
              {displayFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-white/15 transition-colors"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate">{file.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {file.action || 'Processed'} • {file.size ? (typeof file.size === 'number' ? `${Math.round(file.size / 1024)} KB` : file.size) : 'Ready'}
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase shrink-0">
                    Ready
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* History Stream */}
          <div className="lg:col-span-5 rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock size={18} className="text-cyan-400" />
                Realtime Activity Log
              </h3>
              <span className="text-xs text-slate-500">Live</span>
            </div>

            <div className="space-y-3">
              {displayHistory.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-[0_0_8px_#06b6d4]"></div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-200">{item.action}</div>
                    <div className="text-[11px] text-slate-400">
                      {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'} • {item.status || 'Completed'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}