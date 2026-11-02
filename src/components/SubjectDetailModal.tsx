import React, { useState, useMemo } from 'react';
import { type SubjectItem, getSubjectIcon } from '../data/subjectsData';
import { TEXTBOOKS, type Textbook } from '../data/textbooksData';
import { TextbookReaderModal } from './TextbookReaderModal';
import { triggerFileDownload } from '../utils/documentViewer';
import { generateTextbookPdf } from '../utils/textbookPdfGenerator';
import {
  X,
  BookOpen,
  Search,
  Download,
  BookMarked,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle2,
  Calendar,
  Layers,
  FileCheck,
} from 'lucide-react';

interface SubjectDetailModalProps {
  subject: SubjectItem | null;
  onClose: () => void;
  textbooks?: Textbook[];
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
  subject,
  onClose,
  textbooks = TEXTBOOKS,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMundarijaId, setExpandedMundarijaId] = useState<string | null>(null);
  const [activeReadingBook, setActiveReadingBook] = useState<Textbook | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Filter textbooks for this subject unconditionally before any early return
  const subjectBooks = useMemo(() => {
    if (!subject) return [];
    return textbooks.filter((b) => b.subjectId === subject.id);
  }, [subject, textbooks]);

  const filteredBooks = useMemo(() => {
    return subjectBooks.filter((b) => {
      if (selectedGrade !== 'all' && b.grade !== selectedGrade) return false;
      if (
        searchQuery.trim() &&
        !`${b.title} ${b.author} ${b.desc}`.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [subjectBooks, selectedGrade, searchQuery]);

  if (!subject) return null;

  const Icon = (subject as any).icon || getSubjectIcon(subject.iconName || subject.id);

  const handleDownload = (book: Textbook) => {
    let downloadData = book.fileData;
    if (!downloadData && (book.format || 'PDF').toUpperCase() === 'PDF') {
      try {
        downloadData = generateTextbookPdf(book);
      } catch (err) {
        console.warn('PDF download generation error:', err);
      }
    }
    if (downloadData) {
      const fileName = book.fileName || `${book.title}.${book.format?.toLowerCase() || 'pdf'}`;
      triggerFileDownload(downloadData, fileName);
    }
    setDownloadToast(`«${book.title}» darsligi yuklab olindi!`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const gradesList = [5, 6, 7, 8, 9, 10, 11];

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div
          className="relative w-full max-w-5xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="p-5 sm:p-6 border-b border-[#dfe6e1] dark:border-[#28372f] flex items-start justify-between gap-4 bg-[#f3f5f2]/60 dark:bg-[#0f1613]/60">
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-none border ${subject.bgLight}`}
              >
                <Icon className={`w-8 h-8 ${subject.color}`} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[#5a6a62] dark:text-[#9db0a5]">
                    {subject.grades}
                  </span>
                  <span className="text-xs text-[#0a7d5a] dark:text-[#3cc99a] font-bold">
                    {subjectBooks.length} ta rasmiy darslik
                  </span>
                </div>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#14211b] dark:text-[#e9f1ec] mt-1">
                  {subject.name} fani darsliklari
                </h2>
                <p className="text-xs sm:text-sm text-[#5a6a62] dark:text-[#9db0a5] mt-1 max-w-xl">
                  {subject.desc}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-center text-[#14211b] dark:text-[#e9f1ec] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-none"
              aria-label="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader Filters: Grades & Search */}
          <div className="px-5 sm:px-6 py-3 border-b border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Grade buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              <button
                type="button"
                onClick={() => setSelectedGrade('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-none ${
                  selectedGrade === 'all'
                    ? 'bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] shadow-xs'
                    : 'bg-gray-100 dark:bg-gray-800 text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b]'
                }`}
              >
                Barchasi
              </button>

              {gradesList.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-none ${
                    selectedGrade === g
                      ? 'bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-800 text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b]'
                  }`}
                >
                  {g}-sinf
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative min-w-[220px]">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Darslik yoki muallifni qidirish..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Download Toast Notification */}
          {downloadToast && (
            <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{downloadToast}</span>
            </div>
          )}

          {/* Textbooks Content Grid */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {filteredBooks.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#5a6a62] border border-dashed border-[#dfe6e1] dark:border-[#28372f] rounded-2xl space-y-2">
                <p>Ushbu sinf yoki qidiruv boʻyicha darslik topilmadi.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGrade('all');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 bg-[#0a7d5a] text-white rounded-xl font-bold"
                >
                  Filtrni tozalash
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBooks.map((book) => {
                  const isMundarijaOpen = expandedMundarijaId === book.id;

                  return (
                    <div
                      key={book.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] flex flex-col justify-between space-y-4 hover:border-[#0a7d5a] transition-all shadow-xs"
                    >
                      {/* Top Book Meta */}
                      <div className="flex items-start gap-4">
                        {/* Book Mockup Cover */}
                        <div className="w-20 h-28 rounded-xl bg-gradient-to-br from-[#0a7d5a] to-[#064e3b] text-white p-2.5 flex flex-col justify-between shadow-md flex-none border-2 border-white/20 select-none">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-1 py-0.5 rounded">
                            {book.grade}-sinf
                          </span>
                          <BookMarked className="w-7 h-7 opacity-80 mx-auto" />
                          <span className="text-[9px] font-bold text-center line-clamp-1 opacity-90">
                            {book.format}
                          </span>
                        </div>

                        {/* Title, Author & Stats */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/15 text-[#0a7d5a] dark:text-[#3cc99a]">
                              {book.grade}-sinf darsligi
                            </span>
                            <span className="text-[10px] text-[#5a6a62] dark:text-[#9db0a5]">
                              {book.pages} bet · {book.year}-yil
                            </span>
                          </div>

                          <h3 className="font-display font-extrabold text-sm sm:text-base text-[#14211b] dark:text-[#e9f1ec] leading-snug">
                            {book.title}
                          </h3>

                          <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                            Muallif: <span className="font-semibold text-[#14211b] dark:text-[#e9f1ec]">{book.author}</span>
                          </p>
                          <p className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5]">
                            Nashriyot: {book.publisher}
                          </p>

                          <div className="pt-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                              <FileCheck className="w-3 h-3" />
                              {book.fileData ? `${book.format || 'Fayl'} fayli biriktirilgan` : `${book.format || 'PDF'} elektron darslik`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#14211b] dark:text-[#e9f1ec] leading-relaxed line-clamp-2">
                        {book.desc}
                      </p>

                      {/* Mundarija Accordion toggle */}
                      {book.chapters.length > 0 && (
                        <div className="border-t border-[#dfe6e1] dark:border-[#28372f] pt-2">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedMundarijaId((prev) => (prev === book.id ? null : book.id))
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-[#0a7d5a] dark:text-[#3cc99a] hover:underline py-1"
                          >
                            <span className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5" />
                              <span>Mavzular mundarijasi ({book.chapters.length} ta bob)</span>
                            </span>
                            {isMundarijaOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {isMundarijaOpen && (
                            <div className="mt-2 p-3 bg-white dark:bg-[#17211c] rounded-xl border border-[#dfe6e1] dark:border-[#28372f] space-y-2 text-xs divide-y divide-gray-100 dark:divide-gray-800 animate-in fade-in">
                              {book.chapters.map((ch) => (
                                <div key={ch.num} className="pt-1.5 first:pt-0 flex justify-between gap-2">
                                  <span className="font-medium text-[#14211b] dark:text-[#e9f1ec]">
                                    {ch.num}-bob. {ch.title}
                                  </span>
                                  <span className="text-[#5a6a62] text-[11px] flex-none">
                                    {ch.pages} bet
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveReadingBook(book)}
                          className="flex-1 py-2.5 px-3 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-xs rounded-xl hover:brightness-105 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Darslikni oʻqish</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownload(book)}
                          className="py-2.5 px-3 bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] hover:border-[#0a7d5a] text-[#14211b] dark:text-[#e9f1ec] font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                          title="Faylni yuklab olish"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden xs:inline">Yuklab olish</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Textbook Reader Modal */}
      {activeReadingBook && (
        <TextbookReaderModal
          book={activeReadingBook}
          onClose={() => setActiveReadingBook(null)}
        />
      )}
    </>
  );
};
