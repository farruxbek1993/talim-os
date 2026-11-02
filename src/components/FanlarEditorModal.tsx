import React, { useState } from 'react';
import { type SubjectItem, ICON_OPTIONS, COLOR_OPTIONS, getSubjectIcon, INITIAL_SUBJECTS } from '../data/subjectsData';
import { type Textbook, TEXTBOOKS, type TextbookChapter } from '../data/textbooksData';
import {
  X,
  Plus,
  Edit3,
  Trash2,
  Save,
  RotateCcw,
  BookOpen,
  GraduationCap,
  BookMarked,
  Check,
  Layers,
  ArrowRight,
  Filter,
  FileText,
  UploadCloud,
  FileUp,
  FileCheck,
  Paperclip,
  CheckCircle2,
  File,
} from 'lucide-react';

interface FanlarEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectItem[];
  onSaveSubjects: (subjects: SubjectItem[]) => void;
  textbooks: Textbook[];
  onSaveTextbooks: (textbooks: Textbook[]) => void;
}

export const FanlarEditorModal: React.FC<FanlarEditorModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onSaveSubjects,
  textbooks,
  onSaveTextbooks,
}) => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'textbooks'>('subjects');

  // --- Subject Edit/Create States ---
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [subjName, setSubjName] = useState('');
  const [subjDesc, setSubjDesc] = useState('');
  const [subjGrades, setSubjGrades] = useState('5–11-sinflar');
  const [subjTopicsCount, setSubjTopicsCount] = useState<number>(40);
  const [subjIconName, setSubjIconName] = useState('calculator');
  const [subjColorId, setSubjColorId] = useState('blue');

  // --- Textbook Edit/Create States ---
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [isCreatingBook, setIsCreatingBook] = useState(false);
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');

  const [bookSubjectId, setBookSubjectId] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookGrade, setBookGrade] = useState<number>(7);
  const [bookYear, setBookYear] = useState<number>(2024);
  const [bookPages, setBookPages] = useState<number>(200);
  const [bookPublisher, setBookPublisher] = useState('Oʻqituvchi NMIU');
  const [bookDesc, setBookDesc] = useState('');
  const [bookChapters, setBookChapters] = useState<TextbookChapter[]>([]);

  // Attached File States
  const [bookFileData, setBookFileData] = useState<string | undefined>(undefined);
  const [bookFileName, setBookFileName] = useState<string | undefined>(undefined);
  const [bookFileType, setBookFileType] = useState<string | undefined>(undefined);
  const [bookFileSize, setBookFileSize] = useState<string | undefined>(undefined);
  const [bookFormat, setBookFormat] = useState<string>('PDF');
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);

  // Temporary chapter form
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterPages, setNewChapterPages] = useState('');
  const [newChapterSummary, setNewChapterSummary] = useState('');

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  };

  // --- Subject handlers ---
  const startCreateSubject = () => {
    setIsCreatingSubject(true);
    setEditingSubjectId(null);
    setSubjName('');
    setSubjDesc('');
    setSubjGrades('5–11-sinflar');
    setSubjTopicsCount(40);
    setSubjIconName('book');
    setSubjColorId('blue');
  };

  const startEditSubject = (subj: SubjectItem) => {
    setEditingSubjectId(subj.id);
    setIsCreatingSubject(false);
    setSubjName(subj.name);
    setSubjDesc(subj.desc);
    setSubjGrades(subj.grades);
    setSubjTopicsCount(subj.topicsCount);
    setSubjIconName(subj.iconName || 'book');

    const matchedColor = COLOR_OPTIONS.find((c) => c.color === subj.color) || COLOR_OPTIONS[0];
    setSubjColorId(matchedColor.id);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjName.trim()) {
      showToast('Iltimos, fan nomini kiriting');
      return;
    }

    const selectedColor = COLOR_OPTIONS.find((c) => c.id === subjColorId) || COLOR_OPTIONS[0];

    if (isCreatingSubject) {
      const newSubj: SubjectItem = {
        id: `subj_${Date.now()}`,
        name: subjName.trim(),
        desc: subjDesc.trim() || 'Oʻquv fani va amaliy darsliklar toʻplami',
        grades: subjGrades.trim() || '5–11-sinflar',
        topicsCount: Number(subjTopicsCount) || 30,
        color: selectedColor.color,
        bgLight: selectedColor.bgLight,
        iconName: subjIconName,
      };
      onSaveSubjects([...subjects, newSubj]);
      setIsCreatingSubject(false);
      showToast('Yangi fan muvaffaqiyatli qoʻshildi!');
    } else if (editingSubjectId) {
      const updated = subjects.map((s) => {
        if (s.id === editingSubjectId) {
          return {
            ...s,
            name: subjName.trim(),
            desc: subjDesc.trim() || s.desc,
            grades: subjGrades.trim() || s.grades,
            topicsCount: Number(subjTopicsCount) || s.topicsCount,
            color: selectedColor.color,
            bgLight: selectedColor.bgLight,
            iconName: subjIconName,
          };
        }
        return s;
      });
      onSaveSubjects(updated);
      setEditingSubjectId(null);
      showToast('Fan maʼlumotlari yangilandi!');
    }
  };

  const handleDeleteSubject = (subjId: string) => {
    const updated = subjects.filter((s) => s.id !== subjId);
    onSaveSubjects(updated);
    setDeleteConfirmId(null);
    if (editingSubjectId === subjId) setEditingSubjectId(null);
    showToast('Fan roʻyxatdan oʻchirildi');
  };

  const handleResetSubjects = () => {
    if (window.confirm('Barcha fanlar va darsliklarni dastlabki holatiga qaytarishni xohlaysizmi?')) {
      onSaveSubjects(INITIAL_SUBJECTS);
      onSaveTextbooks(TEXTBOOKS);
      setEditingSubjectId(null);
      setIsCreatingSubject(false);
      setEditingBookId(null);
      setIsCreatingBook(false);
      showToast('Dastlabki fanlar va darsliklar tiklandi!');
    }
  };

  // --- Textbook handlers ---
  const startCreateBook = () => {
    setIsCreatingBook(true);
    setEditingBookId(null);
    setBookSubjectId(filterSubjectId !== 'all' ? filterSubjectId : subjects[0]?.id || 'math');
    setBookTitle('');
    setBookAuthor('');
    setBookGrade(7);
    setBookYear(2024);
    setBookPages(220);
    setBookPublisher('Oʻqituvchi NMIU');
    setBookDesc('');
    setBookChapters([
      { num: 1, title: 'Kirish va asosiy tushunchalar', pages: '5–45', summary: 'Mavzuga kirish va dastlabki qoidalar.' },
      { num: 2, title: 'Asosiy qonuniyatlar va formulalar', pages: '46–110', summary: 'Nazariy qoidalar va amaliy misollar.' },
    ]);
    setBookFileData(undefined);
    setBookFileName(undefined);
    setBookFileType(undefined);
    setBookFileSize(undefined);
    setBookFormat('PDF');
  };

  const startEditBook = (book: Textbook) => {
    setEditingBookId(book.id);
    setIsCreatingBook(false);
    setBookSubjectId(book.subjectId);
    setBookTitle(book.title);
    setBookAuthor(book.author);
    setBookGrade(book.grade);
    setBookYear(book.year);
    setBookPages(book.pages);
    setBookPublisher(book.publisher);
    setBookDesc(book.desc);
    setBookChapters([...book.chapters]);
    setBookFileData(book.fileData);
    setBookFileName(book.fileName);
    setBookFileType(book.fileType);
    setBookFileSize(book.fileSize);
    setBookFormat(book.format || 'PDF');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 35 * 1024 * 1024) {
      showToast('Fayl hajmi 35 MB dan kichik boʻlishi kerak');
      return;
    }

    setIsUploadingFile(true);
    const sizeKb = file.size / 1024;
    const sizeMb = sizeKb / 1024;
    const formattedSize = sizeMb >= 1 ? `${sizeMb.toFixed(1)} MB` : `${Math.round(sizeKb)} KB`;

    const extension = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    setBookFileName(file.name);
    setBookFileSize(formattedSize);
    setBookFileType(file.type || extension);
    setBookFormat(extension);

    // Auto-populate title if empty
    if (!bookTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setBookTitle(cleanName);
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setBookFileData(dataUrl);
      setIsUploadingFile(false);
      showToast(`«${file.name}» muvaffaqiyatli yuklandi!`);
    };
    reader.onerror = () => {
      setIsUploadingFile(false);
      showToast('Faylni oʻqishda xatolik yuz berdi');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setBookFileData(undefined);
    setBookFileName(undefined);
    setBookFileType(undefined);
    setBookFileSize(undefined);
    setBookFormat('PDF');
    showToast('Biriktirilgan fayl olib tashlandi');
  };

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;
    const nextNum = bookChapters.length + 1;
    setBookChapters([
      ...bookChapters,
      {
        num: nextNum,
        title: newChapterTitle.trim(),
        pages: newChapterPages.trim() || `${(nextNum - 1) * 35 + 1}–${nextNum * 35}`,
        summary: newChapterSummary.trim() || 'Bobning asosiy nazariy xulosalari va amaliy topshiriqlari.',
      },
    ]);
    setNewChapterTitle('');
    setNewChapterPages('');
    setNewChapterSummary('');
  };

  const handleRemoveChapter = (num: number) => {
    setBookChapters(bookChapters.filter((ch) => ch.num !== num).map((ch, idx) => ({ ...ch, num: idx + 1 })));
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) {
      showToast('Iltimos, darslik nomini kiriting');
      return;
    }
    if (!bookSubjectId) {
      showToast('Iltimos, tegishli fanni tanlang');
      return;
    }

    if (isCreatingBook) {
      const newBook: Textbook = {
        id: `book_${Date.now()}`,
        subjectId: bookSubjectId,
        title: bookTitle.trim(),
        author: bookAuthor.trim() || 'Mualliflar jamoasi',
        grade: Number(bookGrade) || 7,
        year: Number(bookYear) || 2024,
        pages: Number(bookPages) || 200,
        format: bookFormat || 'PDF',
        publisher: bookPublisher.trim() || 'Oʻzbekiston Respublikasi Maktabgacha va maktab taʼlimi vazirligi',
        desc: bookDesc.trim() || 'Umumtaʼlim maktablari uchun rasmiy oʻquv darsligi.',
        coverHue: 215,
        chapters: bookChapters.length > 0 ? bookChapters : [
          { num: 1, title: '1-bob. Kirish qismi', pages: '4–50', summary: 'Nazariy asoslar.' },
        ],
        fileData: bookFileData,
        fileName: bookFileName,
        fileType: bookFileType,
        fileSize: bookFileSize,
      };
      onSaveTextbooks([...textbooks, newBook]);
      setIsCreatingBook(false);
      showToast('Yangi darslik muvaffaqiyatli saqlandi!');
    } else if (editingBookId) {
      const updated = textbooks.map((b) => {
        if (b.id === editingBookId) {
          return {
            ...b,
            subjectId: bookSubjectId,
            title: bookTitle.trim(),
            author: bookAuthor.trim() || b.author,
            grade: Number(bookGrade) || b.grade,
            year: Number(bookYear) || b.year,
            pages: Number(bookPages) || b.pages,
            format: bookFormat || b.format || 'PDF',
            publisher: bookPublisher.trim() || b.publisher,
            desc: bookDesc.trim() || b.desc,
            chapters: bookChapters,
            fileData: bookFileData !== undefined ? bookFileData : b.fileData,
            fileName: bookFileName !== undefined ? bookFileName : b.fileName,
            fileType: bookFileType !== undefined ? bookFileType : b.fileType,
            fileSize: bookFileSize !== undefined ? bookFileSize : b.fileSize,
          };
        }
        return b;
      });
      onSaveTextbooks(updated);
      setEditingBookId(null);
      showToast('Darslik maʼlumotlari yangilandi!');
    }
  };

  const handleDeleteBook = (bookId: string) => {
    const updated = textbooks.filter((b) => b.id !== bookId);
    onSaveTextbooks(updated);
    setDeleteConfirmId(null);
    if (editingBookId === bookId) setEditingBookId(null);
    showToast('Darslik oʻchirildi');
  };

  // Filtered textbooks list
  const filteredTextbooks = filterSubjectId === 'all'
    ? textbooks
    : textbooks.filter((b) => b.subjectId === filterSubjectId);

  // Selected icon component for live preview
  const PreviewIcon = getSubjectIcon(subjIconName);
  const previewColor = COLOR_OPTIONS.find((c) => c.id === subjColorId) || COLOR_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between gap-4 bg-[#f3f5f2]/70 dark:bg-[#0f1613]/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/15 text-[#0a7d5a] dark:text-[#3cc99a] flex items-center justify-center flex-none">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ffc83d]/20 text-[#3a2b00] dark:text-[#ffd25e]">
                  Fanlar boshqaruvi
                </span>
                <span className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                  {subjects.length} ta fan · {textbooks.length} ta darslik
                </span>
              </div>
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#14211b] dark:text-[#e9f1ec] leading-tight">
                Fanlar va darsliklar muharriri
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetSubjects}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-[#5a6a62] dark:text-[#9db0a5] transition-colors"
              title="Dastlabki holatga qaytarish"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tiklash</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-center text-[#14211b] dark:text-[#e9f1ec] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-[#dfe6e1] dark:border-[#28372f] px-4 sm:px-6 bg-white dark:bg-[#17211c]">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setActiveTab('subjects');
                setIsCreatingBook(false);
                setEditingBookId(null);
              }}
              className={`py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'subjects'
                  ? 'border-[#0a7d5a] dark:border-[#3cc99a] text-[#0a7d5a] dark:text-[#3cc99a]'
                  : 'border-transparent text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b] dark:hover:text-[#e9f1ec]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Fanlar roʻyxati ({subjects.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('textbooks');
                setIsCreatingSubject(false);
                setEditingSubjectId(null);
              }}
              className={`py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'textbooks'
                  ? 'border-[#0a7d5a] dark:border-[#3cc99a] text-[#0a7d5a] dark:text-[#3cc99a]'
                  : 'border-transparent text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b] dark:hover:text-[#e9f1ec]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Darsliklar bazasi ({textbooks.length})</span>
            </button>
          </div>

          {activeTab === 'subjects' && !isCreatingSubject && !editingSubjectId && (
            <button
              type="button"
              onClick={startCreateSubject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] text-xs font-bold rounded-xl hover:brightness-105 shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yangi fan</span>
            </button>
          )}

          {activeTab === 'textbooks' && !isCreatingBook && !editingBookId && (
            <button
              type="button"
              onClick={startCreateBook}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] text-xs font-bold rounded-xl hover:brightness-105 shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yangi darslik</span>
            </button>
          )}
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 text-center animate-in fade-in">
            {toastMsg}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f3f5f2]/40 dark:bg-[#0f1613]/40">
          
          {/* ======================= TAB 1: SUBJECTS ======================= */}
          {activeTab === 'subjects' && (
            <div>
              {/* Form: Create or Edit Subject */}
              {(isCreatingSubject || editingSubjectId) ? (
                <div className="bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] rounded-2xl p-5 sm:p-6 shadow-md mb-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#dfe6e1] dark:border-[#28372f] mb-5">
                    <h3 className="font-display font-bold text-base text-[#14211b] dark:text-[#e9f1ec] flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-[#0a7d5a] dark:text-[#3cc99a]" />
                      <span>{isCreatingSubject ? 'Yangi fan qoʻshish' : 'Fanni tahrirlash'}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingSubject(false);
                        setEditingSubjectId(null);
                      }}
                      className="text-xs text-[#5a6a62] hover:underline"
                    >
                      Bekor qilish
                    </button>
                  </div>

                  <form onSubmit={handleSaveSubject} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Name */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Fan nomi *
                        </label>
                        <input
                          type="text"
                          required
                          value={subjName}
                          onChange={(e) => setSubjName(e.target.value)}
                          placeholder="Masalan: Astronomiya, Fransuz tili, Robototexnika..."
                          className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec] focus:outline-none focus:ring-2 focus:ring-[#0a7d5a]/30"
                        />
                      </div>

                      {/* Grades */}
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Sinflar koʻlami
                        </label>
                        <input
                          type="text"
                          value={subjGrades}
                          onChange={(e) => setSubjGrades(e.target.value)}
                          placeholder="Masalan: 5–11-sinflar"
                          className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec] focus:outline-none focus:ring-2 focus:ring-[#0a7d5a]/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Topics Count */}
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Mavzular soni
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="500"
                          value={subjTopicsCount}
                          onChange={(e) => setSubjTopicsCount(Number(e.target.value))}
                          className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec] focus:outline-none focus:ring-2 focus:ring-[#0a7d5a]/30"
                        />
                      </div>

                      {/* Description */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Qisqacha tavsifi
                        </label>
                        <input
                          type="text"
                          value={subjDesc}
                          onChange={(e) => setSubjDesc(e.target.value)}
                          placeholder="Mavzular, yoʻnalishlar va darsliklar haqida qisqacha..."
                          className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec] focus:outline-none focus:ring-2 focus:ring-[#0a7d5a]/30"
                        />
                      </div>
                    </div>

                    {/* Icon Selection */}
                    <div>
                      <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1.5">
                        Fanning belgisi (Icon)
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1.5 border border-[#dfe6e1] dark:border-[#28372f] rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613]">
                        {ICON_OPTIONS.map((opt) => {
                          const IconComp = opt.icon;
                          const isSelected = subjIconName === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSubjIconName(opt.id)}
                              className={`p-2 rounded-lg flex items-center gap-1.5 text-xs transition-all ${
                                isSelected
                                  ? 'bg-[#0a7d5a] text-white font-bold shadow-xs'
                                  : 'bg-white dark:bg-[#17211c] text-[#14211b] dark:text-[#e9f1ec] hover:border-[#0a7d5a]'
                              }`}
                            >
                              <IconComp className="w-4 h-4 flex-none" />
                              <span className="truncate text-[11px]">{opt.label.split(' ')[0]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Color Theme Selection */}
                    <div>
                      <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1.5">
                        Rang mavzusi
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {COLOR_OPTIONS.map((col) => {
                          const isSelected = subjColorId === col.id;
                          return (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() => setSubjColorId(col.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                                isSelected
                                  ? 'border-[#0a7d5a] ring-2 ring-[#0a7d5a]/30 font-bold bg-white dark:bg-[#17211c]'
                                  : 'border-[#dfe6e1] dark:border-[#28372f] bg-white/50 dark:bg-[#17211c]/50'
                              }`}
                            >
                              <span className={`w-3 h-3 rounded-full ${col.bgLight.split(' ')[0]}`} />
                              <span>{col.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Live Preview Card */}
                    <div className="pt-3 border-t border-[#dfe6e1] dark:border-[#28372f]">
                      <span className="text-[11px] font-bold text-[#5a6a62] dark:text-[#9db0a5] uppercase tracking-wider block mb-2">
                        Jonli koʻrinishi:
                      </span>
                      <div className="max-w-xs p-4 rounded-2xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] shadow-xs">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${previewColor.bgLight}`}>
                            <PreviewIcon className={`w-5 h-5 ${previewColor.color}`} />
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[#5a6a62] dark:text-[#9db0a5]">
                            {subjGrades || '5–11-sinflar'}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-[#14211b] dark:text-[#e9f1ec] truncate">
                          {subjName || 'Fan nomi'}
                        </h4>
                        <p className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] line-clamp-1 mt-0.5">
                          {subjDesc || 'Fan tavsifi...'}
                        </p>
                        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px] text-[#0a7d5a] dark:text-[#3cc99a] font-semibold">
                          <span>{subjTopicsCount} ta mavzu</span>
                          <span>Darsliklar →</span>
                        </div>
                      </div>
                    </div>

                    {/* Submit buttons */}
                    <div className="flex items-center gap-2 pt-3">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] text-xs font-bold rounded-xl hover:brightness-105 transition-all shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isCreatingSubject ? 'Fanni saqlash' : 'Oʻzgarishlarni saqlash'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingSubject(false);
                          setEditingSubjectId(null);
                        }}
                        className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              {/* Subjects Table / List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {subjects.map((subj) => {
                  const SubjIcon = getSubjectIcon(subj.iconName || subj.id);
                  const isConfirming = deleteConfirmId === subj.id;

                  return (
                    <div
                      key={subj.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${subj.bgLight}`}>
                            <SubjIcon className={`w-5 h-5 ${subj.color}`} />
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[#5a6a62] dark:text-[#9db0a5]">
                            {subj.grades}
                          </span>
                        </div>

                        <h4 className="font-display font-bold text-sm text-[#14211b] dark:text-[#e9f1ec] line-clamp-1">
                          {subj.name}
                        </h4>
                        <p className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] line-clamp-2 mt-1 leading-relaxed">
                          {subj.desc}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#0a7d5a] dark:text-[#3cc99a]">
                          {subj.topicsCount} ta mavzu
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => startEditSubject(subj)}
                            className="p-1.5 rounded-lg border border-[#dfe6e1] dark:border-[#28372f] text-[#0a7d5a] dark:text-[#3cc99a] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                            title="Tahrirlash"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {isConfirming ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteSubject(subj.id)}
                              className="px-2 py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold"
                            >
                              Oʻchirish?
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(subj.id)}
                              className="p-1.5 rounded-lg border border-[#dfe6e1] dark:border-[#28372f] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                              title="Oʻchirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= TAB 2: TEXTBOOKS ======================= */}
          {activeTab === 'textbooks' && (
            <div>
              {/* Filter bar */}
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#5a6a62] dark:text-[#9db0a5]" />
                  <span className="text-xs font-bold text-[#14211b] dark:text-[#e9f1ec]">Fan boʻyicha saralash:</span>
                  <select
                    value={filterSubjectId}
                    onChange={(e) => setFilterSubjectId(e.target.value)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-[#14211b] dark:text-[#e9f1ec] focus:outline-none focus:ring-2 focus:ring-[#0a7d5a]/30"
                  >
                    <option value="all">Barcha fanlar darsliklari ({textbooks.length})</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({textbooks.filter((b) => b.subjectId === s.id).length})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form: Create or Edit Textbook */}
              {(isCreatingBook || editingBookId) ? (
                <div className="bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] rounded-2xl p-5 sm:p-6 shadow-md mb-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#dfe6e1] dark:border-[#28372f] mb-5">
                    <h3 className="font-display font-bold text-base text-[#14211b] dark:text-[#e9f1ec] flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#0a7d5a] dark:text-[#3cc99a]" />
                      <span>{isCreatingBook ? 'Yangi darslik qoʻshish' : 'Darslikni tahrirlash'}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingBook(false);
                        setEditingBookId(null);
                      }}
                      className="text-xs text-[#5a6a62] hover:underline"
                    >
                      Bekor qilish
                    </button>
                  </div>

                  <form onSubmit={handleSaveBook} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Subject selector */}
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Tegishli fan *
                        </label>
                        <select
                          required
                          value={bookSubjectId}
                          onChange={(e) => setBookSubjectId(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec]"
                        >
                          <option value="">Fanni tanlang</option>
                          {subjects.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Title */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Darslik nomi *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookTitle}
                          onChange={(e) => setBookTitle(e.target.value)}
                          placeholder="Masalan: Fizika 9-sinf darsligi..."
                          className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {/* Author */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Mualliflar
                        </label>
                        <input
                          type="text"
                          value={bookAuthor}
                          onChange={(e) => setBookAuthor(e.target.value)}
                          placeholder="Masalan: P. Habibullayev, A. Boydedayev"
                          className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec]"
                        />
                      </div>

                      {/* Grade */}
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Sinf (1–11)
                        </label>
                        <select
                          value={bookGrade}
                          onChange={(e) => setBookGrade(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec]"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                            <option key={g} value={g}>
                              {g}-sinf
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Year */}
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Nashr yili
                        </label>
                        <input
                          type="number"
                          value={bookYear}
                          onChange={(e) => setBookYear(Number(e.target.value))}
                          className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Publisher */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Nashriyot
                        </label>
                        <input
                          type="text"
                          value={bookPublisher}
                          onChange={(e) => setBookPublisher(e.target.value)}
                          placeholder="Oʻqituvchi, Oʻzbekiston, Sharq..."
                          className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec]"
                        />
                      </div>

                      {/* Pages */}
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Sahifalar soni
                        </label>
                        <input
                          type="number"
                          value={bookPages}
                          onChange={(e) => setBookPages(Number(e.target.value))}
                          className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec]"
                        />
                      </div>
                    </div>

                    {/* Desc */}
                    <div>
                      <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                        Darslik tavsifi
                      </label>
                      <textarea
                        rows={2}
                        value={bookDesc}
                        onChange={(e) => setBookDesc(e.target.value)}
                        placeholder="Ushbu darslik mavzulari haqida qisqacha maʼlumot..."
                        className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec]"
                      />
                    </div>

                    {/* Darslik fayli yuklash (PDF, DOC, DOCX, TXT) */}
                    <div className="p-4 rounded-2xl border border-dashed border-[#0a7d5a]/40 dark:border-[#3cc99a]/40 bg-[#0a7d5a]/5 dark:bg-[#3cc99a]/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] flex items-center gap-1.5">
                          <Paperclip className="w-4 h-4 text-[#0a7d5a] dark:text-[#3cc99a]" />
                          <span>Darslik elektron fayli (PDF, DOC, DOCX, TXT)</span>
                        </span>
                        <span className="text-[10px] font-semibold text-[#0a7d5a] dark:text-[#3cc99a] bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/15 px-2 py-0.5 rounded-md">
                          Sahifada toʻliq ochiladi
                        </span>
                      </div>

                      {bookFileData ? (
                        <div className="p-3.5 rounded-xl bg-white dark:bg-[#17211c] border border-emerald-500/30 flex items-center justify-between gap-3 shadow-xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs flex-none ${
                              bookFormat === 'PDF'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                : bookFormat === 'DOC' || bookFormat === 'DOCX'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {bookFormat || 'FILE'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] truncate">
                                {bookFileName || 'darslik_fayli'}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-[#5a6a62] dark:text-[#9db0a5]">
                                  Hajmi: {bookFileSize || '—'}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Biriktirilgan
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-none">
                            <label className="cursor-pointer py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold text-[#14211b] dark:text-[#e9f1ec] transition-colors">
                              Almashtirish
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt,.rtf,.odt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                              title="Faylni oʻchirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="cursor-pointer flex flex-col items-center justify-center p-5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-[#0a7d5a] dark:hover:border-[#3cc99a] bg-white/70 dark:bg-[#17211c]/70 hover:bg-white dark:hover:bg-[#17211c] transition-all group">
                            <UploadCloud className="w-8 h-8 text-[#0a7d5a] dark:text-[#3cc99a] group-hover:scale-110 transition-transform mb-2" />
                            <span className="text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] text-center">
                              {isUploadingFile ? 'Fayl yuklanmoqda...' : 'Darslik faylini yuklash uchun bosing yoki faylni tanlang'}
                            </span>
                            <span className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] mt-1 text-center">
                              Qoʻllab-quvvatlanadi: .PDF, .DOC, .DOCX, .TXT (maksimal 35 MB)
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.txt,.rtf,.odt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                              onChange={handleFileUpload}
                              disabled={isUploadingFile}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Chapters List (Mundarija) */}
                    <div className="p-4 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-[#f3f5f2]/60 dark:bg-[#0f1613]/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] flex items-center gap-1.5">
                          <BookMarked className="w-3.5 h-3.5 text-[#0a7d5a] dark:text-[#3cc99a]" />
                          <span>Darslik mundarijasi ({bookChapters.length} ta bob)</span>
                        </span>
                      </div>

                      {bookChapters.length > 0 && (
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {bookChapters.map((ch) => (
                            <div
                              key={ch.num}
                              className="p-2 rounded-lg bg-white dark:bg-[#17211c] border border-gray-200 dark:border-gray-800 text-xs flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <span className="font-bold text-[#0a7d5a] dark:text-[#3cc99a] mr-2">
                                  {ch.num}-bob:
                                </span>
                                <span className="text-[#14211b] dark:text-[#e9f1ec]">{ch.title}</span>
                                <span className="text-[10px] text-[#5a6a62] dark:text-[#9db0a5] ml-2">
                                  ({ch.pages}-betlar)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveChapter(ch.num)}
                                className="text-red-500 hover:text-red-700 p-1 flex-none"
                                title="Bobni oʻchirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add new chapter inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={newChapterTitle}
                            onChange={(e) => setNewChapterTitle(e.target.value)}
                            placeholder="Yangi bob nomi (masalan: 3-bob. Dinamika qonunlari)..."
                            className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#17211c] border border-gray-300 dark:border-gray-700 text-[#14211b] dark:text-[#e9f1ec]"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={newChapterPages}
                            onChange={(e) => setNewChapterPages(e.target.value)}
                            placeholder="Sahifalar (masalan: 80–120)"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#17211c] border border-gray-300 dark:border-gray-700 text-[#14211b] dark:text-[#e9f1ec]"
                          />
                          <button
                            type="button"
                            onClick={handleAddChapter}
                            className="px-3 py-1.5 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] text-xs font-bold rounded-lg flex-none"
                          >
                            Qoʻshish
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Submit buttons */}
                    <div className="flex items-center gap-2 pt-3">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] text-xs font-bold rounded-xl hover:brightness-105 transition-all shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isCreatingBook ? 'Darslikni saqlash' : 'Oʻzgarishlarni saqlash'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingBook(false);
                          setEditingBookId(null);
                        }}
                        className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              {/* Textbooks Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredTextbooks.map((book) => {
                  const parentSubject = subjects.find((s) => s.id === book.subjectId);
                  const isConfirming = deleteConfirmId === book.id;

                  return (
                    <div
                      key={book.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/15 text-[#0a7d5a] dark:text-[#3cc99a]">
                            {parentSubject ? parentSubject.name : book.subjectId}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[#5a6a62] dark:text-[#9db0a5]">
                            {book.grade}-sinf
                          </span>
                        </div>

                        <h4 className="font-display font-bold text-sm text-[#14211b] dark:text-[#e9f1ec] line-clamp-1">
                          {book.title}
                        </h4>
                        <p className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] line-clamp-1 mt-0.5">
                          {book.author} · {book.publisher} ({book.year})
                        </p>
                        <p className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] line-clamp-2 mt-1 leading-relaxed">
                          {book.desc}
                        </p>
                      </div>

                      <div className="mt-2.5">
                        {book.fileData ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{book.format || 'Fayl'} biriktirilgan ({book.fileSize || 'Tayyor'})</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px]">
                            <File className="w-3 h-3 opacity-60" />
                            <span>Fayl yuklanmagan (mundarija rejimi)</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between">
                        <span className="text-[11px] font-medium text-[#5a6a62] dark:text-[#9db0a5] flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-[#0a7d5a] dark:text-[#3cc99a]" />
                          <span>{book.chapters.length} ta bob · {book.pages} bet</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => startEditBook(book)}
                            className="p-1.5 rounded-lg border border-[#dfe6e1] dark:border-[#28372f] text-[#0a7d5a] dark:text-[#3cc99a] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                            title="Tahrirlash"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {isConfirming ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteBook(book.id)}
                              className="px-2 py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold"
                            >
                              Oʻchirish?
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(book.id)}
                              className="p-1.5 rounded-lg border border-[#dfe6e1] dark:border-[#28372f] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                              title="Oʻchirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-[#dfe6e1] dark:border-[#28372f] bg-[#f3f5f2]/70 dark:bg-[#0f1613]/70 flex items-center justify-between text-xs text-[#5a6a62] dark:text-[#9db0a5]">
          <span>Kiritilgan barcha oʻzgarishlar avtomatik brauzer xotirasida saqlanadi.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec] font-bold hover:bg-gray-50"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
