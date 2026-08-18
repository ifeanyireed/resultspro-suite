import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string | null;
  coinBalance: number;
  eloRating: number;
  streakCurrent: number;
  referralCode: string;
  isPremium: boolean;
  isAdmin: boolean;
  role: 'STUDENT' | 'MODERATOR' | 'ADMIN';
  emailNotifications: boolean;
  pushNotifications: boolean;
  targetExams: string;
  isPublic: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    setAuth: (user, token) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    },
    updateUser: (updatedUser) =>
      set((state) => {
        const newUser = state.user ? { ...state.user, ...updatedUser } : null;
        if (newUser) localStorage.setItem('user', JSON.stringify(newUser));
        return { user: newUser };
      }),
    fetchUser: async () => {
      try {
        const res = await api.get('/user/profile');
        const updatedUser = res.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    }
  };
});
