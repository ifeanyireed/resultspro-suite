import React from 'react';
import { Button } from '@/components/ui/button';
import { IconCreditCard, IconCoins } from '@tabler/icons-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

export default function BillingTab() {
  const { user } = useAuthStore();
  
  let planName = 'Free Plan';
  let planDesc = 'You are currently on the basic free plan. Upgrade to unlock unlimited AI tutorials.';
  let planValidity = '';
  
  if (user?.hasIcan) {
    planName = user.icanPlanName || 'ICAN Plan';
    planDesc = 'You are currently on the ICAN plan. You have access to ICAN exam resources.';
    if (user.icanExpiresAt) {
      planValidity = `Valid until: ${new Date(user.icanExpiresAt).toLocaleDateString()}`;
    }
  } else if (user?.isPremium) {
    planName = 'Pro Plan';
    planDesc = 'You are currently on the Pro plan with full access to unlimited AI tutorials and features.';
    if (user.premiumExpiresAt) {
      planValidity = `Valid until: ${new Date(user.premiumExpiresAt).toLocaleDateString()}`;
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription & Billing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border-2 border-[#146ef5] bg-blue-50/50">
            <div className="w-12 h-12 rounded-full bg-[#146ef5]/10 text-[#146ef5] flex items-center justify-center mb-4">
              <IconCreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{planName}</h3>
            <p className="text-sm text-gray-500 mb-2">{planDesc}</p>
            {planValidity && (
              <div className="inline-block px-3 py-1 bg-white border border-[#146ef5]/20 text-[#146ef5] text-xs font-bold rounded-full mb-6 shadow-sm">
                {planValidity}
              </div>
            )}
            {!planValidity && <div className="mb-6" />}
            <Link href="/shop">
              <Button className="w-full bg-[#146ef5] text-white hover:bg-blue-700 font-bold rounded-xl h-11">
                {planName === 'Free Plan' ? 'Upgrade to Pro' : 'Manage Subscription'}
              </Button>
            </Link>
          </div>

          <div className="p-6 rounded-2xl border border-gray-100 bg-slate-50">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-4">
              <IconCoins className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Coin Balance</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-black text-slate-900">{user?.coinBalance || 0}</span>
              <span className="text-xs text-gray-500 font-bold uppercase">Coins</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">Manage your earned coins and purchase history.</p>
            <Link href="/dashboard">
              <Button className="w-full bg-gray-900 text-white hover:bg-black font-bold rounded-xl h-11 border-none shadow-sm">
                View History
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
