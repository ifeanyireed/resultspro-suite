"use client";

import Link from 'next/link';
import { IconSword as Sword, IconZap as Zap, IconBrain as Brain } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

const Hero = () => {
  const [messages, setMessages] = useState<string[]>(["Ace Your Exams with ResultsPRO"]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalSec, setIntervalSec] = useState(5);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/public/settings');
        const announcement = res.data['global_announcement'];
        if (announcement) {
          try {
            const parsed = JSON.parse(announcement);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMessages(parsed);
            } else {
              setMessages([announcement]);
            }
          } catch (e) {
            setMessages([announcement]);
          }
        }
        const interval = res.data['announcement_interval'];
        if (interval) {
          setIntervalSec(parseInt(interval));
        }
      } catch (err) {
        console.error("Failed to fetch hero settings");
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (messages.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, intervalSec * 1000);

    return () => clearInterval(timer);
  }, [messages, intervalSec]);

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden bg-navy -mt-16">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue/10 rounded-full blur-[120px]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl pt-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-xs font-medium text-green mb-8 backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
          <Zap className="w-3 h-3 fill-current" />
          AI-POWERED EXAM PREP
        </div>

        {/* Main Heading with Animation */}
        <div className="h-[120px] md:h-[180px] flex items-center justify-center mb-6">
          <AnimatePresence mode="wait">
            <motion.h1 
              key={currentIndex}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl font-display font-black tracking-tight leading-tight text-white max-w-3xl"
            >
              {messages[currentIndex].includes("ResultsPRO") ? (
                <>
                  {messages[currentIndex].split("ResultsPRO")[0]}
                  <span className="text-green">ResultsPRO</span>
                  {messages[currentIndex].split("ResultsPRO")[1]}
                </>
              ) : messages[currentIndex]}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
          Gamified, AI-powered exam preparation for international students. 
          Free to use as long as you keep answering correctly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link 
            href="/battle-mode" 
            className="group items-center border shadow-[0_1px_3px_0_rgba(0,200,83,0.4)_inset,0_0_20px_0_rgba(0,200,83,0.3)_inset,0_1px_22px_0_rgba(255,255,255,0.15),0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl backdrop-saturate-150 bg-[rgba(255,255,255,0.03)] flex gap-3 overflow-hidden px-8 py-4 rounded-xl border border-solid border-green/30 border-t-green/50 hover:bg-green/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-white text-lg font-bold"
          >
            <Sword className="w-5 h-5 text-green group-hover:rotate-12 transition-transform" />
            BATTLE MODE
          </Link>
          <Link 
            href="/practice" 
            className="items-center border shadow-[0_1px_3px_0_rgba(255,255,255,0.15)_inset,0_0_20px_0_rgba(255,255,255,0.08)_inset,0_1px_22px_0_rgba(255,255,255,0.15),0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl backdrop-saturate-150 bg-[rgba(255,255,255,0.03)] flex gap-3 overflow-hidden px-8 py-4 rounded-xl border border-solid border-white/10 border-t-white/20 hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-white text-lg font-bold"
          >
            <Brain className="w-5 h-5 text-blue" />
            START PRACTICE
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-white/10 pt-10">
          {[
            { label: 'Exam Categories', value: '15+' },
            { label: 'Active Students', value: '50k+' },
            { label: 'Questions', value: '1M+' },
            { label: 'AI Deep-Dives', value: '500k+' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-display font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
