import { create } from 'zustand';

export interface Step1Data {
  motto?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  contactPersonName?: string;
  contactPhone?: string;
  altContactEmail?: string;
}

export interface Step2Data {
  academicSessionName?: string;
  startDate?: string;
  endDate?: string;
  terms?: Array<{
    name: string;
    startDate: string;
    endDate: string;
  }>;
}

export interface Step3Data {
  classes?: Array<{
    name: string;
    classLevel: string;
  }>;
}

export interface Step4Data {
  subjects?: Array<{
    name: string;
    classId?: string;
  }>;
}

export interface Step5Data {
  gradingSystem?: {
    template?: string; // e.g., 'standard', 'weighted'
    gradeScale?: Array<{
      grade: string;
      minScore: number;
      maxScore: number;
    }>;
  };
}

export interface Step6Data {
  selectedPlanId?: string;
  paymentMethod?: 'paystack'; // Can add more payment methods later
}

export interface Step7Data {
  students?: Array<{
    id: string;
    classId: string;
    className: string;
    name: string;
    admissionNumber: string;
    parentEmail?: string;
  }>;
}

interface OnboardingState {
  // Step data
  step1Data: Step1Data | null;
  step2Data: Step2Data | null;
  step3Data: Step3Data | null;
  step4Data: Step4Data | null;
  step5Data: Step5Data | null;
  step6Data: Step6Data | null;
  step7Data: Step7Data | null;

  // Current step (1-7)
  currentStep: number;

  // Completed steps
  completedSteps: number[];

  // Error message
  error: string | null;

  // Loading state
  isLoading: boolean;

  // Actions
  setStep1Data: (data: Step1Data) => void;
  setStep2Data: (data: Step2Data) => void;
  setStep3Data: (data: Step3Data) => void;
  setStep4Data: (data: Step4Data) => void;
  setStep5Data: (data: Step5Data) => void;
  setStep6Data: (data: Step6Data) => void;
  setStep7Data: (data: Step7Data) => void;

  // Navigation
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Status
  markStepComplete: (step: number) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;

  // Reset
  reset: () => void;

  // Get all data
  getAllData: () => {
    step1: Step1Data | null;
    step2: Step2Data | null;
    step3: Step3Data | null;
    step4: Step4Data | null;
    step5: Step5Data | null;
    step6: Step6Data | null;
    step7: Step7Data | null;
  };
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  step1Data: null,
  step2Data: null,
  step3Data: null,
  step4Data: null,
  step5Data: null,
  step6Data: null,
  step7Data: null,
  currentStep: 1,
  completedSteps: [],
  error: null,
  isLoading: false,

  setStep1Data: (data) =>
    set({ step1Data: data }),
  setStep2Data: (data) =>
    set({ step2Data: data }),
  setStep3Data: (data) =>
    set({ step3Data: data }),
  setStep4Data: (data) =>
    set({ step4Data: data }),
  setStep5Data: (data) =>
    set({ step5Data: data }),
  setStep6Data: (data) =>
    set({ step6Data: data }),
  setStep7Data: (data) =>
    set({ step7Data: data }),

  goToStep: (step) =>
    set({ currentStep: Math.max(1, Math.min(7, step)) }),
  nextStep: () => {
    const { currentStep } = get();
    set({ currentStep: Math.min(7, currentStep + 1) });
  },
  previousStep: () => {
    const { currentStep } = get();
    set({ currentStep: Math.max(1, currentStep - 1) });
  },

  markStepComplete: (step) =>
    set((state) => ({
      completedSteps: [...new Set([...state.completedSteps, step])],
    })),

  setError: (error) => set({ error }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  reset: () =>
    set({
      step1Data: null,
      step2Data: null,
      step3Data: null,
      step4Data: null,
      step5Data: null,
      step6Data: null,
      step7Data: null,
      currentStep: 1,
      completedSteps: [],
      error: null,
      isLoading: false,
    }),

  getAllData: () => {
    const state = get();
    return {
      step1: state.step1Data,
      step2: state.step2Data,
      step3: state.step3Data,
      step4: state.step4Data,
      step5: state.step5Data,
      step6: state.step6Data,
      step7: state.step7Data,
    };
  },
}));
