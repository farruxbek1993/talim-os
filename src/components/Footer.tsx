import React from 'react';
import { Send, ShieldCheck, Truck, CreditCard, Lock } from 'lucide-react';

interface FooterProps {
  shopName: string;
  shopTg: string;
  isDemo: boolean;
  onOpenEditor: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  shopName,
  shopTg,
  isDemo,
  onOpenEditor,
}) => {
  return (
    <footer className="mt-16 sm:mt-24 border-t border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-[#14211b] dark:text-[#e9f1ec] py-10 sm:py-14">
      <div className="max-w-[1240px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-display font-extrabold text-xl text-[#0a7d5a] dark:text-[#3cc99a]">
              <span className="w-6 h-6 rounded-lg awning-logo flex-none" />
              <span>{shopName}</span>
            </div>
            <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] leading-relaxed">
              Oʻzbekistondagi zamonaviy elektron marketpleys va oʻquvchilar hamjamiyati. Sifatli tovarlar va tezkor yetkazib berish xizmati.
            </p>
            {isDemo && (
              <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2 rounded-lg">
                Namuna sahifa: Mahsulotlar va narxlar koʻrgazmali maqsadda berilgan.
              </p>
            )}
          </div>

          {/* Col 2: Buyer perks */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm text-[#14211b] dark:text-[#e9f1ec]">
              Xaridorlarga
            </h3>
            <ul className="space-y-2 text-xs text-[#5a6a62] dark:text-[#9db0a5]">
              <li className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#0a7d5a] dark:text-[#3cc99a]" />
                <span>Tezkor yetkazish: 1–3 kun</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0a7d5a] dark:text-[#3cc99a]" />
                <span>200 000 soʻmdan bepul yetkazish</span>
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-[#0a7d5a] dark:text-[#3cc99a]" />
                <span>Muddatli toʻlov: 12 oygacha</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Contacts */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm text-[#14211b] dark:text-[#e9f1ec]">
              Aloqa va buyurtmalar
            </h3>
            <div className="space-y-2 text-xs text-[#5a6a62] dark:text-[#9db0a5]">
              <p>Buyurtmalar rasmiy Telegram orqali qabul qilinadi.</p>
              {shopTg ? (
                <a
                  href={`https://t.me/${shopTg.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#0a7d5a] dark:text-[#3cc99a] font-bold hover:underline"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>@{shopTg.replace('@', '')}</span>
                </a>
              ) : (
                <span className="italic">Telegram ulanmagan</span>
              )}
            </div>
          </div>

          {/* Col 4: Admin access */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm text-[#14211b] dark:text-[#e9f1ec]">
              Boshqaruv
            </h3>
            <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
              Doʻkon egasi va maʼmurlar uchun mahsulotlar va sozlamalar paneli.
            </p>
            <button
              type="button"
              onClick={onOpenEditor}
              className="py-2 px-3 bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] hover:border-[#0a7d5a] rounded-xl text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Doʻkon boshqaruvi</span>
            </button>
          </div>

        </div>

        <div className="pt-8 border-t border-[#dfe6e1] dark:border-[#28372f] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5a6a62] dark:text-[#9db0a5]">
          <p>© {new Date().getFullYear()} {shopName}. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4">
            <a href="#top" className="hover:text-[#0a7d5a] dark:hover:text-[#3cc99a]">
              Yuqoriga qaytish ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
