"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconCheck as Check, IconShieldCheck as ShieldCheck, IconBolt as Zap, IconSchool as School, IconBuilding2 as Building2, IconHeart as Heart } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
              Invest in <span className="text-green">Academic Success</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Choose the plan that fits your learning needs. From independent students 
              and parents to full school ecosystems.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={cn("text-sm font-bold transition-colors", !isAnnual ? "text-white" : "text-muted-foreground")}>Termly</span>
              <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-16 h-8 rounded-full bg-white/5 border border-white/10 p-1 relative transition-all"
              >
                <div className={cn(
                  "w-6 h-6 rounded-full bg-green shadow-lg transition-all duration-300",
                  isAnnual ? "translate-x-8" : "translate-x-0"
                )} />
              </button>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-bold transition-colors", isAnnual ? "text-white" : "text-muted-foreground")}>Annual</span>
                <span className="px-2 py-0.5 rounded-full bg-green/20 text-green text-[10px] font-black uppercase tracking-widest">Save 20%</span>
              </div>
            </div>
          </div>

          {/* Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, i) => (
              <div 
                key={i} 
                className={cn(
                  "relative p-6 rounded-[32px] border flex flex-col transition-all duration-500",
                  tier.highlight 
                    ? "bg-white/5 border-green/30 shadow-[0_0_80px_rgba(0,200,83,0.1)] lg:scale-105 z-10" 
                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
                )}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                    Most Popular
                  </div>
                )}

                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", tier.bg)}>
                  {tier.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 font-display">{tier.name}</h3>
                <p className="text-xs text-muted-foreground mb-8 min-h-[40px] leading-relaxed">{tier.description}</p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">{tier.price}</span>
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{tier.period}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {tier.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-3 text-xs text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-green/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green" />
                      </div>
                      <span className="leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={cn(
                    "w-full h-12 rounded-xl font-bold text-sm transition-all",
                    tier.highlight 
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-[0_0_20px_rgba(0,200,83,0.2)]" 
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  )}
                >
                  {tier.buttonText}
                </Button>
              </div>
            ))}
          </div>

          {/* Guarantee Section */}
          <div className="mt-24 bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-green/10 flex items-center justify-center text-green shrink-0">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white font-display mb-1">Safe and Secure Payments</h4>
                <p className="text-muted-foreground">All transactions are encrypted and processed securely.</p>
              </div>
            </div>
            <div className="flex gap-4">
               {/* Logos placeholder */}
               <div className="h-8 w-24 bg-white/10 rounded" />
               <div className="h-8 w-24 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
