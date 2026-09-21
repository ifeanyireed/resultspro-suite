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
  const [schedules, setSchedules] = useState<Record<string, { start?: string, end?: string, live?: string }>>({});

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

  const handleDateChange = (moduleId: string, field: 'start' | 'end' | 'live', dateStr: string) => {
    setSchedules(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [field]: dateStr
      }
    }));
  };

  const hasLiveClass = (m: any) => {
    if (!m.contents_json) return false;
    try {
      const parsed = JSON.parse(m.contents_json);
      return parsed.some((item: any) => item.type === 'LIVE_CLASS');
    } catch (e) {
      return false;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && cohort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col my-8 max-h-[90vh]"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold text-slate-900">
                Schedule Modules for {cohort.title}
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
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">Set the start, end, and (optionally) live class dates for each module in this cohort. Start and end dates will feed into the cohort countdown timers.</p>
                  {modules.map(m => {
                    const hasLive = hasLiveClass(m);
                    const modSchedule = schedules[m.id] || {};
                    return (
                      <div key={m.id} className="flex flex-col p-4 border border-gray-100 rounded-xl bg-gray-50 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{m.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">Stage {m.stage_number || m.order_index + 1}</p>
                          </div>
                          {hasLive && (
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded">HAS LIVE CLASS</span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Start Date & Time</label>
                            <input
                              type="datetime-local"
                              className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500"
                              value={modSchedule.start || ''}
                              onChange={(e) => handleDateChange(m.id, 'start', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">End Date & Time</label>
                            <input
                              type="datetime-local"
                              className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500"
                              value={modSchedule.end || ''}
                              onChange={(e) => handleDateChange(m.id, 'end', e.target.value)}
                            />
                          </div>
                          {hasLive && (
                            <div className="md:col-span-2 border-t border-gray-200/60 pt-3 mt-1">
                              <label className="block text-xs font-medium text-emerald-600 mb-1">Live Class Date & Time</label>
                              <input
                                type="datetime-local"
                                className="w-full md:w-1/2 border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-emerald-500 bg-white"
                                value={modSchedule.live || ''}
                                onChange={(e) => handleDateChange(m.id, 'live', e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
