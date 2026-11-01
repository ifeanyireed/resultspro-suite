'use client';

import React from 'react';
import Image from 'next/image';

interface WelcomeBannerProps {
  title: string;
  description: string;
  monsterSrc: string;
  backgroundColor?: string;
}

export default function WelcomeBanner({ 
  title, 
  description, 
  monsterSrc, 
  backgroundColor = '#146ef5' 
}: WelcomeBannerProps) {
  return (
    <div 
      className="relative overflow-hidden rounded-[1.5rem] p-8 text-white flex justify-between items-center shadow-sm" 
      style={{ backgroundColor }}
    >
      <div className="relative z-10 max-w-lg">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
        <p className="text-white/90 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="absolute right-8 bottom-0 translate-y-2">
         <Image src={monsterSrc} alt="Monster" width={160} height={160} className="object-contain" />
      </div>
    </div>
  );
}
