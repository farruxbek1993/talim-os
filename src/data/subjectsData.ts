import React from 'react';
import {
  Calculator,
  Atom,
  Code2,
  FlaskConical,
  Dna,
  BookOpen,
  Languages,
  Landmark,
  Globe,
  Scale,
  Palette,
  Music,
  Compass,
  Cpu,
  Microscope,
  GraduationCap,
  Lightbulb,
  Binary,
} from 'lucide-react';

export interface SubjectItem {
  id: string;
  name: string;
  desc: string;
  grades: string;
  topicsCount: number;
  color: string;
  bgLight: string;
  iconName: string;
}

export const SUBJECT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  calculator: Calculator,
  code: Code2,
  atom: Atom,
  flask: FlaskConical,
  dna: Dna,
  book: BookOpen,
  languages: Languages,
  landmark: Landmark,
  globe: Globe,
  scale: Scale,
  palette: Palette,
  music: Music,
  compass: Compass,
  cpu: Cpu,
  microscope: Microscope,
  graduation: GraduationCap,
  lightbulb: Lightbulb,
  binary: Binary,
};

export const ICON_OPTIONS: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'calculator', label: 'Hisoblagich (Matematika)', icon: Calculator },
  { id: 'code', label: 'Dasturlash (IT)', icon: Code2 },
  { id: 'atom', label: 'Atom (Fizika)', icon: Atom },
  { id: 'flask', label: 'Kolba (Kimyo)', icon: FlaskConical },
  { id: 'dna', label: 'DNK (Biologiya)', icon: Dna },
  { id: 'book', label: 'Kitob (Ona tili/Adabiyot)', icon: BookOpen },
  { id: 'languages', label: 'Tillar (Ingliz tili)', icon: Languages },
  { id: 'landmark', label: 'Tarixiy bino (Tarix)', icon: Landmark },
  { id: 'globe', label: 'Globus (Geografiya)', icon: Globe },
  { id: 'scale', label: 'Tarozi (Huquq)', icon: Scale },
  { id: 'palette', label: 'Palitra (Tasviriy sanʼat)', icon: Palette },
  { id: 'music', label: 'Musiqa (Nota)', icon: Music },
  { id: 'compass', label: 'Kompas (Chizmachilik)', icon: Compass },
  { id: 'cpu', label: 'Protsessor (Robototexnika)', icon: Cpu },
  { id: 'microscope', label: 'Mikroskop (Ilm-fan)', icon: Microscope },
  { id: 'graduation', label: 'Akademik qalpogʻcha', icon: GraduationCap },
  { id: 'lightbulb', label: 'Chiroq (Mantiq)', icon: Lightbulb },
  { id: 'binary', label: 'Ikkilik kod (Kiberxavfsizlik)', icon: Binary },
];

export const COLOR_OPTIONS = [
  {
    id: 'blue',
    label: 'Koʻk',
    color: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-500/10 dark:bg-blue-500/15 border-blue-200 dark:border-blue-900/40',
  },
  {
    id: 'emerald',
    label: 'Yashil',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-900/40',
  },
  {
    id: 'indigo',
    label: 'Binafsharang',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgLight: 'bg-indigo-500/10 dark:bg-indigo-500/15 border-indigo-200 dark:border-indigo-900/40',
  },
  {
    id: 'purple',
    label: 'Siyohrang',
    color: 'text-purple-600 dark:text-purple-400',
    bgLight: 'bg-purple-500/10 dark:bg-purple-500/15 border-purple-200 dark:border-purple-900/40',
  },
  {
    id: 'teal',
    label: 'Moviy / Zumrad',
    color: 'text-teal-600 dark:text-teal-400',
    bgLight: 'bg-teal-500/10 dark:bg-teal-500/15 border-teal-200 dark:border-teal-900/40',
  },
  {
    id: 'amber',
    label: 'Zargʻaldoq',
    color: 'text-amber-600 dark:text-amber-400',
    bgLight: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-200 dark:border-amber-900/40',
  },
  {
    id: 'rose',
    label: 'Qizil / Pushti',
    color: 'text-rose-600 dark:text-rose-400',
    bgLight: 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-200 dark:border-rose-900/40',
  },
  {
    id: 'orange',
    label: 'Olovrang',
    color: 'text-orange-600 dark:text-orange-400',
    bgLight: 'bg-orange-500/10 dark:bg-orange-500/15 border-orange-200 dark:border-orange-900/40',
  },
  {
    id: 'cyan',
    label: 'Firuza',
    color: 'text-cyan-600 dark:text-cyan-400',
    bgLight: 'bg-cyan-500/10 dark:bg-cyan-500/15 border-cyan-200 dark:border-cyan-900/40',
  },
  {
    id: 'sky',
    label: 'Havorang',
    color: 'text-sky-600 dark:text-sky-400',
    bgLight: 'bg-sky-500/10 dark:bg-sky-500/15 border-sky-200 dark:border-sky-900/40',
  },
];

