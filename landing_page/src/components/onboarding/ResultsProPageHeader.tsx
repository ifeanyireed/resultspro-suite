import React from 'react';

interface Props {
  title: string;
  subtitle: string;
  onReset?: () => void;
}

export function ResultsProPageHeader({ title, subtitle, onReset }: Props) {
  return (
    <div className="text-center mb-6 flex flex-col items-center">
      <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">{title}</h1>
      <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">{subtitle}</p>
      {onReset && (
        <button 
          onClick={onReset}
          className="text-[10.5px] font-bold text-gray-400 hover:text-red-500 tracking-[0.15em] uppercase transition-colors"
        >
          RESET PROGRESS & START OVER
        </button>
      )}
    </div>
  );
}
