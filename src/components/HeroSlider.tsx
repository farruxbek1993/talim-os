import React, { useState, useEffect, useRef } from 'react';
import { AdItem } from '../types';
import { ProductGlyph } from './ProductGlyph';
import { ChevronLeft, ChevronRight, ArrowRight, Megaphone, Edit3, Info } from 'lucide-react';

interface HeroSliderProps {
  ads: AdItem[];
  onSelectCategory: (catId: string) => void;
  onOpenAdEditor: () => void;
}

const GRADIENT_STYLES: Record<string, { bg: string; btn: string }> = {
  green: {
    bg: 'bg-gradient-to-r from-[#0a7d5a] to-[#074b36] text-white',
    btn: 'bg-[#ffc83d] text-[#3a2b00] hover:bg-[#ffd25e]',
  },
  blue: {
    bg: 'bg-gradient-to-r from-[#1c3d5a] to-[#0f2438] text-white',
    btn: 'bg-[#3cc99a] text-[#06241a] hover:bg-[#52d6aa]',
  },
  amber: {
    bg: 'bg-gradient-to-r from-[#ffc83d] to-[#d99b00] text-[#3a2b00]',
    btn: 'bg-[#14211b] text-white hover:bg-[#253930]',
  },
  purple: {
    bg: 'bg-gradient-to-r from-[#581c87] to-[#3b0764] text-white',
    btn: 'bg-[#ffd25e] text-[#3b0764] hover:bg-[#ffe399]',
  },
  slate: {
    bg: 'bg-gradient-to-r from-[#1e293b] to-[#0f172a] text-white',
    btn: 'bg-[#0a7d5a] text-white hover:bg-[#12946c]',
  },
};

export const HeroSlider: React.FC<HeroSliderProps> = ({
  ads,
  onSelectCategory,
  onOpenAdEditor,
}) => {
  const activeAds = ads.filter((a) => a.on !== false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused || activeAds.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeAds.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeAds.length]);

  // Handle case where activeAds changes or becomes empty
  const safeIndex = activeAds.length > 0 ? currentSlide % activeAds.length : 0;
  const currentAd = activeAds[safeIndex];

  const handleButtonClick = (ad: AdItem) => {
    if (ad.targetLink) {
      window.open(ad.targetLink, '_blank', 'noopener,noreferrer');
    } else {
      const el = document.getElementById('productsSection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-label="Reklama boʻlimi"
      className="relative max-w-[1240px] mx-auto px-4 mt-4 sm:mt-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section Header bar */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ffc83d]/20 text-[#3a2b00] dark:text-[#ffd25e] text-xs font-bold">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Reklama va eʼlonlar</span>
          </div>
          <span className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] hidden xs:inline">
            Hamkorlarimiz va taʼlim markazlari takliflari
          </span>
        </div>

        {/* Separate Advertisement Editor Button */}
        <button
          type="button"
          onClick={onOpenAdEditor}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-[#0a7d5a] dark:text-[#3cc99a] hover:border-[#0a7d5a] transition-all shadow-xs"
          title="Reklama va eʼlonlarni boshqarish"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Reklama muharriri</span>
        </button>
      </div>

      {/* Main Slide Card */}
      {currentAd ? (
        <div
          className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 lg:p-10 transition-all duration-500 shadow-md ${
            currentAd.bgImage
              ? 'text-white'
              : GRADIENT_STYLES[currentAd.bgGradient]?.bg || GRADIENT_STYLES.green.bg
          }`}
          style={
            currentAd.bgImage
              ? {
                  backgroundImage: `url(${currentAd.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          {/* Scrim Overlay if background image is active */}
          {currentAd.bgImage && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/35 backdrop-blur-[0.5px]" />
          )}

          {/* Subtle Watermark in background */}
          {!currentAd.bgImage && (
            <div className="absolute right-6 -bottom-6 w-44 h-44 opacity-10 pointer-events-none">
              <Megaphone className="w-full h-full" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 items-center relative z-10">
            {/* Slide Text & Button */}
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/30 text-white text-[11px] font-semibold backdrop-blur-xs">
                <Info className="w-3 h-3" />
                <span>{currentAd.badge}</span>
              </div>

              <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-3xl tracking-tight leading-snug">
                {currentAd.title}
              </h2>

              <p className="text-xs sm:text-sm opacity-90 max-w-xl font-normal leading-relaxed">
                {currentAd.desc}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleButtonClick(currentAd)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer ${
                    currentAd.bgImage
                      ? 'bg-[#ffc83d] text-[#3a2b00] hover:bg-[#ffd25e]'
                      : GRADIENT_STYLES[currentAd.bgGradient]?.btn || GRADIENT_STYLES.green.btn
                  }`}
                >
                  <span>{currentAd.btnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Decorative Visual Tiles */}
            <div className="hidden md:flex items-center justify-center relative h-48">
              {currentAd.arts && currentAd.arts.length >= 3 ? (
                <>
                  <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-lg transform -rotate-6 translate-y-3 border-2 border-white/30 flex-none">
                    <ProductGlyph cat={currentAd.arts[0].cat} hue={currentAd.arts[0].hue} />
                  </div>
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl transform -translate-y-4 -mx-4 z-10 border-2 border-white/50 flex-none">
                    <ProductGlyph cat={currentAd.arts[1].cat} hue={currentAd.arts[1].hue} />
                  </div>
                  <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-lg transform rotate-6 translate-y-3 border-2 border-white/30 flex-none">
                    <ProductGlyph cat={currentAd.arts[2].cat} hue={currentAd.arts[2].hue} />
                  </div>
                </>
              ) : (
                <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-xl border-2 border-white/40 flex-none">
                  <ProductGlyph cat={currentAd.targetCategory || 'tel'} hue={215} />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-[#17211c] border border-dashed border-[#dfe6e1] dark:border-[#28372f] rounded-2xl">
          <p className="text-xs text-[#5a6a62]">Hozircha faol reklama yoʻq. “Reklama muharriri” orqali yangi reklama qoʻshishingiz mumkin.</p>
        </div>
      )}

      {/* Slider Controls */}
      {activeAds.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + activeAds.length) % activeAds.length)}
            className="w-8 h-8 rounded-full border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-[#14211b] dark:text-[#e9f1ec] flex items-center justify-center hover:border-[#0a7d5a] dark:hover:border-[#3cc99a] transition-colors cursor-pointer"
            aria-label="Oldingi reklama"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {activeAds.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === safeIndex
                    ? 'w-6 bg-[#0a7d5a] dark:bg-[#3cc99a]'
                    : 'w-2 bg-[#dfe6e1] dark:bg-[#28372f] hover:bg-gray-400'
                }`}
                aria-label={`Reklama ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % activeAds.length)}
            className="w-8 h-8 rounded-full border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-[#14211b] dark:text-[#e9f1ec] flex items-center justify-center hover:border-[#0a7d5a] dark:hover:border-[#3cc99a] transition-colors cursor-pointer"
            aria-label="Keyingi reklama"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
