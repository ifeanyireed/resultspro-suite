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
      <div className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
...
      <Navbar />
      
      <main className="flex-1 pb-32">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-6 text-center">
           <div className="max-w-3xl mx-auto space-y-6">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green/10 border border-green/20 text-[10px] font-black text-green mb-4 uppercase tracking-[0.2em]">
                <MessageCircle className="w-3 h-3" />
                Get In Touch
             </div>
             <h1 className="text-5xl md:text-6xl font-display font-black text-white">
               Contact <span className="text-green">Us</span>
             </h1>
             <p className="text-gray-400 text-lg">
               Have questions or need support? We&apos;re here to help.
             </p>
           </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-8">
               <h2 className="text-3xl font-display font-black text-white">Contact Information</h2>
               <p className="text-gray-500 max-w-md leading-relaxed">
                 Fill out the form and our team will get back to you within 24 hours. You can also reach us via the channels below.
               </p>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-6 group">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-green group-hover:bg-green/20 transition-all">
                    <Mail className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-xs text-gray-600 font-bold uppercase tracking-widest mb-1">Email</div>
                    <div className="text-white font-bold">{contactInfo?.email}</div>
                 </div>
               </div>

               <div className="flex items-center gap-6 group">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue group-hover:bg-blue/20 transition-all">
                    <Phone className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-xs text-gray-600 font-bold uppercase tracking-widest mb-1">Phone</div>
                    <div className="text-white font-bold">{contactInfo?.phone}</div>
                 </div>
               </div>

               <div className="flex items-center gap-6 group">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber group-hover:bg-amber/20 transition-all">
                    <MapPin className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-xs text-gray-600 font-bold uppercase tracking-widest mb-1">Office</div>
                    <div className="text-white font-bold">{contactInfo?.office}</div>
                 </div>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 md:p-12 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl">
             <form className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-green/50 transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-green/50 transition-all"
                    />
                 </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Subject</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-green/50 transition-all appearance-none">
                     <option className="bg-navy">General Inquiry</option>
                     <option className="bg-navy">Technical Support</option>
                     <option className="bg-navy">Partnership</option>
                     <option className="bg-navy">Billing</option>
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Message</label>
                  <textarea 
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-green/50 transition-all resize-none"
                  ></textarea>
               </div>

               <button className="w-full py-5 rounded-2xl bg-green-600 text-white font-black flex items-center justify-center gap-3 hover:bg-green/90 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
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
