import React, { useState, useEffect } from 'react';
import { Gamepad2, Search, Filter, RefreshCw, Trash2, Users, Coins, Clock } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { fetchExamproLiveRooms, deleteExamproLiveRoom } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LiveGamesTab() {
  const [rooms, setRooms] = useState<any[]>([]);
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
      const data = await fetchExamproLiveRooms({ page, limit, search, status });
      setRooms(data.rooms || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load live rooms');
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
    if (!window.confirm('Are you sure you want to forcibly delete this room? This cannot be undone.')) return;
    try {
      await deleteExamproLiveRoom(id);
      toast.success('Room deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete room');
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
            <Gamepad2 className="w-5 h-5 text-indigo-600" /> Live Multiplayer Rooms
          </h2>
          <p className="text-xs text-slate-500 mt-1">Monitor and manage real-time competitive gaming sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-xl sm:rounded-full border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by room title or ID..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-indigo-500 transition-all" 
          />
        </div>
        <div className="flex-[0.5] relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-indigo-500 transition-all appearance-none cursor-pointer text-slate-600 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="pending">Waiting for Players (Pending)</option>
            <option value="active">Live & Playing (Active)</option>
            <option value="finished">Ended (Finished)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="relative min-h-[400px]">
        {loading && rooms.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        )}
        
        {rooms.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Gamepad2 className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No live rooms found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all group flex flex-col">
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <Badge status={room.status} />
                    <button onClick={() => handleDelete(room.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1 mb-1" title={room.title || 'Untitled Room'}>{room.title || 'Untitled Room'}</h3>
                  <p className="text-xs font-semibold text-slate-500 mb-4">{room.subject?.name || 'Unknown Subject'}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                    <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                      <Users className="w-4 h-4 text-slate-400 mb-1" />
                      <span className="text-xs font-black text-slate-700">{room._count?.players || 0} / {room.maxPlayers}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Players</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                      <Coins className="w-4 h-4 text-amber-400 mb-1" />
                      <span className="text-xs font-black text-amber-600">{room.entryFee}</span>
                      <span className="text-[9px] font-bold text-amber-600/60 uppercase tracking-widest mt-0.5">Entry Fee</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-4 border-t border-slate-100">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {formatTime(room.createdAt)}</span>
                    <span className="uppercase tracking-wider">{room.type}</span>
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
              {loading && <RefreshCw className="w-3.5 h-3.5 text-indigo-500 animate-spin" />}
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
