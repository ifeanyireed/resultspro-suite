import { useState, useEffect } from 'react';
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
import { AlertCircle, Trash01, Plus } from '@/lib/hugeicons-compat';
import { useOnboardingStore, Step3Data } from '@/stores/onboardingStore';

const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  classLevel: z.string().min(1, 'Class level is required'),
});

const step3Schema = z.object({
  classes: z.array(classSchema).min(1, 'At least one class is required'),
});

type Step3FormData = z.infer<typeof step3Schema>;

interface Step3Props {
  onNext: (data: Step3Data) => Promise<void>;
  onPrevious: () => void;
  initialData?: Step3Data;
  isLoading?: boolean;
}

const CLASS_LEVELS = [
  { label: 'Primary 1 (P1)', value: 'P1' },
  { label: 'Primary 2 (P2)', value: 'P2' },
  { label: 'Primary 3 (P3)', value: 'P3' },
  { label: 'Primary 4 (P4)', value: 'P4' },
  { label: 'Primary 5 (P5)', value: 'P5' },
  { label: 'Primary 6 (P6)', value: 'P6' },
  { label: 'Secondary 1 (SS1)', value: 'SS1' },
  { label: 'Secondary 2 (SS2)', value: 'SS2' },
  { label: 'Secondary 3 (SS3)', value: 'SS3' },
  { label: 'Junior Secondary 1 (JSS1)', value: 'JSS1' },
  { label: 'Junior Secondary 2 (JSS2)', value: 'JSS2' },
  { label: 'Junior Secondary 3 (JSS3)', value: 'JSS3' },
  { label: 'Form 1 (F1)', value: 'F1' },
  { label: 'Form 2 (F2)', value: 'F2' },
  { label: 'Form 3 (F3)', value: 'F3' },
  { label: 'Form 4 (F4)', value: 'F4' },
];

export const Step3Classes = ({
  onNext,
  onPrevious,
  initialData,
  isLoading = false,
}: Step3Props) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { setError } = useOnboardingStore();

  const form = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      classes: initialData?.classes && initialData.classes.length > 0 
        ? initialData.classes 
        : [{ name: '', classLevel: '' }],
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData?.classes && initialData.classes.length > 0) {
      form.reset({ classes: initialData.classes });
    }
  }, [initialData, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'classes',
  });

  const onSubmit = async (data: Step3FormData) => {
    try {
      setSubmitError(null);
      setError(null);
      
      // Filter out any empty rows before submission to be safe
      const validClasses = data.classes.filter(c => c.name.trim() !== '' && c.classLevel.trim() !== '');
      
      if (validClasses.length === 0) {
        setSubmitError('Please add at least one valid class with a name and level.');
        return;
      }

      await onNext({ classes: validClasses });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Failed to save classes';
      setSubmitError(errorMessage);
      setError(errorMessage);
    }
  };

  const addClass = () => {
    append({ name: '', classLevel: '' });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-8 backdrop-blur-xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Classes</h2>
          <p className="text-gray-400 mt-2">
            Define all the classes in your school. You can add more classes later.
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
            {/* Classes List */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
                Class List
              </h3>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-[rgba(255,255,255,0.07)] rounded-lg p-6 bg-[rgba(255,255,255,0.01)]"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`classes.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Class Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., SS1A, Class 3B"
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
                        name={`classes.${index}.classLevel`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Class Level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white">
                                  <SelectValue placeholder="Select class level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-900 border-white/10 text-white">
                                {CLASS_LEVELS.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Remove Button */}
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="mt-4 flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-medium"
                      >
                        <Trash01 className="w-4 h-4" />
                        Remove Class
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add More Button */}
              <button
                type="button"
                onClick={addClass}
                className="mt-6 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Another Class
              </button>
            </div>

            {/* Summary */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                <strong>Added {fields.length} class{fields.length !== 1 ? 'es' : ''}:</strong>{' '}
                {form.watch('classes').filter(c => c.name && c.classLevel).map(c => c.name).join(', ') || 'None yet'}
              </p>
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
                {isLoading ? 'Saving...' : 'Next: Subjects'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
