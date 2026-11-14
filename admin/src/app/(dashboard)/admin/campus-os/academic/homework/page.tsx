'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';
import { fetchHomeworkAssignments, createHomeworkAssignment, HomeworkAssignment } from '@/lib/campus-api';

export default function AcademicHomeworkPage() {
  const [homeworkList, setHomeworkList] = useState<HomeworkAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newHw, setNewHw] = useState({
    title: '',
    class_name: 'SS3 Science',
    subject: 'Mathematics',
    due_date: '2026-11-25',
    instructions: '',
    max_score: 20,
  });

  useEffect(() => {
    loadHomework();
  }, []);

  async function loadHomework() {
    setLoading(true);
    const data = await fetchHomeworkAssignments();
    setHomeworkList(data);
    setLoading(false);
  }

  async function handleCreateHomework(e: React.FormEvent) {
    e.preventDefault();
    if (!newHw.title || !newHw.instructions) return;

    const created: HomeworkAssignment = {
      id: `hw-${Date.now()}`,
      tenant_id: 'tenant_default',
      ...newHw,
      submissions_count: 0,
      created_at: new Date().toISOString().split('T')[0],
    };

    await createHomeworkAssignment(created);
    setHomeworkList((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewHw({
      title: '',
      class_name: 'SS3 Science',
      subject: 'Mathematics',
      due_date: '2026-11-25',
      instructions: '',
      max_score: 20,
    });
  }

  const filteredList = homeworkList.filter((hw) =>
    hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hw.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hw.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assignments by topic or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#146ef5] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Assignment</span>
        </button>
      </div>

      {/* Homework Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((hw) => (
          <div
            key={hw.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                  {hw.class_name} • {hw.subject}
                </span>
                <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                  <Clock className="w-3.5 h-3.5" />
                  Due {hw.due_date}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1.5">
                {hw.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                {hw.instructions}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[11px]">Weight:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {hw.max_score} Marks
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{hw.submissions_count || 0} Submissions</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Publish Class Assignment</h3>
            <p className="text-xs text-slate-500 mb-4">Post homework questions to the student and parent mobile portals</p>

            <form onSubmit={handleCreateHomework} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calculus: Integration by Parts"
                  value={newHw.title}
                  onChange={(e) => setNewHw({ ...newHw, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Class</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SS3 Science"
                    value={newHw.class_name}
                    onChange={(e) => setNewHw({ ...newHw, class_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics"
                    value={newHw.subject}
                    onChange={(e) => setNewHw({ ...newHw, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newHw.due_date}
                    onChange={(e) => setNewHw({ ...newHw, due_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Max Score</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newHw.max_score}
                    onChange={(e) => setNewHw({ ...newHw, max_score: parseInt(e.target.value) || 20 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Instructions / Questions</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the exercises, page numbers, or submission format instructions..."
                  value={newHw.instructions}
                  onChange={(e) => setNewHw({ ...newHw, instructions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#146ef5] hover:bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Publish to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
