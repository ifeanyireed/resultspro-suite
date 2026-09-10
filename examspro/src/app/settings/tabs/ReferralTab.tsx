import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { IconGift, IconCopy, IconShare2, IconCircleCheck, IconMessage, IconBrandTwitter, IconUsers, IconCoins } from '@tabler/icons-react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ReferralTab() {
  const { user } = useAuthStore();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [withdrawn, setWithdrawn] = useState(0);
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
        if (refData.totalWithdrawn !== undefined) setWithdrawn(refData.totalWithdrawn);
        
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
  const totalFiatEarned = isArray ? referrals.reduce((acc, curr) => acc + (curr.fiatAwarded || 0), 0) : 0;
  const availableBalance = Math.max(0, totalFiatEarned - withdrawn);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Wallet Section */}
      <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Referral Wallet</h3>
          <p className="text-sm text-gray-500">Earn cash when your friends purchase a plan.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Available Balance</div>
            <div className="text-3xl font-black text-green-600">₦{availableBalance.toLocaleString()}</div>
          </div>
          <Button 
            disabled={availableBalance <= 0}
            onClick={async () => {
              const bankName = prompt("Enter your Bank Name:");
              if (!bankName) return;
              const accountNumber = prompt("Enter your Account Number:");
              if (!accountNumber) return;
              const accountName = prompt("Enter your Account Name:");
              if (!accountName) return;

              try {
                const res = await api.post('/payment/payout', { bankName, accountNumber, accountName });
                toast.success(res.data.message || "Payout requested successfully!");
                setWithdrawn(prev => prev + availableBalance);
              } catch (err: any) {
                toast.error(err.response?.data?.error || "Failed to request payout");
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 shadow-sm"
          >
            Request Payout
          </Button>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[24px] border border-gray-100 shadow-sm relative overflow-hidden">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#146ef5]/10 text-[#146ef5] flex items-center justify-center">
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
              className={`p-2 rounded-lg transition-colors shrink-0 ${copying ? 'bg-[#146ef5]/10 text-[#146ef5]' : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200'}`}
            >
              {copying ? <IconCircleCheck className="w-4 h-4" /> : <IconCopy className="w-4 h-4" />}
            </button>
          </div>
          <Button 
            onClick={handleShare}
            className="py-6 px-8 rounded-xl bg-[#146ef5] hover:bg-[#105bd1] text-white font-bold flex items-center gap-2 shadow-sm"
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
            <IconUsers className="w-8 h-8 text-[#146ef5] mb-2 opacity-80" />
            <div className="text-2xl font-black text-slate-900">{isArray ? referrals.length : 0}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Invites</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
            <IconCircleCheck className="w-8 h-8 text-[#146ef5] mb-2 opacity-80" />
            <div className="text-2xl font-black text-slate-900">{convertedCount}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Converted</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
            <IconCoins className="w-8 h-8 text-[#146ef5] mb-2 opacity-80" />
            <div className="text-2xl font-black text-amber-600">{totalEarned}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Coins Earned</div>
          </div>
        </div>
      </div>

      

      <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Referral History</h3>
        
        {loading ? (
          <div className="py-10 text-center text-sm text-gray-500">Loading history...</div>
        ) : !isArray || referrals.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <IconUsers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">No referrals yet. Share your link to start earning!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Referee</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Coins Awarded</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {referrals.map((ref: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {ref.referee?.fullName || ref.referee?.email || 'Unknown User'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ref.status === 'converted' ? 'bg-emerald-100 text-emerald-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {ref.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">
                      {ref.coinsAwarded > 0 ? `+${ref.coinsAwarded}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(ref.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
