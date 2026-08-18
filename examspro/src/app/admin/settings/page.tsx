"use client";

import { IconSettings as Settings, IconCoins as Coins, IconShieldCheck as ShieldCheck, IconGlobe as Globe, IconSave as Save, IconToggleRight as ToggleRight, IconLoader2 as Loader2, IconPlus as Plus, IconTrash2 as Trash2, IconType as Type, IconPalette as Palette, IconCheckCircle as CheckCircle, IconAlertCircle as AlertCircle, IconX as X } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import AdminHeader from '@/components/admin/AdminHeader';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [coinPacks, setCoinPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingPack, setIsAddingPack] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, packsRes] = await Promise.all([
        api.get('/admin/settings'),
        api.get('/admin/coin-packs')
      ]);
      setSettings(settingsRes.data);
      setCoinPacks(packsRes.data);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, currentValue: string) => {
    const newValue = currentValue === 'true' ? 'false' : 'true';
    try {
      await api.put(`/admin/settings/${id}`, { value: newValue });
      setSettings(prev => prev.map(s => s.id === id ? { ...s, value: newValue } : s));
      toast.success("Setting updated");
    } catch (err) {
      toast.error("Failed to update setting");
    }
  };

  const handleValueChange = (id: string, newValue: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, value: newValue } : s));
  };

  const saveAll = async () => {
    setIsSaving(true);
    try {
      const nonBoolSettings = settings.filter(s => s.type !== 'boolean');
      await Promise.all(nonBoolSettings.map(s => api.put(`/admin/settings/${s.id}`, { value: s.value })));
      toast.success("All settings saved successfully");
    } catch (err) {
      toast.error("Failed to save some settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Coin Pack Actions
  const handleUpdatePack = async (id: string, data: any) => {
    try {
      await api.put(`/admin/coin-packs/${id}`, data);
      setCoinPacks(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      toast.success("Pack updated");
    } catch (err) {
      toast.error("Failed to update pack");
    }
  };

  const handleCreatePack = async () => {
    try {
      const newPack = {
        name: "New Coin Pack",
        type: "COIN",
        coins: 100,
        price: 1000,
        color: "blue",
        popular: false,
        isActive: true
      };
      const res = await api.post('/admin/coin-packs', newPack);
      setCoinPacks(prev => [...prev, res.data]);
      toast.success("New pack created");
    } catch (err) {
      toast.error("Failed to create pack");
    }
  };

  const handleDeletePack = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coin pack?")) return;
    try {
      await api.delete(`/admin/coin-packs/${id}`);
      setCoinPacks(prev => prev.filter(p => p.id !== id));
      toast.success("Pack deleted");
    } catch (err) {
      toast.error("Failed to delete pack");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    );
  }

  const economySettings = settings.filter(s => s.group === 'Economy');
  const featureFlags = settings.filter(s => s.group === 'Features' && s.type === 'boolean');
  const otherFeatureSettings = settings.filter(s => s.group === 'Features' && s.type !== 'boolean' && s.id !== 'global_announcement');
  const announcementSetting = settings.find(s => s.id === 'global_announcement');
  const securitySettings = settings.filter(s => s.group === 'Security' && !s.id.includes('ai_') && !s.id.includes('gemini') && !s.id.includes('mistral'));
  const aiSettings = settings.filter(s => s.id.includes('ai_provider') || s.id.includes('gemini') || s.id.includes('mistral'));

  return (
    <>
      <AdminHeader title="System Settings" />

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        <div className="flex justify-between items-end max-w-5xl">
          <div>
            <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">System Settings</h1>
            <p className="text-sm text-gray-500">Configure global platform parameters and feature flags.</p>
          </div>
          <Button 
            onClick={saveAll}
            disabled={isSaving}
            className="rounded-xl bg-green text-navy hover:bg-green/90 font-bold text-xs gap-2 shadow-lg shadow-green/20"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>

        <div className="max-w-5xl space-y-12 pb-12">
          {/* Section: AI Configuration */}
          <section className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden group hover:border-white/10 transition-all">
            <div className="px-8 py-6 border-b border-white/[0.05] border-t-white/[0.1] flex items-center gap-3 bg-white/5">
              <div className="w-10 h-10 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">AI & Core Engine</h3>
            </div>
            <div className="p-8 space-y-6">
              {aiSettings.map((s) => (
                <div key={s.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1]">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{s.label}</span>
                    <span className="text-[10px] text-gray-500">{s.desc}</span>
                  </div>
                  <div className="md:col-span-2">
                    {s.id === 'ai_provider' ? (
                      <select 
                        value={s.value}
                        onChange={(e) => handleValueChange(s.id, e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-green/50"
                      >
                        <option value="gemini">Google Gemini</option>
                        <option value="mistral">Mistral AI</option>
                      </select>
                    ) : (
                      <Input 
                        value={s.value}
                        onChange={(e) => handleValueChange(s.id, e.target.value)}
                        placeholder={`Enter ${s.label}...`}
                        className="bg-white/10 border-white/10 h-12 rounded-xl text-white font-mono text-xs"
                      />
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <AlertCircle className="w-4 h-4" />
                <p className="text-[10px] font-bold">Restarting the backend is NOT required for these changes to take effect.</p>
              </div>
            </div>
          </section>

          {/* Coin Packs Management */}
          <section className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden group hover:border-white/10 transition-all">
            <div className="px-8 py-6 border-b border-white/[0.05] border-t-white/[0.1] flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-white text-lg">Shop Coin Packs</h3>
              </div>
              <Button 
                onClick={handleCreatePack}
                variant="outline" 
                className="rounded-xl border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/5 text-xs gap-2"
              >
                <Plus className="w-4 h-4" /> Add Pack
              </Button>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 gap-6">
                {coinPacks.map((pack) => (
                  <div key={pack.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] flex flex-col md:flex-row md:items-center gap-6 group/item hover:border-white/20 transition-all">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Pack Name</label>
                        <Input 
                          value={pack.name} 
                          onChange={(e) => setCoinPacks(prev => prev.map(p => p.id === pack.id ? { ...p, name: e.target.value } : p))}
                          onBlur={() => handleUpdatePack(pack.id, { name: pack.name })}
                          className="bg-white/5 border-white/[0.05] border-t-white/[0.1] h-10 text-sm font-bold text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Coins Amount</label>
                        <Input 
                          type="number"
                          value={pack.coins} 
                          onChange={(e) => setCoinPacks(prev => prev.map(p => p.id === pack.id ? { ...p, coins: parseInt(e.target.value) } : p))}
                          onBlur={() => handleUpdatePack(pack.id, { coins: pack.coins })}
                          className="bg-white/5 border-white/[0.05] border-t-white/[0.1] h-10 text-sm font-bold text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Price (NGN)</label>
                        <Input 
                          type="number"
                          value={pack.price} 
                          onChange={(e) => setCoinPacks(prev => prev.map(p => p.id === pack.id ? { ...p, price: parseInt(e.target.value) } : p))}
                          onBlur={() => handleUpdatePack(pack.id, { price: pack.price })}
                          className="bg-white/5 border-white/[0.05] border-t-white/[0.1] h-10 text-sm font-bold text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Color Theme</label>
                        <select 
                          value={pack.color}
                          onChange={(e) => handleUpdatePack(pack.id, { color: e.target.value })}
                          className="w-full bg-white/5 border border-white/[0.05] border-t-white/[0.1] h-10 rounded-md px-3 text-sm font-bold text-white focus:outline-none focus:border-green/50"
                        >
                          <option value="blue">Blue</option>
                          <option value="amber">Amber</option>
                          <option value="purple">Purple</option>
                          <option value="green">Green</option>
                          <option value="gray">Gray</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 px-4 py-2 bg-white/5 rounded-2xl">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[8px] font-black text-gray-600 uppercase">Popular</span>
                        <Switch 
                          checked={pack.popular} 
                          onCheckedChange={(checked) => handleUpdatePack(pack.id, { popular: checked })}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[8px] font-black text-gray-600 uppercase">Active</span>
                        <Switch 
                          checked={pack.isActive} 
                          onCheckedChange={(checked) => handleUpdatePack(pack.id, { isActive: checked })}
                        />
                      </div>
                      <Button 
                        onClick={() => handleDeletePack(pack.id)}
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-600 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Coin Economy */}
          <section className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden group hover:border-white/10 transition-all">
            <div className="px-8 py-6 border-b border-white/[0.05] border-t-white/[0.1] flex items-center gap-3 bg-white/5">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">Coin Economy Config</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {economySettings.map((s) => (
                <div key={s.id} className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{s.label}</label>
                  <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/[0.05] border-t-white/[0.1] rounded-2xl focus-within:border-green/50 transition-colors">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <input 
                      type="number" 
                      value={s.value} 
                      onChange={(e) => handleValueChange(s.id, e.target.value)}
                      className="bg-transparent font-bold text-white focus:outline-none w-full" 
                    />
                  </div>
                  <p className="text-[10px] text-gray-600 px-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Feature Flags & Automation */}
          <section className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden group hover:border-white/10 transition-all">
            <div className="px-8 py-6 border-b border-white/[0.05] border-t-white/[0.1] flex items-center gap-3 bg-white/5">
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center">
                <ToggleRight className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">Features & Automation</h3>
            </div>
            <div className="divide-y divide-white/5">
              {featureFlags.map((flag) => {
                const isEnabled = flag.value === 'true';
                return (
                  <div key={flag.id} className="px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div>
                      <div className="text-sm font-bold text-white">{flag.label}</div>
                      <div className="text-xs text-gray-500 font-medium">{flag.desc}</div>
                    </div>
                    <button 
                      onClick={() => handleToggle(flag.id, flag.value)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${isEnabled ? 'bg-green' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${isEnabled ? 'right-1 bg-navy' : 'left-1 bg-gray-500'}`} />
                    </button>
                  </div>
                );
              })}

              {otherFeatureSettings.map((s) => (
                <div key={s.id} className="px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{s.label}</div>
                    <div className="text-xs text-gray-500 font-medium">{s.desc}</div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-2 focus-within:border-green/50 transition-colors">
                    <input 
                      type="number"
                      value={s.value}
                      onChange={(e) => handleValueChange(s.id, e.target.value)}
                      className="bg-transparent text-white font-black w-16 text-right focus:outline-none"
                    />
                    <span className="text-[10px] font-bold text-gray-600 uppercase">Mins</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: App Config */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] space-y-6 hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <h4 className="font-bold text-white">Hero Text Messages</h4>
                  </div>
                  <Button 
                    onClick={() => {
                      if (!announcementSetting) return;
                      let current;
                      try {
                        current = JSON.parse(announcementSetting.value);
                        if (!Array.isArray(current)) current = [announcementSetting.value];
                      } catch(e) {
                        current = [announcementSetting.value];
                      }
                      const updated = JSON.stringify([...current, "New Message"]);
                      handleValueChange(announcementSetting.id, updated);
                    }}
                    variant="outline" 
                    className="h-8 px-3 rounded-lg border-white/[0.1] border-t-white/[0.15] text-[10px] font-bold uppercase tracking-widest hover:bg-white/5"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Message
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {(() => {
                    if (!announcementSetting) return <p className="text-gray-600 italic text-xs">Setting not found</p>;
                    let messages = [];
                    try {
                      messages = JSON.parse(announcementSetting.value);
                      if (!Array.isArray(messages)) messages = [announcementSetting.value];
                    } catch(e) {
                      messages = [announcementSetting.value];
                    }
                    
                    return messages.map((msg: string, idx: number) => (
                      <div key={idx} className="flex gap-2 group/msg">
                        <textarea 
                          value={msg}
                          onChange={(e) => {
                            const newMsgs = [...messages];
                            newMsgs[idx] = e.target.value;
                            handleValueChange(announcementSetting.id, JSON.stringify(newMsgs));
                          }}
                          className="flex-1 bg-white/5 border border-white/[0.05] border-t-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-green/50 transition-colors resize-none h-16"
                        />
                        <button 
                          onClick={() => {
                            const newMsgs = messages.filter((_: any, i: number) => i !== idx);
                            handleValueChange(announcementSetting.id, JSON.stringify(newMsgs));
                          }}
                          className="p-2 h-fit rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover/msg:opacity-100 transition-opacity hover:bg-red-500/20"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ));
                  })()}
                </div>

                <Button 
                  onClick={saveAll}
                  disabled={isSaving}
                  className="w-full bg-white/10 text-white hover:bg-white/20 rounded-xl font-bold py-3 transition-colors"
                >
                  {isSaving ? "Saving..." : "Update Hero Text"}
                </Button>
             </div>

             <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] space-y-6 hover:border-white/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-5 h-5 text-gray-500" />
                  <h4 className="font-bold text-white">API Security</h4>
                </div>
                <div className="space-y-4">
                  {securitySettings.map((s) => (
                    <div key={s.id} className="p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1] flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{s.label}</span>
                        <span className="text-[8px] text-gray-600 truncate max-w-[150px]">{s.desc}</span>
                      </div>
                      <input 
                        type={s.type === 'number' ? 'number' : 'text'} 
                        value={s.value} 
                        onChange={(e) => handleValueChange(s.id, e.target.value)}
                        className="bg-transparent font-black text-white text-right w-32 focus:outline-none focus:text-green"
                      />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/5 rounded-xl font-bold py-3 transition-colors">Security Logs</Button>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}
