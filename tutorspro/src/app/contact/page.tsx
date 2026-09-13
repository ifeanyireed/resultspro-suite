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
         <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light flex flex-col" style={{ background: 'var(--color-nets-light)' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 text-center bg-navy text-white" style={{ background: 'var(--color-nets-navy-dark)' }}>
         <div className="max-w-3xl mx-auto space-y-6 relative z-10">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black text-green mb-4 uppercase tracking-[0.2em] backdrop-blur-sm">
              <MessageCircle className="w-3 h-3" />
              Get In Touch
           </div>
           <h1 className="text-5xl md:text-6xl font-display font-black text-white">
             Contact <span className="text-green">Us</span>
           </h1>
           <p className="text-white/70 text-lg">
             Have questions or need support? We&apos;re here to help.
           </p>
         </div>
      </section>

      <main className="flex-1 py-16 bg-light">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-8">
               <h2 className="text-3xl font-display font-black text-navy">Contact Information</h2>
               <p className="text-gray-600 max-w-md leading-relaxed">
                 Fill out the form and our team will get back to you within 24 hours. You can also reach us via the channels below.
               </p>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-6 group">
                 <div className="w-12 h-12 rounded-2xl bg-white border border-nets-border shadow-sm flex items-center justify-center text-green group-hover:bg-green-50 transition-all">
                    <Mail className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Email</div>
                    <div className="text-navy font-bold">{contactInfo?.email}</div>
                 </div>
               </div>

               <div className="flex items-center gap-6 group">
                 <div className="w-12 h-12 rounded-2xl bg-white border border-nets-border shadow-sm flex items-center justify-center text-blue-600 group-hover:bg-blue-50 transition-all">
                    <Phone className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Phone</div>
                    <div className="text-navy font-bold">{contactInfo?.phone}</div>
                 </div>
               </div>

               <div className="flex items-center gap-6 group">
                 <div className="w-12 h-12 rounded-2xl bg-white border border-nets-border shadow-sm flex items-center justify-center text-amber-600 group-hover:bg-amber-50 transition-all">
                    <MapPin className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Office</div>
                    <div className="text-navy font-bold">{contactInfo?.office}</div>
                 </div>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 md:p-12 rounded-[40px] bg-white border border-nets-border shadow-sm">
             <form className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-light border border-nets-border rounded-2xl py-4 px-6 text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green/20 transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full bg-light border border-nets-border rounded-2xl py-4 px-6 text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green/20 transition-all"
                    />
                 </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Subject</label>
                  <select className="w-full bg-light border border-nets-border rounded-2xl py-4 px-6 text-navy focus:outline-none focus:ring-2 focus:ring-green/20 transition-all appearance-none">
                     <option>General Inquiry</option>
                     <option>Technical Support</option>
                     <option>Partnership</option>
                     <option>Billing</option>
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Message</label>
                  <textarea 
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full bg-light border border-nets-border rounded-2xl py-4 px-6 text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green/20 transition-all resize-none"
                  ></textarea>
               </div>

               <button className="w-full py-5 rounded-2xl bg-green-600 text-white font-black flex items-center justify-center gap-3 hover:bg-green/90 transition-all shadow-sm">
                 SEND MESSAGE <Send className="w-5 h-5" />
               </button>
             </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
