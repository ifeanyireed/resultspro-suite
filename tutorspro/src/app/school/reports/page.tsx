"use client";

import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search,
  ChevronRight,
  BarChart3,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getReports, generateReport } from '@/lib/school.api';

interface Report {
  title: string;
  type: string;
  date: string;
  format: string;
  size: string;
}

export default function SchoolReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      toast.error("Failed to load reports.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    const toastId = toast.loading("Generating report...");
    try {
      const response = await generateReport({});
      toast.success(response.message || "Report generation started!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Failed to generate report.", { id: toastId });
    }
  };

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">School Reports</h1>
            <p className="text-gray-400">Generate and download comprehensive data exports for your institution.</p>
          </div>
          <button 
            onClick={handleGenerateReport}
            className="px-6 py-3 rounded-2xl bg-purple text-white font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all text-sm">
            <BarChart3 className="w-5 h-5" /> Generate Custom Report
          </button>
        </div>

        {/* Reports List */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <p className="text-gray-500 text-center py-10">Loading reports...</p>
          ) : (
            reports.map((report, i) => (
            <div key={i} className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all flex flex-col md:flex-row items-center justify-between gap-6 group">
               <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-14 h-14 rounded-2xl bg-purple/10 flex items-center justify-center text-purple">
                     <FileText className="w-7 h-7" />
                  </div>
                  <div>
                     <h4 className="text-lg font-bold text-white mb-1 group-hover:text-purple transition-colors">{report.title}</h4>
                     <div className="flex items-center gap-3 text-xs text-gray-500 uppercase font-bold tracking-tight">
                        <span>{report.type}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                        <span>{report.date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                        <span>{report.format} • {report.size}</span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-purple text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                     <Download className="w-4 h-4" /> Download
                  </button>
                  <button className="p-3 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all">
                     <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
          )))}
        </div>
      </div>
    </main>
  );
}
