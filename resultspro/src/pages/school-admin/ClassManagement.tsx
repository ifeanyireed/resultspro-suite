import React, { useState, useEffect } from 'react';
import { Plus, Edit02, Trash01, Users, AlertCircle } from '@/lib/hugeicons-compat';
import axiosInstance from '@/lib/axiosConfig';
import ClassFormModal from './components/ClassFormModal';

interface Class {
  id: string;
  name: string;
  level: string;
  formTutor?: string;
  numberOfStudents: number;
}

const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Fetch classes on mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/onboarding/classes');
      console.log('Classes API Response:', response.data);
      // Backend returns { success: true, data: { classes: [...] } }
      const classesData = response.data.data?.classes || response.data.classes || [];
      setClasses(Array.isArray(classesData) ? classesData : []);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch classes';
      setError(errorMsg);
      console.error('Error fetching classes:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  const handleEditClass = (cls: Class) => {
    // Map numberOfStudents to a display-only field and formTutor for the form
    setEditingClass({
      ...cls,
      // Keep all class data as is, the modal will use formTutor
    });
    setIsModalOpen(true);
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      setIsSubmitting(true);
      await axiosInstance.delete(`/onboarding/classes/${classId}`);
      setClasses(classes.filter(c => c.id !== classId));
      setConfirmDelete(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete class');
      console.error('Error deleting class:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForm = async (data: any) => {
    try {
      setIsSubmitting(true);

      if (editingClass) {
        // Update existing class - map formTutor to classTeacher for backend
        const response = await axiosInstance.patch(`/onboarding/classes/${editingClass.id}`, {
          name: data.name,
          level: data.level,
          classTeacher: data.formTutor,
        });
        // Fetch fresh data to get updated student count
        await fetchClasses();
      } else {
        // Create new class - map formTutor to classTeacher for backend
        const response = await axiosInstance.patch('/onboarding/classes', {
          classes: [{
            name: data.name,
            level: data.level,
            classTeacher: data.formTutor,
          }],
        });
        // Refresh the list to get the new class with proper ID
        await fetchClasses();
      }

      setIsModalOpen(false);
      setEditingClass(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save class');
      console.error('Error saving class:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalStudents = classes.reduce((sum, c) => sum + (c.numberOfStudents || 0), 0);
  const avgClassSize = classes.length > 0 ? (totalStudents / classes.length).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Class Management</h2>
          <p className="text-gray-400 text-sm mt-1">Create and manage classes</p>
        </div>
        <button
          onClick={handleAddClass}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-400 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Class
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="ml-3 text-gray-400">Loading classes...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && classes.length === 0 && (
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-12">
          <div className="text-center">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No classes yet</h3>
            <p className="text-gray-400 mb-4">Create your first class to get started</p>
            <button
              onClick={handleAddClass}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-400 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Class
            </button>
          </div>
        </div>
      )}

      {/* Classes Table */}
      {!loading && classes.length > 0 && (
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/5 bg-white/2.5">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Class Name</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Level</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Form Tutor</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">No of Students</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-6 text-white font-medium">{row.name}</td>
                    <td className="py-4 px-6 text-gray-400">{row.level}</td>
                    <td className="py-4 px-6 text-white">{row.formTutor || '-'}</td>
                    <td className="py-4 px-6 text-white">{row.numberOfStudents}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEditClass(row)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Edit02 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(row.id)}
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
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">Total Classes</h3>
            </div>
            <p className="text-3xl font-bold text-white">{classes.length}</p>
          </div>
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-semibold">Total Students</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {totalStudents}
            </p>
          </div>
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-amber-400" />
              <h3 className="text-white font-semibold">Avg. Class Size</h3>
            </div>
            <p className="text-3xl font-bold text-white">{avgClassSize}</p>
          </div>
        </div>
      )}

      {/* Class Form Modal */}
      <ClassFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClass(null);
        }}
        onSubmit={handleSubmitForm}
        initialData={editingClass || undefined}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-8 w-full max-w-sm">
            <h3 className="text-xl font-bold text-white mb-4">Delete Class?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this class? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/40 rounded-lg text-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteClass(confirmDelete)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg text-red-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
