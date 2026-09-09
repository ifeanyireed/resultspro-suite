export const metadata = {
  title: 'Terms of Service | ResultsPro Edu Suite',
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      <section className="bg-navy text-white" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '10rem', paddingBottom: '4rem' }}>
        <div className="container-nets">
          <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: 1.1 }}>
            Terms of <span style={{ fontWeight: 700, color: 'white' }}>Service.</span>
          </h1>
        </div>
      </section>

      <section className="section-py bg-white border-b border-nets-border">
        <div className="container-nets max-w-3xl">
          <div className="prose prose-lg text-slate-600">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-2xl font-bold text-navy mt-10 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6 leading-relaxed">
              By accessing and using the ResultsPro Edu Suite (including SchoolHub, ExamsPRO, ClassroomPRO, ResultsPRO, TutorsPRO, and PuzzlePRO), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            
            <h2 className="text-2xl font-bold text-navy mt-10 mb-4">2. Use License</h2>
            <p className="mb-6 leading-relaxed">
              Permission is granted to temporarily download one copy of the materials (information or software) on ResultsPro's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-10 mb-4">3. Data Security & School Privacy</h2>
            <p className="mb-6 leading-relaxed">
              Schools using our infrastructure retain full ownership of their student data. We implement bank-grade encryption to ensure that all academic and financial records remain strictly confidential and tamper-proof.
            </p>
            
            <h2 className="text-2xl font-bold text-navy mt-10 mb-4">4. Contact Information</h2>
            <p className="mb-6 leading-relaxed">
              If you have any questions or concerns regarding these Terms, please contact our legal team at <a href="mailto:hello@resultspro.ng" className="text-blue-600 hover:underline">hello@resultspro.ng</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
