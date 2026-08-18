import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '@/lib/axiosConfig';
import { useToast } from '@/hooks/use-toast';
import { ResultsSetupStepIndicator } from './StepIndicator';
import {
  Step1SelectSessionTerm,
  Step2ExamConfig,
  Step3AffectiveDomain,
  Step4PsychomotorDomain,
  Step5StaffUploads,
  Step6ResultsCSV,
} from './steps';

interface ResultsSetupState {
  currentStep: number;
  completedSteps: number[];
  isLoading: boolean;
  error: string | null;
  schoolName: string | null;
  sessionTermData: any;
  step2Data: any;
  step3Data: any;
  step4Data: any;
  step5Data: any;
  step6Data: any;
  isEditMode: boolean;
  instanceId: string | null;
}

export const ResultsSetupWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [state, setState] = useState<ResultsSetupState>({
    currentStep: 1,
    completedSteps: [],
    isLoading: false,
    error: null,
    schoolName: null,
    sessionTermData: null,
    step2Data: null,
    step3Data: null,
    step4Data: null,
    step5Data: null,
    step6Data: null,
    isEditMode: false,
    instanceId: null,
  });

  // Check authentication and fetch current setup status
  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
        if (!token) {
          navigate('/auth/login', { replace: true });
          return;
        }

        const schoolId = localStorage.getItem('schoolId');
        if (!schoolId) {
          navigate('/auth/login', { replace: true });
          return;
        }

        // Fetch school info
        const schoolRes = await axiosInstance.get(`/onboarding/school/${schoolId}`);

        if (schoolRes.data.data?.name) {
          updateState({ schoolName: schoolRes.data.data.name });
        }

        // Check for instanceId or fresh flag in URL
        const searchParams = new URLSearchParams(location.search);
        const instanceId = searchParams.get('instanceId');
        const isFreshStart = searchParams.get('fresh') === 'true';

        if (instanceId) {
          // EDIT MODE: Load a specific instance
          try {
            updateState({ isLoading: true, isEditMode: true, instanceId });
            const instanceRes = await axiosInstance.get(`/results-setup/instances/${instanceId}`);

            if (instanceRes.data.success) {
              const inst = instanceRes.data.data;
              
              updateState({
                currentStep: 1,
                completedSteps: [1, 2, 3, 4, 5, 6], // Mark all steps as complete in edit mode
                sessionTermData: {
                  sessionId: inst.sessionId,
                  sessionName: inst.sessionName,
                  termId: inst.termId,
                  termName: inst.termName,
                  instanceName: inst.instanceName,
                  classId: inst.classId,
                },
                step2Data: {
                  components: inst.examConfigComponents || [],
                },
                step3Data: {
                  traits: inst.affectiveTraits || [],
                },
                step4Data: {
                  skills: inst.psychomotorSkills || [],
                },
                step5Data: {
                  principalName: inst.principalName,
                  staffData: inst.staffData || [],
                },
                step6Data: {
                  resultsFileUrl: inst.csvFileUrl,
                  resultsFileName: inst.csvFileName,
                  gradebookData: inst.gradebookData || [],
                },
                isLoading: false
              });
            }
          } catch (error: any) {
            console.error('Failed to load instance for editing:', error);
            updateState({ error: 'Failed to load instance for editing', isLoading: false });
          }
        } else if (isFreshStart) {
          // NEW INSTANCE: Start fresh
          console.log('Starting fresh results instance wizard');
          updateState({
            currentStep: 1,
            completedSteps: [],
            isEditMode: false,
            instanceId: null
          });
        } else {
          // RESUME MODE: Fetch current active session
          try {
            const setupRes = await axiosInstance.get('/results-setup/session');

            if (setupRes.data.data) {
              const session = setupRes.data.data;
              const completedSteps = JSON.parse(session.completedSteps || '[]');
              const nextStep = completedSteps.length > 0 ? Math.max(...completedSteps) + 1 : 1;

              updateState({
                currentStep: nextStep > 6 ? 6 : nextStep,
                completedSteps: completedSteps,
                sessionTermData: session.sessionId ? {
                  sessionId: session.sessionId,
                  sessionName: session.sessionName,
                  termId: session.termId,
                  termName: session.termName,
                } : null,
                step2Data: session.examConfigComponents ? { components: JSON.parse(session.examConfigComponents) } : null,
                step3Data: session.affectiveTraits ? { traits: JSON.parse(session.affectiveTraits) } : null,
                step4Data: session.psychomotorSkills ? { skills: JSON.parse(session.psychomotorSkills) } : null,
                step5Data: (session.principalName || session.staffData) ? {
                  principalName: session.principalName,
                  principalSignatureUrl: session.principalSignatureUrl,
                  staffData: JSON.parse(session.staffData || '[]'),
                } : null,
                step6Data: session.resultsFileUrl ? {
                  resultsFileUrl: session.resultsFileUrl,
                  resultsFileName: session.resultsFileName,
                } : null,
              });
            }
          } catch (error: any) {
            console.log('No existing results setup session found, starting fresh');
          }
        }
      } catch (error) {
        console.error('Setup status check error:', error);
      }
    };

    checkSetupStatus();
  }, [navigate, location.search]);

  const updateState = (updates: Partial<ResultsSetupState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleNextStep = async (data: any) => {
    updateState({ isLoading: false });
    const nextStep = state.currentStep + 1;
    
    // Store data locally
    const updates: any = {};
    if (state.currentStep === 1) updates.sessionTermData = data;
    else if (state.currentStep === 2) updates.step2Data = data;
    else if (state.currentStep === 3) updates.step3Data = data;
    else if (state.currentStep === 4) updates.step4Data = data;
    else if (state.currentStep === 5) updates.step5Data = data;
    else if (state.currentStep === 6) updates.step6Data = data;

    updateState(updates);

    if (state.currentStep === 6) {
      // FINAL STEP: Complete or Update Instance
      try {
        if (state.isEditMode && state.instanceId) {
          // UPDATE EXISTING INSTANCE
          await axiosInstance.put(
            `/results-setup/instances/${state.instanceId}`,
            {
              instanceName: data.instanceName,
              sessionName: state.sessionTermData.sessionName,
              termName: state.sessionTermData.termName,
              // PRIORITIZE data from CSV step if provided
              examConfigComponents: data.examConfigComponents || state.step2Data?.components,
              affectiveTraits: state.step3Data?.traits,
              psychomotorSkills: state.step4Data?.skills,
              csvFileName: data.resultsFileName,
              csvFileUrl: data.resultsFileUrl,
              gradebookData: data.gradebookData,
              totalStudents: data.totalStudents,
            }
          );
          toast({ title: 'Success', description: 'Results instance updated successfully' });
        } else {
          // CREATE NEW INSTANCE
          await axiosInstance.post(
            '/results-setup/instances',
            {
              classId: data.classId || state.sessionTermData.classId,
              sessionId: state.sessionTermData.sessionId,
              termId: state.sessionTermData.termId,
              sessionName: state.sessionTermData.sessionName,
              termName: state.sessionTermData.termName,
              instanceName: data.instanceName,
              // PRIORITIZE data from CSV step if provided
              examConfigComponents: data.examConfigComponents || state.step2Data?.components,
              affectiveTraits: state.step3Data?.traits,
              psychomotorSkills: state.step4Data?.skills,
              csvFileName: data.resultsFileName,
              csvFileUrl: data.resultsFileUrl,
              gradebookData: data.gradebookData,
              totalStudents: data.totalStudents,
            }
          );

          // Also mark results setup as complete for the school
          await axiosInstance.post('/onboarding/mark-results-setup-complete', {});
          
          toast({ title: 'Success', description: 'Results instance created successfully!' });
        }
        
        navigate('/school-admin/results-entry', { replace: true });
        return;
      } catch (error: any) {
        console.error('Final step error:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to complete setup',
          variant: 'destructive',
        });
        return;
      }
    }

    // Update completed steps and move to next
    const newCompletedSteps = [...state.completedSteps];
    if (!newCompletedSteps.includes(state.currentStep)) {
      newCompletedSteps.push(state.currentStep);
    }

    updateState({
      currentStep: nextStep,
      completedSteps: newCompletedSteps,
    });
  };

  const handlePreviousStep = () => {
    if (state.currentStep > 1) {
      updateState({
        currentStep: state.currentStep - 1,
      });
    }
  };

  const renderStep = () => {
    const stepProps = {
      onNext: handleNextStep,
      onPrevious: handlePreviousStep,
      isLoading: state.isLoading,
      sessionTermData: state.sessionTermData,
    };

    switch (state.currentStep) {
      case 1:
        return <Step1SelectSessionTerm {...stepProps} initialData={state.sessionTermData} isEditMode={state.isEditMode} />;
      case 2:
        return <Step2ExamConfig {...stepProps} initialData={state.step2Data} />;
      case 3:
        return <Step3AffectiveDomain {...stepProps} initialData={state.step3Data} />;
      case 4:
        return <Step4PsychomotorDomain {...stepProps} initialData={state.step4Data} />;
      case 5:
        return <Step5StaffUploads {...stepProps} initialData={state.step5Data} />;
      case 6:
        return <Step6ResultsCSV {...stepProps} examConfig={state.step2Data} affectiveDomainData={state.step3Data} psychomotorDomainData={state.step4Data} initialData={state.step6Data} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Step Indicator */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {state.isEditMode ? 'Edit Results Setup' : 'Results Setup Wizard'}
            </h1>
            <p className="text-gray-400">Configure exam parameters and upload results data</p>
          </div>
          {state.schoolName && (
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium">
              {state.schoolName}
            </div>
          )}
        </div>

        {/* Step Indicator */}
        <div className="bg-white/5 rounded-[30px] border border-white/10 p-2">
          <ResultsSetupStepIndicator
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            totalSteps={6}
          />
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] backdrop-blur-xl shadow-2xl p-8">
        {state.isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : renderStep()}
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-[15px] text-red-400 text-sm">
          {state.error}
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>Questions? Contact support@resultspro.ng</p>
      </div>
    </div>
  );
};
