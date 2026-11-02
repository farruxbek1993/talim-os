import React, { useState } from 'react';
import { UserProfile, UserContact } from '../types';
import { SUBJECTS } from '../data/initialData';
import { X, UserPlus, LogIn, Send } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'register' | 'login' | 'apply';
  setMode: (m: 'register' | 'login' | 'apply') => void;
  onRegister: (profile: UserProfile, contact: UserContact, pass: string) => void;
  onLogin: (username: string, pass: string) => boolean;
  shopTg: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  setMode,
  onRegister,
  onLogin,
  shopTg,
}) => {
  // Register / Apply fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [father, setFather] = useState('');
  const [mahalla, setMahalla] = useState('');
  const [street, setStreet] = useState('');
  const [school, setSchool] = useState<number>(1);
  const [grade, setGrade] = useState<number>(9);
  const [interest, setInterest] = useState(SUBJECTS[0]);
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(true);

  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [appliedText, setAppliedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (username.trim().length < 3) {
      setErrorMsg('Login (username) kamida 3 ta belgi boʻlishi kerak.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Parol kamida 4 ta belgi boʻlishi kerak.');
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMsg('Kiritilgan parollar bir-biriga mos kelmadi.');
      return;
    }
    if (!first.trim() || !last.trim()) {
      setErrorMsg('Ism va familiyangizni kiriting.');
      return;
    }
    if (!agree) {
      setErrorMsg('Maʼlumotlar saqlanishiga rozilik belgisini qoʻying.');
      return;
    }

    const userId = `u_${Date.now()}`;
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    const newProfile: UserProfile = {
      id: userId,
      username: cleanUsername,
      first: first.trim(),
      last: last.trim(),
      school: Number(school),
      grade: Number(grade),
      interest,
      createdAt: Date.now(),
    };

    const newContact: UserContact = {
      id: userId,
      username: cleanUsername,
      first: first.trim(),
      last: last.trim(),
      father: father.trim(),
      mahalla: mahalla.trim(),
      street: street.trim(),
      phone: phone.trim(),
      email: email.trim(),
      createdAt: Date.now(),
    };

    onRegister(newProfile, newContact, password);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const ok = onLogin(loginUsername.trim().toLowerCase(), loginPassword);
    if (ok) {
      onClose();
    } else {
      setErrorMsg('Login yoki parol notoʻgʻri.');
    }
  };

  const handleApplyTelegramSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      '📋 Roʻyxatdan oʻtganlar safiga qoʻshilish arizasi:',
      `👤 F.I.Sh: ${last.trim()} ${first.trim()} ${father.trim()}`,
      `🏫 Maktab va sinf: ${school}-maktab, ${grade}-sinf`,
      `📚 Qiziqqan fani: ${interest}`,
      `📍 Manzil: ${mahalla} mahallasi, ${street}`,
      `📞 Aloqa: ${phone.trim()} · ${email.trim()}`,
    ].join('\n');

    setAppliedText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#14211b] dark:text-[#e9f1ec]">
              {mode === 'login'
                ? 'Hisobga kirish'
                : mode === 'register'
                ? 'Roʻyxatdan oʻtish'
                : 'Roʻyxatdan oʻtishga ariza yuborish'}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 text-red-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                  Login (foydalanuvchi nomi)
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="masalan, malika_k"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                  Parol
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Parolni kiriting..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-sm rounded-xl hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Kirish</span>
              </button>

              <div className="pt-2 text-center text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                <span>Hisobingiz yoʻqmi? </span>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-[#0a7d5a] dark:text-[#3cc99a] font-bold hover:underline"
                >
                  Roʻyxatdan oʻtish
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                Hamjamiyatda profilingiz yaratiladi. Boshqa oʻquvchilar bilan suhbatlashishingiz mumkin boʻladi.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                    Login (username) *
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ali_2026"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                    Parol *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kamida 4 belgi"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                  Parolni takrorlang *
                </label>
                <input
                  type="password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="Parolni qayta kiriting"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                    Ism *
                  </label>
                  <input
                    type="text"
                    required
                    value={first}
                    onChange={(e) => setFirst(e.target.value)}
                    placeholder="Ali"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                    Familiya *
                  </label>
                  <input
                    type="text"
                    required
                    value={last}
                    onChange={(e) => setLast(e.target.value)}
                    placeholder="Valiyev"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                  Otasining ismi
                </label>
                <input
                  type="text"
                  value={father}
                  onChange={(e) => setFather(e.target.value)}
                  placeholder="Botir oʻgʻli"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                    Maktab raqami
                  </label>
                  <select
                    value={school}
                    onChange={(e) => setSchool(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                  >
                    {Array.from({ length: 68 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}-maktab
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                    Sinf
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                  >
                    {Array.from({ length: 11 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}-sinf
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                  Qiziqqan fan
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                    Mahalla
                  </label>
                  <input
                    type="text"
                    value={mahalla}
                    onChange={(e) => setMahalla(e.target.value)}
                    placeholder="Chilonzor"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                    Koʻcha va uy
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Navoiy k., 10"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                    Telefon raqam
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90..."
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                    Elektron pochta
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@mail.uz"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 pt-1 text-xs text-[#5a6a62] dark:text-[#9db0a5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="accent-[#0a7d5a] w-4 h-4 mt-0.5"
                />
                <span>Maʼlumotlarim saqlanishiga va aʼzolarga koʻrsatilishiga roziman.</span>
              </label>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-sm rounded-xl hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Roʻyxatdan oʻtish</span>
              </button>

              <div className="pt-2 text-center text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                <span>Allaqachon hisobingiz bormi? </span>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#0a7d5a] dark:text-[#3cc99a] font-bold hover:underline"
                >
                  Kirish
                </button>
              </div>
            </form>
          )}

          {/* TELEGRAM APPLY FORM */}
          {mode === 'apply' && (
            <div className="space-y-4">
              {appliedText ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 text-xs font-semibold rounded-xl">
                    Arizangiz tayyorlandi! Quyidagi tugma orqali uni doʻkonga Telegram orqali yuboring.
                  </div>
                  <pre className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-xs font-mono whitespace-pre-wrap border border-[#dfe6e1] dark:border-[#28372f]">
                    {appliedText}
                  </pre>
                  {shopTg && (
                    <a
                      href={`https://t.me/${shopTg.replace('@', '')}?text=${encodeURIComponent(appliedText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-[#0a7d5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Telegramda yuborish</span>
                    </a>
                  )}
                </div>
              ) : (
                <form onSubmit={handleApplyTelegramSubmit} className="space-y-3">
                  <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                    Ushbu shaklni toʻldirib, arizangizni toʻgʻridan-toʻgʻri doʻkon Telegramiga yuborishingiz mumkin.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Ism"
                      value={first}
                      onChange={(e) => setFirst(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-[#f3f5f2] dark:bg-[#0f1613]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Familiya"
                      value={last}
                      onChange={(e) => setLast(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-[#f3f5f2] dark:bg-[#0f1613]"
                    />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="Telefon"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-[#f3f5f2] dark:bg-[#0f1613]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0a7d5a] text-white font-bold text-xs rounded-xl"
                  >
                    Arizani tayyorlash
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
