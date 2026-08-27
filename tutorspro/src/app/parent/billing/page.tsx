"use client";

import api from '@/lib/api';
import { IconCreditCard as CreditCard, IconWallet as Wallet, IconHistory as History, IconArrowDownLeft as ArrowDownLeft, IconArrowUpRight as ArrowUpRight, IconDownload as Download, IconShieldCheck as ShieldCheck, IconPlus as Plus, IconChevronRight as ChevronRight, IconTrendingUp as TrendingUp, IconAlertCircle as AlertCircle, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ParentBilling() {
  const [mounted, setMounted] = useState(false);
  const [billingData, setBillingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const res = await api.get('/parent/billing');
      setBillingData(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-navy pb-24">
            
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
              Billing & <span className="text-blue">Credits</span>
            </h1>
            <p className="text-gray-400">Manage subscriptions, wallet balance, and payment history.</p>
          </div>
          <button className="px-8 py-4 rounded-2xl bg-blue text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-blue/20">
             <Plus className="w-5 h-5" /> ADD FUNDS
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-50">
            <Loader2 className="w-12 h-12 text-blue animate-spin mb-4" />
            <p className="text-white font-bold">Loading billing details...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content (Left) */}
            <div className="lg:col-span-2 space-y-8">
               {/* Wallet Card */}
               <div className="p-10 rounded-[40px] bg-gradient-to-br from-blue to-purple relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                     <Wallet className="w-64 h-64 -mr-16 -mt-16" />
                  </div>
                  <div className="relative z-10">
                     <div className="text-white/60 font-bold uppercase tracking-widest text-sm mb-2">Family Wallet Balance</div>
                     <div className="text-5xl md:text-7xl font-display font-black text-white mb-8">
                        ₦{billingData?.balance?.toLocaleString() || '0'}
                     </div>
                     <div className="flex flex-wrap gap-4">
                        <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4 text-green" /> Auto-topup: Enabled
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white">
                           Default: Visa ending in 4242
                        </div>
                     </div>
                  </div>
               </div>

               {/* Transactions */}
               <section>
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                        <History className="w-6 h-6 text-gray-500" /> Payment History
                     </h2>
                     <button className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors">
                        <Download className="w-4 h-4" /> Download All
                     </button>
                  </div>
                  
                  <div className="space-y-4">
                     {billingData?.transactions?.length > 0 ? billingData.transactions.map((tx: any) => (
                        <div key={tx.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.08] transition-all">
                           <div className="flex gap-4 items-center">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-green/10 text-green' : 'bg-red-400/10 text-red-400'}`}>
                                 {tx.type === 'CREDIT' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                              </div>
                              <div>
                                 <div className="font-bold text-white">{tx.title}</div>
                                 <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                    {new Date(tx.createdAt).toLocaleDateString()} • {tx.method}
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-6 w-full md:w-auto justify-between">
                              <div className="text-right">
                                 <div className={`text-xl font-display font-bold ${tx.type === 'CREDIT' ? 'text-green' : 'text-white'}`}>
                                    {tx.type === 'CREDIT' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                                 </div>
                                 <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{tx.status}</div>
                              </div>
                              <button className="p-3 rounded-xl bg-white/5 text-gray-600 hover:text-white transition-all">
                                 <Download className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                     )) : (
                       <div className="p-10 text-center rounded-[32px] border-2 border-dashed border-white/10">
                          <p className="text-gray-500 font-bold">No transactions found.</p>
                       </div>
                     )}
                  </div>
               </section>
            </div>

            {/* Sidebar (Right) */}
            <div className="space-y-8">
               {/* Credit Usage */}
               <section className="p-8 rounded-[40px] bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 text-blue font-bold mb-8">
                     <TrendingUp className="w-5 h-5" /> Spending Snapshot
                  </div>
                  <div className="space-y-6">
                     {billingData?.spending_snapshot?.map((item: any, i: number) => (
                       <div key={i}>
                          <div className="flex justify-between text-xs font-bold mb-2">
                             <span className="text-white">{item.name}</span>
                             <span className="text-gray-500">₦{item.amount.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                             <div className={`w-[60%] h-full ${item.color} rounded-full`} />
                          </div>
                       </div>
                     ))}
                  </div>
                  <div className="mt-10 pt-8 border-t border-white/5">
                     <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Saved Cards</div>
                     <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                           <CreditCard className="w-5 h-5 text-gray-400" />
                           <span className="text-sm text-white font-medium">•••• 4242</span>
                        </div>
                        <button className="text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors">Edit</button>
                     </div>
                  </div>
               </section>

               {/* Invoicing Alert */}
               <section className="p-8 rounded-[40px] bg-amber/5 border border-amber/20">
                  <div className="flex items-center gap-3 text-amber font-bold mb-4">
                     <AlertCircle className="w-5 h-5" /> Tax Invoices
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                     Monthly invoices are automatically generated and sent to your email. You can also download them for reimbursement.
                  </p>
                  <button className="w-full py-4 rounded-2xl bg-amber text-navy font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                     Manage Invoices <ChevronRight className="w-4 h-4" />
                  </button>
               </section>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
