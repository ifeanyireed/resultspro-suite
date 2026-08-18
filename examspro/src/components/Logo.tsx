import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  imageSize?: number;
  textSize?: string;
  showText?: boolean;
  href?: string;
  dark?: boolean;
  multiline?: boolean;
}

const Logo = ({ 
  className = "", 
  imageSize = 32, 
  textSize = "text-lg", 
  showText = true,
  href = "/",
  dark = false,
  multiline = false
}: LogoProps) => {
  return (
    <Link href={href} className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${className}`}>
      <Image 
        src="/logo.png" 
        alt="ResultsPRO Logo" 
        width={imageSize} 
        height={imageSize} 
        className="rounded-lg shadow-sm"
      />
      {showText && (
        <span className={`font-display font-bold ${textSize} ${dark ? 'text-navy' : 'text-white'} tracking-tight flex flex-col leading-none`}>
          ResultPRO 
          <span className="text-green text-[10px] uppercase tracking-[0.2em] mt-0.5">Exam Guide</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
