import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, AlertCircle, Plus, Trash01 } from '@/lib/hugeicons-compat';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const gradeSchema = z.object({
  grade: z.string().min(1, 'Grade is required'),
  minScore: z.number().min(0).max(100),
  maxScore: z.number().min(0).max(100),
  description: z.string().optional(),
});

const gradingSystemSchema = z.object({
  gradingSystem: z.object({
    template: z.string().default('standard'),
    gradeScale: z.array(gradeSchema).min(1, 'At least one grade is required'),
  }),
});

type GradingSystemFormData = z.infer<typeof gradingSystemSchema>;

interface GradingSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GradingSystemFormData) => Promise<void>;
  initialData?: any;
  isLoading?: boolean;
}

const STANDARD_GRADES = [
  { grade: 'A', minScore: 80, maxScore: 100, description: 'Excellent' },
  { grade: 'B', minScore: 70, maxScore: 79, description: 'Very Good' },
  { grade: 'C', minScore: 60, maxScore: 69, description: 'Good' },
  { grade: 'D', minScore: 50, maxScore: 59, description: 'Credit' },
  { grade: 'E', minScore: 40, maxScore: 49, description: 'Pass' },
  { grade: 'F', minScore: 0, maxScore: 39, description: 'Fail' },
];

const WEIGHTED_GRADES = [
  { grade: 'A+', minScore: 95, maxScore: 100, description: 'Outstanding' },
  { grade: 'A', minScore: 90, maxScore: 94, description: 'Excellent' },
  { grade: 'A-', minScore: 85, maxScore: 89, description: 'Very Good' },
  { grade: 'B+', minScore: 80, maxScore: 84, description: 'Good' },
  { grade: 'B', minScore: 75, maxScore: 79, description: 'Above Average' },
  { grade: 'C+', minScore: 70, maxScore: 74, description: 'Average' },
  { grade: 'C', minScore: 60, maxScore: 69, description: 'Satisfactory' },
  { grade: 'D', minScore: 50, maxScore: 59, description: 'Pass' },
  { grade: 'F', minScore: 0, maxScore: 49, description: 'Fail' },
];

const WAEC_GRADES = [
  { grade: 'A1', minScore: 75, maxScore: 100, description: 'Excellent' },
  { grade: 'B2', minScore: 70, maxScore: 74, description: 'Very Good' },
  { grade: 'B3', minScore: 65, maxScore: 69, description: 'Good' },
  { grade: 'C4', minScore: 60, maxScore: 64, description: 'Credit' },
  { grade: 'C5', minScore: 55, maxScore: 59, description: 'Credit' },
  { grade: 'C6', minScore: 50, maxScore: 54, description: 'Credit' },
  { grade: 'D7', minScore: 45, maxScore: 49, description: 'Pass' },
  { grade: 'E8', minScore: 40, maxScore: 44, description: 'Pass' },
  { grade: 'F9', minScore: 0, maxScore: 39, description: 'Fail' },
];

const GradingSystemModal: React.FC<GradingSystemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const form = useForm<GradingSystemFormData>({
    resolver: zodResolver(gradingSystemSchema),
    defaultValues: {
      gradingSystem: {
        template: 'standard',
        gradeScale: STANDARD_GRADES,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'gradingSystem.gradeScale',
  });

  useEffect(() => {
    if (initialData && isOpen) {
      const grades = initialData.grades || initialData.gradingSystem?.gradeScale;
      if (grades) {
        form.reset({
          gradingSystem: {
            template: initialData.gradingSystem?.template || 'custom',
            gradeScale: grades.map((g: any) => ({
              grade: g.grade || g.gradeName || '',
              minScore: g.minScore || 0,
              maxScore: g.maxScore || 0,
              description: g.description || '',
            })),
          },
        });
      }
    }
  }, [initialData, isOpen, form]);

  const loadPreset = (preset: any[], template: string) => {
    form.setValue('gradingSystem.template', template);
    form.setValue('gradingSystem.gradeScale', preset);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0A] rounded-[30px] border border-white/10 p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white">Configure Grading System</h3>
            <p className="text-gray-400 text-sm mt-1">Define your school's grading criteria</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Template Selection */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Quick Templates</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'standard', name: 'Standard', data: STANDARD_GRADES, desc: 'A - F (6 grades)' },
                  { id: 'weighted', name: 'Weighted', data: WEIGHTED_GRADES, desc: 'A+ - F (9 grades)' },
                  { id: 'waec', name: 'WAEC', data: WAEC_GRADES, desc: 'A1 - F9 (9 grades)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => loadPreset(t.data, t.id)}
                    className={`p-4 rounded-xl border-2 transition text-left ${
                      form.watch('gradingSystem.template') === t.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/5 bg-white/2.5 hover:border-white/10'
                    }`}
                  >
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Grade Scale */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Grade Scale Details</h4>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-3 items-start bg-white/2.5 p-4 rounded-2xl border border-white/5">
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`gradingSystem.gradeScale.${index}.grade`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase text-gray-500">Grade</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white/5 border-white/10 text-white font-bold text-center" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`gradingSystem.gradeScale.${index}.minScore`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase text-gray-500">Min %</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                className="bg-white/5 border-white/10 text-white text-center"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`gradingSystem.gradeScale.${index}.maxScore`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase text-gray-500">Max %</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                className="bg-white/5 border-white/10 text-white text-center"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-5">
                      <FormField
                        control={form.control}
                        name={`gradingSystem.gradeScale.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase text-gray-500">Remark</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. Excellent" className="bg-white/5 border-white/10 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 pt-7">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2"
                      >
                        <Trash01 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => append({ grade: '', minScore: 0, maxScore: 100, description: '' })}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors mt-2"
              >
                <Plus className="w-4 h-4" />
                Add Grade Level
              </button>
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/5">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent border-white/10 text-gray-400 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white"
              >
                {isLoading ? 'Saving...' : 'Save Grading System'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default GradingSystemModal;
