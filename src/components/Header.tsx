import React, { useState, useRef, useEffect } from 'react';
import { Product, UserProfile } from '../types';
import { CATEGORIES } from '../data/initialData';
import { Search, ShoppingCart, Heart, Moon, Sun, Monitor, User, Edit3, X } from 'lucide-react';

interface HeaderProps {
  shopName: string;
  theme: 'auto' | 'light' | 'dark';
  onThemeChange: (t: 'auto' | 'light' | 'dark') => void;
  favoritesCount: number;
  favOnly: boolean;
  onToggleFavoritesFilter: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenEditor: () => void;
  onOpenCabinet: () => void;
  currentUser: UserProfile | null;
  unreadCount: number;
  products: Product[];
  onSearchSelect: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  shopName,
  theme,
  onThemeChange,
  favoritesCount,
  favOnly,
  onToggleFavoritesFilter,
  cartCount,
  onOpenCart,
  onOpenEditor,
  onOpenCabinet,
  currentUser,
  unreadCount,
  products,
  onSearchSelect,
  searchQuery,
  setSearchQuery,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const logoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Logo secret multi-click to open editor (5 clicks in 3 seconds)
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);

    if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    logoTimerRef.current = setTimeout(() => {
      setLogoClicks(0);
    }, 3000);

    if (newCount >= 5) {
      setLogoClicks(0);
      onOpenEditor();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmedQ = searchQuery.trim().toLowerCase();
  const suggestions = trimmedQ
    ? products
        .filter((p) => p.name.toLowerCase().includes(trimmedQ) && p.on !== false)
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearchSelect(searchQuery);
  };

  const handleCycleTheme = () => {
    if (theme === 'auto') onThemeChange('light');
    else if (theme === 'light') onThemeChange('dark');
    else onThemeChange('auto');
  };

  const getCategoryName = (catId: string) => {
    const c = CATEGORIES.find((item) => item.id === catId);
    return c ? c.name : catId;
  };

  return (
    <>
      {/* Top Bozor striped awning banner */}
      <div className="awning-stripes w-full" aria-hidden="true" />

      {/* Main sticky header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#17211c]/95 backdrop-blur-md border-b border-[#dfe6e1] dark:border-[#28372f] shadow-xs">
        <div className="max-w-[1240px] mx-auto px-4 py-2.5 sm:py-3">
          <div className="grid grid-cols-[auto_1fr_auto] gap-2.5 sm:gap-4 lg:gap-6 items-center">
            
            {/* Logo */}
            <a
              href="#top"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 font-display font-extrabold text-xl sm:text-2xl text-[#0a7d5a] dark:text-[#3cc99a] tracking-tight hover:opacity-90 select-none group"
              title="Bosh sahifa (5 marta bosilsa muharrir ochiladi)"
            >
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl awning-logo shadow-xs flex-none transition-transform group-hover:scale-105" />
              <span className="hidden xs:inline">{shopName}</span>
            </a>

            {/* Search Input with autocomplete */}
            <div ref={searchContainerRef} className="relative w-full max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Mahsulot qidiring: quloqchin, noutbuk, choynak..."
                  className="w-full pl-3.5 pr-20 sm:pr-24 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border-2 border-[#0a7d5a] dark:border-[#3cc99a] focus:outline-none focus:ring-2 focus:ring-[#0a7d5a]/30 transition-all placeholder:text-[#5a6a62] dark:placeholder:text-[#9db0a5]"
                />
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      onSearchSelect('');
                    }}
                    className="absolute right-14 sm:right-20 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label="Tozalash"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 sm:px-4 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-semibold text-xs sm:text-sm rounded-lg flex items-center gap-1.5 hover:brightness-105 transition-all shadow-xs"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden md:inline">Qidirish</span>
                </button>
              </form>

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] rounded-xl shadow-xl overflow-hidden z-40 max-h-80 overflow-y-auto divide-y divide-[#dfe6e1] dark:divide-[#28372f]">
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSearchQuery(p.name);
                        setShowSuggestions(false);
                        onSearchSelect(p.name);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-[#f3f5f2] dark:hover:bg-[#0f1613] transition-colors group"
                    >
                      <span className="font-medium text-[#14211b] dark:text-[#e9f1ec] group-hover:text-[#0a7d5a] dark:group-hover:text-[#3cc99a] truncate pr-3">
                        {p.name}
                      </span>
                      <span className="text-xs text-[#5a6a62] dark:text-[#9db0a5] flex-none">
                        {getCategoryName(p.cat)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Admin editor button */}
              <button
                type="button"
                onClick={onOpenEditor}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-[#ffc83d] bg-[#ffc83d]/20 text-[#3a2b00] dark:text-[#ffd25e] dark:bg-[#ffd25e]/15 hover:bg-[#ffc83d]/30 transition-colors"
                title="Doʻkon boshqaruvi va mahsulotlar muharriri"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Muharrir</span>
              </button>

              {/* Cabinet / Sahifam */}
              <button
                type="button"
                onClick={onOpenCabinet}
                className="relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-[#dfe6e1] dark:border-[#28372f] hover:border-[#0a7d5a] dark:hover:border-[#3cc99a] bg-white dark:bg-[#17211c] text-[#14211b] dark:text-[#e9f1ec] transition-colors"
                title="Shaxsiy sahifa va oʻquvchilar hamjamiyati"
              >
                {currentUser?.photo ? (
                  <img
                    src={currentUser.photo}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-[#0a7d5a] dark:text-[#3cc99a]" />
                )}
                <span className="hidden lg:inline">{currentUser ? currentUser.first : 'Sahifam'}</span>
                {unreadCount > 0 && (
                  <span className="min-w-4 h-4 px-1 rounded-full bg-[#d92d20] text-white text-[10px] font-bold inline-flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Theme toggle */}
              <button
                type="button"
                onClick={handleCycleTheme}
                className="inline-flex items-center justify-center p-2 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] hover:border-[#0a7d5a] dark:hover:border-[#3cc99a] bg-white dark:bg-[#17211c] text-[#14211b] dark:text-[#e9f1ec] transition-colors"
                title={`Rejim: ${theme === 'auto' ? 'Avto' : theme === 'light' ? 'Kunduzi' : 'Tungi'}`}
                aria-label="Rejimni almashtirish"
              >
                {theme === 'auto' ? (
                  <Monitor className="w-4 h-4 text-[#5a6a62] dark:text-[#9db0a5]" />
                ) : theme === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-[#3cc99a]" />
                )}
              </button>

              {/* Favorites button */}
              <button
                type="button"
                onClick={onToggleFavoritesFilter}
                className={`relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-colors ${
                  favOnly
                    ? 'border-[#0a7d5a] dark:border-[#3cc99a] bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/15 text-[#0a7d5a] dark:text-[#3cc99a]'
                    : 'border-[#dfe6e1] dark:border-[#28372f] hover:border-[#0a7d5a] dark:hover:border-[#3cc99a] bg-white dark:bg-[#17211c] text-[#14211b] dark:text-[#e9f1ec]'
                }`}
                title="Sevimli mahsulotlar"
              >
                <Heart className={`w-4 h-4 ${favOnly ? 'fill-[#d92d20] text-[#d92d20]' : 'text-[#5a6a62] dark:text-[#9db0a5]'}`} />
                <span className="hidden md:inline">Sevimlilar</span>
                {favoritesCount > 0 && (
                  <span className="min-w-4 h-4 px-1 rounded-full bg-[#ffc83d] text-[#3a2b00] text-[10px] font-bold inline-flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>
    </>
  );
};
