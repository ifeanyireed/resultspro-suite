import { useState, useRef } from 'react';
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
import { AlertCircle, Upload01, CheckCircle } from '@/lib/hugeicons-compat';
import { useOnboardingStore, Step6Data } from '@/stores/onboardingStore';

const step6Schema = z.object({
  csvFile: z.instanceof(File).optional(),
});

type Step6FormData = z.infer<typeof step6Schema>;

interface Step6Props {
  onNext: (data: Step6Data) => Promise<void>;
  onPrevious: () => void;
  initialData?: Step6Data;
  isLoading?: boolean;
}

export const Step6CsvUpload = ({
  onNext,
  onPrevious,
  initialData,
  isLoading = false,
}: Step6Props) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setError } = useOnboardingStore();

  const form = useForm<Step6FormData>({
    resolver: zodResolver(step6Schema),
    defaultValues: {
      csvFile: undefined,
    },
  });

  const onSubmit = async (data: Step6FormData) => {
    try {
      setSubmitError(null);
      setError(null);
      
      // If no file was selected, just mark as complete without file
      if (!data.csvFile && !form.watch('csvFile')) {
        await onNext({ csvFile: undefined });
        setUploadComplete(true);
      } else {
        await onNext({ csvFile: data.csvFile });
        setUploadComplete(true);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Failed to upload CSV';
      setSubmitError(errorMessage);
      setError(errorMessage);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.csv')) {
        setSubmitError('Please select a CSV file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('File size must be less than 5MB');
        return;
      }

      setSubmitError(null);
      form.setValue('csvFile', file);
    }
  };

  const fileName = form.watch('csvFile')?.name;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-8 backdrop-blur-xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">CSV Upload (Optional)</h2>
          <p className="text-gray-400 mt-2">
            Bulk import student and teacher data using a CSV file. You can skip this and add users manually later.
          </p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{submitError}</p>
          </div>
        )}

        {uploadComplete && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-emerald-300 text-sm">
              Onboarding complete! Your school is now set up and ready to use.
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* File Upload Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
                Import Data
              </h3>

              {/* Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const droppedFile = e.dataTransfer.files?.[0];
                  if (droppedFile) {
                    handleFileChange({
                      target: { files: [droppedFile] },
                    } as any);
                  }
                }}
                className="border-2 border-dashed border-[rgba(255,255,255,0.2)] rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-500/5 transition"
              >
                <Upload01 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-white font-medium">
                  Drag and drop your CSV file here
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  or click to browse
                </p>
                <p className="text-gray-500 text-xs mt-3">
                  CSV files up to 5MB
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* File Info */}
            {fileName && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-medium text-white">{fileName}</p>
                    <p className="text-sm text-gray-400">
                      {(form.watch('csvFile')?.size || 0) / 1024 < 1024
                        ? `${((form.watch('csvFile')?.size || 0) / 1024).toFixed(1)} KB`
                        : `${((form.watch('csvFile')?.size || 0) / (1024 * 1024)).toFixed(1)} MB`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CSV Format Info */}
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] rounded-lg p-4">
              <h4 className="font-semibold text-white mb-4 text-sm">
                CSV File Format
              </h4>
              <p className="text-sm text-gray-300 mb-3">
                Your CSV file should contain the following columns:
              </p>
              <div className="bg-[rgba(0,0,0,0.3)] rounded p-4 font-mono text-xs overflow-x-auto">
                <div className="text-gray-400">
                  <div className="text-gray-200">firstName,lastName,email,role,class</div>
                  <div className="text-gray-500 mt-2">John,Doe,john.doe@example.com,student,SS1</div>
                  <div className="text-gray-500">Jane,Smith,jane.smith@example.com,teacher,</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                For students: role=&quot;student&quot;, class=class name (e.g., SS1A)<br/>
                For teachers: role=&quot;teacher&quot;, class can be empty
              </p>
            </div>

            {/* Skip Option */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                <strong>Can't find the file?</strong> Don't worry! You can skip this step 
                and add users manually later from the admin dashboard.
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
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onNext({ csvFile: undefined })}
                  disabled={isLoading}
                  className="bg-transparent border-[rgba(255,255,255,0.2)] text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  Skip & Complete
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !fileName}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? 'Uploading...' : 'Upload & Complete'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
