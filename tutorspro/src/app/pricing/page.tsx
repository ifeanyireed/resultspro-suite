"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Zap, Shield, HelpCircle, Loader2 } from "lucide-react";
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
            color: "text-blue",
            bg: "bg-blue/10",
            border: "border-blue/20"
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
            color: "text-green",
            bg: "bg-green/10",
            border: "border-green/20"
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
            color: "text-amber",
            bg: "bg-amber/10",
            border: "border-amber/20"
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
      <div className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-32">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 px-6 text-center">
           <div className="max-w-3xl mx-auto space-y-6">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/10 border border-blue/20 text-[10px] font-black text-blue mb-4 uppercase tracking-[0.2em]">
                <Zap className="w-3 h-3 fill-current" />
                Transparent Pricing
             </div>
             <h1 className="text-5xl md:text-7xl font-display font-black text-white">
               Invest in Your <span className="text-blue">Future</span>
             </h1>
             <p className="text-gray-400 text-lg">
               Choose a plan that fits your learning pace and academic goals.
             </p>
           </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {plans.map((plan, i) => (
               <div key={i} className={`relative p-8 md:p-12 rounded-[48px] bg-white/[0.02] border transition-all hover:bg-white/[0.04] flex flex-col ${plan.featured ? 'border-green/30 scale-105 shadow-[0_0_50px_rgba(0,200,83,0.1)]' : 'border-white/10'}`}>
                 {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-green text-navy text-[10px] font-black uppercase tracking-widest">
                      Most Popular
                    </div>
                 )}
                 
                 <div className="mb-8">
                    <h3 className={`text-xl font-black uppercase tracking-widest mb-4 ${plan.color}`}>{plan.name}</h3>
                    <div className="flex items-baseline gap-2">
                       <span className="text-4xl md:text-5xl font-display font-black text-white">{plan.price}</span>
                       <span className="text-gray-500 text-sm font-bold">{plan.period}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-4 leading-relaxed">{plan.desc}</p>
                 </div>

                 <div className="flex-1 space-y-4 mb-10">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-3 text-sm text-gray-300">
                         <div className={`w-5 h-5 rounded-full ${plan.bg} ${plan.color} flex items-center justify-center shrink-0`}>
                            <Check className="w-3 h-3" />
                         </div>
                         {feature}
                      </div>
                    ))}
                 </div>

                 <Link 
                   href="/signup" 
                   className={`w-full py-5 rounded-2xl font-black text-center transition-all ${
                     plan.featured 
                       ? 'bg-green text-navy shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green/90' 
                       : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                   }`}
                 >
                   {plan.cta}
                 </Link>
               </div>
             ))}
           </div>

           {/* Comparison Note */}
           <div className="mt-24 p-12 rounded-[40px] bg-white/[0.01] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-3xl bg-blue/10 flex items-center justify-center text-blue">
                    <Shield className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-xl font-display font-bold text-white">Safe & Secure Payments</h3>
                    <p className="text-sm text-gray-500 max-w-sm">We use bank-level encryption. Your sessions are protected by our Satisfaction Guarantee.</p>
                 </div>
              </div>
              <Link href="/faq" className="flex items-center gap-2 text-sm text-gray-400 font-bold hover:text-white transition-colors">
                 <HelpCircle className="w-4 h-4" /> View Pricing FAQ
              </Link>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
