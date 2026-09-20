import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  fetchUser: () => Promise<void>; // Kept for backwards compatibility if needed elsewhere
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        let rootDomain: string | undefined = undefined;
        if (typeof window !== 'undefined') {
          const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost';
          if (platformDomain !== 'localhost') {
             rootDomain = `.${platformDomain}`;
          }
        }
        
        if (rootDomain) {
          Cookies.set('token', token, { expires: 7, domain: rootDomain, path: '/' });
        } else {
          Cookies.set('token', token, { expires: 7, path: '/' });
        }
        
        // Also keep a fallback in localStorage just in case, though persist handles state
        if (typeof window !== 'undefined') localStorage.setItem('token', token);
        
        set({ user, token, isAuthenticated: true });
      },
      
      logout: () => {
        let rootDomain: string | undefined = undefined;
        if (typeof window !== 'undefined') {
          const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost';
          if (platformDomain !== 'localhost') {
             rootDomain = `.${platformDomain}`;
          }
        }
        
        Cookies.remove('token', { domain: rootDomain, path: '/' });
        Cookies.remove('token');
        if (typeof window !== 'undefined') localStorage.removeItem('token');
        
        set({ user: null, token: null, isAuthenticated: false });
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },
      
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
        
      fetchUser: async () => {
        // Intentionally left as a no-op to avoid breaking components that call it.
        // The user data is now hydrated instantly from local storage.
        // We rely on Axios interceptors (api.ts) to log the user out if the token actually expires
        // and throws a 401 Unauthorized during normal dashboard API usage.
        return;
      }
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      // We only want to persist user, token, and isAuthenticated
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
