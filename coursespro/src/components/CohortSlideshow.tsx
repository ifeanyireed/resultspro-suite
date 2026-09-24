'use client';
import React, { useState, useEffect } from 'react';

export default function CohortSlideshow({ imagesRaw, fallbackImage }: { imagesRaw?: string, fallbackImage?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Parse comma-separated images
  let images = imagesRaw
    ? imagesRaw.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  if (images.length === 0 && fallbackImage) {
    images = [fallbackImage];
  }

  const resolvedImages = images.map(img => {
    switch (img) {
      case '@img01': return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop';
      case '@img02': return 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop';
      case '@img03': return 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop';
      case '@img04': return 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1200&auto=format&fit=crop';
      default: return img;
    }
  });

  useEffect(() => {
    if (resolvedImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % resolvedImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [resolvedImages.length]);

  if (resolvedImages.length === 0) {
    return null; // Don't render anything if no images are set
  }

  return (
    <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden bg-slate-100 rounded-2xl shadow-sm mb-12">
      {resolvedImages.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Indicators */}
      {resolvedImages.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {resolvedImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
