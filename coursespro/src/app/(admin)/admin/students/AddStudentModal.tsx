'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { coursesApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  cohorts: any[];
}

export default function AddStudentModal({ isOpen, onClose, onSaved, cohorts }: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    cohort_id: '',
    payment_status: 'PAID'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.email.trim()) {
      toast.error('Please provide full name and email address');
      return;
    }

    setLoading(true);
    try {
      await coursesApi.post('/api/admin/students', {
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        cohort_id: formData.cohort_id || '',
        payment_status: formData.payment_status
      });

      toast.success('Student added successfully!');
      onSaved();
      onClose();
      setFormData({
        full_name: '',
        email: '',
        cohort_id: '',
        payment_status: 'PAID'
      });
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
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
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#146ef5] flex items-center justify-center">
                <UserPlusIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add New Student</h3>
                <p className="text-xs text-gray-500">Register and enroll a student into this tenant.</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input 
                required 
                type="text" 
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] outline-none" 
                value={formData.full_name} 
                onChange={e => setFormData({ ...formData, full_name: e.target.value })} 
                placeholder="e.g. Chukwuma Obi" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input 
                required 
                type="email" 
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] outline-none" 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                placeholder="e.g. chukwuma@example.com" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Cohort Assignment
              </label>
              <select
                value={formData.cohort_id}
                onChange={e => setFormData({ ...formData, cohort_id: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] outline-none bg-white text-gray-900"
              >
                <option value="">Unassigned (Assign Later)</option>
                {cohorts.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.program?.title ? `${c.program.title} - ${c.title}` : c.title} {Number(c.price) > 0 ? `(₦${Number(c.price).toLocaleString()})` : '(Free)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Payment Status
              </label>
              <select
                value={formData.payment_status}
                onChange={e => setFormData({ ...formData, payment_status: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] outline-none bg-white text-gray-900"
              >
                <option value="PAID">Paid / Full Access (Complimentary or Settled)</option>
                <option value="PENDING">Pending Payment (Awaiting Student Payment)</option>
                <option value="UNENROLLED">Registered User Only (Not Enrolled)</option>
              </select>
              <p className="text-[11px] text-gray-400 mt-1">
                Admin-added students are granted active cohort access when marked Paid.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 mt-6">
              <button 
                type="button" 
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#146ef5] text-white font-semibold text-xs hover:bg-[#105bd1] transition-colors shadow-sm shadow-[#146ef5]/20 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
