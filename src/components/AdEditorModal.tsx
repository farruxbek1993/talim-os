import React, { useState } from 'react';
import { AdItem } from '../types';
import { X, Megaphone, Plus, Edit3, Trash2, Eye, EyeOff, Save, ArrowRight, Check, Link, Image as ImageIcon } from 'lucide-react';

interface AdEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  ads: AdItem[];
  onSaveAds: (ads: AdItem[]) => void;
}

export const AdEditorModal: React.FC<AdEditorModalProps> = ({
  isOpen,
  onClose,
  ads,
  onSaveAds,
}) => {
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [badge, setBadge] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [btnText, setBtnText] = useState('');
  const [targetLink, setTargetLink] = useState('');
  const [bgGradient, setBgGradient] = useState<'green' | 'blue' | 'amber' | 'purple' | 'slate'>('green');
  const [bgImage, setBgImage] = useState('');
  const [adOn, setAdOn] = useState(true);

  const [toastMsg, setToastMsg] = useState('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  };

  const startCreate = () => {
    setIsCreatingNew(true);
    setEditingAdId(null);
    setBadge('Yangi reklama');
    setTitle('');
    setDesc('');
    setBtnText('Batafsil maʼlumot');
    setTargetLink('');
    setBgGradient('green');
    setBgImage('');
    setAdOn(true);
  };

  const startEdit = (ad: AdItem) => {
    setEditingAdId(ad.id);
    setIsCreatingNew(false);
    setBadge(ad.badge);
    setTitle(ad.title);
    setDesc(ad.desc);
    setBtnText(ad.btnText);
    setTargetLink(ad.targetLink || '');
    setBgGradient(ad.bgGradient || 'green');
    setBgImage(ad.bgImage || '');
    setAdOn(ad.on !== false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 1200;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setBgImage(dataUrl);
          showToast('Orqa fon rasmi yuklandi!');
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !btnText.trim()) return;

    if (isCreatingNew) {
      const newAd: AdItem = {
        id: `ad_${Date.now()}`,
        badge: badge.trim() || 'Reklama',
        title: title.trim(),
        desc: desc.trim(),
        btnText: btnText.trim(),
        btnActionType: targetLink.trim() ? 'link' : 'none',
        targetLink: targetLink.trim() || undefined,
        bgGradient,
        bgImage: bgImage.trim() || undefined,
        on: adOn,
        arts: [
          { cat: 'tel', hue: 215 },
          { cat: 'pc', hue: 250 },
          { cat: 'bol', hue: 45 },
        ],
      };
      onSaveAds([newAd, ...ads]);
      showToast('Yangi reklama muvaffaqiyatli qoʻshildi!');
    } else if (editingAdId) {
      const updated = ads.map((item) =>
        item.id === editingAdId
          ? {
              ...item,
              badge: badge.trim() || 'Reklama',
              title: title.trim(),
              desc: desc.trim(),
              btnText: btnText.trim(),
              btnActionType: (targetLink.trim() ? 'link' : 'none') as 'link' | 'none',
              targetLink: targetLink.trim() || undefined,
              targetCategory: undefined,
              bgGradient,
              bgImage: bgImage.trim() || undefined,
              on: adOn,
            }
          : item
      );
      onSaveAds(updated);
      showToast('Reklama tahrirlandi va saqlandi!');
    }

    setIsCreatingNew(false);
    setEditingAdId(null);
  };

  const handleDelete = (id: string) => {
    const updated = ads.filter((item) => item.id !== id);
    onSaveAds(updated);
    setDeleteConfirmId(null);
    showToast('Reklama oʻchirildi!');
  };

  const handleToggleStatus = (id: string) => {
    const updated = ads.map((item) => (item.id === id ? { ...item, on: item.on === false } : item));
    onSaveAds(updated);
  };

  const GRADIENT_PREVIEWS: Record<string, string> = {
    green: 'from-[#0a7d5a] to-[#074b36] text-white',
    blue: 'from-[#1c3d5a] to-[#0f2438] text-white',
    amber: 'from-[#ffc83d] to-[#d99b00] text-[#3a2b00]',
    purple: 'from-[#581c87] to-[#3b0764] text-white',
    slate: 'from-[#1e293b] to-[#0f172a] text-white',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/15 text-[#0a7d5a] dark:text-[#3cc99a]">
              <Megaphone className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#14211b] dark:text-[#e9f1ec]">
                Reklama Muharriri
              </h2>
              <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                Bosh sahifadagi reklama slaydlari, orqa fon rasmlari va eʼlonlarni boshqarish
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

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Toast */}
          {toastMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{toastMsg}</span>
            </div>
          )}

          {isCreatingNew || editingAdId ? (
            /* ADD / EDIT FORM */
            <form onSubmit={handleSaveForm} className="space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#dfe6e1] dark:border-[#28372f]">
                <h3 className="font-bold text-sm sm:text-base text-[#14211b] dark:text-[#e9f1ec]">
                  {isCreatingNew ? 'Yangi reklama kiritish' : 'Reklamani tahrirlash'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingAdId(null);
                  }}
                  className="text-xs text-[#5a6a62] dark:text-[#9db0a5] hover:underline"
                >
                  Bekor qilish
                </button>
              </div>

              {/* LIVE BANNER PREVIEW */}
              <div className="space-y-1.5">
                <span className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec]">
                  Jonli koʻrinish (Preview)
                </span>
                <div
                  className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 shadow-sm min-h-[140px] flex flex-col justify-between ${
                    bgImage ? 'text-white' : `bg-gradient-to-r ${GRADIENT_PREVIEWS[bgGradient] || GRADIENT_PREVIEWS.green}`
                  }`}
                  style={
                    bgImage
                      ? {
                          backgroundImage: `url(${bgImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : undefined
                  }
                >
                  {/* Backdrop Scrim if image exists */}
                  {bgImage && (
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35 backdrop-blur-[0.5px]" />
                  )}

                  <div className="relative z-10 space-y-2">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-black/30 text-white text-[10px] font-semibold">
                      {badge || 'Reklama nishoni'}
                    </span>
                    <h4 className="font-display font-extrabold text-base sm:text-lg leading-tight line-clamp-1">
                      {title || 'Reklama sarlavhasi bu yerda chiqadi'}
                    </h4>
                    <p className="text-xs opacity-90 line-clamp-2">
                      {desc || 'Reklama tavsifi va batafsil matni...'}
                    </p>
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-[#14211b] font-bold text-xs rounded-lg shadow-xs">
                        <span>{btnText || 'Batafsil'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Image Upload / Orqa fon rasmi */}
              <div className="border border-[#dfe6e1] dark:border-[#28372f] rounded-2xl p-3.5 space-y-3 bg-[#f3f5f2]/60 dark:bg-[#0f1613]/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#0a7d5a] dark:text-[#3cc99a]" />
                    <span>Reklamaning orqa fon rasmi (ixtiyoriy)</span>
                  </label>
                  {bgImage && (
                    <button
                      type="button"
                      onClick={() => setBgImage('')}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Rasmni olib tashlash
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-xs text-[#5a6a62] dark:text-[#9db0a5] file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0a7d5a] file:text-white hover:file:brightness-105 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#5a6a62]">yoki URL manzil:</span>
                    <input
                      type="url"
                      value={bgImage.startsWith('data:') ? '' : bgImage}
                      onChange={(e) => setBgImage(e.target.value)}
                      placeholder="https://images.example.com/banner.jpg"
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#17211c] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5]">
                  Agar orqa fon rasmi yuklansa, reklama ustida zamonaviy qorongʻi qoplama (scrim) berilib, matnlar juda aniq va ravshan koʻrinadi.
                </p>
              </div>

              {/* Badge / Tag */}
              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                  Reklama nishoni (Badge)
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Masalan: Bosh homiy, Maxsus eʼlon, Yangi kurs"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                  Reklama sarlavhasi *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Oʻquv markazlari uchun maxsus taklif"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                  Batafsil matn / Tavsif
                </label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Reklama haqida qisqacha maʼlumot..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a] resize-none"
                />
              </div>

              {/* Button text */}
              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                  Tugma matni *
                </label>
                <input
                  type="text"
                  required
                  value={btnText}
                  onChange={(e) => setBtnText(e.target.value)}
                  placeholder="Batafsil maʼlumot"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                />
              </div>

              {/* Link Input (URL) - Optional */}
              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                  Tashqi havola / Veb-sayt manzili (URL) — ixtiyoriy
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-[#5a6a62]">
                    <Link className="w-4 h-4" />
                  </span>
                  <input
                    type="url"
                    value={targetLink}
                    onChange={(e) => setTargetLink(e.target.value)}
                    placeholder="https://t.me/... yoki https://example.uz"
                    className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                  />
                </div>
                <p className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] mt-1">
                  Boʻsh qoldirilsa, tugma shunchaki maʼlumot beruvchi rejimda ishlaydi.
                </p>
              </div>

              {/* Background gradient selection (used when no image is uploaded) */}
              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-2">
                  Fon ranglar uslubi (Rasm yuklanmaganda ishlaydi)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { key: 'green', label: 'Yashil', bg: 'bg-[#0a7d5a]' },
                    { key: 'blue', label: 'Moviy', bg: 'bg-[#1c3d5a]' },
                    { key: 'amber', label: 'Oltin', bg: 'bg-[#ffc83d]' },
                    { key: 'purple', label: 'Binafsha', bg: 'bg-[#581c87]' },
                    { key: 'slate', label: 'Qora', bg: 'bg-[#1e293b]' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setBgGradient(item.key as any)}
                      className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                        bgGradient === item.key
                          ? 'border-[#0a7d5a] dark:border-[#3cc99a] scale-105'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg ${item.bg}`} />
                      <span className="text-[11px] font-medium text-[#14211b] dark:text-[#e9f1ec]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#14211b] dark:text-[#e9f1ec] pt-1">
                <input
                  type="checkbox"
                  checked={adOn}
                  onChange={(e) => setAdOn(e.target.checked)}
                  className="accent-[#0a7d5a] w-4 h-4"
                />
                <span>Saytda faol koʻrinsin</span>
              </label>

              {/* Submit Buttons */}
              <div className="flex gap-2.5 pt-3">
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-xs rounded-xl hover:brightness-105 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Saqlash</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingAdId(null);
                  }}
                  className="py-2.5 px-4 bg-gray-100 dark:bg-gray-800 text-[#14211b] dark:text-[#e9f1ec] font-semibold text-xs rounded-xl hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          ) : (
            /* LIST OF ADS */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#14211b] dark:text-[#e9f1ec]">
                    Mavjud reklamalar roʻyxati ({ads.length} ta)
                  </h3>
                  <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                    Faol reklamalar bosh sahifada ketma-ket aylanib turadi.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={startCreate}
                  className="py-2 px-3.5 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-xs rounded-xl hover:brightness-105 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yangi reklama</span>
                </button>
              </div>

              {ads.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#5a6a62] border border-dashed border-[#dfe6e1] dark:border-[#28372f] rounded-2xl">
                  Hozircha hech qanday reklama yoʻq. “Yangi reklama” tugmasini bosing.
                </div>
              ) : (
                <div className="space-y-3">
                  {ads.map((ad, idx) => (
                    <div
                      key={ad.id}
                      className="p-4 rounded-2xl border border-[#dfe6e1] dark:border-[#28372f] bg-[#f3f5f2] dark:bg-[#0f1613] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {ad.bgImage ? (
                          <div
                            className="w-16 h-12 rounded-xl bg-cover bg-center border border-[#dfe6e1] dark:border-[#28372f] flex-none shadow-xs"
                            style={{ backgroundImage: `url(${ad.bgImage})` }}
                          />
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-r flex-none shadow-xs ${
                              GRADIENT_PREVIEWS[ad.bgGradient] || GRADIENT_PREVIEWS.green
                            }`}
                          />
                        )}

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-black/40 text-[#14211b] dark:text-white border border-[#dfe6e1] dark:border-[#28372f]">
                              #{idx + 1} {ad.badge}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                ad.on !== false
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                  : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                              }`}
                            >
                              {ad.on !== false ? 'Faol koʻrinmoqda' : 'Yashirin'}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-[#14211b] dark:text-[#e9f1ec] truncate">
                            {ad.title}
                          </h4>

                          <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] line-clamp-1">
                            {ad.desc}
                          </p>

                          <div className="text-[11px] text-[#0a7d5a] dark:text-[#3cc99a] font-semibold flex items-center gap-1 pt-0.5">
                            <span>Tugma: {ad.btnText}</span>
                            {ad.targetLink && <span className="text-[10px] text-[#5a6a62]">({ad.targetLink})</span>}
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-none">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(ad.id)}
                          className="p-2 rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b] transition-colors cursor-pointer"
                          title={ad.on !== false ? 'Yashirish' : 'Faollashtirish'}
                        >
                          {ad.on !== false ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => startEdit(ad)}
                          className="p-2 rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#0a7d5a] dark:hover:text-[#3cc99a] transition-colors cursor-pointer"
                          title="Tahrirlash"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {deleteConfirmId === ad.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDelete(ad.id)}
                              className="px-2 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Oʻchirish
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1.5 bg-gray-200 dark:bg-gray-700 text-xs rounded-xl cursor-pointer"
                            >
                              Bekor
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(ad.id)}
                            className="p-2 rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] text-[#5a6a62] dark:text-[#9db0a5] hover:text-red-600 transition-colors cursor-pointer"
                            title="Oʻchirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
