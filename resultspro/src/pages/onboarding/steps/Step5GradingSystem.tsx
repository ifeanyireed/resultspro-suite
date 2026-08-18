import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Plus, Trash01 } from '@/lib/hugeicons-compat';
import { useOnboardingStore, Step5Data } from '@/stores/onboardingStore';

const gradeSchema = z.object({
  grade: z.string().min(1, 'Grade is required'),
  minScore: z.number().min(0).max(100),
  maxScore: z.number().min(0).max(100),
});

const step5Schema = z.object({
  gradingSystem: z.object({
    template: z.string().default('standard'),
    gradeScale: z.array(gradeSchema).min(1, 'At least one grade is required'),
  }),
});

type Step5FormData = z.infer<typeof step5Schema>;

interface Step5Props {
  onNext: (data: Step5Data) => Promise<void>;
  onPrevious: () => void;
  initialData?: Step5Data;
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
  { grade: 'A+', minScore: 95, maxScore: 100 },
  { grade: 'A', minScore: 90, maxScore: 94 },
  { grade: 'A-', minScore: 85, maxScore: 89 },
  { grade: 'B+', minScore: 80, maxScore: 84 },
  { grade: 'B', minScore: 75, maxScore: 79 },
  { grade: 'C+', minScore: 70, maxScore: 74 },
  { grade: 'C', minScore: 60, maxScore: 69 },
  { grade: 'D', minScore: 50, maxScore: 59 },
  { grade: 'F', minScore: 0, maxScore: 49 },
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

export const Step5GradingSystem = ({
  onNext,
  onPrevious,
  initialData,
  isLoading = false,
}: Step5Props) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { setError } = useOnboardingStore();

  const form = useForm<Step5FormData>({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      gradingSystem: {
        template: 'standard',
        gradeScale: initialData?.gradingSystem?.gradeScale || STANDARD_GRADES,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'gradingSystem.gradeScale',
  });

  const onSubmit = async (data: Step5FormData) => {
    try {
      setSubmitError(null);
      setError(null);
      await onNext(data);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Failed to save grading system';
      setSubmitError(errorMessage);
      setError(errorMessage);
    }
  };

  const loadPreset = (preset: typeof STANDARD_GRADES) => {
    // Replace the entire gradeScale array with the preset
    form.setValue('gradingSystem.gradeScale', preset);
  };

  const addGrade = () => {
    append({ grade: '', minScore: 0, maxScore: 100 });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-8 backdrop-blur-xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Grading System</h2>
          <p className="text-gray-400 mt-2">
            Define the grading scale and criteria for your school.
          </p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{submitError}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Template Selection */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
                Grading Template
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    form.setValue('gradingSystem.template', 'standard');
                    loadPreset(STANDARD_GRADES);
                  }}
                  className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                    form.watch('gradingSystem.template') === 'standard'
                      ? 'border-blue-400 bg-blue-500/10'
                      : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.02)]'
                  }`}
                >
                  <h4 className="font-semibold text-white">Standard</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    A, B, C, D, E, F (6 grades)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    form.setValue('gradingSystem.template', 'weighted');
                    loadPreset(WEIGHTED_GRADES);
                  }}
                  className={`p-4 rounded-lg border-2 transition cursor-pointer pointer-events-auto select-none active:scale-95 ${
                    form.watch('gradingSystem.template') === 'weighted'
                      ? 'border-blue-400 bg-blue-500/10'
                      : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.02)]'
                  }`}
                >
                  <h4 className="font-semibold text-white">Weighted</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    A+ to F (9 grades, more granular)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    form.setValue('gradingSystem.template', 'waec');
                    loadPreset(WAEC_GRADES);
                  }}
                  className={`p-4 rounded-lg border-2 transition cursor-pointer pointer-events-auto select-none active:scale-95 ${
                    form.watch('gradingSystem.template') === 'waec'
                      ? 'border-blue-400 bg-blue-500/10'
                      : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.02)]'
                  }`}
                >
                  <h4 className="font-semibold text-white">WAEC</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    A1 to F9 (9 grades, West African standard)
                  </p>
                </button>
              </div>
            </div>

            {/* Grade Scale */}
            <div className="border-t border-[rgba(255,255,255,0.07)] pt-8">
              <h3 className="text-lg font-semibold text-white mb-6">
                Grade Scale
              </h3>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-4 md:grid-cols-5 gap-2 items-end"
                  >
                    <FormField
                      control={form.control}
                      name={`gradingSystem.gradeScale.${index}.grade`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-300">Grade</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., A"
                              {...field}
                              className="text-center font-bold bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`gradingSystem.gradeScale.${index}.minScore`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-300">Min %</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              className="text-center bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <span className="text-center text-gray-600 pb-2">-</span>

                    <FormField
                      control={form.control}
                      name={`gradingSystem.gradeScale.${index}.maxScore`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-300">Max %</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              className="text-center bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="pb-2 text-red-400 hover:text-red-300"
                      >
                        <Trash01 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add More Button */}
              <button
                type="button"
                onClick={addGrade}
                className="mt-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Grade
              </button>
            </div>

            {/* Preview Table */}
            <div className="bg-[rgba(255,255,255,0.02)] rounded-lg p-4 overflow-x-auto border border-[rgba(255,255,255,0.07)]">
              <h4 className="font-semibold text-sm text-white mb-4">
                Grade Scale Preview
              </h4>
              <table className="w-full text-sm text-gray-300">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.07)]">
                    <th className="text-left py-3 px-4 font-semibold text-gray-200">Grade</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-200">Range</th>
                  </tr>
                </thead>
                <tbody>
                  {form.watch('gradingSystem.gradeScale').map((g, idx) => (
                    <tr key={idx} className="border-b border-[rgba(255,255,255,0.05)]">
                      <td className="py-3 px-4 font-bold text-white">{g.grade}</td>
                      <td className="text-center py-3 px-4">
                        {g.minScore}% - {g.maxScore}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-[rgba(255,255,255,0.07)] pt-8 flex gap-4 justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                disabled={isLoading}
                className="bg-transparent border-[rgba(255,255,255,0.2)] text-gray-300 hover:bg-white/5 hover:text-white"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Saving...' : 'Next: Select Plan'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
