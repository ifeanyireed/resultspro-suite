import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <section className="section-py bg-navy text-white text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container-nets max-w-3xl">
          <h1 className="text-d2 fw-300 mb-6">Simple, transparent pricing</h1>
          <p className="text-body-lg text-muted-light mb-10">
            Invest in your career with flexible payment options and scholarships.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
