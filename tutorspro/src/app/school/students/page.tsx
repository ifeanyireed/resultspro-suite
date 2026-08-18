"use client";

import { IconGraduationCap as GraduationCap, IconUpload as Upload, IconSearch as Search, IconFileSpreadsheet as FileSpreadsheet, IconDownload as Download, IconMoreVertical as MoreVertical, IconCheckCircle2 as CheckCircle2, IconAlertCircle as AlertCircle } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getSchoolStudents, importStudents } from '@/lib/school.api';

interface Student {
  id: string;
  fullName: string;
  email: string;
  grade: string; // Placeholder
  parent: string; // Placeholder
  lastActive: string; // Placeholder
}

export default function SchoolStudents() {
  const [isImporting, setIsImporting] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSchoolStudents();
      setStudents(data.map((s: any) => ({
        id: s.id,
        fullName: s.fullName || 'N/A',
        email: s.email || 'N/A',
        grade: 'N/A',
        parent: 'N/A',
        lastActive: 'N/A',
      })));
    } catch (err: any) {
      const msg = err.error || "Failed to fetch students.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    toast.loading('Importing students...', { id: 'import-toast' });
    
    try {
      const response = await importStudents(file);
      toast.success(response.message || 'Import process started.', { id: 'import-toast' });
      // The backend isn't fully implemented, so we'll just show the message.
      // In a real scenario, you might poll for status or use websockets.
    } catch (err: any) {
      const msg = err.message || "Import failed.";
      toast.error(msg, { id: 'import-toast' });
    } finally {
      setUploading(false);
      setIsImporting(false);
    }
  };


  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Student Directory</h1>
            <p className="text-gray-400">Manage student enrollments and bulk import records.</p>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => setIsImporting(true)}
               className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center gap-2 hover:bg-white/10 transition-all text-sm"
             >
               <Upload className="w-5 h-5 text-purple" /> Bulk Import (CSV)
             </button>
          </div>
        </div>

        {isImporting && (
          <div className="mb-12 p-8 rounded-[40px] bg-purple/10 border border-purple/20 animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
               <div>
                 <h3 className="text-xl font-bold text-white mb-1">CSV Import Wizard</h3>
                 <p className="text-sm text-gray-400">Download our template, fill it with student data, and re-upload.</p>
               </div>
               <div className="flex gap-4 w-full md:w-auto">
                  <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all text-sm">
                    <Download className="w-4 h-4" /> Template
                  </button>
                  <label className={`flex-1 md:flex-none px-6 py-3 rounded-xl bg-purple text-white font-bold flex items-center justify-center gap-2 transition-all text-sm cursor-pointer ${uploading ? 'bg-purple/50 cursor-not-allowed' : 'hover:opacity-90'}`}>
                    <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Choose File'}
                    <input type="file" className="hidden" onChange={handleFileChange} disabled={uploading}/>
                  </label>
                  <button onClick={() => setIsImporting(false)} className="p-3 text-gray-500 hover:text-white transition-colors">Cancel</button>
               </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden mb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Student</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Grade</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Parent / Guardian</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Last Activity</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-20 text-gray-500">Loading students...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="text-center py-20 text-red-400">{error}</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-20 text-gray-500">No students found.</td></tr>
              ) : (
                students.map((student) => (
                <tr key={student.id} className="hover:bg-white/[0.04] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue/10 flex items-center justify-center text-blue">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-white font-bold group-hover:text-purple transition-colors">{student.fullName}</div>
                        <div className="text-xs text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-lg bg-white/5 text-xs text-white font-medium">
                      Grade {student.grade}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-white text-sm">{student.parent}</div>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-400">{student.lastActive}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all inline-flex items-center">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
