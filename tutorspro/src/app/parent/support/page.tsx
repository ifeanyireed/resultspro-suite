"use client";

import api from '@/lib/api';
import { IconHelpCircle as HelpCircle, IconSearch as Search, IconMessageCircle as MessageCircle, IconFileText as FileText, IconChevronRight as ChevronRight, IconMail as Mail, IconMessage as MessageSquare, IconShieldQuestion as ShieldQuestion, IconLifeBuoy as LifeBuoy, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ParentSupport() {
  const [mounted, setMounted] = useState(false);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      // Use the public FAQ endpoint
      const res = await api.get('/public/faq');
      // Extract all questions from the grouped response
      const allQuestions = res.data.flatMap((group: any) => group.questions);
      // For the support center, we just show a few top FAQs
      setFaqs(allQuestions.slice(0, 5));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-navy pb-24">
            
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/10 border border-blue/20 text-[10px] font-bold text-blue uppercase tracking-widest mb-6">
             <LifeBuoy className="w-3 h-3" /> 24/7 Support Center
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4">How can we <span className="text-blue">help you?</span></h1>
          <p className="text-gray-400 max-w-xl mx-auto">Search our knowledge base or get in touch with our family support team.</p>
          
          <div className="mt-10 relative max-w-2xl mx-auto">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
             <input type="text" placeholder="Search for articles, guides, or billing help..." className="w-full bg-white/5 border border-white/10 rounded-[32px] py-6 pl-16 pr-8 text-white focus:outline-none focus:border-blue/50 transition-all shadow-2xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
           {[
             { title: 'Billing Help', icon: FileText, color: 'text-green', bg: 'bg-green/10' },
             { title: 'Account Issues', icon: ShieldQuestion, color: 'text-amber', bg: 'bg-amber/10' },
             { title: 'Tutoring Quality', icon: MessageSquare, color: 'text-purple', bg: 'bg-purple/10' },
           ].map((item, i) => (
             <button key={i} className="p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all text-center group">
                <div className={`w-16 h-16 rounded-3xl ${item.bg} ${item.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                   <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">View Articles</div>
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           <section>
              <h2 className="text-2xl font-display font-bold text-white mb-8">Frequently Asked Questions</h2>
              {loading ? (
                <div className="flex justify-center py-10 opacity-50">
                  <Loader2 className="w-8 h-8 text-blue animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                   {faqs.map((faq, i) => (
                     <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer group">
                        <div className="flex justify-between items-center gap-4">
                           <h4 className="font-bold text-white text-sm">{faq.q}</h4>
                           <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue transition-colors" />
                        </div>
                     </div>
                   ))}
                   {faqs.length === 0 && (
                     <p className="text-gray-500 text-sm text-center py-4">No FAQs available at the moment.</p>
                   )}
                </div>
              )}
           </section>

           <section className="p-10 rounded-[40px] bg-gradient-to-br from-blue to-purple relative overflow-hidden">
              <div className="relative z-10">
                 <h2 className="text-3xl font-display font-black text-white mb-4">Still need help?</h2>
                 <p className="text-white/70 mb-10 leading-relaxed">Our support agents are available to help with billing disputes, tutor quality concerns, and technical issues.</p>
                 
                 <div className="space-y-4">
                    <button className="w-full py-4 rounded-2xl bg-white text-navy font-bold flex items-center justify-center gap-3 hover:scale-105 transition-all">
                       <MessageCircle className="w-5 h-5" /> START LIVE CHAT
                    </button>
                    <button className="w-full py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold flex items-center justify-center gap-3 hover:bg-white/20 transition-all">
                       <Mail className="w-5 h-5" /> SUBMIT A TICKET
                    </button>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </main>
  );
}
