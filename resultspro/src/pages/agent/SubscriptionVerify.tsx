import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAgentSubscription } from '@/hooks/useAgentAnalytics';
import { CheckCircle, XCircle, Loading01 } from '@/lib/hugeicons-compat';

const SubscriptionVerify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifySubscription } = useAgentSubscription();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference) {
      setStatus('error');
      setErrorMessage('No payment reference found');
      return;
    }

    const verify = async () => {
      try {
        await verifySubscription(reference);
        setStatus('success');
        setTimeout(() => {
          navigate('/agent/dashboard');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(error.message || 'Verification failed');
      }
    };

    verify();
  }, [searchParams, verifySubscription, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] rounded-[30px] p-8 text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <Loading01 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">Verifying Payment...</h2>
            <p className="text-gray-400">Please wait while we confirm your subscription.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Payment Successful!</h2>
            <p className="text-gray-400">Your subscription has been updated. Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Payment Verification Failed</h2>
            <p className="text-red-400/80">{errorMessage}</p>
            <button
              onClick={() => navigate('/agent/subscription-plans')}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all font-bold"
            >
              Back to Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionVerify;
