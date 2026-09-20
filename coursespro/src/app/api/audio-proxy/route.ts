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

    const headers = new Headers(res.headers);
    headers.set('Content-Type', 'audio/mpeg');
    headers.delete('Content-Disposition');
    headers.set('Access-Control-Allow-Origin', '*');

    return new NextResponse(res.body, { status: 200, headers });
  } catch (err) {
    console.error('Audio proxy error:', err);
    return new NextResponse('Proxy error', { status: 500 });
  }
}
