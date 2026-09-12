import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { IconBook, IconBrain, IconTrophy, IconUserPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getTenant(tenantSlug: string) {
  const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
  // Check both default_subdomain and custom_domain
  const domain = `${tenantSlug}.resultspro.ng`; // Default subdomain
  
  try {
    const res = await fetch(`${USERS_API}/api/v1/tenants/resolve?domain=${domain}`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (!res.ok) {
      // If it fails, we can optionally try the raw slug as the custom domain
      const customRes = await fetch(`${USERS_API}/api/v1/tenants/resolve?domain=${tenantSlug}`, {
        next: { revalidate: 60 }
      });
      if (!customRes.ok) return null;
      const data = await customRes.json();
      return data.tenant || null;
    }
    const data = await res.json();
    return data.tenant || null;
  } catch (e) {
    return null;
  }
}

export default async function TenantHome({ params }: { params: { tenant: string } }) {
  const tenant = await getTenant(params.tenant);

  // If the tenant isn't found, you can show a 404 page
  if (!tenant) {
    notFound();
  }

  return (
    <main>
      <Navbar />
      <Hero tenantName={tenant.name} />

      {/* Services Grid (Mimicking NETS ServicesGrid) */}
      <section className="section-py bg-light">
        <div className="container-nets">
          <div style={{ marginBottom: '4rem', maxWidth: '600px' }}>
            <div className="overline" style={{ marginBottom: '1rem' }}>Features</div>
            <h2 className="text-d4 fw-400">Everything you need to succeed at {tenant.name}.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{ title: 'Tech Skills', exams: 'Coding, Data, Design' }, { title: 'Business', exams: 'Marketing, Finance, Ops' }, { title: 'Creative', exams: 'Writing, Video, Audio' }, { title: 'Productivity', exams: 'Tools, Automation, AI' }].map((cat, i) => (
              <div key={i} className="card p-8">
                <IconBook className="w-8 h-8 text-red mb-6" />
                <h3 className="text-xl fw-600 mb-2">{cat.title}</h3>
                <p className="text-muted text-sm mb-6">{cat.exams}</p>
                <Link href="/practice" className="nav-link text-navy" style={{ color: 'var(--color-nets-navy)' }}>
                  Explore program &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why CoursesPRO (Mimicking WhyNETS) */}
      <section className="section-py bg-white border-y border-nets-border">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="overline" style={{ marginBottom: '1rem' }}>Why Choose Us</div>
              <h2 className="text-d3 fw-300 mb-6">Designed for Results.</h2>
              <p className="text-body-lg text-muted mb-8">
                Our platform is built to optimize your learning experience with powerful tools and analytics.
              </p>
              
              <ul className="grid gap-6">
                {[
                  { title: "Live Cohorts", desc: "Join interactive, schedule-based sessions with expert mentors." },
                  { title: "Project-Based", desc: "Build a real portfolio with hands-on labs and peer reviews." },
                  { title: "Verified Credentials", desc: "Earn certificates that employers trust upon graduation." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <IconBrain className="w-6 h-6 text-red shrink-0 mt-1" />
                    <div>
                      <strong className="block text-lg fw-600 mb-1">{item.title}</strong>
                      <span className="text-muted text-sm">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Right side placeholder for UI illustration */}
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-light border border-nets-border flex items-center justify-center relative overflow-hidden">
                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle at center, var(--color-nets-red) 0%, transparent 70%)' }} />
                <div className="text-center p-8 relative z-10 bg-white rounded-2xl shadow-xl border border-nets-border">
                  <IconTrophy className="w-16 h-16 text-red mx-auto mb-4" />
                  <div className="text-xl fw-600 mb-2">{tenant.name} Excellence</div>
                  <div className="text-sm text-muted">A sneak peek of the dashboard...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="section-py" style={{ background: 'var(--color-nets-navy)', color: '#fff' }}>
        <div className="container-nets text-center">
          <h2 className="text-d3 fw-300 mb-6">Ready to accelerate your career?</h2>
          <p className="text-body-lg mb-8 opacity-80 max-w-[600px] mx-auto">
            Join the next cohort and transform your skill set with {tenant.name}.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup" className="btn btn-red btn-lg px-8">
              Apply Now
            </Link>
            <Link href="/cohorts" className="btn btn-light btn-lg px-8" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
              View Schedule
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
