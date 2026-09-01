import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ApplyPage() {
  return (
    <main>
      <Navbar />
      <section className="section-py bg-navy text-white" style={{ marginTop: "-72px", paddingTop: "calc(5rem + 72px)" }}>
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
