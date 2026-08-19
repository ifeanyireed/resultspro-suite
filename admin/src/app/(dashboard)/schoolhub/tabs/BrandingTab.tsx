import React, { useState } from 'react';
import { Palette, CheckCircle2, MonitorSmartphone, LayoutDashboard, Settings, Type, Image as ImageIcon, Save, ArrowRight } from 'lucide-react';

export default function BrandingTab() {
  const [formData, setFormData] = useState({
    name: 'Greenwood High',
    slug: 'greenwood',
    custom_domain: '',
    primary_color: '#2563eb',
    accent_color: '#3b82f6',
    modules: ['RESULT_PRO', 'EXAM_PRO']
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleModuleToggle = (mod: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(mod) 
        ? prev.modules.filter(m => m !== mod)
        : [...prev.modules, mod]
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto w-full">
      
      {/* Configuration Form */}
      <div className="w-full lg:w-1/2 space-y-6">
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-pink-500" />
                Tenant Branding Configuration
              </h2>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-semibold">Live Preview Active</p>
            </div>
            <button 
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                saved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 
                'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : saved ? (
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Saved!</span>
              ) : (
                <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Configuration</span>
              )}
            </button>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                <Type className="w-3.5 h-3.5 text-slate-400" /> Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tenant Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Platform Subdomain</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})}
                      className="w-full pl-4 pr-24 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-[10px] text-slate-400 font-medium">.schoolhub.ng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-slate-400" /> Theme Colors
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={formData.primary_color}
                      onChange={e => setFormData({...formData, primary_color: e.target.value})}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-slate-50 border border-slate-200 p-1"
                    />
                    <input 
                      type="text" 
                      value={formData.primary_color}
                      onChange={e => setFormData({...formData, primary_color: e.target.value})}
                      className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono text-slate-800"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Accent Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={formData.accent_color}
                      onChange={e => setFormData({...formData, accent_color: e.target.value})}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-slate-50 border border-slate-200 p-1"
                    />
                    <input 
                      type="text" 
                      value={formData.accent_color}
                      onChange={e => setFormData({...formData, accent_color: e.target.value})}
                      className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Module Entitlements */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-slate-400" /> Enabled Modules
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'RESULT_PRO', label: 'ResultsPRO (Core)' },
                  { id: 'EXAM_PRO', label: 'ExamsPRO (CBT)' },
                  { id: 'TUTORS_PRO', label: 'TutorsPRO' },
                  { id: 'COURSES_PRO', label: 'CoursesPRO' },
                ].map((mod) => (
                  <button
                    type="button"
                    key={mod.id}
                    onClick={() => handleModuleToggle(mod.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                      formData.modules.includes(mod.id)
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>{mod.label}</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      formData.modules.includes(mod.id) ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                    }`}>
                      {formData.modules.includes(mod.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Live Preview Window */}
      <div className="w-full lg:w-1/2">
        <div className="sticky top-8 bg-slate-900 rounded-3xl p-2 shadow-2xl shadow-blue-900/20 overflow-hidden border border-slate-800">
          {/* Browser Chrome */}
          <div className="px-4 py-3 flex items-center gap-2 border-b border-slate-800 bg-slate-900/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
            <div className="mx-auto flex items-center gap-2 px-4 py-1.5 bg-slate-800 rounded-md text-[10px] text-slate-400 font-mono flex-1 max-w-sm justify-center">
              <MonitorSmartphone className="w-3 h-3" />
              {formData.slug || 'tenant'}.schoolhub.ng
            </div>
          </div>

          {/* Actual Mockup */}
          <div className="bg-[#eff6ff] flex h-[500px] overflow-hidden rounded-b-[20px]" style={{ '--mock-primary': formData.primary_color } as React.CSSProperties}>
            {/* Sidebar Mockup */}
            <div className="w-56 bg-white border-r border-slate-100 flex flex-col">
              <div className="p-5 flex items-center gap-3 border-b border-slate-50">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ backgroundColor: formData.primary_color }}
                >
                  {formData.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 truncate w-32" style={{ color: formData.primary_color }}>{formData.name || 'Tenant'}</div>
                  <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Digital Campus</div>
                </div>
              </div>
              
              <div className="p-3 space-y-1">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menu</div>
                
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-bold shadow-sm" style={{ backgroundColor: formData.primary_color, color: 'white' }}>
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </div>

                {formData.modules.includes('RESULT_PRO') && (
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-50" style={{ '--hover-color': formData.primary_color } as React.CSSProperties}>
                    <ArrowRight className="w-3.5 h-3.5 opacity-50" /> Academic Results
                  </div>
                )}
                {formData.modules.includes('EXAM_PRO') && (
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-50">
                    <ArrowRight className="w-3.5 h-3.5 opacity-50" /> Online Exams
                  </div>
                )}
                {formData.modules.includes('TUTORS_PRO') && (
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-50">
                    <ArrowRight className="w-3.5 h-3.5 opacity-50" /> Find a Tutor
                  </div>
                )}
                {formData.modules.includes('COURSES_PRO') && (
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-50">
                    <ArrowRight className="w-3.5 h-3.5 opacity-50" /> Future Skills
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Area Mockup */}
            <div className="flex-1 flex flex-col">
              <div className="h-14 bg-white/50 backdrop-blur-md border-b border-white flex items-center justify-between px-6">
                <div className="text-xs font-bold text-slate-800">Welcome back, Student</div>
                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="h-32 rounded-xl border border-white/40 shadow-sm relative overflow-hidden flex items-end p-4" style={{ background: `linear-gradient(135deg, ${formData.primary_color}20, ${formData.accent_color}40)` }}>
                  <div className="w-full">
                    <div className="h-2.5 w-1/3 rounded-full bg-white/80 mb-2"></div>
                    <div className="h-1.5 w-1/2 rounded-full bg-white/50"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col justify-between">
                    <div className="w-6 h-6 rounded-md opacity-20" style={{ backgroundColor: formData.primary_color }}></div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100"></div>
                  </div>
                  <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col justify-between">
                    <div className="w-6 h-6 rounded-md opacity-20" style={{ backgroundColor: formData.primary_color }}></div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
