"use client";

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { IconCoins as Coins, IconBolt as Zap, IconShieldCheck as ShieldCheck, IconHistory as History, IconSparkles as Sparkles, IconGift as Gift, IconLoader2 as Loader2, IconInfoCircle as Info, IconCircleCheck as CheckCircle2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

interface CoinPack {
  id: string;
  name: string;
  type: string;
  coins: number;
  price: number;
  color: string;
  popular: boolean;
  discount?: string | null;
  bonus?: string | null;
  description?: string | null;
}

const colorMap: Record<string, { bg: string, text: string, border: string, iconBg: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30', iconBg: 'bg-blue-500/10' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30', iconBg: 'bg-amber-500/10' },
  gray: { bg: 'bg-gray-500/10', text: 'text-gray-500', border: 'border-gray-500/30', iconBg: 'bg-gray-500/10' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/30', iconBg: 'bg-purple-500/10' },
  green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30', iconBg: 'bg-green-500/10' },
};

/**
 * Calculates the total amount to charge a user such that the 
 * business receives the target price after Paystack fees and VAT.
 */
function calculateFinalTotal(targetPriceNgn: number): number {
  const vat = targetPriceNgn * 0.075;
  const basePlusVat = targetPriceNgn + vat;

  const percentageFee = 0.015;
  const flatFee = basePlusVat < 2500 ? 0 : 100;
  
  const total = (basePlusVat + flatFee) / (1 - percentageFee);
  
  const totalFee = total - basePlusVat;
  if (totalFee > 2000) {
    return basePlusVat + 2000;
  }
  
  return Math.ceil(total);
}

export default function CoinShopPage() {
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [loadingPack, setLoadingPack] = useState<string | null>(null);
  const [allPacks, setAllPacks] = useState<CoinPack[]>([]);
  const [loadingPacks, setLoadingPacks] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    fetchCoinPacks();
  }, []);

  const fetchCoinPacks = async () => {
    try {
      const res = await api.get('/payment/packs');
      setAllPacks(res.data);
    } catch (err) {
      console.error('Failed to fetch coin packs:', err);
    } finally {
      setLoadingPacks(false);
    }
  };

  const coinPacks = useMemo(() => allPacks.filter(p => p.type === 'COIN'), [allPacks]);
  const premiumPack = useMemo(() => allPacks.find(p => p.type === 'PREMIUM'), [allPacks]);

  const handlePurchase = async (packId: string) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setLoadingPack(packId);
    try {
      const res = await api.post('/payment/initialize', { packId });
      // Redirect to Paystack checkout
      window.location.href = res.data.authorization_url;
    } catch (err) {
      console.error('Payment initialization failed:', err);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setLoadingPack(null);
    }
  };

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        {/* Header / Balance */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <div className={`text-center ${user ? 'md:text-left' : 'md:text-center w-full'}`}>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4">
              COIN <span className="text-amber">SHOP</span>
            </h1>
            <p className="text-gray-400 max-w-md mx-auto md:mx-0">
              Fuel your study journey. Get coins for AI deep-dives, 
              battle stakes, and premium content.
            </p>
          </div>
          
          {user && (
            <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center gap-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-amber/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-2xl bg-amber/10 flex items-center justify-center text-amber relative z-10">
                <Coins className="w-8 h-8" />
              </div>
              <div className="relative z-10">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Your Balance</div>
                <div className="text-4xl font-display font-black text-white">{isMounted ? (user?.coinBalance?.toLocaleString() || 0) : 0}</div>
              </div>
              <button className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors relative z-10">
                <History className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Subscription Promo */}
        {premiumPack && (
          <div className="p-1 rounded-[32px] bg-gradient-to-r from-blue via-purple to-pink mb-16 relative group cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
            <div className="relative bg-navy rounded-[30px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue" />
                  <span className="text-xs font-bold text-blue uppercase tracking-widest">Premium Membership</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-display font-black text-white mb-4 uppercase">
                  {premiumPack.name}
                </h2>
                <ul className="space-y-3">
                  {[
                    "Unlimited Standard Explanations",
                    "Free AI Deep-Dives (50/mo)",
                    "Access to all Past Question years",
                    "No platform fee on Battle draws"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center md:text-right">
                <div className="text-3xl font-display font-black text-white mb-1">
                  ₦{calculateFinalTotal(premiumPack.price).toLocaleString()}
                  <span className="text-sm text-gray-500 font-bold italic">/mo</span>
                </div>
                <div className="text-[10px] text-gray-500 mb-4 italic flex items-center justify-center md:justify-end gap-1">
                   <Info className="w-3 h-3" /> Includes 7.5% VAT & Fees
                </div>
                <Button 
                  onClick={() => handlePurchase(premiumPack.id)}
                  disabled={loadingPack === premiumPack.id}
                  className="mt-2 px-10 py-7 rounded-2xl bg-blue text-white hover:bg-blue/90 font-bold text-lg shadow-lg shadow-blue/20"
                >
                  {loadingPack === premiumPack.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    user?.isPremium ? 'Renew Membership' : 'Go Unlimited'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Coin Packs Grid */}
        {loadingPacks ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 text-amber animate-spin" />
            <p className="text-gray-400 font-bold">Loading Coin Packs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {coinPacks.map((pack, i) => {
              const finalPrice = calculateFinalTotal(pack.price);
              const colorConfig = colorMap[pack.color] || colorMap.blue;
              
              return (
                <div 
                  key={i} 
                  className={`
                    group relative p-8 rounded-[40px] border transition-all flex flex-col items-center text-center
                    ${pack.popular ? 'bg-white/5 border-green/30 scale-105 shadow-2xl shadow-green/5' : 'bg-white/[0.02] border-white/[0.05] border-t-white/[0.1] hover:bg-white/5 hover:border-white/20'}
                  `}
                >
                  {pack.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-green text-navy text-[10px] font-black uppercase tracking-widest">
                      MOST POPULAR
                    </div>
                  )}
                  
                  {pack.discount && (
                    <div className="absolute top-6 right-6 px-2 py-1 rounded bg-red-500 text-white text-[8px] font-black italic">
                      {pack.discount}
                    </div>
                  )}

                  <div className={`w-20 h-20 rounded-3xl ${colorConfig.iconBg} flex items-center justify-center ${colorConfig.text} mb-8 group-hover:scale-110 transition-transform`}>
                    <Coins className="w-10 h-10" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{pack.name}</h3>
                  <div className="text-4xl font-display font-black text-white mb-2">
                    {pack.coins.toLocaleString()} <span className="text-sm text-gray-500 uppercase tracking-tighter">Coins</span>
                  </div>
                  
                  {pack.bonus && <div className="text-xs font-bold text-green mb-4">{pack.bonus}</div>}
                  {pack.description && <p className="text-xs text-gray-400 mb-6 px-4">{pack.description}</p>}

                  <div className="flex flex-col items-center gap-1.5 mb-8">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                      <Info className="w-3 h-3" />
                      <span>₦{pack.price.toLocaleString()} + VAT & Fees</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto w-full">
                    <Button 
                      onClick={() => handlePurchase(pack.id)}
                      disabled={loadingPack === pack.id}
                      className={`w-full py-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 ${pack.popular ? 'bg-green text-navy hover:bg-green/90' : 'bg-white/5 text-white hover:bg-white/10'}`}
                    >
                      {loadingPack === pack.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        `Buy ₦${finalPrice.toLocaleString()}`
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Security / Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-12 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1]">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center text-blue">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white">Secure Payments</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Encrypted transactions powered by Paystack.</p>
          </div>
          
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center text-green">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white">Instant Delivery</h4>
            <div className="text-xs text-gray-500 leading-relaxed">Coins or Premium status are added immediately after purchase.</div>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple/10 flex items-center justify-center text-purple">
              <Gift className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white">Gift Coins</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Coming soon: Send coin packs to your friends and students.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
