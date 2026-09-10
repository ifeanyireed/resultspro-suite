import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetPath = formData.get('target_path') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Forward to CDN
    const cdnUrl = process.env.CDN_URL || 'https://cdn.resultspro.ng';
    const cdnSecret = process.env.CDN_SECRET || 'cdn_sec_resultspro_9921_xya'; // fallback for local dev if missing

    const cdnFormData = new FormData();
    cdnFormData.append('file', file);
    if (targetPath) {
      cdnFormData.append('target_path', targetPath);
    }

    const cdnResponse = await fetch(`${cdnUrl}/upload.php`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cdnSecret}`,
      },
      body: cdnFormData as any, // FormData from next/server works perfectly here
    });

    if (!cdnResponse.ok) {
      const errorText = await cdnResponse.text();
      console.error('CDN Error:', errorText);
      return NextResponse.json({ error: 'CDN Upload failed' }, { status: 500 });
    }

    const data = await cdnResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
