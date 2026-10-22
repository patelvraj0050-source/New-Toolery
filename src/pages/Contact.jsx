import { useState } from 'react';
import { Mail, MessageSquare, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { syncHistoryRecord } from '../lib/supabase';
import { toast } from '../components/Toast';
import TiltCard from '../components/TiltCard';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await syncHistoryRecord('Contact Ingestion', 'Submitted', { subject: formData.subject });
    setIsSent(true);
    toast('Message sent! Our engineering team will review it.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#07080E] text-slate-100 py-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <TiltCard maxTilt={5} glare={true} className="rounded-3xl bg-slate-900/60 border border-white/10 p-8 sm:p-10 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <MessageSquare size={22} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Contact Engineering & Support</h1>
            <p className="text-xs text-slate-400">
              Have questions or need custom enterprise neural models? Reach out directly.
            </p>
          </div>

          {isSent ? (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-in fade-in">
              <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Message Transmitted</h3>
              <p className="text-xs text-slate-300">
                Thank you for reaching out. We've logged your request into our database.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="jane@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="Feature feedback, API access..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you are building..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Send size={15} />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </TiltCard>
      </div>
    </div>
  );
}
