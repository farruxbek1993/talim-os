import React, { useState, useMemo } from 'react';
import { UserProfile, UserContact } from '../types';
import { SUBJECTS } from '../data/initialData';
import {
  X,
  Users,
  Search,
  Edit3,
  Trash2,
  RotateCcw,
  Plus,
  Save,
  CheckCircle2,
  AlertTriangle,
  School,
  GraduationCap,
  Trophy,
  Phone,
  Mail,
  MapPin,
  UserCheck,
  UserX,
  Filter,
} from 'lucide-react';

interface UsersEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  contacts: UserContact[];
  onSaveUser: (updatedUser: UserProfile, updatedContact?: Partial<UserContact>) => void;
  onDeleteUser: (userId: string) => void;
  onRestoreUser: (userId: string) => void;
  onPermanentDeleteUser: (userId: string) => void;
  onAddUser: (newUser: UserProfile, newContact?: UserContact) => void;
  currentUserId?: string;
}

export const UsersEditorModal: React.FC<UsersEditorModalProps> = ({
  isOpen,
  onClose,
  users,
  contacts,
  onSaveUser,
  onDeleteUser,
  onRestoreUser,
  onPermanentDeleteUser,
  onAddUser,
  currentUserId,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'deleted' | 'new'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Edit form state
  const [editFirst, setEditFirst] = useState('');
  const [editLast, setEditLast] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editSchool, setEditSchool] = useState<number>(1);
  const [editGrade, setEditGrade] = useState<number>(9);
  const [editInterest, setEditInterest] = useState<string>(SUBJECTS[0]);
  const [editGenScore, setEditGenScore] = useState<number>(0);
  const [editGenSubject, setEditGenSubject] = useState<string>('Umumiy testlar');
  const [editGenTestsCompleted, setEditGenTestsCompleted] = useState<number>(0);
  const [editTestScore, setEditTestScore] = useState<number>(0);
  const [editTestSubject, setEditTestSubject] = useState<string>('Matematika');
  const [editTestsCompleted, setEditTestsCompleted] = useState<number>(0);
  const [editPhone, setEditPhone] = useState<string>('+998 ');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editFather, setEditFather] = useState<string>('');
  const [editMahalla, setEditMahalla] = useState<string>('');
  const [editStreet, setEditStreet] = useState<string>('');

  // Add new user form state
  const [newFirst, setNewFirst] = useState('');
  const [newLast, setNewLast] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newSchool, setNewSchool] = useState<number>(1);
  const [newGrade, setNewGrade] = useState<number>(9);
  const [newInterest, setNewInterest] = useState<string>(SUBJECTS[0]);
  const [newGenScore, setNewGenScore] = useState<number>(0);
  const [newTestScore, setNewTestScore] = useState<number>(0);
  const [newPhone, setNewPhone] = useState<string>('+998 ');
  const [newEmail, setNewEmail] = useState<string>('');

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const activeUsers = useMemo(() => users.filter((u) => !u.isDeleted), [users]);
  const deletedUsers = useMemo(() => users.filter((u) => !!u.isDeleted), [users]);

  // Filtered active list
  const filteredActiveUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return activeUsers.filter((u) => {
      if (gradeFilter !== 'all' && String(u.grade) !== gradeFilter) return false;
      if (!q) return true;
      const full = `${u.first} ${u.last} ${u.username} ${u.school} ${u.interest}`.toLowerCase();
      return full.includes(q);
    });
  }, [activeUsers, searchQuery, gradeFilter]);

  // Filtered deleted list
  const filteredDeletedUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return deletedUsers.filter((u) => {
      if (!q) return true;
      const full = `${u.first} ${u.last} ${u.username} ${u.school} ${u.interest}`.toLowerCase();
      return full.includes(q);
    });
  }, [deletedUsers, searchQuery]);

  // Start editing a user
  const startEdit = (user: UserProfile) => {
    setEditingUserId(user.id);
    setEditFirst(user.first || '');
    setEditLast(user.last || '');
    setEditUsername(user.username || '');
    setEditSchool(user.school || 1);
    setEditGrade(user.grade || 9);
    setEditInterest(user.interest || SUBJECTS[0]);
    setEditGenScore(user.generalTestScore || 0);
    setEditGenSubject(user.generalTestSubject || 'Umumiy testlar');
    setEditGenTestsCompleted(user.generalTestsCompleted || 0);
    setEditTestScore(user.testScore || 0);
    setEditTestSubject(user.testSubject || 'Matematika');
    setEditTestsCompleted(user.testsCompleted || 0);

    const c = contacts.find((item) => item.id === user.id);
    setEditPhone(c?.phone || '+998 ');
    setEditEmail(c?.email || '');
    setEditFather(c?.father || '');
    setEditMahalla(c?.mahalla || '');
    setEditStreet(c?.street || '');
  };

  const cancelEdit = () => {
    setEditingUserId(null);
  };

  // Submit user updates
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;

    const original = users.find((u) => u.id === editingUserId);
    if (!original) return;

    if (!editFirst.trim() || !editLast.trim() || !editUsername.trim()) {
      showNotification('Ism, familiya va login boʻsh boʻlishi mumkin emas.');
      return;
    }

    const updatedUser: UserProfile = {
      ...original,
      first: editFirst.trim(),
      last: editLast.trim(),
      username: editUsername.trim().toLowerCase(),
      school: Number(editSchool) || 1,
      grade: Number(editGrade) || 1,
      interest: editInterest,
      generalTestScore: Number(editGenScore) || 0,
      generalTestSubject: editGenSubject,
      generalTestsCompleted: Number(editGenTestsCompleted) || 0,
      testScore: Number(editTestScore) || 0,
      testSubject: editTestSubject,
      testsCompleted: Number(editTestsCompleted) || 0,
    };

    const contactData: Partial<UserContact> = {
      phone: editPhone.trim(),
      email: editEmail.trim(),
      father: editFather.trim(),
      mahalla: editMahalla.trim(),
      street: editStreet.trim(),
    };

    onSaveUser(updatedUser, contactData);
    setEditingUserId(null);
    showNotification(`${updatedUser.first} ${updatedUser.last} maʼlumotlari muvaffaqiyatli saqlandi!`);
  };

  // Submit new user
  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirst.trim() || !newLast.trim() || !newUsername.trim()) {
      showNotification('Ism, familiya va login boʻsh boʻlishi mumkin emas.');
      return;
    }

    const usernameClean = newUsername.trim().toLowerCase();
    const exists = users.some((u) => u.username.toLowerCase() === usernameClean);
    if (exists) {
      showNotification(`"${usernameClean}" logini allaqachon mavjud! Boshqa login tanlang.`);
      return;
    }

    const uid = `user_${Date.now()}`;
    const newUser: UserProfile = {
      id: uid,
      first: newFirst.trim(),
      last: newLast.trim(),
      username: usernameClean,
      school: Number(newSchool) || 1,
      grade: Number(newGrade) || 1,
      interest: newInterest,
      generalTestScore: Number(newGenScore) || 0,
      generalTestSubject: 'Umumiy testlar',
      generalTestsCompleted: Number(newGenScore) > 0 ? 1 : 0,
      testScore: Number(newTestScore) || 0,
      testSubject: newInterest,
      testsCompleted: Number(newTestScore) > 0 ? 1 : 0,
      createdAt: Date.now(),
      isDeleted: false,
    };

    const newContact: UserContact = {
      id: uid,
      first: newFirst.trim(),
      last: newLast.trim(),
      username: usernameClean,
      father: '',
      mahalla: 'Markaziy',
      street: 'Tinchlik',
      phone: newPhone.trim() || '+998 ',
      email: newEmail.trim(),
      createdAt: Date.now(),
    };

    onAddUser(newUser, newContact);
    setNewFirst('');
    setNewLast('');
    setNewUsername('');
    setNewPhone('+998 ');
    setNewEmail('');
    setNewGenScore(0);
    setNewTestScore(0);
    setActiveTab('active');
    showNotification(`Yangi foydalanuvchi "${newUser.first} ${newUser.last}" qoʻshildi!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between bg-[#f8faf9] dark:bg-[#121a16]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/20 text-[#0a7d5a] dark:text-[#3cc99a] flex items-center justify-center flex-none">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl text-[#14211b] dark:text-[#e9f1ec] flex items-center gap-2">
                <span>Roʻyxatdan oʻtganlar muharriri</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0a7d5a]/10 text-[#0a7d5a] dark:text-[#3cc99a]">
                  Boshqaruv paneli
                </span>
              </h2>
              <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5]">
                Profil maʼlumotlarini oʻzgartirish, hisoblarni oʻchirish va qayta tiklash
              </p>
            </div>
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

        {/* Floating Toast Notification */}
        {toast && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0a7d5a] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toast}</span>
          </div>
        )}

        {/* Tabs and Navigation */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-[#dfe6e1] dark:border-[#28372f] flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#17211c]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('active');
                setEditingUserId(null);
              }}
              className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'active'
                  ? 'bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] shadow-xs'
                  : 'bg-[#f3f5f2] dark:bg-[#0f1613] text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Faol hisoblar ({activeUsers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('deleted');
                setEditingUserId(null);
              }}
              className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'deleted'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-[#f3f5f2] dark:bg-[#0f1613] text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b]'
              }`}
            >
              <UserX className="w-4 h-4" />
              <span>Oʻchirilgan hisoblar ({deletedUsers.length})</span>
              {deletedUsers.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('new');
                setEditingUserId(null);
              }}
              className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'new'
                  ? 'bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] shadow-xs'
                  : 'bg-[#f3f5f2] dark:bg-[#0f1613] text-[#5a6a62] dark:text-[#9db0a5] hover:text-[#14211b]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Yangi hisob qoʻshish</span>
            </button>
          </div>

          {/* Quick Search */}
          {activeTab !== 'new' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6a62] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ism, login, maktab..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                />
              </div>

              {activeTab === 'active' && (
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="py-1.5 px-2.5 text-xs rounded-xl bg-[#f3f5f2] dark:bg-[#0f1613] text-[#14211b] dark:text-[#e9f1ec] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none"
                >
                  <option value="all">Barcha sinflar</option>
                  {[5, 6, 7, 8, 9, 10, 11].map((g) => (
                    <option key={g} value={String(g)}>
                      {g}-sinf
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: ACTIVE USERS */}
          {activeTab === 'active' && (
            <>
              {/* EDIT FORM POPUP / ACCORDION */}
              {editingUserId && (
                <div className="mb-6 p-4 sm:p-6 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border-2 border-amber-500/30 dark:border-amber-500/40">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-500/20">
                    <h3 className="font-display font-bold text-sm sm:text-base text-[#14211b] dark:text-[#e9f1ec] flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-500" />
                      <span>Foydalanuvchi profilini tahrirlash: @{editUsername}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-xs text-[#5a6a62] hover:text-[#14211b] px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-700"
                    >
                      Bekor qilish
                    </button>
                  </div>

                  <form onSubmit={handleSaveEdit} className="space-y-4">
                    {/* Basic info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Ism
                        </label>
                        <input
                          type="text"
                          required
                          value={editFirst}
                          onChange={(e) => setEditFirst(e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Familiya
                        </label>
                        <input
                          type="text"
                          required
                          value={editLast}
                          onChange={(e) => setEditLast(e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Login (username)
                        </label>
                        <input
                          type="text"
                          required
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                        />
                      </div>
                    </div>

                    {/* School, grade, interest */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Maktab raqami
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={5000}
                          value={editSchool}
                          onChange={(e) => setEditSchool(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Sinf
                        </label>
                        <select
                          value={editGrade}
                          onChange={(e) => setEditGrade(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                            <option key={g} value={g}>
                              {g}-sinf
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Qiziqqan fani / yoʻnalishi
                        </label>
                        <select
                          value={editInterest}
                          onChange={(e) => setEditInterest(e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none"
                        >
                          {SUBJECTS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Scores Section */}
                    <div className="p-3 rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] space-y-3">
                      <div className="text-xs font-bold text-[#0a7d5a] dark:text-[#3cc99a] flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span>Test ballari va gʻoliblik koʻrsatkichlari</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30">
                          <label className="block text-xs font-extrabold text-amber-800 dark:text-amber-300 mb-1">
                            🏆 Umumiy testlar bali (30-sana oylik gʻolibligi uchun)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] text-[#5a6a62]">Toʻplangan ball:</span>
                              <input
                                type="number"
                                step="0.5"
                                min={0}
                                max={100}
                                value={editGenScore}
                                onChange={(e) => setEditGenScore(Number(e.target.value))}
                                className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-[#17211c]"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-[#5a6a62]">Bajarilgan testlar:</span>
                              <input
                                type="number"
                                min={0}
                                value={editGenTestsCompleted}
                                onChange={(e) => setEditGenTestsCompleted(Number(e.target.value))}
                                className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-[#17211c]"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-[#121a16] border border-[#dfe6e1] dark:border-[#28372f]">
                          <label className="block text-xs font-extrabold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                            Fan testlari bali (fan boʻyicha)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] text-[#5a6a62]">Fan bali:</span>
                              <input
                                type="number"
                                step="0.5"
                                min={0}
                                max={100}
                                value={editTestScore}
                                onChange={(e) => setEditTestScore(Number(e.target.value))}
                                className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c]"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-[#5a6a62]">Bajarilgan fan testlari:</span>
                              <input
                                type="number"
                                min={0}
                                value={editTestsCompleted}
                                onChange={(e) => setEditTestsCompleted(Number(e.target.value))}
                                className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Telefon raqami
                        </label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                          Elektron pochta
                        </label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="py-2 px-4 rounded-xl text-xs font-bold text-[#5a6a62] hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="submit"
                        className="py-2 px-5 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-xs rounded-xl shadow-xs hover:brightness-105 flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>Oʻzgarishlarni saqlash</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Active Users List */}
              {filteredActiveUsers.length === 0 ? (
                <div className="text-center py-12 text-[#5a6a62]">
                  <p className="text-sm font-semibold">Qidiruv boʻyicha foydalanuvchilar topilmadi.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {filteredActiveUsers.map((u) => {
                    const c = contacts.find((item) => item.id === u.id);
                    const isSelf = u.id === currentUserId;

                    return (
                      <div
                        key={u.id}
                        className="p-4 rounded-2xl bg-[#f8faf9] dark:bg-[#121a16] border border-[#dfe6e1] dark:border-[#28372f] hover:border-[#0a7d5a]/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Top user row */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-[#0a7d5a] text-white flex items-center justify-center font-display font-extrabold text-base uppercase flex-none shadow-xs">
                                {u.photo ? (
                                  <img
                                    src={u.photo}
                                    alt=""
                                    className="w-full h-full object-cover rounded-2xl"
                                  />
                                ) : (
                                  u.first[0]
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-display font-bold text-sm text-[#14211b] dark:text-[#e9f1ec] truncate flex items-center gap-1.5">
                                  <span>
                                    {u.first} {u.last}
                                  </span>
                                  {isSelf && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#0a7d5a]/10 text-[#0a7d5a] dark:text-[#3cc99a] font-bold">
                                      Siz
                                    </span>
                                  )}
                                </h4>
                                <p className="text-xs text-[#0a7d5a] dark:text-[#3cc99a] font-semibold truncate">
                                  @{u.username}
                                </p>
                              </div>
                            </div>

                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                              Faol
                            </span>
                          </div>

                          {/* Info tags */}
                          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-[#5a6a62] dark:text-[#9db0a5]">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f]">
                              <School className="w-3 h-3 text-[#0a7d5a]" />
                              <span>{u.school}-maktab, {u.grade}-sinf</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f]">
                              <GraduationCap className="w-3 h-3 text-indigo-500" />
                              <span>{u.interest}</span>
                            </span>
                          </div>

                          {/* Score highlights */}
                          <div className="mt-2.5 p-2 rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-[10px] text-[#5a6a62] block">Umumiy test bali:</span>
                              <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                <Trophy className="w-3 h-3" />
                                <span>{u.generalTestScore ?? 0} ball</span>
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#5a6a62] block">Fan test bali:</span>
                              <span className="font-bold text-[#14211b] dark:text-[#e9f1ec]">
                                {u.testScore ?? 0} ball ({u.testsCompleted ?? 0} ta)
                              </span>
                            </div>
                          </div>

                          {/* Contact snippet if available */}
                          {c?.phone && c.phone !== '+998 ' && (
                            <div className="mt-2 text-[11px] text-[#5a6a62] dark:text-[#9db0a5] flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {c.phone}
                              </span>
                              {c.email && (
                                <span className="flex items-center gap-1 truncate">
                                  <Mail className="w-3 h-3" />
                                  {c.email}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="mt-4 pt-3 border-t border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(u)}
                            className="py-1.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Tahrirlash</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Rostdan ham ${u.first} ${u.last} (@${u.username}) hisobini oʻchirmoqchimisiz?\n\n(Keyinchalik "Oʻchirilgan hisoblar" boʻlimidan qayta tiklash imkoniyati saqlanib qoladi).`
                                )
                              ) {
                                onDeleteUser(u.id);
                                showNotification(`${u.first} ${u.last} hisobi oʻchirildi. Uni "Oʻchirilgan hisoblar"dan qayta tiklashingiz mumkin.`);
                              }
                            }}
                            className="py-1.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hisobni oʻchirish</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* TAB 2: DELETED ACCOUNTS (RESTORE / PERMANENT DELETE) */}
          {activeTab === 'deleted' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-none mt-0.5" />
                <div className="text-xs text-[#14211b] dark:text-[#e9f1ec] space-y-1">
                  <p className="font-bold">
                    Oʻchirilgan hisoblar arxivi ({deletedUsers.length} ta hisob)
                  </p>
                  <p className="text-[#5a6a62] dark:text-[#9db0a5]">
                    Ushbu hisoblar roʻyxatdan oʻtganlar roʻyxati va umumiy reytingdan chiqarilgan.
                    Siz istalgan payt <strong>“Qayta tiklash”</strong> tugmasini bosib hisobni oʻz joyiga qaytarishingiz mumkin.
                  </p>
                </div>
              </div>

              {filteredDeletedUsers.length === 0 ? (
                <div className="text-center py-14 text-[#5a6a62]">
                  <UserCheck className="w-10 h-10 mx-auto mb-2 text-emerald-600/40" />
                  <p className="text-sm font-semibold">Oʻchirilgan hisoblar mavjud emas.</p>
                  <p className="text-xs text-[#5a6a62] mt-1">
                    Barcha aʼzolar faol holatda ishlamoqda.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDeletedUsers.map((u) => {
                    const deletedDateStr = u.deletedAt
                      ? new Date(u.deletedAt).toLocaleString('uz-UZ', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Nomaʼlum vaqt';

                    return (
                      <div
                        key={u.id}
                        className="p-4 rounded-2xl bg-white dark:bg-[#17211c] border border-rose-200 dark:border-rose-950/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gray-200 dark:bg-gray-800 text-gray-500 flex items-center justify-center font-bold text-sm uppercase flex-none">
                            {u.first[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-[#14211b] dark:text-[#e9f1ec] line-through opacity-75">
                                {u.first} {u.last}
                              </h4>
                              <span className="text-xs text-rose-600 font-mono">@{u.username}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-bold">
                                Oʻchirilgan
                              </span>
                            </div>
                            <p className="text-xs text-[#5a6a62] dark:text-[#9db0a5] mt-0.5">
                              {u.school}-maktab, {u.grade}-sinf · Umumiy test bali: {u.generalTestScore || 0} ball
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Oʻchirilgan sana: {deletedDateStr}
                            </p>
                          </div>
                        </div>

                        {/* Restore & Permanent Delete Actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              onRestoreUser(u.id);
                              showNotification(`"${u.first} ${u.last}" hisobi muvaffaqiyatli qayta tiklandi!`);
                            }}
                            className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Qayta tiklash</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Diqqat! "${u.first} ${u.last}" hisobini butunlay (bazadan) oʻchirishni xohlaysizmi? Bu amalni ortga qaytarib boʻlmaydi!`
                                )
                              ) {
                                onPermanentDeleteUser(u.id);
                                showNotification(`Hisob butunlay oʻchirildi.`);
                              }
                            }}
                            className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                            title="Butunlay oʻchirish (Bazadan tozalash)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADD NEW USER */}
          {activeTab === 'new' && (
            <div className="max-w-xl mx-auto p-4 sm:p-6 rounded-2xl bg-[#f8faf9] dark:bg-[#121a16] border border-[#dfe6e1] dark:border-[#28372f]">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#dfe6e1] dark:border-[#28372f]">
                <Plus className="w-5 h-5 text-[#0a7d5a] dark:text-[#3cc99a]" />
                <h3 className="font-display font-bold text-base text-[#14211b] dark:text-[#e9f1ec]">
                  Yangi oʻquvchi / foydalanuvchi qoʻshish
                </h3>
              </div>

              <form onSubmit={handleCreateNewUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                      Ism *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="masalan, Shaxzod"
                      value={newFirst}
                      onChange={(e) => setNewFirst(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                      Familiya *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="masalan, Umarov"
                      value={newLast}
                      onChange={(e) => setNewLast(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                    Login (foydalanuvchi nomi) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="masalan, shaxzod_u"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none focus:border-[#0a7d5a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                      Maktab raqami
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5000}
                      value={newSchool}
                      onChange={(e) => setNewSchool(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                      Sinf
                    </label>
                    <select
                      value={newGrade}
                      onChange={(e) => setNewGrade(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                        <option key={g} value={g}>
                          {g}-sinf
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                    Qiziqqan fani
                  </label>
                  <select
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none"
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
                    <label className="block text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
                      Umumiy test bali (boshlangʻich)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      max={100}
                      value={newGenScore}
                      onChange={(e) => setNewGenScore(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-amber-300 dark:border-amber-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                      Fan test bali
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      max={100}
                      value={newTestScore}
                      onChange={(e) => setNewTestScore(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#14211b] dark:text-[#e9f1ec] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="nom@mail.uz"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#0a7d5a] dark:bg-[#3cc99a] text-white dark:text-[#06241a] font-bold text-sm rounded-xl hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Foydalanuvchini roʻyxatga qoʻshish</span>
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="p-3 sm:p-4 border-t border-[#dfe6e1] dark:border-[#28372f] bg-[#f8faf9] dark:bg-[#121a16] flex flex-wrap items-center justify-between text-xs text-[#5a6a62] dark:text-[#9db0a5]">
          <div className="flex items-center gap-4">
            <span>Jami: <strong>{users.length}</strong> ta</span>
            <span>Faol: <strong className="text-[#0a7d5a] dark:text-[#3cc99a]">{activeUsers.length}</strong></span>
            <span>Oʻchirilgan: <strong className="text-rose-600">{deletedUsers.length}</strong></span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 bg-gray-200 dark:bg-gray-800 text-[#14211b] dark:text-[#e9f1ec] font-bold rounded-xl text-xs hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
