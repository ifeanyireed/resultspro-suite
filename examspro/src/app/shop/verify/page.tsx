"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IconCircleCheck as CheckCircle2, IconCircleX as XCircle, IconLoader2 as Loader2, IconArrowRight as ArrowRight, IconShieldCheck as ShieldCheck, IconCoins as Coins } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import Navbar from '@/components/Navbar';

// Separate component to handle search params
function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [details, setDetails] = useState<{ packName?: string, coins?: number, error?: string }>({});
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setDetails({ error: 'No reference found' });
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get(`/payment/verify?reference=${reference}`);
        setStatus('success');
        setDetails({ 
          packName: res.data.packName, 
          coins: res.data.coins 
        });
        // Refresh user to update coin balance
        fetchUser();
      } catch (err: any) {
        console.error('Verification failed:', err);
        setStatus('error');
        setDetails({ error: err.response?.data?.error || 'Verification failed' });
      }
    };

    verify();
  }, [reference, fetchUser]);

  return (
    <div className="max-w-xl w-full mx-auto p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-center">
      {status === 'loading' && (
        <div className="py-12 space-y-6">
          <div className="relative">
             <div className="w-20 h-20 border-4 border-white/5 border-t-blue rounded-full animate-spin mx-auto" />
             <ShieldCheck className="w-10 h-10 text-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-black text-white mb-2">Verifying Payment</h2>
            <p className="text-gray-500 text-sm italic">Please wait while we secure your transaction...</p>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="py-12 space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green/20 rounded-full flex items-center justify-center mx-auto ring-8 ring-green/5">
            <CheckCircle2 className="w-12 h-12 text-green" />
          </div>
          
          <div>
            <h2 className="text-3xl font-display font-black text-white mb-2 uppercase">Payment Successful!</h2>
            <p className="text-gray-400">
               {details.coins ? `Added ${details.coins.toLocaleString()} coins for ${details.packName}` : `Successfully activated ${details.packName}`}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center text-amber">
                   <Coins className="w-5 h-5" />
                </div>
                <div className="text-left">
                   <div className="text-[10px] font-bold text-gray-500 uppercase">Received</div>
                   <div className="text-lg font-bold text-white">{details.coins?.toLocaleString()} Coins</div>
                </div>
             </div>
             <CheckCircle2 className="w-5 h-5 text-green" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => router.push('/dashboard')}
              className="py-6 rounded-2xl bg-white/5 text-white hover:bg-white/10 font-bold"
            >
              Dashboard
            </Button>
            <Button 
              onClick={() => router.push('/shop')}
              className="py-6 rounded-2xl bg-green text-navy hover:bg-green/90 font-bold flex items-center justify-center gap-2"
            >
              Shop More
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="py-12 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-500/5">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          
          <div>
            <h2 className="text-3xl font-display font-black text-white mb-2 uppercase">Verification Failed</h2>
            <p className="text-red-500 font-bold">{details.error}</p>
            <p className="text-gray-500 text-sm mt-4 italic">
              If you were already debited, please contact support at <span className="text-white font-bold">hello@resultspro.ng</span> with your reference: <span className="text-white font-mono">{reference}</span>
            </p>
          </div>

          <div className="pt-4">
            <Button 
               onClick={() => router.push('/shop')}
               className="w-full py-6 rounded-2xl bg-white/5 text-white hover:bg-white/10 font-bold"
            >
              Return to Shop
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <main className="min-h-screen bg-navy text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <Suspense fallback={
          <div className="max-w-xl w-full mx-auto p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-center">
             <Loader2 className="w-12 h-12 text-blue animate-spin mx-auto" />
          </div>
        }>
          <VerifyContent />
        </Suspense>
      </div>
    </main>
  );
}
