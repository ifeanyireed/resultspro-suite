import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';

interface InviteMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function InviteMentorModal({ isOpen, onClose, onSaved }: InviteMentorModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    specialization: '',
    cohort_ids: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  // Fetch all cohorts
  const { data: allCohorts = [] } = useQuery({
    queryKey: ['admin_cohorts_list'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/admin/cohorts');
      return res.data.cohorts || [];
    },
    enabled: isOpen
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await coursesApi.post('/api/admin/mentors/invite', formData);
      onSaved();
      onClose();
      setFormData({ email: '', full_name: '', specialization: '', cohort_ids: [] });
    } catch (err: any) {
      alert("Failed to invite mentor: " + (err.response?.data?.error || err.message));
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

  if (!isOpen) return null;

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
            <h3 className="text-xl font-bold text-gray-900">Add Mentor</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
            <p className="text-sm text-gray-500 mb-6">
              The user must already have a registered account. Enter their email address below to assign them as a mentor.
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
                <input required type="email" className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="e.g. user@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="e.g. Jane Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization / Title</label>
                <input type="text" className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} placeholder="e.g. Senior Frontend Engineer" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Cohorts (Optional)</label>
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
                {loading ? 'Adding...' : 'Add Mentor'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
