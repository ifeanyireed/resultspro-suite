import { create } from 'zustand';
import api, { extractTenantIdFromJwt } from '../lib/api';
import { Role } from '../lib/roles';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  tenant_id?: string;
  tenant_slug?: string;
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
  
  let user: any = {
    id: "mock-bypass-123",
    email: "mock@student.com",
    full_name: "Bypass User",
    role: "student",
    account_status: "active",
    created_at: new Date().toISOString(),
    mfa_enabled: false,
    auth_provider: "local"
  };
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
    isAuthenticated: true, // BYPASS RBAC
    setAuth: (user, accessToken, refreshToken) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      const resolvedTenantId =
        (user as any)?.tenant_id ||
        user?.school_id ||
        (user as any)?.tenant_slug ||
        extractTenantIdFromJwt(accessToken);
      const enrichedUser = resolvedTenantId
        ? { ...user, tenant_id: resolvedTenantId, school_id: user?.school_id || resolvedTenantId }
        : user;
      localStorage.setItem('user', JSON.stringify(enrichedUser));
      if (resolvedTenantId) {
        localStorage.setItem('tenantId', resolvedTenantId);
        localStorage.setItem('x-tenant-id', resolvedTenantId);
      }
      set({ user: enrichedUser, accessToken, refreshToken, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('tenantId');
      localStorage.removeItem('x-tenant-id');
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
