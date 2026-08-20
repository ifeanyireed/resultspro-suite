"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { IconUsers as UsersIcon, IconMessage as MessageIcon, IconSend as SendIcon, IconMoodSmile as SmileIcon, IconShieldCheck as ShieldIcon, IconCoins as CoinsIcon, IconArrowLeft as ArrowLeftIcon, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useLiveGame } from '@/hooks/useLiveGame';
import { useAuthStore } from '@/store/useAuthStore';

function LiveWaitingRoomContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const router = useRouter();
  const { user, fetchUser } = useAuthStore();
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const { 
    isConnected, 
    playersCount, 
    gameStatus,
    chatMessages,
    sendChatMessage
  } = useLiveGame(roomId || "");

  const fetchRoomDetails = useCallback(async () => {
    if (!roomId) return;
    try {
      const response = await api.get(`/live/rooms/${roomId}`);
      setRoomData(response.data);
    } catch (error) {
      console.error('Error fetching room details:', error);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
    } else {
      setLoading(false);
    }
  }, [roomId, fetchRoomDetails]);

  // Handle participant refresh when playersCount changes
  useEffect(() => {
    if (isConnected) {
      fetchRoomDetails();
    }
  }, [playersCount, isConnected, fetchRoomDetails]);

  useEffect(() => {
    if (gameStatus === 'active' && roomId) {
      router.push(`/live/play?roomId=${roomId}`);
    }
  }, [gameStatus, roomId, router]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendChatMessage(message);
      setMessage("");
    }
  };

  const handleJoin = async () => {
    if (!roomId) return;
    try {
      await api.post(`/live/join/${roomId}`);
      fetchUser();
      fetchRoomDetails();
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to join room");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-navy text-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-green animate-spin" />
      </main>
    );
  }

  if (!roomId || !roomData) {
    return (
      <main className="min-h-screen bg-navy text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{!roomId ? "No Room ID Provided" : "Room Not Found"}</h1>
          <Link href="/live">
            <Button className="bg-green text-navy">Back to Lobby</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Main Content: Participant Grid */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/live" 
              className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Leave Room</span>
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 text-green font-bold text-xs uppercase tracking-widest mb-2">
                  <ShieldIcon className="w-4 h-4" /> Official Room
                </div>
                <h1 className="text-3xl font-display font-black uppercase tracking-tight">
                  {roomData.subject?.name} Live
                </h1>
                <p className="text-gray-500">
                  Host: {roomData.adminName} • {roomData.type} • {roomData.entryFee} Coin Entry
                </p>
              </div>

              <div className="flex items-center gap-4 bg-white/5 border border-white/[0.1] border-t-white/[0.15] px-6 py-4 rounded-[24px]">
                <div className="text-center">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Status</div>
                  <div className="text-2xl font-display font-black text-green">
                    {isConnected ? 'LIVE' : 'WAITING'}
                  </div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Players</div>
                  <div className="text-2xl font-display font-black text-white">
                    {playersCount}/{roomData.maxPlayers}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
              {roomData.participants?.map((p: any, i: number) => (
                <div key={p.id} className="flex flex-col items-center gap-3 group animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl border-2 border-white/[0.1] border-t-white/[0.15] group-hover:border-green transition-all bg-white/5 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${p.userId}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green rounded-full border-2 border-navy" />
                  </div>
                  <div className="text-xs font-bold text-gray-400 truncate w-full text-center">{p.user?.name || 'Player'}</div>
                </div>
              ))}
              {Array.from({ length: Math.max(0, 6 - (roomData.participants?.length || 0)) }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 opacity-20">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="text-[10px] font-bold text-gray-700 uppercase">Waiting...</div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 rounded-[32px] bg-gradient-to-br from-amber/10 to-transparent border border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  {roomData.type === 'High Stakes' ? 'High Stakes Round' : 'Public Tournament'}
                </h3>
                <p className="text-sm text-gray-400">
                  Winning this game earns you a &quot;Live Champion&quot; badge and a share of the pool.
                </p>
              </div>
              <div className="flex items-center gap-2 text-amber bg-amber/10 px-4 py-2 rounded-xl border border-amber/20">
                <CoinsIcon className="w-5 h-5" />
                <span className="font-black">{playersCount * roomData.entryFee} Pool</span>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              {roomData.participants?.some((p: any) => p.userId === user?.id) ? (
                <div className="text-center">
                  <p className="text-green font-bold mb-4 italic tracking-widest text-[10px] uppercase">✓ YOU HAVE JOINED THIS ROOM</p>
                  <Button disabled className="w-full max-w-sm bg-white/5 text-gray-500 rounded-2xl py-8 text-xl font-black border border-white/[0.05] border-t-white/[0.1]">
                    WAITING FOR START...
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleJoin}
                  className="w-full max-w-sm bg-green text-navy hover:bg-green/90 rounded-2xl py-8 text-xl font-black shadow-[0_0_30px_rgba(0,200,83,0.3)] hover:scale-105 transition-all"
                >
                  JOIN NOW ({roomData.entryFee} Coins)
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Live Chat */}
        <aside className="w-full lg:w-96 bg-white/[0.02] border-l border-white/[0.05] border-t-white/[0.1] flex flex-col h-[600px] lg:h-auto">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-navy/50">
            <div className="flex items-center gap-3">
              <MessageIcon className="w-5 h-5 text-green" />
              <h3 className="font-bold uppercase tracking-widest text-xs">Live Chat</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-gray-500 uppercase">
                {playersCount} Online
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {[
              { user: "System", text: `Welcome to the ${roomData.subject?.name} live game! Be respectful in chat.`, system: true, time: "Now" },
              ...chatMessages
            ].map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.system ? 'items-center' : ''} animate-in slide-in-from-bottom-2 duration-300`}>
                {msg.system ? (
                  <div className="bg-white/5 px-4 py-1.5 rounded-full text-[9px] font-bold text-gray-500 uppercase tracking-widest border border-white/[0.05] border-t-white/[0.1]">
                    {msg.text}
                  </div>
                ) : (
                  <div className="group/msg">
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-xs font-black ${msg.user === 'You' ? 'text-blue' : 'text-green'}`}>{msg.user}</span>
                        <span className="text-[9px] text-gray-600 font-bold">{msg.time}</span>
                      </div>
                      <button 
                        onClick={() => {
                          if (confirm(`Report ${msg.user} for inappropriate behavior?`)) {
                            api.post('/moderation/report', { 
                              type: 'user', 
                              targetId: msg.userId, 
                              reason: 'Chat behavior' 
                            });
                            alert("Report submitted.");
                          }
                        }}
                        className="opacity-0 group-hover/msg:opacity-100 text-[9px] text-red-500 font-bold uppercase transition-opacity"
                      >
                        Report
                      </button>
                    </div>
                    <div className={`bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none border border-white/[0.05] border-t-white/[0.1] text-sm leading-relaxed ${msg.user === 'You' ? 'border-blue/20 bg-blue/5' : ''}`}>
                      {msg.text}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-white/5 bg-navy/30">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-4 px-4 text-sm focus:outline-none focus:border-green transition-all"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green">
                  <SmileIcon className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={handleSendMessage}
                className="p-4 bg-green text-navy rounded-xl hover:bg-green/90 transition-all hover:scale-105 active:scale-95"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
              {['🔥', '🚀', '🧠', '💯', '👏', '🙌'].map(emoji => (
                <button 
                  key={emoji} 
                  onClick={() => setMessage(prev => prev + emoji)}
                  className="p-2 rounded-lg bg-white/5 border border-white/[0.1] border-t-white/[0.15] hover:bg-white/10 transition-colors text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function LiveWaitingRoom() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-navy text-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-green animate-spin" />
      </main>
    }>
      <LiveWaitingRoomContent />
    </Suspense>
  );
}
