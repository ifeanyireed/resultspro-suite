import { create } from 'zustand';
import api from '@/lib/api';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl?: string | null;
  coinBalance?: number;
  eloRating?: number;
  streakCurrent?: number;
  referralCode?: string;
  isPremium?: boolean;
  premiumExpiresAt?: string;
  hasIcan?: boolean;
  icanExpiresAt?: string;
  icanPlanName?: string;
  isAdmin?: boolean;
  role?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  targetExams?: string;
  isPublic?: boolean;
  twoFactorEnabled?: boolean;
  createdAt?: string;
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

export const useAuthStore = create<AuthState>((set, get) => {
  const token = typeof window !== 'undefined' ? Cookies.get('token') || null : null;
  
  return {
    user: null, // Always fetch from DB on reload
    token,
    isAuthenticated: !!token,
    setAuth: (user, token) => {
      let rootDomain = '';
      if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        if (host.includes('localhost')) {
          rootDomain = 'localhost';
        } else {
          const parts = host.split('.');
          if (parts.length > 2) {
            rootDomain = `.${parts.slice(-2).join('.')}`;
          } else {
            rootDomain = `.${host}`;
          }
        }
      }
      Cookies.set('token', token, { expires: 7, domain: rootDomain || undefined, path: '/' });
      if (typeof window !== 'undefined') localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      let rootDomain = '';
      if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        if (host.includes('localhost')) {
          rootDomain = 'localhost';
        } else {
          const parts = host.split('.');
          if (parts.length > 2) {
            rootDomain = `.${parts.slice(-2).join('.')}`;
          } else {
            rootDomain = `.${host}`;
          }
        }
      }
      Cookies.remove('token', { domain: rootDomain || undefined, path: '/' });
      Cookies.remove('token'); // Fallback for any exact-match cookies
      if (typeof window !== 'undefined') localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
    updateUser: (updatedUser) =>
      set((state) => {
        const newUser = state.user ? { ...state.user, ...updatedUser } : null;
        return { user: newUser };
      }),
    fetchUser: async () => {
      try {
        const currentToken = get().token || (typeof window !== 'undefined' ? Cookies.get('token') : null);
        if (!currentToken) {
          set({ isAuthenticated: false, user: null });
          return;
        }
        // Force DB sync instead of local store
        const res = await api.get('/user/profile', {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
        const updatedUser = res.data;
        set({ user: updatedUser, isAuthenticated: true });
      } catch (err) {
        // silently fail, maybe clear auth if 401
      }
    }
  };
});
