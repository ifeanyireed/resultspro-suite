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
      <div className="min-h-screen bg-light flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-navy animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-navy text-white" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '6rem' }}>
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-3xl">
              <div className="overline-dark" style={{ marginBottom: '1.5rem' }}>Enterprise SaaS</div>
              <h1 className="fw-300" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                Scale Your School <br />with <span style={{ fontWeight: 700, color: 'var(--primary)' }}>TutorsPro.</span>
              </h1>
              <p className="text-body-lg text-white/70 mb-10">
                Empower your teachers and students with a unified tutoring ecosystem. Manage everything from onboarding to analytics in one secure place.
              </p>
              <div className="flex flex-wrap gap-4">
                 <Link href="/contact" className="btn btn-red" style={{ padding: '1rem 2rem', fontSize: '1rem', background: 'var(--primary)', borderColor: 'var(--primary)' }}>
                    Book a Demo
                 </Link>
                 <Link href="/signup" className="btn btn-outline-white" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                    Start Free Trial
                 </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {features.map((feature, i) => {
                 const Icon = getIcon(feature.icon);
                 return (
                   <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors">
                      <div className="mb-4 text-white">
                         <Icon size={32} />
                      </div>
                      <h3 className="text-lg fw-600 text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-white/60 leading-relaxed">{feature.desc}</p>
                   </div>
                 );
               })}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-py bg-white border-b border-nets-border">
        <div className="container-nets text-center">
           <div className="overline" style={{ marginBottom: '1rem' }}>Clear Pricing</div>
           <h2 className="text-d4 fw-400 mb-16 text-navy">School Multi-Tenant <span style={{ fontWeight: 700 }}>Pricing</span></h2>
           
           <div className="max-w-4xl mx-auto p-12 rounded-sm bg-light border border-nets-border text-left relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 translate-x-12 -translate-y-12">
                 <Layout size={240} className="text-navy" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                 <div>
                    <h3 className="text-2xl fw-700 text-navy mb-4">{pricing?.name}</h3>
                    <div className="flex items-baseline gap-2 mb-6">
                       <span className="text-5xl fw-700 text-navy">{pricing?.price}</span>
                       <span className="text-muted fw-600">{pricing?.period}</span>
                    </div>
                    <p className="text-muted text-sm leading-relaxed mb-8">
                      {pricing?.desc}
                    </p>
                    <Link href="/school/signup" className="btn btn-red" style={{ background: 'var(--primary)', borderColor: 'var(--primary)' }}>
                       Get Started Now <ArrowRight size={16} className="inline-block ml-2" />
                    </Link>
                 </div>
                 <div className="space-y-4">
                    {pricing?.features.map((item: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-navy fw-500">
                         <Check size={16} style={{ color: 'var(--primary)' }} />
                         {item}
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
