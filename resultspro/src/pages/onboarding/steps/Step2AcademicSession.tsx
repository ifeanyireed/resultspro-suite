import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
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
import { AlertCircle, Trash2 } from '@/lib/hugeicons-compat';
import { useOnboardingStore, Step2Data } from '@/stores/onboardingStore';

const termSchema = z.object({
  name: z.string().min(1, 'Term name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

const step2Schema = z.object({
  academicSessionName: z
    .string()
    .min(1, 'Academic session name is required')
    .default(''),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .default(''),
  endDate: z
    .string()
    .min(1, 'End date is required')
    .default(''),
  terms: z.array(termSchema).min(1, 'At least one term is required').default([]),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

type Step2FormData = z.infer<typeof step2Schema>;

interface Step2Props {
  onNext: (data: Step2Data) => Promise<void>;
  onPrevious: () => void;
  initialData?: Step2Data;
  isLoading?: boolean;
}

// Debounce hook for real-time saves
const useDebouncedValue = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const Step2AcademicSession = ({
  onNext,
  onPrevious,
  initialData,
  isLoading = false,
}: Step2Props) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { setError } = useOnboardingStore();
  const lastSavedRef = useRef<Partial<Step2FormData>>({});

  // Generate default session name based on current year
  const currentYear = new Date().getFullYear();
  const defaultSessionName = `${currentYear}/${currentYear + 1}`;

  const form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
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

  // Get all form values to detect changes
  const formValues = form.watch();
  const debouncedValues = useDebouncedValue(formValues, 1000); // 1 second debounce

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      lastSavedRef.current = { ...initialData };
      console.log('📝 Form reset with initialData:', initialData);
    }
  }, [initialData, form]);

  // Auto-save form changes to database
  useEffect(() => {
    const saveChanges = async () => {
      // Find which fields have changed
      const changedFields: Partial<Step2FormData> = {};
      let hasChanges = false;

      (Object.keys(debouncedValues) as Array<keyof Step2FormData>).forEach((key) => {
        const oldVal = JSON.stringify(lastSavedRef.current[key]);
        const newVal = JSON.stringify(debouncedValues[key]);
        if (oldVal !== newVal) {
          changedFields[key] = debouncedValues[key];
          hasChanges = true;
        }
      });

      if (!hasChanges) return;

      try {
        setSaving(true);
        setSaveError(null);

        const response = await fetch('http://localhost:5000/api/onboarding/academic-session', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(changedFields),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save changes');
        }

        // Update the reference to track what we've saved
        lastSavedRef.current = { ...lastSavedRef.current, ...changedFields };
        console.log('✓ Saved changes:', Object.keys(changedFields));
      } catch (error: any) {
        const msg = error?.message || 'Failed to save changes';
        setSaveError(msg);
        console.error('Auto-save error:', error);
      } finally {
        setSaving(false);
      }
    };

    saveChanges();
  }, [debouncedValues]);

  const onSubmit = async (data: Step2FormData) => {
    try {
      setSubmitError(null);
      setError(null);
      await onNext(data);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Failed to save academic session';
      setSubmitError(errorMessage);
      setError(errorMessage);
    }
  };

  const termFields = form.watch('terms') || [];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-8 backdrop-blur-xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Academic Session</h2>
              <p className="text-gray-400 mt-2">
                Set up the academic year and term dates for your school.
              </p>
            </div>
            {saving && (
              <div className="text-xs text-gray-400 animate-pulse">Saving...</div>
            )}
          </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{submitError}</p>
          </div>
        )}

        {saveError && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-400 text-sm">Auto-save failed: {saveError}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Session Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
                Session Details
              </h3>

              <FormField
                control={form.control}
                name="academicSessionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Academic Session Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={defaultSessionName}
                        className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Format: e.g., {defaultSessionName} or {currentYear}/2025
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Term Dates Section */}
            <div className="border-t border-[rgba(255,255,255,0.07)] pt-8">
              <h3 className="text-lg font-semibold text-white mb-6">
                Session Duration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Session Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        When does the academic year begin?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Session End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        When does the academic year end?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date Range Summary */}
              {form.watch('startDate') && form.watch('endDate') && (
                <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <p className="text-sm text-blue-300">
                    <span className="font-semibold">Session Duration:</span>{' '}
                    {new Date(form.watch('startDate')).toLocaleDateString(
                      undefined,
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}{' '}
                    to{' '}
                    {new Date(form.watch('endDate')).toLocaleDateString(
                      undefined,
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </p>
                  <p className="text-xs text-blue-400 mt-2">
                    {Math.ceil(
                      (new Date(form.watch('endDate')).getTime() -
                        new Date(form.watch('startDate')).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days total
                  </p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="border-t border-[rgba(255,255,255,0.07)] pt-8">
              <h3 className="text-lg font-semibold text-white mb-6">
                Term Dates
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Define the dates for each term within this academic session.
              </p>

              <div className="space-y-6">
                {termFields.map((term, index) => (
                  <div key={index} className="p-4 bg-[rgba(255,255,255,0.03)] rounded-lg border border-[rgba(255,255,255,0.1)]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`terms.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Term Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 1st Term"
                                className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`terms.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Start Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`terms.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">End Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms Summary */}
            {termFields.some(t => t.startDate && t.endDate) && (
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <p className="text-sm text-blue-300 font-semibold mb-2">Terms Overview:</p>
                <div className="space-y-1 text-xs text-blue-300">
                  {termFields.filter(t => t.startDate && t.endDate).map((term, idx) => (
                    <p key={idx}>
                      <strong>{term.name}:</strong>{' '}
                      {new Date(term.startDate).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric' 
                      })}{' '}
                      -{' '}
                      {new Date(term.endDate).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  ))}
                </div>
              </div>
            )}

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
                {isLoading ? 'Saving...' : 'Next: Classes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
