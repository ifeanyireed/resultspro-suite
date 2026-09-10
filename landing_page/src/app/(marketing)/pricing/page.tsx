'use client';

import PricingSection from '@/components/PricingSection';
import HeroAnimationWrapper from '@/components/HeroAnimationWrapper';
import { IconCreditCard } from '@tabler/icons-react';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '8rem' }}>
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-nets relative z-10">
          <HeroAnimationWrapper>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-6 backdrop-blur-sm text-blue-300">
                <IconCreditCard size={16} />
                <span>Flexible Pricing</span>
              </div>
              <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                Choose Your <span style={{ fontWeight: 700, color: 'white' }}>Plan.</span>
              </h1>
              <p className="text-body-lg text-white/70 mt-6 max-w-2xl">
                Empower your educational journey with ResultsPRO&apos;s comprehensive infrastructure. Flexible plans tailored for schools, families, and agents.
              </p>
            </div>
          </HeroAnimationWrapper>
        </div>
      </section>
      
      <PricingSection />
    </main>
  );
}
