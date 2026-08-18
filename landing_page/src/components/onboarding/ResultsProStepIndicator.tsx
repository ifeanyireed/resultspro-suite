import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface Step {
  id: string | number;
  icon: LucideIcon;
  label: string;
}

interface Props {
  steps: Step[];
  activeStepId: string | number;
  onStepClick?: (stepId: string | number) => void;
}

export function ResultsProStepIndicator({ steps, activeStepId, onStepClick }: Props) {
  return (
    <div className="sticky top-0 z-50 w-full shrink-0 pt-4 pb-4 flex justify-center border-b border-gray-100 bg-white/50 backdrop-blur-sm" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <div className="flex items-center gap-8 md:gap-16 overflow-x-auto px-6 py-2 hide-scrollbar" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        {steps.map((step) => {
          const isActive = step.id === activeStepId;
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-2 shrink-0 p-2 cursor-pointer group"
              onClick={() => onStepClick && onStepClick(step.id)}
            >
              <div
                className={`w-[44px] h-[44px] rounded-full flex items-center justify-center p-[3px] bg-transparent transition-all duration-300
                  ${isActive
                    ? 'border border-blue-600'
                    : 'border border-transparent group-hover:border-blue-600'
                  }`}
              >
                <div
                  className={`w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all duration-300
                    ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white'
                    }`}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              </div>
              <span className={`text-[9.5px] font-bold tracking-widest transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
