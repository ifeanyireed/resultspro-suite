"use client";

import {
  IconTrophy as Trophy,
  IconCrown as Crown,
  IconTrendingUp as TrendingUp,
  IconTarget as Target,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import api from "@/lib/api";

export default function SchoolLeaderboardPage() {
  const [activeTab, setActiveTab] = useState("Academic");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api
          .get(`/gamification/leaderboard?scope=school&category=${activeTab.toLowerCase()}`)
          .catch(() => ({ data: [] }));
        if (!cancelled) {
          setProfiles(Array.isArray(res.data) ? res.data : []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadLeaderboard();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const getInitials = (name: string) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <main className="p-8 max-w-5xl mx-auto space-y-12">
          <div className="flex flex-col items-center space-y-6">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-16 w-96 rounded-xl" />
          </div>
          <div className="space-y-3 max-w-4xl mx-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const topThree = profiles.slice(0, 3);
  const podium = [topThree[1] || null, topThree[0] || null, topThree[2] || null];
  const others = profiles.slice(3);

  return (
    <div className="flex-1 bg-[#f9fafc] min-h-screen">
      <main className="p-8 max-w-5xl mx-auto">
        <MotionRise className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-600 mb-6">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Hall of Fame · CampusPRO Enrolled Students
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-gray-900 mb-6 uppercase">
            {activeTab} <span className="text-[#146ef5]">RANKINGS</span>
          </h1>

          <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-white shadow-sm border border-gray-100 w-fit mx-auto">
            {["Academic", "Engagement", "Streaks"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab
                    ? "bg-[#146ef5] text-white shadow-lg"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </MotionRise>

        {profiles.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-gray-100 text-center text-sm text-gray-500">
            No student leaderboard records found yet. Enrolled students from{" "}
            <code>service_campuspro</code> appear here as they earn XP from Study Packs.
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <MotionRise
              delay={0.08}
              className="flex items-end justify-center gap-4 mb-20 max-w-3xl mx-auto"
            >
              {podium[0] && (
                <div className="flex flex-col items-center gap-4 flex-1 max-w-[140px]">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#146ef5] overflow-hidden p-1 bg-white flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-[#146ef5] font-bold text-xl">
                        {getInitials(podium[0].user?.full_name)}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#146ef5] flex items-center justify-center font-black text-white text-xs border-4 border-white">
                      2
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900 mb-1 truncate w-28">
                      {podium[0].user?.full_name}
                    </div>
                    <div className="text-xs font-black text-[#146ef5]">
                      {(podium[0].points ?? podium[0].xp ?? 0).toLocaleString()} pts
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">
                      {podium[0].user?.class?.name || "Enrolled"}
                    </div>
                  </div>
                </div>
              )}

              {podium[1] && (
                <div className="flex flex-col items-center gap-4 flex-1 max-w-[160px] -translate-y-8">
                  <div className="relative">
                    <Crown className="w-8 h-8 text-amber-600 absolute -top-8 left-1/2 -translate-x-1/2" />
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-amber-500 overflow-hidden p-1 bg-white flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-2xl">
                        {getInitials(podium[1].user?.full_name)}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-black text-white text-sm border-4 border-white">
                      1
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-black text-gray-900 mb-1 truncate w-32">
                      {podium[1].user?.full_name}
                    </div>
                    <div className="text-sm font-black text-amber-600">
                      {(podium[1].points ?? podium[1].xp ?? 0).toLocaleString()} pts
                    </div>
                    <div className="text-[10px] text-amber-600/80 font-bold uppercase tracking-wider">
                      {podium[1].user?.class?.name || "Enrolled"}
                    </div>
                  </div>
                </div>
              )}

              {podium[2] && (
                <div className="flex flex-col items-center gap-4 flex-1 max-w-[140px]">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-emerald-500 overflow-hidden p-1 bg-white flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                        {getInitials(podium[2].user?.full_name)}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-black text-white text-xs border-4 border-white">
                      3
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900 mb-1 truncate w-28">
                      {podium[2].user?.full_name}
                    </div>
                    <div className="text-xs font-black text-emerald-600">
                      {(podium[2].points ?? podium[2].xp ?? 0).toLocaleString()} pts
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">
                      {podium[2].user?.class?.name || "Enrolled"}
                    </div>
                  </div>
                </div>
              )}
            </MotionRise>

            {/* Remaining Students */}
            <MotionStagger className="space-y-3 max-w-4xl mx-auto">
              {others.map((student, index) => (
                <div
                  key={student.id || index}
                  className="group p-4 rounded-2xl bg-white border border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-sm font-black text-gray-600">{index + 4}</div>
                    <div className="w-10 h-10 rounded-full border border-gray-100 bg-blue-50 flex items-center justify-center text-xs font-bold text-[#146ef5]">
                      {getInitials(student.user?.full_name)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        {student.user?.full_name}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          {student.user?.class?.name || "Enrolled"}
                        </span>
                        <span className="text-gray-400">•</span>
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-sm font-black text-gray-900">
                        {(student.points ?? student.xp ?? 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        Points
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500">
                      <Target className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </MotionStagger>
          </>
        )}
      </main>
    </div>
  );
}
