"use client";

import { useState, useEffect } from 'react';
import { IconShieldAlert as ShieldAlert, IconFlag as Flag, IconUserX as UserX, IconSearch as Search, IconFilter as Filter, IconCheckCircle2 as CheckCircle2, IconXCircle as XCircle, IconAlertTriangle as AlertTriangle, IconEye as Eye, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/admin/AdminHeader';
import { moderationApi, Report } from '@/lib/moderation.api';
import { formatDistanceToNow } from 'date-fns';

export default function AdminModerationPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', status: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await moderationApi.getReports(filter);
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await moderationApi.updateReportStatus(id, { status });
      fetchReports();
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const filteredReports = reports.filter(report => 
    report.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const kpis = [
    { label: "Pending Reports", value: reports.filter(r => r.status === 'pending').length.toString(), icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Resolved Total", value: reports.filter(r => r.status === 'resolved').length.toString(), icon: CheckCircle2, color: "text-green", bg: "bg-green/10" },
    { label: "Under Review", value: reports.filter(r => r.status === 'under_review').length.toString(), icon: ShieldAlert, color: "text-blue-400", bg: "bg-blue-400/10" },
  ];

  return (
    <>
      <AdminHeader title="Content Moderation" />

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">Content Moderation</h1>
            <p className="text-sm text-gray-500">Manage reported content and user behavior.</p>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/[0.05] border-t-white/[0.1]">
            <button 
              onClick={() => setFilter({ ...filter, type: '' })}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${filter.type === '' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              All Reports
            </button>
            <button 
              onClick={() => setFilter({ ...filter, type: 'question' })}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${filter.type === 'question' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Flagged Questions
            </button>
            <button 
              onClick={() => setFilter({ ...filter, type: 'user' })}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${filter.type === 'user' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              User Reports
            </button>
          </div>
        </div>

        {/* Moderation KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white/[0.02] p-6 rounded-3xl border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center gap-6 group hover:border-white/10 transition-all">
              <div className={`w-14 h-14 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0`}>
                <kpi.icon className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{kpi.label}</div>
                <div className="text-3xl font-display font-black text-white">{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by target ID, reporter, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors"
            />
          </div>
          <select 
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green/50 transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>

        {/* Reports Table */}
        <div className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Report ID</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type / Target</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reason</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reporter</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-green animate-spin" />
                        <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">Loading reports...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center">
                      <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">No reports found</span>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-white uppercase">{report.id.slice(0, 8)}</span>
                        <div className="text-[8px] text-gray-600 font-bold uppercase">
                          {formatDistanceToNow(new Date(report.createdAt))} ago
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {report.type === 'question' ? <Flag className="w-3 h-3 text-blue-400" /> : <UserX className="w-3 h-3 text-purple-400" />}
                          <span className="text-sm font-bold text-white">{report.targetId.slice(0, 8)}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium capitalize">{report.type}</div>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-400 font-medium italic">&quot;{report.reason}&quot;</td>
                      <td className="px-8 py-6 text-sm font-bold text-gray-500">{report.reporter.name || report.reporter.email}</td>
                      <td className="px-8 py-6">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                          report.status === 'resolved' ? 'bg-green/10 text-green' : 
                          report.status === 'dismissed' ? 'bg-red-500/10 text-red-500' :
                          report.status === 'under_review' ? 'bg-blue/10 text-blue-400' : 
                          'bg-amber-400/10 text-amber-400'
                        }`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleUpdateStatus(report.id, 'resolved')}
                            title="Resolve"
                            className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-green hover:bg-green/10 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                            title="Dismiss"
                            className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(report.id, 'under_review')}
                            title="Review"
                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
