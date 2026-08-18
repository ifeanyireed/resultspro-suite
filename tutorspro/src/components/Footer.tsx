import Link from 'next/link';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="py-16 px-4 border-t border-white/5 bg-navy/20">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
        <Logo imageSize={28} textSize="text-lg" />
        
        <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          <Link href="/about" className="text-gray-500 hover:text-green text-xs font-bold uppercase tracking-widest transition-colors">About Us</Link>
          <Link href="/contact" className="text-gray-500 hover:text-green text-xs font-bold uppercase tracking-widest transition-colors">Contact</Link>
          <Link href="/faq" className="text-gray-500 hover:text-green text-xs font-bold uppercase tracking-widest transition-colors">FAQ</Link>
          <Link href="/blog" className="text-gray-500 hover:text-green text-xs font-bold uppercase tracking-widest transition-colors">Blog</Link>
        </nav>

        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            &copy; 2026 ResultsPro / resultspro.ng. All rights reserved.
          </p>
          <div className="w-12 h-1 bg-green/20 rounded-full" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
