import React from 'react';
import { Button } from '@/components/ui/button';
import { IconCreditCard, IconCoins } from '@tabler/icons-react';
import Link from 'next/link';

export default function BillingTab() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription & Billing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border-2 border-[#146ef5] bg-blue-50/50">
            <div className="w-12 h-12 rounded-full bg-[#146ef5]/10 text-[#146ef5] flex items-center justify-center mb-4">
              <IconCreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Free Plan</h3>
            <p className="text-sm text-gray-500 mb-6">You are currently on the basic free plan. Upgrade to unlock unlimited AI tutorials.</p>
            <Link href="/shop">
              <Button className="w-full bg-[#146ef5] text-white hover:bg-blue-700 font-bold rounded-xl h-11">
                Upgrade to Pro
              </Button>
            </Link>
          </div>

          <div className="p-6 rounded-2xl border border-gray-100 bg-slate-50">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-4">
              <IconCoins className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Coin Balance</h3>
            <p className="text-sm text-gray-500 mb-6">Manage your earned coins and purchase history.</p>
            <Link href="/dashboard/profile/transactions">
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
