"use client";

import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IconMail as Mail, IconPhone as Phone, IconMapPin as MapPin, IconMessageSquare as MessageSquare, IconSend as Send, IconGlobe as Globe, IconTwitter as Twitter, IconInstagram as Instagram, IconFacebook as Facebook } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 border border-green/20 text-green text-xs font-black uppercase tracking-widest mb-4">
                <MessageSquare className="w-4 h-4" /> Get in Touch
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-white font-display tracking-tight leading-tight">
                Let's start a <span className="text-green">conversation</span>
             </h1>
             <p className="text-muted-foreground text-xl leading-relaxed">
                Have questions about ClassroomPRO? Our team is here to help your school transition to a better digital learning experience.
             </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
             {/* Contact Form */}
             <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                
                <form className="relative z-10 space-y-6">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <Label htmlFor="first_name" className="text-white text-xs font-bold uppercase tracking-wider">First Name</Label>
                         <Input id="first_name" placeholder="John" className="bg-navy border-white/10 text-white h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                         <Label htmlFor="last_name" className="text-white text-xs font-bold uppercase tracking-wider">Last Name</Label>
                         <Input id="last_name" placeholder="Doe" className="bg-navy border-white/10 text-white h-12 rounded-xl" />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <Label htmlFor="email" className="text-white text-xs font-bold uppercase tracking-wider">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@school.com" className="bg-navy border-white/10 text-white h-12 rounded-xl" />
                   </div>

                   <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white text-xs font-bold uppercase tracking-wider">Subject</Label>
                      <select id="subject" className="w-full bg-navy border border-white/10 rounded-xl h-12 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green/50">
                         <option>General Inquiry</option>
                         <option>School Onboarding</option>
                         <option>Pricing & Plans</option>
                         <option>Technical Support</option>
                         <option>Partnership</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <Label htmlFor="message" className="text-white text-xs font-bold uppercase tracking-wider">Message</Label>
                      <textarea 
                         id="message" 
                         rows={5}
                         placeholder="How can we help you?"
                         className="w-full bg-navy border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green/50 resize-none"
                      />
                   </div>

                   <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-black h-14 rounded-2xl shadow-xl shadow-green/20 group">
                      Send Message <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </Button>
                </form>
             </div>

             {/* Info & Details */}
             <div className="space-y-12 lg:pt-12">
                <div className="grid sm:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue/10 flex items-center justify-center text-blue">
                         <Mail className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Email Us</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                         Support: support@classroompro.com<br />
                         Inquiries: hello@classroompro.com
                      </p>
                   </div>
                   <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-green/10 flex items-center justify-center text-green">
                         <Phone className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Call Us</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                         Mon-Fri from 8am to 5pm.<br />
                         +234 (0) 800 CLASSROOMPRO
                      </p>
                   </div>
                   <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-400/10 flex items-center justify-center text-purple-400">
                         <MapPin className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Office</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                         123 Tech Hub Street, Victoria Island,<br />
                         Lagos, Nigeria.
                      </p>
                   </div>
                   <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-amber">
                         <Globe className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Socials</h3>
                      <div className="flex gap-4">
                         <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all">
                            <Twitter className="w-5 h-5" />
                         </button>
                         <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all">
                            <Instagram className="w-5 h-5" />
                         </button>
                         <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all">
                            <Facebook className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                </div>

                <div className="p-8 rounded-[32px] bg-gradient-to-br from-navy to-white/5 border border-white/10">
                   <h4 className="text-xl font-bold text-white mb-4">Are you a school administrator?</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      Schedule a demo to see how ClassroomPRO can transform your school's curriculum management.
                   </p>
                   <Button variant="outline" className="border-white/10 text-white h-11 px-8 rounded-xl hover:bg-white/5 font-bold">
                      Book a Demo
                   </Button>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
