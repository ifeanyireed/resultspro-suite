"use client";

import { useState, useEffect } from 'react';
import { IconPlus as Plus, IconSearch as Search, IconTrophy as Trophy, IconCalendar as Calendar, IconUsers as Users, IconCoins as Coins, IconEdit as Edit, IconTrash as Trash2, IconLoader2 as Loader2, IconDotsVertical as MoreVertical, IconCircleCheck as CheckCircle2, IconClock as Clock, IconAlertCircle as AlertCircle } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/modal';
import { format } from 'date-fns';

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTournament, setEditingTournament] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    registrationFee: 500,
    prizePool: 50000,
    duration: 60,
    questionCount: 10,
    status: "upcoming"
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/tournaments');
      setTournaments(res.data);
    } catch (error) {
      toast.error("Failed to fetch tournaments");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (tournament: any = null) => {
    if (tournament) {
      setEditingTournament(tournament);
      setFormData({
        title: tournament.title,
        description: tournament.description,
        startTime: tournament.startTime ? format(new Date(tournament.startTime), "yyyy-MM-dd'T'HH:mm") : "",
        endTime: tournament.endTime ? format(new Date(tournament.endTime), "yyyy-MM-dd'T'HH:mm") : "",
        registrationFee: tournament.registrationFee,
        prizePool: tournament.prizePool,
        duration: tournament.duration || 60,
        questionCount: tournament.questionCount || 10,
        status: tournament.status
      });
    } else {
      setEditingTournament(null);
      setFormData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        registrationFee: 500,
        prizePool: 50000,
        duration: 60,
        questionCount: 10,
        status: "upcoming"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        registrationFee: Number(formData.registrationFee),
        prizePool: Number(formData.prizePool),
        duration: Number(formData.duration),
        questionCount: Number(formData.questionCount)
      };

      if (editingTournament) {
        await api.put(`/admin/tournaments/${editingTournament.id}`, payload);
        toast.success("Tournament updated successfully");
      } else {
        await api.post('/admin/tournaments', payload);
        toast.success("Tournament created successfully");
      }
      setIsModalOpen(false);
      fetchTournaments();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save tournament");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return;
    try {
      await api.delete(`/admin/tournaments/${id}`);
      toast.success("Tournament deleted");
      fetchTournaments();
    } catch (error) {
      toast.error("Failed to delete tournament");
    }
  };

  const filteredTournaments = tournaments.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <AdminHeader 
        title="Weekly Tournaments" 
        subtitle="Manage scheduled competitive events and prize pools"
        action={
          <Button onClick={() => handleOpenModal()} className="bg-green text-navy hover:bg-green/90 font-bold">
            <Plus className="w-4 h-4 mr-2" /> Create Tournament
          </Button>
        }
      />

      <div className="mt-8 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] rounded-3xl p-6">
            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Events</div>
            <div className="text-3xl font-display font-black text-white">{tournaments.length}</div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] rounded-3xl p-6">
            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Active Now</div>
            <div className="text-3xl font-display font-black text-green">
              {tournaments.filter(t => t.status === 'active').length}
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] rounded-3xl p-6">
            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Prize Volume</div>
            <div className="text-3xl font-display font-black text-blue">
              ₦{tournaments.reduce((acc, curr) => acc + curr.prizePool, 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search tournaments..."
              className="w-full bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] rounded-2xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-green/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] rounded-[40px] overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-8 h-8 text-green animate-spin" />
              <p className="text-gray-500 text-sm animate-pulse">Fetching tournament data...</p>
            </div>
          ) : filteredTournaments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tournament</th>
                    <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Schedule</th>
                    <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Economy</th>
                    <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTournaments.map((tournament) => (
                    <tr key={tournament.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-amber border border-amber/20">
                            <Trophy className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-green transition-colors">{tournament.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-[200px]">{tournament.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="w-3 h-3 text-blue" />
                            {format(new Date(tournament.startTime), "MMM d, HH:mm")}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-600">
                            <Clock className="w-3 h-3" />
                            to {format(new Date(tournament.endTime), "MMM d, HH:mm")}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-white">
                            <Coins className="w-3 h-3 text-amber" />
                            ₦{tournament.prizePool.toLocaleString()} Pool
                          </div>
                          <div className="text-[10px] text-gray-500">
                            Entry: ₦{tournament.registrationFee}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          tournament.status === 'active' ? 'bg-green/10 text-green border border-green/20' :
                          tournament.status === 'upcoming' ? 'bg-blue/10 text-blue border border-blue/20' :
                          'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                        }`}>
                          {tournament.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleOpenModal(tournament);
                            }}
                            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-green hover:bg-white/5 rounded-xl transition-all cursor-pointer z-10"
                            title="Edit Tournament"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(tournament.id);
                            }}
                            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all cursor-pointer z-10"
                            title="Delete Tournament"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-gray-600">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-white font-bold">No Tournaments Found</h3>
              <p className="text-gray-500 text-sm mt-1">Schedule your first competitive event today.</p>
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={editingTournament ? "Edit Tournament" : "Create New Tournament"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tournament Title</label>
            <input 
              required
              className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-green transition-colors"
              placeholder="e.g. Weekly JAMB Challenge"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</label>
            <textarea 
              className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-green transition-colors h-24 resize-none"
              placeholder="Details about the tournament..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Start Time</label>
              <input 
                required
                type="datetime-local"
                className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-green transition-colors"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">End Time</label>
              <input 
                required
                type="datetime-local"
                className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-green transition-colors"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Entry Fee (Coins)</label>
              <input 
                required
                type="number"
                className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-green transition-colors"
                value={formData.registrationFee}
                onChange={(e) => setFormData({...formData, registrationFee: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Prize Pool (₦)</label>
              <input 
                required
                type="number"
                className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-green transition-colors"
                value={formData.prizePool}
                onChange={(e) => setFormData({...formData, prizePool: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Duration (Seconds)</label>
              <input 
                required
                type="number"
                className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-green transition-colors"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Question Count</label>
              <input 
                required
                type="number"
                className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-green transition-colors"
                value={formData.questionCount}
                onChange={(e) => setFormData({...formData, questionCount: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</label>
            <select 
              className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-green transition-colors appearance-none"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="upcoming" className="bg-navy">Upcoming</option>
              <option value="active" className="bg-navy">Active</option>
              <option value="completed" className="bg-navy">Completed</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 border-white/10 text-gray-400 hover:text-white font-bold py-6 rounded-2xl"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-green text-navy hover:bg-green/90 font-bold py-6 rounded-2xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : editingTournament ? "Update Tournament" : "Create Tournament"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
