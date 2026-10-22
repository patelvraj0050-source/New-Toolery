import { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    window.tooleryToast = (newMessage) => {
      setMessage(newMessage);
      clearTimeout(window.__tooleryToastTimer);
      window.__tooleryToastTimer = setTimeout(() => {
        setMessage('');
      }, 3500);
    };

    return () => {
      delete window.tooleryToast;
    };
  }, []);

  if (!message) return null;

  return (
    <div
      id="toolery-toast"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/90 text-white border border-indigo-500/40 shadow-[0_10px_35px_rgba(99,102,241,0.25)] backdrop-blur-xl text-xs sm:text-sm font-medium animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-cyan-400 flex items-center justify-center shrink-0">
        <Sparkles size={14} />
      </div>
      <span>{message}</span>
    </div>
  );
}

export const toast = (message) => {
  if (window.tooleryToast) {
    window.tooleryToast(message);
  }
};