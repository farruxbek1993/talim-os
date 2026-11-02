import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  TEST_PACKAGES,
  TEST_CATEGORIES,
  TestPackage,
  TestCategoryKey,
} from '../data/testsData';
import { ActiveTestModal } from './ActiveTestModal';
import { TestSinovlariEditorModal } from './TestSinovlariEditorModal';
import { UserProfile } from '../types';
import {
  Compass,
  BookOpen,
  Calculator,
  Dna,
  Languages,
  ChevronLeft,
  ChevronRight,
  Clock,
  HelpCircle,
  Award,
  Star,
  Users,
  Play,
  CheckCircle,
  Sparkles,
  SlidersHorizontal,
  Lock,
  Edit3,
} from 'lucide-react';

interface TestSinovlariSectionProps {
  currentUser?: UserProfile | null;
  onRequireAuth?: (mode?: 'login' | 'register') => void;
  onScoreRecorded?: (score: number, subject: string, category?: string, testTitle?: string) => void;
  tests?: TestPackage[];
  onSaveTests?: (tests: TestPackage[]) => void;
}

export const TestSinovlariSection: React.FC<TestSinovlariSectionProps> = ({
  currentUser,
  onRequireAuth,
  onScoreRecorded,
  tests: propTests,
  onSaveTests: propOnSaveTests,
}) => {
  const [localTests, setLocalTests] = useState<TestPackage[]>(() => {
    try {
      const saved = localStorage.getItem('bz-tests');
      return saved ? JSON.parse(saved) : TEST_PACKAGES;
    } catch {
      return TEST_PACKAGES;
    }
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const tests = propTests || localTests;

  const handleSaveTests = (newTests: TestPackage[]) => {
    if (propOnSaveTests) {
      propOnSaveTests(newTests);
    } else {
      setLocalTests(newTests);
      try {
        localStorage.setItem('bz-tests', JSON.stringify(newTests));
      } catch {
        // ignore
      }
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<TestCategoryKey | 'all'>('all');
  const [activeTest, setActiveTest] = useState<TestPackage | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Oson' | 'Oʻrtacha' | 'Murakkab'>('all');
  
  // Slider ref
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Filter test packages with useMemo
  const filteredPackages = useMemo(() => {
    return tests.filter((p) => {
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesDiff = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
      return matchesCat && matchesDiff;
    });
  }, [tests, selectedCategory, difficultyFilter]);

  // Check scroll position for slider arrows
  const checkScroll = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Estimate slide index based on card width
    const cardWidth = 360;
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentSlideIndex(index);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = sliderRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [checkScroll]);

  // Scroll actions
  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const cardWidth = 360;
    const scrollAmount = direction === 'left' ? -cardWidth * 1.5 : cardWidth * 1.5;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const getCategoryIcon = (category: TestCategoryKey) => {
    switch (category) {
      case 'umumiy':
        return <Compass className="w-5 h-5 text-amber-500" />;
      case 'tarix':
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'algebra':
        return <Calculator className="w-5 h-5 text-blue-500" />;
      case 'biologiya':
        return <Dna className="w-5 h-5 text-emerald-500" />;
      case 'ingliz':
        return <Languages className="w-5 h-5 text-indigo-500" />;
    }
  };

  const handleStartTest = (pkg: TestPackage) => {
    if (!currentUser) {
      if (onRequireAuth) {
        onRequireAuth('register');
      }
      return;
    }
    setActiveTest(pkg);
    setIsTestModalOpen(true);
  };

  const handleFinishTest = (result: {
    testId: string;
    testTitle: string;
    category?: string;
    subjectName: string;
    earnedScore: number;
    maxScore: number;
    correctCount: number;
    totalQuestions: number;
  }) => {
    if (onScoreRecorded) {
      onScoreRecorded(result.earnedScore, result.subjectName, result.category, result.testTitle);
    }
  };

  return (
    <section className="max-w-[1240px] mx-auto px-4 mt-10 sm:mt-14" id="testSinovlariSection">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/15 text-[#0a7d5a] dark:text-[#3cc99a] mb-2 border border-[#0a7d5a]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bilim va imtihon sinovlari</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#14211b] dark:text-[#e9f1ec]">
            Test sinovlari boʻlimi
          </h2>
          <p className="text-xs sm:text-sm text-[#5a6a62] dark:text-[#9db0a5] mt-1 max-w-2xl">
            Umumiy testlar, Tarix fani, Algebra, Biologiya va Ingliz tili boʻyicha rasmiy DTM va maktab imtihonlari simulyatori. Savollarni yeching va yuqori ball toʻplang!
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Testlar muharriri tugmasi */}
          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="py-2 px-3.5 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] hover:border-[#0a7d5a] dark:hover:border-[#3cc99a] text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#0a7d5a]" />
            <span>Testlar muharriri</span>
          </button>

          {/* Slider controls (Desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollSlider('left')}
              disabled={!canScrollLeft}
              className="w-9 h-9 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] hover:bg-gray-100 dark:hover:bg-[#23352d] text-[#14211b] dark:text-[#e9f1ec] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
              title="Oldingi"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider('right')}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] hover:bg-gray-100 dark:hover:bg-[#23352d] text-[#14211b] dark:text-[#e9f1ec] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
              title="Keyingi"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Roʻyxatdan oʻtganlar uchun ogohlantirish banneri */}
      {!currentUser && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex-none">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-200">
                Test sinovlari faqat roʻyxatdan oʻtganlar uchun ochiq
              </h4>
              <p className="text-[11px] sm:text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                Test yechish, natijalaringizni reytingga kiritish va oylik gʻoliblar qatoridan joy olish uchun roʻyxatdan oʻting.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto flex-none">
            <button
              type="button"
              onClick={() => onRequireAuth && onRequireAuth('register')}
              className="flex-1 sm:flex-none py-2 px-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Roʻyxatdan oʻtish
            </button>
            <button
              type="button"
              onClick={() => onRequireAuth && onRequireAuth('login')}
              className="flex-1 sm:flex-none py-2 px-3.5 bg-white dark:bg-[#1a2923] border border-amber-300 dark:border-amber-700/50 text-amber-900 dark:text-amber-300 text-xs font-bold rounded-xl hover:bg-amber-100/50 transition-colors cursor-pointer"
            >
              Kirish
            </button>
          </div>
        </div>
      )}

      {/* Category Filter Pills (Slide Tabs) */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-3 mb-6 no-scrollbar">
        <div className="flex items-center gap-2 flex-none">
          {TEST_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (sliderRef.current) {
                    sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                  }
                }}
                className={`py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-[#0a7d5a] text-white shadow-md shadow-[#0a7d5a]/20 scale-[1.02]'
                    : 'bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b] dark:hover:text-white hover:border-[#0a7d5a]/50'
                }`}
              >
                {cat.id !== 'all' && (
                  <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                )}
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 dark:bg-[#23352d] text-[#5a6a62]'
                  }`}
                >
                  {cat.id === 'all'
                    ? tests.length
                    : tests.filter((p) => p.category === cat.id).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Difficulty Dropdown */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] px-3 py-1.5 rounded-xl text-xs font-semibold flex-none shadow-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#5a6a62]" />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="bg-transparent text-[#14211b] dark:text-[#e9f1ec] focus:outline-none cursor-pointer"
          >
            <option value="all">Barcha darajalar</option>
            <option value="Oson">Oson</option>
            <option value="Oʻrtacha">Oʻrtacha</option>
            <option value="Murakkab">Murakkab</option>
          </select>
        </div>
      </div>

      {/* ================= SLIDE CONTAINER (HORIZONTAL CAROUSEL) ================= */}
      <div className="relative group">
        {/* Left Arrow overlay button for quick slide navigation */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollSlider('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-2xl bg-white/95 dark:bg-[#14211b]/95 border border-[#dfe6e1] dark:border-[#28372f] shadow-xl text-[#14211b] dark:text-white flex items-center justify-center hover:scale-105 transition-all hidden md:flex"
            title="Chapga surish"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Right Arrow overlay button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollSlider('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-2xl bg-white/95 dark:bg-[#14211b]/95 border border-[#dfe6e1] dark:border-[#28372f] shadow-xl text-[#14211b] dark:text-white flex items-center justify-center hover:scale-105 transition-all hidden md:flex"
            title="Oʻngga surish"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Slider Track */}
        <div
          ref={sliderRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {filteredPackages.length === 0 ? (
            <div className="w-full py-16 bg-white dark:bg-[#17211c] border border-dashed border-[#dfe6e1] dark:border-[#28372f] rounded-3xl text-center space-y-3">
              <p className="text-sm text-[#5a6a62] dark:text-[#9db0a5]">
                Ushbu mezonlar boʻyicha test sinovi topilmadi.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setDifficultyFilter('all');
                }}
                className="py-2 px-4 rounded-xl bg-[#0a7d5a] text-white text-xs font-bold"
              >
                Filtrlarni tozalash
              </button>
            </div>
          ) : (
            filteredPackages.map((pkg) => {
              const diffBadge =
                pkg.difficulty === 'Oson'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  : pkg.difficulty === 'Oʻrtacha'
                  ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';

              return (
                <div
                  key={pkg.id}
                  className="w-[300px] sm:w-[340px] md:w-[370px] flex-none snap-start bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] hover:border-[#0a7d5a]/60 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group/card relative overflow-hidden"
                >
                  {/* Top Subject Bar & Gradient accent */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${pkg.gradient}`}
                  />

                  <div className="space-y-4">
                    {/* Header category info */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-gray-100 dark:bg-[#23352d] flex-none">
                          {getCategoryIcon(pkg.category)}
                        </span>
                        <span
                          className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${pkg.badgeColor}`}
                        >
                          {pkg.categoryName}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${diffBadge}`}
                      >
                        {pkg.difficulty}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-display font-bold text-base sm:text-lg text-[#14211b] dark:text-[#e9f1ec] group-hover/card:text-[#0a7d5a] dark:group-hover/card:text-[#3cc99a] transition-colors leading-snug">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] mt-1.5 line-clamp-2 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Meta Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#dfe6e1]/70 dark:border-[#28372f]">
                      <div className="flex items-center gap-2 text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                        <Clock className="w-3.5 h-3.5 text-[#0a7d5a]" />
                        <span>{pkg.durationMinutes} daqiqa</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                        <span>{pkg.questions.length} ta savol</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Maks: {pkg.maxScore} ball</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{pkg.rating} ({pkg.participantsCount.toLocaleString()})</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-5 mt-4 border-t border-[#dfe6e1]/70 dark:border-[#28372f]">
                    {currentUser ? (
                      <button
                        type="button"
                        onClick={() => handleStartTest(pkg)}
                        className="w-full py-3 px-4 rounded-2xl bg-[#0a7d5a] hover:bg-[#086347] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-[#0a7d5a]/20 group-hover/card:shadow-lg transition-all cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Testni boshlash</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartTest(pkg)}
                        className="w-full py-3 px-4 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-300 border border-amber-400/40 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                      >
                        <Lock className="w-4 h-4 text-amber-500" />
                        <span>Test yechish (Roʻyxatdan oʻtish)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Slide progress dots and slide instructions */}
        <div className="flex items-center justify-between gap-3 mt-4 px-2">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              {filteredPackages.slice(0, Math.min(8, filteredPackages.length)).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (sliderRef.current) {
                      sliderRef.current.scrollTo({
                        left: idx * 360,
                        behavior: 'smooth',
                      });
                    }
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentSlideIndex === idx
                      ? 'w-6 bg-[#0a7d5a]'
                      : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
                  }`}
                  title={`${idx + 1}-boʻlimga oʻtish`}
                />
              ))}
            </div>
          </div>

          <div className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] flex items-center gap-1.5">
            <span className="hidden sm:inline">Koʻrish uchun oʻngga va chapga suring</span>
            <span className="font-bold text-[#14211b] dark:text-[#e9f1ec]">
              {filteredPackages.length} ta test mavjud
            </span>
          </div>
        </div>
      </div>

      {/* Active Quiz Test Runner Modal */}
      {isTestModalOpen && activeTest && (
        <ActiveTestModal
          test={activeTest}
          isOpen={isTestModalOpen}
          onClose={() => setIsTestModalOpen(false)}
          onFinishTest={handleFinishTest}
        />
      )}

      {/* Test Sinovlari Muharriri Modali */}
      <TestSinovlariEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        tests={tests}
        onSaveTests={handleSaveTests}
      />
    </section>
  );
};
