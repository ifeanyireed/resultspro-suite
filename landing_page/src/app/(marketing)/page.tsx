import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { IconSchool, IconBrain, IconBook, IconTrophy, IconUserPlus, IconChartBar, IconDeviceLaptop, IconChalkboard } from '@tabler/icons-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      {/* Services Grid (Mimicking NETS ServicesGrid) */}
      <section className="section-py bg-light">
        <div className="container-nets">
          <div style={{ marginBottom: '4rem', maxWidth: '600px' }}>
            <div className="overline" style={{ marginBottom: '1rem' }}>The Suite</div>
            <h2 className="text-d4 fw-400">Comprehensive educational infrastructure.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[
              { id: 'schoolhub', title: 'SchoolHub', desc: 'Mobile-First Digital Campus experience.', icon: IconSchool },
              { id: 'examspro', title: 'ExamsPRO', desc: 'Gamified CBT preparation for external exams.', icon: IconTrophy },
              { id: 'classroompro', title: 'ClassroomPRO', desc: 'Offline-first digital classroom resources.', icon: IconDeviceLaptop },
              { id: 'resultspro', title: 'ResultsPRO', desc: 'AI-powered results processing and insights.', icon: IconChartBar },
              { id: 'tutorspro', title: 'TutorsPRO', desc: 'Vetted, curriculum-aligned private tuition.', icon: IconChalkboard },
            ].map((cat, i) => (
              <div key={i} id={cat.id} className="card p-8 hover:shadow-card-lg transition-shadow">
                <cat.icon className="w-8 h-8 text-red mb-6" style={{ color: 'var(--color-nets-red)' }} />
                <h3 className="text-xl fw-600 mb-2">{cat.title}</h3>
                <p className="text-muted text-sm mb-6">{cat.desc}</p>
                <Link href={`#${cat.id}`} className="nav-link text-navy" style={{ color: 'var(--color-nets-navy)' }}>
                  Learn more &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ResultsPRO Suite (Mimicking WhyNETS) */}
      <section className="section-py bg-white border-y border-nets-border">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="overline" style={{ marginBottom: '1rem' }}>The Mission</div>
              <h2 className="text-d3 fw-300 mb-6">Prepare Africa for Takeover.</h2>
              <p className="text-body-lg text-muted mb-8">
                From the parent&apos;s seat at the kitchen table, through the teacher&apos;s classroom, the exam hall, the report card, the tutor&apos;s screen, and the principal&apos;s office, we are building an infrastructure to power the needed culture shift.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[
                  { title: 'Zero Processing Time', desc: 'Automate grading & results', icon: IconChartBar },
                  { title: 'Actionable Intelligence', desc: 'AI insights for parents', icon: IconBrain },
                  { title: 'Gamified Learning', desc: 'Engage students effectively', icon: IconTrophy },
                  { title: 'Seamless Collaboration', desc: 'Connect homes and schools', icon: IconUserPlus },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-sm bg-nets-light flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6" style={{ color: 'var(--color-nets-red)' }} />
                    </div>
                    <div>
                      <h4 className="fw-600">{item.title}</h4>
                      <p className="text-sm text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/onboard" className="btn btn-navy">Deploy Infrastructure</Link>
            </div>
            
            <div className="relative">
              <img src="/photo13.jpeg" alt="School management" className="rounded-sm shadow-card-lg w-full h-[600px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner (Mimicking CTABanner) */}
      <section className="section-py bg-navy text-white text-center">
        <div className="container-nets max-w-3xl">
          <h2 className="text-d3 fw-300 mb-6 text-white">Join the Future of African Education</h2>
          <p className="text-body-lg text-muted-light mb-10">
            Start your transformation journey today. Set up your digital campus in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/onboard" className="btn btn-red btn-lg">Partner With Us</Link>
            <Link href="/contact" className="btn btn-outline-white btn-lg">Contact Sales</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
