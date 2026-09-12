import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  // Extract hostname safely from NextUrl, which handles proxies and strips port automatically
  const hostname = url.hostname || '';

  // Define the root platform domains (we check domain without port)
  const isPlatform = hostname === 'coursespro.resultspro.ng' || 
                     hostname === 'localhost' || 
                     hostname === 'coursespro.localhost';

  // Skip api, next internal, and static files
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.includes('.')) {
    return NextResponse.next();
  }

  // If it's the main platform, rewrite to the (platform) folder
  if (isPlatform) {
    let res: NextResponse;
    if (url.pathname === '/') {
      res = NextResponse.rewrite(new URL(`/(platform)`, req.url));
    } else {
      res = NextResponse.rewrite(new URL(`/(platform)${url.pathname}`, req.url));
    }
    res.headers.set('x-debug-hostname', hostname);
    res.headers.set('x-debug-is-platform', String(isPlatform));
    return res;
  }

  // Otherwise, extract the tenant slug and rewrite to the [tenant] folder
  const tenantSlug = hostname.split('.')[0]; 
  
  let res: NextResponse;
  if (url.pathname === '/') {
    res = NextResponse.rewrite(new URL(`/${tenantSlug}`, req.url));
  } else {
    res = NextResponse.rewrite(new URL(`/${tenantSlug}${url.pathname}`, req.url));
  }

  res.headers.set('x-debug-hostname', hostname);
  res.headers.set('x-debug-is-platform', String(isPlatform));
  res.headers.set('x-debug-tenant-slug', tenantSlug);
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
