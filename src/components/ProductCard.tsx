import React from 'react';
import { Product } from '../types';
import { calculateDiscount, formatPrice } from '../data/initialData';
import { ProductGlyph } from './ProductGlyph';
import { Heart, Plus, Minus, ShoppingBag, Star, Edit3 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  cartQty: number;
  isFavorite: boolean;
  onSetQty: (id: number, qty: number) => void;
  onToggleFav: (id: number) => void;
  onOpenDetails: (id: number) => void;
  showRatings: boolean;
  isAdminUnlocked?: boolean;
  onEditProduct?: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQty,
  isFavorite,
  onSetQty,
  onToggleFav,
  onOpenDetails,
  showRatings,
  isAdminUnlocked,
  onEditProduct,
}) => {
  const discount = calculateDiscount(product.price, product.old);
  const monthlyPayment = Math.round(product.price / 12);

  return (
    <article className="relative bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] rounded-2xl overflow-hidden hover:border-[#0a7d5a] dark:hover:border-[#3cc99a] transition-all flex flex-col justify-between group shadow-xs hover:shadow-md">
      
      {/* Thumbnail Area */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-900 cursor-pointer"
        onClick={() => onOpenDetails(product.id)}
      >
        <ProductGlyph cat={product.cat} hue={product.hue} img={product.img} />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-[#d92d20] text-white text-xs font-extrabold px-2 py-0.5 rounded-lg shadow-xs">
            −{discount}%
          </span>
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white/90 dark:bg-black/60 backdrop-blur-xs ${
            isFavorite ? 'text-[#d92d20]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
          aria-label="Sevimlilarga qoʻshish"
          aria-pressed={isFavorite}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Body Area */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Title */}
          <h3
            onClick={() => onOpenDetails(product.id)}
            className="text-xs sm:text-sm font-semibold text-[#14211b] dark:text-[#e9f1ec] line-clamp-2 hover:text-[#0a7d5a] dark:hover:text-[#3cc99a] cursor-pointer min-h-[2.6em] transition-colors"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-[#5a6a62] dark:text-[#9db0a5]">
            {showRatings && product.rev > 0 ? (
              <>
                <Star className="w-3.5 h-3.5 fill-[#c98a00] text-[#c98a00]" />
                <span className="font-bold text-[#c98a00]">{String(product.rate).replace('.', ',')}</span>
                <span>({formatPrice(product.rev)})</span>
              </>
            ) : (
              <span className="text-xs font-semibold text-[#0a7d5a] dark:text-[#3cc99a]">
                Yangi mahsulot
              </span>
            )}
          </div>

          {/* Price */}
          <div className="pt-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <b className="font-display font-extrabold text-base sm:text-lg text-[#14211b] dark:text-[#e9f1ec]">
                {formatPrice(product.price)} soʻm
              </b>
              {product.old > product.price && (
                <s className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                  {formatPrice(product.old)}
                </s>
              )}
            </div>

            {/* Installment Badge */}
            <div className="mt-1">
              <span className="inline-block text-[11px] font-medium text-[#0a7d5a] dark:text-[#3cc99a] bg-[#0a7d5a]/8 dark:bg-[#3cc99a]/10 px-2 py-0.5 rounded-md">
                Oyiga {formatPrice(monthlyPayment)} soʻmdan
              </span>
            </div>
          </div>
        </div>

        {/* Action button / Stepper */}
        <div className="pt-2 space-y-2">
          {cartQty === 0 ? (
            <button
              type="button"
              onClick={() => onSetQty(product.id, 1)}
              className="w-full py-2.5 px-3 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-semibold text-xs sm:text-sm rounded-xl hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Savatga</span>
            </button>
          ) : (
            <div className="flex items-center justify-between border-1.5 border-[#0a7d5a] dark:border-[#3cc99a] rounded-xl p-1 bg-[#0a7d5a]/5 dark:bg-[#3cc99a]/10">
              <button
                type="button"
                onClick={() => onSetQty(product.id, cartQty - 1)}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#17211c] text-[#14211b] dark:text-[#e9f1ec] flex items-center justify-center font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-xs"
                aria-label="Kamaytirish"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm px-2 text-[#14211b] dark:text-[#e9f1ec] font-mono">
                {cartQty}
              </span>
              <button
                type="button"
                onClick={() => onSetQty(product.id, cartQty + 1)}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#17211c] text-[#14211b] dark:text-[#e9f1ec] flex items-center justify-center font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-xs"
                aria-label="Koʻpaytirish"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {isAdminUnlocked && onEditProduct && (
            <button
              type="button"
              onClick={() => onEditProduct(product.id)}
              className="w-full py-1 text-[11px] font-medium text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#0a7d5a] dark:hover:text-[#3cc99a] flex items-center justify-center gap-1 transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              <span>Tahrirlash</span>
            </button>
          )}
        </div>

      </div>

    </article>
  );
};
