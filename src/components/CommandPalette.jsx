import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Image, FileText, Sparkles, Sliders, Database, ArrowRight, X, Shield, Split, Layers } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onOpenSupabase }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const commands = [
    { id: 'bg-remove', name: 'Remove Background (Publication AI)', category: 'Image', icon: Image, path: '/image#background' },
    { id: 'word-to-pdf', name: 'Word (.docx) to PDF Converter', category: 'PDF', icon: FileText, path: '/pdf#word' },
    { id: 'pdf-to-word', name: 'PDF to Word (.docx) Converter', category: 'PDF', icon: FileText, path: '/pdf#to-word' },
    { id: 'merge-pdf', name: 'Merge PDF Documents', category: 'PDF', icon: Layers, path: '/pdf#merge' },
    { id: 'split-pdf', name: 'Split PDF Pages', category: 'PDF', icon: Split, path: '/pdf#split' },
    { id: 'protect-pdf', name: 'Password Protect PDF', category: 'PDF', icon: Shield, path: '/pdf#protect' },
    { id: 'image-compress', name: 'Compress Image (WebP/JPEG/PNG)', category: 'Image', icon: Image, path: '/image#compress' },
    { id: 'image-resize', name: 'Resize & Scale Image', category: 'Image', icon: Image, path: '/image#resize' },
    { id: 'ocr-extract', name: 'OCR Multi-lingual Text Extraction', category: 'Image', icon: FileText, path: '/image#ocr' },
    { id: 'ai-chat', name: 'AI Document Intelligence & Q&A', category: 'AI', icon: Sparkles, path: '/ai' },
    { id: 'dashboard', name: 'User Dashboard & Storage History', category: 'Account', icon: Sliders, path: '/dashboard' },
    { id: 'supabase', name: 'Configure Supabase Database', category: 'Settings', icon: Database, action: 'supabase' },
  ];

  const filtered = commands.filter((cmd) =>
    `${cmd.name} ${cmd.category}`.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (cmd) => {
    onClose();
    if (cmd.action === 'supabase' && onOpenSupabase) {
      onOpenSupabase();
    } else if (cmd.path) {
      navigate(cmd.path);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-slate-800">
          <Search size={18} className="text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Type a tool or command (e.g. background, word, merge)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No matching tools found for "{query}"
            </div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => handleSelect(cmd)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm text-slate-200 hover:bg-indigo-600/20 hover:text-white group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="font-medium">{cmd.name}</div>
                      <div className="text-xs text-slate-500 group-hover:text-indigo-300">
                        {cmd.category}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Navigate with mouse or click item</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 border border-slate-700">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
