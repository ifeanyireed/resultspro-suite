"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { IconUsers as Users, IconGift as Gift, IconCopy as Copy, IconShare2 as Share2, IconCoins as Coins, IconChevronRight as ChevronRight, IconTrendingUp as TrendingUp, IconMessage as MessageSquare, IconBrandTwitter as Twitter, IconLoader2 as Loader2, IconCircleCheck as CheckCircle2, IconAlertCircle as AlertCircle, IconLock as Lock } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ReferralPage() {
  const { user } = useAuthStore();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReferrals();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchReferrals = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/user/referrals');
      let refData = res.data;
      if (!Array.isArray(refData)) {
        if (refData && Array.isArray(refData.referrals)) refData = refData.referrals;
        else if (refData && Array.isArray(refData.data)) refData = refData.data;
        else refData = [];
      }
      setReferrals(refData);
    } catch (err) {
      toast.error("Failed to load referrals");
    } finally {
      setLoading(false);
    }
  };

  const [origin, setOrigin] = useState('https://exams.resultspro.ng');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const referralCode = user?.referralCode || '...';
  const referralLink = `${origin}/signup?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopying(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopying(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join ResultPRO Exams',
          text: `Join me on ResultPRO and get 50 bonus coins to start your exam practice! Use my code: ${referralCode}`,
          url: referralLink,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Hey! Join me on ResultPRO Exams and get 50 bonus coins for exam practice. Click here: ${referralLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`I'm using ResultPRO to crush my exams! Sign up with my link to get 50 bonus coins: ${referralLink} #JAMB #WAEC #ResultPRO`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const isArray = Array.isArray(referrals);
  const convertedCount = isArray ? referrals.filter(r => r.status === 'converted').length : 0;
  const totalEarned = isArray ? referrals.reduce((acc, curr) => acc + (curr.coinsAwarded || 0), 0) : 0;
  const conversionRate = isArray && referrals.length > 0 ? Math.round((convertedCount / referrals.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-green text-white font-bold text-[10px] uppercase tracking-widest">Refer & Earn</span>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Invite Friends</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-slate-900 mb-2">
              Give 50, Get 50
            </h1>
            <p className="text-slate-600 max-w-xl text-lg leading-relaxed">
              Invite your friends to ResultPRO. They get <span className="text-slate-900 font-bold">50</span> bonus coins on signup, and you earn <span className="text-slate-900 font-bold">50</span> coins once they complete 5 quizzes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Referral Card */}
          <div className="lg:col-span-2 space-y-8">
            {user ? (
              <div className="p-8 md:p-12 rounded-[40px] bg-white border border-slate-200 shadow-sm backdrop-blur-xl backdrop-saturate-[1.2] shadow-md  relative overflow-hidden group">
                <div className="absolute inset-0 bg-green/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <h3 className="text-xl font-display font-bold text-slate-900 mb-8">Your Unique Referral Link</h3>
                
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                  <div className="flex-1 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 font-mono text-sm flex items-center justify-between group/link">
                    <span className="truncate">{referralLink}</span>
                    <button 
                      onClick={copyToClipboard}
                      className={`p-2 rounded-lg transition-colors ${copying ? 'bg-green text-navy' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                    >
                      {copying ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button 
                    onClick={handleShare}
                    className="py-8 px-10 rounded-2xl bg-green text-navy hover:bg-green/90 font-black text-lg flex items-center gap-2 shadow-xl shadow-green/20"
                  >
                    <Share2 className="w-5 h-5" />
                    SHARE NOW
                  </Button>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={shareOnWhatsApp}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 font-bold text-sm hover:bg-[#25D366]/20 transition-all"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    WhatsApp
                  </button>
                  <button 
                    onClick={shareOnTwitter}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 font-bold text-sm hover:bg-[#1DA1F2]/20 transition-all"
                  >
                    <Twitter className="w-4 h-4 fill-current" />
                    Twitter
                  </button>
                </div>
              </div>
            ) : (
                <div className="p-8 md:p-12 rounded-[40px] bg-white border border-blue/10 backdrop-blur-xl backdrop-saturate-[1.2] shadow-md  text-center flex flex-col items-center justify-center gap-6 min-h-[300px]">
                    <div className="w-16 h-16 rounded-3xl bg-blue/10 flex items-center justify-center text-blue">
                        <Lock className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Login to Get Your Link</h3>
                        <p className="text-sm text-slate-500 max-w-sm mx-auto">You need an account to generate a unique referral link and start earning coins.</p>
                    </div>
                    <Button onClick={() => window.location.href = '/login?redirect=/referral'} className="bg-blue-500 hover:bg-blue-600 text-slate-900 font-bold px-10 py-6 rounded-2xl">
                        JOIN RESULTPRO NOW
                    </Button>
                </div>
            )}

            {/* How it works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: 1, title: "Invite Friends", desc: "Share your link via WhatsApp, SMS or Social Media." },
                { step: 2, title: "They Register", desc: "Your friend signs up and gets 50 coins instantly." },
                { step: 3, title: "They Qualify", desc: "Once they finish 5 quizzes, you get your 50 coins reward!" },
              ].map((s, i) => (
                <div key={i} className="p-8 rounded-[32px] bg-white border border-slate-200 shadow-sm relative group hover:border-blue/30 transition-all">
                  <div className="text-4xl font-display font-black text-slate-900/5 absolute top-4 right-6 leading-none group-hover:text-blue-100 transition-colors">0{s.step}</div>
                  <h4 className="font-bold text-slate-900 mb-2">{s.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            {user ? (
                <div className="p-8 rounded-[40px] bg-white border border-slate-200 shadow-sm backdrop-blur-xl backdrop-saturate-[1.2] shadow-md ">
                <h3 className="text-xl font-display font-bold text-slate-900 mb-8">Performance</h3>
                <div className="space-y-8">
                    {[
                    { label: "Total Invited", value: isArray ? referrals.length : 0, icon: Users, color: "blue" },
                    { label: "Coins Earned", value: totalEarned, icon: Coins, color: "amber" },
                    { label: "Conversion", value: `${conversionRate}%`, icon: TrendingUp, color: "green" },
                    ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center ${
                            stat.color === 'blue' ? 'text-blue-400' : 
                            stat.color === 'amber' ? 'text-amber-400' : 'text-green'
                        }`}>
                        <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                        <div className="text-2xl font-display font-black text-slate-900 leading-none mt-1">{stat.value}</div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            ) : (
                <div className="p-8 rounded-[40px] bg-white border border-slate-200 shadow-sm backdrop-blur-xl backdrop-saturate-[1.2] shadow-md  opacity-50 grayscale select-none pointer-events-none">
                    <h3 className="text-xl font-display font-bold text-slate-900 mb-8">Performance</h3>
                    <div className="space-y-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                <div className="w-6 h-6 bg-slate-200 rounded-full animate-pulse" />
                            </div>
                            <div>
                            <div className="h-2 w-16 bg-slate-200 rounded mb-2" />
                            <div className="h-6 w-8 bg-slate-200 rounded" />
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-8 rounded-[40px] bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
               <div className="flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-amber shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">Qualification Rule</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      To prevent spam, rewards are released only after your friends complete at least 5 study sessions.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Recent Referrals List */}
        <div className="mt-16">
          <h3 className="text-xl font-display font-bold text-slate-900 mb-8">Referral History</h3>
          
          {!user ? (
            <div className="p-12 rounded-[40px] bg-white border border-slate-200 shadow-sm text-center">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h4 className="text-slate-900 font-bold">Login to view your referrals</h4>
              <p className="text-slate-500 text-sm mt-1 mb-6">You need to be logged in to see your referral history and earnings.</p>
              <Button onClick={() => window.location.href = '/login'} className="bg-green text-navy hover:bg-green/90 font-bold px-8">
                Login / Sign Up
              </Button>
            </div>
          ) : loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-green animate-spin mb-4" />
              <p className="text-slate-500 font-bold">Loading your referrals...</p>
            </div>
          ) : !isArray || referrals.length === 0 ? (
            <div className="p-12 rounded-[40px] bg-white border border-slate-200 shadow-sm text-center">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h4 className="text-slate-900 font-bold">No referrals yet</h4>
              <p className="text-slate-500 text-sm mt-1">Start sharing your link to earn bonus coins!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((ref, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between group hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200  flex items-center justify-center text-slate-600 font-black">
                      {(ref.referee?.name || ref.referee?.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{ref.referee?.name || 'New Student'}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Joined {new Date(ref.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden md:block">
                       <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Status</div>
                       <div className={`text-xs font-black uppercase tracking-widest ${ref.status === 'converted' ? 'text-green' : 'text-amber'}`}>
                        {ref.status}
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Reward</div>
                      <div className={`text-lg font-display font-black ${ref.coinsAwarded > 0 ? 'text-green' : 'text-slate-400'}`}>
                        {ref.coinsAwarded > 0 ? `+${ref.coinsAwarded}` : '0'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
