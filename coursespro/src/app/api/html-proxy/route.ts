import { NextResponse } from 'next/server';
import https from 'https';
import http from 'http';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing URL', { status: 400 });
  }

  const cleanUrl = url.trim();

  try {
    const html = await new Promise<string>((resolve, reject) => {
      const client = cleanUrl.startsWith('https:') ? https : http;
      const req = client.get(cleanUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }
      }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Handle one redirect manually if needed, or reject and handle upstream
          reject(new Error(`Upstream redirect not supported in fast proxy: ${res.statusCode}`));
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`Upstream error: ${res.statusCode}`));
          return;
        }

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(data);
        });
      });

      req.on('error', (err) => {
        reject(err);
      });
      
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
    
    let processedHtml = html;
    // Inject <base> tag to fix relative links just in case
    try {
      const baseUrl = new URL('.', cleanUrl).href;
      if (!processedHtml.includes('<base ') && processedHtml.includes('<head>')) {
        processedHtml = processedHtml.replace(/<head[^>]*>/i, `$&<base href="${baseUrl}">`);
      }
    } catch (e) {}

    const headers = new Headers();
    headers.set('Content-Type', 'text/html; charset=utf-8');
    headers.set('Access-Control-Allow-Origin', '*');

    return new NextResponse(processedHtml, { status: 200, headers });
  } catch (err: any) {
    console.error('HTML proxy error:', err);
    return new NextResponse(`Proxy error: ${err.message || err.toString()}`, { status: 500 });
  }
}
