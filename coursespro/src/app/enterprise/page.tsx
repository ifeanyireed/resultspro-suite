import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function EnterprisePage() {
  return (
    <main>
      <Navbar />
      <section className="section-py bg-navy text-white text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container-nets max-w-3xl">
          <h1 className="text-d2 fw-300 mb-6">CoursesPRO for Enterprise</h1>
          <p className="text-body-lg text-muted-light mb-10">
            Upskill your entire workforce with dedicated corporate cohorts and tracking.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
