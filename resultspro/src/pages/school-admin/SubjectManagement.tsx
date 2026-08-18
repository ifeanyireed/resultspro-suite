import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Edit02, 
  Trash01, 
  BookOpen, 
  AlertCircle, 
  Filter, 
  LayoutGrid, 
  FileText 
} from '@/lib/hugeicons-compat';
import axiosInstance from '@/lib/axiosConfig';
import SubjectFormModal from './components/SubjectFormModal';

interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  classCount: number;
  classes: { id: string, name: string, level: string }[];
}

interface Class {
  id: string;
  name: string;
  level: string;
}

const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grouped'>('table');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [subjectsRes, classesRes] = await Promise.all([
        axiosInstance.get('/onboarding/subjects'),
        axiosInstance.get('/onboarding/classes')
      ]);

      const subjectsData = subjectsRes.data.data?.subjects || subjectsRes.data.subjects || [];
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);

      const classesData = classesRes.data.data?.classes || classesRes.data.classes || [];
      setClasses(Array.isArray(classesData) ? classesData : []);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch data';
      setError(errorMsg);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    
    try {
      setIsSubmitting(true);
      await axiosInstance.delete(`/onboarding/subjects/${subjectId}`);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete subject');
      console.error('Error deleting subject:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (editingSubject) {
        await axiosInstance.patch(`/onboarding/subjects/${editingSubject.id}`, data);
      } else {
        await axiosInstance.post('/onboarding/subjects', data);
      }
      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save subject');
      console.error('Error saving subject:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSubjects = useMemo(() => {
    if (selectedClassId === 'all') return subjects;
    if (selectedClassId === 'unassigned') return subjects.filter(s => s.classes.length === 0);
    return subjects.filter(s => s.classes.some(c => c.id === selectedClassId));
  }, [subjects, selectedClassId]);

  const groupedData = useMemo(() => {
    const groups: { title: string, subjects: Subject[] }[] = [];
    
    classes.forEach(cls => {
      const classSubjects = subjects.filter(s => s.classes.some(c => c.id === cls.id));
      if (classSubjects.length > 0) {
        groups.push({
          title: cls.name,
          subjects: classSubjects
        });
      }
    });

    const unassigned = subjects.filter(s => s.classes.length === 0);
    if (unassigned.length > 0) {
      groups.push({
        title: 'Unassigned Subjects',
        subjects: unassigned
      });
    }

    return groups;
  }, [subjects, classes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Subject Management</h2>
          <p className="text-gray-400 text-sm mt-1">Create and manage subjects offered in your school</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-400'}`}
              title="Table View"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grouped')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grouped' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-400'}`}
              title="Grouped View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={viewMode === 'grouped'}
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-blue-500/50 appearance-none min-w-[160px] disabled:opacity-50"
            >
              <option value="all">All Classes</option>
              <option value="unassigned">Unassigned</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleCreateSubject}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-400 font-medium transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Subject
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="ml-3 text-gray-400">Loading subjects...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && subjects.length === 0 && (
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-12">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No subjects yet</h3>
            <p className="text-gray-400 mb-4">Complete your school setup or add subjects here</p>
          </div>
        </div>
      )}

      {/* Subjects Table View */}
      {!loading && subjects.length > 0 && viewMode === 'table' && (
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/5 bg-white/2.5">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Subject Name</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Classes</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((row, i) => (
                  <tr key={row.id || i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-6 text-white font-medium">{row.name}</td>
                    <td className="py-4 px-6 text-white">
                      <div className="flex flex-wrap gap-1">
                        {row.classes.map(c => (
                          <span key={c.id} className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-300 rounded border border-blue-500/20">
                            {c.name}
                          </span>
                        ))}
                        {row.classes.length === 0 && <span className="text-gray-500 text-xs">Unassigned</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-400 border border-green-400/20">
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleEditSubject(row)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Edit02 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSubject(row.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash01 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredSubjects.length === 0 && (
            <div className="p-12 text-center text-gray-500">No subjects match this filter</div>
          )}
        </div>
      )}

      {/* Grouped View */}
      {!loading && subjects.length > 0 && viewMode === 'grouped' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedData.map((group, idx) => (
            <div key={idx} className="bg-[rgba(255,255,255,0.02)] rounded-[24px] border border-[rgba(255,255,255,0.07)] p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  {group.title}
                </h3>
                <span className="text-xs text-gray-500 font-medium bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  {group.subjects.length} Subjects
                </span>
              </div>
              <div className="space-y-2 flex-grow">
                {group.subjects.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors group">
                    <div>
                      <div className="text-sm font-medium text-gray-300">{s.name}</div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditSubject(s)}
                        className="text-blue-400 hover:text-blue-300 p-1"
                      >
                        <Edit02 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSubject(s.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash01 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 transition-all hover:bg-white/[0.04]">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">Total Subjects</h3>
            </div>
            <p className="text-3xl font-bold text-white">{subjects.length}</p>
          </div>
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 transition-all hover:bg-white/[0.04]">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-semibold">Assigned Subjects</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {subjects.filter(s => s.classCount > 0).length}
            </p>
          </div>
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 transition-all hover:bg-white/[0.04]">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h3 className="text-white font-semibold">Unassigned</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {subjects.filter(s => s.classCount === 0).length}
            </p>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <SubjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        classes={classes}
        initialData={editingSubject}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default SubjectManagement;
