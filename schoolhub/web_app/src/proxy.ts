import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  const hostname = req.headers.get('host') || '';
  
  // Redirect bare localhost to the default tenant subdomain based on session cookies
  if (hostname === 'localhost:3000' || hostname === '127.0.0.1:3000') {
    // Read the slug from the user's session cookie
    const slugCookie = req.cookies.get('schoolhub_slug');
    
    // Allow access to login page without a session
    if (url.pathname === '/login' || url.pathname.startsWith('/auth')) {
      return NextResponse.next();
    }

    if (slugCookie && slugCookie.value) {
      url.hostname = `${slugCookie.value}.localhost`;
      return NextResponse.redirect(url);
    } else {
      // If no session exists on the root domain, force them to login
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Exclude root domain
  const isRoot = hostname === 'resultspro.ng' || hostname === 'www.resultspro.ng';
  
  if (!isRoot) {
    // Determine the tenant slug
    let slug = hostname.replace('.resultspro.ng', '');
    
    // If it's local (e.g. reedbreed.localhost:3000), extract the slug
    if (hostname.includes('.localhost')) {
      slug = hostname.split('.localhost')[0];
    }
    
    // Pass tenant information as headers for downstream API usage
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-tenant-slug', slug);
    
    // Return Next response with custom headers without breaking Next.js routing
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
