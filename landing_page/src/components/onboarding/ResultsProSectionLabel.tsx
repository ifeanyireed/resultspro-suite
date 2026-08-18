import React from 'react';

interface Props {
  label: string;
}

export function ResultsProSectionLabel({ label }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-3.5 bg-blue-600 rounded-full"></div>
      <span className="text-[10.5px] font-bold text-gray-400 tracking-[0.2em] uppercase">{label}</span>
    </div>
  );
}
