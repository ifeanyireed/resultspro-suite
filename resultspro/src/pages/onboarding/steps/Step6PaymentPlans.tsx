import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosConfig';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, RefreshCw } from 'lucide-react';
import { useOnboardingStore, Step6Data } from '@/stores/onboardingStore';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number; // in NGN
  currency: string;
  duration: string; // e.g., 'per term', 'per year', 'forever'
  studentCount: string; // e.g., '0-200', 'Unlimited'
  features: string[];
  isPopular?: boolean;
  billingType?: 'term' | 'year'; // to differentiate plans
}

const AVAILABLE_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for testing Results Pro',
    price: 0,
    currency: 'NGN',
    duration: 'forever',
    studentCount: '0-100',
    features: [
      'CSV result upload',
      'Basic result publishing',
      'Parent viewing portal',
      'Email notifications',
      'Basic analytics',
      'Email support',
      '100 results processing per term',
    ],
    isPopular: false,
  },
  {
    id: 'pro-term',
    name: 'Pro',
    description: 'For growing schools',
    price: 50000,
    currency: 'NGN',
    duration: 'per term',
    studentCount: '101-2,000',
    features: [
      'All Free features',
      'Result checker with scratch cards',
      'Parent mobile app access',
      'Advanced analytics',
      'SMS notifications',
      'Priority email support',
      'Custom branding',
      'Batch processing',
      'CSV data export',
      '2000 results processing per term',
    ],
    isPopular: true,
    billingType: 'term',
  },
  {
    id: 'pro-year',
    name: 'Pro',
    description: 'For growing schools (Save 17%)',
    price: 150000,
    currency: 'NGN',
    duration: 'per year',
    studentCount: '101-2,000',
    features: [
      'All Free features',
      'Result checker with scratch cards',
      'Parent mobile app access',
      'Advanced analytics',
      'SMS notifications',
      'Priority email support',
      'Custom branding',
      'Batch processing',
      'CSV data export',
      '2000 results processing per term',
    ],
    isPopular: false,
    billingType: 'year',
  },
  {
    id: 'enterprise-term',
    name: 'Enterprise',
    description: 'For large school networks',
    price: 200000,
    currency: 'NGN',
    duration: 'per term',
    studentCount: 'Unlimited',
    features: [
      'All Pro features',
      'Multiple schools management',
      'White-label platform',
      'Dedicated account manager',
      '24/7 phone & email support',
      'API access',
      'Custom integrations',
      'Advanced security features',
      'Custom SLA agreement',
    ],
    isPopular: false,
    billingType: 'term',
  },
  {
    id: 'enterprise-year',
    name: 'Enterprise',
    description: 'For large school networks (Save 17%)',
    price: 600000,
    currency: 'NGN',
    duration: 'per year',
    studentCount: 'Unlimited',
    features: [
      'All Pro features',
      'Multiple schools management',
      'White-label platform',
      'Dedicated account manager',
      '24/7 phone & email support',
      'API access',
      'Custom integrations',
      'Advanced security features',
      'Custom SLA agreement',
    ],
    isPopular: false,
    billingType: 'year',
  },
];

interface Step6Props {
  onNext: (data: any) => Promise<void>;
  onPrevious: () => void;
  initialData?: Step6Data;
  isLoading?: boolean;
}

