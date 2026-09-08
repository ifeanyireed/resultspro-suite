import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, MessageSquare } from 'lucide-react';
import { fetchExamproReports, updateExamproReportStatus } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ModerationTab() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  
  // Action Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionStatus, setActionStatus] = useState('resolved'); // 'resolved' or 'dismissed'

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchExamproReports({ type: filterType, status: filterStatus });
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterType, filterStatus]);

  const handleOpenActionModal = (report: any) => {
    setSelectedReport(report);
    setAdminNotes(report.adminNotes || '');
    setActionStatus(report.status === 'pending' ? 'resolved' : report.status);
    setIsModalOpen(true);
  };

  const handleProcessReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    try {
      await updateExamproReportStatus(selectedReport.id, actionStatus, adminNotes);
      toast.success('Report updated successfully');
      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update report');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'dismissed': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" /> Moderation & Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">Review user-submitted reports for questions, comments, and other users</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-red-500' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-xl sm:rounded-full border border-slate-200 shadow-sm">
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm font-medium focus:outline-none focus:border-red-500 appearance-none cursor-pointer"
        >
          <option value="">All Report Types</option>
          <option value="question">Question Error / Typo</option>
          <option value="user">User Behavior</option>
          <option value="comment">Inappropriate Comment</option>
          <option value="other">Other Issues</option>
        </select>
        
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm font-medium focus:outline-none focus:border-red-500 appearance-none cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="pending">Needs Review (Pending)</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div></div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-dashed border border-slate-200 m-6 rounded-2xl bg-slate-50">
            <ShieldAlert className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No reports found matching your criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      Type: {report.type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 ml-auto">
                      <Clock className="w-3.5 h-3.5" /> {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 mb-4">
                    <p className="text-sm font-bold text-slate-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      "{report.reason}"
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
                    <p>Reported By: <span className="text-slate-800">{report.reporter?.firstName} {report.reporter?.lastName}</span></p>
                    <p>Target ID: <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{report.targetId}</span></p>
                  </div>
                </div>
                
                <div className="flex md:flex-col justify-end gap-2 shrink-0 md:w-48">
                  <button 
                    onClick={() => handleOpenActionModal(report)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 rounded-xl text-sm font-bold text-slate-700 transition-colors shadow-sm"
                  >
                    {report.status === 'pending' ? 'Review Report' : 'Update Status'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" /> Process Report
              </h3>
            </div>
            
            <form onSubmit={handleProcessReport} className="p-6 space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Original Complaint</p>
                <p className="text-sm font-medium text-slate-800 italic">"{selectedReport.reason}"</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Action Required</label>
                <select 
                  value={actionStatus} 
                  onChange={e => setActionStatus(e.target.value)} 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none appearance-none"
                >
                  <option value="pending">Leave as Pending</option>
                  <option value="resolved">Mark as Resolved (Fixed/Action Taken)</option>
                  <option value="dismissed">Dismiss (Invalid/Spam)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Admin Resolution Notes</label>
                <textarea 
                  rows={4} 
                  placeholder="E.g. Corrected typo in question #45 / Banned user..."
                  value={adminNotes} 
                  onChange={e => setAdminNotes(e.target.value)} 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none resize-none" 
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-8 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl shadow-md shadow-red-500/20 transition-all">Submit Resolution</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
