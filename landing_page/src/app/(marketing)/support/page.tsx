import Link from 'next/link';
import { IconHelp, IconBook, IconMessageCircle, IconArrowRight, IconSearch } from '@tabler/icons-react';

export const metadata = {
  title: 'Help Center | ResultsPro Edu Suite',
  description: 'Get help with SchoolHub, ExamsPRO, and all ResultsPro products.',
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '8rem' }}>
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-amber-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-nets relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-6 backdrop-blur-sm text-amber-300 mx-auto">
            <IconHelp size={16} />
            <span>Help Center</span>
          </div>
          <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            How can we <span style={{ fontWeight: 700, color: 'white' }}>help you?</span>
          </h1>
          
          <div className="mt-8 relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <IconSearch size={20} className="text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search for articles, guides, or FAQs..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:bg-white/20 transition-all backdrop-blur-md"
            />
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="section-py bg-white border-b border-nets-border">
        <div className="container-nets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/contact" className="p-8 rounded-2xl border border-nets-border hover:border-blue-500 hover:shadow-card-lg transition-all group block">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <IconMessageCircle size={24} />
              </div>
              <h3 className="text-xl fw-600 text-navy mb-2 flex items-center justify-between">
                Contact Support
                <IconArrowRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-muted">Open a ticket or reach out to our customer success team directly.</p>
            </Link>

            <div className="p-8 rounded-2xl border border-nets-border hover:border-blue-500 hover:shadow-card-lg transition-all group cursor-not-allowed opacity-80 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded fw-600">Coming Soon</div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <IconBook size={24} />
              </div>
              <h3 className="text-xl fw-600 text-navy mb-2 flex items-center justify-between">
                Knowledge Base
                <IconArrowRight size={20} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-muted">Browse step-by-step documentation for deploying SchoolHub.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
