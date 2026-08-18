import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/lib/axiosConfig';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { StepIndicator } from './StepIndicator';
import { Step1SchoolProfile } from './steps/Step1SchoolProfile';
import { Step2AcademicSession } from './steps/Step2AcademicSession';
import { Step3Classes } from './steps/Step3Classes';
import { Step4Subjects } from './steps/Step4Subjects';
import { Step5GradingSystem } from './steps/Step5GradingSystem';
import { Step6PaymentPlans } from './steps/Step6PaymentPlans';
import { Step7AddStudents } from './steps/Step7AddStudents';
import { useToast } from '@/hooks/use-toast';

export const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiStatus, setApiStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const [schoolName, setSchoolName] = useState<string>('');
  const [classes, setClasses] = useState<any[]>([]);

  const {
    currentStep,
    completedSteps,
    isLoading,
    error,
    setStep1Data,
    setStep2Data,
    setStep3Data,
    setStep4Data,
    setStep5Data,
    setStep6Data,
    setStep7Data,
    nextStep,
    previousStep,
    goToStep,
    markStepComplete,
    setIsLoading,
    setError,
    step1Data,
    step2Data,
    step3Data,
    step4Data,
    step5Data,
    step6Data,
    step7Data,
    reset,
  } = useOnboardingStore();

  // Check API and fetch current status
  useEffect(() => {
    const checkApi = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
        if (!token) {
          navigate('/auth/login', { replace: true });
          return;
        }

        const healthRes = await axiosInstance.get('/health');
        if (healthRes.status === 200) {
          setApiStatus('ready');

          const statusRes = await axiosInstance.get('/onboarding/status');
          const statusData = statusRes.data.data;

          if (statusData?.schoolName) {
            setSchoolName(statusData.schoolName);
          }

          const currentStepNum = statusData.currentStep || 1;
          const completedStepsArr = statusData.completedSteps || [];
          
          completedStepsArr.forEach((step: number) => {
            markStepComplete(step);
          });
          
          // Check if we're returning from payment
          const returnStep = localStorage.getItem('onboarding_return_step');
          if (returnStep) {
            const stepNum = parseInt(returnStep);
            goToStep(stepNum);
            localStorage.removeItem('onboarding_return_step');
            
            if (stepNum === 7) {
              toast({ title: 'Success', description: 'Payment verified! Let\'s finish adding students.' });
            }
          } else {
            goToStep(currentStepNum);
          }

          if (completedStepsArr.includes(1) && currentStepNum > 1) {
            setStep1Data({
              motto: statusData.motto || '',
              logoUrl: statusData.logoUrl || '',
              primaryColor: statusData.primaryColor || '#1e40af',
              secondaryColor: statusData.secondaryColor || '#0ea5e9',
              accentColor: statusData.accentColor || '#f59e0b',
              contactPersonName: statusData.contactPersonName || '',
              contactPhone: statusData.contactPhone || '',
              altContactEmail: statusData.altContactEmail || '',
            });
          }

          if (completedStepsArr.includes(2) && currentStepNum > 2) {
            setStep2Data({
              academicSessionName: statusData.academicSessionName || '',
              startDate: statusData.startDate ? statusData.startDate.split('T')[0] : '',
              endDate: statusData.endDate ? statusData.endDate.split('T')[0] : '',
              terms: (statusData.terms || []).map((term: any) => ({
                name: term.name || '',
                startDate: term.startDate ? term.startDate.split('T')[0] : '',
                endDate: term.endDate ? term.endDate.split('T')[0] : '',
              })),
            });
          }

          if (statusData.classes && Array.isArray(statusData.classes)) {
            setClasses(statusData.classes);
          }

          if (completedStepsArr.includes(3) || (statusData.classes && statusData.classes.length > 0)) {
            setStep3Data({
              classes: statusData.classes || [],
            });
          }

          if (statusData.subjects && Array.isArray(statusData.subjects) && statusData.subjects.length > 0) {
            // Step 4 expects a flat array of { name, classId }
            // But backend returns subjects with classIds array
            const flattenedSubjects: any[] = [];
            statusData.subjects.forEach((subject: any) => {
              if (subject.classIds && subject.classIds.length > 0) {
                subject.classIds.forEach((classId: string) => {
                  flattenedSubjects.push({
                    name: subject.name || '',
                    classId: classId,
                  });
                });
              } else if (subject.classId) {
                flattenedSubjects.push({
                  name: subject.name || '',
                  classId: subject.classId,
                });
              }
              // We removed the 'else' block that was pushing subjects with empty classId
            });
            
            setStep4Data({
              subjects: flattenedSubjects,
            });
          }

          if (statusData.gradingSystem) {
            setStep5Data({
              gradingSystem: {
                template: statusData.gradingSystem.template || 'standard',
                gradeScale: statusData.gradingSystem.gradeScale || [],
              },
            });
          }

          // Populate Step 6 (Payment Plan) from backend status
          if (statusData.subscriptionTier) {
            const tier = statusData.subscriptionTier.toLowerCase();
            if (tier === 'free') {
              setStep6Data({ selectedPlanId: 'free' });
            } else if (tier !== 'none' && tier !== 'basic') {
              // Try to determine if it's term or year based on dates if available
              let suffix = 'year';
              if (statusData.subscriptionStartDate && statusData.subscriptionEndDate) {
                const start = new Date(statusData.subscriptionStartDate);
                const end = new Date(statusData.subscriptionEndDate);
                const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
                // ~150 days is about 5 months, a typical term
                if (diffDays < 150) suffix = 'term';
              }
              setStep6Data({ selectedPlanId: `${tier}-${suffix}` });
            }
          }
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          navigate('/auth/login', { replace: true });
          return;
        }
        setApiStatus('error');
      }
    };

    checkApi();
  }, [navigate, goToStep, markStepComplete, setStep1Data, setStep2Data, setStep3Data, setStep4Data, setStep5Data, setStep6Data, setStep7Data]);

  const handleStep1Next = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/onboarding/step/1', data);
      if (response.data.success) {
        setStep1Data(data);
        markStepComplete(1);
        nextStep();
        toast({ title: 'Success', description: 'School profile saved successfully' });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to save school profile';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Next = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/onboarding/step/2', data);
      if (response.data.success) {
        setStep2Data(data);
        markStepComplete(2);
        nextStep();
        toast({ title: 'Success', description: 'Academic session saved successfully' });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to save academic session';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Next = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/onboarding/step/3', data);
      if (response.data.success) {
        setStep3Data(data);
        // Refresh classes state from response to ensure Step 4 has the latest data
        if (response.data.data?.classes) {
          setClasses(response.data.data.classes);
        }
        markStepComplete(3);
        nextStep();
        toast({ title: 'Success', description: 'Classes saved successfully' });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to save classes';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep4Next = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/onboarding/step/4', data);
      if (response.data.success) {
        setStep4Data(data);
        markStepComplete(4);
        nextStep();
        toast({ title: 'Success', description: 'Subjects saved successfully' });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to save subjects';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep5Next = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/onboarding/step/5', data);
      if (response.data.success) {
        setStep5Data(data);
        markStepComplete(5);
        nextStep();
        toast({ title: 'Success', description: 'Grading system saved successfully' });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to save grading system';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep6Next = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/onboarding/step/6', data);
      if (response.data.success) {
        setStep6Data(data);
        markStepComplete(6);

        const isFreeplan = data?.selectedPlanId === 'free';
        
        // If not free plan and user doesn't have an active subscription (handled by backend or passed from data),
        // initialize payment. Step6PaymentPlans component will pass forceRenew if user clicked renew.
        if (!isFreeplan && (data.forceRenew || !data.hasActiveSubscription)) {
          const planName = data.selectedPlanId?.includes('pro') ? 'Pro' : 'Enterprise';
          const amount = data.selectedPlanId?.includes('pro-term') ? 50000 : 
                         data.selectedPlanId?.includes('pro-year') ? 150000 :
                         data.selectedPlanId?.includes('enterprise-term') ? 200000 : 600000;

          const billingPeriod = data.selectedPlanId?.includes('year') ? 'year' : 'term';
          const initPaymentRes = await axiosInstance.post('/payment/initialize', {
            planId: data.selectedPlanId,
            planName,
            amount,
            billingPeriod,
          });

          if (initPaymentRes.data?.success && initPaymentRes.data?.data?.authorizationUrl) {
            // Store current step in localStorage to return to it after payment
            localStorage.setItem('onboarding_return_step', '7');
            window.location.href = initPaymentRes.data.data.authorizationUrl;
            return;
          } else {
            throw new Error(initPaymentRes.data?.error || 'Failed to initialize payment');
          }
        }

        nextStep();
        toast({ title: 'Success', description: 'Plan selection saved successfully' });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to save plan selection';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep7Next = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/onboarding/step/7', data);
      if (response.data.success) {
        setStep7Data(data);
        markStepComplete(7);

        await axiosInstance.post('/onboarding/complete', {});
        setIsLoading(false);
        navigate('/school-admin/overview', { replace: true });
        toast({ title: 'Success', description: 'Onboarding completed! Welcome to Results Pro' });
      }
    } catch (err: any) {
      setIsLoading(false);
      const msg = err?.response?.data?.error || err?.message || 'Failed to complete setup';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  if (apiStatus === 'error') {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] backdrop-blur-xl shadow-2xl p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Server Connection Error</h2>
          <p className="text-gray-300 mb-6">Could not connect to the backend server. Please ensure the server is running on port 5000.</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">Retry</button>
        </div>
      </div>
    );
  }

  if (apiStatus === 'checking') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-300">Loading onboarding wizard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">School Setup Wizard</h1>
              <p className="text-gray-400 text-sm">Configure your school settings to get started with ResultsPRO</p>
            </div>
            {schoolName && (
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium">{schoolName}</div>
            )}
          </div>
          <div className="bg-white/5 rounded-[30px] border border-white/10 p-2 backdrop-blur-md">
            <StepIndicator currentStep={currentStep} completedSteps={completedSteps} totalSteps={7} />
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] backdrop-blur-xl shadow-2xl p-8 mb-8">
          {currentStep === 1 && <Step1SchoolProfile onNext={handleStep1Next} onPrevious={handlePrevious} initialData={step1Data || undefined} isLoading={isLoading} />}
          {currentStep === 2 && <Step2AcademicSession onNext={handleStep2Next} onPrevious={handlePrevious} initialData={step2Data || undefined} isLoading={isLoading} />}
          {currentStep === 3 && <Step3Classes onNext={handleStep3Next} onPrevious={handlePrevious} initialData={step3Data || undefined} isLoading={isLoading} />}
          {currentStep === 4 && <Step4Subjects onNext={handleStep4Next} onPrevious={handlePrevious} initialData={step4Data || undefined} classes={classes} isLoading={isLoading} />}
          {currentStep === 5 && <Step5GradingSystem onNext={handleStep5Next} onPrevious={handlePrevious} initialData={step5Data || undefined} isLoading={isLoading} />}
          {currentStep === 6 && <Step6PaymentPlans onNext={handleStep6Next} onPrevious={handlePrevious} initialData={step6Data || undefined} isLoading={isLoading} />}
          {currentStep === 7 && <Step7AddStudents onNext={handleStep7Next} onPrevious={handlePrevious} initialData={step7Data || undefined} isLoading={isLoading} />}
        </div>

        {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-[15px] text-red-400 text-sm mb-8">{error}</div>}
        <div className="text-center text-sm text-gray-500 py-4"><p>Questions? Contact support@resultspro.ng</p></div>
      </div>
    </div>
  );
};
