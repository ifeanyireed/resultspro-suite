const fs = require('fs');
const path = require('path');

const COURSESPRO_APP = path.join(__dirname, 'src/app');

function writePage(route, content) {
    const dir = path.join(COURSESPRO_APP, route);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'page.tsx'), content);
    console.log(`Created /${route}`);
}

const cohortsContent = `import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

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
                    <span className="flex items-center gap-1">⏱ {cohort.duration}</span>
                    <span className="flex items-center gap-1">📈 {cohort.level}</span>
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
`;

const enterpriseContent = `import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { IconCheck } from '@tabler/icons-react';

export default function EnterprisePage() {
  return (
    <main>
      <Navbar />
      <section className="section-py bg-navy text-white text-center">
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
`;

const pricingContent = `import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <section className="section-py bg-navy text-white text-center">
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
                <li>✓ Browse syllabus</li>
                <li>✓ Access free workshops</li>
                <li>✓ Community forum access</li>
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
                <li>✓ Live class attendance</li>
                <li>✓ Mentor reviews & feedback</li>
                <li>✓ Graded projects & certification</li>
                <li>✓ Direct messaging with peers</li>
              </ul>
              <Link href="/signup" className="btn btn-red w-full text-center block border-none">Enroll Now</Link>
            </div>

            {/* Enterprise */}
            <div className="card p-8 bg-white border border-slate-200">
              <h3 className="text-xl fw-600 mb-2">Enterprise</h3>
              <p className="text-muted text-sm mb-6">For teams of 10 or more.</p>
              <div className="mb-6"><span className="text-4xl fw-700">Custom</span></div>
              <ul className="space-y-3 text-sm text-muted mb-8">
                <li>✓ Private company cohorts</li>
                <li>✓ Dedicated success manager</li>
                <li>✓ Admin reporting dashboard</li>
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
`;

const applyContent = `import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ApplyPage() {
  return (
    <main>
      <Navbar />
      <section className="section-py bg-navy text-white">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-16">
            <div>
              <h1 className="text-d2 fw-300 mb-6">Become an Instructor.</h1>
              <p className="text-body-lg text-muted-light mb-10">
                Share your industry expertise with a global audience, lead interactive cohorts, and earn a steady passive income while shaping the next generation.
              </p>
              <div className="flex gap-4">
                <button className="btn btn-red btn-lg">Apply to Teach</button>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
              <h3 className="text-xl fw-600 mb-6 text-white">Instructor Application</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-light mb-1">Full Name</label>
                  <input type="text" className="w-full bg-white/10 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-red" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm text-muted-light mb-1">Email Address</label>
                  <input type="email" className="w-full bg-white/10 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-red" placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="block text-sm text-muted-light mb-1">Area of Expertise</label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-red">
                    <option value="" className="text-black">Select a field</option>
                    <option value="tech" className="text-black">Software Engineering</option>
                    <option value="design" className="text-black">Product Design</option>
                    <option value="business" className="text-black">Business & Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-light mb-1">LinkedIn URL</label>
                  <input type="url" className="w-full bg-white/10 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-red" placeholder="https://linkedin.com/in/..." />
                </div>
                <button className="btn btn-red w-full mt-4 border-none">Submit Application</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
`;

writePage('cohorts', cohortsContent);
writePage('enterprise', enterpriseContent);
writePage('pricing', pricingContent);
writePage('apply', applyContent);
