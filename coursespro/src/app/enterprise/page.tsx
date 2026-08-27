import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { IconCheck } from '@tabler/icons-react';

export default function EnterprisePage() {
  return (
    <main>
      <Navbar />
      <section className="section-py bg-navy text-white text-center" style={{ marginTop: "-72px", paddingTop: "calc(5rem + 72px)" }}>
        <div className="container-nets max-w-3xl pt-16">
          <h1 className="text-d2 fw-300 mb-6">CoursesPRO for Enterprise</h1>
          <p className="text-body-lg text-muted-light mb-10">
            Upskill your entire workforce with dedicated corporate cohorts, powerful analytics, and progress tracking.
          </p>
          <button className="btn btn-red btn-lg">Book a Demo</button>
        </div>
      </section>

      <section className="section-py bg-white">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-d3 fw-300 mb-6">Train your team at scale.</h2>
              <p className="text-body-lg text-muted mb-8">
                Provide your employees with industry-leading cohort learning experiences without the overhead of building your own curriculum.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Dedicated private cohorts for your company",
                  "Granular tracking and performance analytics",
                  "Customized curriculum aligned to your business goals",
                  "Dedicated success manager and support"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                      <IconCheck size={14} />
                    </div>
                    <span className="text-muted fw-500">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-slate-100 rounded-2xl p-8 border border-slate-200 shadow-xl relative overflow-hidden">
                <img src="/images/Students1.jpeg" alt="Enterprise Training" className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
