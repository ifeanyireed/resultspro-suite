import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { coursesApi } from '@/lib/api';

interface CohortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  cohort?: any;
  programs: any[];
}

export default function CohortModal({ isOpen, onClose, onSave, cohort, programs }: CohortModalProps) {
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });
      const data = await res.json();
      
      if (res.ok && data.url) {
        setFormData({ ...formData, image_url: data.url });
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Something went wrong during upload');
    } finally {
      setIsUploading(false);
    }
  };
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    duration_weeks: 12,
    start_date: '',
    end_date: '',
    capacity: 50,
    price: 0,
    image_url: '',
    currency: 'NGN',
    program_id: '',
    status: 'DRAFT',
    meeting_days: '',
    meeting_time: '',
    location_type: 'Virtual',
    difficulty_level: 'All Levels',
  });

  useEffect(() => {
    if (cohort) {
      setFormData({
        title: cohort.title || '',
        slug: cohort.slug || '',
        subtitle: cohort.subtitle || '',
        description: cohort.description || '',
        duration_weeks: cohort.duration_weeks || 12,
        start_date: cohort.start_date ? new Date(cohort.start_date).toISOString().split('T')[0] : '',
        end_date: cohort.end_date ? new Date(cohort.end_date).toISOString().split('T')[0] : '',
        capacity: cohort.capacity || 50,
        price: cohort.price || 0,
        image_url: cohort.image_url || '',
        currency: cohort.currency || 'NGN',
        program_id: cohort.program_id || '',
        status: cohort.status || 'DRAFT',
        meeting_days: cohort.meeting_days || '',
        meeting_time: cohort.meeting_time || '',
        location_type: cohort.location_type || 'Virtual',
        difficulty_level: cohort.difficulty_level || 'All Levels',
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        subtitle: '',
        description: '',
        duration_weeks: 12,
        start_date: '',
        end_date: '',
        capacity: 50,
        price: 0,
    image_url: '',
        currency: 'NGN',
        program_id: '',
        status: 'DRAFT',
    meeting_days: '',
    meeting_time: '',
    location_type: 'Virtual',
    difficulty_level: 'All Levels',
      });
    }
  }, [cohort, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        duration_weeks: Number(formData.duration_weeks),
        capacity: Number(formData.capacity),
        price: Number(formData.price),
        image_url: formData.image_url,
        module_schedules_json: cohort?.module_schedules_json || "",
      };

      if (cohort?.id) {
        await coursesApi.put(`/api/admin/cohorts/${cohort.id}`, payload);
      } else {
        await coursesApi.post('/api/admin/cohorts', payload);
      }
      onSave();
    } catch (error: any) {
      console.error(`Failed to save cohort: ${error.message}`);
      alert('Failed to save cohort');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col my-8"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {cohort ? 'Edit Cohort' : 'New Cohort'}
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-500"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Program</label>
                <select
                  value={formData.program_id}
                  onChange={e => setFormData({ ...formData, program_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select a Program</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

                            <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Days</label>
                  <input
                    type="text"
                    placeholder="e.g. Mon, Thu"
                    value={formData.meeting_days}
                    onChange={e => setFormData({ ...formData, meeting_days: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Time</label>
                  <input
                    type="time"
                    value={formData.meeting_time}
                    onChange={e => setFormData({ ...formData, meeting_time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <select
                    value={formData.location_type}
                    onChange={e => setFormData({ ...formData, location_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Virtual">Virtual</option>
                    <option value="On-Site">On-Site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty Level</label>
                  <select
                    value={formData.difficulty_level}
                    onChange={e => setFormData({ ...formData, difficulty_level: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    value={formData.duration_weeks}
                    onChange={e => setFormData({ ...formData, duration_weeks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="Cover Preview" className="w-full h-full object-cover" />
                    ) : (
                      <PhotoIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                  <div className="flex flex-col items-start gap-1">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploading}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isUploading ? 'Uploading...' : (formData.image_url ? 'Change image' : 'Upload image')}
                    </button>
                    {formData.image_url && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
                {cohort && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="ENROLLING">ENROLLING</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Cohort'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
