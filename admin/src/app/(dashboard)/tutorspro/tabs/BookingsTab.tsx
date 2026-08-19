import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { Search, RefreshCw, Calendar, Clock } from 'lucide-react';
import { fetchTutorsproBookings } from '@/lib/api';

export default function BookingsTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchTutorsproBookings();
      setBookings(data);
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
            placeholder="Search bookings..."
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
              <th className="px-4 py-3">Booking ID</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Schedule</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">
                  {b.id.substring(0, 8)}...
                </td>
                <td className="px-4 py-3.5 text-slate-600 font-semibold">{b.subject}</td>
                <td className="px-4 py-3.5 text-slate-800">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {new Date(b.scheduled_date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1 text-slate-500"><Clock className="w-3 h-3 text-slate-400" /> {b.start_time} - {b.end_time}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">{b.currency} {b.total_amount}</td>
                <td className="px-4 py-3.5">
                  <Badge status={b.status} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button className="text-blue-600 hover:underline font-semibold">View Details</button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
