import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';
import { setJSON } from '../utils/storage';
import { toast } from '../components/Toast';
import TiltCard from '../components/TiltCard';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() }
          }
        });

        if (!error && data?.user) {
          setJSON('toolery_user', { name: name.trim(), email: email.trim() });
          toast('Account created successfully via Supabase!');
          setTimeout(() => navigate('/dashboard'), 600);
          return;
        }
      }

      // Local storage fallback
      setJSON('toolery_account', { name: name.trim(), email: email.trim(), password });
      setJSON('toolery_user', { name: name.trim(), email: email.trim() });
      toast('Account created successfully!');
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err) {
      toast('Sign up failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080E] text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <TiltCard maxTilt={6} glare={true} className="rounded-3xl bg-slate-900/60 border border-white/10 p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles size={20} className="text-cyan-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Create your Account</h1>
            <p className="text-xs text-slate-400">
              Join Toolery Studio to sync all your work with Supabase cloud.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-cyan-400" />
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail size={13} className="text-cyan-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock size={13} className="text-cyan-400" />
                Password (min 6 chars)
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock size={13} className="text-cyan-400" />
                Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Creating Account...' : 'Get Started Free'}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Sign In
            </Link>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}
