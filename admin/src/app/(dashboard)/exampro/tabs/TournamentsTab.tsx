import React, { useState, useEffect } from 'react';
import { Trophy, Search, Plus, Edit2, Trash2, Calendar, Coins, Clock, Target } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { fetchExamproTournaments, createExamproTournament, updateExamproTournament, deleteExamproTournament } from '@/lib/api';
import toast from 'react-hot-toast';

export default function TournamentsTab() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    registrationFee: 0,
    prizePool: 0,
    duration: 60,
    questionCount: 10,
    status: 'upcoming'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchExamproTournaments();
      setTournaments(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (t?: any) => {
    if (t) {
      setIsEditing(true);
      setFormData({
        id: t.id,
        title: t.title,
        description: t.description,
        startTime: t.startTime ? new Date(t.startTime).toISOString().slice(0,16) : '',
        endTime: t.endTime ? new Date(t.endTime).toISOString().slice(0,16) : '',
        registrationFee: t.registrationFee,
        prizePool: t.prizePool,
        duration: t.duration,
        questionCount: t.questionCount,
        status: t.status
      });
    } else {
      setIsEditing(false);
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        registrationFee: 0,
        prizePool: 0,
        duration: 60,
        questionCount: 10,
        status: 'upcoming'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        startTime: formData.startTime ? new Date(formData.startTime).toISOString() : null,
        endTime: formData.endTime ? new Date(formData.endTime).toISOString() : null,
        registrationFee: Number(formData.registrationFee),
        prizePool: Number(formData.prizePool),
        duration: Number(formData.duration),
        questionCount: Number(formData.questionCount)
      };

      if (isEditing) {
        await updateExamproTournament(formData.id, payload);
        toast.success('Tournament updated');
      } else {
        await createExamproTournament(payload);
        toast.success('Tournament created');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save tournament');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;
    try {
      await deleteExamproTournament(id);
      toast.success('Tournament deleted');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete tournament');
    }
  };

  const filtered = tournaments.filter(t => 
    t.title?.toLowerCase().includes(search.toLowerCase()) || 
    t.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Tournaments
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage global high-stakes competitive events</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tournaments..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-yellow-500 transition-colors" 
            />
          </div>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-bold hover:bg-yellow-600 transition-colors whitespace-nowrap shadow-md shadow-yellow-500/20">
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
          <Trophy className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-slate-500 font-medium">No tournaments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <Badge status={t.status} />
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(t)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                
                <h3 className="text-lg font-black text-slate-800 line-clamp-1 mb-1">{t.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">{t.description || 'No description provided'}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Trophy className="w-4 h-4" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prize Pool</p>
                      <p className="text-sm font-black text-slate-700">{t.prizePool} 🪙</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Coins className="w-4 h-4" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Entry Fee</p>
                      <p className="text-sm font-black text-slate-700">{t.registrationFee} 🪙</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-semibold text-slate-600 pt-3 border-t border-slate-100">
                  <p className="flex justify-between"><span>Starts:</span> <span className="text-slate-800">{new Date(t.startTime).toLocaleDateString()} {new Date(t.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></p>
                  <p className="flex justify-between"><span>Ends:</span> <span className="text-slate-800">{new Date(t.endTime).toLocaleDateString()} {new Date(t.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></p>
                  <p className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">
                    <span className="flex items-center gap-1 text-slate-400"><Clock className="w-3.5 h-3.5" /> {t.duration}s</span>
                    <span className="flex items-center gap-1 text-slate-400"><Target className="w-3.5 h-3.5" /> {t.questionCount} Qs</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-800">{isEditing ? 'Edit Tournament' : 'Create Tournament'}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Configure global event settings</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white shadow-sm border border-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold">×</button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="tournament-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tournament Title <span className="text-red-500">*</span></label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all font-medium" />
                  </div>
                  
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
                    <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all font-medium resize-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Start Time <span className="text-red-500">*</span></label>
                    <input required type="datetime-local" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-yellow-500 outline-none font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">End Time <span className="text-red-500">*</span></label>
                    <input required type="datetime-local" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-yellow-500 outline-none font-medium" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Registration Fee (Coins)</label>
                    <input type="number" min="0" value={formData.registrationFee} onChange={e => setFormData({...formData, registrationFee: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-yellow-500 outline-none font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Prize Pool (Coins)</label>
                    <input type="number" min="0" value={formData.prizePool} onChange={e => setFormData({...formData, prizePool: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-yellow-500 outline-none font-medium" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Question Count</label>
                    <input type="number" min="1" value={formData.questionCount} onChange={e => setFormData({...formData, questionCount: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-yellow-500 outline-none font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Duration / Q (Seconds)</label>
                    <input type="number" min="10" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-yellow-500 outline-none font-medium" />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-yellow-500 outline-none font-medium appearance-none cursor-pointer">
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
              <button type="submit" form="tournament-form" className="px-8 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold rounded-xl shadow-md shadow-yellow-500/20 transition-all">
                {isEditing ? 'Save Changes' : 'Create Tournament'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
