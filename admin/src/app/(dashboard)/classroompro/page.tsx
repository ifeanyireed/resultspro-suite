'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { BookOpen, FileText, CheckCircle2, Award, Search, Plus } from 'lucide-react';

export default function ClassroomProAdminPage() {
  const notes = [
    { id: '1', title: 'Quadratic Equations & Polynomials', subject: 'Mathematics', teacher: 'Mr. Adeniyi', reads: 1420, verified: true },
    { id: '2', title: 'Newtonian Mechanics & Thermodynamics', subject: 'Physics', teacher: 'Dr. Okoro', reads: 890, verified: true },
    { id: '3', title: 'Organic Chemistry & Hydrocarbons', subject: 'Chemistry', teacher: 'Mrs. Bello', reads: 1100, verified: true },
    { id: '4', title: 'Ecology & Population Genetics', subject: 'Biology', teacher: 'Mr. Eze', reads: 750, verified: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-full">
      <Header
        title="ClassroomPRO Content & Curriculum Hub"
        subtitle="Oversight of digital lesson handouts, interactive quizzes, and flashcards SRS"
      />

      <div className="p-8 space-y-8 max-w-[1400px] mx-auto w-full">
        <div className="flex justify-between items-center">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" /></div>
            <input
              type="text"
              placeholder="Search study handouts..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
            />
          </div>
          <button className="bg-emerald-600 text-white px-3.5 py-2 rounded-full text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center space-x-1.5">
            <Plus className="w-4 h-4" />
            <span>Upload Verified Study Note</span>
          </button>
        </div>

        {/* Study Notes Table */}
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
                <tr key={note.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-4 py-3.5 font-medium text-slate-800 text-xs flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{note.title}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 font-semibold">{note.subject}</td>
                  <td className="px-4 py-3.5 text-slate-800">{note.teacher}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">{note.reads.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <Badge status="VERIFIED" />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button className="text-blue-600 hover:underline font-semibold">Inspect Handout</button>
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
