import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { IconBook, IconBrain, IconTrophy, IconUserPlus } from '@tabler/icons-react';

export default function EnterprisePage() {
  return (
    <main>
      <Navbar />
      
      {/* Enterprise Hero */}
      <section className="section-py bg-navy text-white text-center" style={{ marginTop: "-72px", paddingTop: "calc(5rem + 72px)" }}>
        <div className="container-nets max-w-3xl pt-16">
          <h1 className="text-d2 fw-300 mb-6">CoursesPRO for Enterprise</h1>
          <p className="text-body-lg text-muted-light mb-10">
            Upskill your entire workforce with dedicated corporate cohorts, powerful analytics, and progress tracking.
          </p>
          <button className="btn btn-red btn-lg">Book a Demo</button>
        </div>
      </section>

      {/* Services Grid (Mimicking NETS ServicesGrid) */}
      <section className="section-py bg-light">
        <div className="container-nets">
          <div style={{ marginBottom: '4rem', maxWidth: '600px' }}>
            <div className="overline" style={{ marginBottom: '1rem' }}>Corporate Solutions</div>
            <h2 className="text-d4 fw-400">Everything your team needs to scale.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Dedicated Cohorts', exams: 'Private learning environments' }, 
              { title: 'Custom Curriculum', exams: 'Aligned to your company goals' }, 
              { title: 'Manager Analytics', exams: 'Track employee progression' }, 
              { title: 'Success Support', exams: 'Dedicated account management' }
            ].map((cat, i) => (
              <div key={i} className="card p-8">
                <IconBook className="w-8 h-8 text-red mb-6" />
                <h3 className="text-xl fw-600 mb-2">{cat.title}</h3>
                <p className="text-muted text-sm mb-6">{cat.exams}</p>
                <Link href="/contact" className="nav-link text-navy" style={{ color: 'var(--color-nets-navy)' }}>
                  Learn more &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Enterprise (Mimicking WhyNETS) */}
      <section className="section-py bg-white border-y border-nets-border">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="overline" style={{ marginBottom: '1rem' }}>Why Choose Us</div>
              <h2 className="text-d3 fw-300 mb-6">Designed for scale.</h2>
              <p className="text-body-lg text-muted mb-8">
                Our platform is built to optimize your team's learning experience with powerful administrative tools and manager analytics.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[ 
                  { title: 'Private Sessions', reward: 'Company-only classes', icon: IconUserPlus },
                  { title: 'Team Community', reward: 'Internal collaboration', icon: IconBrain },
                  { title: 'Internal Projects', reward: 'Solve company problems', icon: IconTrophy },
                  { title: 'Manager Reports', reward: 'Exportable ROI data', icon: IconBook },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-sm bg-nets-light flex items-center justify-center text-red shrink-0">
                      <item.icon className="w-6 h-6 text-red" style={{ color: 'var(--color-nets-red)' }} />
                    </div>
                    <div>
                      <h4 className="fw-600">{item.title}</h4>
                      <p className="text-sm text-muted">{item.reward}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn btn-navy">Contact Sales</Link>
            </div>
            
            <div className="relative">
              <img src="/images/Students1.jpeg" alt="Enterprise Training" className="rounded-sm shadow-card-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner (Mimicking CTABanner) */}
      <section className="section-py bg-navy text-white text-center">
        <div className="container-nets max-w-3xl">
          <h2 className="text-d3 fw-300 mb-6 text-white">Ready to train your workforce?</h2>
          <p className="text-body-lg text-muted-light mb-10">
            Upskill your entire company with highly curated, cohort-based training and dedicated support.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn btn-red btn-lg">Book a Demo</Link>
            <Link href="/pricing" className="btn btn-outline-white btn-lg">View Pricing</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
