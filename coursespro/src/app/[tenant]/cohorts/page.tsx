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
      <Navbar tenantName={tenant.name} tenantLogo={tenant.logo_url} darkLogoUrl={tenant.dark_logo_url} flattenLogo={tenant.flatten_logo} />
      <section className="section-py bg-navy text-white text-center" style={{ marginTop: "-72px", paddingTop: "calc(5rem + 72px)" }}>
        <div className="container-nets max-w-3xl pt-16">
          <h1 className="text-d2 fw-300 mb-6">Browse Open Cohorts</h1>
          <p className="text-body-lg text-muted-light mb-10">
            Join a live, interactive learning environment led by industry experts.
          </p>
        </div>
      </section>

      <section className="section-py bg-light">
        <div className="container-nets">
          {tenant.slideshow_images && <CohortSlideshow imagesRaw={tenant.slideshow_images} />}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cohorts.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-slate-500">No active cohorts found.</div>
            ) : cohorts.map((cohort: any) => (
              <CohortCard key={cohort.id} cohort={cohort} />
            ))}
          </div>
        </div>
      </section>
      <Footer tenantName={tenant.name} tenantLogo={tenant.logo_url} darkLogoUrl={tenant.dark_logo_url} flattenLogo={tenant.flatten_logo} />
    </main>
  );
}
