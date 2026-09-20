import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';

interface MentorEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  mentor: any;
}

export default function MentorEditModal({ isOpen, onClose, onSaved, mentor }: MentorEditModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    specialization: '',
    cohort_ids: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  // Fetch all cohorts so the admin can pick which ones to assign
  const { data: allCohorts = [] } = useQuery({
    queryKey: ['admin_cohorts_list'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/admin/cohorts');
      return res.data.cohorts || [];
    },
    enabled: isOpen
  });

  useEffect(() => {
    if (mentor && isOpen) {
      setFormData({
        full_name: mentor.full_name || '',
        specialization: mentor.specialization || '',
        cohort_ids: mentor.cohort_ids || []
      });
    }
  }, [mentor, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await coursesApi.put(`/api/admin/mentors/${mentor.user_id}`, formData);
      onSaved();
      onClose();
    } catch (err: any) {
      alert("Failed to update mentor: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const toggleCohort = (id: string) => {
    setFormData(prev => ({
      ...prev,
      cohort_ids: prev.cohort_ids.includes(id) 
        ? prev.cohort_ids.filter(cid => cid !== id)
        : [...prev.cohort_ids, id]
    }));
  };

  if (!isOpen || !mentor) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
            <h3 className="text-xl font-bold text-gray-900">Edit Mentor</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization / Title</label>
                <input type="text" className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} placeholder="e.g. Senior Frontend Engineer" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Cohorts</label>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {allCohorts.length === 0 ? (
                    <p className="text-sm text-gray-500">No cohorts available.</p>
                  ) : (
                    allCohorts.map((cohort: any) => (
                      <label key={cohort.id} className="flex items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={formData.cohort_ids.includes(cohort.id)}
                          onChange={() => toggleCohort(cohort.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{cohort.title}</p>
                          <p className="text-xs text-gray-500">{new Date(cohort.start_date).toLocaleDateString()} - {new Date(cohort.end_date).toLocaleDateString()}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-50 shrink-0">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#146ef5] hover:bg-[#105bd1] rounded-xl shadow-sm shadow-[#146ef5]/20 disabled:opacity-50 transition-colors">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
