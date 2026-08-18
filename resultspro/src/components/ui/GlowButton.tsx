import React from 'react';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const GlowButton: React.FC<GlowButtonProps> = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`justify-center items-center border shadow-[0_10px_40px_0_rgba(63,74,175,0.50),0_10px_30px_0_rgba(73,123,255,0.70)_inset] backdrop-blur-[10px] flex gap-3 text-sm text-white font-medium text-center leading-none px-[30px] py-3 rounded-[10px] border-solid border-[rgba(39,55,207,0.40)] hover:shadow-[0_15px_50px_0_rgba(63,74,175,0.60),0_15px_40px_0_rgba(73,123,255,0.80)_inset] transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default GlowButton;
