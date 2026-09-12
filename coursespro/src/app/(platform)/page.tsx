import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { IconBook, IconBrain, IconTrophy, IconUserPlus, IconChartBar, IconDeviceLaptop, IconCertificate, IconSchool } from '@tabler/icons-react';
import Link from 'next/link';

export default function PlatformLandingPage() {
  return (
    <main>
      <Navbar hideInstructorLink={true} isPlatform={true} />
      
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
              { title: 'Built-in store', desc: 'Sell e-books and physical titles seamlessly.', icon: IconSchool },
              { title: 'Flexible payments', desc: 'Use managed provider-split checkout or connect your own gateway.', icon: IconBrain },
              { title: 'Your brand & domain', desc: 'Start on a CoursesPRO address, then connect your own domain.', icon: IconUserPlus },
              { title: 'Learner operations', desc: 'Manage learners, instructors, discussions, and emails.', icon: IconUserPlus },
              { title: 'Actionable reports', desc: 'Understand sales, progress, and results from one center.', icon: IconChartBar }
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

      {/* Academy Commerce (Matches Tenant Styling) */}
      <section className="section-py bg-white border-y border-nets-border">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="overline" style={{ marginBottom: '1rem' }}>Academy Commerce</div>
              <h2 className="text-d3 fw-300 mb-6">Turn what you know into more than a course.</h2>
              <p className="text-body-lg text-muted mb-8">
                Create a complete storefront around your expertise. Sell learning, publish books and give every buyer a polished experience without sending them to another platform.
              </p>
              
              <ul className="grid gap-6">
                {[
                  { title: "Split payments seamlessly", desc: "Collect earnings seamlessly with integrated split payments for instructors and affiliates." },
                  { title: "Fulfil digital orders instantly", desc: "Send e-books and templates to buyers automatically upon payment completion." },
                  { title: "Manage physical inventory", desc: "Track printed books and merchandise, and update buyers when their orders ship." }
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
                  <IconSchool className="w-16 h-16 text-red mx-auto mb-4" />
                  <div className="text-xl fw-600 mb-2">Commerce Excellence</div>
                  <div className="text-sm text-muted">Sell courses and books effortlessly...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Learner Experience (Matches Tenant Styling, Alt layout) */}
      <section className="section-py bg-light border-b border-nets-border">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side placeholder for UI illustration */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-square rounded-3xl bg-white border border-nets-border flex items-center justify-center relative overflow-hidden shadow-sm">
                <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: 'radial-gradient(circle at center, var(--color-nets-navy) 0%, transparent 70%)' }} />
                <div className="text-center p-8 relative z-10 bg-white rounded-2xl shadow-xl border border-nets-border">
                  <IconTrophy className="w-16 h-16 text-navy mx-auto mb-4" style={{ color: 'var(--color-nets-navy)' }} />
                  <div className="text-xl fw-600 mb-2">Learner Portal</div>
                  <div className="text-sm text-muted">Give them a home of their own...</div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="overline" style={{ marginBottom: '1rem' }}>The Learner Experience</div>
              <h2 className="text-d3 fw-300 mb-6">Give your learners a home of their own.</h2>
              <p className="text-body-lg text-muted mb-8">
                Every academy comes with a dedicated portal where learners can access their courses, join live sessions, and track their progress without distractions.
              </p>
              
              <ul className="grid gap-6">
                {[
                  { title: "Custom domain", desc: "Host your academy on your own web address, keeping your brand front and center." },
                  { title: "Unified workspace", desc: "Learners see their courses, schedules and test results in one distraction-free space." },
                  { title: "Community built-in", desc: "Foster discussions and peer collaboration directly alongside your learning material." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <IconUserPlus className="w-6 h-6 text-navy shrink-0 mt-1" style={{ color: 'var(--color-nets-navy)' }} />
                    <div>
                      <strong className="block text-lg fw-600 mb-1">{item.title}</strong>
                      <span className="text-muted text-sm">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Build your academy in three steps */}
      <section className="section-py bg-white border-b border-nets-border">
        <div className="container-nets">
          <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <div className="overline" style={{ marginBottom: '1rem' }}>Your first cohort</div>
            <h2 className="text-d4 fw-400">Build your academy in three steps.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Set up your workspace', desc: 'Create your account, name your academy, and customize your theme colors and domain.' },
              { step: '02', title: 'Add your content', desc: 'Upload your course videos, set up live sessions, and list your books in the store.' },
              { step: '03', title: 'Launch your academy', desc: 'Start enrolling learners, accepting payments, and issuing certificates to your graduates.' }
            ].map((feature, i) => (
              <div key={i} className="card p-10 relative overflow-hidden bg-light" style={{ minHeight: '300px' }}>
                <div style={{ position: 'absolute', right: '-10px', bottom: '-40px', fontSize: '140px', fontWeight: 900, color: 'rgba(0,0,0,0.03)', lineHeight: 1 }}>
                  {feature.step}
                </div>
                <div className="inline-block px-3 py-1 bg-navy text-white text-xs font-bold rounded-full mb-12" style={{ background: 'var(--color-nets-navy)' }}>
                  STEP {feature.step}
                </div>
                <h3 className="text-2xl fw-600 mb-3 relative z-10">{feature.title}</h3>
                <p className="text-muted text-base relative z-10">{feature.desc}</p>
              </div>
            ))}
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
      
      <Footer hideInstructorLink={true} isPlatform={true} />
    </main>
  );
}
