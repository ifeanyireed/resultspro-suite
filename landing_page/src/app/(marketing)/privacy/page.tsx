export const metadata = {
  title: 'Privacy Policy | ResultsPro Edu Suite',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      <section className="bg-navy text-white" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '10rem', paddingBottom: '4rem' }}>
        <div className="container-nets">
          <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: 1.1 }}>
            Privacy <span style={{ fontWeight: 700, color: 'white' }}>Policy.</span>
          </h1>
        </div>
      </section>

      <section className="section-py bg-white border-b border-nets-border">
        <div className="container-nets max-w-3xl">
          <div className="prose prose-lg text-slate-600">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-2xl font-bold text-navy mt-10 mb-4">1. Information We Collect</h2>
            <p className="mb-6 leading-relaxed">
              At ResultsPro, we collect information that you provide directly to us, such as when you create an account, update your school profile, process tuition payments, or communicate with our support team.
            </p>
            
            <h2 className="text-2xl font-bold text-navy mt-10 mb-4">2. How We Use Your Information</h2>
            <p className="mb-6 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our educational ecosystem, as well as to communicate with you about product updates, security alerts, and administrative messages.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-10 mb-4">3. Student Data Protection</h2>
            <p className="mb-6 leading-relaxed">
              We take the privacy of students incredibly seriously. Student profiles, grades, and CBT performance data are strictly siloed to their respective schools and authorized guardians. We do not sell student data to third parties under any circumstances.
            </p>
            
            <h2 className="text-2xl font-bold text-navy mt-10 mb-4">4. Contact Us</h2>
            <p className="mb-6 leading-relaxed">
              If you have any questions about this Privacy Policy or how we handle data, please contact our privacy officer at <a href="mailto:hello@resultspro.ng" className="text-blue-600 hover:underline">hello@resultspro.ng</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
