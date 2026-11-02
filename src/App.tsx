import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Product,
  ShopSettings,
  UserProfile,
  UserContact,
  ChatMessage,
  Order,
  AdItem,
} from './types';
import {
  CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SHOP,
  INITIAL_USERS,
  INITIAL_CONTACTS,
  INITIAL_ADS,
  calculateDiscount,
  formatPrice,
} from './data/initialData';
import { Header } from './components/Header';
import { CategoryChips } from './components/CategoryChips';
import { HeroSlider } from './components/HeroSlider';
import { TopScorersSection } from './components/TopScorersSection';
import { FanlarSection } from './components/FanlarSection';
import { TestSinovlariSection } from './components/TestSinovlariSection';
import { TEST_PACKAGES, type TestPackage } from './data/testsData';
import { INITIAL_SUBJECTS, type SubjectItem } from './data/subjectsData';
import { TEXTBOOKS, type Textbook } from './data/textbooksData';
import {
  loadTextbooksFromIndexedDb,
  saveTextbooksToIndexedDb,
  sanitizeTextbooksForLocalStorage,
} from './utils/indexedDbStorage';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { AdminModal } from './components/AdminModal';
import { AdEditorModal } from './components/AdEditorModal';
import { AuthModal } from './components/AuthModal';
import { CommunitySection } from './components/CommunitySection';
import { CabinetPage } from './components/CabinetPage';
import { UsersEditorModal } from './components/UsersEditorModal';
import { Footer } from './components/Footer';
import { SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

export default function App() {
  // --- Persistent Storage Helpers ---
  const loadLocal = <T,>(key: string, fallback: T): T => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  };

  const saveLocal = (key: string, val: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      // ignore
    }
  };

  // --- Main State ---
  const [products, setProducts] = useState<Product[]>(() =>
    loadLocal('bz-products', INITIAL_PRODUCTS)
  );
  const [shopSettings, setShopSettings] = useState<ShopSettings>(() =>
    loadLocal('bz-shop', INITIAL_SHOP)
  );
  const [cart, setCart] = useState<Record<number, number>>(() =>
    loadLocal('bz-cart', {})
  );
  const [favorites, setFavorites] = useState<number[]>(() =>
    loadLocal('bz-fav', [])
  );
  const [theme, setTheme] = useState<'auto' | 'light' | 'dark'>(() =>
    loadLocal('bz-theme', 'auto')
  );

  // --- Community & User State ---
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = loadLocal('bz-users', INITIAL_USERS);
    return saved.map((u: UserProfile) => {
      if (u.generalTestScore === undefined) {
        const init = INITIAL_USERS.find((x) => x.id === u.id);
        if (init?.generalTestScore) {
          return {
            ...u,
            generalTestScore: init.generalTestScore,
            generalTestSubject: init.generalTestSubject,
            generalTestsCompleted: init.generalTestsCompleted,
          };
        }
      }
      return u;
    });
  });
  const [contacts, setContacts] = useState<UserContact[]>(() =>
    loadLocal('bz-contacts', INITIAL_CONTACTS)
  );
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    loadLocal('bz-current-user', null)
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadLocal('bz-messages', [
      {
        id: 'msg_seed_1',
        from: 'user_malika',
        to: 'current_guest',
        text: 'Salom! Bozorcha doʻkoniga xush kelibsiz! Qanday kitob yoki tovar qidiryapsiz?',
        ts: Date.now() - 3600000,
      },
      {
        id: 'msg_seed_2',
        from: 'user_jasur',
        to: 'current_guest',
        text: 'Assalomu alaykum! Matematika va IT fanlari boʻyicha savol boʻlsa bemalol yozing.',
        ts: Date.now() - 1800000,
      },
    ])
  );

  // --- Filter State ---
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<'pop' | 'cheap' | 'exp' | 'rate' | 'disc'>('pop');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [saleOnly, setSaleOnly] = useState<boolean>(false);
  const [favOnly, setFavOnly] = useState<boolean>(false);
  const [shownCount, setShownCount] = useState<number>(12);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  const [ads, setAds] = useState<AdItem[]>(() =>
    loadLocal('bz-ads', INITIAL_ADS)
  );
  const [isAdEditorOpen, setIsAdEditorOpen] = useState(false);
  const [isUsersEditorOpen, setIsUsersEditorOpen] = useState(false);

  // --- Fanlar & Darsliklar State ---
  const [subjects, setSubjects] = useState<SubjectItem[]>(() =>
    loadLocal('bz-subjects', INITIAL_SUBJECTS)
  );
  const [textbooks, setTextbooks] = useState<Textbook[]>(() =>
    loadLocal('bz-textbooks', TEXTBOOKS)
  );
  const [isFanlarEditorOpen, setIsFanlarEditorOpen] = useState(false);
  const [tests, setTests] = useState<TestPackage[]>(() =>
    loadLocal('bz-tests', TEST_PACKAGES)
  );

  // --- UI Modals & Page Routing ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeProductModalId, setActiveProductModalId] = useState<number | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem('bz-admin-unlocked') === '1';
    } catch {
      return false;
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'apply'>('login');
  const [currentView, setCurrentView] = useState<'shop' | 'cabinet'>(
    window.location.hash === '#kabinet' ? 'cabinet' : 'shop'
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Restore textbooks with full uploaded files from IndexedDB
  useEffect(() => {
    loadTextbooksFromIndexedDb().then((dbBooks) => {
      if (dbBooks && dbBooks.length > 0) {
        setTextbooks(dbBooks);
      }
    });
  }, []);

  // Sync to local storage
  useEffect(() => saveLocal('bz-products', products), [products]);
  useEffect(() => saveLocal('bz-shop', shopSettings), [shopSettings]);
  useEffect(() => saveLocal('bz-cart', cart), [cart]);
  useEffect(() => saveLocal('bz-fav', favorites), [favorites]);
  useEffect(() => saveLocal('bz-theme', theme), [theme]);
  useEffect(() => saveLocal('bz-ads', ads), [ads]);
  useEffect(() => saveLocal('bz-subjects', subjects), [subjects]);

  // Save textbooks: full files to IndexedDB (virtually unlimited quota), sanitized meta to localStorage
  useEffect(() => {
    saveTextbooksToIndexedDb(textbooks);
    try {
      const sanitized = sanitizeTextbooksForLocalStorage(textbooks);
      saveLocal('bz-textbooks', sanitized);
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
  }, [textbooks]);
  useEffect(() => saveLocal('bz-users', users), [users]);
  useEffect(() => saveLocal('bz-contacts', contacts), [contacts]);
  useEffect(() => saveLocal('bz-current-user', currentUser), [currentUser]);
  useEffect(() => saveLocal('bz-messages', messages), [messages]);

  // Handle Theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  // Hash routing listener
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#kabinet') {
        if (!currentUser) {
          setIsAuthOpen(true);
          setAuthMode('login');
        } else {
          setCurrentView('cabinet');
        }
      } else if (window.location.hash === '#muharrir') {
        setIsAdminOpen(true);
      } else {
        setCurrentView('shop');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentUser]);

  // Max product price calculation
  const calculatedMaxPrice = useMemo(() => {
    const active = products.filter((p) => p.on !== false);
    if (active.length === 0) return 6000000;
    const max = Math.max(...active.map((p) => p.price));
    return Math.max(1000000, Math.ceil(max / 500000) * 500000);
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = products.filter((p) => {
      if (p.on === false) return false;
      if (selectedCategory !== 'all' && p.cat !== selectedCategory) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (maxPrice !== null && p.price > maxPrice) return false;
      if (minRating > 0 && p.rate < minRating) return false;
      if (saleOnly && calculateDiscount(p.price, p.old) <= 0) return false;
      if (favOnly && !favorites.includes(p.id)) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sortOption === 'cheap') return a.price - b.price;
      if (sortOption === 'exp') return b.price - a.price;
      if (sortOption === 'rate') return b.rate - a.rate || b.rev - a.rev;
      if (sortOption === 'disc') return calculateDiscount(b.price, b.old) - calculateDiscount(a.price, a.old);
      return b.rev - a.rev || b.id - a.id;
    });

    return list;
  }, [products, selectedCategory, searchQuery, maxPrice, minRating, saleOnly, favOnly, favorites, sortOption]);

  // Cart operations
  const handleSetQty = (id: number, qty: number) => {
    const clamped = Math.max(0, Math.min(99, qty));
    setCart((prev) => {
      const next = { ...prev };
      if (clamped <= 0) {
        delete next[id];
      } else {
        next[id] = clamped;
      }
      return next;
    });

    const p = products.find((x) => x.id === id);
    if (p && clamped > 0 && (cart[id] || 0) === 0) {
      triggerToast(`"${p.name}" savatga qoʻshildi!`);
    }
  };

  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, q) => sum + q, 0);
  }, [cart]);

  // Favorites toggle
  const handleToggleFav = (id: number) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      const p = products.find((x) => x.id === id);
      if (p) {
        triggerToast(exists ? `"${p.name}" sevimlilardan olib tashlandi` : `"${p.name}" sevimlilarga qoʻshildi!`);
      }
      return next;
    });
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(null);
    setMinRating(0);
    setSaleOnly(false);
    setFavOnly(false);
    setSortOption('pop');
    setShownCount(12);
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'pc') {
      const el = document.getElementById('testSinovlariSection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (catId === 'tel' || catId === 'darsliklar') {
      const el = document.getElementById('fanlar');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (catId === 'reyting') {
      const el = document.getElementById('topScorers');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (catId === 'hamjamiyat') {
      const el = document.getElementById('community');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScoreRecorded = (
    earnedScore: number,
    subjectName: string,
    category?: string,
    testTitle?: string
  ) => {
    const isGeneralTest =
      category === 'umumiy' ||
      subjectName?.toLowerCase().includes('umumiy') ||
      testTitle?.toLowerCase().includes('umumiy');

    if (currentUser) {
      const currentGenScore = currentUser.generalTestScore || 0;
      const newGeneralScore = isGeneralTest
        ? Math.max(currentGenScore, earnedScore)
        : currentGenScore;

      const updatedUser: UserProfile = {
        ...currentUser,
        testScore: Math.max(currentUser.testScore || 0, earnedScore),
        testSubject: subjectName,
        testsCompleted: (currentUser.testsCompleted || 0) + 1,
        ...(isGeneralTest
          ? {
              generalTestScore: newGeneralScore,
              generalTestSubject: testTitle || subjectName || 'Umumiy testlar',
              generalTestsCompleted: (currentUser.generalTestsCompleted || 0) + 1,
            }
          : {}),
      };
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      saveLocal('bz-current-user', updatedUser);

      if (isGeneralTest) {
        triggerToast(`Ajoyib! Umumiy testdan ${earnedScore} ball toʻpladingiz. Gʻoliblik reytingingiz yangilandi!`);
      } else {
        triggerToast(`Tabriklaymiz! "${subjectName}" testidan ${earnedScore} ball toʻpladingiz. (Oylik gʻoliblik faqat Umumiy testlar asosida belgilanadi)`);
      }
    } else {
      triggerToast(`Tabriklaymiz! Test sinovida ${earnedScore} ball toʻpladingiz.`);
    }
  };

  // Auth Operations
  const handleRegister = (newProfile: UserProfile, newContact: UserContact) => {
    setUsers((prev) => [newProfile, ...prev]);
    setContacts((prev) => [newContact, ...prev]);
    setCurrentUser(newProfile);
    saveLocal('bz-current-user', newProfile);
    setCurrentView('cabinet');
    window.location.hash = '#kabinet';
    triggerToast(`Xush kelibsiz, ${newProfile.first}!`);
  };

  const handleLogin = (userLogin: string) => {
    const user = users.find((u) => u.username.toLowerCase() === userLogin.toLowerCase());
    if (user) {
      setCurrentUser(user);
      saveLocal('bz-current-user', user);
      setCurrentView('cabinet');
      window.location.hash = '#kabinet';
      triggerToast(`Xush kelibsiz, ${user.first}!`);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveLocal('bz-current-user', null);
    setCurrentView('shop');
    window.location.hash = '#top';
    triggerToast('Hisobdan chiqdingiz.');
  };

  const handleDeleteAccount = () => {
    if (!currentUser) return;
    const uid = currentUser.id;
    setUsers((prev) => prev.filter((u) => u.id !== uid));
    setContacts((prev) => prev.filter((c) => c.id !== uid));
    setMessages((prev) => prev.filter((m) => m.from !== uid && m.to !== uid));
    setCurrentUser(null);
    saveLocal('bz-current-user', null);
    setCurrentView('shop');
    window.location.hash = '#top';
    triggerToast('Hisobingiz toʻliq oʻchirildi.');
  };

  // Chat message send & simulated reply
  const handleSendMessage = (toUserId: string, text: string) => {
    if (!currentUser) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      from: currentUser.id,
      to: toUserId,
      text,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulated auto-reply from demo bot / peer
    const targetPeer = users.find((u) => u.id === toUserId);
    if (targetPeer && targetPeer.id.startsWith('user_')) {
      setTimeout(() => {
        const replies = [
          `Salom ${currentUser.first}! Xabaringizni oldim. Bozorcha platformasidan nimalar xarid qildingiz?`,
          `Assalomu alaykum! Maktabda darslar qanday ketyapti?`,
          `Rahmat, tez orada batafsil javob yozaman!`,
          `Ajoyib fikr! Kitoblar va elektronika boʻyicha yangi tovarlar kelgan ekan.`,
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        setMessages((prev) => [
          ...prev,
          {
            id: `reply_${Date.now()}`,
            from: targetPeer.id,
            to: currentUser.id,
            text: randomReply,
            ts: Date.now(),
          },
        ]);
      }, 1400);
    }
  };

  const handleDeleteChatMessage = (msgId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
  };

  const activeProductForModal = useMemo(() => {
    return products.find((p) => p.id === activeProductModalId) || null;
  }, [products, activeProductModalId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] selection:bg-[#0a7d5a] selection:text-white">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14211b] dark:bg-white text-white dark:text-[#14211b] px-4 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-bottom duration-300">
          <Sparkles className="w-4 h-4 text-[#ffc83d]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {currentView === 'cabinet' && currentUser ? (
        /* CABINET VIEW */
        <CabinetPage
          currentUser={currentUser}
          contact={contacts.find((c) => c.id === currentUser.id)}
          users={users}
          messages={messages}
          onSendMessage={handleSendMessage}
          onDeleteMessage={handleDeleteChatMessage}
          onUpdateProfile={(up, uc) => {
            setCurrentUser(up);
            setUsers((prev) => prev.map((u) => (u.id === up.id ? up : u)));
            if (uc) {
              setContacts((prev) => prev.map((c) => (c.id === uc.id ? uc : c)));
            }
          }}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          onBackToShop={() => {
            setCurrentView('shop');
            window.location.hash = '#top';
          }}
        />
      ) : (
        /* SHOP VIEW */
        <>
          {/* Header */}
          <Header
            shopName={shopSettings.name}
            theme={theme}
            onThemeChange={setTheme}
            favoritesCount={favorites.length}
            favOnly={favOnly}
            onToggleFavoritesFilter={() => {
              setFavOnly((prev) => !prev);
              const el = document.getElementById('testSinovlariSection');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenEditor={() => setIsAdminOpen(true)}
            onOpenCabinet={() => {
              if (currentUser) {
                setCurrentView('cabinet');
                window.location.hash = '#kabinet';
              } else {
                setIsAuthOpen(true);
                setAuthMode('login');
              }
            }}
            currentUser={currentUser}
            unreadCount={
              currentUser
                ? messages.filter((m) => m.to === currentUser.id && m.from !== currentUser.id).length
                : 0
            }
            products={products}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearchSelect={(q) => {
              setSearchQuery(q);
              const el = document.getElementById('testSinovlariSection');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Category Chips Bar */}
          <CategoryChips
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />

          <main className="flex-1">
            {/* Reklama va eʼlonlar boʻlimi */}
            <HeroSlider
              ads={ads}
              onSelectCategory={handleSelectCategory}
              onOpenAdEditor={() => setIsAdEditorOpen(true)}
            />

            {/* Test sinovlaridan yuqori ball toʻplaganlar (Oʻquvchilar reytingi va 30-sana gʻoliblari) */}
            <TopScorersSection
              users={users}
              currentUser={currentUser}
              onOpenCabinetWithUser={() => {
                setCurrentView('cabinet');
                window.location.hash = '#kabinet';
              }}
              onOpenAuth={() => {
                setIsAuthOpen(true);
                setAuthMode('login');
              }}
              onGoToGeneralTests={() => {
                const el = document.getElementById('testSinovlariSection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Fanlar boʻlimi */}
            <FanlarSection
              subjects={subjects}
              onSaveSubjects={setSubjects}
              textbooks={textbooks}
              onSaveTextbooks={setTextbooks}
              isEditorOpen={isFanlarEditorOpen}
              onOpenEditor={() => setIsFanlarEditorOpen(true)}
              onCloseEditor={() => setIsFanlarEditorOpen(false)}
              onSelectSubject={(subjectName) => {
                setSearchQuery(subjectName);
                const el = document.getElementById('testSinovlariSection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Test sinovlari boʻlimi (Umumiy testlar, Tarix fani, Algebra, Biologiya, Ingliz tili) */}
            <TestSinovlariSection
              currentUser={currentUser}
              tests={tests}
              onSaveTests={(newT) => {
                setTests(newT);
                saveLocal('bz-tests', newT);
              }}
              onRequireAuth={(mode = 'register') => {
                setAuthMode(mode);
                setIsAuthOpen(true);
                triggerToast('Test topshirish uchun avval tizimdan roʻyxatdan oʻting yoki hisobingizga kiring.');
              }}
              onScoreRecorded={handleScoreRecorded}
            />

            {/* Hamjamiyat (Community section preview) */}
            <CommunitySection
              currentUser={currentUser}
              users={users}
              unreadCount={
                currentUser
                  ? messages.filter((m) => m.to === currentUser.id && m.from !== currentUser.id).length
                  : 0
              }
              onOpenCabinet={() => {
                setCurrentView('cabinet');
                window.location.hash = '#kabinet';
              }}
              onOpenAuth={(mode) => {
                setIsAuthOpen(true);
                setAuthMode(mode);
              }}
            />
          </main>

          {/* Footer */}
          <Footer
            shopName={shopSettings.name}
            shopTg={shopSettings.tg}
            isDemo={shopSettings.demo}
            onOpenEditor={() => setIsAdminOpen(true)}
          />
        </>
      )}

      {/* --- Modals & Slide-over Drawers --- */}

      {/* Product Detail Modal */}
      <ProductModal
        product={activeProductForModal}
        onClose={() => setActiveProductModalId(null)}
        cartQty={activeProductModalId ? cart[activeProductModalId] || 0 : 0}
        isFavorite={activeProductModalId ? favorites.includes(activeProductModalId) : false}
        onSetQty={handleSetQty}
        onToggleFav={handleToggleFav}
        onDirectBuy={(id) => {
          setActiveProductModalId(null);
          handleSetQty(id, Math.max(1, cart[id] || 1));
          setIsCheckoutOpen(true);
        }}
        showRatings={shopSettings.ratings}
        isDemo={shopSettings.demo}
      />

      {/* Admin Store Editor Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onSaveProducts={setProducts}
        shopSettings={shopSettings}
        onSaveShopSettings={setShopSettings}
        users={users}
        contacts={contacts}
        onDeleteUser={(uid) => {
          setUsers((prev) => prev.filter((u) => u.id !== uid));
          setContacts((prev) => prev.filter((c) => c.id !== uid));
        }}
        isUnlocked={isAdminUnlocked}
        onUnlock={() => {
          setIsAdminUnlocked(true);
          try {
            sessionStorage.setItem('bz-admin-unlocked', '1');
          } catch {}
        }}
      />

      {/* Reklama Muharriri Modal */}
      <AdEditorModal
        isOpen={isAdEditorOpen}
        onClose={() => setIsAdEditorOpen(false)}
        ads={ads}
        onSaveAds={setAds}
      />

      {/* Authentication / Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
        onRegister={handleRegister}
        onLogin={handleLogin}
        shopTg={shopSettings.tg}
      />
    </div>
  );
}
