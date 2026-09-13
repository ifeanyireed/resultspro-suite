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
         <Loader2 className="w-12 h-12 text-navy animate-spin" />
      </div>
    );
  }

  const allQuestions = faqs.flatMap(f => f.questions.map((q: any) => ({ ...q, category: f.category })));
  const filteredFaqs = allQuestions.filter(f => 
    f.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-navy text-white text-center" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '6rem' }}>
        <div className="container-nets">
          <div className="max-w-3xl mx-auto">
            <div className="overline-dark" style={{ marginBottom: '1.5rem' }}>Help Center</div>
            <h1 className="fw-300" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Frequently Asked <br /><span style={{ fontWeight: 700, color: 'var(--primary)' }}>Questions.</span>
            </h1>
            <p className="text-body-lg text-white/70">
              Everything you need to know about the TutorsPro platform.
            </p>
            
            <div className="relative max-w-xl mx-auto pt-8">
               <Search className="absolute left-6 top-[65%] -translate-y-1/2 w-5 h-5 text-navy" />
               <input 
                 type="text" 
                 placeholder="Search for an answer..."
                 className="w-full bg-white border-none rounded-sm py-4 pl-14 pr-6 text-navy focus:outline-none placeholder:text-muted"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
          </div>
        </div>
      </section>

      <section className="section-py bg-white border-b border-gray-200">
        <div className="container-nets max-w-3xl mx-auto">
          {searchTerm ? (
             <div className="space-y-4">
               {filteredFaqs.map((faq, i) => (
                 <div key={i} className="rounded-sm bg-light border border-gray-200 overflow-hidden">
                   <button 
                     onClick={() => setOpenIndex(openIndex === i ? null : i)}
                     className="w-full flex items-center justify-between p-6 text-left hover:bg-white transition-colors"
                   >
                     <span className="fw-600 text-navy pr-8">{faq.q}</span>
                     {openIndex === i ? <Minus size={20} style={{ color: 'var(--primary)' }} /> : <Plus size={20} className="text-muted" />}
                   </button>
                   {openIndex === i && (
                     <div className="px-6 pb-6 text-muted text-sm leading-relaxed border-t border-gray-200 pt-4 bg-white">
                       {faq.a}
                     </div>
                   )}
                 </div>
               ))}
             </div>
          ) : (
            faqs.map((cat, catIdx) => (
              <div key={catIdx} className="mb-12">
                <h2 className="text-2xl fw-700 text-navy mb-6 flex items-center gap-3">
                  {cat.category}
                </h2>
                <div className="space-y-4">
                  {cat.questions.map((faq: any, i: number) => {
                    const globalIdx = catIdx * 100 + i;
                    return (
                      <div key={i} className="rounded-sm bg-white border border-gray-200 overflow-hidden shadow-sm">
                        <button 
                          onClick={() => setOpenIndex(openIndex === globalIdx ? null : globalIdx)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-light transition-colors"
                        >
                          <span className="fw-600 text-navy pr-8">{faq.q}</span>
                          {openIndex === globalIdx ? <Minus size={20} style={{ color: 'var(--primary)' }} /> : <Plus size={20} className="text-muted" />}
                        </button>
                        {openIndex === globalIdx && (
                          <div className="px-6 pb-6 text-muted text-sm leading-relaxed border-t border-gray-200 pt-4">
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
      </section>

      <Footer />
    </main>
  );
}
