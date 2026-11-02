import React, { useState, useEffect } from 'react';
import { UserProfile, UserContact, ChatMessage, Thread } from '../types';
import { SUBJECTS } from '../data/initialData';
import { ArrowLeft, User, Users, MessageSquare, Send, Trash2, Camera, LogOut, Check, Search, Compass, Trophy } from 'lucide-react';

interface CabinetPageProps {
  currentUser: UserProfile;
  contact: UserContact | undefined;
  users: UserProfile[];
  messages: ChatMessage[];
  onSendMessage: (toUserId: string, text: string) => void;
  onDeleteMessage: (msgId: string) => void;
  onUpdateProfile: (updatedProfile: UserProfile, updatedContact?: UserContact) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onBackToShop: () => void;
  onOpenUsersEditor?: () => void;
}

export const CabinetPage: React.FC<CabinetPageProps> = ({
  currentUser,
  contact,
  users,
  messages,
  onSendMessage,
  onDeleteMessage,
  onUpdateProfile,
  onLogout,
  onDeleteAccount,
  onBackToShop,
  onOpenUsersEditor,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'people' | 'chats'>('profile');
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [searchPeer, setSearchPeer] = useState('');

  // Profile edit form fields
  const [school, setSchool] = useState<number>(currentUser.school || 1);
  const [grade, setGrade] = useState<number>(currentUser.grade || 9);
  const [interest, setInterest] = useState<string>(currentUser.interest || SUBJECTS[0]);
  const [phone, setPhone] = useState<string>(contact?.phone || '+998 ');
  const [email, setEmail] = useState<string>(contact?.email || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter peers (excluding deleted users)
  const otherUsers = users.filter((u) => u.id !== currentUser.id && !u.isDeleted);
  const filteredPeers = otherUsers.filter(
    (u) =>
      !searchPeer.trim() ||
      `${u.first} ${u.last} ${u.username}`.toLowerCase().includes(searchPeer.toLowerCase())
  );

  // Active chat peer
  const activePeer = users.find((u) => u.id === selectedPeerId);

  // Messages between current user and active peer
  const activeChatMessages = messages.filter(
    (m) =>
      (m.from === currentUser.id && m.to === selectedPeerId) ||
      (m.from === selectedPeerId && m.to === currentUser.id)
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedPeerId) return;

    onSendMessage(selectedPeerId, chatInput.trim());
    setChatInput('');
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProf: UserProfile = {
      ...currentUser,
      school: Number(school),
      grade: Number(grade),
      interest,
    };

    const updatedContact: UserContact | undefined = contact
      ? {
          ...contact,
          phone: phone.trim(),
          email: email.trim(),
        }
      : undefined;

    onUpdateProfile(updatedProf, updatedContact);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 200;
        const squareSize = Math.min(img.width, img.height);
        const sx = (img.width - squareSize) / 2;
        const sy = (img.height - squareSize) / 2;

        canvas.width = maxDim;
        canvas.height = maxDim;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, sx, sy, squareSize, squareSize, 0, 0, maxDim, maxDim);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          onUpdateProfile({ ...currentUser, photo: dataUrl }, contact);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] flex flex-col">
      {/* Top awning stripe */}
      <div className="awning-stripes w-full" aria-hidden="true" />

      {/* Cabinet Top Header */}
      <header className="bg-white dark:bg-[#17211c] border-b border-[#dfe6e1] dark:border-[#28372f] sticky top-0 z-30">
        <div className="max-w-[1240px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToShop}
              className="py-1.5 px-3 rounded-xl border border-[#dfe6e1] dark:border-[#28372f] text-xs font-bold flex items-center gap-1.5 hover:border-[#0a7d5a] dark:hover:border-[#3cc99a] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Doʻkonga qaytish</span>
            </button>

            <h1 className="font-display font-extrabold text-base sm:text-xl text-[#0a7d5a] dark:text-[#3cc99a]">
              Shaxsiy sahifa
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#5a6a62] dark:text-[#9db0a5] hidden sm:inline">
              @{currentUser.username}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="py-1.5 px-3 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col min-h-[550px]">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-[#dfe6e1] dark:border-[#28372f] pb-3 mb-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] shadow-xs'
                  : 'bg-transparent text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Mening profilim</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('people')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'people'
                  ? 'bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] shadow-xs'
                  : 'bg-transparent text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Roʻyxatdan oʻtganlar ({otherUsers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('chats');
                if (!selectedPeerId && otherUsers.length > 0) {
                  setSelectedPeerId(otherUsers[0].id);
                }
              }}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'chats'
                  ? 'bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] shadow-xs'
                  : 'bg-transparent text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Yozishmalar (Chat)</span>
            </button>
          </div>

          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-xl space-y-6">
              {/* Profile card preview */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f]">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#0a7d5a] text-white flex items-center justify-center font-display font-extrabold text-2xl uppercase shadow-md flex-none">
                  {currentUser.photo ? (
                    <img src={currentUser.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{currentUser.first[0]}</span>
                  )}
                  
                  <label
                    htmlFor="photoUpload"
                    className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white"
                    title="Rasmni oʻzgartirish"
                  >
                    <Camera className="w-6 h-6" />
                  </label>
                  <input
                    id="photoUpload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="font-display font-bold text-lg text-[#14211b] dark:text-[#e9f1ec]">
                    {currentUser.first} {currentUser.last}
                  </h2>
                  <p className="text-xs font-semibold text-[#0a7d5a] dark:text-[#3cc99a]">
                    @{currentUser.username}
                  </p>
                  <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] mt-1">
                    {currentUser.school}-maktab, {currentUser.grade}-sinf · {currentUser.interest}
                  </p>
                  {currentUser.generalTestScore ? (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px] font-bold">
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Umumiy test bali: {currentUser.generalTestScore} ball</span>
                    </div>
                  ) : (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[11px] font-medium">
                      <span>Umumiy test: hali topshirilmagan</span>
                    </div>
                  )}
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Maʼlumotlar saqlandi!</span>
                </div>
              )}

              {/* Edit form */}
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                      Maktab
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
                    Qiziqqan faningiz
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
                      Telefon raqam
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-xs rounded-xl hover:brightness-105 transition-all shadow-xs"
                  >
                    Oʻzgarishlarni saqlash
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Haqiqatdan ham hisobingizni oʻchirmoqchimisiz?')) {
                        onDeleteAccount();
                      }
                    }}
                    className="py-2.5 px-4 text-xs font-semibold text-red-600 hover:underline"
                  >
                    Hisobni oʻchirish
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: MEMBERS DIRECTORY */}
          {activeTab === 'people' && (
            <div className="space-y-4">
              {/* Search & Actions bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="search"
                    value={searchPeer}
                    onChange={(e) => setSearchPeer(e.target.value)}
                    placeholder="Ism yoki login boʻyicha roʻyxatdan oʻtganlarni qidirish..."
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>

                {onOpenUsersEditor && (
                  <button
                    type="button"
                    onClick={onOpenUsersEditor}
                    className="py-2 px-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-200 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Roʻyxatdan oʻtganlar muharriri</span>
                  </button>
                )}
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {filteredPeers.map((peer) => (
                  <div
                    key={peer.id}
                    className="p-4 rounded-2xl bg-[#f3f5f2] dark:bg-[#0f1613] border border-[#dfe6e1] dark:border-[#28372f] flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-[#0a7d5a] text-white flex items-center justify-center font-bold text-base uppercase flex-none">
                        {peer.photo ? (
                          <img src={peer.photo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span>{peer.first[0]}</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#14211b] dark:text-[#e9f1ec] truncate">
                          {peer.first} {peer.last}
                        </h3>
                        <p className="text-xs text-[#0a7d5a] dark:text-[#3cc99a]">
                          @{peer.username}
                        </p>
                        <p className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5]">
                          {peer.school}-maktab, {peer.grade}-sinf
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] block truncate">
                          Fan: {peer.interest}
                        </span>
                        {peer.generalTestScore ? (
                          <span className="text-[10px] font-bold text-[#0a7d5a] dark:text-[#3cc99a] block truncate">
                            Umumiy test: {peer.generalTestScore} ball
                          </span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPeerId(peer.id);
                          setActiveTab('chats');
                        }}
                        className="py-1.5 px-3 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-xs rounded-xl hover:brightness-105 transition-all flex items-center gap-1 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Yozish</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CHATS */}
          {activeTab === 'chats' && (
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] border border-[#dfe6e1] dark:border-[#28372f] rounded-2xl overflow-hidden h-[500px]">
              {/* Peers List */}
              <div className="border-r border-[#dfe6e1] dark:border-[#28372f] bg-[#f3f5f2] dark:bg-[#0f1613] overflow-y-auto">
                <div className="p-3 border-b border-[#dfe6e1] dark:border-[#28372f]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5a6a62] dark:text-[#9db0a5]">
                    Suhbatlar
                  </span>
                </div>
                <div className="divide-y divide-[#dfe6e1] dark:divide-[#28372f]">
                  {otherUsers.map((peer) => {
                    const isSelected = peer.id === selectedPeerId;
                    const lastMsg = [...messages]
                      .reverse()
                      .find(
                        (m) =>
                          (m.from === peer.id && m.to === currentUser.id) ||
                          (m.from === currentUser.id && m.to === peer.id)
                      );

                    return (
                      <button
                        key={peer.id}
                        type="button"
                        onClick={() => setSelectedPeerId(peer.id)}
                        className={`w-full p-3 text-left flex items-center gap-2.5 transition-colors ${
                          isSelected
                            ? 'bg-white dark:bg-[#17211c] font-semibold border-l-4 border-[#0a7d5a]'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-900'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full bg-[#0a7d5a] text-white flex items-center justify-center text-xs font-bold uppercase flex-none">
                          {peer.first[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs text-[#14211b] dark:text-[#e9f1ec] truncate">
                            {peer.first} {peer.last}
                          </h4>
                          <p className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] truncate">
                            {lastMsg ? lastMsg.text : `${peer.school}-maktab oʻquvchisi`}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat Message Pane */}
              <div className="flex flex-col bg-white dark:bg-[#17211c]">
                {activePeer ? (
                  <>
                    {/* Peer Header */}
                    <div className="p-3.5 border-b border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0a7d5a] text-white flex items-center justify-center text-xs font-bold uppercase">
                          {activePeer.first[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-xs sm:text-sm text-[#14211b] dark:text-[#e9f1ec]">
                            {activePeer.first} {activePeer.last}
                          </h3>
                          <p className="text-[10px] text-[#5a6a62] dark:text-[#9db0a5]">
                            {activePeer.school}-maktab, {activePeer.grade}-sinf · {activePeer.interest}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages scroll */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f3f5f2]/40 dark:bg-[#0f1613]/40">
                      {activeChatMessages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-center text-xs text-[#5a6a62] p-4">
                          Suhbat boshlanmagan. Birinchi xabaringizni yuboring!
                        </div>
                      ) : (
                        activeChatMessages.map((m) => {
                          const isMe = m.from === currentUser.id;
                          return (
                            <div
                              key={m.id}
                              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                className={`max-w-[75%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                                  isMe
                                    ? 'bg-[#0a7d5a] text-white rounded-br-none'
                                    : 'bg-white dark:bg-[#28372f] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#384840] rounded-bl-none shadow-xs'
                                }`}
                              >
                                <span>{m.text}</span>
                                <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] opacity-75 font-mono">
                                  <span>{formatTime(m.ts)}</span>
                                  {isMe && (
                                    <button
                                      type="button"
                                      onClick={() => onDeleteMessage(m.id)}
                                      className="opacity-0 group-hover:opacity-100 hover:text-red-300 ml-1 transition-opacity"
                                      title="Xabarni oʻchirish"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Chat input */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-[#dfe6e1] dark:border-[#28372f] flex gap-2">
                      <input
                        type="text"
                        required
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Xabar yozing..."
                        className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                      />
                      <button
                        type="submit"
                        className="py-2 px-4 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-xs rounded-xl hover:brightness-105 transition-all flex items-center gap-1 shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Yuborish</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#5a6a62]">
                    Chap tomondan suhbatdoshni tanlang.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
