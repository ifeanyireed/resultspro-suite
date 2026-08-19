import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { Star, Search, RefreshCw, GraduationCap } from 'lucide-react';
import { fetchTutorsproTutors } from '@/lib/api';

export default function ProfilesTab() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchTutorsproTutors();
      setTutors(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto w-full">
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search tutors by name or subject..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Tutor ID</th>
              <th className="px-4 py-3">Subjects Offered</th>
              <th className="px-4 py-3">Hourly Rate</th>
              <th className="px-4 py-3">Rating & Reviews</th>
              <th className="px-4 py-3">Total Lessons Completed</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tutors.map((t) => (
              <tr key={t.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span>{t.user_id}</span>
                </td>
                <td className="px-4 py-3.5 text-slate-600 font-semibold max-w-[150px] truncate">{t.subjects}</td>
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">{t.currency} {t.hourly_rate}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center space-x-1 font-semibold text-slate-900">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{t.rating || '0.0'}</span>
                    <span className="text-slate-400 font-normal">({t.total_reviews || 0})</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">{t.total_lessons || 0}</td>
                <td className="px-4 py-3.5">
                  <Badge status={t.is_verified ? 'VERIFIED' : 'PENDING'} />
                </td>
                <td className="px-4 py-3.5 text-right space-x-2">
                  {!t.is_verified ? (
                    <button className="px-2.5 py-1 bg-emerald-600 text-white rounded-full font-semibold text-[11px] hover:bg-emerald-700 whitespace-nowrap">
                      Verify Tutor
                    </button>
                  ) : (
                    <button className="text-blue-600 hover:underline font-semibold">View Profile</button>
                  )}
                </td>
              </tr>
            ))}
            {tutors.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No tutors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
