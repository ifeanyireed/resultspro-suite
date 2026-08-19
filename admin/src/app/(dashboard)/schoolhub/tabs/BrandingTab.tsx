import React from 'react';
import { Palette, CheckCircle2 } from 'lucide-react';

export default function BrandingTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
          <Palette className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Platform Global Branding</h2>
        <p className="text-sm text-slate-500 max-w-md">
          This is where you will define global tenant settings, allowed module combinations, and default domain mapping rules before phase 3 data isolation.
        </p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-xs hover:bg-blue-700 transition-all flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Module Coming Soon</span>
        </button>
      </div>
    </div>
  );
}
