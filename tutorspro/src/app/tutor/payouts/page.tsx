"use client";

import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { 
  Building2, 
  CreditCard, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  Smartphone,
  Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function TutorPayouts() {
  const [mounted, setMounted] = useState(false);
  const [payoutData, setPayoutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('Bank Transfer (Access Bank)');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const res = await api.get('/tutor/payouts');
      setPayoutData(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load payout data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    const amount = parseInt(withdrawAmount);
    if (!amount || amount < 5000) {
      toast.error('Minimum payout is ₦5,000');
      return;
    }
    
    if (payoutData?.balance < amount) {
      toast.error('Insufficient balance');
      return;
    }

    setRequesting(true);
    try {
      await api.post('/tutor/payouts', {
        amount: amount,
        method: payoutMethod
      });
      toast.success('Disbursement requested successfully!');
      setWithdrawAmount('');
      fetchPayouts();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to request payout');
    } finally {
      setRequesting(false);
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
              Payout <span className="text-green">Requests</span>
            </h1>
            <p className="text-gray-400">Request disbursements and manage your withdrawal methods.</p>
          </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-24 opacity-50">
             <Loader2 className="w-12 h-12 text-green animate-spin mb-4" />
             <p className="text-white font-bold">Loading payout history...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             {/* Payout Request Area (Left) */}
             <div className="lg:col-span-2 space-y-12">
                <section className="p-10 rounded-[40px] bg-gradient-to-br from-green/10 to-blue/10 border border-white/10 relative overflow-hidden">
                   <div className="relative z-10">
                      <h2 className="text-2xl font-display font-bold text-white mb-2">Available Balance</h2>
                      <div className="text-6xl font-display font-black text-white mb-8">
                        ₦{payoutData?.balance?.toLocaleString() || '0'}
                      </div>
                      
                      <div className="space-y-6 max-w-md">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Withdrawal Amount</label>
                            <input 
                              type="number" 
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              placeholder="Enter amount to withdraw" 
                              className="w-full bg-navy/50 border border-white/10 rounded-2xl py-5 px-6 text-2xl font-display font-bold text-white focus:outline-none focus:border-green/50 transition-all" 
                            />
                         </div>
                         
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Select Payout Method</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <button 
                                 onClick={() => setPayoutMethod('Bank Transfer (Access Bank)')}
                                 className={`p-4 rounded-2xl border font-bold text-sm flex items-center gap-3 transition-all ${
                                   payoutMethod.includes('Bank') ? 'bg-green text-navy border-green' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                 }`}
                               >
                                  <Building2 size={18} /> Access Bank
                               </button>
                               <button 
                                 onClick={() => setPayoutMethod('Mobile Money (MTN)')}
                                 className={`p-4 rounded-2xl border font-bold text-sm flex items-center gap-3 transition-all ${
                                   payoutMethod.includes('Mobile') ? 'bg-green text-navy border-green' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                 }`}
                               >
                                  <Smartphone size={18} /> Mobile Money
                               </button>
                            </div>
                         </div>

                         <button 
                           onClick={handleRequestPayout}
                           disabled={requesting}
                           className="w-full py-5 rounded-[24px] bg-green text-navy font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-green/20 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                         >
                            {requesting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'REQUEST DISBURSEMENT'}
                         </button>
                         <p className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-widest">Payouts are typically processed within 24 hours.</p>
                      </div>
                   </div>
                </section>

                <section>
                   <h3 className="text-xl font-display font-bold text-white mb-6">Payout History</h3>
                   <div className="space-y-3">
                      {payoutData?.payouts?.length > 0 ? payoutData.payouts.map((p: any) => (
                        <div key={p.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-white/[0.08] transition-all">
                           <div className="flex gap-4 items-center">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.status === 'Completed' ? 'bg-green/10 text-green' : 'bg-amber/10 text-amber'}`}>
                                 {p.status === 'Completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                              </div>
                              <div>
                                 <div className="font-bold text-white text-lg">₦{p.amount.toLocaleString()}</div>
                                 <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()} • {p.method}</div>
                              </div>
                           </div>
                           <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.status === 'Completed' ? 'bg-green/10 text-green' : 'bg-amber/10 text-amber'}`}>
                              {p.status}
                           </div>
                        </div>
                      )) : (
                        <div className="p-10 text-center rounded-[32px] border-2 border-dashed border-white/10 opacity-60">
                           <p className="text-white font-bold">No payout history yet.</p>
                        </div>
                      )}
                   </div>
                </section>
             </div>

             {/* Sidebar (Right) */}
             <div className="space-y-8">
                <section className="p-8 rounded-[40px] bg-white/5 border border-white/10">
                   <div className="flex items-center gap-3 text-blue font-bold mb-6">
                      <ShieldCheck size={20} /> Verified Accounts
                   </div>
                   <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative group">
                         <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Access Bank</span>
                            <CheckCircle2 size={12} className="text-green" />
                         </div>
                         <div className="text-sm font-bold text-white">•••• 8241</div>
                         <div className="text-[8px] text-gray-600 font-bold uppercase mt-1">Default Method</div>
                      </div>
                      <button className="w-full py-4 rounded-2xl border-2 border-dashed border-white/5 text-gray-600 font-bold text-xs uppercase tracking-widest hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2">
                         <Plus size={14} /> ADD NEW METHOD
                      </button>
                   </div>
                </section>

                <section className="p-8 rounded-[40px] bg-white/5 border border-white/10">
                   <h3 className="text-xl font-display font-bold text-white mb-4">Payout Rules</h3>
                   <div className="space-y-4">
                      {[
                        'Minimum payout: ₦5,000',
                        'Weekly automatic threshold: ₦50,000',
                        'Bank processing: 1-3 business days',
                        'Mobile money: Instant'
                      ].map((rule, i) => (
                        <div key={i} className="flex gap-3 text-xs text-gray-500 font-medium leading-relaxed">
                           <div className="w-1 h-1 rounded-full bg-blue mt-2 shrink-0" />
                           {rule}
                        </div>
                      ))}
                   </div>
                </section>

                <section className="p-8 rounded-[40px] bg-amber/5 border border-amber/10">
                   <div className="flex items-center gap-3 text-amber font-bold mb-4 uppercase tracking-widest text-[10px]">
                      <AlertCircle size={16} /> Identity Check
                   </div>
                   <p className="text-xs text-gray-500 leading-relaxed">
                      Disbursements to new bank accounts require a 24-hour security hold for your protection.
                   </p>
                </section>
             </div>
          </div>
        )}
      </div>
    </main>
  );
}
