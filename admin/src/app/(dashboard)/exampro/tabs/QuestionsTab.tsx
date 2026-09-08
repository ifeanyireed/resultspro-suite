import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Plus, MoreVertical, RefreshCw, Layers } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { fetchExamproQuestions, fetchExamproExams, fetchExamproSubjects } from '@/lib/api';

export default function QuestionsTab() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [examId, setExamId] = useState<string>('');
  const [subjectId, setSubjectId] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Metadata for dropdowns
  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  // Initial metadata load
  useEffect(() => {
    fetchExamproExams().then(data => setExams(Array.isArray(data) ? data : []));
  }, []);

  // Subject cascade
  useEffect(() => {
    setSubjectId('');
    if (examId) {
      fetchExamproSubjects(examId).then(data => setSubjects(Array.isArray(data) ? data : []));
    } else {
      setSubjects([]);
    }
  }, [examId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchExamproQuestions({ page, limit, search, examId, subjectId });
      setQuestions(data.questions || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [page, search, examId, subjectId]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" /> Question Bank
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage and curate examination questions</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-600' : ''}`} /> Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full text-xs font-bold hover:bg-purple-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Create Question
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-xl sm:rounded-full border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search questions by body text..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-purple-500 transition-all" 
          />
        </div>
        <div className="flex-1 relative">
          <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            value={examId}
            onChange={(e) => { setExamId(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-purple-500 transition-all appearance-none cursor-pointer text-slate-600 font-medium"
          >
            <option value="">All Exam Catalogs</option>
            {exams.map(e => (
              <option key={e.id} value={e.id}>{e.name} ({e.category})</option>
            ))}
          </select>
        </div>
        <div className="flex-1 relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            value={subjectId}
            onChange={(e) => { setSubjectId(e.target.value); setPage(1); }}
            disabled={!examId}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-purple-500 transition-all appearance-none cursor-pointer text-slate-600 font-medium disabled:opacity-50"
          >
            <option value="">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden relative min-h-[400px]">
        {loading && questions.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 backdrop-blur-sm">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Question Details</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Path</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Metadata</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Type</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {questions.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">No questions found matching your criteria.</td>
                </tr>
              ) : questions.map((q) => (
                <tr key={q.id} className="hover:bg-purple-50/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="font-mono text-purple-600 text-[10px] font-bold mb-1 line-clamp-1" title={q.id}>{q.id}</p>
                    <p className="font-bold text-slate-800 text-xs line-clamp-2 max-w-sm" dangerouslySetInnerHTML={{ __html: q.bodyText || 'No text' }} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-slate-600">{q.topic?.subject?.exam?.name || 'N/A'}</span>
                      <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[150px]">{q.topic?.subject?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {q.year && <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{q.year}</span>}
                      {q.difficulty && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">{q.difficulty}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{q.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={q.status || 'ACTIVE'} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-purple-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Controls */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-3">
              <span>Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total.toLocaleString()}</span>
              {loading && <RefreshCw className="w-3.5 h-3.5 text-purple-500 animate-spin" />}
            </span>
            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-50 transition-colors">Prev</button>
              <span className="text-xs font-bold text-slate-600 px-2">Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-50 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
