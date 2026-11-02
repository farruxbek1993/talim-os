import React, { useState } from 'react';
import { Product, Order } from '../types';
import { REGIONS, PAYMENT_METHODS, formatPrice } from '../data/initialData';
import { X, ArrowLeft, CheckCircle2, Send, Copy, Check, AlertCircle } from 'lucide-react';

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToCart: () => void;
  cart: Record<number, number>;
  products: Product[];
  shopTg: string;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
  isOpen,
  onClose,
  onBackToCart,
  cart,
  products,
  shopTg,
  onOrderCompleted,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [region, setRegion] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('cash');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedOrder, setCompletedOrder] = useState<{
    code: string;
    total: number;
    text: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cartEntries = Object.entries(cart)
    .map(([idStr, qty]) => {
      const id = Number(idStr);
      const product = products.find((p) => p.id === id);
      return { id, qty, product };
    })
    .filter((entry): entry is { id: number; qty: number; product: Product } => entry.product !== undefined && entry.qty > 0);

  const subtotal = cartEntries.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const isFreeShipping = subtotal >= 200000;
  const shippingFee = subtotal === 0 || isFreeShipping ? 0 : 25000;
  const grandTotal = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (name.trim().length < 3) {
      newErrors.name = 'Ism va familiyangizni toʻliq yozing.';
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      newErrors.phone = 'Telefon raqamingizni toʻliq kiriting.';
    }

    if (!region) {
      newErrors.region = 'Viloyatni tanlang.';
    }

    if (address.trim().length < 5) {
      newErrors.address = 'Manzilingizni yozing: tuman, koʻcha, uy raqami.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const orderCode = `BZ-${Math.floor(10000 + Math.random() * 89999)}`;
    const paymentLabel = PAYMENT_METHODS[payment] || payment;

    const lines = [
      `🛒 Yangi Buyurtma: ${orderCode}`,
      `👤 Xaridor: ${name.trim()}`,
      `📞 Tel: ${phone.trim()}`,
      `📍 Manzil: ${region}, ${address.trim()}`,
      `💳 Toʻlov turi: ${paymentLabel}`,
      '',
      '📦 Mahsulotlar roʻyxati:',
      ...cartEntries.map((item, idx) => `${idx + 1}. ${item.product.name} × ${item.qty} dona = ${formatPrice(item.product.price * item.qty)} soʻm`),
      '',
      `🚚 Yetkazib berish: ${isFreeShipping ? 'Bepul' : `${formatPrice(shippingFee)} soʻm`}`,
      `💰 Jami toʻlov: ${formatPrice(grandTotal)} soʻm`,
    ];

    const fullOrderText = lines.join('\n');

    const newOrder: Order = {
      id: orderCode,
      name: name.trim(),
      phone: phone.trim(),
      region,
      address: address.trim(),
      payment: paymentLabel,
      items: cartEntries.map((i) => ({
        id: i.id,
        name: i.product.name,
        price: i.product.price,
        qty: i.qty,
      })),
      subtotal,
      shipping: shippingFee,
      total: grandTotal,
      createdAt: Date.now(),
    };

    onOrderCompleted(newOrder);
    setCompletedOrder({
      code: orderCode,
      total: grandTotal,
      text: fullOrderText,
    });
  };

  const handleCopyText = () => {
    if (!completedOrder) return;
    navigator.clipboard.writeText(completedOrder.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#17211c] border-l border-[#dfe6e1] dark:border-[#28372f] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!completedOrder && (
              <button
                type="button"
                onClick={onBackToCart}
                className="p-1.5 -ml-1 text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#0a7d5a] dark:hover:text-[#3cc99a]"
                aria-label="Savatga qaytish"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#14211b] dark:text-[#e9f1ec]">
              {completedOrder ? 'Buyurtma rasmiylashtirildi' : 'Buyurtma berish'}
            </h2>
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#0a7d5a] text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-display font-extrabold text-2xl text-[#14211b] dark:text-[#e9f1ec]">
                  Buyurtma № {completedOrder.code}
                </h3>
                <p className="text-sm text-[#0a7d5a] dark:text-[#3cc99a] font-bold mt-1">
                  Jami: {formatPrice(completedOrder.total)} soʻm
                </p>
                <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] mt-1 max-w-sm mx-auto">
                  Buyurtmangiz qabul qilindi. Tezroq tasdiqlash uchun uni doʻkonga Telegram orqali yuborishingiz mumkin.
                </p>
              </div>

              {/* Order bill text */}
              <div className="text-left bg-[#f3f5f2] dark:bg-[#0f1613] p-3.5 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                {completedOrder.text}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                {shopTg ? (
                  <a
                    href={`https://t.me/${shopTg.replace('@', '')}?text=${encodeURIComponent(completedOrder.text)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-sm rounded-xl hover:brightness-105 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegram orqali yuborish</span>
                  </a>
                ) : (
                  <div className="p-3 bg-amber-500/10 text-amber-800 dark:text-amber-200 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-none" />
                    <span>Doʻkonning Telegram manzili hali belgilanmagan. Quyidagi nusxa tugmasidan foydalaning.</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCopyText}
                  className="w-full py-2.5 px-4 bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec] font-semibold text-xs rounded-xl hover:border-[#0a7d5a] transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Nusxalandi!' : 'Xabarni nusxalash'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b] dark:hover:text-[#e9f1ec]"
                >
                  Xaridni davom ettirish
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form id="checkoutForm" onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                  Ism va familiya *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan, Alisher Navoiy"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                />
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                  Telefon raqami *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                />
                {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Region */}
              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                  Viloyat / Hudud *
                </label>
                <select
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                >
                  <option value="">Viloyatni tanlang</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.region && <p className="text-[11px] text-red-500 mt-1">{errors.region}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                  Yetkazib berish manzili *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Tuman, koʻcha, uy raqami, xonadon"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a] resize-none"
                />
                {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
              </div>

              {/* Payment Method */}
              <fieldset className="border border-[#dfe6e1] dark:border-[#28372f] rounded-2xl p-3.5 space-y-2">
                <legend className="text-xs font-bold px-1 text-[#14211b] dark:text-[#e9f1ec]">
                  Toʻlov usuli
                </legend>
                {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#14211b] dark:text-[#e9f1ec] cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={key}
                      checked={payment === key}
                      onChange={(e) => setPayment(e.target.value)}
                      className="accent-[#0a7d5a] w-4 h-4"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>

              {/* Order total strip */}
              <div className="bg-[#f3f5f2] dark:bg-[#0f1613] p-3 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] text-xs space-y-1">
                <div className="flex justify-between text-[#5a6a62] dark:text-[#9db0a5]">
                  <span>Mahsulotlar summasi:</span>
                  <span>{formatPrice(subtotal)} soʻm</span>
                </div>
                <div className="flex justify-between text-[#5a6a62] dark:text-[#9db0a5]">
                  <span>Yetkazib berish:</span>
                  <span>{isFreeShipping ? 'Bepul' : `${formatPrice(shippingFee)} soʻm`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#14211b] dark:text-[#e9f1ec] pt-1 border-t border-[#dfe6e1] dark:border-[#28372f]">
                  <span>Jami toʻlov:</span>
                  <span>{formatPrice(grandTotal)} soʻm</span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-sm rounded-xl hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Buyurtmani tasdiqlash</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
