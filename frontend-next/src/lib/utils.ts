import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'];
export const DAY_NAMES_FULL = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

export const SCHEDULE_COLORS = [
  '#6366F1', // Indigo
  '#22C55E', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#EC4899', // Pink
];

export const PRIORITY_LABELS = {
  0: '보통',
  1: '높음',
  2: '긴급',
} as const;

export const SCHEDULE_TYPE_LABELS = {
  class: '수업',
  event: '이벤트',
  study: '자율학습',
} as const;

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
