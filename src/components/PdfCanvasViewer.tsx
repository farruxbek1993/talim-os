import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import {
  dataUrlToUint8ArrayAsync,
  dataUrlToBlobAsync,
} from '../utils/pdfViewerHelper';
import { triggerFileDownload } from '../utils/documentViewer';

interface PdfCanvasViewerProps {
  dataUrl: string;
  title: string;
  fileName?: string;
  fileSize?: string;
  onDownload?: () => void;
  onSwitchToChapters?: () => void;
}

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  dataUrl,
  title,
  fileName,
  fileSize,
  onDownload,
  onSwitchToChapters,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  // PDF Document states
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>('1');
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Generate Blob URL safely for fallback / open in new tab
  useEffect(() => {
    let isMounted = true;
    let createdUrl: string | null = null;

    if (!dataUrl) return;

    dataUrlToBlobAsync(dataUrl, 'application/pdf')
      .then((blob) => {
        if (!isMounted) return;
        createdUrl = URL.createObjectURL(blob);
        setBlobUrl(createdUrl);
      })
      .catch((e) => {
        console.warn('Could not create Blob URL:', e);
      });

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [dataUrl]);

  // Load PDF Document asynchronously using native byte conversion
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    setPageInput('1');

    async function loadPdf() {
      try {
        const uint8 = await dataUrlToUint8ArrayAsync(dataUrl);
        if (!isMounted) return;

        if (!uint8 || uint8.length === 0) {
          throw new Error('PDF fayli boʻsh yoki toʻliq yuklanmagan');
        }

        const loadingTask = pdfjsLib.getDocument({
          data: uint8,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true,
          isEvalSupported: false,
        });

        const doc = await loadingTask.promise;
        if (!isMounted) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('PDF.js parse error:', err);
        setError(
          err?.message ||
            'PDF faylini ochishda xatolik yuz berdi. Faylni yuklab olib koʻrishingiz mumkin.'
        );
        setLoading(false);
      }
    }

    loadPdf();

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore cancellation
        }
      }
    };
  }, [dataUrl]);

  // Render Page to Canvas
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    // Cancel existing render if in progress
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {
        // ignore cancellation exception
      }
    }

    try {
      const page = await pdfDoc.getPage(currentPage);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const viewport = page.getViewport({ scale, rotation });
      const pixelRatio = window.devicePixelRatio || 1;

      // Adjust dimensions for retina sharpness
      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      ctx.save();
      ctx.scale(pixelRatio, pixelRatio);

      // White background before draw
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, viewport.width, viewport.height);

      const renderContext = {
        canvasContext: ctx,
        viewport,
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;
      await task.promise;
      ctx.restore();
    } catch (err: any) {
      if (err?.name === 'RenderingCancelledException') {
        return;
      }
      console.warn('Canvas page render error:', err);
    }
  }, [pdfDoc, currentPage, scale, rotation]);

  useEffect(() => {
    renderCurrentPage();
  }, [renderCurrentPage]);

  // Handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const p = currentPage - 1;
      setCurrentPage(p);
      setPageInput(String(p));
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      const p = currentPage + 1;
      setCurrentPage(p);
      setPageInput(String(p));
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= numPages) {
      setCurrentPage(p);
    } else {
      setPageInput(String(currentPage));
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.6));
  };

  const handleResetZoom = () => {
    setScale(1.2);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleOpenNewWindow = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank');
    }
  };

  const handleDownloadFile = () => {
    if (onDownload) {
      onDownload();
    } else {
      triggerFileDownload(dataUrl, fileName || `${title}.pdf`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#eef1ee] dark:bg-[#0c120f]">
      {/* PDF Controls Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-[#17211c] border-b border-[#dfe6e1] dark:border-[#28372f] shadow-xs flex-wrap gap-2 text-xs">
        {/* Left: Info */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-none animate-pulse"></span>
          <span className="font-bold text-[#14211b] dark:text-[#e9f1ec] truncate max-w-[200px] sm:max-w-xs">
            {fileName || `${title}.pdf`}
          </span>
          {fileSize && (
            <span className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] hidden md:inline">
              ({fileSize})
            </span>
          )}
        </div>

        {/* Center: Pagination controls */}
        {numPages > 0 && (
          <div className="flex items-center gap-1.5 bg-[#f3f5f2] dark:bg-[#101713] px-2 py-1 rounded-xl border border-[#dfe6e1] dark:border-[#28372f]">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={handlePrevPage}
              className="p-1 rounded-lg text-[#14211b] dark:text-[#e9f1ec] hover:bg-white dark:hover:bg-[#1d2923] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Oldingi sahifa"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1">
              <input
                type="text"
                value={pageInput}
                onChange={handlePageInputChange}
                onBlur={handlePageInputSubmit}
                className="w-10 text-center font-bold text-xs py-0.5 px-1 bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] rounded-md text-[#14211b] dark:text-[#e9f1ec] focus:outline-hidden focus:border-[#0a7d5a]"
              />
              <span className="text-xs font-semibold text-[#5a6a62] dark:text-[#9db0a5]">
                / {numPages}
              </span>
            </form>

            <button
              type="button"
              disabled={currentPage >= numPages}
              onClick={handleNextPage}
              className="p-1 rounded-lg text-[#14211b] dark:text-[#e9f1ec] hover:bg-white dark:hover:bg-[#1d2923] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Keyingi sahifa"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right: Zoom & Utilities */}
        <div className="flex items-center gap-1.5">
          {/* Zoom In / Out */}
          <div className="flex items-center bg-[#f3f5f2] dark:bg-[#101713] rounded-xl border border-[#dfe6e1] dark:border-[#28372f] p-0.5">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b] hover:bg-white dark:hover:bg-[#1d2923] transition-colors"
              title="Kichiklashtirish"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-0.5 text-[11px] font-bold text-[#14211b] dark:text-[#e9f1ec] hover:text-[#0a7d5a]"
              title="Asl oʻlcham"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b] hover:bg-white dark:hover:bg-[#1d2923] transition-colors"
              title="Kattalashtirish"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Rotate */}
          <button
            type="button"
            onClick={handleRotate}
            className="p-1.5 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-[#f3f5f2] dark:bg-[#101713] text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b] hover:bg-white dark:hover:bg-[#1d2923] transition-colors"
            title="Aylantirish (90°)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Open in new tab */}
          {blobUrl && (
            <button
              type="button"
              onClick={handleOpenNewWindow}
              className="hidden sm:inline-flex items-center gap-1 py-1.5 px-2.5 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-[#0a7d5a] dark:text-[#3cc99a] font-bold hover:bg-[#f3f5f2] dark:hover:bg-[#101713] transition-colors"
              title="Yangi oynada ochish"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Yangi oyna</span>
            </button>
          )}

          {/* Download */}
          <button
            type="button"
            onClick={handleDownloadFile}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold hover:brightness-105 transition-all shadow-xs"
            title="PDF faylini yuklab olish"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Yuklab olish</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Document Viewport */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-6 flex items-start justify-center relative select-none"
      >
        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/75 dark:bg-[#121915]/75 backdrop-blur-xs z-10">
            <RefreshCw className="w-8 h-8 text-[#0a7d5a] dark:text-[#3cc99a] animate-spin" />
            <p className="text-sm font-bold text-[#14211b] dark:text-[#e9f1ec]">
              PDF darslik sahifalari yuklanmoqda...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="max-w-md w-full my-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#17211c] border border-rose-200 dark:border-rose-900/40 text-center shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#14211b] dark:text-[#e9f1ec]">
                PDF faylini koʻrsatish
              </h3>
              <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] mt-1.5 leading-relaxed">
                {error}
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={handleDownloadFile}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] text-xs font-bold shadow-xs hover:brightness-105"
              >
                <Download className="w-4 h-4" />
                <span>Faylni yuklab olish</span>
              </button>
              {blobUrl && (
                <button
                  type="button"
                  onClick={handleOpenNewWindow}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Brauzerda koʻrish</span>
                </button>
              )}
              {onSwitchToChapters && (
                <button
                  type="button"
                  onClick={onSwitchToChapters}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#0a7d5a] text-[#0a7d5a] dark:text-[#3cc99a] text-xs font-semibold hover:bg-[#0a7d5a]/5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Mundarijani koʻrish</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* The Canvas */}
        <div className={`relative shadow-2xl rounded-sm transition-transform duration-150 ${error ? 'hidden' : 'block'}`}>
          <canvas
            ref={canvasRef}
            className="block max-w-full bg-white shadow-md border border-[#dfe6e1] dark:border-[#28372f]"
          />
        </div>
      </div>
    </div>
  );
};
