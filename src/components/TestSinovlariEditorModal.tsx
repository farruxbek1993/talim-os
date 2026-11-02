import React, { useState, useMemo } from 'react';
import {
  TestPackage,
  Question,
  TestCategoryKey,
  TEST_CATEGORIES,
  TEST_PACKAGES,
} from '../data/testsData';
import {
  X,
  Plus,
  Edit3,
  Trash2,
  Save,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  HelpCircle,
  Sparkles,
  Layers,
  Check,
  AlertTriangle,
  Compass,
  Calculator,
  Dna,
  Languages,
} from 'lucide-react';

interface TestSinovlariEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tests: TestPackage[];
  onSaveTests: (tests: TestPackage[]) => void;
}

export const TestSinovlariEditorModal: React.FC<TestSinovlariEditorModalProps> = ({
  isOpen,
  onClose,
  tests,
  onSaveTests,
}) => {
  // Tabs: 'packages' (Test to'plamlari) or 'questions' (Savollar muharriri)
  const [activeTab, setActiveTab] = useState<'packages' | 'questions'>('packages');
  const [filterCat, setFilterCat] = useState<TestCategoryKey | 'all'>('all');

  // --- Package Create/Edit State ---
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [isCreatingPkg, setIsCreatingPkg] = useState(false);
  const [formCategory, setFormCategory] = useState<TestCategoryKey>('umumiy');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDuration, setFormDuration] = useState<number>(20);
  const [formMaxScore, setFormMaxScore] = useState<number>(35);
  const [formDifficulty, setFormDifficulty] = useState<'Oson' | 'Oʻrtacha' | 'Murakkab'>('Oʻrtacha');

  // --- Questions Management State ---
  const [selectedPkgIdForQuestions, setSelectedPkgIdForQuestions] = useState<string>(
    tests[0]?.id || ''
  );
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);

  // Form for question
  const [qText, setQText] = useState('');
  const [qOpt0, setQOpt0] = useState('');
  const [qOpt1, setQOpt1] = useState('');
  const [qOpt2, setQOpt2] = useState('');
  const [qOpt3, setQOpt3] = useState('');
  const [qCorrect, setQCorrect] = useState<number>(0);
  const [qExplanation, setQExplanation] = useState('');

  // Toast and delete confirm
  const [toastMsg, setToastMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmQId, setDeleteConfirmQId] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  };

  // Find currently active package for questions
  const currentActivePackage = useMemo(() => {
    return tests.find((t) => t.id === selectedPkgIdForQuestions) || tests[0] || null;
  }, [tests, selectedPkgIdForQuestions]);

  const filteredTests = useMemo(() => {
    if (filterCat === 'all') return tests;
    return tests.filter((t) => t.category === filterCat);
  }, [tests, filterCat]);

  // SAFE EARLY RETURN AFTER ALL HOOKS
  if (!isOpen) return null;

  // Helpers for category metadata
  const getCategoryMeta = (cat: TestCategoryKey) => {
    switch (cat) {
      case 'umumiy':
        return {
          categoryName: 'Umumiy testlar',
          gradient: 'from-amber-500 via-orange-500 to-rose-500',
          badgeColor: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-400/30',
          iconName: 'compass' as const,
        };
      case 'tarix':
        return {
          categoryName: 'Tarix fani',
          gradient: 'from-amber-600 via-yellow-600 to-orange-700',
          badgeColor: 'bg-amber-600/15 text-amber-900 dark:text-amber-300 border-amber-500/30',
          iconName: 'book' as const,
        };
      case 'algebra':
        return {
          categoryName: 'Algebra',
          gradient: 'from-blue-600 via-cyan-600 to-teal-600',
          badgeColor: 'bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-400/30',
          iconName: 'calculator' as const,
        };
      case 'biologiya':
        return {
          categoryName: 'Biologiya',
          gradient: 'from-emerald-600 via-teal-600 to-green-700',
          badgeColor: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-400/30',
          iconName: 'dna' as const,
        };
      case 'ingliz':
        return {
          categoryName: 'Ingliz tili',
          gradient: 'from-indigo-600 via-blue-600 to-sky-600',
          badgeColor: 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border-indigo-400/30',
          iconName: 'languages' as const,
        };
    }
  };

  // --- Package Actions ---
  const handleStartCreatePkg = () => {
    setIsCreatingPkg(true);
    setEditingPkgId(null);
    setFormCategory('umumiy');
    setFormTitle('');
    setFormDesc('');
    setFormDuration(20);
    setFormMaxScore(35);
    setFormDifficulty('Oʻrtacha');
  };

  const handleStartEditPkg = (pkg: TestPackage) => {
    setIsCreatingPkg(false);
    setEditingPkgId(pkg.id);
    setFormCategory(pkg.category);
    setFormTitle(pkg.title);
    setFormDesc(pkg.description);
    setFormDuration(pkg.durationMinutes);
    setFormMaxScore(pkg.maxScore);
    setFormDifficulty(pkg.difficulty);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Iltimos, test toʻplami nomini kiriting!');
      return;
    }

    const meta = getCategoryMeta(formCategory);

    if (isCreatingPkg) {
      const newPkg: TestPackage = {
        id: `test_${formCategory}_${Date.now()}`,
        category: formCategory,
        categoryName: meta.categoryName,
        title: formTitle.trim(),
        description: formDesc.trim() || `${meta.categoryName} boʻyicha yangi test topshiriqlari majmuasi.`,
        durationMinutes: Number(formDuration) || 20,
        maxScore: Number(formMaxScore) || 35,
        difficulty: formDifficulty,
        participantsCount: 0,
        rating: 5.0,
        gradient: meta.gradient,
        badgeColor: meta.badgeColor,
        iconName: meta.iconName,
        questions: [
          {
            id: 1,
            question: `${formTitle.trim()} boʻyicha 1-namuna savol: Quyidagilardan toʻgʻri javobni tanlang.`,
            options: ['Toʻgʻri javob varianti (A)', 'Notoʻgʻri variant (B)', 'Notoʻgʻri variant (C)', 'Notoʻgʻri variant (D)'],
            correctAnswer: 0,
            explanation: 'Namuna savol uchun tushuntirish matni.',
          },
        ],
      };

      const updated = [newPkg, ...tests];
      onSaveTests(updated);
      setSelectedPkgIdForQuestions(newPkg.id);
      setIsCreatingPkg(false);
      showToast('Yangi test toʻplami muvaffaqiyatli yaratildi!');
    } else if (editingPkgId) {
      const updated = tests.map((t) => {
        if (t.id === editingPkgId) {
          return {
            ...t,
            category: formCategory,
            categoryName: meta.categoryName,
            title: formTitle.trim(),
            description: formDesc.trim(),
            durationMinutes: Number(formDuration) || 20,
            maxScore: Number(formMaxScore) || 35,
            difficulty: formDifficulty,
            gradient: meta.gradient,
            badgeColor: meta.badgeColor,
            iconName: meta.iconName,
          };
        }
        return t;
      });

      onSaveTests(updated);
      setEditingPkgId(null);
      showToast('Test toʻplami yangilandi!');
    }
  };

  const handleDeletePackage = (pkgId: string) => {
    if (tests.length <= 1) {
      showToast('Oxirgi test toʻplamini oʻchirib boʻlmaydi!');
      return;
    }
    const updated = tests.filter((t) => t.id !== pkgId);
    onSaveTests(updated);
    setDeleteConfirmId(null);
    if (selectedPkgIdForQuestions === pkgId) {
      setSelectedPkgIdForQuestions(updated[0]?.id || '');
    }
    showToast('Test toʻplami oʻchirildi.');
  };

  // --- Questions Actions ---
  const handleStartCreateQuestion = () => {
    setIsCreatingQuestion(true);
    setEditingQuestionId(null);
    setQText('');
    setQOpt0('');
    setQOpt1('');
    setQOpt2('');
    setQOpt3('');
    setQCorrect(0);
    setQExplanation('');
  };

  const handleStartEditQuestion = (q: Question) => {
    setIsCreatingQuestion(false);
    setEditingQuestionId(q.id);
    setQText(q.question);
    setQOpt0(q.options[0] || '');
    setQOpt1(q.options[1] || '');
    setQOpt2(q.options[2] || '');
    setQOpt3(q.options[3] || '');
    setQCorrect(q.correctAnswer ?? 0);
    setQExplanation(q.explanation || '');
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentActivePackage) return;
    if (!qText.trim()) {
      showToast('Savol matnini kiriting!');
      return;
    }
    if (!qOpt0.trim() || !qOpt1.trim()) {
      showToast('Kamida A va B variantlarini toʻldiring!');
      return;
    }

    const options = [
      qOpt0.trim(),
      qOpt1.trim(),
      qOpt2.trim() || 'Javob yoʻq',
      qOpt3.trim() || 'Javob yoʻq',
    ];

    let updatedQuestions: Question[] = [];

    if (isCreatingQuestion) {
      const newQ: Question = {
        id: Date.now(),
        question: qText.trim(),
        options,
        correctAnswer: qCorrect,
        explanation: qExplanation.trim() || 'Toʻgʻri javob uchun rasmiy darslik va manbalar asosida tushuntirish.',
      };
      updatedQuestions = [...currentActivePackage.questions, newQ];
      setIsCreatingQuestion(false);
      showToast('Yangi savol testga qoʻshildi!');
    } else if (editingQuestionId !== null) {
      updatedQuestions = currentActivePackage.questions.map((q) => {
        if (q.id === editingQuestionId) {
          return {
            ...q,
            question: qText.trim(),
            options,
            correctAnswer: qCorrect,
            explanation: qExplanation.trim(),
          };
        }
        return q;
      });
      setEditingQuestionId(null);
      showToast('Savol yangilandi!');
    }

    const updatedTests = tests.map((t) => {
      if (t.id === currentActivePackage.id) {
        return {
          ...t,
          questions: updatedQuestions,
        };
      }
      return t;
    });

    onSaveTests(updatedTests);
  };

  const handleDeleteQuestion = (qId: number) => {
    if (!currentActivePackage) return;
    if (currentActivePackage.questions.length <= 1) {
      showToast('Test toʻplamida kamida 1 ta savol qolishi kerak!');
      return;
    }

    const updatedQuestions = currentActivePackage.questions.filter((q) => q.id !== qId);
    const updatedTests = tests.map((t) => {
      if (t.id === currentActivePackage.id) {
        return {
          ...t,
          questions: updatedQuestions,
        };
      }
      return t;
    });

    onSaveTests(updatedTests);
    setDeleteConfirmQId(null);
    showToast('Savol oʻchirildi.');
  };

  const handleResetToDefault = () => {
    onSaveTests(TEST_PACKAGES);
    setSelectedPkgIdForQuestions(TEST_PACKAGES[0]?.id || '');
    setIsCreatingPkg(false);
    setEditingPkgId(null);
    setIsCreatingQuestion(false);
    setEditingQuestionId(null);
    showToast('Barcha testlar dastlabki holatga qaytarildi!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white dark:bg-[#14211b] border border-[#dfe6e1] dark:border-[#28372f] rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between gap-3 bg-gray-50/80 dark:bg-[#192721]/80 flex-none">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#0a7d5a]/15 text-[#0a7d5a] dark:text-[#3cc99a] flex items-center justify-center flex-none shadow-sm">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base sm:text-lg text-[#14211b] dark:text-[#e9f1ec]">
                  Test Sinovlari Muharriri
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#0a7d5a] text-white">
                  Boshqaruv
                </span>
              </div>
              <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                Umumiy testlar, fanlar boʻyicha toʻplamlar, savollar va toʻgʻri javoblarni tahrirlash
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="py-1.5 px-3 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] hover:border-amber-500 text-xs font-semibold text-[#5a6a62] dark:text-[#9db0a5] hover:text-amber-600 flex items-center gap-1.5 transition-colors"
              title="Dastlabki testlarni qayta tiklash"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dastlabki holat</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#5a6a62] hover:text-[#14211b] dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-[#23352d] transition-colors"
              title="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-5 py-2.5 border-b border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between gap-3 bg-white dark:bg-[#17211c] flex-none">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('packages');
                setIsCreatingQuestion(false);
                setEditingQuestionId(null);
              }}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'packages'
                  ? 'bg-[#0a7d5a] text-white shadow-xs'
                  : 'text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b] hover:bg-gray-100 dark:hover:bg-[#23352d]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Test Toʻplamlari ({tests.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('questions');
                setIsCreatingPkg(false);
                setEditingPkgId(null);
              }}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'questions'
                  ? 'bg-[#0a7d5a] text-white shadow-xs'
                  : 'text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b] hover:bg-gray-100 dark:hover:bg-[#23352d]'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Savollar Boshqaruvi</span>
              {currentActivePackage && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20">
                  {currentActivePackage.questions.length} ta
                </span>
              )}
            </button>
          </div>

          {activeTab === 'packages' ? (
            <button
              type="button"
              onClick={handleStartCreatePkg}
              className="py-1.5 px-3 bg-[#0a7d5a] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#086347] flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi test toʻplami</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartCreateQuestion}
              className="py-1.5 px-3 bg-[#0a7d5a] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#086347] flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi savol qoʻshish</span>
            </button>
          )}
        </div>

        {/* Toast Feedback */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 text-center flex items-center justify-center gap-2 animate-in slide-in-from-top flex-none">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* ================= TAB 1: TEST PACKAGES ================= */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              
              {/* Form to Create or Edit Package */}
              {(isCreatingPkg || editingPkgId) && (
                <form
                  onSubmit={handleSavePackage}
                  className="p-5 rounded-3xl bg-gray-50/80 dark:bg-[#1a2923] border border-[#0a7d5a]/40 shadow-sm space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#dfe6e1] dark:border-[#28372f]">
                    <h4 className="font-bold text-sm sm:text-base text-[#14211b] dark:text-[#e9f1ec] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#0a7d5a]" />
                      <span>{isCreatingPkg ? 'Yangi Test Toʻplami Yaratish' : 'Test Toʻplamini Tahrirlash'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingPkg(false);
                        setEditingPkgId(null);
                      }}
                      className="p-1 rounded-lg text-[#5a6a62] hover:bg-gray-200 dark:hover:bg-[#23352d]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-xs font-bold text-[#5a6a62] dark:text-[#9db0a5] mb-1">
                        Yoʻnalish / Fanni tanlang:
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as TestCategoryKey)}
                        className="w-full p-2.5 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-xs font-semibold text-[#14211b] dark:text-[#e9f1ec] focus:outline-[#0a7d5a]"
                      >
                        <option value="umumiy">Umumiy testlar</option>
                        <option value="tarix">Tarix fani</option>
                        <option value="algebra">Algebra</option>
                        <option value="biologiya">Biologiya</option>
                        <option value="ingliz">Ingliz tili</option>
                      </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-xs font-bold text-[#5a6a62] dark:text-[#9db0a5] mb-1">
                        Murakkablik darajasi:
                      </label>
                      <select
                        value={formDifficulty}
                        onChange={(e) => setFormDifficulty(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-xs font-semibold text-[#14211b] dark:text-[#e9f1ec] focus:outline-[#0a7d5a]"
                      >
                        <option value="Oson">Oson</option>
                        <option value="Oʻrtacha">Oʻrtacha</option>
                        <option value="Murakkab">Murakkab</option>
                      </select>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold text-[#5a6a62] dark:text-[#9db0a5] mb-1">
                      Test Toʻplami Nomi:
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Masalan: DTM Standarti: 9-sinf Geometriya va Trigonometriya..."
                      className="w-full p-2.5 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-xs font-semibold text-[#14211b] dark:text-[#e9f1ec] focus:outline-[#0a7d5a]"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-[#5a6a62] dark:text-[#9db0a5] mb-1">
                      Tavsif (Qisqacha mazmuni):
                    </label>
                    <textarea
                      rows={2}
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Mavzular, qamrab olingan darslik boʻlimlari haqida qisqacha maʼlumot..."
                      className="w-full p-2.5 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-xs font-medium text-[#14211b] dark:text-[#e9f1ec] focus:outline-[#0a7d5a]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Duration in Minutes */}
                    <div>
                      <label className="block text-xs font-bold text-[#5a6a62] dark:text-[#9db0a5] mb-1">
                        Ajratilgan vaqt (daqiqa):
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={180}
                        value={formDuration}
                        onChange={(e) => setFormDuration(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-xs font-semibold text-[#14211b] dark:text-[#e9f1ec] focus:outline-[#0a7d5a]"
                      />
                    </div>

                    {/* Max Score */}
                    <div>
                      <label className="block text-xs font-bold text-[#5a6a62] dark:text-[#9db0a5] mb-1">
                        Maksimal ball:
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={200}
                        value={formMaxScore}
                        onChange={(e) => setFormMaxScore(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-xs font-semibold text-[#14211b] dark:text-[#e9f1ec] focus:outline-[#0a7d5a]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingPkg(false);
                        setEditingPkgId(null);
                      }}
                      className="py-2 px-4 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] text-xs font-bold hover:bg-gray-100 dark:hover:bg-[#23352d]"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-5 rounded-xl bg-[#0a7d5a] hover:bg-[#086347] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>Saqlash</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {TEST_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFilterCat(c.id)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      filterCat === c.id
                        ? 'bg-[#0a7d5a] text-white shadow-xs'
                        : 'bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] text-[#5a6a62]'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="ml-1.5 text-[10px] opacity-75">
                      ({c.id === 'all' ? tests.length : tests.filter((t) => t.category === c.id).length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Packages List Cards */}
              <div className="space-y-3">
                {filteredTests.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] hover:border-[#0a7d5a]/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${pkg.badgeColor}`}>
                          {pkg.categoryName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#23352d] text-[#5a6a62] dark:text-[#9db0a5]">
                          {pkg.difficulty}
                        </span>
                        <span className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                          • {pkg.durationMinutes} daqiqa
                        </span>
                        <span className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                          • {pkg.questions.length} ta savol
                        </span>
                        <span className="text-xs font-bold text-[#0a7d5a] dark:text-[#3cc99a]">
                          • Maks: {pkg.maxScore} ball
                        </span>
                      </div>

                      <h4 className="font-bold text-sm sm:text-base text-[#14211b] dark:text-[#e9f1ec] truncate">
                        {pkg.title}
                      </h4>
                      <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] line-clamp-1">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-none w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPkgIdForQuestions(pkg.id);
                          setActiveTab('questions');
                        }}
                        className="py-1.5 px-3 rounded-xl bg-[#0a7d5a]/10 hover:bg-[#0a7d5a]/20 text-[#0a7d5a] dark:text-[#3cc99a] text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title="Savollarni koʻrish va tahrirlash"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Savollar ({pkg.questions.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartEditPkg(pkg)}
                        className="p-2 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] hover:bg-gray-100 dark:hover:bg-[#23352d] text-[#14211b] dark:text-[#e9f1ec] transition-colors"
                        title="Tahrirlash"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {deleteConfirmId === pkg.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="py-1 px-2.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                          >
                            Oʻchirish!
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="py-1 px-2 rounded-lg border border-[#dfe6e1] dark:border-[#28372f] text-xs"
                          >
                            Bekor
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(pkg.id)}
                          className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 transition-colors"
                          title="Oʻchirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 2: QUESTIONS MANAGEMENT ================= */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              
              {/* Select Package to edit questions */}
              <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-[#1a2923] border border-[#dfe6e1] dark:border-[#28372f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#5a6a62] dark:text-[#9db0a5] uppercase">
                    Savollar tahrirlanayotgan test toʻplami:
                  </span>
                  <select
                    value={selectedPkgIdForQuestions}
                    onChange={(e) => {
                      setSelectedPkgIdForQuestions(e.target.value);
                      setIsCreatingQuestion(false);
                      setEditingQuestionId(null);
                    }}
                    className="p-2 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] focus:outline-[#0a7d5a]"
                  >
                    {tests.map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.categoryName}] {t.title} ({t.questions.length} ta savol)
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleStartCreateQuestion}
                  className="py-2 px-3.5 rounded-xl bg-[#0a7d5a] hover:bg-[#086347] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yangi savol qoʻshish</span>
                </button>
              </div>

              {/* Form to Create or Edit Question */}
              {(isCreatingQuestion || editingQuestionId !== null) && (
                <form
                  onSubmit={handleSaveQuestion}
                  className="p-5 rounded-3xl bg-gray-50/80 dark:bg-[#1a2923] border border-[#0a7d5a]/40 shadow-sm space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#dfe6e1] dark:border-[#28372f]">
                    <h4 className="font-bold text-sm sm:text-base text-[#14211b] dark:text-[#e9f1ec] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#0a7d5a]" />
                      <span>{isCreatingQuestion ? 'Yangi Savol Yaratish' : 'Savolni Tahrirlash'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingQuestion(false);
                        setEditingQuestionId(null);
                      }}
                      className="p-1 rounded-lg text-[#5a6a62] hover:bg-gray-200 dark:hover:bg-[#23352d]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-xs font-bold text-[#5a6a62] dark:text-[#9db0a5] mb-1">
                      Savol matni:
                    </label>
                    <textarea
                      rows={2}
                      value={qText}
                      onChange={(e) => setQText(e.target.value)}
                      placeholder="Savol matnini bu yerga yozing..."
                      className="w-full p-2.5 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-xs font-semibold text-[#14211b] dark:text-[#e9f1ec] focus:outline-[#0a7d5a]"
                    />
                  </div>

                  {/* Options (A, B, C, D) with Radio to pick correct */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-[#5a6a62] dark:text-[#9db0a5]">
                      Variantlar va toʻgʻri javobni tanlang:
                    </label>

                    {[
                      { letter: 'A', val: qOpt0, setVal: setQOpt0, idx: 0 },
                      { letter: 'B', val: qOpt1, setVal: setQOpt1, idx: 1 },
                      { letter: 'C', val: qOpt2, setVal: setQOpt2, idx: 2 },
                      { letter: 'D', val: qOpt3, setVal: setQOpt3, idx: 3 },
                    ].map((opt) => (
                      <div
                        key={opt.letter}
                        className={`p-3 rounded-2xl border flex items-center gap-3 transition-colors ${
                          qCorrect === opt.idx
                            ? 'bg-emerald-500/10 border-emerald-500/40'
                            : 'bg-white dark:bg-[#17211c] border-[#dfe6e1] dark:border-[#28372f]'
                        }`}
                      >
                        <label className="flex items-center gap-2 cursor-pointer flex-none">
                          <input
                            type="radio"
                            name="correctOpt"
                            checked={qCorrect === opt.idx}
                            onChange={() => setQCorrect(opt.idx)}
                            className="accent-[#0a7d5a] w-4 h-4 cursor-pointer"
                          />
                          <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-[#23352d] font-bold text-xs flex items-center justify-center">
                            {opt.letter}
                          </span>
                        </label>

                        <input
                          type="text"
                          value={opt.val}
                          onChange={(e) => opt.setVal(e.target.value)}
                          placeholder={`${opt.letter} varianti matni...`}
                          className="flex-1 bg-transparent text-xs font-medium text-[#14211b] dark:text-[#e9f1ec] focus:outline-none"
                        />

                        {qCorrect === opt.idx && (
                          <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md flex-none">
                            Toʻgʻri javob
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-xs font-bold text-[#5a6a62] dark:text-[#9db0a5] mb-1">
                      Toʻgʻri javob tushuntirishi / yechim usuli:
                    </label>
                    <textarea
                      rows={2}
                      value={qExplanation}
                      onChange={(e) => setQExplanation(e.target.value)}
                      placeholder="Nima uchun ushbu javob toʻgʻri ekanligi haqida tushuntirish..."
                      className="w-full p-2.5 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-xs font-medium text-[#14211b] dark:text-[#e9f1ec] focus:outline-[#0a7d5a]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingQuestion(false);
                        setEditingQuestionId(null);
                      }}
                      className="py-2 px-4 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] text-xs font-bold hover:bg-gray-100 dark:hover:bg-[#23352d]"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-5 rounded-xl bg-[#0a7d5a] hover:bg-[#086347] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>Savolni saqlash</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Questions List for Current Active Package */}
              {currentActivePackage && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                    <span>Jami savollar: <strong>{currentActivePackage.questions.length} ta</strong></span>
                    <span>Toʻplam: <strong>{currentActivePackage.title}</strong></span>
                  </div>

                  {currentActivePackage.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] space-y-3 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[11px] font-black uppercase text-[#0a7d5a] dark:text-[#3cc99a]">
                            {idx + 1}-SAVOL
                          </span>
                          <h5 className="font-bold text-sm text-[#14211b] dark:text-[#e9f1ec]">
                            {q.question}
                          </h5>
                        </div>

                        <div className="flex items-center gap-1.5 flex-none">
                          <button
                            type="button"
                            onClick={() => handleStartEditQuestion(q)}
                            className="p-1.5 rounded-lg border border-[#dfe6e1] dark:border-[#28372f] hover:bg-gray-100 dark:hover:bg-[#23352d] text-[#14211b] dark:text-[#e9f1ec]"
                            title="Savolni tahrirlash"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmQId === q.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteQuestion(q.id)}
                                className="py-1 px-2 rounded-lg bg-rose-600 text-white text-[11px] font-bold"
                              >
                                Oʻchirish
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmQId(null)}
                                className="py-1 px-1.5 rounded-lg border border-[#dfe6e1] text-[11px]"
                              >
                                Bekor
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmQId(q.id)}
                              className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600"
                              title="Savolni oʻchirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Options preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = optIdx === q.correctAnswer;
                          const letter = String.fromCharCode(65 + optIdx);
                          return (
                            <div
                              key={optIdx}
                              className={`p-2 rounded-xl border flex items-center gap-2 ${
                                isCorrect
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-semibold'
                                  : 'bg-gray-50/60 dark:bg-[#1a2923] border-[#dfe6e1]/70 dark:border-[#28372f] text-[#5a6a62] dark:text-[#9db0a5]'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-md bg-white dark:bg-[#14211b] text-center font-bold text-[11px] flex items-center justify-center flex-none">
                                {letter}
                              </span>
                              <span className="truncate">{opt}</span>
                              {isCorrect && (
                                <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto flex-none" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation preview */}
                      {q.explanation && (
                        <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#1a2923] text-[11px] text-[#5a6a62] dark:text-[#9db0a5] border border-[#dfe6e1]/60 dark:border-[#28372f]">
                          <strong className="text-[#0a7d5a] dark:text-[#3cc99a]">Tushuntirish: </strong>
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#dfe6e1] dark:border-[#28372f] bg-gray-50/80 dark:bg-[#192721]/80 flex items-center justify-between text-xs text-[#5a6a62] dark:text-[#9db0a5] flex-none">
          <span>Oʻzgarishlar darhol saqlanadi va test sinovlarida aks etadi</span>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-[#0a7d5a] hover:bg-[#086347] text-white font-bold transition-colors shadow-xs"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
