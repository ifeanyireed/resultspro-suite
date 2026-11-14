'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../lib/api';

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  default_subdomain: string;
  custom_domain: string;
  tenant_code: string;
  short_name: string;
  motto?: string;
  contact_email?: string;
  contact_phone?: string;
  full_address?: string;
  state?: string;
  lga?: string;
  logo_url: string;
  logo_emoji: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  enabled_modules: string; // JSON array of module names
  settings?: string; // JSON CMS / landing configuration
};

type TenantContextType = {
  tenant: Tenant | null;
  tenantId: string;
  tenantSlug: string;
  hasModule: (moduleName: string) => boolean;
  refreshTenant: () => Promise<Tenant | null>;
};

const TenantContext = createContext<TenantContextType>({ 
  tenant: null,
  tenantId: '',
  tenantSlug: '',
  hasModule: () => false,
  refreshTenant: async () => null,
});

export const TenantProvider = ({ 
  children, 
  tenant: initialTenant 
}: { 
  children: React.ReactNode; 
  tenant: Tenant | null; 
}) => {
  const [tenant, setTenant] = useState<Tenant | null>(initialTenant);

  const syncTenantStorage = useCallback((t: Tenant | null) => {
    if (typeof window === 'undefined' || !t) return;
    if (t.id) {
      localStorage.setItem('active_tenant_id', t.id);
      localStorage.setItem('tenant_id', t.id);
      document.cookie = `tenant_id=${encodeURIComponent(t.id)}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `active_tenant_id=${encodeURIComponent(t.id)}; path=/; max-age=604800; SameSite=Lax`;
    }
    if (t.slug) {
      localStorage.setItem('active_tenant_slug', t.slug);
      localStorage.setItem('tenant_slug', t.slug);
      document.cookie = `tenant_slug=${encodeURIComponent(t.slug)}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `active_tenant_slug=${encodeURIComponent(t.slug)}; path=/; max-age=604800; SameSite=Lax`;
    }
    if (t.custom_domain) {
      localStorage.setItem('tenant_custom_domain', t.custom_domain);
    }
  }, []);

  const refreshTenant = useCallback(async (): Promise<Tenant | null> => {
    if (typeof window === 'undefined') return tenant;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const queryTenant = searchParams.get('tenant');
      const hostname = window.location.hostname.toLowerCase();
      const platformDomain = (process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'scholars.ng').toLowerCase();

      let domainOrSlug =
        queryTenant ||
        tenant?.slug ||
        localStorage.getItem('active_tenant_slug') ||
        localStorage.getItem('tenant_slug') ||
        '';

      if (!domainOrSlug) {
        if (hostname.endsWith('.localhost')) {
          domainOrSlug = hostname.replace(/\.localhost$/, '');
        } else if (hostname.endsWith(`.${platformDomain}`)) {
          domainOrSlug = hostname.replace(new RegExp(`\\.${platformDomain.replace('.', '\\.')}$`), '');
        } else if (hostname.endsWith('.scholars.ng')) {
          domainOrSlug = hostname.replace(/\.scholars\.ng$/, '');
        } else if (hostname.endsWith('.resultspro.ng')) {
          domainOrSlug = hostname.replace(/\.resultspro\.ng$/, '');
        } else if (
          hostname !== 'localhost' &&
          hostname !== '127.0.0.1' &&
          hostname !== platformDomain &&
          hostname !== `www.${platformDomain}` &&
          !hostname.endsWith('.vercel.app')
        ) {
          domainOrSlug = hostname;
        }
      }

      if (!domainOrSlug) return null;

      const res = await api.get(`/public/tenant/resolve?domain=${encodeURIComponent(domainOrSlug)}`);
      const resolved: Tenant | null = res.data?.tenant || null;
      if (resolved) {
        setTenant(resolved);
        syncTenantStorage(resolved);
      }
      return resolved;
    } catch {
      return tenant;
    }
  }, [tenant, syncTenantStorage]);

  useEffect(() => {
    if (initialTenant) {
      setTenant(initialTenant);
      syncTenantStorage(initialTenant);
    } else {
      refreshTenant();
    }
  }, [initialTenant, syncTenantStorage, refreshTenant]);

  const hasModule = (moduleName: string) => {
    if (!tenant || !tenant.enabled_modules) return true;
    try {
      const modules: string[] = JSON.parse(tenant.enabled_modules);
      return Array.isArray(modules) ? modules.includes(moduleName) : true;
    } catch {
      return true;
    }
  };

  const tenantId =
    tenant?.id ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('active_tenant_id') || localStorage.getItem('tenant_id') || ''
      : '');

  const tenantSlug =
    tenant?.slug ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('active_tenant_slug') || localStorage.getItem('tenant_slug') || ''
      : '');

  return (
    <TenantContext.Provider value={{ tenant, tenantId, tenantSlug, hasModule, refreshTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
