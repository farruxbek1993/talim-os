import React from 'react';
import { CATEGORY_GLYPHS } from '../data/initialData';

interface ProductGlyphProps {
  cat: string;
  hue: number;
  img?: string;
  className?: string;
}

export const ProductGlyph: React.FC<ProductGlyphProps> = ({ cat, hue, img, className = 'w-full h-full' }) => {
  if (img && (img.startsWith('data:image/') || img.startsWith('http') || img.startsWith('/'))) {
    return (
      <img
        src={img}
        alt=""
        className={`object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  const glyph = CATEGORY_GLYPHS[cat] || CATEGORY_GLYPHS['tel'];
  const bgLight = `hsl(${hue}, 65%, 92%)`;
  const bgInner = `hsl(${hue}, 65%, 84%)`;
  const fillGlyph = `hsl(${hue}, 50%, 28%)`;

  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={`block select-none ${className}`}
      style={{
        backgroundColor: bgLight,
      }}
    >
      <rect width="200" height="200" fill={bgLight} />
      <circle cx="100" cy="100" r="82" fill={bgInner} />
      <g
        fill={fillGlyph}
        dangerouslySetInnerHTML={{ __html: glyph }}
      />
    </svg>
  );
};