export const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: 'math',
    name: 'Matematika',
    desc: 'Algebra, geometriya, matematik mantiq va olimpiada darsliklari',
    grades: '1–11-sinflar',
    topicsCount: 64,
    color: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-500/10 dark:bg-blue-500/15 border-blue-200 dark:border-blue-900/40',
    iconName: 'calculator',
  },
  {
    id: 'it',
    name: 'Informatika va IT',
    desc: 'Dasturlash asoslari, Python, algoritmlar va axborot texnologiyalari',
    grades: '5–11-sinflar',
    topicsCount: 52,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-900/40',
    iconName: 'code',
  },
  {
    id: 'physics',
    name: 'Fizika',
    desc: 'Mexanika, termodinamika, elektromagnetizm va atom fizikasi',
    grades: '6–11-sinflar',
    topicsCount: 48,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgLight: 'bg-indigo-500/10 dark:bg-indigo-500/15 border-indigo-200 dark:border-indigo-900/40',
    iconName: 'atom',
  },
  {
    id: 'chemistry',
    name: 'Kimyo',
    desc: 'Anorganik va organik kimyo, reaksiyalar va laboratoriya ishlari',
    grades: '7–11-sinflar',
    topicsCount: 42,
    color: 'text-purple-600 dark:text-purple-400',
    bgLight: 'bg-purple-500/10 dark:bg-purple-500/15 border-purple-200 dark:border-purple-900/40',
    iconName: 'flask',
  },
  {
    id: 'biology',
    name: 'Biologiya',
    desc: 'Botanika, zoologiya, odam anatomiyasi va umumiy genetika',
    grades: '5–11-sinflar',
    topicsCount: 56,
    color: 'text-teal-600 dark:text-teal-400',
    bgLight: 'bg-teal-500/10 dark:bg-teal-500/15 border-teal-200 dark:border-teal-900/40',
    iconName: 'dna',
  },
  {
    id: 'literature',
    name: 'Ona tili va adabiyot',
    desc: 'Grammatika, orfografiya, mumtoz va zamonaviy oʻzbek adabiyoti',
    grades: '1–11-sinflar',
    topicsCount: 60,
    color: 'text-amber-600 dark:text-amber-400',
    bgLight: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-200 dark:border-amber-900/40',
    iconName: 'book',
  },
  {
    id: 'english',
    name: 'Ingliz tili',
    desc: 'Grammar, Reading, Vocabulary, soʻzlashuv va matnlar tahlili',
    grades: '1–11-sinflar',
    topicsCount: 72,
    color: 'text-rose-600 dark:text-rose-400',
    bgLight: 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-200 dark:border-rose-900/40',
    iconName: 'languages',
  },
  {
    id: 'history',
    name: 'Tarix',
    desc: 'Oʻzbekiston tarixi, qadimgi dunyo va yangi davr jahon tarixi',
    grades: '5–11-sinflar',
    topicsCount: 50,
    color: 'text-orange-600 dark:text-orange-400',
    bgLight: 'bg-orange-500/10 dark:bg-orange-500/15 border-orange-200 dark:border-orange-900/40',
    iconName: 'landmark',
  },
  {
    id: 'geography',
    name: 'Geografiya',
    desc: 'Tabiiy geografiya, jahon mamlakatlari va xaritalar bilan ishlash',
    grades: '5–11-sinflar',
    topicsCount: 38,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgLight: 'bg-cyan-500/10 dark:bg-cyan-500/15 border-cyan-200 dark:border-cyan-900/40',
    iconName: 'globe',
  },
  {
    id: 'law',
    name: 'Huquq va Iqtisodiyot',
    desc: 'Konstitutsiya, inson huquqlari va bozor iqtisodiyoti asoslari',
    grades: '8–11-sinflar',
    topicsCount: 34,
    color: 'text-sky-600 dark:text-sky-400',
    bgLight: 'bg-sky-500/10 dark:bg-sky-500/15 border-sky-200 dark:border-sky-900/40',
    iconName: 'scale',
  },
];

export function getSubjectIcon(iconName?: string): React.ComponentType<{ className?: string }> {
  if (!iconName) return GraduationCap;
  return SUBJECT_ICONS[iconName] || GraduationCap;
}
