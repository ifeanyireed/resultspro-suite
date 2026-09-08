import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { Sparkles, Swords, BookOpen, Trophy, Plus, RefreshCw, Edit2, Trash2, Search, Filter, X } from 'lucide-react';
import { GradientMetricCard, WhiteMetricCard, WidgetCard } from '@/components/ui/Cards';
import { fetchExamproExams, fetchExamproOverview, createExamproExam, updateExamproExam, deleteExamproExam } from '@/lib/api';
import toast from 'react-hot-toast';

export default function OverviewTab() {
  const [exams, setExams] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    slug: '',
    yearRange: '',
    isActive: true,
    isPopular: false,
    isCurated: false,
    isBattleReady: false
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [examsData, overviewData] = await Promise.all([
        fetchExamproExams(),
        fetchExamproOverview()
      ]);
      setExams(Array.isArray(examsData) ? examsData : []);
      setOverview(overviewData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter & Pagination Logic
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exam.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || 
                          (statusFilter === 'ACTIVE' && exam.isActive !== false) ||
                          (statusFilter === 'INACTIVE' && exam.isActive === false);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const paginatedExams = filteredExams.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedExamId(null);
    setFormData({
      name: '', category: '', slug: '', yearRange: '',
      isActive: true, isPopular: false, isCurated: false, isBattleReady: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exam: any) => {
    setModalMode('edit');
    setSelectedExamId(exam.id);
    setFormData({
      name: exam.name || '',
      category: exam.category || '',
      slug: exam.slug || '',
      yearRange: exam.yearRange || '',
      isActive: exam.isActive !== false,
      isPopular: exam.isPopular || false,
      isCurated: exam.isCurated || false,
      isBattleReady: exam.isBattleReady || false
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modalMode === 'create') {
        await createExamproExam(formData);
        toast.success('Exam created successfully');
      } else {
        await updateExamproExam(selectedExamId as number, formData);
        toast.success('Exam updated successfully');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save exam');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this exam catalog? This action cannot be undone.')) return;
    try {
      await deleteExamproExam(id);
      toast.success('Exam deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete exam');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full relative">
      {/* Metric Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <GradientMetricCard
          title="Total Candidates"
          value={overview?.totalUsers?.toLocaleString() || 0}
          subtitle="Registered test-takers"
          trend="+15%"
          icon={BookOpen}
        />
        <WhiteMetricCard
          title="Live Arena"
          value={overview?.activeBattles || 0}
          subtitle="Multiplayer matches"
          trend="+5%"
          trendColor="green"
          icon={Swords}
        />
        <WhiteMetricCard
          title="New Registrations"
          value={`+${overview?.newUsers24h || 0}`}
          subtitle="Joined in last 24h"
          trend="+2%"
          trendColor="green"
          icon={Trophy}
        />
        <WhiteMetricCard
          title="Active Exams"
          value={exams?.length || 0}
          subtitle="Catalogs available"
          trend="+0%"
          trendColor="gray"
          icon={Sparkles}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-12 flex flex-col gap-3">
          <WidgetCard title="Standardized National Exam Catalogs" action={
            <div className="flex items-center gap-3">
              <button onClick={loadData} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-600' : ''}`} />
              </button>
              <button onClick={openCreateModal} className="bg-[#146ef5] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#105bd1] transition-colors flex items-center space-x-1.5 shadow-sm">
                <Plus className="w-4 h-4" />
                <span>Add Exam Standard</span>
              </button>
            </div>
          }>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 px-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search exams..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <select 
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="INACTIVE">Inactive Only</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Examination Name</th>
                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Exam Body</th>
                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Question Pool</th>
                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Candidates</th>
                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedExams.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">No exams found matching your criteria.</td>
                    </tr>
                  ) : paginatedExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-800">{exam.name}</td>
                      <td className="px-6 py-4 text-slate-600 font-semibold">{exam.category}</td>
                      <td className="px-6 py-4 text-slate-900 font-bold">{exam.subjects?.length || 0} subjects</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{exam.yearRange || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <Badge status={exam.isActive === false ? 'INACTIVE' : 'ACTIVE'} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(exam)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(exam.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredExams.length)} of {filteredExams.length}
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-100 transition-colors"
                  >
                    Prev
                  </button>
                  <div className="flex items-center gap-1 px-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold transition-colors ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-100 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </WidgetCard>
        </div>
      </div>

      {/* Create / Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">{modalMode === 'create' ? 'Add Exam Standard' : 'Edit Exam Catalog'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col p-6 gap-4 overflow-y-auto max-h-[70vh]">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Examination Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. JAMB UTME" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Exam Body (Category) *</label>
                <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. JAMB, WAEC, NECO" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">URL Slug</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="jamb-utme" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Year Range</label>
                  <input type="text" value={formData.yearRange} onChange={e => setFormData({...formData, yearRange: e.target.value})} placeholder="2010 - 2024" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                  <span className="text-sm font-semibold text-slate-700">Active (Visible to users)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isPopular} onChange={e => setFormData({...formData, isPopular: e.target.checked})} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                  <span className="text-sm font-semibold text-slate-700">Mark as Popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isBattleReady} onChange={e => setFormData({...formData, isBattleReady: e.target.checked})} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                  <span className="text-sm font-semibold text-slate-700">Battle Ready (Available in Live Arena)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
                  {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {modalMode === 'create' ? 'Create Exam' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
