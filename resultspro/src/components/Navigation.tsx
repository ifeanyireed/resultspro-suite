import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md" style={{
      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0) 100%)'
    }}>
      <div className="flex items-center justify-between h-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Results Pro" className="h-10 w-auto" />
          <span className="font-bold text-lg text-white hidden sm:inline">Results Pro</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          {['Features', 'Pricing', 'Blog', 'Agents', 'About', 'Contact', 'Support', 'Results', 'Scratch Card'].map((item, index) => (
            <Link 
              key={item}
              to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="justify-center items-center shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] flex gap-2 overflow-hidden px-4 py-1.5 rounded-[74.25px] transition-colors text-gray-300 hover:text-white text-sm font-medium hover:bg-[rgba(255,255,255,0.05)]"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Auth Links */}
        <div className="flex items-center gap-3">
          <Link 
            to="/auth/login" 
            className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium px-4 py-2"
          >
            Login
          </Link>
          <Link 
            to="/auth/register"
            className="items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-4 py-2 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
