import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { UserProfile } from '../types';
import { INITIAL_USERS } from '../data/initialData';
import {
  Trophy,
  Award,
  School,
  Sparkles,
  MessageSquare,
  Crown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Compass,
  ArrowRight,
  Flame,
  Info,
} from 'lucide-react';

interface TopScorersSectionProps {
  users: UserProfile[];
  onOpenCabinetWithUser?: (userId: string) => void;
  onOpenAuth?: () => void;
  currentUser: UserProfile | null;
  onGoToGeneralTests?: () => void;
}

/**
 * Faqat «Umumiy testlar» boʻlimida toʻplangan ballni aniqlaydi.
 * Boshqa fanlardan olingan ballar gʻoliblik hisobiga oʻtmaydi.
 */
export const getGeneralScore = (u: UserProfile): number => {
  if (u.generalTestScore !== undefined && u.generalTestScore > 0) {
    return u.generalTestScore;
  }
  if (u.testSubject && u.testSubject.toLowerCase().includes('umumiy')) {
    return u.testScore || 0;
  }
  const initial = INITIAL_USERS.find((init) => init.id === u.id);
  if (initial && initial.generalTestScore) {
    return initial.generalTestScore;
  }
  return 0;
};

export const TopScorersSection: React.FC<TopScorersSectionProps> = ({
  users,
  onOpenCabinetWithUser,
  onOpenAuth,
  currentUser,
  onGoToGeneralTests,
}) => {
  // Check if today is the 30th of the month
  const today = new Date();
  const isActual30th = today.getDate() === 30;

  // State to simulate/test the 30th-of-the-month winner mode anytime
  const [simulate30th, setSimulate30th] = useState(false);
  const isWinnerDay = isActual30th || simulate30th;

  // Slider refs & states
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Filter and sort users strictly by generalTestScore descending
  const topScorers = useMemo(() => {
    return [...users]
      .map((u) => ({
        ...u,
        effectiveGeneralScore: getGeneralScore(u),
      }))
      .filter((u) => u.effectiveGeneralScore > 0)
      .sort((a, b) => b.effectiveGeneralScore - a.effectiveGeneralScore);
  }, [users]);

  const winner = topScorers[0];

  const userGeneralScore = currentUser ? getGeneralScore(currentUser) : 0;
  const userRank = currentUser
    ? topScorers.findIndex((u) => u.id === currentUser.id) + 1
    : 0;

  const checkScroll = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const cardWidth = 320;
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

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const cardWidth = 320;
    const scrollAmount = direction === 'left' ? -cardWidth * 1.5 : cardWidth * 1.5;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="max-w-[1240px] mx-auto px-4 mt-8 sm:mt-12" id="topScorers">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#14211b] dark:text-[#e9f1ec] flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#ffc83d]/20 text-[#3a2b00] dark:text-[#ffd25e]">
                <Trophy className="w-5 h-5 text-amber-500" />
              </span>
              <span>Test sinovlaridan yuqori ball toʻplaganlar</span>
            </h2>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Faqat «Umumiy testlar» natijalari</span>
            </span>

            {isWinnerDay && (
              <span className="animate-pulse inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-xs">
                <Crown className="w-3.5 h-3.5" />
                <span>30-sana: GʻOLIBLAR KUNI</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#5a6a62] dark:text-[#9db0a5] mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span>Oylik gʻoliblik faqat <strong>«Umumiy testlar»</strong> yoʻnalishidagi sinovlarni bajargan balliga qarab belgilanadi.</span>
            <span className="text-[#0a7d5a] dark:text-[#3cc99a] font-semibold">Har oyning 30-sanasida eng yuqori koʻrsatkichli oʻquvchi bosh gʻolib boʻladi!</span>
          </p>
        </div>

        {/* Action controls: 30th Simulation toggle & Slider navigation buttons */}
        <div className="flex items-center gap-2">
          {/* 30th Simulation test toggle */}
          <button
            type="button"
            onClick={() => setSimulate30th((prev) => !prev)}
            className={`py-1.5 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isWinnerDay
                ? 'border-amber-400 bg-amber-400/15 text-amber-900 dark:text-amber-300'
                : 'border-[#dfe6e1] dark:border-[#28372f] text-[#5a6a62] dark:text-[#9db0a5] hover:border-amber-400'
            }`}
            title="Har oyning 30-sanasidagi 'Gʻolib' koʻrinishini sinab koʻrish"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isWinnerDay ? '30-sana (Gʻolib rejimi faol)' : '30-sana koʻrinishi'}</span>
          </button>

          {/* Slider Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollSlider('left')}
              disabled={!canScrollLeft}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] hover:bg-gray-100 dark:hover:bg-[#23352d] text-[#14211b] dark:text-[#e9f1ec] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
              title="Oldingi profil"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider('right')}
              disabled={!canScrollRight}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] hover:bg-gray-100 dark:hover:bg-[#23352d] text-[#14211b] dark:text-[#e9f1ec] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
              title="Keyingi profil"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Current user general test status notification banner if not yet taken */}
      {currentUser && userGeneralScore === 0 && (
        <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-none" />
            <span className="text-[#14211b] dark:text-[#e9f1ec]">
              Siz hali «Umumiy testlar» topshirmadingiz. 30-sana gʻoliblik roʻyxatiga kirish uchun umumiy testni bajaring!
            </span>
          </div>
          {onGoToGeneralTests && (
            <button
              type="button"
              onClick={onGoToGeneralTests}
              className="px-3.5 py-1.5 rounded-xl bg-[#0a7d5a] hover:bg-[#086347] text-white font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-xs text-xs"
            >
              <span>Umumiy test yechish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 30th Celebratory Banner when Winner Day is active */}
      {isWinnerDay && winner && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-slate-950 shadow-md border-2 border-yellow-300 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-extrabold text-xl shadow-md flex-none">
              <Crown className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-slate-950/15 px-2 py-0.5 rounded-md">
                <span>Oyning 30-sanasi — Umumiy testlar oylik gʻolibi</span>
              </div>
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-950 mt-0.5">
                Oy gʻolibi: {winner.first} {winner.last} ({winner.effectiveGeneralScore} ball)!
              </h3>
              <p className="text-xs text-slate-900 font-medium">
                {winner.school}-maktab, {winner.grade}-sinf oʻquvchisi <strong>«Umumiy testlar»</strong> boʻlimida eng yuqori koʻrsatkich qayd etdi va oyning 30-sanasida bosh gʻolib deb eʼtirof etildi.
              </p>
            </div>
          </div>

          <div className="px-4 py-2 bg-slate-950 text-amber-300 rounded-xl font-bold text-xs flex items-center gap-2 flex-none shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>KUN DAVOMIDA GʻOLIB</span>
          </div>
        </div>
      )}

      {/* ================= SLIDE / CAROUSEL CONTAINER ================= */}
      <div className="relative group">
        {/* Left Arrow overlay button for smooth slide navigation */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollSlider('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-2xl bg-white/95 dark:bg-[#14211b]/95 border border-[#dfe6e1] dark:border-[#28372f] shadow-xl text-[#14211b] dark:text-white flex items-center justify-center hover:scale-105 transition-all hidden md:flex"
            title="Chapga surish"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Arrow overlay button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollSlider('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-2xl bg-white/95 dark:bg-[#14211b]/95 border border-[#dfe6e1] dark:border-[#28372f] shadow-xl text-[#14211b] dark:text-white flex items-center justify-center hover:scale-105 transition-all hidden md:flex"
            title="Oʻngga surish"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Slide Track */}
        <div
          ref={sliderRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {topScorers.map((user, idx) => {
            const rank = idx + 1;
            const isTopScorer = rank === 1;
            const isWinnerHighlight = isWinnerDay && isTopScorer;
            const isCurrentUserCard = currentUser && currentUser.id === user.id;

            return (
              <div
                key={user.id}
                className={`w-[280px] sm:w-[310px] md:w-[330px] flex-none snap-start relative rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl ${
                  isWinnerHighlight
                    ? 'bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/20 dark:to-[#17211c] border-2 border-amber-400 dark:border-amber-500/60 ring-4 ring-amber-400/20'
                    : isCurrentUserCard
                    ? 'bg-emerald-500/5 border-2 border-[#0a7d5a] ring-2 ring-[#0a7d5a]/20'
                    : 'bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] hover:border-[#0a7d5a] dark:hover:border-[#3cc99a]'
                }`}
              >
                {/* Special monthly winner badge on the 30th */}
                {isWinnerDay && isTopScorer && (
                  <div className="absolute -top-3 left-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[11px] font-black px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" />
                    <span>OY GʻOLIBI</span>
                  </div>
                )}

                {/* If current user card */}
                {isCurrentUserCard && !isWinnerHighlight && (
                  <div className="absolute -top-3 left-5 bg-[#0a7d5a] text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>SIZNING NATIJANGIZ</span>
                  </div>
                )}

                <div>
                  {/* Top Rank & Score Bar */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-display font-black text-xs ${
                          rank === 1
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : rank === 2
                            ? 'bg-slate-300 text-slate-900 shadow-sm'
                            : rank === 3
                            ? 'bg-amber-700 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-[#5a6a62]'
                        }`}
                      >
                        #{rank}
                      </span>

                      {isWinnerDay && rank <= 3 && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30">
                          Gʻolib
                        </span>
                      )}
                    </div>

                    {/* Score badge strictly from General Tests */}
                    <div className="text-right">
                      <div className="flex items-baseline justify-end">
                        <span className="font-display font-extrabold text-xl sm:text-2xl text-[#0a7d5a] dark:text-[#3cc99a]">
                          {user.effectiveGeneralScore}
                        </span>
                        <span className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] ml-1 font-bold">ball</span>
                      </div>
                      <span className="text-[10px] text-[#5a6a62] dark:text-[#9db0a5] block font-medium">
                        Umumiy test bali
                      </span>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3.5">
                      {/* Profile Picture / Avatar */}
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#0a7d5a] to-emerald-400 text-white flex items-center justify-center font-display font-bold text-xl uppercase shadow-md flex-none border-2 border-white dark:border-[#17211c]">
                        {user.photo ? (
                          <img src={user.photo} alt={user.first} className="w-full h-full object-cover" />
                        ) : (
                          <span>{user.first[0]}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-display font-bold text-sm sm:text-base text-[#14211b] dark:text-[#e9f1ec] truncate">
                          {user.first} {user.last}
                        </h3>
                        <p className="text-xs font-semibold text-[#0a7d5a] dark:text-[#3cc99a] truncate">
                          @{user.username}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-[#5a6a62] dark:text-[#9db0a5] mt-0.5">
                          <School className="w-3.5 h-3.5 flex-none text-[#0a7d5a]" />
                          <span className="truncate">{user.school}-maktab, {user.grade}-sinf</span>
                        </div>
                      </div>
                    </div>

                    {/* Subject & Tests Count metrics */}
                    <div className="p-3 rounded-2xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] text-xs space-y-1.5">
                      <div className="flex justify-between items-center text-[#5a6a62] dark:text-[#9db0a5]">
                        <span className="flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Gʻoliblik sinovi:</span>
                        </span>
                        <span className="font-bold text-[#14211b] dark:text-[#e9f1ec] truncate max-w-[150px]">
                          {user.generalTestSubject || 'Umumiy testlar'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[#5a6a62] dark:text-[#9db0a5]">
                        <span>Topshirgan umumiy testlari:</span>
                        <span className="font-bold text-[#0a7d5a] dark:text-[#3cc99a]">
                          {user.generalTestsCompleted || 1} ta test
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-4 border-t border-[#dfe6e1] dark:border-[#28372f] mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser && onOpenCabinetWithUser) {
                        onOpenCabinetWithUser(user.id);
                      } else if (onOpenAuth) {
                        onOpenAuth();
                      }
                    }}
                    className="w-full py-2.5 px-3 bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/15 text-[#0a7d5a] dark:text-[#3cc99a] hover:bg-[#0a7d5a] hover:text-white dark:hover:bg-[#3cc99a] dark:hover:text-[#06241a] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Profil va Suhbat</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide progress dots & footer info */}
        <div className="flex items-center justify-between gap-3 mt-3 px-1">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              {topScorers.slice(0, Math.min(6, topScorers.length)).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (sliderRef.current) {
                      sliderRef.current.scrollTo({
                        left: idx * 320,
                        behavior: 'smooth',
                      });
                    }
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentSlideIndex === idx
                      ? 'w-6 bg-[#0a7d5a]'
                      : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
                  }`}
                  title={`${idx + 1}-oʻquvchiga oʻtish`}
                />
              ))}
            </div>
          </div>

          <div className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#0a7d5a]" />
            <span className="font-bold text-[#14211b] dark:text-[#e9f1ec]">{topScorers.length} nafar</span>
            <span>oʻquvchi umumiy testlardan yuqori ball toʻplagan</span>
          </div>
        </div>
      </div>
    </section>
  );
};
