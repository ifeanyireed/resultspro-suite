async function run() {
  const tenantSlug = "skill-up-academy";
  const domain = `${tenantSlug}.resultspro.ng`;
  console.log(`Fetching ${domain}...`);
  const res = await fetch(`https://resultspro-service-users.onrender.com/api/public/tenant/resolve?domain=${domain}`);
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Data:", data);
}
run();
