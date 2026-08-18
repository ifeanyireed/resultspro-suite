import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ResultsProRoleCard({ id, title, description, icon: Icon, isSelected, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`text-left bg-white transition-all duration-300 ease-in-out border-2 outline-none
        ${isSelected 
          ? 'border-blue-600 shadow-[0_20px_50px_rgba(37,99,235,0.12)] -translate-y-1' 
          : 'border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1'
        }`}
      style={{ padding: '1.5rem 1.25rem', borderRadius: '1.75rem', minHeight: '170px', display: 'flex', flexDirection: 'column' }}
    >
      <div className="flex flex-col justify-end w-full flex-1 gap-4">
        <div>
          <Icon size={44} className={`text-[#146ef5] ${isSelected ? 'scale-110' : ''} transition-all duration-300`} strokeWidth={1} />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <h3 className={`!text-base md:!text-[1.1rem] font-bold leading-tight ![text-shadow:none] ${isSelected ? 'text-blue-600 !text-blue-600' : 'text-[#0f172a] !text-[#0f172a]'}`} style={{ letterSpacing: 'normal' }}>
            {title}
          </h3>

          <p className="!text-[10px] font-bold text-gray-400 !text-gray-400 ![text-shadow:none] uppercase tracking-widest leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
