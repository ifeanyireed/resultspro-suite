import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional, required if project belongs to a team

    if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
      console.warn("Vercel token or project ID is missing. Domain will only be saved in the database, but not added to Vercel.");
      return NextResponse.json({ success: true, message: 'Skipped Vercel registration (no token)' });
    }

    let url = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`;
    if (VERCEL_TEAM_ID) {
        url += `?teamId=${VERCEL_TEAM_ID}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Failed to add domain to Vercel' }, { status: response.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
