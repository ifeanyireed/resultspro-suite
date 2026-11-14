import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { redisGet, redisSet, buildRedisKey } from './lib/redis';

type ResolvedTenantEdge = {
  id: string;
  slug: string;
  name: string;
  default_subdomain?: string;
  custom_domain?: string;
  status?: string;
};

// Lightweight in-memory edge cache (60s TTL) to avoid round-trips on every static/navigation request
const tenantEdgeCache = new Map<string, { tenant: ResolvedTenantEdge | null; expiresAt: number }>();

async function resolveTenantAtEdge(identifier: string): Promise<ResolvedTenantEdge | null> {
  if (!identifier) return null;
  const key = identifier.toLowerCase().trim();
  const now = Date.now();

  // 1. Fast in-memory check (L1 Cache)
  const cached = tenantEdgeCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.tenant;
  }

  // 2. Upstash Redis check (L2 Distributed Shared Cache)
  const redisCacheKey = buildRedisKey('users', 'global', 'domain', key);
  try {
    const redisTenant = await redisGet<ResolvedTenantEdge>(redisCacheKey);
    if (redisTenant) {
      tenantEdgeCache.set(key, { tenant: redisTenant, expiresAt: now + 60_000 });
      return redisTenant;
    }
  } catch {
    // Graceful fallback to backend API
  }

  // 3. Fallback to service_users Authoritative API
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NEXT_PUBLIC_USERS_API ? `${process.env.NEXT_PUBLIC_USERS_API}/api` : '');
    if (!apiUrl) return null;
    const res = await fetch(
      `${apiUrl}/public/tenant/resolve?domain=${encodeURIComponent(key)}`,
      {
        headers: { Accept: 'application/json' },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) {
      tenantEdgeCache.set(key, { tenant: null, expiresAt: now + 15_000 });
      return null;
    }
    const data = await res.json();
    const tenant: ResolvedTenantEdge | null = data?.tenant || null;
    tenantEdgeCache.set(key, { tenant, expiresAt: now + 60_000 });

    // Cache in Upstash Redis for 24 hours (86,400s) across all edge nodes
    if (tenant) {
      redisSet(redisCacheKey, tenant, 86400).catch(() => {});
    }

    return tenant;
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  const rawHostname = host.split(':')[0].toLowerCase().trim();
  const hostname = rawHostname.startsWith('www.') ? rawHostname.slice(4) : rawHostname;

  const platformDomain = (process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'scholars.ng').toLowerCase();
  const requestHeaders = new Headers(req.headers);

  // 1. Extract tenant slug or custom domain for the workspace
  let tenantIdentifier = '';
  let isCustomDomain = false;

  const queryTenant = url.searchParams.get('tenant')?.toLowerCase().trim();
  if (queryTenant) {
    tenantIdentifier = queryTenant;
  } else if (hostname.endsWith('.localhost')) {
    tenantIdentifier = hostname.replace(/\.localhost$/, '');
  } else if (hostname.endsWith('.scholars.local')) {
    tenantIdentifier = hostname.replace(/\.scholars\.local$/, '');
  } else if (hostname.endsWith(`.${platformDomain}`)) {
    tenantIdentifier = hostname.replace(new RegExp(`\\.${platformDomain.replace('.', '\\.')}$`), '');
  } else if (hostname.endsWith('.scholars.ng')) {
    tenantIdentifier = hostname.replace(/\.scholars\.ng$/, '');
  } else if (hostname.endsWith('.resultspro.ng')) {
    tenantIdentifier = hostname.replace(/\.resultspro\.ng$/, '');
  } else if (
    hostname &&
    hostname !== 'localhost' &&
    hostname !== '127.0.0.1' &&
    hostname !== 'scholars.local' &&
    hostname !== platformDomain &&
    hostname !== 'scholars.ng' &&
    hostname !== 'resultspro.ng' &&
    !hostname.endsWith('.vercel.app') &&
    !hostname.endsWith('.onrender.com')
  ) {
    // Custom institutional domain (e.g. portal.greenwoodhigh.edu.ng or greenwoodhigh.edu.ng)
    tenantIdentifier = rawHostname;
    isCustomDomain = true;
  } else if (url.pathname !== '/') {
    // Only fallback to cookie on inner portal routes (/admin, /student, etc.) when on bare localhost
    const cookieSlug = req.cookies.get('tenant_slug')?.value;
    if (cookieSlug) {
      tenantIdentifier = cookieSlug;
    }
  }

  // 2. Resolve canonical tenant record (id, slug, custom_domain)
  const resolvedTenant = tenantIdentifier ? await resolveTenantAtEdge(tenantIdentifier) : null;
  const resolvedTenantId =
    resolvedTenant?.id ||
    (tenantIdentifier ? `tenant-${tenantIdentifier}` : '');
  const resolvedTenantSlug = resolvedTenant?.slug || tenantIdentifier;

  requestHeaders.set('x-is-tenant', tenantIdentifier ? 'true' : 'false');
  requestHeaders.set('x-tenant-domain', rawHostname);
  requestHeaders.set('x-is-custom-domain', isCustomDomain ? 'true' : 'false');

  if (resolvedTenantSlug) {
    requestHeaders.set('x-tenant-slug', resolvedTenantSlug);
  }
  if (resolvedTenantId) {
    requestHeaders.set('x-tenant-id', resolvedTenantId);
  }
  if (resolvedTenant?.custom_domain) {
    requestHeaders.set('x-tenant-custom-domain', resolvedTenant.custom_domain);
  }

  // 3. Strict Cross-Tenant Session Boundary Enforcement on Protected Portal Routes
  const isProtectedPortalRoute =
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/teacher') ||
    url.pathname.startsWith('/student') ||
    url.pathname.startsWith('/parent');

  if (isProtectedPortalRoute && resolvedTenantId) {
    const sessionTenantId = req.cookies.get('active_tenant_id')?.value;
    const sessionTenantSlug = req.cookies.get('active_tenant_slug')?.value;

    const tenantIdMismatch =
      Boolean(sessionTenantId) && sessionTenantId !== resolvedTenantId;
    const tenantSlugMismatch =
      Boolean(sessionTenantSlug) &&
      Boolean(resolvedTenant?.slug) &&
      sessionTenantSlug!.toLowerCase() !== resolvedTenant!.slug.toLowerCase();

    if (tenantIdMismatch || tenantSlugMismatch) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('reason', 'tenant_boundary');
      loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
      const redirectRes = NextResponse.redirect(loginUrl);
      redirectRes.cookies.delete('token');
      redirectRes.cookies.delete('accessToken');
      redirectRes.cookies.delete('active_tenant_id');
      redirectRes.cookies.delete('active_tenant_slug');
      return redirectRes;
    }
  }

  // 4. Redirect legacy /admin/admissions* routes directly to CampusOS Admission route
  if (url.pathname.startsWith('/admin/admissions')) {
    const sub = url.pathname.replace('/admin/admissions', '').replace(/^\//, '');
    const validSub = ['inquiries', 'applications', 'pipeline'].includes(sub) ? sub : 'overview';
    url.pathname = '/admin/campus-os/admission';
    url.searchParams.set('subtab', validSub);
    return NextResponse.redirect(url);
  }

  // 5. Smart Redirector for Specialist Applications
  const specialistApps = [
    '/classroompro',
    '/resultspro',
    '/tutorspro',
    '/puzzlepro',
    '/examspro',
    '/coursespro',
    '/campuspro',
  ];
  if (specialistApps.includes(url.pathname)) {
    const userRoleCookie = req.cookies.get('user_role')?.value || req.cookies.get('role')?.value;
    const token = req.cookies.get('token')?.value || req.cookies.get('accessToken')?.value;

    if (token && userRoleCookie) {
      const role = userRoleCookie.toLowerCase();
      url.pathname = `/${role}${url.pathname === '/campuspro' ? '/campus-os' : url.pathname}`;
      return NextResponse.redirect(url);
    } else {
      url.pathname = '/login';
      url.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // 5. Forward enriched tenant headers & persist resolved tenant cookies
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (resolvedTenantSlug) {
    response.cookies.set('tenant_slug', resolvedTenantSlug, { path: '/', sameSite: 'lax' });
  }
  if (resolvedTenantId) {
    response.cookies.set('tenant_id', resolvedTenantId, { path: '/', sameSite: 'lax' });
  }
  if (rawHostname) {
    response.cookies.set('tenant_domain', rawHostname, { path: '/', sameSite: 'lax' });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|images|fonts|.*\\..*).*)',
  ],
};
