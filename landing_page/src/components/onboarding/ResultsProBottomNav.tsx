import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  href?: string;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: React.ReactNode;
  backLabel?: React.ReactNode;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
  isSticky?: boolean;
}

export function ResultsProBottomNav({ 
  href, 
  onNext, 
  onBack, 
  nextLabel = "Next", 
  backLabel = "Back", 
  isNextDisabled = false,
  isNextLoading = false,
  isSticky = false
}: Props) {
  
  const nextButtonClass = `h-[2.5rem] rounded-full font-bold text-xs flex items-center gap-2.5 transition-all ${!isNextDisabled && !isNextLoading ? 'bg-[#146ef5] hover:bg-[#146ef5]/90 text-white shadow-md hover:-translate-y-0.5' : 'bg-[#708bf4]/50 text-white/80 pointer-events-none'}`;
  
  const backButtonClass = `h-[2.5rem] rounded-full font-bold text-xs flex items-center gap-2.5 transition-all bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50 shadow-sm`;

  const containerClass = isSticky
    ? "w-full shrink-0 border-t border-gray-200 flex sticky bottom-0 bg-[#fafbfc] py-6 z-10 mt-auto"
    : "w-full border-t border-gray-200 flex mt-auto";

  return (
    <div className={`${containerClass} ${onBack ? 'justify-between' : 'justify-end'}`} style={!isSticky ? { paddingTop: '2rem', paddingBottom: '2rem' } : {}}>
      
      {onBack && (
        <button type="button" onClick={onBack} className={backButtonClass} style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </button>
      )}

      {href ? (
        <Link 
          href={href}
          className={nextButtonClass}
          style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
        >
          {nextLabel} <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <button 
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isNextLoading}
          className={nextButtonClass}
          style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
        >
          {isNextLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>{nextLabel} <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      )}
    </div>
  );
}
