import { useState } from 'react';
import { 
  FileText, Layers, Split, Shield, ArrowRight, Download, RefreshCw, 
  UploadCloud, CheckCircle2, FileUp, Sparkles, X, Lock 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { convertWordToPdf, convertPdfToWord, mergePdfDocuments, splitPdfDocument, protectPdfDocument } from '../lib/pdfProcessor';
import { syncHistoryRecord, syncFileRecord } from '../lib/supabase';
import { formatBytes } from '../utils/browser';
import { toast } from '../components/Toast';
import TiltCard from '../components/TiltCard';

export default function PDFStudio() {
  const [activeTab, setActiveTab] = useState('word-to-pdf'); // 'word-to-pdf' | 'pdf-to-word' | 'merge' | 'split' | 'protect'

  // Word to PDF State
  const [wordFile, setWordFile] = useState(null);
  const [isConvertingWord, setIsConvertingWord] = useState(false);
  const [wordProgress, setWordProgress] = useState({ percent: 0, text: '' });
  const [convertedPdfBlob, setConvertedPdfBlob] = useState(null);

  // PDF to Word State
  const [pdfFile, setPdfFile] = useState(null);
  const [isConvertingPdf, setIsConvertingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState({ percent: 0, text: '' });
  const [convertedDocxBlob, setConvertedDocxBlob] = useState(null);

  // Merge State
  const [mergeFiles, setMergeFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeProgress, setMergeProgress] = useState({ percent: 0, text: '' });
  const [mergedBlob, setMergedBlob] = useState(null);

  // Split State
  const [splitFile, setSplitFile] = useState(null);
  const [splitRange, setSplitRange] = useState('1');
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitBlob, setSplitBlob] = useState(null);

  // Protect State
  const [protectFile, setProtectFile] = useState(null);
  const [protectPassword, setProtectPassword] = useState('');
  const [isProtecting, setIsProtecting] = useState(false);
  const [protectedBlob, setProtectedBlob] = useState(null);

  // ==========================================
  // WORD TO PDF HANDLER
  // ==========================================
  const handleWordToPdf = async () => {
    if (!wordFile) {
      toast('Please upload a Word (.docx) document.');
      return;
    }

    setIsConvertingWord(true);
    setWordProgress({ percent: 15, text: 'Parsing document structure...' });

    try {
      const blob = await convertWordToPdf(wordFile, (prog) => {
        setWordProgress(prog);
      });

      setConvertedPdfBlob(blob);
      await syncHistoryRecord('Word to PDF Conversion', 'Completed', { filename: wordFile.name });
      await syncFileRecord({ name: `${wordFile.name.replace(/\.[^/.]+$/, '')}.pdf`, size: blob.size, type: 'application/pdf', action: 'Word to PDF' });

      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      toast('Word converted to PDF successfully!');
    } catch (err) {
      console.error(err);
      toast('Conversion failed: ' + err.message);
    } finally {
      setIsConvertingWord(false);
    }
  };

  const downloadWordToPdf = () => {
    if (!convertedPdfBlob) return;
    const url = URL.createObjectURL(convertedPdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${wordFile.name.replace(/\.[^/.]+$/, '')}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('PDF downloaded!');
  };

  // ==========================================
  // PDF TO WORD HANDLER
  // ==========================================
  const handlePdfToWord = async () => {
    if (!pdfFile) {
      toast('Please upload a PDF file.');
      return;
    }

    setIsConvertingPdf(true);
    setPdfProgress({ percent: 20, text: 'Extracting text and structure...' });

    try {
      const blob = await convertPdfToWord(pdfFile, (prog) => {
        setPdfProgress(prog);
      });

      setConvertedDocxBlob(blob);
      await syncHistoryRecord('PDF to Word Conversion', 'Completed', { filename: pdfFile.name });
      await syncFileRecord({ name: `${pdfFile.name.replace(/\.[^/.]+$/, '')}.docx`, size: blob.size, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', action: 'PDF to Word' });

      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      toast('PDF converted to Word (.docx) successfully!');
    } catch (err) {
      console.error(err);
      toast('Conversion failed: ' + err.message);
    } finally {
      setIsConvertingPdf(false);
    }
  };

  const downloadPdfToWord = () => {
    if (!convertedDocxBlob) return;
    const url = URL.createObjectURL(convertedDocxBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pdfFile.name.replace(/\.[^/.]+$/, '')}.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('Word document downloaded!');
  };

  // ==========================================
  // PDF MERGE HANDLER
  // ==========================================
  const handleMergePdf = async () => {
    if (mergeFiles.length < 2) {
      toast('Please select at least 2 PDF files to merge.');
      return;
    }

    setIsMerging(true);
    try {
      const blob = await mergePdfDocuments(mergeFiles, (prog) => {
        setMergeProgress(prog);
      });

      setMergedBlob(blob);
      await syncHistoryRecord('Merge PDF Documents', 'Completed', { count: mergeFiles.length });
      await syncFileRecord({ name: 'toolery-merged.pdf', size: blob.size, type: 'application/pdf', action: 'Merge PDF' });

      confetti({ particleCount: 60, spread: 70 });
      toast('PDFs merged successfully!');
    } catch (err) {
      toast('Merge failed: ' + err.message);
    } finally {
      setIsMerging(false);
    }
  };

  // ==========================================
  // PDF SPLIT HANDLER
  // ==========================================
  const handleSplitPdf = async () => {
    if (!splitFile) {
      toast('Please upload a PDF file to split.');
      return;
    }

    setIsSplitting(true);
    try {
      const blob = await splitPdfDocument(splitFile, splitRange);
      setSplitBlob(blob);

      await syncHistoryRecord('Split PDF Pages', 'Completed', { range: splitRange });
      await syncFileRecord({ name: 'toolery-split.pdf', size: blob.size, type: 'application/pdf', action: 'Split PDF' });

      confetti({ particleCount: 50, spread: 60 });
      toast('PDF split successfully!');
    } catch (err) {
      toast('Split failed: ' + err.message);
    } finally {
      setIsSplitting(false);
    }
  };

  // ==========================================
  // PDF PROTECT HANDLER
  // ==========================================
  const handleProtectPdf = async () => {
    if (!protectFile || !protectPassword) {
      toast('Please select a PDF and enter an encryption password.');
      return;
    }

    setIsProtecting(true);
    try {
      const blob = await protectPdfDocument(protectFile, protectPassword);
      setProtectedBlob(blob);

      await syncHistoryRecord('PDF Password Protection', 'Completed', { filename: protectFile.name });
      toast('PDF secured with password protection!');
    } catch (err) {
      toast('Protection failed: ' + err.message);
    } finally {
      setIsProtecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080E] text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <FileText size={13} />
              Vector Document Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              PDF & Word Engineering Studio
            </h1>
            <p className="text-sm text-slate-400">
              High-fidelity Word to PDF vector conversion, editable DOCX extraction, merge, split & security.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            {[
              { id: 'word-to-pdf', label: 'Word to PDF', icon: FileUp },
              { id: 'pdf-to-word', label: 'PDF to Word', icon: FileText },
              { id: 'merge', label: 'Merge PDF', icon: Layers },
              { id: 'split', label: 'Split Pages', icon: Split },
              { id: 'protect', label: 'Protect PDF', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
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
            TAB 1: WORD TO PDF
        ========================================================= */}
        {activeTab === 'word-to-pdf' && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/60 border border-white/10 p-8 backdrop-blur-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileUp size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white">Convert Word (.docx) to PDF</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Converts Microsoft Word documents into vector-perfect PDFs with preserved typography, tables, and headers.
              </p>
            </div>

            <label className="block w-full border-2 border-dashed border-white/15 hover:border-indigo-400/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white/[0.02]">
              <input
                type="file"
                accept=".docx"
                onChange={(e) => {
                  setWordFile(e.target.files[0]);
                  setConvertedPdfBlob(null);
                }}
                className="hidden"
              />
              <FileText size={36} className="mx-auto text-indigo-400 mb-3" />
              <div className="text-base font-semibold text-white">
                {wordFile ? wordFile.name : 'Select or drag your Word (.docx) document'}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {wordFile ? `${formatBytes(wordFile.size)} • Ready to convert` : 'Microsoft Word 2007+ files (.docx)'}
              </div>
            </label>

            <button
              onClick={handleWordToPdf}
              disabled={!wordFile || isConvertingWord}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isConvertingWord ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>{wordProgress.text || 'Generating PDF...'}</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Convert to PDF</span>
                </>
              )}
            </button>

            {convertedPdfBlob && (
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">PDF Ready For Download</div>
                    <div className="text-xs text-emerald-300 font-mono">{formatBytes(convertedPdfBlob.size)} • Vector PDF</div>
                  </div>
                </div>

                <button
                  onClick={downloadWordToPdf}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                >
                  <Download size={15} />
                  <span>Download PDF</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 2: PDF TO WORD
        ========================================================= */}
        {activeTab === 'pdf-to-word' && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/60 border border-white/10 p-8 backdrop-blur-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <FileText size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white">Convert PDF to Editable Word (.docx)</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Extracts document sections and text blocks into structured Microsoft Word OpenXML format.
              </p>
            </div>

            <label className="block w-full border-2 border-dashed border-white/15 hover:border-purple-400/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white/[0.02]">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  setPdfFile(e.target.files[0]);
                  setConvertedDocxBlob(null);
                }}
                className="hidden"
              />
              <FileText size={36} className="mx-auto text-purple-400 mb-3" />
              <div className="text-base font-semibold text-white">
                {pdfFile ? pdfFile.name : 'Select or drag your PDF file'}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {pdfFile ? `${formatBytes(pdfFile.size)} • Ready to convert` : 'PDF document'}
              </div>
            </label>

            <button
              onClick={handlePdfToWord}
              disabled={!pdfFile || isConvertingPdf}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isConvertingPdf ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>{pdfProgress.text || 'Generating DOCX...'}</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Convert to Word (.docx)</span>
                </>
              )}
            </button>

            {convertedDocxBlob && (
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Editable Word Document Ready</div>
                    <div className="text-xs text-emerald-300 font-mono">{formatBytes(convertedDocxBlob.size)} • Microsoft Word .docx</div>
                  </div>
                </div>

                <button
                  onClick={downloadPdfToWord}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                >
                  <Download size={15} />
                  <span>Download DOCX</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 3: MERGE PDF
        ========================================================= */}
        {activeTab === 'merge' && (
          <div className="max-w-3xl mx-auto rounded-3xl bg-slate-900/60 border border-white/10 p-8 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers size={20} className="text-purple-400" />
                  Merge Multiple PDFs
                </h2>
                <p className="text-xs text-slate-400 mt-1">Combine several PDF documents into a single master file.</p>
              </div>

              {mergeFiles.length > 0 && (
                <button
                  onClick={() => setMergeFiles([])}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            <label className="block w-full border-2 border-dashed border-white/15 hover:border-purple-400/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02]">
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => setMergeFiles([...mergeFiles, ...Array.from(e.target.files)])}
                className="hidden"
              />
              <UploadCloud size={30} className="mx-auto text-purple-400 mb-2" />
              <div className="text-sm font-semibold text-white">Click to add PDF documents</div>
              <div className="text-xs text-slate-400 mt-1">You can select multiple files at once</div>
            </label>

            {/* Files List */}
            {mergeFiles.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300">Files to Merge ({mergeFiles.length}):</div>
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {mergeFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-white/5 text-xs text-slate-200">
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                          {i + 1}
                        </span>
                        <span className="truncate">{f.name}</span>
                        <span className="text-slate-500 font-mono">({formatBytes(f.size)})</span>
                      </div>
                      <button
                        onClick={() => setMergeFiles(mergeFiles.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-400 p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleMergePdf}
              disabled={mergeFiles.length < 2 || isMerging}
              className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {isMerging ? 'Merging PDF Streams...' : `Merge ${mergeFiles.length} PDF Documents`}
            </button>

            {mergedBlob && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-400 font-semibold">Master Merged Document Ready</div>
                  <div className="text-sm font-bold text-white">{formatBytes(mergedBlob.size)}</div>
                </div>
                <a
                  href={URL.createObjectURL(mergedBlob)}
                  download="toolery-merged.pdf"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Download size={14} />
                  Download Merged PDF
                </a>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 4: SPLIT PDF
        ========================================================= */}
        {activeTab === 'split' && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/60 border border-white/10 p-8 backdrop-blur-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Split size={20} className="text-cyan-400" />
                Split PDF Pages
              </h2>
              <p className="text-xs text-slate-400 mt-1">Extract specific page numbers or ranges into a separate document.</p>
            </div>

            <label className="block w-full border-2 border-dashed border-white/15 hover:border-cyan-400/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02]">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSplitFile(e.target.files[0])}
                className="hidden"
              />
              <FileText size={30} className="mx-auto text-cyan-400 mb-2" />
              <div className="text-sm font-semibold text-white">
                {splitFile ? splitFile.name : 'Select PDF to split'}
              </div>
            </label>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Page Range (e.g. 1-3, 5, 8-10)
              </label>
              <input
                type="text"
                value={splitRange}
                onChange={(e) => setSplitRange(e.target.value)}
                placeholder="1-3, 5"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <button
              onClick={handleSplitPdf}
              disabled={!splitFile || isSplitting}
              className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 transition-all disabled:opacity-50"
            >
              {isSplitting ? 'Extracting Pages...' : 'Split & Download Pages'}
            </button>

            {splitBlob && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-400 font-semibold">Extracted Pages Ready</div>
                  <div className="text-sm font-bold text-white">{formatBytes(splitBlob.size)}</div>
                </div>
                <a
                  href={URL.createObjectURL(splitBlob)}
                  download="toolery-split.pdf"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Download size={14} />
                  Download Split PDF
                </a>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 5: PROTECT PDF
        ========================================================= */}
        {activeTab === 'protect' && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/60 border border-white/10 p-8 backdrop-blur-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield size={20} className="text-emerald-400" />
                Password Protect PDF
              </h2>
              <p className="text-xs text-slate-400 mt-1">Configure security credentials and permissions on sensitive PDFs.</p>
            </div>

            <label className="block w-full border-2 border-dashed border-white/15 hover:border-emerald-400/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02]">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setProtectFile(e.target.files[0])}
                className="hidden"
              />
              <Lock size={30} className="mx-auto text-emerald-400 mb-2" />
              <div className="text-sm font-semibold text-white">
                {protectFile ? protectFile.name : 'Select PDF to secure'}
              </div>
            </label>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Encryption Password</label>
              <input
                type="password"
                value={protectPassword}
                onChange={(e) => setProtectPassword(e.target.value)}
                placeholder="Enter strong password"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <button
              onClick={handleProtectPdf}
              disabled={!protectFile || !protectPassword || isProtecting}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              {isProtecting ? 'Applying Encryption...' : 'Lock & Protect PDF'}
            </button>

            {protectedBlob && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-400 font-semibold">Protected PDF Ready</div>
                  <div className="text-sm font-bold text-white">{formatBytes(protectedBlob.size)}</div>
                </div>
                <a
                  href={URL.createObjectURL(protectedBlob)}
                  download={`protected-${protectFile.name}`}
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Download size={14} />
                  Download Protected PDF
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}