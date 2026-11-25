"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconCheck as Check, IconShieldCheck as ShieldCheck, IconBolt as Zap, IconSchool as School, IconBuilding as Building2, IconHeart as Heart } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const tiers = [
    {
      name: "Individual Student",
      price: isAnnual ? "₦5,000" : "₦2,000",
      period: isAnnual ? "per year" : "per term",
      description: "Perfect for independent learners looking to excel in their exams.",
      features: [
        "Access to all public notes",
        "Interactive quizzes & flashcards",
        "Personal progress tracking",
        "Exam practice mode",
        "Offline content access (PWA)"
      ],
      buttonText: "Get Started",
      highlight: false,
      icon: <Zap className="w-6 h-6 text-blue" />,
      bg: "bg-blue/5"
    },
    {
      name: "Parent Pack",
      price: isAnnual ? "₦12,000" : "₦5,000",
      period: isAnnual ? "up to 3 children / yr" : "up to 3 children / term",
      description: "Empower your family's learning with comprehensive tracking.",
      features: [
        "Up to 3 child accounts",
        "Parent dashboard & activity feed",
        "Real-time performance alerts",
        "Detailed progress reports",
        "Subject mastery insights",
        "Direct teacher messaging"
      ],
      buttonText: "Join as Parent",
      highlight: false,
      icon: <Heart className="w-6 h-6 text-red-400" />,
      bg: "bg-red-400/5"
    },
    {
      name: "School Pro",
      price: isAnnual ? "₦3,600" : "₦1,500",
      period: isAnnual ? "per student / yr" : "per student / term",
      description: "The complete LMS for schools to manage curriculum and tracking.",
      features: [
        "Everything in Individual",
        "Teacher dashboard & creation tools",
        "School admin management",
        "Class-wide performance reports",
        "Private school content library",
        "Bulk student onboarding",
        "Custom school branding"
      ],
      buttonText: "Register Your School",
      highlight: true,
      icon: <School className="w-6 h-6 text-green" />,
      bg: "bg-green/10"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "tailored solutions",
      description: "For large school networks and educational institutions.",
      features: [
        "Everything in School Pro",
        "Multi-school management",
        "Advanced API access",
        "Dedicated account manager",
        "Custom feature development",
        "On-site teacher training"
      ],
      buttonText: "Contact Sales",
      highlight: false,
      icon: <Building2 className="w-6 h-6 text-amber" />,
      bg: "bg-amber/5"
    }
  ];

  return (
    <main className="min-h-screen bg-light flex flex-col" style={{ background: "var(--color-nets-light)" }}>
      <Navbar />

      {/* Navy Hero Section */}
      <section
        className="bg-navy text-white relative overflow-hidden"
        style={{ background: "var(--color-nets-navy-dark)", paddingTop: "10rem", paddingBottom: "6rem", marginTop: "-72px" }}
      >
        <div aria-hidden className="absolute inset-0 z-0 opacity-20">
          <img src="/photo07.jpeg" alt="" className="w-full h-full object-cover" />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            background: "linear-gradient(105deg, rgba(13,16,96,0.96) 0%, rgba(13,16,96,0.82) 55%, rgba(13,16,96,0.65) 100%)",
          }}
        />
        <div className="container-nets relative z-10 text-center">
          <MotionRise className="max-w-3xl mx-auto">
            <div className="overline-dark justify-center" style={{ marginBottom: "1.25rem" }}>Transparent Pricing</div>
            <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
              Invest in <span className="text-green">Academic Success</span>
            </h1>
            <p className="text-lg text-white/75 max-w-2xl mx-auto mb-10">
              Choose the plan that fits your learning needs. From independent students 
              and parents to full school ecosystems.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={cn("text-sm font-bold transition-colors", !isAnnual ? "text-white" : "text-white/60")}>Termly</span>
              <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-16 h-8 rounded-full bg-white/10 border border-white/20 p-1 relative transition-all"
              >
                <div className={cn(
                  "w-6 h-6 rounded-full bg-green shadow-lg transition-all duration-300",
                  isAnnual ? "translate-x-8" : "translate-x-0"
                )} />
              </button>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-bold transition-colors", isAnnual ? "text-white" : "text-white/60")}>Annual</span>
                <span className="px-2.5 py-0.5 rounded-full bg-green text-navy text-[10px] font-black uppercase tracking-widest">Save 20%</span>
              </div>
            </div>
          </MotionRise>
        </div>
      </section>

      {/* White Section: Tiers Grid */}
      <section className="section-py bg-white border-b border-gray-200 flex-1">
        <div className="container-nets">
          <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, i) => (
              <MotionRise 
                key={i} 
                delay={i * 0.08}
                className={cn(
                  "relative p-8 rounded-2xl border flex flex-col transition-all duration-300 bg-white",
                  tier.highlight 
                    ? "border-2 border-[#0D1060] shadow-xl lg:scale-105 z-10" 
                    : "border-gray-200 shadow-sm hover:shadow-md"
                )}
              >
                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-green text-navy text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    Most Popular
                  </div>
                )}

                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", tier.bg)}>
                  {tier.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">{tier.name}</h3>
                <p className="text-xs text-gray-500 mb-8 min-h-[40px] leading-relaxed">{tier.description}</p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{tier.period}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-1 border-t border-gray-100 pt-6">
                  {tier.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-3 text-xs text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="leading-relaxed font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={cn(
                    "w-full h-12 rounded-xl font-bold text-sm transition-all",
                    tier.highlight 
                      ? "bg-green hover:bg-[#E5A800] text-navy shadow-md" 
                      : "bg-[#0D1060] hover:bg-[#1A1FA8] text-white"
                  )}
                >
                  {tier.buttonText}
                </Button>
              </MotionRise>
            ))}
          </MotionStagger>

          {/* Guarantee Section on Light Surface */}
          <MotionRise className="mt-20 bg-light border border-gray-200 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-blue shrink-0">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900 font-display mb-1">Safe and Secure Payments</h4>
                <p className="text-gray-600 text-sm">All school and family transactions are encrypted and processed securely via Paystack.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <img src="/photo02.jpeg" alt="ClassroomPRO Schools" className="w-28 h-16 object-cover rounded-lg border border-gray-200 shadow-sm" />
              <div className="text-xs text-gray-500 font-semibold">
                Trusted by 100+<br />Partner Schools
              </div>
            </div>
          </MotionRise>
        </div>
      </section>

      <Footer />
    </main>
  );
}
