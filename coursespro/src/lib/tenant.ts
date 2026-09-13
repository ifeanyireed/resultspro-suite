export async function getTenant(tenantSlug: string) {
  const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
  // Check both default_subdomain and custom_domain
  const domain = `${tenantSlug}.resultspro.ng`; // Default subdomain
  
  try {
    const res = await fetch(`${USERS_API}/api/public/tenant/resolve?domain=${domain}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    console.log(`[getTenant] Fetching domain ${domain}. Status: ${res.status}`);
    if (!res.ok) {
      // If it fails, we can optionally try the raw slug as the custom domain
      const customRes = await fetch(`${USERS_API}/api/public/tenant/resolve?domain=${tenantSlug}`, {
        next: { revalidate: 3600 }
      });
      console.log(`[getTenant] Fetching slug ${tenantSlug}. Status: ${customRes.status}`);
      if (!customRes.ok) return null;
      const data = await customRes.json();
      return data.tenant;
    }
    const data = await res.json();
    return data.tenant;
  } catch (e: any) {
    console.log(`[getTenant] Exception caught:`, e.message);
    return null;
  }
}
