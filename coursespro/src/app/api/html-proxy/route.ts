import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing URL', { status: 400 });
  }

  try {
    const res = await fetch(url, { redirect: 'follow' });
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
  } catch (err) {
    console.error('HTML proxy error:', err);
    return new NextResponse('Proxy error', { status: 500 });
  }
}
