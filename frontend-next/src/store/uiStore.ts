import { create } from 'zustand';
import { Schedule } from '@/types';

interface UIState {
  isClassFormOpen: boolean;
  editingSchedule: Schedule | null;
  isChatOpen: boolean;
  isShareModalOpen: boolean;
  openClassForm: (schedule?: Schedule) => void;
  closeClassForm: () => void;
  toggleChat: () => void;
  openShareModal: () => void;
  closeShareModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isClassFormOpen: false,
  editingSchedule: null,
  isChatOpen: true,
  isShareModalOpen: false,
  openClassForm: (schedule) => set({ isClassFormOpen: true, editingSchedule: schedule ?? null }),
  closeClassForm: () => set({ isClassFormOpen: false, editingSchedule: null }),
  toggleChat: () => set((s) => ({ isChatOpen: !s.isChatOpen })),
  openShareModal: () => set({ isShareModalOpen: true }),
  closeShareModal: () => set({ isShareModalOpen: false }),
}));
