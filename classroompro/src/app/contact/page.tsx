"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconMail as Mail, IconPhone as Phone, IconMapPin as MapPin, IconMessage as MessageSquare, IconSend as Send, IconGlobe as Globe, IconBrandTwitter as Twitter, IconBrandInstagram as Instagram, IconBrandFacebook as Facebook } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-light flex flex-col" style={{ background: "var(--color-nets-light)" }}>
      <Navbar />
      
      {/* Navy Hero Section */}
      <section
        className="bg-navy text-white relative overflow-hidden"
        style={{ background: "var(--color-nets-navy-dark)", paddingTop: "10rem", paddingBottom: "6rem", marginTop: "-72px" }}
      >
        <div aria-hidden className="absolute inset-0 z-0 opacity-20">
          <img src="/photo09.jpeg" alt="" className="w-full h-full object-cover" />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            background: "linear-gradient(105deg, rgba(13,16,96,0.96) 0%, rgba(13,16,96,0.82) 55%, rgba(13,16,96,0.65) 100%)",
          }}
        />
        <div className="container-nets relative z-10 text-center">
          <MotionRise className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/15 border border-green/30 text-green text-xs font-black uppercase tracking-widest">
              <MessageSquare className="w-4 h-4" /> Get in Touch
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white font-display tracking-tight leading-tight">
              Let&apos;s start a <span className="text-green">conversation</span>
            </h1>
            <p className="text-white/75 text-lg leading-relaxed">
              Have questions about ClassroomPRO? Our team is here to help your school transition to a better digital learning experience.
            </p>
          </MotionRise>
        </div>
      </section>

      {/* White Section: Contact Form & Info */}
      <section className="section-py bg-white border-b border-gray-200 flex-1">
        <div className="container-nets">
          <MotionStagger className="grid lg:grid-cols-2 gap-16 items-start">
             {/* Contact Form Card */}
             <MotionRise className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8 md:p-12 relative overflow-hidden">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                <form className="relative z-10 space-y-6">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <Label htmlFor="first_name" className="text-gray-700 text-xs font-bold uppercase tracking-wider">First Name</Label>
                         <Input id="first_name" placeholder="John" className="bg-gray-50 border-gray-200 text-gray-900 h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                         <Label htmlFor="last_name" className="text-gray-700 text-xs font-bold uppercase tracking-wider">Last Name</Label>
                         <Input id="last_name" placeholder="Doe" className="bg-gray-50 border-gray-200 text-gray-900 h-12 rounded-xl" />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 text-xs font-bold uppercase tracking-wider">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@school.com" className="bg-gray-50 border-gray-200 text-gray-900 h-12 rounded-xl" />
                   </div>

                   <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-700 text-xs font-bold uppercase tracking-wider">Subject</Label>
                      <select id="subject" className="w-full bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue/30">
                         <option>General Inquiry</option>
                         <option>School Onboarding</option>
                         <option>Pricing &amp; Plans</option>
                         <option>Technical Support</option>
                         <option>Partnership</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700 text-xs font-bold uppercase tracking-wider">Message</Label>
                      <textarea 
                         id="message" 
                         rows={5}
                         placeholder="How can we help you?"
                         className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue/30 resize-none"
                      />
                   </div>

                   <Button className="w-full bg-green hover:bg-[#E5A800] text-navy font-black h-14 rounded-xl shadow-md group">
                      Send Message <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </Button>
                </form>
             </MotionRise>

             {/* Info & Details */}
             <MotionRise delay={0.12} className="space-y-10">
                <div className="grid sm:grid-cols-2 gap-6">
                   <div className="p-6 rounded-2xl bg-light border border-gray-200 space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue">
                         <Mail className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Email Us</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                         Support: support@resultspro.ng<br />
                         Inquiries: hello@resultspro.ng
                      </p>
                   </div>
                   <div className="p-6 rounded-2xl bg-light border border-gray-200 space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                         <Phone className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Call Us</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                         Mon-Fri from 8am to 5pm.<br />
                         +234 (0) 800 CLASSROOMPRO
                      </p>
                   </div>
                   <div className="p-6 rounded-2xl bg-light border border-gray-200 space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                         <MapPin className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Office</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                         Victoria Island,<br />
                         Lagos, Nigeria.
                      </p>
                   </div>
                   <div className="p-6 rounded-2xl bg-light border border-gray-200 space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                         <Globe className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Socials</h3>
                      <div className="flex gap-3">
                         <button className="p-2.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-navy hover:border-navy transition-all">
                            <Twitter className="w-5 h-5" />
                         </button>
                         <button className="p-2.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-navy hover:border-navy transition-all">
                            <Instagram className="w-5 h-5" />
                         </button>
                         <button className="p-2.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-navy hover:border-navy transition-all">
                            <Facebook className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                </div>

                <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                   <div className="h-48 w-full relative">
                      <img src="/photo09.jpeg" alt="ClassroomPRO School Community" className="w-full h-full object-cover" />
                   </div>
                   <div className="p-8">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Are you a school administrator?</h4>
                      <p className="text-sm text-gray-600 leading-relaxed mb-6">
                         Schedule a personalized walkthrough to see how ClassroomPRO can transform your school&apos;s curriculum management.
                      </p>
                      <Button className="bg-[#0D1060] hover:bg-[#1A1FA8] text-white h-11 px-8 rounded-xl font-bold">
                         Book a Demo
                      </Button>
                   </div>
                </div>
             </MotionRise>
          </MotionStagger>
        </div>
      </section>

      <Footer />
    </main>
  );
}
