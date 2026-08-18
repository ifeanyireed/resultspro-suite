import React from 'react';
import { Trophy, Plus, Users, Calendar } from 'lucide-react';
import { Badge } from '@/components/Badge';

export default function TournamentsTab() {
  const tournaments = [
    { id: '1', name: 'National JAMB Mock 2026', subject: 'All Subjects', prizePool: '100,000 NGN', participants: 450, date: 'Oct 20, 2026', status: 'UPCOMING' },
    { id: '2', name: 'Weekly Math Challenge', subject: 'Mathematics', prizePool: '10,000 NGN', participants: 120, date: 'Oct 15, 2026', status: 'COMPLETED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Tournaments & Leaderboards
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage competitive mass-events and payouts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-full text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Create Tournament
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Tournament</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Prize Pool</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Participants</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Date</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tournaments.map((t) => (
                <tr key={t.id} className="hover:bg-amber-50/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 text-xs mb-1">{t.name}</p>
                    <p className="text-[10px] text-slate-500">{t.subject}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-emerald-600">{t.prizePool}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Users className="w-3.5 h-3.5" /> {t.participants}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Calendar className="w-3.5 h-3.5" /> {t.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
