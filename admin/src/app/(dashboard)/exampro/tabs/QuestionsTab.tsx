import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Plus, MoreVertical, RefreshCw, Layers, X, Trash2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { fetchExamproQuestions, fetchExamproExams, fetchExamproSubjects, fetchExamproTopics, createExamproQuestion, updateExamproQuestion, deleteExamproQuestion } from '@/lib/api';
import toast from 'react-hot-toast';

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
  const [topics, setTopics] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Modal Form State
  const [formExamId, setFormExamId] = useState<string>('');
  const [formSubjectId, setFormSubjectId] = useState<string>('');
  const [formTopicId, setFormTopicId] = useState<string>('');
  const [formTopicsList, setFormTopicsList] = useState<any[]>([]);
  const [formSubjectsList, setFormSubjectsList] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    type: 'mcq',
    difficulty: 'medium',
    year: new Date().getFullYear(),
    coinReward: 5,
    bodyText: '',
    explanationStandard: '',
    status: 'published'
  });
  
  const [formOptions, setFormOptions] = useState<any[]>([
    { optionText: '', isCorrect: true, orderIndex: 1 },
    { optionText: '', isCorrect: false, orderIndex: 2 },
    { optionText: '', isCorrect: false, orderIndex: 3 },
    { optionText: '', isCorrect: false, orderIndex: 4 }
  ]);

  // Initial metadata load
  useEffect(() => {
    fetchExamproExams().then(data => setExams(Array.isArray(data) ? data : []));
  }, []);

  // Filter cascades
  useEffect(() => {
    setSubjectId('');
    if (examId) {
      fetchExamproSubjects(examId).then(data => setSubjects(Array.isArray(data) ? data : []));
    } else {
      setSubjects([]);
    }
  }, [examId]);

  // Modal Form cascades
  useEffect(() => {
    if (formExamId) {
      fetchExamproSubjects(formExamId).then(data => setFormSubjectsList(Array.isArray(data) ? data : []));
    } else {
      setFormSubjectsList([]);
    }
  }, [formExamId]);

  useEffect(() => {
    if (formSubjectId) {
      fetchExamproTopics(formSubjectId).then(data => setFormTopicsList(Array.isArray(data) ? data : []));
    } else {
      setFormTopicsList([]);
    }
  }, [formSubjectId]);

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

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedQuestionId(null);
    setFormExamId('');
    setFormSubjectId('');
    setFormTopicId('');
    setFormData({
      type: 'mcq', difficulty: 'medium', year: new Date().getFullYear(),
      coinReward: 5, bodyText: '', explanationStandard: '', status: 'published'
    });
    setFormOptions([
      { optionText: '', isCorrect: true, orderIndex: 1 },
      { optionText: '', isCorrect: false, orderIndex: 2 },
      { optionText: '', isCorrect: false, orderIndex: 3 },
      { optionText: '', isCorrect: false, orderIndex: 4 }
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (q: any) => {
    setModalMode('edit');
    setSelectedQuestionId(q.id);
    setFormExamId(q.topic?.subject?.exam?.id?.toString() || '');
    // Need to timeout setting these to allow cascade to fetch
    setTimeout(() => setFormSubjectId(q.topic?.subject?.id?.toString() || ''), 300);
    setTimeout(() => setFormTopicId(q.topic?.id?.toString() || ''), 600);
    
    setFormData({
      type: q.type || 'mcq',
      difficulty: q.difficulty || 'medium',
      year: q.year || new Date().getFullYear(),
      coinReward: q.coinReward || 5,
      bodyText: q.bodyText || '',
      explanationStandard: q.explanationStandard || '',
      status: q.status || 'published'
    });
    
    if (q.options && q.options.length > 0) {
      setFormOptions(q.options.map((opt: any) => ({
        id: opt.id,
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
        orderIndex: opt.orderIndex
      })));
    } else {
      setFormOptions([{ optionText: '', isCorrect: true, orderIndex: 1 }]);
    }
    setIsModalOpen(true);
  };

  const addOption = () => {
    setFormOptions([...formOptions, { optionText: '', isCorrect: false, orderIndex: formOptions.length + 1 }]);
  };

  const removeOption = (index: number) => {
    const newOptions = [...formOptions];
    newOptions.splice(index, 1);
    setFormOptions(newOptions);
  };

  const setOptionCorrect = (index: number) => {
    const newOptions = [...formOptions];
    if (formData.type === 'mcq') {
      newOptions.forEach(opt => opt.isCorrect = false);
    }
    newOptions[index].isCorrect = !newOptions[index].isCorrect;
    setFormOptions(newOptions);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopicId) {
      toast.error('Please select a topic for this question');
      return;
    }
    
    setSaving(true);
    const payload = {
      ...formData,
      topicId: parseInt(formTopicId),
      options: formOptions.map((opt, i) => ({ ...opt, orderIndex: i + 1 }))
    };

    try {
      if (modalMode === 'create') {
        await createExamproQuestion(payload);
        toast.success('Question created successfully');
      } else {
        await updateExamproQuestion(selectedQuestionId!, payload);
        toast.success('Question updated successfully');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await deleteExamproQuestion(id);
      toast.success('Question deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete question');
    }
  };

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
          <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full text-xs font-bold hover:bg-purple-700 transition-colors shadow-sm">
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
                <tr key={q.id} onClick={() => openEditModal(q)} className="hover:bg-purple-50/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 text-xs line-clamp-3 max-w-sm" dangerouslySetInnerHTML={{ __html: q.bodyText || 'No text' }} />
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
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }} className="p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
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

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                {modalMode === 'create' ? 'Create New Question' : 'Edit Question'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col md:flex-row p-6 gap-8 overflow-y-auto max-h-[80vh]">
              
              {/* Left Column: Metadata & Path */}
              <div className="flex-1 space-y-4">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Question Path</h4>
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">Exam Catalog</label>
                    <select required value={formExamId} onChange={e => setFormExamId(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="" disabled>Select Exam...</option>
                      {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">Subject</label>
                    <select required value={formSubjectId} onChange={e => setFormSubjectId(e.target.value)} disabled={!formExamId} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50">
                      <option value="" disabled>Select Subject...</option>
                      {formSubjectsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">Topic</label>
                    <select required value={formTopicId} onChange={e => setFormTopicId(e.target.value)} disabled={!formSubjectId} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50">
                      <option value="" disabled>Select Topic...</option>
                      {formTopicsList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>

                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mt-6 mb-2">Metadata</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="mcq">MCQ</option>
                      <option value="theory">Theory</option>
                      <option value="truefalse">True / False</option>
                      <option value="fill">Fill in Blank</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">Difficulty</label>
                    <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">Year</label>
                    <input type="number" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">Reward (Coins)</label>
                    <input type="number" value={formData.coinReward} onChange={e => setFormData({...formData, coinReward: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
              </div>

              {/* Right Column: Content & Options */}
              <div className="flex-[2] space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-slate-800 uppercase tracking-wider">Question Body *</label>
                  <textarea required rows={4} value={formData.bodyText} onChange={e => setFormData({...formData, bodyText: e.target.value})} placeholder="Enter the question text here..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-slate-700"></textarea>
                </div>
                
                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-black text-slate-800 uppercase tracking-wider">Options</label>
                    {formData.type === 'mcq' && (
                      <button type="button" onClick={addOption} className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Add Option
                      </button>
                    )}
                  </div>
                  
                  {formData.type === 'theory' ? (
                    <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center">
                      <p className="text-sm text-slate-500 font-medium">Theory questions do not use predefined options. Students will write their own answers to be reviewed manually or by AI.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {formOptions.map((opt, index) => (
                        <div key={index} className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-colors ${opt.isCorrect ? 'border-green-500 bg-green-50/30' : 'border-slate-100 bg-white'}`}>
                          <button type="button" onClick={() => setOptionCorrect(index)} className={`mt-1.5 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${opt.isCorrect ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>
                            {opt.isCorrect && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                          <div className="flex-1">
                            <input type="text" required value={opt.optionText} onChange={(e) => {
                              const newOpts = [...formOptions];
                              newOpts[index].optionText = e.target.value;
                              setFormOptions(newOpts);
                            }} placeholder={`Option ${index + 1}`} className="w-full bg-transparent text-sm font-medium focus:outline-none text-slate-700" />
                          </div>
                          {formOptions.length > 2 && (
                            <button type="button" onClick={() => removeOption(index)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 mt-4">
                  <label className="text-sm font-black text-slate-800 uppercase tracking-wider">Explanation / Standard Answer</label>
                  <textarea rows={3} value={formData.explanationStandard} onChange={e => setFormData({...formData, explanationStandard: e.target.value})} placeholder="Explain why the correct answer is right..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-slate-700"></textarea>
                </div>
              </div>

            </form>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl mt-auto">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm rounded-lg transition-all disabled:opacity-50 flex items-center gap-2">
                {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                {modalMode === 'create' ? 'Create Question' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
