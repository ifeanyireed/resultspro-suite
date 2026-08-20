"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { IconCoins as Coins, IconArrowsRightLeft as ArrowRightLeft, IconCash as Banknote, IconHistory as History, IconAlertCircle as AlertCircle, IconCircleCheck as CheckCircle2, IconBuilding as Building2, IconUser as User, IconHash as Hash } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function PayoutPage() {
  const { user, fetchUser } = useAuthStore();
  const [coins, setCoins] = useState<number>(10000);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get('/payment/withdrawals');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch withdrawals');
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post('/payment/withdrawal', {
        coins,
        bankName,
        accountNumber,
        accountName
      });
      setMessage({ type: 'success', text: res.data.message });
      fetchUser(); // Refresh balance
      fetchWithdrawals(); // Refresh history
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to process withdrawal' });
    } finally {
      setLoading(false);
    }
  };

  if (!user && !loading) {
    return (
      <main className="min-h-screen bg-navy pb-24">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-24 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/[0.1] border-t-white/[0.15]">
            <Banknote className="w-10 h-10 text-gray-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-6">
            Cash Out Your Wins
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
            Log in to convert your coins to real cash, view your withdrawal history, and manage your payment settings.
          </p>
          <Link href="/login?redirect=/payout">
            <Button className="bg-green text-navy hover:bg-green/90 rounded-xl px-12 py-6 text-lg font-bold">
              Sign In to Continue
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const amountNgn = coins * 2;
  const canWithdraw = (user?.coinBalance || 0) >= coins && coins >= 10000;

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4">
              CASH <span className="text-green">OUT</span>
            </h1>
            <p className="text-gray-400 max-w-md">
              Convert your hard-earned coins back to cash. 
              Minimum payout is <span className="text-white font-bold">10,000 coins (₦20,000)</span>.
            </p>
          </div>
          
          <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-amber/10 flex items-center justify-center text-amber">
              <Coins className="w-8 h-8" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Your Balance</div>
              <div className="text-4xl font-display font-black text-white">{user ? user.coinBalance?.toLocaleString() : '0'}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Withdrawal Form */}
          <div className="p-8 md:p-12 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <ArrowRightLeft className="text-green" />
              Withdrawal Details
            </h2>

            <form onSubmit={handleWithdraw} className="space-y-6">
              {/* Coin Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Amount to Convert (Coins)</label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input 
                    type="number"
                    min="10000"
                    step="100"
                    value={coins}
                    onChange={(e) => setCoins(parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl py-4 pl-12 pr-4 text-white font-bold focus:outline-none focus:border-green/50 transition-colors"
                    placeholder="Min 10,000"
                    required
                  />
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs text-gray-500 italic">Rate: 1 Coin = ₦2</span>
                  <span className="text-lg font-black text-green">₦{amountNgn.toLocaleString()}</span>
                </div>
              </div>

              {/* Bank Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Bank Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input 
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green/50"
                      placeholder="e.g. Zenith Bank"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Account Number</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input 
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green/50"
                      placeholder="10 digits"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Account Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input 
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green/50"
                    placeholder="Full name on account"
                    required
                  />
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green/10 text-green border border-green/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              )}

              <Button 
                type="submit"
                disabled={loading || !canWithdraw}
                className={`w-full py-8 rounded-3xl font-black text-xl shadow-xl transition-all ${canWithdraw ? 'bg-green text-navy hover:bg-green/90 shadow-green/20' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
              >
                {loading ? 'Processing...' : canWithdraw ? 'Request Payout' : 'Insufficient Balance'}
              </Button>

              <p className="text-center text-[10px] text-gray-500 px-4 leading-relaxed">
                By requesting a payout, you agree to our Terms of Service. Payouts are typically processed within 24-48 hours after verification.
              </p>
            </form>
          </div>

          {/* History / Info */}
          <div className="space-y-8">
            <div className="p-8 rounded-[40px] bg-gradient-to-br from-green/20 to-transparent border border-green/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Banknote className="text-green" />
                How it works
              </h3>
              <ul className="space-y-4">
                {[
                  "Accumulate at least 10,000 coins through battles, referrals, and answering questions.",
                  "Request a withdrawal and provide your Nigerian bank details.",
                  "Our team verifies your activity to ensure fair play.",
                  "Receive ₦20,000 (or more) directly to your bank account."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 text-sm text-gray-400">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green/10 text-green flex items-center justify-center font-bold text-xs">{i+1}</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1]">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <History className="text-gray-400" />
                Recent Withdrawals
              </h3>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 italic text-sm">
                    No withdrawal history yet.
                  </div>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1] flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold">₦{item.amountNgn.toLocaleString()}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{new Date(item.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        item.status === 'completed' ? 'bg-green/10 text-green' : 
                        item.status === 'pending' ? 'bg-amber/10 text-amber' : 
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {item.status}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
