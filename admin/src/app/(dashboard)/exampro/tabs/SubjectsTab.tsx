import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Plus, Edit2, Trash2, RefreshCw, X, Layers, Trophy } from 'lucide-react';
import { WidgetCard } from '@/components/ui/Cards';
import { fetchExamproExams, fetchExamproSubjects, createExamproSubject, updateExamproSubject, deleteExamproSubject } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SubjectsTab() {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | string>('');
  
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    coinUnlockCost: 0,
    color: 'blue'
  });
  const [saving, setSaving] = useState(false);

  // Load Exams on mount
  useEffect(() => {
    const loadExams = async () => {
      try {
        const examsData = await fetchExamproExams();
        const validExams = Array.isArray(examsData) ? examsData : [];
        setExams(validExams);
        if (validExams.length > 0) {
          setSelectedExamId(validExams[0].id);
        }
      } finally {
        setInitialLoading(false);
      }
    };
    loadExams();
  }, []);

  // Load Subjects when Exam changes
  const loadSubjects = async () => {
    if (!selectedExamId) return;
    setLoading(true);
    try {
      const data = await fetchExamproSubjects(selectedExamId);
      setSubjects(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      toast.error('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [selectedExamId]);

  // Filter & Pagination Logic
  const filteredSubjects = subjects.filter(sub => 
    sub.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sub.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const paginatedSubjects = filteredSubjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openCreateModal = () => {
    if (!selectedExamId) {
      toast.error('Please select an exam first');
      return;
    }
    setModalMode('create');
    setSelectedSubjectId(null);
    setFormData({ name: '', slug: '', coinUnlockCost: 0, color: 'blue' });
    setIsModalOpen(true);
  };

  const openEditModal = (subject: any) => {
    setModalMode('edit');
    setSelectedSubjectId(subject.id);
    setFormData({
      name: subject.name || '',
      slug: subject.slug || '',
      coinUnlockCost: subject.coinUnlockCost || 0,
      color: subject.color || 'blue'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modalMode === 'create') {
        await createExamproSubject({ ...formData, examId: Number(selectedExamId) });
        toast.success('Subject created successfully');
      } else {
        await updateExamproSubject(selectedSubjectId as number, formData);
        toast.success('Subject updated successfully');
      }
      setIsModalOpen(false);
      loadSubjects();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save subject');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this subject? All topics and questions under it will be affected.')) return;
    try {
      await deleteExamproSubject(id);
      toast.success('Subject deleted successfully');
      loadSubjects();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete subject');
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center p-12"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full relative">
      <WidgetCard title="Syllabus Management" action={
        <div className="flex items-center gap-3">
          <button onClick={loadSubjects} disabled={!selectedExamId} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-600' : ''}`} />
          </button>
          <button onClick={openCreateModal} disabled={!selectedExamId} className="bg-[#146ef5] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#105bd1] transition-colors flex items-center space-x-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>
      }>
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4 px-2">
          {/* Exam Selector */}
          <div className="flex items-center gap-2 w-full md:w-1/3">
            <Layers className="w-4 h-4 text-slate-400 shrink-0" />
            <select 
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select an Exam Catalog...</option>
              {exams.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.name} ({ex.category})</option>
              ))}
            </select>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden md:block mx-2"></div>

          {/* Search Filter */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search subjects by name..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              disabled={!selectedExamId}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
            />
          </div>
        </div>

        {!selectedExamId ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 border-t border-slate-100">
            <BookOpen className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-medium text-sm">Please select an Exam Catalog above to view its subjects.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2 bg-slate-50/50 rounded-xl border border-slate-100 min-h-[300px] content-start">
              {loading && paginatedSubjects.length === 0 ? (
                <div className="col-span-full py-12 flex justify-center"><RefreshCw className="w-6 h-6 text-blue-500 animate-spin" /></div>
              ) : paginatedSubjects.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 font-medium text-sm">No subjects found in this catalog.</div>
              ) : (
                paginatedSubjects.map((sub) => (
                  <div key={sub.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sub.color ? `bg-${sub.color}-100 text-${sub.color}-600` : 'bg-blue-100 text-blue-600'}`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(sub)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800 line-clamp-1" title={sub.name}>{sub.name}</h4>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 mt-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pool</span>
                        <span className="text-sm font-black text-slate-700">{sub.questions?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                          {sub.mcqCount?.toLocaleString() || 0} MCQ
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded">
                          {sub.theoryCount?.toLocaleString() || 0} Theory
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 py-4 mt-2">
                <span className="text-xs text-slate-500 font-medium">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSubjects.length)} of {filteredSubjects.length}
                </span>
                <div className="flex items-center gap-1">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-50 transition-colors">Prev</button>
                  <div className="flex items-center gap-1 px-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold transition-colors ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-50 transition-colors">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </WidgetCard>

      {/* Create / Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                {modalMode === 'create' ? 'Add Subject' : 'Edit Subject'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col p-6 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Subject Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Mathematics" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex justify-between">
                  <span>URL Slug</span>
                  <span className="text-slate-400 font-normal">Optional</span>
                </label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="mathematics" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                <p className="text-[10px] text-slate-500">Leave blank to auto-generate from name.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Unlock Cost (Coins)</label>
                  <input type="number" min="0" value={formData.coinUnlockCost} onChange={e => setFormData({...formData, coinUnlockCost: parseInt(e.target.value) || 0})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Theme Color</label>
                  <select value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="red">Red</option>
                    <option value="orange">Orange</option>
                    <option value="indigo">Indigo</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-5 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow rounded-lg transition-all disabled:opacity-50 flex items-center gap-2">
                  {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {modalMode === 'create' ? 'Create Subject' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
