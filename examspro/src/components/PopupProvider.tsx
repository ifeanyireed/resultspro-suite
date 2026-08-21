"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { getActivePopups, PopupNotification } from '@/lib/notifications.api';
import { useAuthStore } from '@/store/useAuthStore';
import { IconX as X, IconBell as Bell, IconInfoCircle as Info, IconAlertTriangle as AlertTriangle, IconCircleCheck as CheckCircle2, IconTrophy as Trophy, IconSword as Sword, IconCoins as Coins } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface PopupContextType {
  activePopups: PopupNotification[];
  closePopup: (id: string) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const [popups, setPopups] = useState<PopupNotification[]>([]);
  const [currentPopup, setCurrentPopup] = useState<PopupNotification | null>(null);
  const [closedIds, setClosedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPopups();
    } else {
      setPopups([]);
    }
  }, [isAuthenticated]);

  const fetchPopups = async () => {
    try {
      const data = await getActivePopups();
      setPopups(Array.isArray(data) ? data : []);
    } catch (error) {
      // silently fail to prevent console errors from browser extensions
    }
  };

  useEffect(() => {
    if (!popups || !Array.isArray(popups) || popups.length === 0) {
      setCurrentPopup(null);
      return;
    }

    // Find a popup that matches the current page and hasn't been closed
    const eligiblePopup = popups.find(p => {
      if (closedIds.includes(p.id)) return false;
      
      if (p.displayPages === '*') return true;
      
      const pages = p.displayPages.split(',').map(s => s.trim());
      return pages.some(page => pathname.startsWith(page));
    });

    setCurrentPopup(eligiblePopup || null);
  }, [pathname, popups, closedIds]);

  const closePopup = (id: string) => {
    setClosedIds(prev => [...prev, id]);
    setCurrentPopup(null);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'battle': return Sword;
      case 'reward': return Coins;
      case 'achievement': return Trophy;
      case 'system': return CheckCircle2;
      case 'warning': return AlertTriangle;
      case 'error': return X;
      default: return Info;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'battle': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'reward': return 'text-amber bg-amber/10 border-amber/20';
      case 'achievement': return 'text-green bg-green/10 border-green/20';
      case 'system': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  return (
    <PopupContext.Provider value={{ activePopups: popups, closePopup }}>
      {children}
      
      {currentPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a2b3c] border border-white/10 p-8 rounded-[40px] w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => closePopup(currentPopup.id)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 border ${getColor(currentPopup.type)}`}>
              {React.createElement(getIcon(currentPopup.type), { className: "w-8 h-8" })}
            </div>

            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-3">
              {currentPopup.title}
            </h3>
            
            <p className="text-gray-400 font-medium leading-relaxed mb-8">
              {currentPopup.message}
            </p>

            <Button 
              onClick={() => closePopup(currentPopup.id)}
              className="w-full bg-green text-navy hover:bg-green/90 font-black uppercase tracking-widest h-14 rounded-2xl shadow-[0_8px_20px_rgba(0,200,83,0.3)]"
            >
              Got it!
            </Button>
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) throw new Error("usePopup must be used within a PopupProvider");
  return context;
};
