import { useState, useEffect } from 'react';
import { Database, Shield, Sliders, Trash2, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { getActiveSupabaseConfig, saveSupabaseConfig, testSupabaseConnection } from '../lib/supabase';
import { toast } from '../components/Toast';
import TiltCard from '../components/TiltCard';

export default function Settings({ onOpenSupabase }) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const config = getActiveSupabaseConfig();
    setUrl(config.url || '');
    setKey(config.key || '');
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection(url.trim(), key.trim());
    setIsTesting(false);
    setTestResult(result);

    if (result.success) {
      saveSupabaseConfig(url.trim(), key.trim());
      toast('Supabase configuration saved & verified!');
    } else {
      toast(result.message || 'Connection test failed.');
    }
  };

  const clearCache = () => {
    if (window.confirm('Clear local history and cache? (Supabase remote records remain safe)')) {
      localStorage.removeItem('toolery_history');
      localStorage.removeItem('toolery_files');
      toast('Local cache cleared.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07080E] text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="pb-6 border-b border-white/[0.08]">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Workspace Settings & Supabase
          </h1>
          <p className="text-sm text-slate-400">
            Manage your cloud database keys, storage rules, and client configurations.
          </p>
        </div>

        {/* Supabase Configuration Card */}
        <TiltCard maxTilt={4} glare={false} className="rounded-3xl bg-slate-900/60 border border-white/10 p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Database size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Supabase Cloud Database</h3>
                <p className="text-xs text-slate-400">Live PostgreSQL synchronization for users, files, and activity.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenSupabase}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10"
            >
              Open SQL Guide
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://your-project.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Anon Public API Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${testResult.success ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
                {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{testResult.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isTesting}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Save size={14} />
              <span>{isTesting ? 'Verifying...' : 'Save & Verify Supabase'}</span>
            </button>
          </form>
        </TiltCard>

        {/* Local Storage & Cache */}
        <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-8 backdrop-blur-xl flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trash2 size={18} className="text-rose-400" />
              Reset Local Storage Cache
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Clears browser-cached conversion records and temporary blobs.
            </p>
          </div>

          <button
            onClick={clearCache}
            className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800 text-rose-300 text-xs font-semibold transition-colors"
          >
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
}
