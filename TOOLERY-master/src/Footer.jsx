import { Link } from 'react-router-dom';
import { Sparkles, Database, ShieldCheck, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#05060A] border-t border-white/[0.08] text-slate-400 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <Sparkles size={14} className="text-cyan-400" />
              </div>
            </div>
            <span className="text-base font-extrabold text-white tracking-tight">TOOLERY</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Publication-grade 3D creative suite for neural image background cutouts, Word-to-PDF vector rendering, and Supabase cloud synchronization.
          </p>
        </div>

        {/* Tools Column */}
        <div className="space-y-2 text-xs">
          <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Image Suite</div>
          <div><Link to="/image#background" className="hover:text-cyan-400 transition-colors">AI Background Removal</Link></div>
          <div><Link to="/image#compress" className="hover:text-cyan-400 transition-colors">Smart Compressor</Link></div>
          <div><Link to="/image#resize" className="hover:text-cyan-400 transition-colors">Aspect Resizer</Link></div>
          <div><Link to="/image#ocr" className="hover:text-cyan-400 transition-colors">Multi-lingual OCR</Link></div>
        </div>

        {/* PDF Suite Column */}
        <div className="space-y-2 text-xs">
          <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Document Suite</div>
          <div><Link to="/pdf#word" className="hover:text-indigo-400 transition-colors">Word to PDF</Link></div>
          <div><Link to="/pdf#to-word" className="hover:text-indigo-400 transition-colors">PDF to Word (.docx)</Link></div>
          <div><Link to="/pdf#merge" className="hover:text-indigo-400 transition-colors">Merge PDF Documents</Link></div>
          <div><Link to="/pdf#split" className="hover:text-indigo-400 transition-colors">Split Pages</Link></div>
          <div><Link to="/pdf#protect" className="hover:text-indigo-400 transition-colors">Password Encryption</Link></div>
        </div>

        {/* Cloud & Intelligence Column */}
        <div className="space-y-2 text-xs">
          <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Platform</div>
          <div><Link to="/ai" className="hover:text-amber-400 transition-colors">AI Document Assistant</Link></div>
          <div><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard & History</Link></div>
          <div><Link to="/settings" className="hover:text-emerald-400 transition-colors">Supabase Database Settings</Link></div>
          <div><Link to="/contact" className="hover:text-slate-300 transition-colors">Contact Support</Link></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span>© {new Date().getFullYear()} Toolery 3D Creative Suite.</span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="text-slate-400">
            Designed & Developed by <strong className="text-white hover:text-cyan-400 transition-colors font-semibold">VRAJ PATEL</strong>
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck size={14} className="text-emerald-400" />
            100% Client-Privacy Standard
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Database size={14} className="text-cyan-400" />
            Supabase Ready
          </span>
        </div>
      </div>
    </footer>
  );
}