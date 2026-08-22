import { create } from 'zustand';
export const useAuthStore = create(() => ({
  user: { full_name: "Admin User", role: "superadmin" },
  isAuthenticated: true,
  logout: () => {}
}));
