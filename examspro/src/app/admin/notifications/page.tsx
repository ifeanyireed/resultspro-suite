"use client";

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { IconBell as Bell, IconSend as Send, IconHistory as History, IconTarget as Target, IconCheckCircle2 as CheckCircle2, IconAlertCircle as AlertCircle, IconMail as Mail, IconSmartphone as Smartphone, IconUsers as Users, IconCalendar as Calendar, IconSearch as Search, IconFilter as Filter, IconLayers as Layers, IconMonitor as Monitor, IconToggleLeft as ToggleLeft, IconToggleRight as ToggleRight, IconTrash2 as Trash2, IconExternalLink as ExternalLink } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { 
  getNotificationLogs, 
  getNotificationCampaigns, 
  createCampaign, 
  getPopups,
  updatePopup,
  deletePopup,
  NotificationLog, 
  NotificationCampaign,
  PopupNotification
} from '@/lib/notifications.api';
import api from '@/lib/api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'popups' | 'logs'>('campaigns');
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([]);
  const [popups, setPopups] = useState<PopupNotification[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Campaign Form State
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    route: 'both',
    target: 'all',
    targetValue: '',
    targetExamId: '',
    isPopup: false,
    displayPages: '*',
    scheduledAt: ''
  });

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchExams = async () => {
    try {
      const res = await api.get('/admin/exams');
      setExams(res.data || []);
    } catch (error) {
      console.error("Failed to fetch exams");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'campaigns') {
        const data = await getNotificationCampaigns();
        setCampaigns(data || []);
      } else if (activeTab === 'popups') {
        const data = await getPopups();
        setPopups(data || []);
      } else {
        const data = await getNotificationLogs();
        setLogs(data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch notification data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCampaign({
        ...formData,
        targetExamId: formData.targetExamId ? parseInt(formData.targetExamId) : undefined,
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : undefined
      });
      toast.success("Notification campaign created");
      setIsCreating(false);
      setFormData({
        title: '',
        message: '',
        type: 'info',
        route: 'both',
        target: 'all',
        targetValue: '',
        targetExamId: '',
        isPopup: false,
        displayPages: '*',
        scheduledAt: ''
      });
      fetchData();
    } catch (error) {
      toast.error("Failed to create campaign");
    }
  };

  const handleTogglePopup = async (id: string, active: boolean) => {
    try {
      await updatePopup(id, { isActive: !active });
      setPopups(prev => prev.map(p => p.id === id ? { ...p, isActive: !active } : p));
      toast.success(active ? "Popup disabled" : "Popup enabled");
    } catch (error) {
      toast.error("Failed to update popup");
    }
  };

  const handleDeletePopup = async (id: string) => {
    if (!window.confirm("Delete this popup?")) return;
    try {
      await deletePopup(id);
      setPopups(prev => prev.filter(p => p.id !== id));
      toast.success("Popup deleted");
    } catch (error) {
      toast.error("Failed to delete popup");
    }
  };

  return (
    <div className="min-h-screen bg-navy">
      <AdminHeader title="Notifications" />
      
      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-display font-black text-white uppercase tracking-tight">Notification System</h1>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Broadcast messages, track delivery & manage popups</p>
          </div>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-green text-navy hover:bg-green/90 font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-2xl shadow-[0_8px_20px_rgba(0,200,83,0.3)]"
          >
            <Send className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* Form Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-navy/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white/5 border border-white/[0.1] border-t-white/[0.15] p-10 rounded-[40px] w-full max-w-3xl shadow-2xl my-auto">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">Schedule Notification</h2>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-1">Reach your students via in-app, email, or pop-ups</p>
                </div>
                <button onClick={() => setIsCreating(false)} className="text-gray-500 hover:text-white font-black">CLOSE</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Campaign Title</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. New Tournament Starting Soon!"
                      className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-green transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Type</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-green appearance-none"
                    >
                      <option value="info" className="bg-navy">Informational</option>
                      <option value="success" className="bg-navy">Success / Reward</option>
                      <option value="warning" className="bg-navy">Important / Warning</option>
                      <option value="battle" className="bg-navy">Battle / Challenge</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Message Body</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="Enter the main content of your notification..."
                    className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-3xl px-6 py-4 text-white font-bold focus:outline-none focus:border-green transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Delivery Route</label>
                    <select 
                      value={formData.route}
                      onChange={e => setFormData({...formData, route: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-green appearance-none"
                    >
                      <option value="both" className="bg-navy">In-App & Email</option>
                      <option value="in-app" className="bg-navy">In-App Only</option>
                      <option value="email" className="bg-navy">Email Only</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Target Audience</label>
                    <select 
                      value={formData.target}
                      onChange={e => setFormData({...formData, target: e.target.value})}
                      className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-green appearance-none"
                    >
                      <option value="all" className="bg-navy">All Users</option>
                      <option value="pro" className="bg-navy">Pro Users Only</option>
                      <option value="free" className="bg-navy">Free Users Only</option>
                      <option value="exam" className="bg-navy">By Exam</option>
                      <option value="individual" className="bg-navy">Individual User</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {formData.target === 'exam' && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Select Exam</label>
                      <select 
                        required
                        value={formData.targetExamId}
                        onChange={e => setFormData({...formData, targetExamId: e.target.value})}
                        className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-green appearance-none"
                      >
                        <option value="" className="bg-navy">-- Select Exam --</option>
                        {exams.map(exam => (
                          <option key={exam.id} value={exam.id} className="bg-navy">{exam.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.target === 'individual' && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">User ID</label>
                      <input 
                        required
                        value={formData.targetValue}
                        onChange={e => setFormData({...formData, targetValue: e.target.value})}
                        placeholder="Enter User UUID"
                        className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-green transition-all font-mono text-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Schedule (Optional)</label>
                    <input 
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={e => setFormData({...formData, scheduledAt: e.target.value})}
                      className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-green appearance-none"
                    />
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-[24px] border border-white/[0.1] border-t-white/[0.15] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold text-sm">Enable Pop-up Alert</h4>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Display as a modal when user visits specific pages</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isPopup: !formData.isPopup})}
                      className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${formData.isPopup ? 'bg-green' : 'bg-white/10'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-navy transition-transform ${formData.isPopup ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {formData.isPopup && (
                    <div className="space-y-2 pt-2 animate-in fade-in zoom-in-95">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Display Pages (Condition)</label>
                      <input 
                        value={formData.displayPages}
                        onChange={e => setFormData({...formData, displayPages: e.target.value})}
                        placeholder="e.g. /dashboard, /study-assistant or * for all"
                        className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-green transition-all text-xs"
                      />
                      <p className="text-gray-600 text-[9px] font-bold ml-1 italic">Use comma-separated paths or * for all pages.</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-2">
                  <Button 
                    type="submit"
                    className="flex-1 bg-green text-navy hover:bg-green/90 font-black uppercase tracking-widest h-14 rounded-2xl"
                  >
                    Launch Campaign
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="bg-transparent border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/5 font-black uppercase tracking-widest h-14 px-8 rounded-2xl"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white/[0.02] p-1.5 rounded-[24px] border border-white/[0.05] border-t-white/[0.1] w-fit">
          <button 
            onClick={() => setActiveTab('campaigns')}
            className={`
              flex items-center gap-2 px-8 py-4 rounded-[18px] font-black text-[10px] uppercase tracking-widest transition-all
              ${activeTab === 'campaigns' ? 'bg-green text-navy shadow-lg' : 'text-gray-500 hover:text-white'}
            `}
          >
            <Users className="w-4 h-4" />
            Campaigns
          </button>
          <button 
            onClick={() => setActiveTab('popups')}
            className={`
              flex items-center gap-2 px-8 py-4 rounded-[18px] font-black text-[10px] uppercase tracking-widest transition-all
              ${activeTab === 'popups' ? 'bg-green text-navy shadow-lg' : 'text-gray-500 hover:text-white'}
            `}
          >
            <Monitor className="w-4 h-4" />
            Popup Manager
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`
              flex items-center gap-2 px-8 py-4 rounded-[18px] font-black text-[10px] uppercase tracking-widest transition-all
              ${activeTab === 'logs' ? 'bg-green text-navy shadow-lg' : 'text-gray-500 hover:text-white'}
            `}
          >
            <History className="w-4 h-4" />
            Delivery Logs
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green mb-4"></div>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em]">Synchronizing data...</p>
          </div>
        ) : activeTab === 'campaigns' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-[32px] p-8 group hover:border-green/30 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center
                    ${campaign.status === 'completed' ? 'bg-green/10 text-green' : 'bg-amber/10 text-amber'}
                  `}>
                    {campaign.isPopup ? <Monitor className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                  </div>
                  <span className={`
                    text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border
                    ${campaign.status === 'completed' ? 'border-green/20 text-green bg-green/5' : 'border-amber/20 text-amber bg-amber/5'}
                  `}>
                    {campaign.status}
                  </span>
                </div>
                
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-green transition-colors">{campaign.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">{campaign.message}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                  <div>
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Target</p>
                    <p className="text-white font-bold text-xs uppercase">
                      {campaign.target === 'exam' ? `Exam: ${exams.find(e => e.id === campaign.targetExamId)?.name || '...'}` : campaign.target}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Date</p>
                    <p className="text-white font-bold text-xs">{format(new Date(campaign.createdAt), 'MMM d, HH:mm')}</p>
                  </div>
                </div>
              </div>
            ))}
            {campaigns.length === 0 && (
              <div className="col-span-full py-24 text-center bg-white/[0.02] border border-dashed border-white/[0.1] border-t-white/[0.15] rounded-[40px]">
                <p className="text-gray-600 font-bold text-xs uppercase tracking-widest">No active campaigns found</p>
              </div>
            )}
          </div>
        ) : activeTab === 'popups' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popups.map(popup => (
              <div key={popup.id} className={`bg-white/5 border rounded-[32px] p-8 transition-all ${popup.isActive ? 'border-green/30 shadow-xl' : 'border-white/[0.05] border-t-white/[0.1] opacity-60'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${popup.isActive ? 'bg-green/10 text-green' : 'bg-gray-500/10 text-gray-500'}`}>
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleTogglePopup(popup.id, popup.isActive)}
                      className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${popup.isActive ? 'bg-amber/10 text-amber border border-amber/20' : 'bg-green/10 text-green border border-green/20'}`}
                    >
                      {popup.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button 
                      onClick={() => handleDeletePopup(popup.id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-white font-bold text-lg mb-2">{popup.title}</h3>
                <p className="text-gray-400 text-sm mb-6">{popup.message}</p>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pages:</span>
                    <span className="text-xs text-green font-bold truncate">{popup.displayPages}</span>
                  </div>
                  {popup.targetExamId && (
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-gray-600" />
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Exam Filter:</span>
                      <span className="text-xs text-white font-bold">{exams.find(e => e.id === popup.targetExamId)?.name || '...'}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {popups.length === 0 && (
              <div className="col-span-full py-24 text-center bg-white/[0.02] border border-dashed border-white/[0.1] border-t-white/[0.15] rounded-[40px]">
                <p className="text-gray-600 font-bold text-xs uppercase tracking-widest">No scheduled popups found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-[40px] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">User / Audience</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Notification</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Route</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-gray-400 text-xs">U</div>
                        <div>
                          <p className="text-white font-bold text-sm">{log.userId ? log.userId.substring(0, 8) : 'Broadcast'}</p>
                          <p className="text-gray-500 text-[9px] font-black uppercase tracking-tighter italic">Student Instance</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-white font-bold text-sm mb-0.5">{log.title}</p>
                      <p className="text-gray-500 text-xs font-medium truncate max-w-xs">{log.message}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center">
                        {log.route === 'email' ? <Mail className="w-4 h-4 text-blue-400" /> : <Smartphone className="w-4 h-4 text-green" />}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center">
                        <span className={`
                          text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest
                          ${log.status === 'sent' ? 'text-green bg-green/10' : 'text-red-400 bg-red-400/10'}
                        `}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <p className="text-white font-bold text-sm">{format(new Date(log.createdAt), 'HH:mm:ss')}</p>
                      <p className="text-gray-600 text-[10px] font-bold">{format(new Date(log.createdAt), 'MMM d, yyyy')}</p>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-24 text-center text-gray-600 font-bold text-xs uppercase tracking-widest">No logs recorded yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
