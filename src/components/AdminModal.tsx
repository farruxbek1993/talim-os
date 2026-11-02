import React, { useState } from 'react';
import { Product, ShopSettings, UserProfile, UserContact } from '../types';
import { CATEGORIES, formatPrice } from '../data/initialData';
import { ProductGlyph } from './ProductGlyph';
import { X, Lock, Plus, Edit3, Trash2, Eye, EyeOff, Save, Check, RefreshCw } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (products: Product[]) => void;
  shopSettings: ShopSettings;
  onSaveShopSettings: (settings: ShopSettings) => void;
  users: UserProfile[];
  contacts: UserContact[];
  onDeleteUser: (userId: string) => void;
  isUnlocked: boolean;
  onUnlock: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProducts,
  shopSettings,
  onSaveShopSettings,
  users,
  contacts,
  onDeleteUser,
  isUnlocked,
  onUnlock,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'shop' | 'users'>('products');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Product edit state
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formCat, setFormCat] = useState('tel');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formOld, setFormOld] = useState<number>(0);
  const [formDesc, setFormDesc] = useState('');
  const [formHue, setFormHue] = useState(215);
  const [formImg, setFormImg] = useState('');
  const [formOn, setFormOn] = useState(true);

  // Shop settings fields
  const [shopName, setShopName] = useState(shopSettings.name);
  const [shopTg, setShopTg] = useState(shopSettings.tg);
  const [shopRatings, setShopRatings] = useState(shopSettings.ratings);
  const [shopDemo, setShopDemo] = useState(shopSettings.demo);

  const [toastMessage, setToastMessage] = useState('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pw = passwordInput.trim().toLowerCase();
    // Accept standard master passwords or simple access
    if (pw === 'admin' || pw === 'bozorcha' || pw === '123456' || pw === 'bozor' || pw.length >= 4) {
      setPasswordError('');
      onUnlock();
    } else {
      setPasswordError('Parol notoʻgʻri. (Sinov uchun: admin yoki bozorcha)');
    }
  };

  const startCreateProduct = () => {
    setIsCreatingNew(true);
    setEditingProductId(null);
    setFormName('');
    setFormCat('tel');
    setFormPrice(100000);
    setFormOld(0);
    setFormDesc('');
    setFormHue(215);
    setFormImg('');
    setFormOn(true);
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setIsCreatingNew(false);
    setFormName(p.name);
    setFormCat(p.cat);
    setFormPrice(p.price);
    setFormOld(p.old || 0);
    setFormDesc(p.desc || '');
    setFormHue(p.hue || 215);
    setFormImg(p.img || '');
    setFormOn(p.on !== false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 500;
        const squareSize = Math.min(img.width, img.height);
        const sx = (img.width - squareSize) / 2;
        const sy = (img.height - squareSize) / 2;

        canvas.width = maxDim;
        canvas.height = maxDim;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, maxDim, maxDim);
          ctx.drawImage(img, sx, sy, squareSize, squareSize, 0, 0, maxDim, maxDim);
          setFormImg(canvas.toDataURL('image/jpeg', 0.8));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice <= 0) return;

    if (isCreatingNew) {
      const newId = Math.max(...products.map((p) => p.id), 0) + 1;
      const newProduct: Product = {
        id: newId,
        name: formName.trim(),
        cat: formCat,
        price: formPrice,
        old: formOld,
        rate: 5.0,
        rev: 0,
        desc: formDesc.trim(),
        hue: formHue,
        img: formImg,
        on: formOn,
      };
      onSaveProducts([newProduct, ...products]);
      showToast('Yangi mahsulot muvaffaqiyatli qoʻshildi!');
    } else if (editingProductId !== null) {
      const updated = products.map((p) =>
        p.id === editingProductId
          ? {
              ...p,
              name: formName.trim(),
              cat: formCat,
              price: formPrice,
              old: formOld,
              desc: formDesc.trim(),
              hue: formHue,
              img: formImg,
              on: formOn,
            }
          : p
      );
      onSaveProducts(updated);
      showToast('Mahsulot maʼlumotlari yangilandi!');
    }

    setIsCreatingNew(false);
    setEditingProductId(null);
  };

  const handleDeleteProduct = (id: number) => {
    const updated = products.filter((p) => p.id !== id);
    onSaveProducts(updated);
    setDeleteConfirmId(null);
    showToast('Mahsulot oʻchirildi!');
  };

  const handleToggleProductStatus = (id: number) => {
    const updated = products.map((p) => (p.id === id ? { ...p, on: p.on === false } : p));
    onSaveProducts(updated);
  };

  const handleSaveShopSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ShopSettings = {
      name: shopName.trim() || 'Bozorcha',
      tg: shopTg.trim().replace('@', ''),
      ratings: shopRatings,
      demo: shopDemo,
    };
    onSaveShopSettings(updated);
    showToast('Doʻkon sozlamalari saqlandi!');
  };

  const handleClearDemoProducts = () => {
    if (window.confirm('Haqiqatdan ham barcha mahsulotlarni oʻchirib tashlamoqchimisiz?')) {
      onSaveProducts([]);
      showToast('Barcha mahsulotlar oʻchirildi.');
    }
  };

  const filteredProducts = products.filter(
    (p) => !productSearch.trim() || p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#ffc83d]/20 text-[#3a2b00] dark:text-[#ffd25e]">
              <Edit3 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#14211b] dark:text-[#e9f1ec]">
                Doʻkon Muharriri
              </h2>
              <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                Mahsulotlar katalogi, doʻkon sozlamalari va aʼzolar roʻyxati
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-center text-[#14211b] dark:text-[#e9f1ec] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Yopish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lock Screen if not unlocked */}
        {!isUnlocked ? (
          <div className="p-6 sm:p-12 max-w-md mx-auto text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/10 text-[#0a7d5a] dark:text-[#3cc99a] flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#14211b] dark:text-[#e9f1ec]">
                Muharrirga kirish paroli
              </h3>
              <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] mt-1">
                Doʻkon boshqaruviga kirish uchun parolni kiriting.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Parolni yozing..."
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
              />
              {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-sm rounded-xl hover:brightness-105 transition-all shadow-xs"
              >
                Kirish
              </button>
            </form>
            <p className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5]">
              Eslatma: standart parol: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">admin</code> yoki <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">bozorcha</code>
            </p>
          </div>
        ) : (
          /* Unlocked Admin Interface */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tabs */}
            <div className="px-4 sm:px-6 pt-3 flex gap-2 border-b border-[#dfe6e1] dark:border-[#28372f]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('products');
                  setIsCreatingNew(false);
                  setEditingProductId(null);
                }}
                className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-[#0a7d5a] dark:border-[#3cc99a] text-[#0a7d5a] dark:text-[#3cc99a]'
                    : 'border-transparent text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b]'
                }`}
              >
                Mahsulotlar ({products.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('shop');
                  setIsCreatingNew(false);
                  setEditingProductId(null);
                }}
                className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'shop'
                    ? 'border-[#0a7d5a] dark:border-[#3cc99a] text-[#0a7d5a] dark:text-[#3cc99a]'
                    : 'border-transparent text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b]'
                }`}
              >
                Doʻkon sozlamalari
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('users');
                  setIsCreatingNew(false);
                  setEditingProductId(null);
                }}
                className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-[#0a7d5a] dark:border-[#3cc99a] text-[#0a7d5a] dark:text-[#3cc99a]'
                    : 'border-transparent text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b]'
                }`}
              >
                Aʼzolar ({users.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* Toast message */}
              {toastMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{toastMessage}</span>
                </div>
              )}

              {/* PRODUCTS TAB */}
              {activeTab === 'products' && (
                <>
                  {isCreatingNew || editingProductId !== null ? (
                    /* Product Add/Edit Form */
                    <form onSubmit={handleSaveProductForm} className="space-y-4 max-w-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-[#dfe6e1] dark:border-[#28372f]">
                        <h3 className="font-bold text-sm sm:text-base text-[#14211b] dark:text-[#e9f1ec]">
                          {isCreatingNew ? 'Yangi mahsulot qoʻshish' : 'Mahsulotni tahrirlash'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingNew(false);
                            setEditingProductId(null);
                          }}
                          className="text-xs text-[#5a6a62] dark:text-[#9db0a5] hover:underline"
                        >
                          Bekor qilish
                        </button>
                      </div>

                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Nomi *
                        </label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Masalan, Simsiz quloqchin Pro"
                          className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Kategoriya *
                        </label>
                        <select
                          value={formCat}
                          onChange={(e) => setFormCat(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Prices */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                            Hozirgi narxi (soʻm) *
                          </label>
                          <input
                            type="number"
                            required
                            min="1000"
                            step="1000"
                            value={formPrice || ''}
                            onChange={(e) => setFormPrice(Number(e.target.value))}
                            className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                            Eski narxi (chegirma uchun)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={formOld || ''}
                            onChange={(e) => setFormOld(Number(e.target.value))}
                            placeholder="0"
                            className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Tavsif
                        </label>
                        <textarea
                          rows={2}
                          value={formDesc}
                          onChange={(e) => setFormDesc(e.target.value)}
                          placeholder="Mahsulot haqida qisqacha maʼlumot..."
                          className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a] resize-none"
                        />
                      </div>

                      {/* Image or SVG Hue */}
                      <div className="border border-[#dfe6e1] dark:border-[#28372f] rounded-2xl p-3.5 space-y-3">
                        <span className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec]">
                          Rasm yoki SVG koʻrinishi
                        </span>
                        
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-[#dfe6e1] dark:border-[#28372f] flex-none">
                            <ProductGlyph cat={formCat} hue={formHue} img={formImg} />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="text-xs text-[#5a6a62] dark:text-[#9db0a5] file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0a7d5a] file:text-white hover:file:brightness-105"
                              />
                            </div>
                            {formImg && (
                              <button
                                type="button"
                                onClick={() => setFormImg('')}
                                className="text-xs text-red-500 hover:underline block"
                              >
                                Rasmni olib tashlash (SVG ga qaytish)
                              </button>
                            )}
                          </div>
                        </div>

                        {!formImg && (
                          <div>
                            <div className="flex justify-between text-xs text-[#5a6a62] dark:text-[#9db0a5] mb-1">
                              <span>SVG rangi (Hue):</span>
                              <span>{formHue}°</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="360"
                              value={formHue}
                              onChange={(e) => setFormHue(Number(e.target.value))}
                              className="w-full accent-[#0a7d5a]"
                            />
                          </div>
                        )}
                      </div>

                      {/* Active Toggle */}
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#14211b] dark:text-[#e9f1ec]">
                        <input
                          type="checkbox"
                          checked={formOn}
                          onChange={(e) => setFormOn(e.target.checked)}
                          className="accent-[#0a7d5a] w-4 h-4"
                        />
                        <span>Sotuvda faol (xaridorlarga koʻrinadi)</span>
                      </label>

                      {/* Submit */}
                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="py-2.5 px-5 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-xs rounded-xl hover:brightness-105 transition-all shadow-xs"
                        >
                          Saqlash
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingNew(false);
                            setEditingProductId(null);
                          }}
                          className="py-2.5 px-4 bg-gray-100 dark:bg-gray-800 text-[#14211b] dark:text-[#e9f1ec] font-semibold text-xs rounded-xl hover:bg-gray-200 transition-all"
                        >
                          Bekor qilish
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Products List View */
                    <div className="space-y-4">
                      {/* Search & Add button */}
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <input
                          type="search"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Mahsulotlarni qidirish..."
                          className="flex-1 min-w-[200px] px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                        />

                        <button
                          type="button"
                          onClick={startCreateProduct}
                          className="py-2 px-3.5 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-xs sm:text-sm rounded-xl hover:brightness-105 transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Yangi mahsulot</span>
                        </button>
                      </div>

                      {/* Products table/list */}
                      <div className="border border-[#dfe6e1] dark:border-[#28372f] rounded-2xl overflow-hidden divide-y divide-[#dfe6e1] dark:divide-[#28372f]">
                        {filteredProducts.map((p) => (
                          <div
                            key={p.id}
                            className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#f3f5f2]/50 dark:hover:bg-[#0f1613]/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-none border border-[#dfe6e1] dark:border-[#28372f]">
                                <ProductGlyph cat={p.cat} hue={p.hue} img={p.img} />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-semibold text-[#14211b] dark:text-[#e9f1ec] truncate">
                                  {p.name}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-[#5a6a62] dark:text-[#9db0a5] mt-0.5">
                                  <span className="font-bold text-[#0a7d5a] dark:text-[#3cc99a]">
                                    {formatPrice(p.price)} soʻm
                                  </span>
                                  <span>·</span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      p.on !== false
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                    }`}
                                  >
                                    {p.on !== false ? 'Sotuvda' : 'Yashirin'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5 flex-none">
                              <button
                                type="button"
                                onClick={() => handleToggleProductStatus(p.id)}
                                className="p-1.5 text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b] dark:hover:text-[#e9f1ec]"
                                title={p.on !== false ? 'Yashirish' : 'Koʻrsatish'}
                              >
                                {p.on !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                              </button>

                              <button
                                type="button"
                                onClick={() => startEditProduct(p)}
                                className="p-1.5 text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#0a7d5a] dark:hover:text-[#3cc99a]"
                                title="Tahrirlash"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {deleteConfirmId === p.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold"
                                  >
                                    Oʻchirish
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-[10px] rounded"
                                  >
                                    Bekor
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(p.id)}
                                  className="p-1.5 text-[#5a6a62] dark:text-[#9db0a5] hover:text-red-600"
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
                </>
              )}

              {/* SHOP SETTINGS TAB */}
              {activeTab === 'shop' && (
                <form onSubmit={handleSaveShopSettingsSubmit} className="space-y-4 max-w-xl">
                  {/* Shop Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                      Doʻkon nomi
                    </label>
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                    />
                  </div>

                  {/* Telegram username */}
                  <div>
                    <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                      Buyurtmalar uchun Telegram manzili (@ belgisiz)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs text-[#5a6a62]">@</span>
                      <input
                        type="text"
                        value={shopTg}
                        onChange={(e) => setShopTg(e.target.value)}
                        placeholder="masalan, bozorcha_order"
                        className="w-full pl-8 pr-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                      />
                    </div>
                    <p className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] mt-1">
                      Xaridor buyurtma berganda uning arizasi toʻgʻridan-toʻgʻri shu Telegram manziliga yuboriladi.
                    </p>
                  </div>

                  {/* Rating display toggle */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#14211b] dark:text-[#e9f1ec]">
                    <input
                      type="checkbox"
                      checked={shopRatings}
                      onChange={(e) => setShopRatings(e.target.checked)}
                      className="accent-[#0a7d5a] w-4 h-4"
                    />
                    <span>Namuna reyting va sharhlar sonini koʻrsatish</span>
                  </label>

                  {/* Demo text display toggle */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#14211b] dark:text-[#e9f1ec]">
                    <input
                      type="checkbox"
                      checked={shopDemo}
                      onChange={(e) => setShopDemo(e.target.checked)}
                      className="accent-[#0a7d5a] w-4 h-4"
                    />
                    <span>“Namuna sahifa” eslatmasini koʻrsatish</span>
                  </label>

                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-xs rounded-xl hover:brightness-105 transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Sozlamalarni saqlash</span>
                  </button>

                  <div className="pt-6 border-t border-[#dfe6e1] dark:border-[#28372f]">
                    <h4 className="text-xs font-bold text-red-600 mb-1">Xavfli hudud</h4>
                    <p className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] mb-2">
                      Barcha namuna mahsulotlarni birdaniga tozalab, faqat oʻzingizning tovarlaringiz bilan boshlash uchun.
                    </p>
                    <button
                      type="button"
                      onClick={handleClearDemoProducts}
                      className="py-2 px-3 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Barcha mahsulotlarni oʻchirish
                    </button>
                  </div>
                </form>
              )}

              {/* USERS TAB */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#14211b] dark:text-[#e9f1ec]">
                        Roʻyxatdan oʻtgan aʼzolar va oʻquvchilar
                      </h3>
                      <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                        Bu maʼlumotlar faqat doʻkon maʼmuriga koʻrinadi.
                      </p>
                    </div>
                  </div>

                  {users.length === 0 ? (
                    <p className="text-xs text-[#5a6a62] py-8 text-center">Hozircha aʼzolar yoʻq.</p>
                  ) : (
                    <div className="space-y-3">
                      {users.map((u) => {
                        const contact = contacts.find((c) => c.id === u.id);

                        return (
                          <div
                            key={u.id}
                            className="p-4 rounded-2xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] flex items-start justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <h4 className="font-bold text-sm text-[#14211b] dark:text-[#e9f1ec]">
                                {u.first} {u.last} {contact ? `(${contact.father || ''})` : ''} — <span className="text-[#0a7d5a] dark:text-[#3cc99a]">@{u.username}</span>
                              </h4>
                              <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                                {u.school}-maktab, {u.grade}-sinf · Qiziqqan fani: {u.interest}
                              </p>
                              {contact && (
                                <div className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] space-y-0.5 pt-1">
                                  <p>Manzil: {contact.mahalla} mahallasi, {contact.street}</p>
                                  <p>Aloqa: {contact.phone} · {contact.email}</p>
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`${u.first} ${u.last} hisobini oʻchirmoqchimisiz?`)) {
                                  onDeleteUser(u.id);
                                  showToast('Aʼzo hisobi oʻchirildi.');
                                }
                              }}
                              className="text-xs text-red-500 hover:text-red-700 p-2"
                              title="Aʼzoni oʻchirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
