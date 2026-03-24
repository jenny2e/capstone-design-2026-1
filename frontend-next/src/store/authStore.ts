import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
      },
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('token');
      },
    }),
    { name: 'auth-storage', partialize: (state) => ({ token: state.token }) }
  )
);
