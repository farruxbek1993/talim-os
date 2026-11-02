import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { TestPackage } from '../data/testsData';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  AlertTriangle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface ActiveTestModalProps {
  test: TestPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onFinishTest: (result: {
    testId: string;
    testTitle: string;
    category?: string;
    subjectName: string;
    earnedScore: number;
    maxScore: number;
    correctCount: number;
    totalQuestions: number;
  }) => void;
}

export const ActiveTestModal: React.FC<ActiveTestModalProps> = ({
  test,
  isOpen,
  onClose,
  onFinishTest,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const initialDuration = Math.max(5, Number(test?.durationMinutes) || 20) * 60;
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [showExplanationReview, setShowExplanationReview] = useState(false);
  const [hasRecordedScore, setHasRecordedScore] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finishTriggeredRef = useRef(false);

  // Reset state when opening test
  useEffect(() => {
    if (!test || !isOpen) return;
    setCurrentIdx(0);
    setSelectedAnswers({});
    const safeDuration = Math.max(5, Number(test.durationMinutes) || 20) * 60;
    setTimeLeft(safeDuration);
    setIsFinished(false);
    setShowConfirmFinish(false);
    setShowExplanationReview(false);
    setHasRecordedScore(false);
    finishTriggeredRef.current = false;
  }, [test?.id, isOpen]);

  const handleFinalizeTest = useCallback(() => {
    if (!test || isFinished) return;
    setIsFinished(true);
    setShowConfirmFinish(false);

    // Calculate score
    let correct = 0;
    const questionsList = test.questions || [];
    const totalQuestions = questionsList.length;
    questionsList.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });

    const maxScore = Number(test.maxScore) || 30;
    const earned = totalQuestions > 0 ? Math.round((correct / totalQuestions) * maxScore * 10) / 10 : 0;

    if (!hasRecordedScore) {
      setHasRecordedScore(true);
      try {
        onFinishTest({
          testId: test.id,
          testTitle: test.title,
          category: test.category,
          subjectName: test.categoryName || 'Umumiy testlar',
          earnedScore: earned,
          maxScore,
          correctCount: correct,
          totalQuestions,
        });
      } catch (err) {
        console.error('Test natijasini saqlashda xatolik:', err);
      }
    }
  }, [test, isFinished, selectedAnswers, hasRecordedScore, onFinishTest]);

  // Clean, non-crashing timer countdown
  useEffect(() => {
    if (!isOpen || !test || isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, test?.id, isFinished]);

  // Safely trigger test completion when time expires
  useEffect(() => {
    if (timeLeft === 0 && isOpen && test && !isFinished && !finishTriggeredRef.current) {
      finishTriggeredRef.current = true;
      handleFinalizeTest();
    }
  }, [timeLeft, isOpen, test, isFinished, handleFinalizeTest]);

  const results = useMemo(() => {
    if (!test) return { correct: 0, wrong: 0, percentage: 0, earned: 0 };
    const questionsList = test.questions || [];
    const totalQuestions = questionsList.length;
    let correct = 0;
    questionsList.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    const maxScore = Number(test.maxScore) || 30;
    const percentage = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    const earned = totalQuestions > 0 ? Math.round((correct / totalQuestions) * maxScore * 10) / 10 : 0;
    return { correct, wrong: totalQuestions - correct, percentage, earned };
  }, [selectedAnswers, test]);

  // Safe early return AFTER all hooks
  if (!isOpen || !test) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isUrgent = timeLeft < 120 && !isFinished;

  const questionsList = test.questions || [];
  const totalQuestions = questionsList.length;
  const currentQuestion = questionsList[currentIdx] || questionsList[0] || {
    id: 1,
    question: 'Savol mavjud emas',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    explanation: '',
  };
  const answeredCount = Object.keys(selectedAnswers).length;
  const scorePerQuestion = totalQuestions > 0 ? Math.round(((Number(test.maxScore) || 30) / totalQuestions) * 10) / 10 : 0;

  const handleSelectAnswer = (optionIdx: number) => {
    if (isFinished) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIdx,
    }));
  };

  const handleRestart = () => {
    if (!test) return;
    setSelectedAnswers({});
    setCurrentIdx(0);
    const safeDuration = Math.max(5, Number(test.durationMinutes) || 20) * 60;
    setTimeLeft(safeDuration);
    setIsFinished(false);
    setShowConfirmFinish(false);
    setShowExplanationReview(false);
    setHasRecordedScore(false);
    finishTriggeredRef.current = false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-[#14211b] border border-[#dfe6e1] dark:border-[#28372f] rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between gap-3 bg-gray-50/70 dark:bg-[#192721]/70 flex-none">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white bg-gradient-to-tr ${test.gradient} flex-none shadow-sm`}>
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${test.badgeColor}`}>
                  {test.categoryName}
                </span>
                <span className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                  {test.difficulty} daraja
                </span>
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-[#14211b] dark:text-[#e9f1ec] truncate">
                {test.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-none">
            {/* Timer */}
            {!isFinished && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-extrabold border transition-colors ${
                  isUrgent
                    ? 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 animate-pulse'
                    : 'bg-white dark:bg-[#1f2f28] border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec]'
                }`}
              >
                <Clock className="w-4 h-4 text-[#0a7d5a]" />
                <span>{timeFormatted}</span>
              </div>
            )}

            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                if (!isFinished && answeredCount > 0) {
                  setShowConfirmFinish(true);
                } else {
                  onClose();
                }
              }}
              className="p-2 rounded-xl text-[#5a6a62] hover:text-[#14211b] dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-[#23352d] transition-colors"
              title="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {!isFinished ? (
            <>
              {/* Question Navigation Bubbles */}
              <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-[#dfe6e1]/70 dark:border-[#28372f]">
                <div className="flex items-center gap-1.5 text-xs text-[#5a6a62] dark:text-[#9db0a5] font-semibold">
                  <span>Savollar:</span>
                  <span className="font-bold text-[#14211b] dark:text-[#e9f1ec]">
                    {answeredCount} / {totalQuestions} bajarildi
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                  {questionsList.map((_, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isCurrent = currentIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIdx(idx)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center flex-none ${
                          isCurrent
                            ? 'bg-[#0a7d5a] text-white ring-2 ring-[#0a7d5a]/40 shadow-sm'
                            : isAnswered
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : 'bg-gray-100 dark:bg-[#1a2923] text-[#5a6a62] hover:bg-gray-200 dark:hover:bg-[#23352d]'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Question Card */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#0a7d5a] dark:text-[#3cc99a]">
                  <span>{currentIdx + 1}-SAVOL</span>
                  <span>{scorePerQuestion} ball</span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-[#14211b] dark:text-[#e9f1ec] leading-relaxed">
                  {currentQuestion.question}
                </h4>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {(currentQuestion.options || []).map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentIdx] === optIdx;
                    const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(optIdx)}
                        className={`w-full p-3.5 sm:p-4 rounded-2xl text-left border text-xs sm:text-sm font-medium transition-all flex items-center gap-3.5 group cursor-pointer ${
                          isSelected
                            ? 'bg-[#0a7d5a]/10 dark:bg-[#0a7d5a]/20 border-[#0a7d5a] text-[#0a7d5a] dark:text-[#3cc99a] shadow-xs'
                            : 'bg-white dark:bg-[#192721] border-[#dfe6e1] dark:border-[#28372f] hover:border-[#0a7d5a]/50 text-[#14211b] dark:text-[#e9f1ec]'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-none transition-colors ${
                            isSelected
                              ? 'bg-[#0a7d5a] text-white shadow-xs'
                              : 'bg-gray-100 dark:bg-[#23352d] text-[#5a6a62] dark:text-[#9db0a5] group-hover:bg-[#0a7d5a]/20 group-hover:text-[#0a7d5a]'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="flex-1 leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* ================= RESULTS VIEW ================= */
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0a7d5a]/10 via-[#ffc83d]/10 to-transparent border border-[#0a7d5a]/20 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-lg">
                  <Trophy className="w-9 h-9" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#0a7d5a] text-white shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Test Sinovi Muvaffaqiyatli Yakunlandi</span>
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-[#14211b] dark:text-[#e9f1ec] mt-2">
                    Toʻplangan ball: <span className="text-[#0a7d5a] dark:text-[#3cc99a]">{results.earned}</span> / {test.maxScore} ball
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5a6a62] dark:text-[#9db0a5] mt-1">
                    Umumiy aniqlik darajasi: <strong className="text-[#14211b] dark:text-[#e9f1ec]">{results.percentage}%</strong>. Natijangiz profil reytingiga qoʻshildi!
                  </p>
                </div>

                {/* Score Stats Grid */}
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                  <div className="p-3 bg-white dark:bg-[#17211c] border border-emerald-500/20 rounded-2xl text-center">
                    <span className="text-xs text-[#5a6a62] dark:text-[#9db0a5] font-semibold block">Toʻgʻri</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {results.correct} ta
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#17211c] border border-rose-500/20 rounded-2xl text-center">
                    <span className="text-xs text-[#5a6a62] dark:text-[#9db0a5] font-semibold block">Notoʻgʻri</span>
                    <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                      {results.wrong} ta
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#17211c] border border-amber-500/20 rounded-2xl text-center">
                    <span className="text-xs text-[#5a6a62] dark:text-[#9db0a5] font-semibold block">Aniqlik</span>
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {results.percentage}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowExplanationReview((prev) => !prev)}
                    className="py-2.5 px-4 rounded-xl border border-[#0a7d5a] bg-[#0a7d5a]/10 text-[#0a7d5a] dark:text-[#3cc99a] text-xs font-bold hover:bg-[#0a7d5a]/20 flex items-center gap-2 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{showExplanationReview ? 'Tahlilni yashirish' : 'Savollar va xatolar tahlili'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="py-2.5 px-4 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] text-xs font-bold hover:bg-gray-100 dark:hover:bg-[#23352d] flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Qayta topshirish</span>
                  </button>
                </div>
              </div>

              {/* Explanations Accordion/List */}
              {showExplanationReview && (
                <div className="space-y-4 pt-4 border-t border-[#dfe6e1] dark:border-[#28372f]">
                  <h4 className="font-display font-bold text-base text-[#14211b] dark:text-[#e9f1ec] flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#0a7d5a]" />
                    <span>Barcha savollar boʻyicha tushuntirishlar:</span>
                  </h4>

                  <div className="space-y-4">
                    {(test.questions || []).map((q, idx) => {
                      const userAns = selectedAnswers[idx];
                      const isCorrect = userAns === q.correctAnswer;
                      const userLetter = userAns !== undefined ? String.fromCharCode(65 + userAns) : 'Javob berilmadi';
                      const correctLetter = String.fromCharCode(65 + (q.correctAnswer ?? 0));
                      const userAnsText = userAns !== undefined && q.options?.[userAns] ? ` (${q.options[userAns]})` : '';
                      const correctAnsText = q.options?.[q.correctAnswer] ? ` (${q.options[q.correctAnswer]})` : '';

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 ${
                            isCorrect
                              ? 'bg-emerald-500/5 border-emerald-500/30'
                              : 'bg-rose-500/5 border-rose-500/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-[#14211b] dark:text-[#e9f1ec]">
                              {idx + 1}-savol: {q.question}
                            </span>
                            {isCorrect ? (
                              <span className="flex-none inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Toʻgʻri</span>
                              </span>
                            ) : (
                              <span className="flex-none inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Notoʻgʻri</span>
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                            <p>
                              Sizning javobingiz:{' '}
                              <strong className={isCorrect ? 'text-emerald-600' : 'text-rose-600'}>
                                {userLetter}{userAnsText}
                              </strong>
                            </p>
                            {!isCorrect && (
                              <p>
                                Toʻgʻri javob:{' '}
                                <strong className="text-emerald-600 dark:text-emerald-400">
                                  {correctLetter}{correctAnsText}
                                </strong>
                              </p>
                            )}
                          </div>

                          {q.explanation && (
                            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#1a2923] text-xs text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1]/60 dark:border-[#28372f]">
                              <strong className="text-[#0a7d5a] dark:text-[#3cc99a]">Tushuntirish: </strong>
                              <span>{q.explanation}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        {!isFinished ? (
          <div className="p-4 sm:p-5 border-t border-[#dfe6e1] dark:border-[#28372f] bg-gray-50/70 dark:bg-[#192721]/70 flex items-center justify-between gap-3 flex-none">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              className="py-2.5 px-4 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] hover:bg-gray-200/60 dark:hover:bg-[#23352d] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Oldingi savol</span>
            </button>

            <div className="flex items-center gap-2">
              {currentIdx < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="py-2.5 px-5 rounded-xl bg-[#0a7d5a] hover:bg-[#086347] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Keyingi savol</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmFinish(true)}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Testni yakunlash</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 border-t border-[#dfe6e1] dark:border-[#28372f] bg-gray-50/70 dark:bg-[#192721]/70 flex items-center justify-end gap-3 flex-none">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-[#0a7d5a] hover:bg-[#086347] text-white text-xs sm:text-sm font-bold shadow-sm transition-colors"
            >
              Bosh sahifaga qaytish
            </button>
          </div>
        )}

        {/* Confirmation Dialog before submitting early */}
        {showConfirmFinish && !isFinished && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-20 animate-in fade-in">
            <div className="w-full max-w-sm bg-white dark:bg-[#1a2923] border border-[#dfe6e1] dark:border-[#28372f] rounded-3xl p-5 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#14211b] dark:text-[#e9f1ec]">
                  Testni yakunlamoqchimisiz?
                </h4>
                <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] mt-1">
                  Siz {totalQuestions} ta savoldan {answeredCount} tasiga javob berdingiz.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmFinish(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] text-xs font-bold hover:bg-gray-100 dark:hover:bg-[#23352d]"
                >
                  Davom etish
                </button>
                <button
                  type="button"
                  onClick={handleFinalizeTest}
                  className="flex-1 py-2.5 rounded-xl bg-[#0a7d5a] text-white text-xs font-bold hover:bg-[#086347]"
                >
                  Yakunlash
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
