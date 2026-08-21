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
            <div className="overline" style={{ marginBottom: '1rem' }}>Features</div>
            <h2 className="text-d4 fw-400">Everything you need to succeed.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{ title: '1-on-1 Sessions', exams: 'Personalized attention' }, { title: 'Group Classes', exams: 'Affordable group learning' }, { title: 'Exam Prep', exams: 'WAEC, JAMB, SAT specialists' }, { title: 'Skill Building', exams: 'Coding, Languages, Music' }].map((cat, i) => (
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

      {/* Why TutorsPRO (Mimicking WhyNETS) */}
      <section className="section-py bg-white border-y border-nets-border">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="overline" style={{ marginBottom: '1rem' }}>Why Choose Us</div>
              <h2 className="text-d3 fw-300 mb-6">Designed for Results.</h2>
              <p className="text-body-lg text-muted mb-8">
                Our platform is built to optimize your learning experience with powerful tools and analytics.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[
                  { title: 'Correct MCQ', reward: '+1', icon: IconBook },
                  { title: 'Theory (AI)', reward: '+3', icon: IconBrain },
                  { title: '7-Day Streak', reward: '+15', icon: IconTrophy },
                  { title: 'Refer a Friend', reward: '+50', icon: IconUserPlus },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-sm bg-nets-light flex items-center justify-center text-red shrink-0">
                      <item.icon className="w-6 h-6 text-red" style={{ color: 'var(--color-nets-red)' }} />
                    </div>
                    <div>
                      <h4 className="fw-600">{item.title}</h4>
                      <p className="text-sm text-muted">{item.reward} Coins</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/economy" className="btn btn-navy">Learn More</Link>
            </div>
            
            <div className="relative">
              <img src="/images/Students3.jpeg" alt="Students learning" className="rounded-sm shadow-card-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner (Mimicking CTABanner) */}
      <section className="section-py bg-navy text-white text-center">
        <div className="container-nets max-w-3xl">
          <h2 className="text-d3 fw-300 mb-6 text-white">Join 50,000+ Students Already Winning</h2>
          <p className="text-body-lg text-muted-light mb-10">
            Start your journey today. Sign up for free and get 50 bonus coins.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="btn btn-red btn-lg">Create Free Account</Link>
            <Link href="/login" className="btn btn-outline-white btn-lg">Sign In</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
