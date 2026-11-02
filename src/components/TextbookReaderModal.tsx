import React, { useState, useEffect, useMemo } from 'react';
import { Textbook, TextbookChapter } from '../data/textbooksData';
import {
  X,
  BookOpen,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Bookmark,
  FileText,
  Maximize2,
  Minimize2,
  FileCode,
  FileCheck,
  AlertCircle,
  RefreshCw,
  BookMarked,
  Layers,
} from 'lucide-react';
import { convertDocxToHtml, extractTextFromDataUrl, triggerFileDownload } from '../utils/documentViewer';
import { generateTextbookPdf } from '../utils/textbookPdfGenerator';
import { PdfCanvasViewer } from './PdfCanvasViewer';

interface TextbookReaderModalProps {
  book: Textbook | null;
  onClose: () => void;
}

class SafeReaderBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error('Reader boundary caught render error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const TextbookReaderModal: React.FC<TextbookReaderModalProps> = ({ book, onClose }) => {
  // Determine initial tab: if file is present or PDF, open file view; else chapters
  const [activeTab, setActiveTab] = useState<'file' | 'chapters'>('file');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // DOCX / Text conversion states
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [docxLoading, setDocxLoading] = useState(false);
  const [docxError, setDocxError] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Detect file category
  const fileFormat = (book?.format || 'PDF').toUpperCase();
  const fileName = (book?.fileName || '').toLowerCase();
  const fileType = (book?.fileType || '').toLowerCase();
  const isPdf = fileFormat === 'PDF' || fileName.endsWith('.pdf') || fileType.includes('pdf');
  const isDocx = fileFormat === 'DOCX' || fileName.endsWith('.docx') || fileType.includes('wordprocessingml');
  const isDoc = fileFormat === 'DOC' || fileName.endsWith('.doc') || fileType.includes('msword');
  const isText = fileFormat === 'TXT' || fileName.endsWith('.txt') || fileType.includes('text/plain');

  // Effective PDF data: if user uploaded or existing book has file, use it;
  // If not, or if minimal stub, generate full official multi-page PDF!
  const effectivePdfData = useMemo(() => {
    if (!book) return null;
    if (
      book.fileData &&
      !book.fileData.includes('JVBERi0xLjQKMSAwIG9iaiA8PCAvVHlwZSAvQ2F0YWxvZw')
    ) {
      return book.fileData;
    }
    if (isPdf) {
      try {
        return generateTextbookPdf(book);
      } catch (err) {
        console.warn('PDF generate fallback error:', err);
        return book.fileData || null;
      }
    }
    return book.fileData || null;
  }, [book, isPdf]);

  useEffect(() => {
    if (!book) return;

    // Reset states on book change
    setActiveChapterIndex(0);
    setDownloadSuccess(false);
    setDocxHtml(null);
    setDocxError(null);
    setTextContent(null);

    // If PDF or file exists, always open file reader first
    const hasReadableFile = Boolean(book.fileData || isPdf);
    setActiveTab(hasReadableFile ? 'file' : 'chapters');

    if (!book.fileData) return;

    if (isDocx) {
      setDocxLoading(true);
      convertDocxToHtml(book.fileData)
        .then((res) => {
          setDocxHtml(res.html);
          setDocxLoading(false);
        })
        .catch((err) => {
          setDocxError(err?.message || 'DOCX faylini formatlashda xatolik');
          setDocxLoading(false);
        });
    } else if (isDoc) {
      setDocxLoading(true);
      convertDocxToHtml(book.fileData)
        .then((res) => {
          setDocxHtml(res.html);
          setDocxLoading(false);
        })
        .catch(() => {
          setDocxLoading(false);
          setDocxError('DOC (Word 97-2003) formati. Hujjatni yuklab olib toʻliq oʻqishingiz mumkin.');
        });
    } else if (isText) {
      const text = extractTextFromDataUrl(book.fileData);
      setTextContent(text);
    }
  }, [book, isPdf, isDocx, isDoc, isText]);

  if (!book) return null;

  const currentChapter: TextbookChapter | undefined = book.chapters[activeChapterIndex];

  const handleDownload = () => {
    const downloadData = effectivePdfData || book.fileData;
    if (downloadData) {
      const downloadName =
        book.fileName || `${book.title}.${book.format?.toLowerCase() || 'pdf'}`;
      triggerFileDownload(downloadData, downloadName);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen ? 'h-[98vh] max-w-[98vw]' : 'max-w-5xl h-[90vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between gap-3 bg-[#f3f5f2]/90 dark:bg-[#0f1613]/90">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-none font-extrabold text-xs shadow-xs ${
                isPdf
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  : isDocx || isDoc
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  : 'bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/15 text-[#0a7d5a] dark:text-[#3cc99a] border border-[#0a7d5a]/20'
              }`}
            >
              {book.format || 'PDF'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-sm sm:text-base text-[#14211b] dark:text-[#e9f1ec] truncate">
                  {book.title}
                </h2>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                  <FileCheck className="w-3 h-3" />
                  Elektron darslik
                </span>
              </div>
              <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] truncate">
                {book.author} · {book.publisher} ({book.year}) · {book.grade}-sinf
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-none">
            {/* View Mode Tabs */}
            <div className="flex items-center p-1 bg-gray-200/80 dark:bg-gray-800 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('file')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'file'
                    ? 'bg-white dark:bg-[#17211c] text-[#0a7d5a] dark:text-[#3cc99a] shadow-xs'
                    : 'text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Darslik fayli</span>
                <span className="sm:hidden">PDF/Fayl</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('chapters')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'chapters'
                    ? 'bg-white dark:bg-[#17211c] text-[#0a7d5a] dark:text-[#3cc99a] shadow-xs'
                    : 'text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b]'
                }`}
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mundarija ({book.chapters.length})</span>
                <span className="sm:hidden">Boblar</span>
              </button>
            </div>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] text-xs font-bold hover:brightness-105 transition-all shadow-xs"
              title="Darslik faylini yuklab olish"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {downloadSuccess ? 'Yuklandi!' : 'Yuklab olish'}
              </span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-center text-[#5a6a62] dark:text-[#9db0a5] hover:bg-white dark:hover:bg-[#17211c] transition-colors"
              title={isFullscreen ? 'Oʻlchamni kichraytirish' : 'Toʻliq ekran'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-center text-[#14211b] dark:text-[#e9f1ec] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Success toast banner */}
        {downloadSuccess && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2 flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-200 animate-in slide-in-from-top-1">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              «{book.title}» darslik fayli qurilmangizga muvaffaqiyatli yuklandi!
            </span>
            <span className="text-[11px] opacity-75">{book.fileName || `${book.format} fayli`}</span>
          </div>
        )}

        {/* Modal Main Body */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#f9faf9] dark:bg-[#121915]">
          {/* ================= VIEW 1: UPLOADED / GENERATED FILE VIEWER ================= */}
          {activeTab === 'file' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* PDF Viewer using Canvas */}
              {isPdf && effectivePdfData ? (
                <SafeReaderBoundary
                  fallback={
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                      <div className="max-w-md p-6 bg-white dark:bg-[#17211c] border border-amber-300 dark:border-amber-700/50 rounded-3xl shadow-sm space-y-3">
                        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                        <h3 className="font-bold text-base text-[#14211b] dark:text-[#e9f1ec]">
                          Darslik PDF faylini ochish
                        </h3>
                        <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                          Faylni qurilmaga yuklab olib yoki yangi oynada ochib koʻrishingiz mumkin.
                        </p>
                        <div className="pt-2 flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={handleDownload}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] text-xs font-bold rounded-xl"
                          >
                            <Download className="w-4 h-4" />
                            <span>Faylni yuklab olish</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab('chapters')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 dark:border-gray-700 text-xs font-semibold rounded-xl"
                          >
                            <span>Boblar konspekti</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <PdfCanvasViewer
                    dataUrl={effectivePdfData}
                    title={book.title}
                    fileName={book.fileName || `${book.title}.pdf`}
                    fileSize={book.fileSize || `${book.pages} bet`}
                    onDownload={handleDownload}
                    onSwitchToChapters={() => setActiveTab('chapters')}
                  />
                </SafeReaderBoundary>
              ) : isDocx && book.fileData ? (
                /* DOCX Viewer */
                <div className="flex-1 flex flex-col overflow-hidden p-2 sm:p-4">
                  {/* DOCX Toolbar */}
                  <div className="flex items-center justify-between px-3.5 py-2 mb-2 bg-white dark:bg-[#17211c] rounded-xl border border-[#dfe6e1] dark:border-[#28372f] text-xs flex-wrap gap-2">
                    <span className="font-semibold text-[#14211b] dark:text-[#e9f1ec] truncate flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Word hujjati (.docx): {book.fileName || book.title} ({book.fileSize || 'Fayl'})
                    </span>

                    <div className="flex items-center gap-3">
                      {/* Font size toggles */}
                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => setFontSize('sm')}
                          className={`px-2 py-0.5 rounded ${fontSize === 'sm' ? 'bg-white dark:bg-gray-700 shadow-xs' : 'opacity-60'}`}
                        >
                          Kichik
                        </button>
                        <button
                          type="button"
                          onClick={() => setFontSize('base')}
                          className={`px-2 py-0.5 rounded ${fontSize === 'base' ? 'bg-white dark:bg-gray-700 shadow-xs' : 'opacity-60'}`}
                        >
                          Oʻrta
                        </button>
                        <button
                          type="button"
                          onClick={() => setFontSize('lg')}
                          className={`px-2 py-0.5 rounded ${fontSize === 'lg' ? 'bg-white dark:bg-gray-700 shadow-xs' : 'opacity-60'}`}
                        >
                          Katta
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleDownload}
                        className="text-[#0a7d5a] dark:text-[#3cc99a] font-bold hover:underline flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Yuklab olish
                      </button>
                    </div>
                  </div>

                  {/* DOCX Content Area */}
                  <div className="flex-1 overflow-y-auto bg-white dark:bg-[#17211c] rounded-2xl border border-[#dfe6e1] dark:border-[#28372f] p-5 sm:p-10 shadow-xs">
                    {docxLoading ? (
                      <div className="h-64 flex flex-col items-center justify-center gap-3 text-[#5a6a62] dark:text-[#9db0a5]">
                        <RefreshCw className="w-7 h-7 text-[#0a7d5a] dark:text-[#3cc99a] animate-spin" />
                        <p className="text-sm font-semibold">DOCX darslik hujjati ochilmoqda...</p>
                      </div>
                    ) : docxHtml ? (
                      <div
                        className={`max-w-3xl mx-auto prose dark:prose-invert prose-emerald leading-relaxed ${
                          fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base'
                        }`}
                        dangerouslySetInnerHTML={{ __html: docxHtml }}
                      />
                    ) : docxError ? (
                      <div className="max-w-xl mx-auto text-center py-12 space-y-4">
                        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                        <h4 className="font-bold text-base text-[#14211b] dark:text-[#e9f1ec]">
                          DOCX faylini toʻgʻridan-toʻgʻri koʻrsatish
                        </h4>
                        <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] leading-relaxed">
                          {docxError}
                        </p>
                        <button
                          type="button"
                          onClick={handleDownload}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] text-xs font-bold rounded-xl"
                        >
                          <Download className="w-4 h-4" />
                          Faylni qurilmaga yuklab olish
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : isDoc && book.fileData ? (
                /* DOC (Word 97-2003) */
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-center">
                  <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] shadow-lg text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                      <FileText className="w-7 h-7" />
                    </div>

                    <div>
                      <h3 className="font-display font-extrabold text-lg text-[#14211b] dark:text-[#e9f1ec]">
                        {book.fileName || `${book.title}.doc`}
                      </h3>
                      <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] mt-1">
                        Microsoft Word hujjati · {book.fileSize || 'Tayyor'}
                      </p>
                    </div>

                    <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] leading-relaxed">
                      Ushbu darslik Microsoft Word formatida tayyorlangan. Faylni yuklab olib, Word yoki istalgan ofis dasturida toʻliq tahrirlash va oʻqish mumkin.
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] text-xs font-bold hover:brightness-105 transition-all shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Word faylini yuklab olish</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('chapters')}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <span>Boblar konspektini oʻqish</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : isText && book.fileData ? (
                /* TXT / Plain Text Viewer */
                <div className="flex-1 flex flex-col overflow-hidden p-2 sm:p-4">
                  <div className="flex items-center justify-between px-3.5 py-2 mb-2 bg-white dark:bg-[#17211c] rounded-xl border border-[#dfe6e1] dark:border-[#28372f] text-xs">
                    <span className="font-semibold text-[#14211b] dark:text-[#e9f1ec] truncate flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Matnli hujjat: {book.fileName || book.title}
                    </span>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="text-[#0a7d5a] dark:text-[#3cc99a] font-bold hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Yuklab olish
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto bg-white dark:bg-[#17211c] rounded-2xl border border-[#dfe6e1] dark:border-[#28372f] p-6 shadow-xs">
                    <pre className="font-sans text-sm text-[#14211b] dark:text-[#e9f1ec] whitespace-pre-wrap leading-relaxed max-w-3xl mx-auto">
                      {textContent || 'Matn yuklanmoqda...'}
                    </pre>
                  </div>
                </div>
              ) : book.fileData ? (
                /* Generic File Viewer */
                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
                  <div className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] text-center space-y-4">
                    <FileCode className="w-12 h-12 text-[#0a7d5a] dark:text-[#3cc99a] mx-auto" />
                    <h3 className="font-bold text-base text-[#14211b] dark:text-[#e9f1ec]">
                      {book.fileName || book.title}
                    </h3>
                    <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                      Fayl formati: {book.format} · {book.fileSize || 'Fayl'}
                    </p>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] text-xs font-bold rounded-xl"
                    >
                      <Download className="w-4 h-4" />
                      Faylni ochish / yuklab olish
                    </button>
                  </div>
                </div>
              ) : (
                /* No file attached view */
                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
                  <div className="max-w-md p-8 rounded-3xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] shadow-sm space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-base text-[#14211b] dark:text-[#e9f1ec]">
                      Elektron darslik fayli
                    </h3>
                    <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] leading-relaxed">
                      Ushbu darslik uchun PDF, DOC yoki DOCX formatdagi toʻliq darslik faylini <strong>«Fanlar muharriri»</strong> boʻlimi orqali yuklashingiz mumkin.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('chapters')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] text-xs font-bold shadow-xs hover:brightness-105 transition-all"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Mavzular va boblar konspektini oʻqish</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW 2: CHAPTERS & OUTLINE ================= */}
          {activeTab === 'chapters' && (
            <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-[280px_1fr]">
              {/* Left: Mundarija (Chapters) */}
              <div className="border-r border-[#dfe6e1] dark:border-[#28372f] bg-[#f3f5f2] dark:bg-[#0f1613] overflow-y-auto p-3.5 space-y-1.5">
                <div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#5a6a62] dark:text-[#9db0a5] flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[#0a7d5a] dark:text-[#3cc99a]" />
                  <span>Darslik mundarijasi ({book.chapters.length} ta bob)</span>
                </div>

                {book.chapters.map((ch, idx) => (
                  <button
                    key={ch.num}
                    type="button"
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-all ${
                      idx === activeChapterIndex
                        ? 'bg-white dark:bg-[#17211c] font-bold text-[#0a7d5a] dark:text-[#3cc99a] shadow-xs border border-[#dfe6e1] dark:border-[#28372f]'
                        : 'text-[#14211b] dark:text-[#e9f1ec] hover:bg-white/60 dark:hover:bg-[#17211c]/60'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="line-clamp-2 leading-relaxed">
                        {ch.num}-bob. {ch.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#5a6a62] dark:text-[#9db0a5] mt-1 block">
                      Bet: {ch.pages}
                    </span>
                  </button>
                ))}
              </div>

              {/* Right: Chapter Content / Reader Area */}
              <div className="flex flex-col bg-white dark:bg-[#17211c] overflow-y-auto p-5 sm:p-8 space-y-6">
                {currentChapter ? (
                  <div className="space-y-4 max-w-2xl">
                    <div className="border-b border-[#dfe6e1] dark:border-[#28372f] pb-3">
                      <span className="text-xs font-bold text-[#0a7d5a] dark:text-[#3cc99a] uppercase tracking-wider">
                        {book.grade}-sinf darsligi · {currentChapter.num}-bob
                      </span>
                      <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#14211b] dark:text-[#e9f1ec] mt-1">
                        {currentChapter.title}
                      </h3>
                      <span className="text-xs text-[#5a6a62] dark:text-[#9db0a5] mt-1 inline-block">
                        Darslik boʻyicha sahifalar: {currentChapter.pages}
                      </span>
                    </div>

                    {/* Chapter Abstract / Summary */}
                    <div className="p-4 rounded-2xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] space-y-2">
                      <h4 className="text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#0a7d5a] dark:text-[#3cc99a]" />
                        <span>Mavzu mohiyati va nazariy xulosalar:</span>
                      </h4>
                      <p className="text-sm text-[#14211b] dark:text-[#e9f1ec] leading-relaxed">
                        {currentChapter.summary}
                      </p>
                    </div>

                    {/* Educational Reading Excerpt */}
                    <div className="prose dark:prose-invert text-sm text-[#14211b] dark:text-[#e9f1ec] leading-relaxed space-y-3 pt-2">
                      <p>
                        Ushbu bob davomida oʻquvchi mavzuning nazariy poydevorini, asosiy qonuniyatlar va formulalarni chuqur oʻrganadi. Har bir mavzu soʻngida oʻz-oʻzini tekshirish uchun savollar hamda amaliy mashqlar berilgan.
                      </p>
                      <p>
                        Oʻquvchilar darslikdagi qoidalarni yod olmasdan, ularning hayotdagi va amaliyotdagi tadbiqini tahlil qilishlari maqsad qilingan. Mustaqil izlanish va mashqlar orqali bilimlar mustahkamlanadi.
                      </p>
                    </div>

                    {/* Chapter Pagination controls */}
                    <div className="pt-6 border-t border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between gap-3">
                      <button
                        type="button"
                        disabled={activeChapterIndex === 0}
                        onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
                        className="py-2 px-3 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] text-xs font-bold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0a7d5a]"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Oldingi bob</span>
                      </button>

                      <span className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                        {activeChapterIndex + 1} / {book.chapters.length}
                      </span>

                      <button
                        type="button"
                        disabled={activeChapterIndex === book.chapters.length - 1}
                        onClick={() => setActiveChapterIndex((prev) => Math.min(book.chapters.length - 1, prev + 1))}
                        className="py-2 px-3 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] text-xs font-bold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0a7d5a]"
                      >
                        <span>Keyingi bob</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
