import React from 'react';
import { Product } from '../types';
import { formatPrice } from '../data/initialData';
import { ProductGlyph } from './ProductGlyph';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Record<number, number>;
  products: Product[];
  onSetQty: (id: number, qty: number) => void;
  onProceedToCheckout: () => void;
  onExploreProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  products,
  onSetQty,
  onProceedToCheckout,
  onExploreProducts,
}) => {
  if (!isOpen) return null;

  const cartEntries = Object.entries(cart)
    .map(([idStr, qty]) => {
      const id = Number(idStr);
      const product = products.find((p) => p.id === id);
      return { id, qty, product };
    })
    .filter((entry): entry is { id: number; qty: number; product: Product } => entry.product !== undefined && entry.qty > 0);

  const subtotal = cartEntries.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const totalItemsCount = cartEntries.reduce((sum, item) => sum + item.qty, 0);
  const freeShippingThreshold = 200000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = subtotal === 0 || isFreeShipping ? 0 : 25000;
  const grandTotal = subtotal + shippingFee;
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-[#17211c] border-l border-[#dfe6e1] dark:border-[#28372f] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0a7d5a] dark:text-[#3cc99a]" />
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#14211b] dark:text-[#e9f1ec]">
              Xarid savati
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0a7d5a]/10 text-[#0a7d5a] dark:bg-[#3cc99a]/20 dark:text-[#3cc99a]">
              {totalItemsCount} ta
            </span>
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

        {/* Free Shipping Progress Indicator */}
        {cartEntries.length > 0 && (
          <div className="px-5 py-3.5 bg-[#f3f5f2] dark:bg-[#0f1613] border-b border-[#dfe6e1] dark:border-[#28372f] text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-[#14211b] dark:text-[#e9f1ec]">
                <Truck className="w-3.5 h-3.5 text-[#0a7d5a] dark:text-[#3cc99a]" />
                {isFreeShipping ? (
                  <span className="font-bold text-[#0a7d5a] dark:text-[#3cc99a]">Sizga bepul yetkazib beriladi!</span>
                ) : (
                  <span>
                    Bepul yetkazish uchun yana <b>{formatPrice(freeShippingThreshold - subtotal)} soʻm</b>
                  </span>
                )}
              </span>
              <span className="font-mono text-[#5a6a62] dark:text-[#9db0a5]">{shippingProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-[#0a7d5a] dark:bg-[#3cc99a] transition-all duration-300 rounded-full"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Scrollable Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartEntries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/10 flex items-center justify-center text-[#0a7d5a] dark:text-[#3cc99a]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-[#14211b] dark:text-[#e9f1ec]">
                  Savat hozircha boʻsh
                </h3>
                <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] max-w-xs">
                  Katalogdagi mahsulotlarni tanlab, “Savatga” tugmasini bosing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExploreProducts();
                }}
                className="py-2.5 px-5 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-semibold text-xs rounded-xl hover:brightness-105 transition-all shadow-xs"
              >
                Xaridni boshlash
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#dfe6e1] dark:divide-[#28372f]">
              {cartEntries.map(({ id, qty, product }) => (
                <div key={id} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-[#dfe6e1] dark:border-[#28372f] flex-none">
                    <ProductGlyph cat={product.cat} hue={product.hue} img={product.img} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-[#14211b] dark:text-[#e9f1ec] truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs font-bold text-[#0a7d5a] dark:text-[#3cc99a] mt-0.5">
                      {formatPrice(product.price * qty)} soʻm
                    </p>

                    {/* Stepper + Delete */}
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <div className="flex items-center border border-[#dfe6e1] dark:border-[#28372f] rounded-lg p-0.5 bg-gray-50 dark:bg-gray-900">
                        <button
                          type="button"
                          onClick={() => onSetQty(id, qty - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-white dark:hover:bg-[#17211c] text-xs font-bold"
                          aria-label="Kamaytirish"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold px-2.5">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onSetQty(id, qty + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-white dark:hover:bg-[#17211c] text-xs font-bold"
                          aria-label="Koʻpaytirish"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSetQty(id, 0)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 p-1"
                        title="Olib tashlash"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Oʻchirish</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartEntries.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#dfe6e1] dark:border-[#28372f] bg-[#f3f5f2] dark:bg-[#0f1613] space-y-3">
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-[#5a6a62] dark:text-[#9db0a5]">
                <span>Mahsulotlar ({totalItemsCount} ta):</span>
                <span>{formatPrice(subtotal)} soʻm</span>
              </div>
              <div className="flex justify-between text-[#5a6a62] dark:text-[#9db0a5]">
                <span>Yetkazib berish:</span>
                <span className={isFreeShipping ? 'text-[#0a7d5a] dark:text-[#3cc99a] font-bold' : ''}>
                  {isFreeShipping ? 'Bepul' : `${formatPrice(shippingFee)} soʻm`}
                </span>
              </div>
              <div className="flex justify-between font-display font-extrabold text-base sm:text-lg text-[#14211b] dark:text-[#e9f1ec] pt-2 border-t border-[#dfe6e1] dark:border-[#28372f]">
                <span>Jami summa:</span>
                <span>{formatPrice(grandTotal)} soʻm</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3 px-4 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-sm rounded-xl hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span>Buyurtma berish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
