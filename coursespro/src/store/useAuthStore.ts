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
  const token = typeof window !== 'undefined' ? (Cookies.get('token') || localStorage.getItem('token') || null) : null;
  
  return {
    user: null, // Always fetch from DB on reload
    token,
    isAuthenticated: !!token,
    setAuth: (user, token) => {
      let rootDomain: string | undefined = undefined;
      if (typeof window !== 'undefined') {
        const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost';
        // For localhost, we MUST omit the domain parameter so Chrome binds it strictly to the current subdomain.
        // For production, we use the wildcard domain .platformDomain to share across subdomains.
        if (platformDomain !== 'localhost') {
           rootDomain = `.${platformDomain}`;
        }
      }
      if (rootDomain) {
        Cookies.set('token', token, { expires: 7, domain: rootDomain, path: '/' });
      } else {
        Cookies.set('token', token, { expires: 7, path: '/' });
      }
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
        // Use auth introspect to get the user payload securely from token
        const res = await api.post('/api/v1/auth/introspect', { token: currentToken });
        if (res.data && res.data.active) {
          set({ user: res.data.user, isAuthenticated: true });
        } else {
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
          set({ isAuthenticated: false, user: null, token: null });
        }
      } catch (err) {
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
        set({ isAuthenticated: false, user: null, token: null });
      }
    }
  };
});
