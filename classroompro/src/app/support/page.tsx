"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconSearch as Search, IconBook as BookOpen, IconHelpCircle as HelpCircle, IconShieldCheck as ShieldCheck, IconBolt as Zap, IconUsers as Users, IconChevronRight as ChevronRight, IconMessage as MessageSquare, IconLifebuoy as LifeBuoy } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";

const categories = [
  { icon: <Users className="w-6 h-6 text-blue" />, title: "Getting Started", count: "12 articles", desc: "Learn the basics of setting up your account." },
  { icon: <BookOpen className="w-6 h-6 text-green" />, title: "Using ClassroomPRO", count: "24 articles", desc: "Guides on notes, quizzes and flashcards." },
  { icon: <ShieldCheck className="w-6 h-6 text-purple-400" />, title: "Account & Security", count: "8 articles", desc: "Manage your privacy and data settings." },
  { icon: <Zap className="w-6 h-6 text-amber" />, title: "Billing & Plans", count: "10 articles", desc: "Information about subscriptions and pricing." },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-light flex flex-col" style={{ background: "var(--color-nets-light)" }}>
      <Navbar />
      
      {/* Navy Hero Section */}
      <section
        className="bg-navy text-white relative overflow-hidden"
        style={{ background: "var(--color-nets-navy-dark)", paddingTop: "10rem", paddingBottom: "6rem", marginTop: "-72px" }}
      >
        <div aria-hidden className="absolute inset-0 z-0 opacity-20">
          <img src="/photo11.jpeg" alt="" className="w-full h-full object-cover" />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-green text-xs font-black uppercase tracking-widest">
              <LifeBuoy className="w-4 h-4" /> Help Center
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white font-display tracking-tight">
              Knowledge <span className="text-green">Base</span>
            </h1>
            <p className="text-white/75 text-lg max-w-xl mx-auto leading-relaxed">
              Everything you need to know about using ClassroomPRO. Search our articles or browse by category.
            </p>
            <div className="relative max-w-2xl mx-auto pt-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input 
                placeholder="Search for help..." 
                className="pl-12 h-16 bg-white border-gray-200 text-gray-900 rounded-2xl shadow-xl focus-visible:ring-green/50 text-lg"
              />
            </div>
          </MotionRise>
        </div>
      </section>

      {/* White Section: Categories & Articles */}
      <section className="section-py bg-white border-b border-gray-200 flex-1">
        <div className="container-nets space-y-20">
          {/* Categories */}
          <MotionRise className="space-y-8">
             <h2 className="text-2xl font-bold text-gray-900 font-display">Browse by Category</h2>
             <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat, i) => (
                   <MotionRise key={i} delay={i * 0.06} className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue/40 transition-all group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-light border border-gray-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                         {cat.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{cat.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-6">{cat.desc}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                         <span className="text-[10px] font-bold text-blue uppercase tracking-widest">{cat.count}</span>
                         <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue transition-colors" />
                      </div>
                   </MotionRise>
                ))}
             </MotionStagger>
          </MotionRise>

          {/* Popular Articles & Direct Support */}
          <MotionStagger className="grid lg:grid-cols-2 gap-12">
             <MotionRise className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 font-display">Popular Articles</h2>
                <div className="space-y-3">
                   {[
                      "How to link your child's account",
                      "Creating your first class quiz",
                      "Understanding mastery percentages",
                      "Downloading notes for offline study",
                      "Managing school-wide subscriptions"
                   ].map((article, i) => (
                      <div key={i} className="p-5 rounded-xl bg-light border border-gray-200 hover:bg-white hover:shadow-sm transition-all flex items-center justify-between group cursor-pointer">
                         <span className="text-sm font-bold text-gray-800 group-hover:text-blue transition-colors">{article}</span>
                         <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue transition-colors" />
                      </div>
                   ))}
                </div>
             </MotionRise>

             <MotionRise delay={0.1} className="bg-navy text-white rounded-3xl p-12 flex flex-col justify-center text-center space-y-6 relative overflow-hidden" style={{ background: "var(--color-nets-navy-dark)" }}>
                <div className="w-24 h-24 mx-auto">
                   <img src="/monster_meditating.png" alt="Support Mascot" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-3">
                   <h3 className="text-3xl font-black text-white font-display tracking-tight">Need direct support?</h3>
                   <p className="text-white/75 leading-relaxed max-w-sm mx-auto text-sm">
                      Our support team is available Monday to Friday, 8am - 5pm WAT to help you with any issues.
                   </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
                   <Button className="bg-green text-navy font-black h-12 px-8 rounded-xl shadow-xl hover:bg-[#E5A800]">
                      Chat with Us
                   </Button>
                   <Button variant="outline" className="border-white/20 text-white h-12 px-8 rounded-xl hover:bg-white/10">
                      Submit a Ticket
                   </Button>
                </div>
             </MotionRise>
          </MotionStagger>
        </div>
      </section>

      <Footer />
    </main>
  );
}