export const Step6PaymentPlans = ({
  onNext,
  onPrevious,
  initialData,
  isLoading = false,
}: Step6Props) => {
  const [billingPeriod, setBillingPeriod] = useState<'term' | 'year'>('year');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialData?.selectedPlanId || '');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState<{
    tier: string;
    startDate: Date;
    endDate: Date;
  } | null>(null);
  const [showPlansGrid, setShowPlansGrid] = useState(false);
  const { setError } = useOnboardingStore();

  // Sync with store if initialData changes
  useEffect(() => {
    if (initialData?.selectedPlanId) {
      setSelectedPlanId(initialData.selectedPlanId);
      if (initialData.selectedPlanId.includes('year')) setBillingPeriod('year');
      else if (initialData.selectedPlanId.includes('term')) setBillingPeriod('term');
    }
  }, [initialData?.selectedPlanId]);

  // Load available plans on mount
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await axiosInstance.get('/onboarding/status');
        const data = response.data.data;
        
        if (data.subscriptionTier && data.subscriptionTier.toUpperCase() !== 'FREE' && data.subscriptionEndDate) {
          setCurrentSubscription({
            tier: data.subscriptionTier,
            startDate: new Date(data.subscriptionStartDate),
            endDate: new Date(data.subscriptionEndDate),
          });
          
          // Auto-select the corresponding plan if not already selected
          if (!selectedPlanId) {
            const tierLower = data.subscriptionTier.toLowerCase();
            const isAnnual = data.subscriptionEndDate && 
              (new Date(data.subscriptionEndDate).getTime() - new Date(data.subscriptionStartDate).getTime() > 150 * 24 * 60 * 60 * 1000);
            
            const suffix = isAnnual ? 'year' : 'term';
            setSelectedPlanId(`${tierLower}-${suffix}`);
            setBillingPeriod(isAnnual ? 'year' : 'term');
          }
        } else if (data.subscriptionTier?.toUpperCase() === 'FREE' || !data.subscriptionTier) {
          setCurrentSubscription({
            tier: 'Free',
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)), // Far future for free plan
          });
          if (!selectedPlanId) setSelectedPlanId('free');
        }
      } catch (error) {
        console.error('Failed to fetch subscription data:', error);
      } finally {
        setLoadingSubscription(false);
      }
    };
    
    fetchSubscriptionData();
  }, []);

  const filteredPlans = AVAILABLE_PLANS.filter(plan => 
    plan.id === 'free' || plan.billingType === billingPeriod
  );

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleProceed = async (isRenewal = false) => {
    if (!selectedPlanId) {
      setSubmitError('Please select a plan to continue');
      return;
    }

    try {
      setSubmitError(null);
      setError(null);

      const hasActiveSub = !!currentSubscription && currentSubscription.endDate > new Date();

      await onNext({
        selectedPlanId: selectedPlanId,
        paymentMethod: 'paystack',
        hasActiveSubscription: hasActiveSub,
        forceRenew: isRenewal
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to proceed';
      setSubmitError(errorMessage);
      setError(errorMessage);
    }
  };

  if (loadingSubscription) {
    return (
      <div className="w-full max-w-5xl mx-auto py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-400">Checking subscription status...</p>
      </div>
    );
  }

  const isCurrentPlanSelected = currentSubscription && 
    selectedPlanId.toLowerCase().includes(currentSubscription.tier.toLowerCase());

  const isExpired = currentSubscription && currentSubscription.tier !== 'Free' && currentSubscription.endDate < new Date();

  return (
    <div className="w-full max-w-5xl mx-auto text-white">
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 backdrop-blur-xl shadow-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Choose Your Plan</h2>
          <p className="text-gray-400 mt-2">
            Select a subscription plan that works best for your school
          </p>
        </div>

        {/* Current Subscription Info */}
        {currentSubscription && (
          <div className={`mb-8 p-6 rounded-2xl border ${isExpired ? 'bg-red-500/10 border-red-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 p-2 rounded-full ${isExpired ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                {isExpired ? <AlertCircle className="w-6 h-6 text-red-400" /> : <Check className="w-6 h-6 text-blue-400" />}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {isExpired ? 'Expired' : 'Active'} {currentSubscription.tier} Plan
                </h3>
                <p className="text-sm text-gray-400">
                  {isExpired ? 'Expired' : 'Expires'} on <span className="text-white font-medium">{currentSubscription.endDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</span>
                </p>
              </div>
              <Button 
                onClick={() => setShowPlansGrid(true)}
                variant="outline" 
                className={`${isExpired ? 'border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300' : 'border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300'} rounded-xl`}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {isExpired ? 'Renew Subscription' : 'Extend/Change Subscription'}
              </Button>
            </div>
          </div>
        )}

        {submitError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{submitError}</p>
          </div>
        )}

        {(!currentSubscription || isExpired || showPlansGrid || currentSubscription.tier === 'Free') && (
          <>
            {/* Billing Period Toggle */}
            <div className="mb-8 flex justify-center">
              <div className="inline-flex rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-1">
                {(['term', 'year'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setBillingPeriod(period)}
                    className={`px-8 py-2.5 rounded-lg transition-all font-bold text-sm ${
                      billingPeriod === period
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {period === 'term' && 'Per Term'}
                    {period === 'year' && 'Annually (Save 17%)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {filteredPlans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`relative rounded-3xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col hover:scale-[1.02] ${
                      isSelected
                        ? 'border-blue-400 bg-blue-500/10 ring-4 ring-blue-500/5'
                        : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.02)]'
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg">
                        Popular
                      </div>
                    )}

                    <div className="p-8 flex-1">
                      <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                      <p className="text-sm text-gray-400 mt-1 font-medium">{plan.description}</p>
                      <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                        👥 {plan.studentCount} students
                      </div>

                      <div className="mt-8 mb-8">
                        <div className="text-4xl font-black text-white tracking-tighter">
                          {plan.price === 0 ? 'Free' : `₦${plan.price.toLocaleString()}`}
                        </div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{plan.duration}</div>
                      </div>

                      <div className="space-y-4">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="mt-1 bg-green-500/20 p-0.5 rounded-full border border-green-500/30">
                              <Check className="h-3 w-3 text-green-400 flex-shrink-0" />
                            </div>
                            <span className="text-[13px] text-gray-300 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="bg-blue-500/20 py-3 text-center border-t border-blue-400/30">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Selected Plan</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="border-t border-[rgba(255,255,255,0.07)] pt-8 flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isLoading}
            className="bg-transparent border-[rgba(255,255,255,0.2)] text-gray-300 hover:bg-white/5 hover:text-white rounded-xl h-12 px-8 font-bold"
          >
            Back to Step 5
          </Button>
          <Button
            onClick={() => handleProceed(false)}
            disabled={isLoading || !selectedPlanId}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[240px] h-12 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
          >
            {isLoading ? 'Processing...' : 
             (currentSubscription && isCurrentPlanSelected && !isExpired) ? 'Next: Add Students' : 
             (currentSubscription && isCurrentPlanSelected && isExpired) ? 'Renew & Proceed to Payment' :
             selectedPlanId === 'free' ? 'Next: Add Students' : 'Proceed to Payment'}
          </Button>
        </div>
      </div>
    </div>
  );
};
