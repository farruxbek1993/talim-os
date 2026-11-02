import React, { useState } from 'react';
import {
  GraduationCap,
  ArrowRight,
  BookMarked,
  Edit3,
} from 'lucide-react';
import type { SubjectItem } from '../data/subjectsData';
import { INITIAL_SUBJECTS, getSubjectIcon } from '../data/subjectsData';
import { Textbook, TEXTBOOKS } from '../data/textbooksData';
import {
  loadTextbooksFromIndexedDb,
  saveTextbooksToIndexedDb,
  sanitizeTextbooksForLocalStorage,
} from '../utils/indexedDbStorage';
import { SubjectDetailModal } from './SubjectDetailModal';
import { FanlarEditorModal } from './FanlarEditorModal';

interface FanlarSectionProps {
  onSelectSubject?: (subjectName: string) => void;
  subjects?: SubjectItem[];
  onSaveSubjects?: (subjects: SubjectItem[]) => void;
  textbooks?: Textbook[];
  onSaveTextbooks?: (textbooks: Textbook[]) => void;
  isEditorOpen?: boolean;
  onOpenEditor?: () => void;
  onCloseEditor?: () => void;
}

export type { SubjectItem };

export const FanlarSection: React.FC<FanlarSectionProps> = ({
  onSelectSubject,
  subjects: propSubjects,
  onSaveSubjects: propOnSaveSubjects,
  textbooks: propTextbooks,
  onSaveTextbooks: propOnSaveTextbooks,
  isEditorOpen: propIsEditorOpen,
  onOpenEditor,
  onCloseEditor,
}) => {
  // Local fallback state if not provided from parent
  const [localSubjects, setLocalSubjects] = useState<SubjectItem[]>(() => {
    try {
      const saved = localStorage.getItem('bz-subjects');
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [localTextbooks, setLocalTextbooks] = useState<Textbook[]>(() => {
    try {
      const saved = localStorage.getItem('bz-textbooks');
      return saved ? JSON.parse(saved) : TEXTBOOKS;
    } catch {
      return TEXTBOOKS;
    }
  });

  // Restore from IndexedDB if running standalone
  React.useEffect(() => {
    if (!propTextbooks) {
      loadTextbooksFromIndexedDb().then((dbBooks) => {
        if (dbBooks && dbBooks.length > 0) {
          setLocalTextbooks(dbBooks);
        }
      });
    }
  }, [propTextbooks]);

  const [localIsEditorOpen, setLocalIsEditorOpen] = useState(false);
  const [selectedSubjectModal, setSelectedSubjectModal] = useState<SubjectItem | null>(null);

  // Active items and handlers
  const subjects = propSubjects || localSubjects;
  const textbooks = propTextbooks || localTextbooks;

  const handleSaveSubjects = (newSubjs: SubjectItem[]) => {
    if (propOnSaveSubjects) {
      propOnSaveSubjects(newSubjs);
    } else {
      setLocalSubjects(newSubjs);
      try {
        localStorage.setItem('bz-subjects', JSON.stringify(newSubjs));
      } catch {
        // ignore
      }
    }
  };

  const handleSaveTextbooks = (newBooks: Textbook[]) => {
    // Save to IndexedDB to permanently store full PDF files
    saveTextbooksToIndexedDb(newBooks);

    if (propOnSaveTextbooks) {
      propOnSaveTextbooks(newBooks);
    } else {
      setLocalTextbooks(newBooks);
      try {
        const sanitized = sanitizeTextbooksForLocalStorage(newBooks);
        localStorage.setItem('bz-textbooks', JSON.stringify(sanitized));
      } catch {
        // ignore
      }
    }
  };

  const isEditorOpen = propIsEditorOpen !== undefined ? propIsEditorOpen : localIsEditorOpen;
  const handleOpenEditor = onOpenEditor || (() => setLocalIsEditorOpen(true));
  const handleCloseEditor = onCloseEditor || (() => setLocalIsEditorOpen(false));

  const handleCardClick = (subject: SubjectItem) => {
    setSelectedSubjectModal(subject);
    if (onSelectSubject) {
      onSelectSubject(subject.name);
    }
  };

  return (
    <section className="max-w-[1240px] mx-auto px-4 mt-10 sm:mt-14" id="fanlar">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#0a7d5a]/10 dark:bg-[#3cc99a]/15 text-[#0a7d5a] dark:text-[#3cc99a]">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#14211b] dark:text-[#e9f1ec]">
              Fanlar boʻlimi
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5a6a62] dark:text-[#9db0a5] mt-1">
            Maktab va oliy taʼlim oʻquv fanlari, elektron darsliklar, boblar va nazariy qoʻllanmalar (darsliklarni koʻrish uchun fanni bosing)
          </p>
        </div>

        {/* Fanlar muharriri button */}
        <button
          type="button"
          onClick={handleOpenEditor}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border border-[#dfe6e1] dark:border-[#28372f] bg-white dark:bg-[#17211c] text-[#0a7d5a] dark:text-[#3cc99a] hover:border-[#0a7d5a] transition-all shadow-xs cursor-pointer hover:bg-[#0a7d5a]/5"
          title="Fanlar va darsliklarni tahrirlash yoki yangi fan qoʻshish"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Fanlar muharriri</span>
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {subjects.map((subject) => {
          const Icon = getSubjectIcon(subject.iconName || subject.id);
          const bookCount = textbooks.filter((b) => b.subjectId === subject.id).length;

          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => handleCardClick(subject)}
              className="group p-4 rounded-2xl bg-white dark:bg-[#17211c] border border-[#dfe6e1] dark:border-[#28372f] hover:border-[#0a7d5a] dark:hover:border-[#3cc99a] hover:ring-2 hover:ring-[#0a7d5a]/20 transition-all text-left flex flex-col justify-between shadow-xs hover:shadow-md cursor-pointer hover:-translate-y-0.5 duration-200"
              title={`${subject.name} fani darsliklarini ochish (${bookCount} ta darslik)`}
            >
              {/* Icon & Grade badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 border ${subject.bgLight}`}
                >
                  <Icon className={`w-6 h-6 ${subject.color}`} />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[#5a6a62] dark:text-[#9db0a5]">
                  {subject.grades}
                </span>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h3 className="font-display font-bold text-sm sm:text-base text-[#14211b] dark:text-[#e9f1ec] group-hover:text-[#0a7d5a] dark:group-hover:text-[#3cc99a] transition-colors line-clamp-1">
                  {subject.name}
                </h3>
                <p className="text-[11px] text-[#5a6a62] dark:text-[#9db0a5] line-clamp-2 leading-relaxed">
                  {subject.desc}
                </p>
              </div>

              {/* Footer stats: Topics and Lessons count (NO TESTS) */}
              <div className="mt-3 pt-2.5 border-t border-[#dfe6e1] dark:border-[#28372f] flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#0a7d5a] dark:text-[#3cc99a] flex items-center gap-1">
                  <BookMarked className="w-3.5 h-3.5" />
                  <span>{subject.topicsCount} ta mavzu</span>
                </span>
                <span className="text-[#5a6a62] dark:text-[#9db0a5] font-semibold flex items-center gap-0.5 group-hover:text-[#0a7d5a] dark:group-hover:text-[#3cc99a] group-hover:translate-x-0.5 transition-all">
                  <span>{bookCount > 0 ? `${bookCount} ta darslik` : 'Darsliklar'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dedicated Subject Textbooks Modal */}
      {selectedSubjectModal && (
        <SubjectDetailModal
          subject={selectedSubjectModal}
          textbooks={textbooks}
          onClose={() => setSelectedSubjectModal(null)}
        />
      )}

      {/* Fanlar Muharriri Modal */}
      <FanlarEditorModal
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        subjects={subjects}
        onSaveSubjects={handleSaveSubjects}
        textbooks={textbooks}
        onSaveTextbooks={handleSaveTextbooks}
      />
    </section>
  );
};
