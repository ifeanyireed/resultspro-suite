import React from 'react';
import { ChevronRight } from '@/lib/hugeicons-compat';

interface FeatureCardProps {
  preview?: React.ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
  isImagePreview?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  preview, 
  title, 
  description, 
  buttonText = 'Learn More →',
  onClick,
  isImagePreview = false
}) => {
  return (
    <div 
      className="relative min-h-[400px] rounded-[30px] border shadow-[0_1px_3px_0_rgba(199,220,255,0.30)_inset,0_0_60px_0_rgba(198,204,255,0.22)_inset,0_1px_22px_0_rgba(255,255,255,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.05)] p-8 overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer flex flex-col group border-solid border-[rgba(255,255,255,0.07)]"
      onClick={onClick}
    >
      {/* Random dots effect - grid pattern with omitted cells */}
      <div className="absolute inset-0 overflow-hidden rounded-[30px] pointer-events-none">
        {[...Array(6)].map((_, row) =>
          [...Array(8)].map((_, col) => {
            // Randomly omit some cells (70% chance of showing)
            const show = Math.random() > 0.3;
            if (!show) return null;
            
            const left = (col * 100) / 8 + Math.random() * 8;
            const top = (row * 100) / 6 + Math.random() * 8;
            const size = Math.random() * 2 + 1;
            const opacity = Math.random() * 0.3 + 0.15;
            
            return (
              <div
                key={`${row}-${col}`}
                className="absolute rounded-full bg-white/20"
                style={{
                  width: size + 'px',
                  height: size + 'px',
                  left: left + '%',
                  top: top + '%',
                  opacity: opacity,
                }}
              />
            );
          })
        )}
      </div>
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Preview Section */}
      {preview && (
        <div className="relative z-10 mb-8">
          {isImagePreview ? (
            <>
              {preview}
            </>
          ) : (
            <div className="rounded-[8px] border-[0.75px] border-solid border-[rgba(255,255,255,0.10)] backdrop-blur-[10px] bg-[rgba(0,0,0,0.40)] p-4">
              {preview}
            </div>
          )}
        </div>
      )}

      {/* Content - grows to fill available space */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-4 leading-tight drop-shadow-[0_0_8px_rgba(198,220,255,0.4)]">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-[14px] font-normal leading-[1.6] text-gray-400 opacity-70 mb-6 flex-1 drop-shadow-[0_0_4px_rgba(198,220,255,0.15)]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
