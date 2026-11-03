'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { Tenant } from './TenantProvider';

export interface AppHostUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'parent' | 'student' | string;
  class_id?: string;
  school_id?: string;
  avatar_url?: string;
}

export interface AppHostContextType {
  tenant: Tenant | null;
  user: AppHostUser | null;
  token: string | null;
  standalone: boolean;
  hasModule: (moduleName: string) => boolean;
}

const AppHostContext = createContext<AppHostContextType>({
  tenant: null,
  user: null,
  token: null,
  standalone: false,
  hasModule: () => false,
});

export const AppHostProvider: React.FC<{
  children: React.ReactNode;
  tenant: Tenant | null;
  user: AppHostUser | null;
  token: string | null;
  standalone?: boolean;
}> = ({ children, tenant, user, token, standalone = false }) => {
  // Sync token to local storage keys across all microservice standards for backwards compatibility
  useEffect(() => {
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('authToken', token);
      localStorage.setItem('token', token);
      localStorage.setItem('scholars_ng_token', token);
    }
    if (user && typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('user_role', user.role);
    }
    if (tenant && typeof window !== 'undefined') {
      localStorage.setItem('tenant_id', tenant.id);
      localStorage.setItem('tenant_slug', tenant.slug);
    }
  }, [token, user, tenant]);

  const hasModule = (moduleName: string) => {
    if (!tenant || !tenant.enabled_modules) return false;
    try {
      const modules: string[] = JSON.parse(tenant.enabled_modules);
      return modules.includes(moduleName);
    } catch {
      return false;
    }
  };

  return (
    <AppHostContext.Provider
      value={{
        tenant,
        user,
        token,
        standalone,
        hasModule,
      }}
    >
      {children}
    </AppHostContext.Provider>
  );
};

export const useAppHost = () => useContext(AppHostContext);
