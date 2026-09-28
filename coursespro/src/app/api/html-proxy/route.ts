import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing URL', { status: 400 });
  }

  try {
    const cleanUrl = url.trim();
    const res = await fetch(cleanUrl, { 
      redirect: 'follow', 
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });
    if (!res.ok) {
      return new NextResponse('Upstream error', { status: res.status });
    }

    let html = await res.text();
    
    // Inject <base> tag to fix relative links just in case
    try {
      const baseUrl = new URL('.', url).href;
      if (!html.includes('<base ') && html.includes('<head>')) {
        html = html.replace(/<head[^>]*>/i, `$&<base href="${baseUrl}">`);
      }
    } catch (e) {}

    const headers = new Headers();
    headers.set('Content-Type', 'text/html; charset=utf-8');
    headers.set('Access-Control-Allow-Origin', '*');

    return new NextResponse(html, { status: 200, headers });
  } catch (err: any) {
    console.error('HTML proxy error:', err);
    return new NextResponse(`Proxy error: ${err.message || err.toString()}`, { status: 500 });
  }
}
