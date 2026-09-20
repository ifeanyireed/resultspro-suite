import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Always use the Host header as the definitive source of truth for the domain.
  // req.nextUrl.hostname can sometimes default to 'localhost' if running behind certain local proxies or Docker networks.
  const hostHeader = req.headers.get('host') || '';
  const hostname = hostHeader.split(':')[0]; // Strip the port
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost';
  const isPlatform = hostname === platformDomain || hostname === `coursespro.${platformDomain}` || hostname === "resultspro-service-coursespro.onrender.com";

  // Extract the tenant slug from the hostname
  const tenantSlug = hostname.split('.')[0]; 
  
  // Prepare headers to pass down to Server Components
  const requestHeaders = new Headers(req.headers);
  if (!isPlatform) {
    requestHeaders.set('x-tenant-slug', tenantSlug);
  }

  // Skip api, next internal, and static files
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.includes('.')) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }
  
  // Skip admin and mentor route groups so they don't get rewritten into [tenant]
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/mentor')) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // If it's the main platform, we don't need to rewrite anything because 
  // Next.js automatically ignores route groups like (platform) in the URL path.
  if (isPlatform) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Otherwise, rewrite to the [tenant] folder
  if (url.pathname === '/') {
    return NextResponse.rewrite(new URL(`/${tenantSlug}`, req.url), { request: { headers: requestHeaders } });
  }
  
  return NextResponse.rewrite(new URL(`/${tenantSlug}${url.pathname}`, req.url), { request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
