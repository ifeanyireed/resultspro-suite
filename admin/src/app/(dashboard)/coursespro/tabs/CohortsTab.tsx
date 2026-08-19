import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { Search, RefreshCw, Layers, Calendar, Users } from 'lucide-react';
import { fetchCoursesproCohorts } from '@/lib/api';

export default function CohortsTab() {
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCoursesproCohorts();
      setCohorts(data);
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
            placeholder="Search cohort programs..."
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
              <th className="px-4 py-3">Program Title</th>
              <th className="px-4 py-3">Dates & Duration</th>
              <th className="px-4 py-3">Enrollment</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {cohorts.map((cohort) => (
              <tr key={cohort.id} className="hover:bg-orange-50/30 transition-colors group">
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span>{cohort.title}</span>
                </td>
                <td className="px-4 py-3.5 text-slate-600 font-semibold">
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {new Date(cohort.start_date).toLocaleDateString()}</span>
                    <span className="text-[10px] text-slate-500">{cohort.duration_weeks} Weeks</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center space-x-1 font-semibold text-slate-900">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cohort.enrolled_count} / {cohort.capacity}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">{cohort.currency} {cohort.price.toLocaleString()}</td>
                <td className="px-4 py-3.5">
                  <Badge status={cohort.status} />
                </td>
                <td className="px-4 py-3.5 text-right space-x-2">
                  <button className="text-orange-600 hover:underline font-semibold">Manage Curriculum</button>
                </td>
              </tr>
            ))}
            {cohorts.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No cohort programs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
