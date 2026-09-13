"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconMail as Mail, IconPhone as Phone, IconMapPin as MapPin, IconSend as Send, IconMessageCircle as MessageCircle, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await api.get('/public/content/contact_info');
        setContactInfo(res.data);
      } catch (err) {
        console.error("Failed to fetch contact info, using fallbacks.");
        setContactInfo({
          email: "hello@tutorspro.ng",
          phone: "+234 (0) 800 123 4567",
          office: "Lagos, Nigeria"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContactInfo();
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
            <div className="overline-dark" style={{ marginBottom: '1.5rem' }}>Get In Touch</div>
            <h1 className="fw-300" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Contact <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Us.</span>
            </h1>
            <p className="text-body-lg text-white/70">
              Have questions or need support? We&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      <section className="section-py bg-white border-b border-nets-border">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-4">
                 <h2 className="text-3xl fw-700 text-navy">Contact Information</h2>
                 <p className="text-muted text-body-lg leading-relaxed max-w-md">
                   Fill out the form and our team will get back to you within 24 hours. You can also reach us via the channels below.
                 </p>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-6 group">
                   <div className="w-12 h-12 rounded-sm bg-light border border-nets-border shadow-sm flex items-center justify-center transition-all group-hover:shadow-md" style={{ color: 'var(--primary)' }}>
                      <Mail size={24} />
                   </div>
                   <div>
                      <div className="text-xs text-muted fw-600 uppercase tracking-widest mb-1">Email</div>
                      <div className="text-navy fw-700">{contactInfo?.email}</div>
                   </div>
                 </div>

                 <div className="flex items-center gap-6 group">
                   <div className="w-12 h-12 rounded-sm bg-light border border-nets-border shadow-sm flex items-center justify-center text-blue-600 transition-all group-hover:shadow-md">
                      <Phone size={24} />
                   </div>
                   <div>
                      <div className="text-xs text-muted fw-600 uppercase tracking-widest mb-1">Phone</div>
                      <div className="text-navy fw-700">{contactInfo?.phone}</div>
                   </div>
                 </div>

                 <div className="flex items-center gap-6 group">
                   <div className="w-12 h-12 rounded-sm bg-light border border-nets-border shadow-sm flex items-center justify-center text-amber-600 transition-all group-hover:shadow-md">
                      <MapPin size={24} />
                   </div>
                   <div>
                      <div className="text-xs text-muted fw-600 uppercase tracking-widest mb-1">Office</div>
                      <div className="text-navy fw-700">{contactInfo?.office}</div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 md:p-12 rounded-sm bg-white border border-nets-border shadow-sm">
               <form className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs fw-600 uppercase tracking-widest text-muted">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-light border border-nets-border rounded-sm py-4 px-6 text-navy placeholder:text-muted focus:outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs fw-600 uppercase tracking-widest text-muted">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full bg-light border border-nets-border rounded-sm py-4 px-6 text-navy placeholder:text-muted focus:outline-none"
                      />
                   </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs fw-600 uppercase tracking-widest text-muted">Subject</label>
                    <select className="w-full bg-light border border-nets-border rounded-sm py-4 px-6 text-navy focus:outline-none appearance-none">
                       <option>General Inquiry</option>
                       <option>Technical Support</option>
                       <option>Partnership</option>
                       <option>Billing</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs fw-600 uppercase tracking-widest text-muted">Message</label>
                    <textarea 
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="w-full bg-light border border-nets-border rounded-sm py-4 px-6 text-navy placeholder:text-muted focus:outline-none resize-none"
                    ></textarea>
                 </div>

                 <button className="btn btn-red w-full flex items-center justify-center gap-2" style={{ background: 'var(--primary)', borderColor: 'var(--primary)' }}>
                   Send Message <Send size={20} />
                 </button>
               </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
