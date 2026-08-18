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
import { useOnboardingStore, Step4Data } from '@/stores/onboardingStore';

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  classId: z.string().min(1, 'Class must be selected for subject'),
});

const step4Schema = z.object({
  subjects: z.array(subjectSchema).min(1, 'At least one subject is required'),
});

type Step4FormData = z.infer<typeof step4Schema>;

interface Class {
  id: string;
  name: string;
  level: string;
}

interface Step4Props {
  onNext: (data: Step4Data) => Promise<void>;
  onPrevious: () => void;
  initialData?: Step4Data;
  classes?: Class[];
  isLoading?: boolean;
}

const COMMON_SUBJECTS = [
  'Mathematics',
  'English Language',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Civic Education',
  'Literature in English',
  'Economics',
  'Computer Science',
  'Fine Arts',
  'Physical Education',
  'Agriculture',
  'French Language',
  'Yoruba Language',
  'Igbo Language',
];

export const Step4Subjects = ({
  onNext,
  onPrevious,
  initialData,
  classes = [],
  isLoading = false,
}: Step4Props) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const { setError } = useOnboardingStore();

  const form = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      subjects: initialData?.subjects && initialData.subjects.length > 0 ? initialData.subjects : [],
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData?.subjects && initialData.subjects.length > 0) {
      form.reset({ subjects: initialData.subjects });
    }
  }, [initialData, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subjects',
  });

  // When selected class changes
  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);
  };

  const onSubmit = async (data: Step4FormData) => {
    try {
      setSubmitError(null);
      setError(null);
      
      // Filter out invalid subjects:
      // 1. Must have a name
      // 2. Must have a classId
      const cleanedSubjects = data.subjects.filter(s => s.name.trim() !== '' && s.classId && s.classId.trim() !== '');
      
      if (cleanedSubjects.length === 0) {
        setSubmitError('Please add at least one valid subject with a name and class assignment.');
        return;
      }

      await onNext({ subjects: cleanedSubjects });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Failed to save subjects';
      setSubmitError(errorMessage);
      setError(errorMessage);
    }
  };

  const onInvalid = (errors: any) => {
    console.log('Form validation errors:', errors);
    
    // If there are errors, it might be due to hidden subjects (missing classId)
    const allSubjects = form.getValues('subjects') || [];
    const unassignedCount = allSubjects.filter(s => !s.classId).length;
    
    if (unassignedCount > 0) {
      setSubmitError(`Found ${unassignedCount} subjects not assigned to any class. Please fix or remove them below.`);
    } else {
      setSubmitError('Please fix the errors in the form before proceeding.');
    }
  };

  const addSubject = () => {
    if (!selectedClass) {
      setSubmitError('Please select a class first');
      return;
    }
    append({ name: '', classId: selectedClass });
  };

  const addCommonSubject = (subjectName: string) => {
    if (!selectedClass) {
      setSubmitError('Please select a class first');
      return;
    }
    // Check if subject already added to this class
    const currentSubjects = form.getValues('subjects') || [];
    const exists = currentSubjects.some(s => s.name === subjectName && s.classId === selectedClass);
    
    if (!exists) {
      append({ name: subjectName, classId: selectedClass });
    }
  };

  const getSubjectsForClass = (classId: string) => {
    const allSubjects = form.watch('subjects') || [];
    return allSubjects.filter(s => s.classId === classId);
  };

  const unassignedSubjectsCount = fields.filter((_, idx) => {
    const classId = form.watch(`subjects.${idx}.classId`);
    return !classId || classId.trim() === '';
  }).length;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-8 backdrop-blur-xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Subjects per Class</h2>
          <p className="text-gray-400 mt-2">
            Add subjects for each class in your school.
          </p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{submitError}</p>
          </div>
        )}

        {classes.length === 0 ? (
          <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-400 text-sm">
              No classes created. Please complete Step 3 (Classes) first.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
              
              {/* Class Selection */}
              <div>
                <FormLabel className="text-base font-semibold text-white block mb-3">
                  Select Class to Manage Subjects
                </FormLabel>
                <Select value={selectedClass} onValueChange={handleClassSelect}>
                  <SelectTrigger className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white h-12">
                    <SelectValue placeholder="Choose a class..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-[rgba(255,255,255,0.1)]">
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id} className="text-white">
                        {cls.name} ({cls.level})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedClass && (
                <>
                  {/* Quick Add Common Subjects */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                      Quick Add Common Subjects for {classes.find(c => c.id === selectedClass)?.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_SUBJECTS.map((subject) => (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => addCommonSubject(subject)}
                          disabled={
                            (form.watch('subjects') || [])
                              .filter(s => s.classId === selectedClass)
                              .some(s => s.name === subject)
                          }
                          className="px-3 py-1 rounded-full text-sm border border-blue-400/50 text-blue-300 hover:bg-blue-500/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-transparent"
                        >
                          + {subject}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subjects for Selected Class */}
                  <div className="border-t border-[rgba(255,255,255,0.07)] pt-8">
                    <h3 className="text-lg font-semibold text-white mb-6">
                      Subjects for {classes.find(c => c.id === selectedClass)?.name}
                    </h3>

                    <div className="space-y-4">
                      {fields.map((field, idx) => {
                        // Watch the specific field to check its classId
                        const itemClassId = form.watch(`subjects.${idx}.classId`);
                        if (itemClassId !== selectedClass) return null;

                        return (
                          <div
                            key={field.id}
                            className="border border-[rgba(255,255,255,0.07)] rounded-lg p-6 bg-[rgba(255,255,255,0.01)]"
                          >
                            <div className="grid grid-cols-1 gap-4">
                              <FormField
                                control={form.control}
                                name={`subjects.${idx}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">
                                      Subject Name
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="e.g., Mathematics"
                                        className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600 h-12"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              className="mt-4 flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-medium"
                            >
                              <Trash01 className="w-4 h-4" />
                              Remove Subject
                            </button>
                          </div>
                        );
                      })}
                      
                      {getSubjectsForClass(selectedClass).length === 0 && (
                        <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-xl">
                          <p className="text-gray-500">No subjects added to this class yet.</p>
                        </div>
                      )}
                    </div>

                    {/* Add More Button */}
                    <button
                      type="button"
                      onClick={addSubject}
                      className="mt-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Another Subject to {classes.find(c => c.id === selectedClass)?.name}
                    </button>
                  </div>
                </>
              )}

              {/* Summary by Class */}
              <div className="border-t border-[rgba(255,255,255,0.07)] pt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
                <div className="space-y-3">
                  {classes.map((cls) => {
                    const classSubjects = getSubjectsForClass(cls.id).filter(s => s.name.trim());
                    return (
                      <div
                        key={cls.id}
                        className={`border rounded-lg p-4 transition ${
                          classSubjects.length > 0 
                            ? 'bg-blue-500/10 border-blue-500/30' 
                            : 'bg-white/5 border-white/10 opacity-60'
                        }`}
                      >
                        <p className="text-sm text-blue-300">
                          <strong className="text-white">{cls.name}:</strong>{' '}
                          {classSubjects.length} subject{classSubjects.length !== 1 ? 's' : ''}
                          {classSubjects.length > 0 && (
                            <span className="text-gray-400 ml-2">
                              ({classSubjects.map(s => s.name).join(', ')})
                            </span>
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
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
                  className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]"
                >
                  {isLoading ? 'Saving...' : 'Next: Grading System'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};
