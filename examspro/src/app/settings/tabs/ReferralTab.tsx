import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { IconGift, IconCopy, IconShare2, IconCircleCheck, IconMessage, IconBrandTwitter, IconUsers, IconCoins } from '@tabler/icons-react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ReferralTab() {
  const { user } = useAuthStore();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [origin, setOrigin] = useState('https://exams.resultspro.ng');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
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
      // Handle silently
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white p-8 md:p-12 rounded-[24px] border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <IconGift className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Refer & Earn Coins</h2>
            <p className="text-sm text-gray-500">Invite friends and get 50 coins for every successful signup.</p>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-4 mt-8">Your Unique Referral Link</h3>
        
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono text-sm flex items-center justify-between">
            <span className="truncate mr-4">{referralLink}</span>
            <button 
              onClick={copyToClipboard}
              className={`p-2 rounded-lg transition-colors shrink-0 ${copying ? 'bg-green-100 text-green-700' : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200'}`}
            >
              {copying ? <IconCircleCheck className="w-4 h-4" /> : <IconCopy className="w-4 h-4" />}
            </button>
          </div>
          <Button 
            onClick={handleShare}
            className="py-6 px-8 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-2 shadow-sm"
          >
            <IconShare2 className="w-5 h-5" />
            SHARE NOW
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={shareOnWhatsApp}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 font-bold text-sm hover:bg-[#25D366]/20 transition-all"
          >
            <IconMessage className="w-4 h-4 fill-current" />
            WhatsApp
          </button>
          <button 
            onClick={shareOnTwitter}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 font-bold text-sm hover:bg-[#1DA1F2]/20 transition-all"
          >
            <IconBrandTwitter className="w-4 h-4 fill-current" />
            Twitter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
            <IconUsers className="w-8 h-8 text-blue-500 mb-2 opacity-80" />
            <div className="text-2xl font-black text-slate-900">{isArray ? referrals.length : 0}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Invites</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
            <IconCircleCheck className="w-8 h-8 text-emerald-500 mb-2 opacity-80" />
            <div className="text-2xl font-black text-slate-900">{convertedCount}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Converted</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
            <IconCoins className="w-8 h-8 text-amber-500 mb-2 opacity-80" />
            <div className="text-2xl font-black text-amber-600">{totalEarned}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Coins Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
}
