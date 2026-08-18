import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  inline?: boolean;
  text?: string;
}

/**
 * Unified Loading Spinner Component
 * Provides consistent loading animation across the entire application
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  inline = false,
  text,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const containerClass = inline ? 'inline-flex items-center gap-2' : 'flex flex-col items-center justify-center gap-3';

  return (
    <div className={containerClass}>
      <Loader2 className={`${sizeMap[size]} animate-spin text-blue-600 ${className}`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

/**
 * Inline Loading Indicator - for use within buttons or inline elements
 */
export const InlineLoadingSpinner: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  };

  return <Loader2 className={`${sizeMap[size]} animate-spin mr-2`} />;
};

/**
 * Full Page Loading Overlay
 */
export const FullPageLoadingSpinner: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

export default LoadingSpinner;
