"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { IconPlus as Plus, IconMinus as Minus, IconSearch as Search, IconHelpCircle as HelpCircle, IconLoader2 as Loader2 } from '@tabler/icons-react';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get("/public/faq");
        setFaqs(res.data || []);
      } catch (err) {
        console.error("Failed to fetch FAQs, using fallbacks.");
        setFaqs([
          {
            category: "General",
            questions: [
              { q: "What is TutorsPro?", a: "TutorsPro is an online learning platform connecting students with verified expert tutors." },
              { q: "How much does it cost?", a: "Prices vary by tutor, but typically start at ₦5,000 per hour." }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  const allQuestions = faqs.flatMap(f => f.questions.map((q: any) => ({ ...q, category: f.category })));
  const filteredFaqs = allQuestions.filter(f => 
    f.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-light flex flex-col" style={{ background: 'var(--color-nets-light)' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 text-center bg-navy text-white" style={{ background: 'var(--color-nets-navy-dark)' }}>
         <div className="max-w-3xl mx-auto space-y-6 relative z-10">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] backdrop-blur-sm">
              <HelpCircle className="w-3 h-3" />
              Help Center
           </div>
           <h1 className="text-5xl md:text-6xl font-display font-black text-white">
             Frequently Asked <span className="text-blue-400">Questions</span>
           </h1>
           <p className="text-white/70 text-lg">
             Everything you need to know about the TutorsPro platform.
           </p>
           
           <div className="relative max-w-xl mx-auto pt-8">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search for an answer..."
                className="w-full bg-light border border-nets-border rounded-2xl py-4 pl-14 pr-6 text-navy focus:outline-none focus:ring-2 focus:ring-blue/50 transition-all placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
         </div>
      </section>

      <main className="flex-1 py-16 bg-light">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          {searchTerm ? (
             <div className="space-y-4">
               {filteredFaqs.map((faq, i) => (
                 <div key={i} className="rounded-2xl bg-white border border-nets-border shadow-sm overflow-hidden">
                   <button 
                     onClick={() => setOpenIndex(openIndex === i ? null : i)}
                     className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                   >
                     <span className="font-bold text-navy pr-8">{faq.q}</span>
                     {openIndex === i ? <Minus className="w-5 h-5 text-blue-600 shrink-0" /> : <Plus className="w-5 h-5 text-gray-400 shrink-0" />}
                   </button>
                   {openIndex === i && (
                     <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-nets-border pt-4">
                       {faq.a}
                     </div>
                   )}
                 </div>
               ))}
             </div>
          ) : (
            faqs.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-6">
                <h2 className="text-xl font-display font-black text-navy flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-600 rounded-full" />
                  {cat.category}
                </h2>
                <div className="space-y-4">
                  {cat.questions.map((faq: any, i: number) => {
                    const globalIdx = catIdx * 100 + i;
                    return (
                      <div key={i} className="rounded-2xl bg-white border border-nets-border shadow-sm overflow-hidden">
                        <button 
                          onClick={() => setOpenIndex(openIndex === globalIdx ? null : globalIdx)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-bold text-navy pr-8">{faq.q}</span>
                          {openIndex === globalIdx ? <Minus className="w-5 h-5 text-blue-600 shrink-0" /> : <Plus className="w-5 h-5 text-gray-400 shrink-0" />}
                        </button>
                        {openIndex === globalIdx && (
                          <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-nets-border pt-4">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
