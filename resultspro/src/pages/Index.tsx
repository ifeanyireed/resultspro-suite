import React from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="relative bg-black min-h-screen">
      {/* Hero Background Image */}
      <img
        src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/1184745d503e17807cc4d9ad3bf3891899748379?placeholderIfAbsent=true"
        className="aspect-[1] object-contain w-full z-0 max-md:max-w-full"
        alt="Hero Background"
      />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <Features />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Decorative Lights */}
      <div className="absolute z-0 flex w-[819px] max-w-full flex-col overflow-hidden -translate-x-2/4 translate-y-[0%] h-[138px] pb-[137px] left-2/4 bottom-[298px] max-md:pb-[100px]">
        <div className="flex mb-[-27px] shrink-0 h-px max-md:max-w-full max-md:mb-2.5" />
      </div>
    </div>
  );
};

export default Index;
