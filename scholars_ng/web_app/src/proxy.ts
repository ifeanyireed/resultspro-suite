import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();
  
  const platformDomain = (process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'scholars.ng').toLowerCase();
  
  // 1. Detect if this is an apex platform domain
  const isApex = 
    hostname === platformDomain ||
    hostname === `www.${platformDomain}` ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === 'scholars.local';

  const requestHeaders = new Headers(req.headers);

  // 2. Handle Apex Platform (ScholarsNG Commercial Product Landing Page)
  if (isApex) {
    requestHeaders.set('x-is-apex', 'true');
    requestHeaders.set('x-platform-domain', platformDomain);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 3. Handle Tenant Workspaces (*_scholars_workspace)
  // Extract tenant slug or custom domain
  let tenantSlug = '';
  if (hostname.endsWith('.localhost')) {
    tenantSlug = hostname.replace('.localhost', '');
  } else if (hostname.endsWith(`.${platformDomain}`)) {
    tenantSlug = hostname.replace(`.${platformDomain}`, '');
  } else if (hostname.endsWith('.resultspro.ng')) {
    tenantSlug = hostname.replace('.resultspro.ng', '');
  } else {
    // Custom domain (e.g. portal.greenwoodhigh.edu.ng)
    tenantSlug = hostname;
  }

  // Inject tenant identification headers
  requestHeaders.set('x-is-apex', 'false');
  requestHeaders.set('x-is-tenant', 'true');
  requestHeaders.set('x-tenant-slug', tenantSlug);
  requestHeaders.set('x-tenant-domain', hostname);

  // 4. Smart Redirector for Specialist Applications
  // When an authenticated user accesses /classroompro, /resultspro, /tutorspro, /puzzlepro
  const specialistApps = ['/classroompro', '/resultspro', '/tutorspro', '/puzzlepro', '/examspro', '/coursespro'];
  if (specialistApps.includes(url.pathname)) {
    // Check if user session cookie exists
    const userRoleCookie = req.cookies.get('user_role')?.value || req.cookies.get('role')?.value;
    const token = req.cookies.get('token')?.value || req.cookies.get('accessToken')?.value;
    
    if (token && userRoleCookie) {
      const role = userRoleCookie.toLowerCase();
      url.pathname = `/${role}${url.pathname}`;
      return NextResponse.redirect(url);
    } else {
      url.pathname = '/login';
      url.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // 5. Route Rewriting for School Public Front Door
  // If the path is root '/', rewrite to '/[tenant]' (school marketing & admissions page)
  if (url.pathname === '/') {
    url.pathname = `/${tenantSlug}`;
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png, etc.
     * - images, public files with extensions (.svg, .png, .jpg, .jpeg, .webp, .css, .js)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|images|.*\\..*).*)',
  ],
};
