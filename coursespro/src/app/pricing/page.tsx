import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { IconCheck } from '@tabler/icons-react';

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <section className="section-py bg-navy text-white text-center" style={{ marginTop: "-72px", paddingTop: "calc(5rem + 72px)" }}>
        <div className="container-nets max-w-3xl pt-16">
          <h1 className="text-d2 fw-300 mb-6">Simple, Transparent Pricing</h1>
          <p className="text-body-lg text-muted-light mb-10">
            Invest in your career with flexible payment options. No hidden fees.
          </p>
        </div>
      </section>

      <section className="section-py bg-light">
        <div className="container-nets">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Free */}
            <div className="card p-8 bg-white border border-slate-200">
              <h3 className="text-xl fw-600 mb-2">Auditor</h3>
              <p className="text-muted text-sm mb-6">Explore the platform for free.</p>
              <div className="mb-6"><span className="text-4xl fw-700">₦0</span><span className="text-muted">/mo</span></div>
              <ul className="space-y-3 text-sm text-muted mb-8">
                <li className="flex items-center gap-2"><IconCheck size={16} className="text-green-500" /> Browse syllabus</li>
                <li className="flex items-center gap-2"><IconCheck size={16} className="text-green-500" /> Access free workshops</li>
                <li className="flex items-center gap-2"><IconCheck size={16} className="text-green-500" /> Community forum access</li>
              </ul>
              <Link href="/signup" className="btn btn-outline-navy w-full text-center block">Get Started</Link>
            </div>

            {/* Pro */}
            <div className="card p-8 bg-navy text-white border-2 border-red relative shadow-xl transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-red text-white text-xs fw-700 px-3 py-1 rounded-bl-lg">POPULAR</div>
              <h3 className="text-xl fw-600 mb-2 text-white">Pro Learner</h3>
              <p className="text-muted-light text-sm mb-6">Full access to a single cohort.</p>
              <div className="mb-6"><span className="text-4xl fw-700">₦150k</span><span className="text-muted-light">/cohort</span></div>
              <ul className="space-y-3 text-sm text-muted-light mb-8">
                <li className="flex items-center gap-2"><IconCheck size={16} className="text-green-400" /> Live class attendance</li>
                <li className="flex items-center gap-2"><IconCheck size={16} className="text-green-400" /> Mentor reviews & feedback</li>
                <li className="flex items-center gap-2"><IconCheck size={16} className="text-green-400" /> Graded projects & certification</li>
                <li className="flex items-center gap-2"><IconCheck size={16} className="text-green-400" /> Direct messaging with peers</li>
              </ul>
              <Link href="/signup" className="btn btn-red w-full text-center block border-none">Enroll Now</Link>
            </div>

            {/* Enterprise */}
            <div className="card p-8 bg-white border border-slate-200">
              <h3 className="text-xl fw-600 mb-2">Enterprise</h3>
              <p className="text-muted text-sm mb-6">For teams of 10 or more.</p>
              <div className="mb-6"><span className="text-4xl fw-700">Custom</span></div>
              <ul className="space-y-3 text-sm text-muted mb-8">
                <li className="flex items-center gap-2"><IconCheck size={16} className="text-green-500" /> Private company cohorts</li>
                <li className="flex items-center gap-2"><IconCheck size={16} className="text-green-500" /> Dedicated success manager</li>
                <li className="flex items-center gap-2"><IconCheck size={16} className="text-green-500" /> Admin reporting dashboard</li>
              </ul>
              <Link href="/enterprise" className="btn btn-outline-navy w-full text-center block">Contact Sales</Link>
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
