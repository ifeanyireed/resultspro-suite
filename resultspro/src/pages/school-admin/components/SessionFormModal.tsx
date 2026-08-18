import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { X, AlertCircle, Plus, Trash01 } from '@/lib/hugeicons-compat';

const termSchema = z.object({
  name: z.string().min(1, 'Term name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine(
  (data) => new Date(data.startDate) < new Date(data.endDate),
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

const sessionFormSchema = z.object({
  academicSessionName: z.string().min(1, 'Session name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  terms: z.array(termSchema).min(1, 'At least one term is required'),
}).refine(
  (data) => new Date(data.startDate) < new Date(data.endDate),
  {
    message: 'Session end date must be after start date',
    path: ['endDate'],
  }
);

type SessionFormData = z.infer<typeof sessionFormSchema>;

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SessionFormData) => Promise<void>;
  initialData?: SessionFormData;
  isEditing?: boolean;
  isSubmitting?: boolean;
  error?: string | null;
}

export const SessionFormModal: React.FC<SessionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  isSubmitting = false,
  error,
}) => {
  const currentYear = new Date().getFullYear();
  const defaultSessionName = `${currentYear}/${currentYear + 1}`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: initialData || {
      academicSessionName: defaultSessionName,
      startDate: '',
      endDate: '',
      terms: [
        { name: '1st Term', startDate: '', endDate: '' },
        { name: '2nd Term', startDate: '', endDate: '' },
        { name: '3rd Term', startDate: '', endDate: '' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'terms',
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmitForm = async (data: SessionFormData) => {
    await onSubmit(data);
  };

  const addTerm = () => {
    append({ name: '', startDate: '', endDate: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-lg border border-slate-700 max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Academic Session' : 'Create New Academic Session'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Session Details</h3>

            {/* Session Name */}
            <div>
              <label className="text-gray-300 text-sm font-medium block mb-2">Session Name *</label>
              <input
                type="text"
                placeholder="e.g., 2025/2026"
                {...register('academicSessionName')}
                className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-gray-500 outline-none transition-colors ${
                  errors.academicSessionName
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-slate-600 focus:border-blue-500'
                }`}
              />
              {errors.academicSessionName && (
                <p className="text-red-400 text-xs mt-1">{errors.academicSessionName.message}</p>
              )}
            </div>

            {/* Session Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Session Start Date *</label>
                <input
                  type="date"
                  {...register('startDate')}
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white outline-none transition-colors ${
                    errors.startDate
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-slate-600 focus:border-blue-500'
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-400 text-xs mt-1">{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Session End Date *</label>
                <input
                  type="date"
                  {...register('endDate')}
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white outline-none transition-colors ${
                    errors.endDate
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-slate-600 focus:border-blue-500'
                  }`}
                />
                {errors.endDate && (
                  <p className="text-red-400 text-xs mt-1">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="space-y-4 border-t border-slate-700 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Terms</h3>
              <button
                type="button"
                onClick={addTerm}
                className="flex items-center gap-1 px-3 py-1 text-blue-400 hover:text-blue-300 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Term
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="bg-slate-800/50 rounded-lg p-4 space-y-3 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-gray-300 text-sm font-medium">Term {index + 1}</h4>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash01 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Term Name */}
                <div>
                  <label className="text-gray-300 text-xs font-medium block mb-1">Term Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., First Term"
                    {...register(`terms.${index}.name`)}
                    className={`w-full px-3 py-2 bg-slate-700 border rounded text-white placeholder-gray-500 text-sm outline-none transition-colors ${
                      errors.terms?.[index]?.name
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-slate-600 focus:border-blue-500'
                    }`}
                  />
                  {errors.terms?.[index]?.name && (
                    <p className="text-red-400 text-xs mt-0.5">{errors.terms[index]?.name?.message}</p>
                  )}
                </div>

                {/* Term Dates */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-300 text-xs font-medium block mb-1">Start *</label>
                    <input
                      type="date"
                      {...register(`terms.${index}.startDate`)}
                      className={`w-full px-3 py-2 bg-slate-700 border rounded text-white text-sm outline-none transition-colors ${
                        errors.terms?.[index]?.startDate
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-slate-600 focus:border-blue-500'
                      }`}
                    />
                    {errors.terms?.[index]?.startDate && (
                      <p className="text-red-400 text-xs mt-0.5">{errors.terms[index]?.startDate?.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-medium block mb-1">End *</label>
                    <input
                      type="date"
                      {...register(`terms.${index}.endDate`)}
                      className={`w-full px-3 py-2 bg-slate-700 border rounded text-white text-sm outline-none transition-colors ${
                        errors.terms?.[index]?.endDate
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-slate-600 focus:border-blue-500'
                      }`}
                    />
                    {errors.terms?.[index]?.endDate && (
                      <p className="text-red-400 text-xs mt-0.5">{errors.terms[index]?.endDate?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {errors.terms?.message && (
              <p className="text-red-400 text-xs">{errors.terms.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
