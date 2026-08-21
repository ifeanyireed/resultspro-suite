"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconCheck as Check, IconShieldCheck as ShieldCheck, IconChartBar as BarChart3, IconUsers as Users, IconLayout as Layout, IconBolt as Zap, IconArrowRight as ArrowRight, IconLoader2 as Loader2 } from '@tabler/icons-react';
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function SchoolsPage() {
  const [features, setFeatures] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [featuresRes, pricingRes] = await Promise.all([
          api.get('/public/content/schools_features'),
          api.get('/public/content/schools_pricing')
        ]);
        setFeatures(featuresRes.data || []);
        setPricing(pricingRes.data);
      } catch (err) {
        console.error("Failed to fetch school content, using fallbacks.");
        setFeatures([
          { title: "Isolated Tenant Data", desc: "Every school gets a dedicated, isolated database to ensure maximum privacy and security.", icon: "ShieldCheck" },
          { title: "Custom Branding", desc: "Upload your logo, set your school colors, and provide a white-label experience for your students.", icon: "Layout" },
          { title: "Teacher Management", desc: "Onboard your own staff, assign them to classes, and monitor their teaching performance.", icon: "Users" },
          { title: "Usage Analytics", desc: "Get detailed insights into student engagement, attendance, and aggregate performance scores.", icon: "BarChart3" }
        ]);
        setPricing({
          name: "Enterprise Hub",
          price: "₦250k",
          period: "/year per tenant",
          desc: "Includes everything needed to run a large-scale school tutoring program with up to 50 teacher seats and 1,000 students.",
          features: [
            "Isolated Tenant Environment",
            "Custom Subdomain (school.tutorspro.ng)",
            "Logo & Color Branding",
            "CSV Bulk Student Import",
            "Advanced Teacher Permissions",
            "School-wide Activity Logs",
            "Priority Technical Support"
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck': return ShieldCheck;
      case 'Layout': return Layout;
      case 'Users': return Users;
      case 'BarChart3': return BarChart3;
      default: return Zap;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-purple animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-32">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
          
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple/10 border border-purple/20 text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">
                <Zap className="w-3 h-3 fill-current" />
                Enterprise SaaS
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-tight">
                Scale Your School with <br />
                <span className="text-purple-400">TutorsPro SaaS</span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                Empower your teachers and students with a unified tutoring ecosystem. Manage everything from onboarding to analytics in one secure place.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                 <Link href="/contact" className="px-8 py-4 rounded-2xl bg-purple-600 text-white font-black hover:bg-purple-700 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                    BOOK A DEMO
                 </Link>
                 <Link href="/signup" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all">
                    START FREE TRIAL
                 </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {features.map((feature, i) => {
                 const Icon = getIcon(feature.icon);
                 return (
                   <div key={i} className="p-6 md:p-8 rounded-[32px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                         <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
                   </div>
                 );
               })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 px-6 bg-white/[0.01] border-y border-white/5">
           <div className="max-w-[1200px] mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-16">School Multi-Tenant Pricing</h2>
              
              <div className="max-w-4xl mx-auto p-12 rounded-[48px] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 text-left relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 translate-x-12 -translate-y-12">
                    <Layout className="w-64 h-64 text-purple-400" />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                       <h3 className="text-2xl font-display font-black text-white mb-4">{pricing?.name}</h3>
                       <div className="flex items-baseline gap-2 mb-6">
                          <span className="text-5xl font-display font-black text-white">{pricing?.price}</span>
                          <span className="text-gray-500 font-bold">{pricing?.period}</span>
                       </div>
                       <p className="text-gray-400 text-sm leading-relaxed mb-8">
                         {pricing?.desc}
                       </p>
                       <Link href="/school/signup" className="inline-flex items-center gap-2 text-purple-400 font-black uppercase tracking-widest hover:gap-4 transition-all">
                          Get Started Now <ArrowRight className="w-5 h-5" />
                       </Link>
                    </div>
                    <div className="space-y-4">
                       {pricing?.features.map((item: string, i: number) => (
                         <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                            <Check className="w-4 h-4 text-purple-400" />
                            {item}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
