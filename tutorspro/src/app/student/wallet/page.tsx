"use client";

import { IconWallet as Wallet, IconPlus as Plus, IconArrowUpRight as ArrowUpRight, IconArrowDownLeft as ArrowDownLeft, IconCreditCard as CreditCard, IconHistory as History, IconTrendingUp as TrendingUp, IconShieldCheck as ShieldCheck, IconChevronRight as ChevronRight, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleGate } from '@/components/RoleGate';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

export default function StudentWallet() {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get('/student/wallet');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch wallet data");
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </main>
    );
  }

  const transactions = data?.transactions || [];
  const balance = data?.balance || 0;
  const stats = data?.stats || { total_deposits: 0, monthly_spend: 0, secure: true };

  return (
    <RoleGate allowedRoles={['STUDENT', 'PARENT', 'SUPERADMIN']}>
      <main className="min-h-screen bg-gray-50 pb-24">
                
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          <MotionRise className="mb-12">
            <h1 className="text-3xl md:text-5xl font-display font-black text-gray-900 mb-2">
              My <span className="text-blue">Wallet</span>
            </h1>
            <p className="text-gray-600">Manage your balance, payments, and transaction history.</p>
          </MotionRise>

          <MotionStagger className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wallet Overview */}
            <MotionRise className="lg:col-span-2 space-y-8">
              <div className="p-8 md:p-12 rounded-[40px] bg-navy text-white relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                   <Wallet className="w-64 h-64 -mr-16 -mt-16" />
                </div>
                
                <div className="relative z-10">
                  <div className="text-white/60 font-bold uppercase tracking-widest text-sm mb-2">Available Balance</div>
                  <div className="text-5xl md:text-7xl font-display font-black text-white mb-8">₦{balance.toLocaleString()}.00</div>
                  
                  <div className="flex flex-wrap gap-4">
                    <button className="px-8 py-4 rounded-2xl bg-green text-navy font-bold flex items-center gap-3 hover:scale-105 transition-all">
                      <Plus className="w-5 h-5" />
                      Add Funds
                    </button>
                    <button className="px-8 py-4 rounded-2xl bg-white/10 text-white font-bold backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                      Payment Methods
                    </button>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
                    <History className="w-6 h-6 text-blue" />
                    Transaction History
                  </h2>
                  <button className="text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors">Export CSV</button>
                </div>
                
                <div className="space-y-3">
                  {transactions.length > 0 ? transactions.map((tx: any) => (
                    <div key={tx.id} className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all">
                      <div className="flex gap-4 items-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-green/20 text-navy' : 'bg-red-50 text-red-600'}`}>
                          {tx.type === 'CREDIT' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{tx.title}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                            {tx.date} • {tx.method}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-1">
                        <div className={`text-lg font-display font-bold ${tx.type === 'CREDIT' ? 'text-blue' : 'text-gray-900'}`}>
                          {tx.type === 'CREDIT' ? '+' : '-'}{tx.amount}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-tighter text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                          {tx.status}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center text-gray-500 italic text-sm bg-white rounded-3xl border border-gray-100">No transactions found.</div>
                  )}
                </div>
              </section>
            </MotionRise>

            {/* Sidebar */}
            <MotionRise delay={0.1} className="space-y-8">
              {/* Quick Stats */}
              <div className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm">
                <h3 className="text-xl font-display font-bold text-gray-900 mb-6">Financial Overview</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 font-medium">Monthly Spending</span>
                      <span className="text-sm text-gray-900 font-bold">₦{stats.monthly_spend.toLocaleString()} / ₦50,000</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue rounded-full" style={{ width: `${(stats.monthly_spend / 50000) * 100}%` }} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <TrendingUp className="w-5 h-5 text-blue mb-2" />
                      <div className="text-xl font-display font-bold text-gray-900">₦{stats.total_deposits.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Total Deposits</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <ShieldCheck className="w-5 h-5 text-blue mb-2" />
                      <div className="text-xl font-display font-bold text-gray-900">{stats.secure ? 'Secure' : 'Unverified'}</div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Payment Level</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ... referral ... */}
              <div className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm relative group cursor-pointer">
                <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Earn Credits</h3>
                <p className="text-sm text-gray-600 mb-6">Invite your friends and get ₦2,500 in your wallet for every successful sign-up.</p>
                <div className="flex items-center text-blue font-bold gap-2 group-hover:translate-x-1 transition-transform">
                  Invite Friends <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </MotionRise>
          </MotionStagger>
        </div>
      </main>
    </RoleGate>
  );
}
