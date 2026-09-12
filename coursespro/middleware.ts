import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Define the root platform domains (including localhost for dev)
  const isPlatform = hostname === 'coursespro.resultspro.ng' || hostname.includes('localhost:3006');

  // Skip api, next internal, and static files
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.includes('.')) {
    return NextResponse.next();
  }

  // If it's the main platform, rewrite to the (platform) folder
  if (isPlatform) {
    if (url.pathname === '/') {
      return NextResponse.rewrite(new URL(`/(platform)`, req.url));
    }
    return NextResponse.rewrite(new URL(`/(platform)${url.pathname}`, req.url));
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
