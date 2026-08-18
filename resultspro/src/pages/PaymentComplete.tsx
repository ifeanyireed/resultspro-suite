import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/lib/axiosConfig';
import { useToast } from '@/hooks/use-toast';

export const PaymentComplete = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get('reference');
        if (!reference) {
          setStatus('error');
          setMessage('No payment reference found');
          return;
        }

        const response = await axiosInstance.get(`/payment/verify/${reference}`);

        if (response.data?.success) {
          setStatus('success');
          // Response structure is { success: true, data: { type: 'SCRATCH_CARD', ... } }
          const isScratchCard = response.data?.data?.type === 'SCRATCH_CARD';
          
          setMessage(isScratchCard ? 'Payment verified! Your request is being processed.' : 'Payment verified successfully!');
          
          toast({
            title: 'Payment Successful',
            description: isScratchCard 
              ? 'Your scratch card request has been paid. Redirecting to requests page...' 
              : 'Your subscription is now active. Redirecting to setup wizard...',
          });

          // Redirect logic based on payment type
          setTimeout(() => {
            if (isScratchCard) {
              navigate('/school-admin/scratch-cards/requests', { replace: true });
            } else {
              // Redirect back to onboarding wizard (Step 6) to show subscription details
              navigate('/onboarding?step=6', { replace: true });
            }
          }, 2000);
        } else {
          setStatus('error');
          setMessage(response.data?.error || 'Payment verification failed');
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage(error?.response?.data?.error || 'Payment verification failed. Please contact support.');
        toast({
          title: 'Payment Verification Failed',
          description: error?.response?.data?.error || error?.message,
          variant: 'destructive',
        });
      }
    };

    verifyPayment();
  }, [searchParams, navigate, toast]);

  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-full max-w-md">
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-8 backdrop-blur-xl shadow-2xl">
          {status === 'loading' && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Processing Payment</h2>
              <p className="text-gray-400">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="inline-block">
                  <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="inline-block">
                  <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Payment Error</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <button
                onClick={() => navigate('/onboarding', { replace: true })}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
              >
                Return to Onboarding
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
