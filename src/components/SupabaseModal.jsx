import { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, Key, Link as LinkIcon, Copy, Check, X, ExternalLink } from 'lucide-react';
import { getActiveSupabaseConfig, saveSupabaseConfig, testSupabaseConnection } from '../lib/supabase';
import { toast } from './Toast';

export default function SupabaseModal({ isOpen, onClose }) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getActiveSupabaseConfig();
      setUrl(config.url || '');
      setKey(config.key || '');
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndTest = async (e) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      toast('Please enter both Supabase Project URL and Anon API Key.');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection(url.trim(), key.trim());
    setIsTesting(false);
    setTestResult(result);

    if (result.success) {
      saveSupabaseConfig(url.trim(), key.trim());
      toast('Supabase connected successfully! Database synced.');
    } else {
      toast(result.message || 'Connection test failed.');
    }
  };

  const handleClear = () => {
    saveSupabaseConfig('', '');
    setUrl('');
    setKey('');
    setTestResult({ success: false, message: 'Supabase credentials cleared. Using local storage mode.' });
    toast('Using local storage database mode.');
  };

  const copySchemaSql = () => {
    const schemaSql = `-- TOOLERY NEXT-GEN SUPABASE DATABASE SCHEMA
CREATE TABLE IF NOT EXISTS public.toolery_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT, full_name TEXT, avatar_url TEXT, plan TEXT DEFAULT 'Pro Community',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE TABLE IF NOT EXISTS public.toolery_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'Completed', details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE TABLE IF NOT EXISTS public.toolery_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL, size BIGINT DEFAULT 0, type TEXT, action TEXT, status TEXT DEFAULT 'Completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.toolery_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolery_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their history" ON public.toolery_history FOR ALL USING (true);
CREATE POLICY "Users can manage their files" ON public.toolery_files FOR ALL USING (true);`;

    navigator.clipboard.writeText(schemaSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast('Schema SQL copied to clipboard!');
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="modal-content relative w-full max-w-xl bg-slate-900 border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Connect Supabase Database
              </h2>
              <p className="text-sm text-slate-400">
                Sync user history, processed files, and cloud storage in real-time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSaveAndTest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <LinkIcon size={14} className="text-emerald-400" />
              Supabase Project URL
            </label>
            <input
              type="url"
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Key size={14} className="text-emerald-400" />
              Anon Public API Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-sm flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}
            >
              {testResult.success ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isTesting}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60"
            >
              {isTesting ? 'Verifying Connection...' : 'Save & Test Connection'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Use Local Mode
            </button>
          </div>
        </form>

        {/* Database SQL Helper */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Need table schema? Copy SQL for Supabase SQL Editor.</span>
          <button
            type="button"
            onClick={copySchemaSql}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy schema.sql'}
          </button>
        </div>
      </div>
    </div>
  );
}
