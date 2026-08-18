"use client";

import Navbar from '@/components/Navbar';
import { 
  PenTool, 
  Square, 
  Circle, 
  Type, 
  Image as ImageIcon, 
  Undo2, 
  Redo2, 
  Trash2, 
  Download, 
  Share2,
  Settings,
  ChevronRight,
  Maximize2,
  MousePointer2,
  Eraser
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TutorWhiteboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTool, setActiveTab] = useState('pen');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="h-screen bg-navy flex flex-col overflow-hidden">
      <Navbar />
      
      {/* Tools Toolbar */}
      <div className="h-16 border-b border-white/5 bg-navy/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
         <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            {[
              { id: 'select', icon: MousePointer2 },
              { id: 'pen', icon: PenTool },
              { id: 'rect', icon: Square },
              { id: 'circle', icon: Circle },
              { id: 'text', icon: Type },
              { id: 'image', icon: ImageIcon },
              { id: 'eraser', icon: Eraser },
            ].map((tool) => (
              <button 
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`p-2.5 rounded-xl transition-all ${
                   activeTool === tool.id ? 'bg-blue text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                 <tool.icon size={18} />
              </button>
            ))}
         </div>

         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 px-3 border-r border-white/10 mr-2">
               <button className="p-2 text-gray-500 hover:text-white transition-all"><Undo2 size={18} /></button>
               <button className="p-2 text-gray-500 hover:text-white transition-all"><Redo2 size={18} /></button>
            </div>
            
            <div className="flex items-center gap-3">
               <button className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all border border-white/5 hover:border-white/10">
                  <Download size={18} />
               </button>
               <button className="px-6 py-2.5 rounded-xl bg-blue text-white font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-blue/20 flex items-center gap-2">
                  <Share2 size={18} /> INVITE
               </button>
               <button className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all border border-white/5">
                  <Settings size={18} />
               </button>
            </div>
         </div>
      </div>

      <div className="flex-1 relative bg-[#fdfdfd] overflow-hidden group">
         {/* Grid Background */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} 
         />

         {/* Whiteboard Surface (Mock) */}
         <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
               <PenTool size={64} className="text-gray-200 mx-auto" />
               <h3 className="text-2xl font-display font-bold text-gray-300">Infinite Canvas</h3>
               <p className="text-gray-400 text-sm uppercase tracking-widest font-black">Click anywhere to start drawing</p>
            </div>
         </div>

         {/* Floating Control - Zoom */}
         <div className="absolute bottom-8 left-8 flex items-center gap-4 bg-navy/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
            <button className="w-10 h-10 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all">-</button>
            <span className="text-xs font-black text-white w-12 text-center">100%</span>
            <button className="w-10 h-10 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all">+</button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <button className="p-2 text-gray-400 hover:text-white"><Maximize2 size={18} /></button>
         </div>

         {/* Trash Bin */}
         <div className="absolute bottom-8 right-8">
            <button className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/5">
               <Trash2 size={24} />
            </button>
         </div>
      </div>
    </main>
  );
}
