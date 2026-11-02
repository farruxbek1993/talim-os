import React from 'react';
import { UserProfile } from '../types';
import { Users, ArrowRight, UserPlus, LogIn, Edit3, Shield } from 'lucide-react';

interface CommunitySectionProps {
  currentUser: UserProfile | null;
  users: UserProfile[];
  unreadCount: number;
  onOpenCabinet: () => void;
  onOpenAuth: (mode: 'login' | 'register' | 'apply') => void;
  onOpenUsersEditor: () => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  currentUser,
  users,
  unreadCount,
  onOpenCabinet,
  onOpenAuth,
  onOpenUsersEditor,
}) => {
  const activeUsers = users.filter((u) => !u.isDeleted);

  return (
    <section className="max-w-[1240px] mx-auto px-4 mt-12 sm:mt-16" id="community">
      <div className="bg-gradient-to-br from-white to-[#f3f5f2] dark:from-[#17211c] dark:to-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
        
        {/* Decorative corner icon */}
        <div className="absolute right-4 -bottom-6 w-36 h-36 opacity-5 dark:opacity-10 pointer-events-none text-[#0a7d5a]">
          <Users className="w-full h-full" />
        </div>

        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/15 text-[#0a7d5a] dark:text-[#3cc99a] text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Roʻyxatdan oʻtgan oʻquvchilar va foydalanuvchilar</span>
            </div>

            <button
              type="button"
              onClick={onOpenUsersEditor}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer border border-amber-500/30"
              title="Roʻyxatdan oʻtganlarni tahrirlash, oʻchirish va qayta tiklash"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Roʻyxatdan oʻtganlar muharriri</span>
            </button>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#14211b] dark:text-[#e9f1ec] tracking-tight">
            Roʻyxatdan oʻtganlar
          </h2>

          <p className="text-sm sm:text-base text-[#5a6a62] dark:text-[#9db0a5] leading-relaxed">
            Oʻzbekistondagi maktab oʻquvchilari va foydalanuvchilar oʻzaro qiziqishlari, darsliklar, test sinovlari va natijalar haqida fikr almashadigan ochiq platforma.
          </p>

          {/* Members preview thumbnails */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex -space-x-2 overflow-hidden">
              {activeUsers.slice(0, 5).map((u) => (
                <div
                  key={u.id}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#17211c] bg-[#0a7d5a] text-white flex items-center justify-center font-bold text-xs uppercase"
                  title={`${u.first} ${u.last}`}
                >
                  {u.photo ? (
                    <img src={u.photo} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    u.first[0]
                  )}
                </div>
              ))}
            </div>
            <span className="text-xs font-semibold text-[#5a6a62] dark:text-[#9db0a5]">
              {activeUsers.length} ta faol roʻyxatdan oʻtgan aʼzo
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {currentUser ? (
              <button
                type="button"
                onClick={onOpenCabinet}
                className="py-3 px-6 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-sm rounded-xl hover:brightness-105 transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Shaxsiy sahifangizga oʻtish</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#d92d20] text-white text-xs font-extrabold">
                    {unreadCount} yangi
                  </span>
                )}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="py-3 px-5 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-xs sm:text-sm rounded-xl hover:brightness-105 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Roʻyxatdan oʻtish</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="py-3 px-5 bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] text-[#14211b] dark:text-[#e9f1ec] font-bold text-xs sm:text-sm rounded-xl hover:border-[#0a7d5a] dark:hover:border-[#3cc99a] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Kirish</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth('apply')}
                  className="text-xs text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#0a7d5a] dark:hover:text-[#3cc99a] font-medium hover:underline ml-1 cursor-pointer"
                >
                  Telegram orqali ariza yuborish
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onOpenUsersEditor}
              className="py-3 px-4 rounded-xl border border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-800 dark:text-amber-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Roʻyxatdan oʻtganlar muharriri</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
