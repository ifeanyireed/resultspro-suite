import { create } from 'zustand';
import api from '@/lib/api';
import { Role } from '@/lib/roles';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  school_id?: string;
  class_id?: string;
  account_status: string;
  created_at: string;
  phone?: string;
  sex?: string;
  date_of_birth?: string;
  address?: string;
  avatar_url?: string;
  mfa_enabled: boolean;
  auth_provider: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  
  let user = null;
  if (storedUser && storedUser !== 'undefined') {
    try {
      user = JSON.parse(storedUser);
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e);
      if (typeof window !== 'undefined') localStorage.removeItem('user');
    }
  }
  
  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken && !!user,
    setAuth: (user, accessToken, refreshToken) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, accessToken, refreshToken, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
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
