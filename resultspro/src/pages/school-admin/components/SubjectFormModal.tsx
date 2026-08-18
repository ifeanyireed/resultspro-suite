import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, CheckCircle } from '@/lib/hugeicons-compat';

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().optional(),
  description: z.string().optional(),
  classIds: z.array(z.string()).default([]),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface Class {
  id: string;
  name: string;
  level: string;
}

interface SubjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubjectFormData) => void;
  classes: Class[];
  initialData?: any;
  isLoading?: boolean;
}

const SubjectFormModal: React.FC<SubjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  classes,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      classIds: [],
    },
  });

  const selectedClassIds = watch('classIds') || [];
  const subjectName = watch('name');

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        code: initialData.code || '',
        description: initialData.description || '',
        classIds: initialData.classes?.map((c: any) => c.id) || [],
      });
    } else {
      reset({
        name: '',
        code: '',
        description: '',
        classIds: [],
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data: SubjectFormData) => {
    // Auto-generate code if not present (for new subjects)
    if (!data.code && data.name) {
      data.code = data.name.toUpperCase().replace(/\s+/g, '_').substring(0, 10);
    }
    onSubmit(data);
  };

  const toggleClass = (classId: string) => {
    const currentIds = [...selectedClassIds];
    const index = currentIds.indexOf(classId);
    if (index === -1) {
      currentIds.push(classId);
    } else {
      currentIds.splice(index, 1);
    }
    setValue('classIds', currentIds);
  };

  const selectAllClasses = () => {
    setValue('classIds', classes.map(c => c.id));
  };

  const deselectAllClasses = () => {
    setValue('classIds', []);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0A] rounded-[30px] border border-white/10 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white">
              {initialData ? 'Edit Subject' : 'Create New Subject'}
            </h3>
            <p className="text-gray-400 text-sm mt-1">Define subject details and assign to classes</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Subject Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Subject Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Mathematics"
                {...register('name')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            
            {/* Hidden Code field to maintain compatibility */}
            <input type="hidden" {...register('code')} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description (Optional)
            </label>
            <textarea
              placeholder="Brief description of the subject..."
              {...register('description')}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
            />
          </div>

          {/* Class Assignment */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-400">
                Assign to Classes
              </label>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={selectAllClasses}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Select All
                </button>
                <button 
                  type="button" 
                  onClick={deselectAllClasses}
                  className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                >
                  Deselect All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-white/2.5 rounded-2xl border border-white/5 max-h-[200px] overflow-y-auto custom-scrollbar">
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => toggleClass(cls.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-left ${
                      selectedClassIds.includes(cls.id)
                        ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                        : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs font-medium truncate">{cls.name}</span>
                    {selectedClassIds.includes(cls.id) && (
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <div className="col-span-full py-4 text-center text-gray-500 text-sm italic">
                  No classes available. Create classes first.
                </div>
              )}
            </div>
            {errors.classIds && (
              <p className="text-red-400 text-xs mt-1">{errors.classIds.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                initialData ? 'Update Subject' : 'Create Subject'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectFormModal;
