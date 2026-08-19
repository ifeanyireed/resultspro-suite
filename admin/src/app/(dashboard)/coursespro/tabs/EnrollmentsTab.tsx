import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { Search, RefreshCw, UserCheck } from 'lucide-react';
import { fetchCoursesproEnrollments } from '@/lib/api';

export default function EnrollmentsTab() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCoursesproEnrollments();
      setEnrollments(data);
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
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search enrollments..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-600' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Student ID</th>
              <th className="px-4 py-3">Cohort ID</th>
              <th className="px-4 py-3">Plan & Payment</th>
              <th className="px-4 py-3">Stage & XP</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {enrollments.map((e) => (
              <tr key={e.id} className="hover:bg-orange-50/30 transition-colors group">
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">
                  {e.user_id}
                </td>
                <td className="px-4 py-3.5 font-semibold text-slate-600">
                  {e.cohort_id}
                </td>
                <td className="px-4 py-3.5 text-slate-800">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">{e.plan_type}</span>
                    <span className="text-[10px] font-bold text-emerald-600">{e.payment_status}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">
                  Stage {e.current_stage_number} ({e.current_xp} XP)
                </td>
                <td className="px-4 py-3.5">
                  <Badge status={e.status} />
                </td>
                <td className="px-4 py-3.5 text-right space-x-2">
                  <button className="text-orange-600 hover:underline font-semibold">View Progress</button>
                </td>
              </tr>
            ))}
            {enrollments.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No enrollments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
