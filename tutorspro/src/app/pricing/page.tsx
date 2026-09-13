"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconCheck as Check, IconBolt as Zap, IconShield as Shield, IconHelpCircle as HelpCircle, IconLoader2 as Loader2 } from '@tabler/icons-react';
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/public/content/pricing_plans');
        setPlans(res.data || []);
      } catch (err) {
        console.error("Failed to fetch pricing plans, using fallbacks.");
        setPlans([
          {
            name: "Starter",
            price: "₦5,000",
            period: "per session",
            desc: "Perfect for single subject focus or quick help.",
            features: [
              "1-on-1 Live Session (60m)",
              "Verified Subject Expert",
              "Lesson Recording Access",
              "Basic Homework Support",
              "Mobile App Access"
            ],
            cta: "Get Started",
            color: "var(--color-blue)",
            bg: "bg-nets-light",
            border: "border-nets-border"
          },
          {
            name: "Premium Bundle",
            price: "₦45,000",
            period: "10 sessions",
            desc: "Our most popular choice for consistent growth.",
            features: [
              "10 Managed Live Sessions",
              "Priority Tutor Matching",
              "Progress Analytics Dashboard",
              "Unlimited Quiz Access",
              "Parent Performance Reports",
              "10% Discount on Add-ons"
            ],
            cta: "Popular Choice",
            featured: true,
            color: "var(--primary)",
            bg: "bg-white",
            border: "border-nets-border"
          },
          {
            name: "Exam Mastery",
            price: "₦80,000",
            period: "per term",
            desc: "Comprehensive prep for JAMB, WAEC, or SAT.",
            features: [
              "Unlimited Scheduled Sessions",
              "Dedicated Academic Coach",
              "Custom Study Curriculum",
              "Mock Exam Simulations",
              "24/7 Priority Support",
              "Certificate of Completion"
            ],
            cta: "Master Exams",
            color: "var(--color-amber)",
            bg: "bg-nets-light",
            border: "border-nets-border"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-navy animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-navy text-white text-center" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '6rem' }}>
        <div className="container-nets">
          <div className="max-w-3xl mx-auto">
            <div className="overline-dark" style={{ marginBottom: '1.5rem' }}>Transparent Pricing</div>
            <h1 className="fw-300" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Invest in Your <br /><span style={{ fontWeight: 700, color: 'var(--primary)' }}>Future.</span>
            </h1>
            <p className="text-body-lg text-white/70">
              Choose a plan that fits your learning pace and academic goals. No hidden fees.
            </p>
          </div>
        </div>
      </section>

      <section className="section-py bg-white border-b border-nets-border">
        <div className="container-nets">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {plans.map((plan, i) => (
               <article key={i} className={`p-8 rounded-sm bg-white border transition-all hover:shadow-card-lg flex flex-col ${plan.featured ? 'border-nets-red shadow-md scale-[1.02]' : 'border-nets-border shadow-sm'}`} style={{ borderColor: plan.featured ? 'var(--primary)' : '' }}>
                 {plan.featured && (
                    <div className="mb-6">
                      <span className="text-[10px] fw-700 text-white uppercase tracking-widest px-3 py-1 rounded-sm" style={{ background: 'var(--primary)' }}>
                        Most Popular
                      </span>
                    </div>
                 )}
                 
                 <div className="mb-8">
                    <h3 className="text-xl fw-700 uppercase tracking-widest mb-4" style={{ color: plan.color }}>{plan.name}</h3>
                    <div className="flex items-baseline gap-2">
                       <span className="text-4xl fw-700 text-navy">{plan.price}</span>
                       <span className="text-muted fw-500">{plan.period}</span>
                    </div>
                    <p className="text-muted text-sm mt-4 leading-relaxed">{plan.desc}</p>
                 </div>

                 <div className="flex-1 space-y-4 mb-10 border-t border-nets-border pt-8">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-3 text-sm text-navy fw-500">
                         <Check size={16} style={{ color: plan.color }} />
                         {feature}
                      </div>
                    ))}
                 </div>

                 <Link 
                   href="/signup" 
                   className={`btn block text-center ${plan.featured ? 'btn-red' : 'btn-outline-navy'}`}
                   style={{ 
                     background: plan.featured ? 'var(--primary)' : '',
                     borderColor: plan.featured ? 'var(--primary)' : ''
                   }}
                 >
                   {plan.cta}
                 </Link>
               </article>
             ))}
           </div>

           {/* Comparison Note */}
           <div className="mt-16 p-8 rounded-sm bg-light border border-nets-border flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-sm bg-white border border-nets-border flex items-center justify-center">
                    <Shield size={24} style={{ color: 'var(--primary)' }} />
                 </div>
                 <div>
                    <h3 className="text-lg fw-700 text-navy">Safe & Secure Payments</h3>
                    <p className="text-sm text-muted mt-1">Bank-level encryption and Satisfaction Guarantee included.</p>
                 </div>
              </div>
              <Link href="/faq" className="text-sm fw-600 text-navy hover:opacity-80 flex items-center gap-2">
                 <HelpCircle size={16} /> View Pricing FAQ
              </Link>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
