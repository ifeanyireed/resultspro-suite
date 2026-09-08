import React, { useState, useEffect } from 'react';
import { Swords, Search, Filter, RefreshCw, Trash2, Users, Coins, Clock, Bot } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { fetchExamproBattleMatches, deleteExamproBattleMatch } from '@/lib/api';
import toast from 'react-hot-toast';

export default function BattlesTab() {
  const [battles, setBattles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchExamproBattleMatches({ page, limit, search, status });
      setBattles(data.battles || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load battles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [page, search, status]);

  const totalPages = Math.ceil(total / limit);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to forcibly delete this battle? This cannot be undone.')) return;
    try {
      await deleteExamproBattleMatch(id);
      toast.success('Battle deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete battle');
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString(undefined, { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Swords className="w-5 h-5 text-rose-500" /> 1v1 Battle Matches
          </h2>
          <p className="text-xs text-slate-500 mt-1">Monitor and manage peer-to-peer and bot battles</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-500' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-xl sm:rounded-full border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by room code or ID..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-rose-500 transition-all" 
          />
        </div>
        <div className="flex-[0.5] relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-rose-500 transition-all appearance-none cursor-pointer text-slate-600 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="waiting">Waiting for Opponent</option>
            <option value="active">Live & Fighting</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="relative min-h-[400px]">
        {loading && battles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
            <RefreshCw className="w-8 h-8 text-rose-500 animate-spin" />
          </div>
        )}
        
        {battles.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Swords className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No battle matches found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {battles.map((battle) => (
              <div key={battle.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-rose-500/10 transition-all group flex flex-col">
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <Badge status={battle.status} />
                    <button onClick={() => handleDelete(battle.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-black text-slate-800 tracking-wider">CODE: {battle.roomCode}</h3>
                    {battle.isBot && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-bold"><Bot className="w-3 h-3" /> BOT</span>}
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mb-4 line-clamp-1">{battle.subject?.name || 'Unknown Subject'} • {battle.questionCount} Qs</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                    <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                      <Users className="w-4 h-4 text-slate-400 mb-1" />
                      <span className="text-xs font-black text-slate-700">{battle.participants?.length || 0} / {battle.maxParticipants}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Players</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                      <Coins className="w-4 h-4 text-amber-400 mb-1" />
                      <span className="text-xs font-black text-amber-600">{battle.stakePerPlayer}</span>
                      <span className="text-[9px] font-bold text-amber-600/60 uppercase tracking-widest mt-0.5">Stake</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-4 border-t border-slate-100">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {formatTime(battle.createdAt)}</span>
                    <span className="uppercase tracking-wider">{battle.duration}s / Q</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="mt-8 flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-3">
              <span>Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total.toLocaleString()}</span>
              {loading && <RefreshCw className="w-3.5 h-3.5 text-rose-500 animate-spin" />}
            </span>
            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-50 transition-colors">Prev</button>
              <span className="text-xs font-bold text-slate-600 px-2">Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-50 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
