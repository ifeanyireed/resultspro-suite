import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { IconBook, IconBrain, IconTrophy, IconUserPlus } from '@tabler/icons-react';
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
            <div className="overline" style={{ marginBottom: '1rem' }}>Enterprise Infrastructure</div>
            <h2 className="text-d4 fw-400">Everything your school needs to succeed.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Curriculum Management', exams: 'Align with NERDC and Cambridge standards effortlessly.' }, 
              { title: 'Staff & Payroll', exams: 'Automate attendance, appraisals, and salary processing.' }, 
              { title: 'Result Computation', exams: 'Generate termly broadsheets and report cards instantly.' }, 
              { title: 'Fee Invoicing', exams: 'Track payments, send reminders, and manage cash flow.' }
            ].map((cat, i) => (
              <div key={i} className="card p-8">
                <IconBook className="w-8 h-8 text-red mb-6" />
                <h3 className="text-xl fw-600 mb-2">{cat.title}</h3>
                <p className="text-muted text-sm mb-6">{cat.exams}</p>
                <Link href="/features" className="nav-link text-navy" style={{ color: 'var(--color-nets-navy)' }}>
                  View capabilities &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ClassroomPRO (Mimicking WhyNETS) */}
      <section className="section-py bg-white border-y border-nets-border">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="overline" style={{ marginBottom: '1rem' }}>The ClassroomPRO Advantage</div>
              <h2 className="text-d3 fw-300 mb-6">Designed for Operational Excellence.</h2>
              <p className="text-body-lg text-muted mb-8">
                Replace your fragmented tools with a single, unified platform built specifically for the administrative and academic needs of modern Nigerian schools.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[ 
                  { title: 'Role-Based Access', reward: 'Custom portals for Teachers, Parents, and Admins', icon: IconUserPlus },
                  { title: 'Offline-First Mobile App', reward: 'Sync attendance and grades without internet', icon: IconBrain },
                  { title: 'Bank-Grade Security', reward: 'Encrypted databases with daily backups', icon: IconTrophy },
                  { title: 'Dedicated Support', reward: '24/7 technical assistance for your staff', icon: IconBook },
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
              <Link href="/contact-sales" className="btn btn-navy">Talk to our Sales Team</Link>
            </div>
            
            <div className="relative">
              <img src="/images/Students2.jpeg" alt="School administration" className="rounded-sm shadow-card-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner (Mimicking CTABanner) */}
      <section className="section-py bg-navy text-white text-center">
        <div className="container-nets max-w-3xl">
          <h2 className="text-d3 fw-300 mb-6 text-white">Ready to digitize your school?</h2>
          <p className="text-body-lg text-muted-light mb-10">
            Join hundreds of forward-thinking principals managing their curriculum, students, and staff on ClassroomPRO.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact-sales" className="btn btn-red btn-lg">Request a Demo</Link>
            <Link href="/pricing" className="btn btn-outline-white btn-lg">Calculate ROI</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
