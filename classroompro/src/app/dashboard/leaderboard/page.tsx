"use client";

import { IconTrophy as Trophy, IconCrown as Crown, IconTrendingUp as TrendingUp, IconTarget as Target, IconUsers as Users, IconSchool as School, IconGlobe as Globe, IconLoader2 as Loader2 } from '@tabler/icons-react';
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardPage() {
  const user = useAuthStore((state) => state.user);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<string>("class"); // class, school, national

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/gamification/leaderboard?scope=${scope}`);
        setProfiles(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [scope]);

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const topThree = profiles.slice(0, 3);
  // Reorder top 3 for podium (2, 1, 3)
  const podium = [
    topThree[1] || null,
    topThree[0] || null,
    topThree[2] || null
  ];
  const others = profiles.slice(3);

  const myProfile = profiles.find(p => p.user?.id === user?.id);
  const myRank = profiles.findIndex(p => p.user?.id === user?.id) + 1;

  const scopes = [
    { id: "class", label: "My Class", icon: <Users className="w-4 h-4" /> },
    { id: "school", label: "School", icon: <School className="w-4 h-4" /> },
    { id: "national", label: "National", icon: <Globe className="w-4 h-4" /> }
  ];

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        
        <div className="p-8 max-w-2xl mx-auto space-y-10 mt-12">
          <div className="flex items-end justify-center gap-4 h-64">
            <Skeleton className="w-32 h-40 rounded-t-[32px]" />
            <Skeleton className="w-32 h-56 rounded-t-[32px]" />
            <Skeleton className="w-32 h-32 rounded-t-[32px]" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-20 rounded-[24px]" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      
      
      <main className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 font-display">Hall of Fame 🏆</h2>
            <p className="text-gray-500 text-sm">Compete with your peers and climb the ranks.</p>
          </div>

          <div className="flex bg-white shadow-sm border border-gray-100 p-1 rounded-2xl border border-white/5">
            {scopes.map((s) => (
              <button
                key={s.id}
                onClick={() => setScope(s.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  scope === s.id 
                    ? "bg-emerald-600 text-white shadow-lg shadow-green/10" 
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-12">
            {/* Top 3 Podium */}
            <div className="flex items-end justify-center gap-2 md:gap-4 pt-12 pb-4">
              {/* Rank 2 */}
              {podium[0] && (
                <div className="flex flex-col items-center gap-4 flex-1 max-w-[140px]">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-blue overflow-hidden p-1 bg-[#146ef5] flex items-center justify-center">
                       <div className="w-full h-full rounded-full bg-blue/20 flex items-center justify-center font-black text-2xl text-gray-900 overflow-hidden">
                         {podium[0].user?.avatar_url ? (
                           <img src={podium[0].user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                         ) : (
                           getInitials(podium[0].user?.full_name)
                         )}
                       </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue flex items-center justify-center font-black text-gray-900 text-xs border-4 border-navy">
                      2
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900 mb-1 truncate w-24">{podium[0].user?.full_name || 'Anonymous'}</div>
                    <div className="text-xs font-black text-[#146ef5]">{podium[0].xp?.toLocaleString()}</div>
                  </div>
                  <div className="w-full h-24 bg-gradient-to-t from-blue/20 to-blue/5 rounded-t-2xl border-t border-x border-blue/20" />
                </div>
              )}

              {/* Rank 1 */}
              {podium[1] && (
                <div className="flex flex-col items-center gap-4 flex-1 max-w-[160px] -translate-y-8">
                  <div className="relative">
                    <Crown className="w-8 h-8 text-amber-600 absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_rgba(255,179,0,0.5)]" />
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-amber overflow-hidden p-1 bg-[#146ef5] shadow-[0_0_30px_rgba(255,111,0,0.2)] flex items-center justify-center">
                       <div className="w-full h-full rounded-full bg-amber/20 flex items-center justify-center font-black text-4xl text-gray-900 overflow-hidden">
                         {podium[1].user?.avatar_url ? (
                           <img src={podium[1].user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                         ) : (
                           getInitials(podium[1].user?.full_name)
                         )}
                       </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-amber flex items-center justify-center font-black text-white text-sm border-4 border-navy">
                      1
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-black text-gray-900 mb-1 truncate w-32">{podium[1].user?.full_name || 'Anonymous'}</div>
                    <div className="text-sm font-black text-amber-600">{podium[1].xp?.toLocaleString()}</div>
                  </div>
                  <div className="w-full h-40 bg-gradient-to-t from-amber/20 to-amber/5 rounded-t-2xl border-t border-x border-amber/20" />
                </div>
              )}

              {/* Rank 3 */}
              {podium[2] && (
                <div className="flex flex-col items-center gap-4 flex-1 max-w-[140px]">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-green overflow-hidden p-1 bg-[#146ef5] flex items-center justify-center">
                       <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center font-black text-2xl text-gray-900 overflow-hidden">
                         {podium[2].user?.avatar_url ? (
                           <img src={podium[2].user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                         ) : (
                           getInitials(podium[2].user?.full_name)
                         )}
                       </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-black text-white text-xs border-4 border-navy">
                      3
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900 mb-1 truncate w-24">{podium[2].user?.full_name || 'Anonymous'}</div>
                    <div className="text-xs font-black text-emerald-600">{podium[2].xp?.toLocaleString()}</div>
                  </div>
                  <div className="w-full h-20 bg-gradient-to-t from-green/20 to-green/5 rounded-t-2xl border-t border-x border-green/20" />
                </div>
              )}
            </div>

            {/* List of others */}
            <div className="space-y-3">
              {others.length === 0 && (
                <div className="text-center py-12 text-gray-500 italic">No more players found.</div>
              )}
              {others.map((profile, index) => {
                const isMe = profile.user?.id === user?.id;
                return (
                  <div 
                    key={profile.id}
                    className={cn(
                      "group p-4 rounded-2xl border transition-all flex items-center justify-between",
                      isMe 
                        ? "bg-blue-50 border-blue/20 hover:bg-blue/20" 
                        : "bg-white/[0.02] border-white/[0.05] border-t-white/[0.1] hover:bg-gray-50 hover:border-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 text-sm font-black text-gray-600">{index + 4}</div>
                      <div className="w-10 h-10 rounded-full border border-gray-100 overflow-hidden bg-[#146ef5] flex items-center justify-center font-bold text-white">
                         {profile.user?.avatar_url ? (
                           <img src={profile.user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                         ) : (
                           getInitials(profile.user?.full_name)
                         )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <div className="text-sm font-bold text-gray-900">{profile.user?.full_name || 'Anonymous'}</div>
                           {isMe && <span className="px-2 py-0.5 rounded bg-blue text-gray-900 text-[8px] font-black uppercase tracking-tighter">You</span>}
                           {profile.user?.role === 'TEACHER' && <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber/20 text-[8px] font-black uppercase tracking-tighter">Staff</span>}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            {profile.user?.school?.name || "Unknown School"} • {profile.user?.class?.name || "General"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-sm font-black text-gray-900">{profile.xp?.toLocaleString()}</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">XP</div>
                      </div>
                      <div className="w-px h-8 bg-white shadow-sm border border-gray-100" />
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Target className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* User's own rank sticky */}
            {user && myProfile && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-30">
                <div className="p-4 rounded-2xl bg-blue border border-gray-200 shadow-[0_0_40px_rgba(21,101,192,0.5)] flex items-center justify-between animate-in slide-in-from-bottom-8 duration-500 backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-black text-gray-900 text-lg border border-gray-100 shadow-inner">
                      {myRank}
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden bg-[#146ef5] flex items-center justify-center font-bold text-white">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user.full_name)
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black text-gray-900">You ({user.full_name})</div>
                      <div className="text-[10px] text-gray-900/70 font-bold uppercase tracking-widest mt-0.5">
                        {myRank === 1 ? 'Top Ranked!' : `Current Position`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-sm font-black text-gray-900">{myProfile.xp?.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-900/70 font-bold uppercase tracking-widest">XP</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}
