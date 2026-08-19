'use client';

import React, { createContext, useContext } from 'react';

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  default_subdomain: string;
  custom_domain: string;
  tenant_code: string;
  short_name: string;
  logo_url: string;
  logo_emoji: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  enabled_modules: string; // JSON array of module names
};

type TenantContextType = {
  tenant: Tenant | null;
  hasModule: (moduleName: string) => boolean;
};

const TenantContext = createContext<TenantContextType>({ 
  tenant: null, 
  hasModule: () => false 
});

export const TenantProvider = ({ 
  children, 
  tenant 
}: { 
  children: React.ReactNode; 
  tenant: Tenant | null; 
}) => {
  
  const hasModule = (moduleName: string) => {
    if (!tenant || !tenant.enabled_modules) return false;
    try {
      const modules: string[] = JSON.parse(tenant.enabled_modules);
      return modules.includes(moduleName);
    } catch (e) {
      return false;
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, hasModule }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
