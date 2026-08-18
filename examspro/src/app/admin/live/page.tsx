"use client";

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Users, 
  Play, 
  Loader2, 
  Activity, 
  Calendar,
  MessageSquare,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminLiveRoomsList() {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get('/live/active');
      setRooms(res.data);
    } catch (err) {
      toast.error("Failed to load active rooms");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader title="Live Game Rooms" />

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Active Rooms</h2>
            <p className="text-gray-500 text-sm">Manage and monitor live game sessions</p>
          </div>
          <Link href="/admin/live/setup">
            <Button className="rounded-xl bg-green text-navy hover:bg-green/90 font-bold gap-2">
              <Plus className="w-4 h-4" />
              CREATE NEW ROOM
            </Button>
          </Link>
        </div>

        {rooms.length === 0 ? (
          <div className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-gray-500">
              <Activity className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-white font-bold text-lg">No Active Rooms</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">There are no live game rooms currently active. Create one to get started.</p>
            </div>
            <Link href="/admin/live/setup">
              <Button variant="outline" className="rounded-xl border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/5">
                Setup First Room
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden group hover:border-green/30 transition-all duration-300">
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${room.status === 'active' ? 'bg-green animate-pulse' : 'bg-amber-400'}`} />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{room.status}</span>
                      </div>
                      <h4 className="text-white font-bold text-lg leading-tight">{room.subject?.name || 'Live Quiz'}</h4>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl text-green group-hover:bg-green group-hover:text-navy transition-colors">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/[0.05] border-t-white/[0.1]">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Users className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Players</span>
                      </div>
                      <p className="text-white font-bold">{room._count?.players || 0}/{room.maxPlayers}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/[0.05] border-t-white/[0.1]">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Activity className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Entry</span>
                      </div>
                      <p className="text-white font-bold">{room.entryFee} Coins</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">{new Date(room.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link href={`/admin/live/control?roomId=${room.id}`}>
                      <Button variant="ghost" className="text-green text-xs font-bold gap-1 hover:text-green hover:bg-green/10 p-0">
                        OPEN CONTROL
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="bg-white/5 px-6 py-4 border-t border-white/[0.05] border-t-white/[0.1] flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1,2,3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-navy bg-gray-800 flex items-center justify-center text-[8px] text-white font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-navy bg-white/5 flex items-center justify-center text-[8px] text-gray-500 font-bold">
                      +{(room._count?.players || 0) > 3 ? (room._count?.players - 3) : 0}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <Monitor className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
