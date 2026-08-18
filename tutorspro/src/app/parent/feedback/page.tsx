"use client";

import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  AlertCircle, 
  ChevronRight,
  User,
  CheckCircle2,
  Filter,
  Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ParentFeedback() {
  const [mounted, setMounted] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [recentRatings, setRecentRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      const res = await api.get('/parent/feedback');
      setPendingReviews(res.data.pending);
      setRecentRatings(res.data.recent);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load feedback data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (pending: any) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/parent/feedback', {
        booking_id: pending.id,
        tutor_id: pending.tutor_id,
        rating: rating,
        comment: comment
      });
      toast.success('Feedback submitted successfully!');
      setRating(0);
      setComment('');
      fetchFeedbackData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
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
              Tutor <span className="text-blue">Feedback</span>
            </h1>
            <p className="text-gray-400">Rate sessions and help us maintain high teaching standards.</p>
          </div>
          <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all">
             <Filter className="w-4 h-4" /> Filter Tutors
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-50">
            <Loader2 className="w-12 h-12 text-blue animate-spin mb-4" />
            <p className="text-white font-bold">Loading feedback data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Feedback Form / List (Left) */}
            <div className="lg:col-span-2 space-y-12">
               <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-8">Pending Reviews</h2>
                  
                  {pendingReviews.length > 0 ? (
                    <div className="p-10 rounded-[40px] bg-gradient-to-br from-blue/10 to-transparent border border-white/10 relative overflow-hidden">
                       <div className="relative z-10">
                          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                             <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-blue/20 flex items-center justify-center text-blue text-2xl font-black shadow-lg">
                                  {pendingReviews[0].tutor[0]}
                                </div>
                                <div>
                                   <h3 className="text-xl font-bold text-white">{pendingReviews[0].tutor}</h3>
                                   <p className="text-sm text-gray-500">{pendingReviews[0].subject} • Session on {pendingReviews[0].date}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                   <button 
                                     key={s} 
                                     onMouseEnter={() => setRating(s)}
                                     onClick={() => setRating(s)}
                                     className={`p-1 transition-all ${rating >= s ? 'text-amber scale-110' : 'text-gray-700'}`}
                                   >
                                      <Star className={`w-8 h-8 ${rating >= s ? 'fill-current' : ''}`} />
                                   </button>
                                ))}
                             </div>
                          </div>

                          <div className="space-y-4">
                             <textarea 
                               rows={4} 
                               value={comment}
                               onChange={(e) => setComment(e.target.value)}
                               placeholder="How was the session? Did your child find it helpful? (Optional)"
                               className="w-full bg-navy border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:border-blue/50 transition-all resize-none"
                             ></textarea>
                             <div className="flex flex-wrap gap-3">
                                {['Clear Explanation', 'Patient', 'Engaging', 'punctual'].map(tag => (
                                   <button 
                                     key={tag} 
                                     onClick={() => setComment(prev => prev + (prev ? ', ' : '') + tag)}
                                     className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:border-blue hover:text-blue transition-all"
                                   >
                                      {tag}
                                   </button>
                                ))}
                             </div>
                             <button 
                               onClick={() => handleSubmitFeedback(pendingReviews[0])}
                               disabled={submitting}
                               className="w-full mt-4 py-4 rounded-2xl bg-blue text-white font-bold flex items-center justify-center gap-2 hover:bg-blue/90 transition-all shadow-xl shadow-blue/20 disabled:opacity-50"
                             >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                  <>
                                    SUBMIT FEEDBACK
                                    <CheckCircle2 className="w-5 h-5" />
                                  </>
                                )}
                             </button>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="p-10 rounded-[40px] border-2 border-dashed border-white/10 text-center opacity-50">
                       <p className="text-white font-bold">No pending reviews. Great job!</p>
                    </div>
                  )}
               </section>

               <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-8">Recent Ratings</h2>
                  <div className="space-y-4">
                     {recentRatings.map((review) => (
                       <div key={review.id} className="p-8 rounded-[40px] bg-white/5 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                          <div className="flex gap-6 items-center">
                             <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white font-bold text-xl">{review.tutor[0]}</div>
                             <div>
                                <div className="font-bold text-white">{review.tutor}</div>
                                <div className="text-xs text-gray-500">{review.subject} • Rated on {review.date}</div>
                             </div>
                          </div>
                          <div className="flex items-center gap-8">
                             <div className="text-right">
                                <div className="flex items-center gap-1 text-amber font-bold mb-1">
                                   <Star className="w-4 h-4 fill-current" /> {review.rating}
                                </div>
                                <div className="text-[10px] text-gray-400 max-w-[200px] truncate">{review.comment}</div>
                             </div>
                             <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                                <MessageSquare className="w-5 h-5" />
                             </button>
                          </div>
                       </div>
                     ))}
                     {recentRatings.length === 0 && (
                       <div className="text-center py-10 opacity-30">
                          <p className="text-white italic">No recent ratings yet.</p>
                       </div>
                     )}
                  </div>
               </section>
            </div>

          {/* Sidebar (Right) - Quality Standards */}
          <div className="space-y-8">
             <section className="p-8 rounded-[40px] bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-green/10 text-green flex items-center justify-center mb-6">
                   <ThumbsUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-4">Why we ask?</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                   Your feedback directly impacts tutor rankings and helps us ensure every child gets the best possible learning experience.
                </p>
                <div className="space-y-4">
                   {[
                     'Monitors teaching quality',
                     'Rewards exceptional tutors',
                     'Identifies areas for improvement',
                     'Ensures curriculum alignment'
                   ].map((item, i) => (
                     <div key={i} className="flex gap-3 text-xs text-gray-400 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-green mt-1.5 shrink-0" />
                        {item}
                     </div>
                   ))}
                </div>
             </section>

             <section className="p-8 rounded-[40px] bg-red-400/5 border border-red-400/10">
                <div className="flex items-center gap-3 text-red-400 font-bold mb-4">
                   <AlertCircle className="w-5 h-5" /> Report a Concern
                </div>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                   If you have a serious concern regarding a tutor's conduct or quality, please report it immediately.
                </p>
                <button className="w-full py-3 rounded-xl border border-red-400/20 text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-400/10 transition-all">
                   CONTACT SUPPORT
                </button>
             </section>
          </div>
        </div>
      </div>
    </main>
  );
}
