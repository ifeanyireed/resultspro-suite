"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconHelpCircle as HelpCircle, IconSearch as Search, IconBook as Book, IconMessage as MessageSquare, IconMail as Mail, IconChevronDown as ChevronDown, IconExternalLink as ExternalLink, IconPlayCircle as PlayCircle, IconFileText as FileText } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I access my class notes?",
    answer: "You can find all your class-specific notes under the 'Class Notes' section in your sidebar. If your school has assigned you to a class, the notes for that class will automatically appear there."
  },
  {
    question: "Can I use ClassroomPRO without internet?",
    answer: "Yes! You can sync notes and quizzes for offline use. Simply click the 'Sync' or 'Download' icon on any content item. You can then access them from the 'Offline Content' section in your dashboard."
  },
  {
    question: "How do I join a school?",
    answer: "If you are a student, your school administrator will usually provide you with a unique Student ID or invite link. If you are a school owner, you can register through our 'School Onboarding' page on the landing site."
  },
  {
    question: "What happens if I fail a quiz?",
    answer: "Quizzes are for practice! You can retake most quizzes multiple times. After each attempt, you'll see detailed explanations for the correct answers to help you improve your score next time."
  }
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="flex-1 pb-12">
      <DashboardHeader title="Help & Support" />
      
      <main className="p-8 max-w-5xl mx-auto space-y-12">
        {/* Hero Search */}
        <div className="text-center space-y-6 py-8">
           <h2 className="text-4xl font-bold text-white font-display">How can we help you?</h2>
           <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                 placeholder="Search for articles, guides or tutorials..." 
                 className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-2xl shadow-2xl focus-visible:ring-green/50"
              />
           </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-blue/50 transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-blue/10 flex items-center justify-center text-blue mb-6 group-hover:scale-110 transition-transform">
                 <Book className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">User Guides</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Step-by-step instructions on how to use every feature of the platform.</p>
           </div>
           <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-green/50 transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-green/10 flex items-center justify-center text-green mb-6 group-hover:scale-110 transition-transform">
                 <PlayCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Video Tutorials</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Watch quick 2-minute videos covering onboarding, quizzes, and note-taking.</p>
           </div>
           <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-amber/50 transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-amber mb-6 group-hover:scale-110 transition-transform">
                 <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Live Chat</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Chat with our support team for immediate assistance with any issues.</p>
           </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
           <h3 className="text-2xl font-bold text-white font-display px-2">Frequently Asked Questions</h3>
           <div className="space-y-3">
              {faqs.map((faq, i) => (
                 <div key={i} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <button 
                       onClick={() => setOpenFaq(openFaq === i ? null : i)}
                       className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
                    >
                       <span className="font-bold text-white text-sm">{faq.question}</span>
                       <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300", openFaq === i && "rotate-180")} />
                    </button>
                    <div className={cn(
                       "grid transition-all duration-300 ease-in-out overflow-hidden",
                       openFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}>
                       <div className="min-h-0">
                          <p className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed">
                             {faq.answer}
                          </p>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Contact Support Footer */}
        <div className="p-10 rounded-[40px] bg-navy border border-white/10 text-center space-y-6 relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white">Still have questions?</h3>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                 Can't find the answer you're looking for? Please chat with our friendly team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                 <Button className="bg-green-600 text-white font-bold h-12 px-8 rounded-xl shadow-xl shadow-green/10">
                    <MessageSquare className="w-4 h-4 mr-2" /> Start a Chat
                 </Button>
                 <Button variant="outline" className="border-white/10 text-white h-12 px-8 rounded-xl hover:bg-white/5">
                    <Mail className="w-4 h-4 mr-2" /> Email Support
                 </Button>
              </div>
           </div>
           
           <div className="absolute top-0 right-0 w-64 h-64 bg-green/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue/5 blur-[100px] -ml-32 -mb-32 rounded-full" />
        </div>
      </main>
    </div>
  );
}
