"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconSearch as Search, IconBook as BookOpen, IconHelpCircle as HelpCircle, IconShieldCheck as ShieldCheck, IconBolt as Zap, IconUsers as Users, IconChevronRight as ChevronRight, IconMessageSquare as MessageSquare, IconLifeBuoy as LifeBuoy } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  { icon: <Users className="w-6 h-6 text-blue" />, title: "Getting Started", count: "12 articles", desc: "Learn the basics of setting up your account." },
  { icon: <BookOpen className="w-6 h-6 text-green" />, title: "Using ClassroomPRO", count: "24 articles", desc: "Guides on notes, quizzes and flashcards." },
  { icon: <ShieldCheck className="w-6 h-6 text-purple-400" />, title: "Account & Security", count: "8 articles", desc: "Manage your privacy and data settings." },
  { icon: <Zap className="w-6 h-6 text-amber" />, title: "Billing & Plans", count: "10 articles", desc: "Information about subscriptions and pricing." },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Hero Section */}
          <div className="bg-white/5 border border-white/10 rounded-[48px] p-8 md:p-20 relative overflow-hidden text-center space-y-8">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-blue/5 blur-[120px] rounded-full -mt-48" />
             
             <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue/10 border border-blue/20 text-blue text-xs font-black uppercase tracking-widest mb-4">
                   <LifeBuoy className="w-4 h-4" /> Help Center
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white font-display tracking-tight">
                   Knowledge <span className="text-blue">Base</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                   Everything you need to know about using ClassroomPRO. Search our articles or browse by category.
                </p>
             </div>

             <div className="relative z-10 max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <Input 
                   placeholder="Search for help..." 
                   className="pl-12 h-16 bg-navy/80 border-white/20 text-white rounded-2xl shadow-2xl focus-visible:ring-blue/50 text-lg"
                />
             </div>
          </div>

          {/* Categories */}
          <div className="space-y-8">
             <h2 className="text-2xl font-bold text-white font-display px-4">Browse by Category</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat, i) => (
                   <div key={i} className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-blue/30 transition-all group cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                         {cat.icon}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{cat.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-6">{cat.desc}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                         <span className="text-[10px] font-bold text-blue uppercase tracking-widest">{cat.count}</span>
                         <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-blue transition-colors" />
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Popular Articles */}
          <div className="grid lg:grid-cols-2 gap-12">
             <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white font-display px-4">Popular Articles</h2>
                <div className="space-y-4">
                   {[
                      "How to link your child's account",
                      "Creating your first class quiz",
                      "Understanding mastery percentages",
                      "Downloading notes for offline study",
                      "Managing school-wide subscriptions"
                   ].map((article, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all flex items-center justify-between group cursor-pointer">
                         <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{article}</span>
                         <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                      </div>
                   ))}
                </div>
             </div>

             <div className="bg-gradient-to-br from-green/20 to-blue/20 border border-white/10 rounded-[48px] p-12 flex flex-col justify-center text-center space-y-8">
                <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mx-auto text-white">
                   <MessageSquare className="w-10 h-10" />
                </div>
                <div className="space-y-4">
                   <h3 className="text-3xl font-black text-white font-display tracking-tight">Need direct support?</h3>
                   <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                      Our support team is available Monday to Friday, 8am - 5pm GMT to help you with any issues.
                   </p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                   <Button className="bg-white text-navy font-black h-12 px-8 rounded-xl shadow-xl hover:bg-white/90">
                      Chat with Us
                   </Button>
                   <Button variant="outline" className="border-white/20 text-white h-12 px-8 rounded-xl hover:bg-white/10">
                      Submit a Ticket
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
