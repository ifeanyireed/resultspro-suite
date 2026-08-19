import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { TenantProvider } from "../components/TenantProvider";

async function getTenant(host: string) {
  // If it's localhost without a tenant subdomain, use a default for testing
  const searchDomain = host.includes('localhost') ? 'loral.resultspro.ng' : host;
  try {
    // Calling the internal identity service directly
    const res = await fetch(`http://localhost:7000/api/public/tenant/resolve?domain=${searchDomain}`, { 
      next: { revalidate: 60 } // cache for 1 minute
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.tenant;
  } catch (err) {
    console.error("Failed to resolve tenant:", err);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host') || '';
  const tenant = await getTenant(host);

  if (!tenant) {
    return {
      title: "School Portal | Powered by ResultsPro",
      description: "A comprehensive modular school management portal.",
    };
  }

  return {
    title: `${tenant.name} | Portal`,
    description: `Official portal for ${tenant.name}.`,
    icons: {
      icon: tenant.logo_url || '/logo.png',
      apple: tenant.logo_url || '/logo.png',
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const host = headersList.get('host') || '';
  const tenant = await getTenant(host);

  const themeVars = tenant ? {
    '--primary': tenant.primary_color || '#2563eb',
    '--secondary': tenant.secondary_color || '#1e40af',
    '--accent': tenant.accent_color || '#3b82f6',
  } as React.CSSProperties : {};

  return (
    <html lang="en" style={themeVars}>
      <body>
        <TenantProvider tenant={tenant}>
          {children}
        </TenantProvider>
      </body>
    </html>
  );
}
