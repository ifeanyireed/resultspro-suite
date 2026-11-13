import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();
  
  const platformDomain = (process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'scholars.ng').toLowerCase();
  const requestHeaders = new Headers(req.headers);

  // Extract tenant slug or custom domain for the workspace
  let tenantSlug = '';
  if (hostname.endsWith('.localhost')) {
    tenantSlug = hostname.replace('.localhost', '');
  } else if (hostname.endsWith(`.${platformDomain}`)) {
    tenantSlug = hostname.replace(`.${platformDomain}`, '');
  } else if (hostname.endsWith('.resultspro.ng')) {
    tenantSlug = hostname.replace('.resultspro.ng', '');
  } else if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== platformDomain && hostname !== `www.${platformDomain}`) {
    // Custom domain (e.g. portal.greenwoodhigh.edu.ng)
    tenantSlug = hostname;
  }

  requestHeaders.set('x-is-tenant', 'true');
  if (tenantSlug) {
    requestHeaders.set('x-tenant-slug', tenantSlug);
  }
  requestHeaders.set('x-tenant-domain', hostname);

  // Smart Redirector for Specialist Applications
  const specialistApps = ['/classroompro', '/resultspro', '/tutorspro', '/puzzlepro', '/examspro', '/coursespro'];
  if (specialistApps.includes(url.pathname)) {
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

  // Root '/' directly serves the tenant institution's landing page (src/app/page.tsx)
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|images|fonts|.*\\..*).*)',
  ],
};
