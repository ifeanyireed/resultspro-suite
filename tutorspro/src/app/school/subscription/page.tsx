"use client";

import { IconCreditCard as CreditCard, IconCheck as Check, IconZap as Zap, IconShieldCheck as ShieldCheck, IconCalendar as Calendar, IconChevronRight as ChevronRight, IconPlus as Plus } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getSubscription, updateSubscription } from '@/lib/school.api';

interface Subscription {
  plan: string;
  status: string;
  nextBilling: string;
  seatsUsed: number;
  seatsTotal: number;
  billingHistory: {
    date: string;
    id: string;
    amount: string;
  }[];
}

const planDetails: { [key: string]: { name: string, price: string, period: string, features: string[], popular?: boolean } } = {
  'Starter': { 
    name: 'Starter', 
    price: '$99', 
    period: '/mo',
    features: ['Up to 10 Teachers', 'Basic Analytics', 'Standard Branding', 'Email Support'],
  },
  'Professional': { 
    name: 'Professional', 
    price: '$249', 
    period: '/mo',
    features: ['Up to 50 Teachers', 'Advanced Analytics', 'Full White-labeling', 'Priority Support', 'API Access'],
    popular: true
  },
  'Enterprise': { 
    name: 'Enterprise', 
    price: 'Custom', 
    period: '',
    features: ['Unlimited Teachers', 'Custom Reports', 'Dedicated Account Manager', 'SLA Guarantee'],
  },
};


export default function SchoolSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    setIsLoading(true);
    try {
      const data = await getSubscription();
      setSubscription(data);
    } catch (error) {
      toast.error("Failed to load subscription details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubscription = async (plan: string) => {
    const toastId = toast.loading(`Updating to ${plan} plan...`);
    try {
      const response = await updateSubscription(plan);
      toast.success(response.message || 'Subscription updated!', { id: toastId });
      fetchSubscription(); // Refresh data
    } catch (error: any) {
      toast.error(error.message || 'Failed to update subscription.', { id: toastId });
    }
  };
  
  const plans = Object.values(planDetails).map(p => ({...p, active: p.name === subscription?.plan}));

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading subscription details...</div>;
  }

  if (!subscription) {
    return <div className="p-8 text-center text-red-500">Could not load subscription information.</div>;
  }

  return (
    <main className="p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Subscription Management</h1>
          <p className="text-gray-400">Manage your school's plan, teacher seats, and billing history.</p>
        </div>

        {/* Current Plan Overview */}
        <div className="p-8 rounded-[40px] bg-gradient-to-br from-purple/20 to-transparent border border-purple/20 mb-12 flex flex-col lg:flex-row items-center justify-between gap-12">
           <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-3xl bg-purple/20 border border-purple/30 flex items-center justify-center text-purple">
                 <Zap className="w-10 h-10" />
              </div>
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-display font-bold text-white">{subscription.plan} Plan</h2>
                    <span className="px-3 py-1 rounded-full bg-purple text-[10px] font-bold uppercase tracking-widest">{subscription.status}</span>
                 </div>
                 <p className="text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Next billing on {new Date(subscription.nextBilling).toLocaleDateString()}
                 </p>
              </div>
           </div>
           
           <div className="flex items-center gap-8 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12">
              <div className="flex-1 lg:flex-none">
                 <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Teacher Seats</div>
                 <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold text-white">{subscription.seatsUsed}</div>
                    <div className="text-gray-500 mb-1">/ {subscription.seatsTotal} used</div>
                 </div>
                 <div className="w-32 h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-purple rounded-full" style={{ width: `${(subscription.seatsUsed / subscription.seatsTotal) * 100}%` }} />
                 </div>
              </div>
           </div>
        </div>

        {/* Plan Selection */}
        <h3 className="text-xl font-display font-bold text-white mb-8 px-2">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`p-8 rounded-[40px] border transition-all relative ${
                plan.active 
                  ? 'bg-white/5 border-purple shadow-[0_0_40px_rgba(168,85,247,0.1)]' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-12 -translate-y-1/2 px-4 py-1 rounded-full bg-purple text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h4 className="text-lg font-bold text-white mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500 font-medium">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-gray-400">
                    <Check className={`w-4 h-4 shrink-0 ${plan.active ? 'text-purple' : 'text-gray-600'}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => !plan.active && handleUpdateSubscription(plan.name)}
                className={`w-full py-4 rounded-2xl font-bold transition-all ${
                  plan.active 
                    ? 'bg-purple/10 text-purple border border-purple/20 cursor-default' 
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                {plan.active ? 'Current Plan' : 'Upgrade Plan'}
              </button>
            </div>
          ))}
        </div>

        {/* Billing History */}
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold text-white px-2">Billing History</h3>
          <div className="rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden">
             <table className="w-full text-left">
                <thead>
                   <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Invoice ID</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Receipt</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {subscription.billingHistory.map((inv, i) => (
                     <tr key={i} className="hover:bg-white/[0.04] transition-colors">
                        <td className="px-8 py-5 text-sm text-white">{inv.date}</td>
                        <td className="px-8 py-5 text-sm text-gray-500">{inv.id}</td>
                        <td className="px-8 py-5 text-sm font-bold text-white">{inv.amount}</td>
                        <td className="px-8 py-5 text-right">
                           <button className="text-purple font-bold text-xs hover:underline inline-flex items-center gap-1">
                              Download <ChevronRight className="w-3 h-3" />
                           </button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </main>
  );
}
