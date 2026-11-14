import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { 
  IconBrain, 
  IconCode, 
  IconBriefcase, 
  IconPalette, 
  IconCpu 
} from '@tabler/icons-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTenant } from '@/lib/tenant';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

export default async function TenantHome({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.tenant);

  // If the tenant isn't found, you can show a 404 page
  if (!tenant) {
    notFound();
  }

  return (
    <main>
      <Navbar tenantName={tenant.name} tenantLogo={tenant.logo_url} darkLogoUrl={tenant.dark_logo_url} flattenLogo={tenant.flatten_logo} contactEmail={tenant.contact_email} contactPhone={tenant.contact_phone} contactLocation={tenant.full_address} />
      <Hero tenantName={tenant.name} heroBgUrl={tenant.hero_bg_url} />

      {/* Services Grid (Mimicking NETS ServicesGrid) */}
      <section className="section-py bg-light">
        <MotionRise className="container-nets">
          <div style={{ marginBottom: '4rem', maxWidth: '600px' }}>
            <div className="overline" style={{ marginBottom: '1rem' }}>Features</div>
            <h2 className="text-d4 fw-400">Everything you need to succeed at {tenant.name}.</h2>
          </div>
          
          <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Tech Skills', desc: 'Coding, Data, Design', icon: IconCode },
              { title: 'Business', desc: 'Marketing, Finance, Ops', icon: IconBriefcase },
              { title: 'Creative', desc: 'Writing, Video, Audio', icon: IconPalette },
              { title: 'Productivity', desc: 'Tools, Automation, AI', icon: IconCpu }
            ].map((cat, i) => (
              <div key={i} className="card p-8">
                <cat.icon className="w-8 h-8 text-red mb-6" />
                <h3 className="text-xl fw-600 mb-2">{cat.title}</h3>
                <p className="text-muted text-sm mb-6">{cat.desc}</p>
                <Link href="/cohorts" className="nav-link text-navy" style={{ color: 'var(--color-nets-navy)' }}>
                  Explore program &rarr;
                </Link>
              </div>
            ))}
          </MotionStagger>
        </MotionRise>
      </section>

      {/* The Standard Manifesto & Pedagogy Callout */}
      <section className="py-20 bg-[#0B1021] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <MotionRise className="container-nets relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/15 px-3.5 py-1 rounded-full text-blue-400 text-xs font-mono font-bold uppercase tracking-wider mb-5">
              <span>Our Learning Pedagogy</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
              We Don't Sell Video Playlists.<br />We Engineer Practitioners.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Explore our anti-lecture manifesto, 4-stage learning operating system, 48-hour mentor feedback SLA, and verified student proof-of-work.
            </p>
          </div>
          <div className="shrink-0">
            <Link 
              href="/the-standard" 
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-8 py-4 rounded-full shadow-lg shadow-blue-600/25 transition-all group"
            >
              <span>Explore The Standard</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
        </MotionRise>
      </section>

      {/* Why CoursesPRO (Mimicking WhyNETS) */}
      <section className="section-py bg-white border-y border-nets-border">
        <MotionRise className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="overline" style={{ marginBottom: '1rem' }}>Why Choose Us</div>
              <h2 className="text-d3 fw-300 mb-6">Designed for Results.</h2>
              <p className="text-body-lg text-muted mb-8">
                Our platform is built to optimize your learning experience with powerful tools and analytics.
              </p>
              
              <MotionStagger className="grid gap-6">
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
              </MotionStagger>
            </div>
            
            {/* Right side placeholder for UI illustration */}
            <div className="relative w-full h-full min-h-[400px] lg:aspect-square">
              <div className="w-full h-full bg-light border border-nets-border flex items-center justify-center relative overflow-hidden rounded-none shadow-sm">
                <img 
                  src={tenant.preview_image_url || tenant.hero_bg_url || "/assets/images/dashboard-preview.svg"} 
                  alt={`${tenant.name} Preview`}
                  className="absolute inset-0 w-full h-full object-cover rounded-none"
                />
              </div>
            </div>
          </div>
        </MotionRise>
      </section>

      {/* Simple CTA */}
      <section className="section-py" style={{ background: 'var(--color-nets-navy)', color: '#fff' }}>
        <MotionRise className="container-nets text-center">
          <h2 className="text-d3 fw-300 mb-6">Ready to accelerate your career?</h2>
          <p className="text-body-lg mb-8 opacity-80 max-w-[600px] mx-auto">
            Join the next cohort and transform your skill set with {tenant.name}.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/apply" className="btn btn-red btn-lg px-8">
              Apply Now
            </Link>
            <Link href="/cohorts" className="btn btn-light btn-lg px-8" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
              View Schedule
            </Link>
          </div>
        </MotionRise>
      </section>
      
      <Footer tenantName={tenant.name} tenantLogo={tenant.logo_url} darkLogoUrl={tenant.dark_logo_url} flattenLogo={tenant.flatten_logo} contactEmail={tenant.contact_email} contactPhone={tenant.contact_phone} contactLocation={tenant.full_address} />
    </main>
  );
}
