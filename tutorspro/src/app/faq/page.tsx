"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
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
        console.error("Failed to fetch FAQs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </div>
    );
  }

  const allQuestions = faqs.flatMap(f => f.questions.map(q => ({ ...q, category: f.category })));
  const filteredFaqs = allQuestions.filter(f => 
    f.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-32">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 px-6 text-center">
           <div className="max-w-3xl mx-auto space-y-6">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/10 border border-blue/20 text-[10px] font-black text-blue mb-4 uppercase tracking-[0.2em]">
                <HelpCircle className="w-3 h-3" />
                Help Center
             </div>
             <h1 className="text-5xl md:text-6xl font-display font-black text-white">
               Frequently Asked <span className="text-blue">Questions</span>
             </h1>
             <p className="text-gray-400 text-lg">
               Everything you need to know about the TutorsPro platform.
             </p>
             
             <div className="relative max-w-xl mx-auto pt-8">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search for an answer..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue/50 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
           </div>
        </section>

        <div className="max-w-3xl mx-auto px-6 space-y-12">
          {searchTerm ? (
             <div className="space-y-4">
               {filteredFaqs.map((faq, i) => (
                 <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
                   <button 
                     onClick={() => setOpenIndex(openIndex === i ? null : i)}
                     className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
                   >
                     <span className="font-bold text-white pr-8">{faq.q}</span>
                     {openIndex === i ? <Minus className="w-5 h-5 text-blue shrink-0" /> : <Plus className="w-5 h-5 text-gray-600 shrink-0" />}
                   </button>
                   {openIndex === i && (
                     <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                       {faq.a}
                     </div>
                   )}
                 </div>
               ))}
             </div>
          ) : (
            faqs.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-6">
                <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue rounded-full" />
                  {cat.category}
                </h2>
                <div className="space-y-4">
                  {cat.questions.map((faq, i) => {
                    const globalIdx = catIdx * 100 + i;
                    return (
                      <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
                        <button 
                          onClick={() => setOpenIndex(openIndex === globalIdx ? null : globalIdx)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
                        >
                          <span className="font-bold text-white pr-8">{faq.q}</span>
                          {openIndex === globalIdx ? <Minus className="w-5 h-5 text-blue shrink-0" /> : <Plus className="w-5 h-5 text-gray-600 shrink-0" />}
                        </button>
                        {openIndex === globalIdx && (
                          <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
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
