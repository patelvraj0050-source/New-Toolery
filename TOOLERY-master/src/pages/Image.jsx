import { useState, useRef } from 'react';
import { 
  Sparkles, Image as ImageIcon, Download, Sliders, RefreshCw, Layers, 
  Check, Copy, ArrowRight, Eye, ShieldCheck, Sun, Palette, UploadCloud,
  FileCheck, AlertCircle, Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { removeImageBackground, compositeBackground, compressImage, resizeImage } from '../lib/imageProcessor';
import { syncHistoryRecord, syncFileRecord } from '../lib/supabase';
import { loadScript, formatBytes } from '../utils/browser';
import { toast } from '../components/Toast';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import TiltCard from '../components/TiltCard';

export default function ImageStudio() {
  const [activeTab, setActiveTab] = useState('background'); // 'background' | 'compress' | 'resize' | 'ocr'

  // ==========================================
  // BACKGROUND REMOVAL STATE
  // ==========================================
  const [bgFile, setBgFile] = useState(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState('');
  const [cutoutBlob, setCutoutBlob] = useState(null);
  const [cutoutPreviewUrl, setCutoutPreviewUrl] = useState('');
  const [finalCompositeUrl, setFinalCompositeUrl] = useState('');
  const [isProcessingBg, setIsProcessingBg] = useState(false);
  const [bgProgress, setBgProgress] = useState({ percent: 0, text: '' });

  // Custom Background Options
  const [bgType, setBgType] = useState('transparent'); // 'transparent' | 'color' | 'gradient' | 'image' | 'blur'
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [bgGradient, setBgGradient] = useState('cyber');
  const [customBgFile, setCustomBgFile] = useState(null);
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [shadowBlur, setShadowBlur] = useState(25);
  const [shadowOpacity, setShadowOpacity] = useState(0.4);

  // ==========================================
  // COMPRESS STATE
  // ==========================================
  const [compressFile, setCompressFile] = useState(null);
  const [compressQuality, setCompressQuality] = useState(80);
  const [compressFormat, setCompressFormat] = useState('image/jpeg');
  const [compressResult, setCompressResult] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // ==========================================
  // RESIZE STATE
  // ==========================================
  const [resizeFile, setResizeFile] = useState(null);
  const [resizeWidth, setResizeWidth] = useState('');
  const [resizeHeight, setResizeHeight] = useState('');
  const [lockAspect, setLockAspect] = useState(true);
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const [isResizing, setIsResizing] = useState(false);

  // ==========================================
  // OCR STATE
  // ==========================================
  const [ocrFile, setOcrFile] = useState(null);
  const [ocrLang, setOcrLang] = useState('eng');
  const [ocrText, setOcrText] = useState('');
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  // Sample Images for 1-Click Testing
  const sampleImages = [
    { name: 'Model Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
    { name: 'Sneaker', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
    { name: 'Sports Car', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' },
  ];

  // ==========================================
  // BACKGROUND REMOVAL HANDLERS
  // ==========================================
  const handleSelectBgFile = (file) => {
    if (!file) return;
    setBgFile(file);
    const url = URL.createObjectURL(file);
    setOriginalPreviewUrl(url);
    setCutoutBlob(null);
    setCutoutPreviewUrl('');
    setFinalCompositeUrl('');
  };

  const handleSelectSample = async (sampleUrl, sampleName) => {
    try {
      toast(`Loading sample ${sampleName}...`);
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const file = new File([blob], `${sampleName.toLowerCase().replace(/\s+/g, '-')}.jpg`, { type: 'image/jpeg' });
      handleSelectBgFile(file);
    } catch {
      toast('Could not load sample image.');
    }
  };

  const processBackgroundRemoval = async () => {
    if (!bgFile) {
      toast('Please upload or select an image first.');
      return;
    }

    setIsProcessingBg(true);
    setBgProgress({ percent: 10, text: 'Initializing neural pipeline...' });

    try {
      const resultBlob = await removeImageBackground(bgFile, (prog) => {
        setBgProgress({ percent: prog.percent, text: prog.text });
      });

      setCutoutBlob(resultBlob);
      const cutoutUrl = URL.createObjectURL(resultBlob);
      setCutoutPreviewUrl(cutoutUrl);

      // Render initial composite
      await updateComposite(resultBlob, { type: bgType, color: bgColor, gradient: bgGradient, shadow: { enabled: shadowEnabled, blur: shadowBlur, opacity: shadowOpacity } });

      await syncHistoryRecord('AI Background Removal', 'Completed', { filename: bgFile.name });
      await syncFileRecord({ name: `cutout-${bgFile.name}`, size: resultBlob.size, type: 'image/png', action: 'Background Removal' });

      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      toast('Background removed with publication precision!');
    } catch (err) {
      console.error(err);
      toast('Background removal failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessingBg(false);
    }
  };

  const updateComposite = async (rawCutoutBlob = cutoutBlob, overrides = {}) => {
    if (!rawCutoutBlob) return;
    const activeType = overrides.type || bgType;
    const activeColor = overrides.color || bgColor;
    const activeGrad = overrides.gradient || bgGradient;
    const activeShadow = overrides.shadow || { enabled: shadowEnabled, blur: shadowBlur, opacity: shadowOpacity };

    try {
      const compBlob = await compositeBackground(rawCutoutBlob, {
        type: activeType,
        color: activeColor,
        gradient: activeGrad,
        originalFile: bgFile,
        bgImageFile: customBgFile,
        shadow: activeShadow,
      });

      if (finalCompositeUrl) URL.revokeObjectURL(finalCompositeUrl);
      const url = URL.createObjectURL(compBlob);
      setFinalCompositeUrl(url);
    } catch (err) {
      console.error('Composite error', err);
    }
  };

  const downloadProcessedImage = () => {
    const downloadUrl = finalCompositeUrl || cutoutPreviewUrl;
    if (!downloadUrl) {
      toast('No processed image to download.');
      return;
    }

    const a = document.createElement('a');
    a.href = downloadUrl;
    const ext = bgType === 'transparent' ? 'png' : 'jpg';
    a.download = `toolery-cutout-${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    toast('Image downloaded successfully!');
  };

  // ==========================================
  // COMPRESSION HANDLER
  // ==========================================
  const handleCompress = async () => {
    if (!compressFile) {
      toast('Select an image to compress.');
      return;
    }

    setIsCompressing(true);
    try {
      const res = await compressImage(compressFile, compressQuality, compressFormat);
      setCompressResult(res);

      await syncHistoryRecord('Image Compression', 'Completed', {
        originalSize: res.originalSize,
        compressedSize: res.compressedSize,
        reduction: `${res.reductionPercent}%`
      });

      confetti({ particleCount: 40, spread: 50 });
      toast(`Compressed by ${res.reductionPercent}%!`);
    } catch (e) {
      toast('Compression failed.');
    } finally {
      setIsCompressing(false);
    }
  };

  // ==========================================
  // RESIZE HANDLER
  // ==========================================
  const handleSelectResizeFile = (file) => {
    if (!file) return;
    setResizeFile(file);
    const img = new Image();
    img.onload = () => {
      setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
      setResizeWidth(img.naturalWidth);
      setResizeHeight(img.naturalHeight);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleWidthChange = (val) => {
    setResizeWidth(val);
    if (lockAspect && originalDims.w > 0) {
      const ratio = originalDims.h / originalDims.w;
      setResizeHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val) => {
    setResizeHeight(val);
    if (lockAspect && originalDims.h > 0) {
      const ratio = originalDims.w / originalDims.h;
      setResizeWidth(Math.round(val * ratio));
    }
  };

  const handleResize = async () => {
    if (!resizeFile || !resizeWidth || !resizeHeight) {
      toast('Provide valid dimensions.');
      return;
    }

    setIsResizing(true);
    try {
      const res = await resizeImage(resizeFile, resizeWidth, resizeHeight);
      const url = URL.createObjectURL(res.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resized-${resizeWidth}x${resizeHeight}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      await syncHistoryRecord('Image Resize', 'Completed', { dimensions: `${resizeWidth}x${resizeHeight}` });
      toast('Image resized & downloaded!');
    } catch {
      toast('Resize failed.');
    } finally {
      setIsResizing(false);
    }
  };

  // ==========================================
  // OCR HANDLER
  // ==========================================
  const handleOcr = async () => {
    if (!ocrFile) {
      toast('Select an image with text.');
      return;
    }

    setIsOcrProcessing(true);
    setOcrText('');
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js', 'Tesseract');
      const out = await window.Tesseract.recognize(ocrFile, ocrLang, {
        logger: (m) => console.log(m)
      });
      const extracted = out.data.text.trim();
      setOcrText(extracted);

      await syncHistoryRecord('OCR Text Extraction', 'Completed', { lang: ocrLang, characters: extracted.length });
      toast('Text extracted successfully!');
    } catch (e) {
      toast('OCR engine failed to load. Check internet connection.');
    } finally {
      setIsOcrProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080E] text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={13} />
              Publication-Grade Studio
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Image Engineering & AI Cutout
            </h1>
            <p className="text-sm text-slate-400">
              BiRefNet neural edge segmentation, background composition, smart compression & OCR.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            {[
              { id: 'background', label: 'AI Background Remove', icon: Sparkles },
              { id: 'compress', label: 'Compress', icon: Sliders },
              { id: 'resize', label: 'Resize', icon: Maximize2 },
              { id: 'ocr', label: 'OCR Extract', icon: FileCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            TAB 1: PUBLICATION BACKGROUND REMOVAL STUDIO
        ========================================================= */}
        {activeTab === 'background' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Upload & Options */}
            <div className="lg:col-span-5 space-y-6">
              {/* Upload Card */}
              <TiltCard maxTilt={5} glare={false} className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <UploadCloud size={18} className="text-cyan-400" />
                  Select Image
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Upload portrait, product, animal, or car. High resolution images supported.
                </p>

                <label className="block w-full border-2 border-dashed border-white/15 hover:border-cyan-400/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSelectBgFile(e.target.files[0])}
                    className="hidden"
                  />
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <ImageIcon size={22} />
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {bgFile ? bgFile.name : 'Click to upload or drag & drop'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 30MB</div>
                </label>

                {/* 1-Click Sample Previews */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-xs font-semibold text-slate-300 mb-2">Or test 1-click samples:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {sampleImages.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSample(s.url, s.name)}
                        className="p-1.5 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-slate-950/60 text-[11px] font-medium text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1"
                      >
                        <Sparkles size={11} className="text-cyan-400" />
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Removal Trigger Button */}
                <button
                  type="button"
                  disabled={!bgFile || isProcessingBg}
                  onClick={processBackgroundRemoval}
                  className="w-full mt-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {isProcessingBg ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>{bgProgress.text || 'Processing Neural Cutout...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Remove Background (Publication Quality)</span>
                    </>
                  )}
                </button>

                {/* Progress Indicator */}
                {isProcessingBg && (
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{bgProgress.text}</span>
                      <span className="font-mono text-cyan-400">{bgProgress.percent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                        style={{ width: `${bgProgress.percent}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </TiltCard>

              {/* Background Replacement Options Card */}
              {cutoutBlob && (
                <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl space-y-5 animate-in fade-in duration-200">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Palette size={18} className="text-indigo-400" />
                    Replace Background & Lighting
                  </h3>

                  {/* Mode selector */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'transparent', label: 'Alpha PNG' },
                      { id: 'color', label: 'Color' },
                      { id: 'gradient', label: 'Gradient' },
                      { id: 'blur', label: 'Blur Scene' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setBgType(mode.id);
                          updateComposite(cutoutBlob, { type: mode.id });
                        }}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                          bgType === mode.id
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-950/70 border border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  {/* Color Swatches */}
                  {bgType === 'color' && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Preset Studio Colors:</label>
                      <div className="flex items-center gap-2">
                        {['#FFFFFF', '#090A10', '#F1F5F9', '#3B82F6', '#10B981', '#EC4899'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setBgColor(c);
                              updateComposite(cutoutBlob, { color: c });
                            }}
                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                              bgColor === c ? 'border-cyan-400 scale-110 shadow-lg' : 'border-white/20'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => {
                            setBgColor(e.target.value);
                            updateComposite(cutoutBlob, { color: e.target.value });
                          }}
                          className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0"
                          title="Custom Hex Color"
                        />
                      </div>
                    </div>
                  )}

                  {/* Gradient Swatches */}
                  {bgType === 'gradient' && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Designer Gradients:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'cyber', name: 'Cyber Neon' },
                          { id: 'sunset', name: 'Sunset Glow' },
                          { id: 'dark-studio', name: 'Dark Studio' },
                          { id: 'emerald', name: 'Emerald Velvet' },
                        ].map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                              setBgGradient(g.id);
                              updateComposite(cutoutBlob, { gradient: g.id });
                            }}
                            className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                              bgGradient === g.id
                                ? 'border-indigo-400 bg-indigo-950/40 text-white'
                                : 'border-white/5 bg-slate-950/60 text-slate-400 hover:text-white'
                            }`}
                          >
                            {g.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3D Realistic Drop Shadow */}
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Sun size={14} className="text-amber-400" />
                        Photorealistic Product Shadow
                      </span>
                      <input
                        type="checkbox"
                        checked={shadowEnabled}
                        onChange={(e) => {
                          setShadowEnabled(e.target.checked);
                          updateComposite(cutoutBlob, { shadow: { enabled: e.target.checked, blur: shadowBlur, opacity: shadowOpacity } });
                        }}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                    </div>

                    {shadowEnabled && (
                      <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Shadow Blur ({shadowBlur}px)</span>
                          <input
                            type="range"
                            min="5"
                            max="50"
                            value={shadowBlur}
                            onChange={(e) => {
                              const b = Number(e.target.value);
                              setShadowBlur(b);
                              updateComposite(cutoutBlob, { shadow: { enabled: true, blur: b, opacity: shadowOpacity } });
                            }}
                            className="w-32"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Interactive Before/After Preview & Download */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Eye size={18} className="text-cyan-400" />
                    Interactive Cutout Inspection
                  </h3>
                  {cutoutBlob && (
                    <button
                      onClick={downloadProcessedImage}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                    >
                      <Download size={14} />
                      <span>Download {bgType === 'transparent' ? 'PNG' : 'Composite'}</span>
                    </button>
                  )}
                </div>

                {originalPreviewUrl && (cutoutPreviewUrl || finalCompositeUrl) ? (
                  <BeforeAfterSlider
                    beforeImage={originalPreviewUrl}
                    afterImage={finalCompositeUrl || cutoutPreviewUrl}
                    beforeLabel="Original Scene"
                    afterLabel={bgType === 'transparent' ? 'Publication Cutout' : 'New Composite'}
                    aspectRatio="4/3"
                  />
                ) : originalPreviewUrl ? (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center bg-slate-950">
                    <img src={originalPreviewUrl} alt="Original" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                      <Sparkles size={32} className="text-cyan-400 mb-2 animate-bounce" />
                      <div className="text-white font-bold text-sm">Image Ready for Neural Cutout</div>
                      <div className="text-xs text-slate-300 mt-1">Click "Remove Background" on the left panel to execute.</div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center bg-slate-950/40">
                    <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-500 mb-4">
                      <ImageIcon size={30} />
                    </div>
                    <div className="text-base font-bold text-slate-300">No Image Selected</div>
                    <p className="text-xs text-slate-500 max-w-sm mt-1">
                      Upload any image or pick a sample on the left to see the publication-level background removal in action.
                    </p>
                  </div>
                )}

                {/* Output Specifications */}
                {cutoutBlob && (
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                      <div className="text-slate-500">Format</div>
                      <div className="font-bold text-white uppercase">{bgType === 'transparent' ? 'PNG (Alpha 32-bit)' : 'JPEG / PNG'}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                      <div className="text-slate-500">Segmentation Model</div>
                      <div className="font-bold text-cyan-400">BiRefNet Neural</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                      <div className="text-slate-500">Hardware Accel</div>
                      <div className="font-bold text-emerald-400">WebAssembly / WebGL</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: IMAGE COMPRESSION
        ========================================================= */}
        {activeTab === 'compress' && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/60 border border-white/10 p-8 backdrop-blur-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders size={20} className="text-indigo-400" />
                Smart Image Compressor
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Reduce file sizes dramatically with zero visible quality loss.
              </p>
            </div>

            <label className="block w-full border-2 border-dashed border-white/15 hover:border-indigo-400/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02]">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCompressFile(e.target.files[0])}
                className="hidden"
              />
              <ImageIcon size={28} className="mx-auto text-indigo-400 mb-2" />
              <div className="text-sm font-semibold text-white">
                {compressFile ? compressFile.name : 'Choose image to compress'}
              </div>
              {compressFile && (
                <div className="text-xs text-slate-400 mt-1">
                  Original Size: <strong>{formatBytes(compressFile.size)}</strong>
                </div>
              )}
            </label>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-semibold">
                  <span>Quality Level: {compressQuality}%</span>
                  <span className="text-indigo-400">{compressQuality > 75 ? 'Recommended (Balanced)' : 'Maximum Compression'}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={compressQuality}
                  onChange={(e) => setCompressQuality(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Output Format</label>
                <select
                  value={compressFormat}
                  onChange={(e) => setCompressFormat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="image/jpeg">JPEG (Standard Web)</option>
                  <option value="image/webp">WebP (Modern High Compression)</option>
                  <option value="image/png">PNG (Lossless)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCompress}
              disabled={!compressFile || isCompressing}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isCompressing ? 'Compressing...' : 'Compress Image Now'}
            </button>

            {compressResult && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-400 font-semibold">Reduced by {compressResult.reductionPercent}%!</div>
                  <div className="text-sm font-bold text-white">
                    {formatBytes(compressResult.originalSize)} → {formatBytes(compressResult.compressedSize)}
                  </div>
                </div>
                <a
                  href={URL.createObjectURL(compressResult.blob)}
                  download={`compressed-${compressFile.name}`}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Download size={14} />
                  Download
                </a>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 3: IMAGE RESIZE
        ========================================================= */}
        {activeTab === 'resize' && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/60 border border-white/10 p-8 backdrop-blur-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Maximize2 size={20} className="text-cyan-400" />
                Image Resizer & Canvas Scaler
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Scale dimensions with bicubic pixel interpolation.
              </p>
            </div>

            <label className="block w-full border-2 border-dashed border-white/15 hover:border-cyan-400/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02]">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSelectResizeFile(e.target.files[0])}
                className="hidden"
              />
              <ImageIcon size={28} className="mx-auto text-cyan-400 mb-2" />
              <div className="text-sm font-semibold text-white">
                {resizeFile ? resizeFile.name : 'Select image to resize'}
              </div>
              {originalDims.w > 0 && (
                <div className="text-xs text-slate-400 mt-1">
                  Current Resolution: <strong>{originalDims.w} × {originalDims.h} px</strong>
                </div>
              )}
            </label>

            {/* Social Presets */}
            {resizeFile && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Quick Presets:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Square (1080p)', w: 1080, h: 1080 },
                    { label: 'Story (9:16)', w: 1080, h: 1920 },
                    { label: 'YouTube (16:9)', w: 1280, h: 720 },
                    { label: 'Banner', w: 1500, h: 500 },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setLockAspect(false);
                        setResizeWidth(preset.w);
                        setResizeHeight(preset.h);
                      }}
                      className="p-2 rounded-xl bg-slate-950/60 border border-white/5 text-[11px] font-medium text-slate-300 hover:text-white hover:border-cyan-400/50"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Width (px)</label>
                <input
                  type="number"
                  value={resizeWidth}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  placeholder="Width"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Height (px)</label>
                <input
                  type="number"
                  value={resizeHeight}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  placeholder="Height"
                />
              </div>
            </div>

            <button
              onClick={handleResize}
              disabled={!resizeFile || isResizing}
              className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 transition-all disabled:opacity-50"
            >
              {isResizing ? 'Resizing...' : 'Resize & Download Image'}
            </button>
          </div>
        )}

        {/* =========================================================
            TAB 4: OCR EXTRACTION
        ========================================================= */}
        {activeTab === 'ocr' && (
          <div className="max-w-3xl mx-auto rounded-3xl bg-slate-900/60 border border-white/10 p-8 backdrop-blur-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileCheck size={20} className="text-amber-400" />
                Multi-lingual OCR Text Extraction
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Extract readable text from screenshots, documents, and book scans.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block w-full border-2 border-dashed border-white/15 hover:border-amber-400/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setOcrFile(e.target.files[0])}
                    className="hidden"
                  />
                  <FileCheck size={28} className="mx-auto text-amber-400 mb-2" />
                  <div className="text-sm font-semibold text-white">
                    {ocrFile ? ocrFile.name : 'Select image with text'}
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Language</label>
                <select
                  value={ocrLang}
                  onChange={(e) => setOcrLang(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:outline-none"
                >
                  <option value="eng">English</option>
                  <option value="hin">Hindi (हिन्दी)</option>
                  <option value="guj">Gujarati (ગુજરાતી)</option>
                  <option value="fra">French (Français)</option>
                  <option value="deu">German (Deutsch)</option>
                  <option value="spa">Spanish (Español)</option>
                </select>

                <button
                  onClick={handleOcr}
                  disabled={!ocrFile || isOcrProcessing}
                  className="w-full mt-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  {isOcrProcessing ? 'Reading Text...' : 'Extract Text'}
                </button>
              </div>
            </div>

            {ocrText && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Extracted Text Result:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(ocrText);
                      toast('Text copied to clipboard!');
                    }}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    <Copy size={13} />
                    Copy Text
                  </button>
                </div>
                <textarea
                  readOnly
                  value={ocrText}
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-sm text-slate-200 font-mono focus:outline-none"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
