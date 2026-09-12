import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { IconBook, IconBrain, IconTrophy, IconUserPlus, IconChartBar, IconDeviceLaptop, IconCertificate, IconSchool } from '@tabler/icons-react';
import Link from 'next/link';

export default function PlatformLandingPage() {
  return (
    <main>
      <Navbar />
      
      {/* Platform Hero using shared Hero component */}
      <Hero 
        overline="✦ One platform for learning, commerce and growth"
        titleLine1="Teach. Sell. Grow."
        titleLine2="Under your brand."
        titleLine3="Everything you need in one workspace."
        description="Launch a premium academy for courses, live sessions, e-books and printed books. Take payments, issue certificates, and track every outcome."
        ctaPrimaryText="Start free forever"
        ctaPrimaryLink="/signup"
        ctaSecondaryText="See how it works"
        ctaSecondaryLink="#features"
        features={["No credit card", "Setup in minutes", "Upgrade anytime"]}
      />

      {/* Services Grid (Matches Tenant Styling) */}
      <section id="features" className="section-py bg-light">
        <div className="container-nets">
          <div style={{ marginBottom: '4rem', maxWidth: '600px' }}>
            <div className="overline" style={{ marginBottom: '1rem' }}>One connected platform</div>
            <h2 className="text-d4 fw-400">More ways to teach.<br/>More ways to earn.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Course builder', desc: 'Build self-paced programs with video and paths.', icon: IconBook },
              { title: 'Live learning', desc: 'Schedule instructor-led cohorts and attendance.', icon: IconDeviceLaptop },
              { title: 'Assess & certify', desc: 'Run tests and issue polished certificates.', icon: IconCertificate },
              { title: 'Built-in store', desc: 'Sell e-books and physical titles seamlessly.', icon: IconSchool }
            ].map((feature, i) => (
              <div key={i} className="card p-8">
                <feature.icon className="w-8 h-8 text-red mb-6" />
                <h3 className="text-xl fw-600 mb-2">{feature.title}</h3>
                <p className="text-muted text-sm mb-6">{feature.desc}</p>
                <Link href="/signup" className="nav-link text-navy" style={{ color: 'var(--color-nets-navy)' }}>
                  Start Building &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Platform (Matches Tenant Styling) */}
      <section className="section-py bg-white border-y border-nets-border">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="overline" style={{ marginBottom: '1rem' }}>Academy Commerce</div>
              <h2 className="text-d3 fw-300 mb-6">Designed for scale.</h2>
              <p className="text-body-lg text-muted mb-8">
                Create a complete storefront around your expertise. Sell learning, publish books and give every buyer a polished experience.
              </p>
              
              <ul className="grid gap-6">
                {[
                  { title: "Flexible Payments", desc: "Use provider-split checkout or connect your own gateway." },
                  { title: "Your Brand & Domain", desc: "Start free, then connect your own domain securely." },
                  { title: "Actionable Reports", desc: "Understand sales, progress, and results from one center." }
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
                  <div className="text-xl fw-600 mb-2">Platform Excellence</div>
                  <div className="text-sm text-muted">Manage your entire academy...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA (Matches Tenant Styling) */}
      <section className="section-py" style={{ background: 'var(--color-nets-navy)', color: '#fff' }}>
        <div className="container-nets text-center">
          <h2 className="text-d3 fw-300 mb-6">Ready to launch your own academy?</h2>
          <p className="text-body-lg mb-8 opacity-80 max-w-[600px] mx-auto">
            Get everything you need to sell courses, books, and live sessions under your own brand in minutes.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup" className="btn btn-red btn-lg px-8">
              Start building for free
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
