import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from '@/lib/hugeicons-compat';

const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  level: z.string().min(1, 'Level is required'),
  formTutor: z.string().optional(),
});

type ClassFormData = z.infer<typeof classSchema>;

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
  initialData?: ClassFormData & { id?: string };
  isLoading?: boolean;
}

const ClassFormModal: React.FC<ClassFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: initialData || {
      name: '',
      level: '',
      formTutor: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: ClassFormData) => {
    onSubmit(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {initialData ? 'Edit Class' : 'Create New Class'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Class Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Class Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., SS3A"
              {...register('name')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Level <span className="text-red-400">*</span>
            </label>
            <select
              {...register('level')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a level</option>
              <option value="Senior 1">Senior 1</option>
              <option value="Senior 2">Senior 2</option>
              <option value="Senior 3">Senior 3</option>
              <option value="Junior 1">Junior 1</option>
              <option value="Junior 2">Junior 2</option>
              <option value="Junior 3">Junior 3</option>
              <option value="Primary 1">Primary 1</option>
              <option value="Primary 2">Primary 2</option>
              <option value="Primary 3">Primary 3</option>
              <option value="Primary 4">Primary 4</option>
              <option value="Primary 5">Primary 5</option>
              <option value="Primary 6">Primary 6</option>
            </select>
            {errors.level && (
              <p className="text-red-400 text-sm mt-1">{errors.level.message}</p>
            )}
          </div>

          {/* Form Tutor */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Form Tutor (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Mrs. Adeyemi"
              {...register('formTutor')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/40 rounded-lg text-gray-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassFormModal;
