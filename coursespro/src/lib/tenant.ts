export async function getTenant(tenantSlug: string) {
  const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
  
  try {
    const res = await fetch(`${USERS_API}/api/public/tenant/resolve?domain=${tenantSlug}`, {
      cache: 'no-store' // Cache for 15 seconds
    });
    console.log(`[getTenant] Fetching slug ${tenantSlug}. Status: ${res.status}`);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data.tenant;
  } catch (e: any) {
    console.log(`[getTenant] Exception caught:`, e.message);
    return null;
  }
}
