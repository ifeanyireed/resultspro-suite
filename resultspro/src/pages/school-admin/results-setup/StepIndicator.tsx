import { CheckCircle, Calendar, Settings, Heart, Zap, Upload, FileText } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
  totalSteps?: number;
}

const stepLabels = [
  'Select Session & Term',
  'Exam Config',
  'Affective Domain',
  'Psychomotor Domain',
  'Staff Uploads',
  'Results CSV',
];

const stepIcons = [
  Calendar,
  Settings,
  Heart,
  Zap,
  Upload,
  FileText,
];

export const ResultsSetupStepIndicator = ({
  currentStep,
  completedSteps,
  totalSteps = 6,
}: StepIndicatorProps) => {
  return (
    <div className="w-full py-8 px-4">
      <div className="flex items-start justify-center gap-6 flex-wrap">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => {
          const IconComponent = stepIcons[index];
          
          return (
            <div key={step} className="flex flex-col items-center">
              {/* Step Circle with Icon */}
              <div className="relative">
                {completedSteps.includes(step) ? (
                  // Completed state
                  <div className="w-16 h-16 rounded-full bg-[rgba(34, 197, 94, 0.1)] border border-emerald-400 flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-8 h-8 text-emerald-400" strokeWidth={1} />
                  </div>
                ) : step === currentStep ? (
                  // Current step state
                  <div className="w-16 h-16 rounded-full bg-[rgba(59, 130, 246, 0.15)] border border-blue-400 flex items-center justify-center shadow-lg">
                    <IconComponent className="w-8 h-8 text-blue-400" strokeWidth={2} />
                  </div>
                ) : (
                  // Pending state
                  <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-gray-600" strokeWidth={1} />
                  </div>
                )}
              </div>

              {/* Step Label */}
              <p className="text-xs md:text-sm font-medium text-gray-400 mt-3 text-center max-w-[100px]">
                {stepLabels[index]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Progress Text */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-400">
          Step <span className="font-bold text-blue-400">{currentStep}</span> of{' '}
          <span className="font-bold text-gray-300">{totalSteps}</span>
        </p>
        {completedSteps.length > 0 && (
          <p className="text-xs text-emerald-400 mt-1">
            {completedSteps.length} of {totalSteps} steps completed
          </p>
        )}
      </div>
    </div>
  );
};
