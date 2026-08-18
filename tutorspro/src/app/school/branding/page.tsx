"use client";

import { 
  Palette, 
  Upload, 
  Globe, 
  Layout, 
  Type, 
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getBranding, updateBranding } from '@/lib/school.api';


interface BrandingSettings {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  customDomain: string;
  isDomainVerified: boolean;
}

export default function SchoolBranding() {
  const [activeTab, setActiveTab] = useState('Logo & Identity');
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    setIsLoading(true);
    try {
      const data = await getBranding();
      setBranding(data);
    } catch (error) {
      toast.error("Failed to load branding settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBranding = async () => {
    if (!branding) return;
    const toastId = toast.loading("Saving changes...");
    try {
      const response = await updateBranding(branding);
      toast.success(response.message || "Branding updated!", { id: toastId });
      fetchBranding();
    } catch (error: any) {
      toast.error(error.message || "Failed to save changes.", { id: toastId });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading branding settings...</div>;
  }
  
  if (!branding) {
    return <div className="p-8 text-center text-red-500">Could not load branding settings.</div>;
  }


  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Branding Settings</h1>
          <p className="text-gray-400">Customize the platform appearance to match your school's brand identity.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/5 mb-12 overflow-x-auto no-scrollbar">
           {['Logo & Identity', 'Color Palette', 'Typography', 'Custom Domain'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`pb-4 text-sm font-bold transition-all whitespace-nowrap relative ${
                 activeTab === tab ? 'text-purple' : 'text-gray-500 hover:text-white'
               }`}
             >
               {tab}
               {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple" />}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Form Section */}
           <div className="lg:col-span-2 space-y-12">
              <section className="space-y-6">
                 <h3 className="text-xl font-bold text-white">School Logo</h3>
                 <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-40 h-40 rounded-[32px] bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 group hover:border-purple/50 transition-all cursor-pointer">
                       <ImageIcon className="w-8 h-8 text-gray-500 group-hover:text-purple transition-colors" />
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Upload PNG/SVG</span>
                    </div>
                    <div className="flex-1 space-y-4">
                       <p className="text-sm text-gray-400 leading-relaxed">
                          Your logo will appear on the student dashboard, login screens, and all generated reports. 
                          We recommend a transparent background and minimum size of 400x400px.
                       </p>
                    </div>
                 </div>
              </section>

              <section className="space-y-6">
                 <h3 className="text-xl font-bold text-white">Brand Colors</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Primary Color</label>
                       <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                          <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: branding.primaryColor }} />
                          <input type="text" value={branding.primaryColor} className="bg-transparent text-white font-mono text-sm focus:outline-none flex-1" readOnly />
                          <button className="text-gray-500 hover:text-white transition-colors"><Palette className="w-4 h-4" /></button>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Secondary Color</label>
                       <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                          <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: branding.secondaryColor }} />
                          <input type="text" value={branding.secondaryColor} className="bg-transparent text-white font-mono text-sm focus:outline-none flex-1" readOnly />
                          <button className="text-gray-500 hover:text-white transition-colors"><Palette className="w-4 h-4" /></button>
                       </div>
                    </div>
                 </div>
              </section>

              <button 
                onClick={handleUpdateBranding}
                className="px-8 py-4 rounded-2xl bg-purple text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                 Save Branding Changes
              </button>
           </div>
        </div>
      </div>
    </main>
  );
}
