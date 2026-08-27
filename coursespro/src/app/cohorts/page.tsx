import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { IconClock, IconTrendingUp } from '@tabler/icons-react';

export default function CohortsPage() {
  const cohorts = [
    { title: "Fullstack Engineering Sprint", level: "Beginner", duration: "12 Weeks", tag: "Tech" },
    { title: "Product Design (UI/UX)", level: "Intermediate", duration: "8 Weeks", tag: "Design" },
    { title: "Data Science & AI", level: "Advanced", duration: "16 Weeks", tag: "Data" },
    { title: "Growth Marketing", level: "Beginner", duration: "6 Weeks", tag: "Business" },
    { title: "Backend Architecture", level: "Advanced", duration: "10 Weeks", tag: "Tech" },
    { title: "Technical Writing", level: "Beginner", duration: "4 Weeks", tag: "Creative" },
  ];

  return (
    <main>
      <Navbar />
      <section className="section-py bg-navy text-white text-center">
        <div className="container-nets max-w-3xl pt-16">
          <h1 className="text-d2 fw-300 mb-6">Browse Open Cohorts</h1>
          <p className="text-body-lg text-muted-light mb-10">
            Join a live, interactive learning environment led by industry experts.
          </p>
        </div>
      </section>

      <section className="section-py bg-light">
        <div className="container-nets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cohorts.map((cohort, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="h-48 bg-slate-200 relative">
                   <img src="/images/Students1.jpeg" alt={cohort.title} className="w-full h-full object-cover" />
                   <span className="absolute top-4 right-4 bg-white text-navy px-3 py-1 text-xs font-bold rounded-full">
                     {cohort.tag}
                   </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl fw-600 mb-3">{cohort.title}</h3>
                  <div className="flex gap-4 text-sm text-muted mb-6">
                    <span className="flex items-center gap-1"><IconClock size={16} /> {cohort.duration}</span>
                    <span className="flex items-center gap-1"><IconTrendingUp size={16} /> {cohort.level}</span>
                  </div>
                  <Link href="/signup" className="btn btn-navy w-full text-center block">
                    Join Cohort
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
