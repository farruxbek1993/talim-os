import React from 'react';
import { CATEGORIES } from '../data/initialData';
import {
  GraduationCap,
  HelpCircle,
  Trophy,
  BookOpen,
  Users,
  Compass,
} from 'lucide-react';

interface CategoryChipsProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'tel':
        return <GraduationCap className="w-4 h-4" />;
      case 'pc':
        return <HelpCircle className="w-4 h-4" />;
      case 'reyting':
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'darsliklar':
        return <BookOpen className="w-4 h-4" />;
      case 'hamjamiyat':
        return <Users className="w-4 h-4" />;
      default:
        return <Compass className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#17211c] border-b border-[#dfe6e1] dark:border-[#28372f]">
      <div className="max-w-[1240px] mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none no-scrollbar">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`flex-none px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] shadow-xs'
                : 'bg-transparent text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] hover:border-[#0a7d5a] dark:hover:border-[#3cc99a]'
            }`}
          >
            Barchasi
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-none px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] shadow-xs'
                  : 'bg-transparent text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] hover:border-[#0a7d5a] dark:hover:border-[#3cc99a]'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
