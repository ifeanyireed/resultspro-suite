import { NextResponse } from 'next/server';
import { Resolver } from 'dns/promises';

function cleanDomainInput(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '');
}

export async function POST(req: Request) {
  try {
    const { domain: rawDomain, projectId } = await req.json();

    if (!rawDomain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const domain = cleanDomainInput(rawDomain);

    const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
    const targetProjectId = projectId || process.env.VERCEL_COURSESPRO_PROJECT_ID || process.env.VERCEL_PROJECT_ID;
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

    if (!VERCEL_TOKEN || !targetProjectId) {
      console.warn('Vercel token or project ID is missing in admin. Domain will only be saved in the database, but not added to Vercel.');
      return NextResponse.json({ success: true, message: 'Skipped Vercel registration (no token or project ID configured)' });
    }

    let url = `https://api.vercel.com/v10/projects/${targetProjectId}/domains`;
    if (VERCEL_TEAM_ID) {
      url += `?teamId=${VERCEL_TEAM_ID}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409 || data.error?.code === 'domain_already_in_use') {
        return NextResponse.json({ success: true, message: 'Domain already registered on Vercel', data });
      }
      return NextResponse.json({ error: data.error?.message || 'Failed to add domain to Vercel' }, { status: response.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawDomain = searchParams.get('domain');
    const projectId = searchParams.get('projectId') || process.env.VERCEL_COURSESPRO_PROJECT_ID || process.env.VERCEL_PROJECT_ID;

    if (!rawDomain) {
      return NextResponse.json({ error: 'Domain query parameter is required' }, { status: 400 });
    }

    const domain = cleanDomainInput(rawDomain);

    if (domain.includes('@')) {
      const suggested = domain.replace(/@/g, '.');
      return NextResponse.json({
        success: false,
        domain,
        suggestedDomain: suggested,
        propagated: false,
        vercelVerified: false,
        status: 'INVALID_DOMAIN',
        message: `Invalid domain format ("@" found). Did you mean "${suggested}"?`,
        detected: { cname: [], a: [] },
      });
    }

    const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;
    if (!domainRegex.test(domain)) {
      return NextResponse.json({
        success: false,
        domain,
        propagated: false,
        vercelVerified: false,
        status: 'INVALID_DOMAIN',
        message: 'Invalid hostname format. Enter a valid domain such as academy.client.com or client.com.',
        detected: { cname: [], a: [] },
      });
    }

    const parts = domain.split('.');
    const isSubdomain = parts.length > 2;
    const expected = {
      type: isSubdomain ? 'CNAME' : 'A',
      host: isSubdomain ? parts.slice(0, -2).join('.') : '@',
      value: isSubdomain ? 'cname.vercel-dns.com' : '76.76.21.21',
    };

    const resolver = new Resolver();
    try {
      resolver.setServers(['8.8.8.8', '1.1.1.1']);
    } catch {
      // Fallback to default system resolver if setting public servers fails
    }

    const [cnameResult, aResult] = await Promise.allSettled([
      resolver.resolveCname(domain),
      resolver.resolve4(domain),
    ]);

    const cnameRecords = cnameResult.status === 'fulfilled' ? cnameResult.value.map((r) => r.toLowerCase().replace(/\.$/, '')) : [];
    const aRecords = aResult.status === 'fulfilled' ? aResult.value : [];

    const cnameMatched = cnameRecords.some((r) => r === 'cname.vercel-dns.com' || r.endsWith('.vercel-dns.com'));
    const aMatched = aRecords.some((ip) => ip === '76.76.21.21' || ip === '76.223.126.88');

    const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

    let vercelVerified = false;
    let vercelMisconfigured: boolean | null = null;
    let vercelData: any = null;

    if (VERCEL_TOKEN && projectId) {
      try {
        let domainUrl = `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}`;
        let configUrl = `https://api.vercel.com/v6/domains/${domain}/config`;
        if (VERCEL_TEAM_ID) {
          domainUrl += `?teamId=${VERCEL_TEAM_ID}`;
          configUrl += `?teamId=${VERCEL_TEAM_ID}`;
        }

        const [domRes, cfgRes] = await Promise.allSettled([
          fetch(domainUrl, { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }, cache: 'no-store' }),
          fetch(configUrl, { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }, cache: 'no-store' }),
        ]);

        if (domRes.status === 'fulfilled' && domRes.value.ok) {
          vercelData = await domRes.value.json();
          if (vercelData?.verified) {
            vercelVerified = true;
          }
        }
        if (cfgRes.status === 'fulfilled' && cfgRes.value.ok) {
          const cfgData = await cfgRes.value.json();
          if (typeof cfgData?.misconfigured === 'boolean') {
            vercelMisconfigured = cfgData.misconfigured;
          }
        }
      } catch {
        // Ignore Vercel API lookup failure and rely on DNS records
      }
    }

    const propagated = cnameMatched || aMatched || (vercelVerified && vercelMisconfigured === false);
    const hasAnyRecords = cnameRecords.length > 0 || aRecords.length > 0;

    let status: 'PROPAGATED' | 'MISCONFIGURED' | 'PENDING' = 'PENDING';
    let message = '';

    if (propagated) {
      status = 'PROPAGATED';
      message = cnameMatched
        ? `DNS propagated! CNAME points to ${cnameRecords.join(', ')}.`
        : aMatched
        ? `DNS propagated! A record points to ${aRecords.join(', ')}.`
        : 'Domain is verified and active on Vercel.';
    } else if (hasAnyRecords) {
      status = 'MISCONFIGURED';
      const found = [
        cnameRecords.length ? `CNAME: ${cnameRecords.join(', ')}` : '',
        aRecords.length ? `A: ${aRecords.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join(' | ');
      message = `DNS resolves (${found}), but does not point to ${expected.value} yet. Note: If using Cloudflare proxy (orange cloud), switch to DNS-only or verify SSL on Vercel.`;
    } else {
      status = 'PENDING';
      message = `No ${expected.type} record detected yet for ${domain}. Add ${expected.type} (${expected.host} → ${expected.value}) at your DNS provider.`;
    }

    return NextResponse.json({
      success: true,
      domain,
      status,
      propagated,
      vercelVerified,
      vercelMisconfigured,
      expected,
      detected: {
        cname: cnameRecords,
        a: aRecords,
      },
      message,
      data: vercelData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let domain = searchParams.get('domain');
    let projectId = searchParams.get('projectId');

    if (!domain) {
      const body = await req.json().catch(() => ({}));
      domain = body.domain;
      projectId = projectId || body.projectId;
    }

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const cleanDomain = cleanDomainInput(domain);
    const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
    const targetProjectId = projectId || process.env.VERCEL_COURSESPRO_PROJECT_ID || process.env.VERCEL_PROJECT_ID;
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

    if (!VERCEL_TOKEN || !targetProjectId) {
      return NextResponse.json({ success: true, message: 'Skipped Vercel deletion (no token/project ID)' });
    }

    let url = `https://api.vercel.com/v9/projects/${targetProjectId}/domains/${cleanDomain}`;
    if (VERCEL_TEAM_ID) {
      url += `?teamId=${VERCEL_TEAM_ID}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });

    const data = await response.json();
    return NextResponse.json({ success: response.ok, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
