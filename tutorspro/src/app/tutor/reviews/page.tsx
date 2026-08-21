"use client";

import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { IconStar as Star, IconMessage as MessageSquare, IconFilter as Filter, IconChevronRight as ChevronRight, IconArrowUpRight as ArrowUpRight, IconThumbsUp as ThumbsUp, IconAlertCircle as AlertCircle, IconBarChart3 as BarChart3, IconSearch as Search, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function TutorReviews() {
  const [mounted, setMounted] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/tutor/reviews');
      setReviewData(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
              Student <span className="text-green">Reviews</span>
            </h1>
            <p className="text-gray-400">Manage your reputation and track feedback from families.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search reviews..." className="w-full md:w-64 bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-green/50 transition-all" />
             </div>
             <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                <Filter className="w-5 h-5" />
             </button>
          </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-24 opacity-50">
             <Loader2 className="w-12 h-12 text-green animate-spin mb-4" />
             <p className="text-white font-bold">Loading reviews...</p>
           </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
               {/* Rating Highlights */}
               <div className="p-8 rounded-[40px] bg-gradient-to-br from-amber/20 to-transparent border border-white/10 flex flex-col items-center text-center">
                  <div className="text-6xl font-display font-black text-white mb-2">{reviewData?.rating?.toFixed(1) || '0.0'}</div>
                  <div className="flex items-center gap-1 text-amber mb-4">
                     {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={18} fill={s <= Math.round(reviewData?.rating || 0) ? "currentColor" : "none"} className={s === 5 ? "opacity-50" : ""} />
                     ))}
                  </div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Global Rating ({reviewData?.review_count || 0} Reviews)</div>
               </div>

               <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 lg:col-span-2">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Rating Breakdown</div>
                  <div className="space-y-3">
                     {[
                       { star: 5, color: 'bg-green' },
                       { star: 4, color: 'bg-blue' },
                       { star: 3, color: 'bg-amber' },
                       { star: 2, color: 'bg-orange-500' },
                       { star: 1, color: 'bg-red-500' },
                     ].map((r, i) => {
                       const count = reviewData?.breakdown?.[r.star] || 0;
                       const total = reviewData?.review_count || 1;
                       return (
                         <div key={i} className="flex items-center gap-4">
                            <div className="text-[10px] font-black text-white w-4">{r.star}★</div>
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                               <div className={`h-full ${r.color} rounded-full`} style={{ width: `${(count / total) * 100}%` }} />
                            </div>
                            <div className="text-[10px] text-gray-600 font-bold w-6 text-right">{count}</div>
                         </div>
                       );
                     })}
                  </div>
               </div>

               <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 flex flex-col justify-center text-center">
                  <div className="text-3xl font-display font-black text-green mb-1">
                     {reviewData?.rating && reviewData?.rating >= 4.0 ? '98%' : '75%'}
                  </div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Recommendation Rate</div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               {/* Review Feed */}
               <div className="lg:col-span-2 space-y-6">
                  {reviewData?.reviews?.map((review: any) => (
                     <div key={review.id} className="p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group">
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white font-bold text-lg">
                                 {review.student?.[0] || 'S'}
                              </div>
                              <div>
                                 <h4 className="font-bold text-white mb-0.5">{review.student}</h4>
                                 <p className="text-[10px] text-gray-600 font-bold uppercase">Parent: {review.parent}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="flex items-center gap-1 text-amber font-bold mb-1">
                                 <Star size={14} fill="currentColor" /> {review.rating}
                              </div>
                              <div className="text-[10px] text-gray-700 font-black uppercase">{review.date}</div>
                           </div>
                        </div>

                        <p className="text-sm text-gray-400 leading-relaxed mb-6 italic">"{review.comment}"</p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                           {review.tags?.map((tag: string) => (
                             <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-black text-gray-500 uppercase tracking-widest">{tag}</span>
                           ))}
                        </div>

                        <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                           <button className="text-[10px] font-black text-blue uppercase tracking-widest hover:underline">Reply to Review</button>
                           <button className="text-[10px] font-black text-gray-700 uppercase tracking-widest hover:text-red-400 transition-colors">Flag Dispute</button>
                        </div>
                     </div>
                  ))}
                  {!reviewData?.reviews?.length && (
                    <div className="p-10 text-center rounded-[40px] border-2 border-dashed border-white/10 opacity-60">
                       <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                       <p className="text-white font-bold">No reviews yet</p>
                       <p className="text-sm text-gray-400">Complete more sessions to receive feedback.</p>
                    </div>
                  )}
               </div>

               {/* Sidebar */}
               <div className="space-y-8">
                  <section className="p-8 rounded-[40px] bg-white/5 border border-white/10">
                     <div className="w-12 h-12 rounded-2xl bg-green/10 text-green flex items-center justify-center mb-6">
                        <ThumbsUp size={24} />
                     </div>
                     <h3 className="text-xl font-display font-bold text-white mb-4">Reputation Score</h3>
                     <p className="text-sm text-gray-500 leading-relaxed mb-8">
                        Your reputation score is calculated from recent ratings, lesson completion, and response times.
                     </p>
                     <div className="p-4 rounded-2xl bg-navy border border-white/5 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Global Rank</span>
                        <span className="text-sm font-black text-white">#12 in Mathematics</span>
                     </div>
                  </section>

                  <section className="p-8 rounded-[40px] bg-gradient-to-br from-blue/20 to-transparent border border-white/10">
                     <div className="flex items-center gap-3 text-blue font-bold mb-4 uppercase tracking-widest text-[10px]">
                        <AlertCircle size={16} /> Privacy Policy
                     </div>
                     <p className="text-xs text-gray-500 leading-relaxed">
                        Student names are partially masked in public profiles to protect student privacy while maintaining tutor transparency.
                     </p>
                  </section>
               </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
