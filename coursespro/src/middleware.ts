import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Always use the Host header as the definitive source of truth for the domain.
  // req.nextUrl.hostname can sometimes default to 'localhost' if running behind certain local proxies or Docker networks.
  const hostHeader = req.headers.get('host') || '';
  const hostname = hostHeader.split(':')[0]; // Strip the port
  
  // Determine if this is the main platform domain
  const isPlatform = 
    hostname === 'resultspro.ng' ||
    hostname === 'coursespro.resultspro.ng' ||
    (hostname.endsWith('.onrender.com') && hostname.split('.').length === 3) ||
    (hostname.endsWith('.vercel.app') && hostname.split('.').length === 3);

  // Skip api, next internal, and static files
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Skip admin and mentor route groups so they don't get rewritten into [tenant]
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/mentor')) {
    return NextResponse.next();
  }

  // If it's the main platform, we don't need to rewrite anything because 
  // Next.js automatically ignores route groups like (platform) in the URL path.
  if (isPlatform) {
    return NextResponse.next();
  }

  // Otherwise, extract the tenant slug and rewrite to the [tenant] folder
  const tenantSlug = hostname.split('.')[0]; 
  
  if (url.pathname === '/') {
    return NextResponse.rewrite(new URL(`/${tenantSlug}`, req.url));
  }
  
  return NextResponse.rewrite(new URL(`/${tenantSlug}${url.pathname}`, req.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
