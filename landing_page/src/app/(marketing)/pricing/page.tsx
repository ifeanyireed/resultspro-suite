'use client';

import PhotoHero from '@/components/PhotoHero';
import PricingSection from '@/components/PricingSection';

export default function PricingPage() {
  return (
    <>
      <PhotoHero 
        title="Choose Your Plan" 
        subtitle="Empower your educational journey with ResultsPRO's comprehensive infrastructure. Flexible plans tailored for schools, families, and agents." 
        image="/photo07.jpeg" 
        tagline="Flexible Pricing"
      />
      
      <PricingSection />
    </>
  );
}
