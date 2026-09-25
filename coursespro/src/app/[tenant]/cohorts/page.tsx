import { notFound } from 'next/navigation';
import { getTenant } from '@/lib/tenant';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { IconClock, IconTrendingUp } from '@tabler/icons-react';
import { serverFetch } from '@/lib/server-api';
import { COURSES_API } from '@/lib/api';
import CohortCard from '@/components/CohortCard';
import CohortSlideshow from '@/components/CohortSlideshow';

export const dynamic = 'force-dynamic';

export default async function CohortsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.tenant);

  if (!tenant) {
    notFound();
  }
  let cohorts = [];
  try {
    const res = await serverFetch(`${COURSES_API}/api/public/cohorts?tenant_id=${tenant.id}`, {
      headers: { 'X-Tenant-Domain': tenant.slug },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      cohorts = data.cohorts || [];
    }
  } catch (err) {
    console.error("Failed to fetch cohorts", err);
  }

  return (
    <main>
      <Navbar tenantName={tenant.name} tenantLogo={tenant.logo_url} darkLogoUrl={tenant.dark_logo_url} flattenLogo={tenant.flatten_logo} contactEmail={tenant.contact_email} contactPhone={tenant.contact_phone} contactLocation={tenant.full_address} />
      <section className="section-py bg-navy text-white text-center relative overflow-hidden flex flex-col justify-center" style={{ marginTop: "-72px", paddingTop: "calc(5rem + 72px)", minHeight: "60vh", background: "var(--color-nets-navy-dark)" }}>
        {tenant.slideshow_images && tenant.slideshow_images.length > 0 && (
          <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <CohortSlideshow 
              imagesRaw={tenant.slideshow_images} 
              className="w-full h-full absolute inset-0"
            />
            {/* Cinematic overlay matching the main hero */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none',
              background: 'linear-gradient(105deg, rgba(13,16,96,0.95) 0%, rgba(13,16,96,0.7) 45%, rgba(13,16,96,0) 100%)',
            }}></div>
            <div style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(13,16,96,0.8) 0%, transparent 60%)' }}></div>
          </div>
        )}
        <div className="container-nets max-w-3xl pt-16 pb-16 relative z-10 flex-1 flex flex-col justify-center">
          <h1 className="text-d2 fw-300 mb-6">Browse Open Cohorts</h1>
          <p className="text-body-lg text-white/90 mb-10">
            Join a live, interactive learning environment led by industry experts.
          </p>
        </div>
      </section>

      <section className="section-py bg-light">
        <div className="container-nets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cohorts.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-slate-500">No active cohorts found.</div>
            ) : cohorts.map((cohort: any) => (
              <CohortCard key={cohort.id} cohort={cohort} />
            ))}
          </div>
        </div>
      </section>
      <Footer tenantName={tenant.name} tenantLogo={tenant.logo_url} darkLogoUrl={tenant.dark_logo_url} flattenLogo={tenant.flatten_logo} contactEmail={tenant.contact_email} contactPhone={tenant.contact_phone} contactLocation={tenant.full_address} />
    </main>
  );
}
