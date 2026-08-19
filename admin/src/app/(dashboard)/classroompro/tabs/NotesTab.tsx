import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { BookOpen, Search, Plus, RefreshCw } from 'lucide-react';
import { fetchClassroomNotes } from '@/lib/api';

export default function NotesTab() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchClassroomNotes();
      setNotes(data);
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
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" /></div>
          <input
            type="text"
            placeholder="Search study handouts..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
          <button className="bg-emerald-600 text-white px-3.5 py-2 rounded-full text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center space-x-1.5">
            <Plus className="w-4 h-4" />
            <span>Upload Verified Study Note</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Study Note Title</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Author / Teacher</th>
              <th className="px-4 py-3">Student Reads</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {notes.map((note) => (
              <tr key={note.id} className="hover:bg-emerald-50/30 transition-colors group">
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{note.title}</span>
                </td>
                <td className="px-4 py-3.5 text-slate-600 font-semibold">{note.subject_id}</td>
                <td className="px-4 py-3.5 text-slate-800">{note.teacher_id}</td>
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">{note.reads?.toLocaleString() || 0}</td>
                <td className="px-4 py-3.5">
                  <Badge status={note.is_public ? 'VERIFIED' : 'DRAFT'} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button className="text-blue-600 hover:underline font-semibold">Inspect Handout</button>
                </td>
              </tr>
            ))}
            {notes.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No notes found. Create one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
