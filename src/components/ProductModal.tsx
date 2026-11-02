import React, { useEffect } from 'react';
import { Product } from '../types';
import { CATEGORIES, CATEGORY_DESCS, CATEGORY_PARAMS, calculateDiscount, formatPrice } from '../data/initialData';
import { ProductGlyph } from './ProductGlyph';
import { X, Heart, Star, ShoppingBag, Zap, ShieldCheck } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  cartQty: number;
  isFavorite: boolean;
  onSetQty: (id: number, qty: number) => void;
  onToggleFav: (id: number) => void;
  onDirectBuy: (id: number) => void;
  showRatings: boolean;
  isDemo: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  cartQty,
  isFavorite,
  onSetQty,
  onToggleFav,
  onDirectBuy,
  showRatings,
  isDemo,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const discount = calculateDiscount(product.price, product.old);
  const monthlyPayment = Math.round(product.price / 12);
  const catObj = CATEGORIES.find((c) => c.id === product.cat);
  const catName = catObj ? catObj.name : product.cat;
  const description = product.desc || `${CATEGORY_DESCS[product.cat] || ''} ${isDemo ? 'Bu namuna mahsulot.' : ''}`;
  const params = CATEGORY_PARAMS[product.cat] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-[#17211c]/80 border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec] flex items-center justify-center hover:bg-white dark:hover:bg-[#17211c] transition-colors shadow-xs"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
            
            {/* Left: Product Artwork */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-[#dfe6e1] dark:border-[#28372f] shadow-inner">
              <ProductGlyph cat={product.cat} hue={product.hue} img={product.img} />
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-[#d92d20] text-white text-sm font-extrabold px-2.5 py-1 rounded-xl shadow-xs">
                  −{discount}%
                </span>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#0a7d5a] dark:text-[#3cc99a] uppercase tracking-wider">
                  {catName}
                </span>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#14211b] dark:text-[#e9f1ec] mt-1 leading-snug">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 text-sm text-[#5a6a62] dark:text-[#9db0a5]">
                  {showRatings && product.rev > 0 ? (
                    <>
                      <div className="flex items-center gap-1 font-bold text-[#c98a00]">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{String(product.rate).replace('.', ',')}</span>
                      </div>
                      <span>·</span>
                      <span>{formatPrice(product.rev)} ta sharh</span>
                    </>
                  ) : (
                    <span className="font-medium text-[#0a7d5a] dark:text-[#3cc99a]">
                      Yangi mahsulot
                    </span>
                  )}
                </div>
              </div>

              {/* Price Block */}
              <div className="p-3.5 rounded-2xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f]">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#14211b] dark:text-[#e9f1ec]">
                    {formatPrice(product.price)} soʻm
                  </span>
                  {product.old > product.price && (
                    <span className="text-sm sm:text-base text-[#5a6a62] dark:text-[#9db0a5] line-through font-medium">
                      {formatPrice(product.old)} soʻm
                    </span>
                  )}
                </div>

                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a7d5a] dark:text-[#3cc99a] bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/15 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Muddatli toʻlov: oyiga {formatPrice(monthlyPayment)} soʻmdan, 12 oy</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#14211b] dark:text-[#e9f1ec] leading-relaxed">
                {description}
              </p>

              {/* Specs Table */}
              {params.length > 0 && (
                <div className="border-t border-[#dfe6e1] dark:border-[#28372f] pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5a6a62] dark:text-[#9db0a5] mb-2">
                    Xususiyatlari
                  </h4>
                  <dl className="space-y-1.5 text-xs sm:text-sm">
                    {params.map(([k, v]) => (
                      <div key={k} className="flex justify-between py-1 border-b border-dashed border-[#dfe6e1] dark:border-[#28372f]">
                        <dt className="text-[#5a6a62] dark:text-[#9db0a5]">{k}:</dt>
                        <dd className="font-medium text-[#14211b] dark:text-[#e9f1ec]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (cartQty === 0) onSetQty(product.id, 1);
                      else onSetQty(product.id, cartQty + 1);
                    }}
                    className="flex-1 py-3 px-4 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-sm rounded-xl hover:brightness-105 transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{cartQty > 0 ? `Savatda (${cartQty} dona)` : 'Savatga qoʻshish'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDirectBuy(product.id)}
                    className="flex-1 py-3 px-4 bg-[#ffc83d] text-[#3a2b00] font-bold text-sm rounded-xl hover:bg-[#ffd25e] transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Hozir sotib olish</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleFav(product.id)}
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                      isFavorite
                        ? 'border-[#d92d20] bg-[#d92d20]/10 text-[#d92d20]'
                        : 'border-[#dfe6e1] dark:border-[#28372f] text-[#5a6a62] dark:text-[#9db0a5] hover:border-[#0a7d5a]'
                    }`}
                    aria-label="Sevimlilar"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
