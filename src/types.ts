export interface Category {
  id: string;
  name: string;
  hue: number;
}

export interface Product {
  id: number;
  cat: string;
  name: string;
  price: number;
  old: number;
  rate: number;
  rev: number;
  hue: number;
  desc?: string;
  img?: string;
  on?: boolean;
}

export interface ShopSettings {
  name: string;
  tg: string;
  ratings: boolean;
  demo: boolean;
}

export interface FilterState {
  cat: string;
  q: string;
  sort: 'pop' | 'cheap' | 'exp' | 'rate' | 'disc';
  maxPrice: number | null;
  minRate: number;
  saleOnly: boolean;
  favOnly: boolean;
  shown: number;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  name: string;
  phone: string;
  region: string;
  address: string;
  payment: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: number;
}

export interface UserProfile {
  id: string;
  username: string;
  first: string;
  last: string;
  school: number;
  grade: number;
  interest: string;
  photo?: string;
  createdAt: number;
  testScore?: number;
  testSubject?: string;
  testsCompleted?: number;
  generalTestScore?: number;
  generalTestSubject?: string;
  generalTestsCompleted?: number;
  isDeleted?: boolean;
  deletedAt?: number;
}

export interface UserContact {
  id: string;
  username: string;
  first: string;
  last: string;
  father: string;
  mahalla: string;
  street: string;
  phone: string;
  email: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  ts: number;
}

export interface Thread {
  id: string;
  members: [string, string];
  lastText: string;
  lastSender: string;
  lastTs: number;
}

export interface AdItem {
  id: string;
  badge: string;
  title: string;
  desc: string;
  btnText: string;
  btnActionType: 'category' | 'link' | 'none';
  targetCategory?: string;
  targetLink?: string;
  bgGradient: 'green' | 'blue' | 'amber' | 'purple' | 'slate';
  bgImage?: string;
  on: boolean;
  arts?: { cat: string; hue: number }[];
}
