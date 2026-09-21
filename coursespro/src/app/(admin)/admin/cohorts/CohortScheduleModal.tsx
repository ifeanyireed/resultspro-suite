import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { coursesApi } from '@/lib/api';

interface CohortScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  cohort: any;
}

export default function CohortScheduleModal({ isOpen, onClose, onSave, cohort }: CohortScheduleModalProps) {
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<Record<string, string>>({}); // module_id -> datetime-local string

  useEffect(() => {
    if (isOpen && cohort && cohort.program_id) {
      // Parse existing schedules
      let existingSchedules = {};
      if (cohort.module_schedules_json) {
        try {
          existingSchedules = JSON.parse(cohort.module_schedules_json);
        } catch (e) {}
      }
      setSchedules(existingSchedules);

      // Fetch modules
      const fetchModules = async () => {
        try {
          const res = await coursesApi.get(`/api/admin/programs/${cohort.program_id}/stages`);
          if (res.data?.stages) {
            setModules(res.data.stages);
          }
        } catch (e) {
          console.error("Failed to fetch stages", e);
        }
      };
      fetchModules();
    }
  }, [isOpen, cohort]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...cohort,
        start_date: cohort.start_date ? new Date(cohort.start_date).toISOString() : null,
        end_date: cohort.end_date ? new Date(cohort.end_date).toISOString() : null,
        module_schedules_json: JSON.stringify(schedules)
      };

      await coursesApi.put(`/api/admin/cohorts/${cohort.id}`, payload);
      onSave();
    } catch (error: any) {
      console.error(`Failed to save schedules: ${error.message}`);
      alert('Failed to save schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (moduleId: string, dateStr: string) => {
    setSchedules(prev => ({
      ...prev,
      [moduleId]: dateStr
    }));
  };

  // Filter modules to only those containing a LIVE_CLASS content item
  const liveClassModules = modules.filter(m => {
    if (!m.contents_json) return false;
    try {
      const parsed = JSON.parse(m.contents_json);
      return parsed.some((item: any) => item.type === 'LIVE_CLASS');
    } catch (e) {
      return false;
    }
  });

  return (
    <AnimatePresence>
      {isOpen && cohort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col my-8 max-h-[90vh]"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold text-slate-900">
                Schedule Live Classes for {cohort.title}
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-500"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
              {modules.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">Loading modules or no modules found...</p>
              ) : liveClassModules.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No live classes found in this program. Add a "Live Class" to a module in the Program Builder first.</p>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">Set the date and time for each live class module in this cohort.</p>
                  {liveClassModules.map(m => (
                    <div key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                      <div>
                        <h4 className="font-medium text-gray-900">{m.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">Stage {m.stage_number || m.order_index + 1}</p>
                      </div>
                      <div className="mt-3 sm:mt-0">
                        <input
                          type="datetime-local"
                          className="border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500"
                          value={schedules[m.id] || ''}
                          onChange={(e) => handleDateChange(m.id, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Schedules'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
