import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Image as ImageIcon, FileText, ArrowRight, ShieldCheck, Cpu, Layers, CheckCircle, Database, Zap, Split, Lock } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';
import TiltCard from '../components/TiltCard';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

export default function Home({ onOpenSupabase }) {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);

  const demoItems = [
    {
      title: 'Fashion Portrait',
      before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', // In slider, cutout is demonstrated with clip
      tag: 'Fine Hair & Skin Edges',
    },
    {
      title: 'Sneaker Product',
      before: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      tag: 'E-commerce Cutout',
    },
    {
      title: 'Sports Car',
      before: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      tag: 'Complex Reflection Isolation',
    },
  ];

  const tools = [
    {
      id: 'bg-remove',
      title: 'AI Background Removal',
      badge: 'Publication Grade',
      description: 'Zero loss neural edge segmentation for hair, fur, transparent glass, and complex backdrops. Powered by BiRefNet.',
      link: '/image#background',
      gradient: 'from-cyan-500/20 via-indigo-500/20 to-purple-500/20',
      borderGlow: 'hover:border-cyan-500/50',
      icon: ImageIcon,
      iconColor: 'text-cyan-400',
    },
    {
      id: 'word-pdf',
      title: 'Word to PDF & PDF to Word',
      badge: 'Vector Engine',
      description: 'Preserve fonts, tables, margins, and nested lists. Full bi-directional conversion with editable DOCX output.',
      link: '/pdf#word',
      gradient: 'from-indigo-500/20 via-purple-500/20 to-pink-500/20',
      borderGlow: 'hover:border-indigo-500/50',
      icon: FileText,
      iconColor: 'text-indigo-400',
    },
    {
      id: 'pdf-tools',
      title: 'PDF Merge, Split & Protect',
      badge: 'High Security',
      description: 'Combine multiple PDFs, extract precise page ranges, or lock sensitive documents with password encryption.',
      link: '/pdf#merge',
      gradient: 'from-purple-500/20 via-pink-500/20 to-rose-500/20',
      borderGlow: 'hover:border-purple-500/50',
      icon: Layers,
      iconColor: 'text-purple-400',
    },
    {
      id: 'ai-assistant',
      title: 'AI Document Intelligence',
      badge: 'Semantic Q&A',
      description: 'Chat directly with contracts, manuals, and reports. Generate executive summaries and extract structured action items.',
      link: '/ai',
      gradient: 'from-amber-500/20 via-orange-500/20 to-indigo-500/20',
      borderGlow: 'hover:border-amber-500/50',
      icon: Sparkles,
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <main className="relative min-h-screen bg-[#07080E] text-slate-100 overflow-hidden">
      {/* 3D WebGL Three.js Particle Background */}
      <ThreeBackground opacity={0.65} />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 max-w-7xl mx-auto z-10">
        {/* Glow ambient spots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-cyan-400/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Top Holographic Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-lg shadow-indigo-500/10 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Next-Gen Neural Studio
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-medium text-slate-300">
              Developed by <strong className="text-cyan-400 font-bold tracking-wide">VRAJ PATEL</strong>
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Publication Quality. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Zero Compromise.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Experience publication-level AI background removal, seamless Word-to-PDF vector conversions, and intelligent document tools — powered by modern 3D performance and Supabase cloud persistence.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/image"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm tracking-wide shadow-xl shadow-indigo-600/30 hover:shadow-cyan-500/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <Sparkles size={16} />
              <span>Launch Image Studio</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/pdf"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/80 text-slate-200 font-semibold text-sm tracking-wide backdrop-blur-md transition-all hover:border-slate-500"
            >
              <FileText size={16} className="text-indigo-400" />
              <span>Word & PDF Tools</span>
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-400" />
              Publication-Grade Alpha Cutout
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-cyan-400" />
              Bi-directional Word ↔ PDF
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-indigo-400" />
              Supabase Cloud Sync Ready
            </span>
          </div>
        </div>

        {/* 3D Interactive Interactive Demo Showcase */}
        <div className="mt-16 max-w-4xl mx-auto">
          <TiltCard
            maxTilt={6}
            glare={true}
            className="rounded-3xl bg-slate-900/60 border border-white/10 p-4 sm:p-6 backdrop-blur-2xl shadow-2xl"
          >
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/10 gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ImageIcon size={18} className="text-cyan-400" />
                  Live Publication Cutout Interactive Preview
                </h3>
                <p className="text-xs text-slate-400">
                  Drag the slider handle horizontally to inspect edge precision on portraits, products, and complex lighting.
                </p>
              </div>

              {/* Demo Selector Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-white/5">
                {demoItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDemoIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedDemoIndex === idx
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <BeforeAfterSlider
                beforeImage={demoItems[selectedDemoIndex].before}
                afterImage={demoItems[selectedDemoIndex].after}
                beforeLabel="Original Scene"
                afterLabel="Publication Cutout"
                aspectRatio="16/9"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Active Model: <strong>BiRefNet Neural Alpha Segmenter</strong></span>
              </span>
              <Link to="/image" className="text-indigo-400 hover:text-cyan-300 font-medium flex items-center gap-1">
                Upload your own image <ArrowRight size={13} />
              </Link>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Grid Features with 3D Tilt Cards */}
      <section className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto z-10 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered For Speed & Perfection
          </h2>
          <p className="text-sm text-slate-400">
            Every tool is built with modern browser hardware acceleration, vector typography engines, and Supabase cloud synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <TiltCard
                key={tool.id}
                maxTilt={10}
                glare={true}
                className="group rounded-3xl bg-slate-900/50 border border-white/[0.08] p-7 backdrop-blur-xl hover:border-indigo-500/40 transition-all hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={24} className={tool.iconColor} />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/[0.05] border border-white/10 text-slate-300">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <Link
                  to={tool.link}
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-cyan-300 uppercase tracking-wider group-hover:translate-x-1 transition-all"
                >
                  <span>Open Tool</span>
                  <ArrowRight size={14} />
                </Link>
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* Supabase Cloud Architecture Banner */}
      <section className="relative py-16 px-4 sm:px-6 max-w-7xl mx-auto z-10">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-950/90 border border-emerald-500/20 p-8 sm:p-10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Database size={13} />
              <span>Full Supabase Database Integration</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Connect your Supabase project in 10 seconds
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Store file metadata, keep persistent conversion history, manage user profiles, and utilize cloud storage buckets with pre-configured RLS policies.
            </p>
          </div>

          <button
            onClick={onOpenSupabase}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Database size={16} />
            <span>Open Database Setup</span>
          </button>
        </div>
      </section>
    </main>
  );
}