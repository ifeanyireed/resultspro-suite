import { useState, useEffect, useRef, useCallback } from 'react';
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
import { AlertCircle, Upload02 } from '@/lib/hugeicons-compat';
import { useOnboardingStore, Step1Data } from '@/stores/onboardingStore';

const step1Schema = z.object({
  motto: z.string().optional().default(''),
  logoUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
    .default('#1e40af'),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
    .default('#0ea5e9'),
  accentColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
    .default('#f59e0b'),
  contactPersonName: z.string().optional().default(''),
  contactPhone: z.string().optional().default(''),
  altContactEmail: z.string().email().optional().or(z.literal('')),
});

type Step1FormData = z.infer<typeof step1Schema>;

interface Step1Props {
  onNext: (data: Step1Data) => Promise<void>;
  onPrevious: () => void;
  initialData?: Step1Data;
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

export const Step1SchoolProfile = ({
  onNext,
  onPrevious,
  initialData,
  isLoading = false,
}: Step1Props) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logoUrl || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { setError } = useOnboardingStore();
  const lastSavedRef = useRef<Partial<Step1FormData>>({});

  const form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: initialData || {
      motto: '',
      logoUrl: '',
      primaryColor: '#1e40af',
      secondaryColor: '#0ea5e9',
      accentColor: '#f59e0b',
      contactPersonName: '',
      contactPhone: '',
      altContactEmail: '',
    },
  });

  // Get all form values to detect changes
  const formValues = form.watch();
  const debouncedValues = useDebouncedValue(formValues, 1000); // 1 second debounce

  // Reset form when initialData changes (e.g., when loaded from API on page refresh)
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      setLogoPreview(initialData.logoUrl || null);
      lastSavedRef.current = { ...initialData };
      console.log('📝 Form reset with initialData:', initialData);
    }
  }, [initialData, form]);

  // Auto-save form changes to database
  useEffect(() => {
    const saveChanges = async () => {
      // Find which fields have changed
      const changedFields: Partial<Step1FormData> = {};
      let hasChanges = false;

      (Object.keys(debouncedValues) as Array<keyof Step1FormData>).forEach((key) => {
        if (debouncedValues[key] !== lastSavedRef.current[key]) {
          changedFields[key] = debouncedValues[key];
          hasChanges = true;
        }
      });

      if (!hasChanges) return;

      try {
        setSaving(true);
        setSaveError(null);

        const response = await fetch('http://localhost:5000/api/onboarding/school-profile', {
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Create FormData to upload file via backend
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to backend which will upload to S3
      const response = await fetch('http://localhost:5000/api/onboarding/logo-upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const { s3Url } = await response.json();

      // Set the S3 URL in the form
      form.setValue('logoUrl', s3Url);
      setLogoPreview(s3Url);
    } catch (error: any) {
      const msg = error?.message || 'Failed to upload logo';
      setUploadError(msg);
      console.error('Logo upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    form.setValue('logoUrl', '');
    setLogoPreview(null);
  };

  const onSubmit = async (data: Step1FormData) => {
    try {
      setSubmitError(null);
      setError(null);
      await onNext(data);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Failed to save school profile';
      setSubmitError(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-8 backdrop-blur-xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">School Profile</h2>
              <p className="text-gray-400 mt-2">
                Let's start by setting up your school's basic information and branding.
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
            {/* School Logo Section */}
            <div className="border-t border-[rgba(255,255,255,0.07)] pt-8">
              <h3 className="text-lg font-semibold text-white mb-6">
                School Logo
              </h3>

              {logoPreview ? (
                // Logo Preview
                <div className="flex flex-col gap-4">
                  <div className="relative w-32 h-32 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] flex items-center justify-center overflow-hidden">
                    <img
                      src={logoPreview}
                      alt="School logo preview"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemoveLogo}
                    className="w-fit bg-transparent border-[rgba(255,255,255,0.2)] text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    Change Logo
                  </Button>
                </div>
              ) : (
                // Upload Button
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-[rgba(255,255,255,0.2)] rounded-lg cursor-pointer hover:border-[rgba(255,255,255,0.4)] transition-colors">
                    <Upload02 className="w-8 h-8 text-gray-400" strokeWidth={2} />
                    <div className="text-center">
                      <p className="text-gray-300 font-medium">Click to upload logo</p>
                      <p className="text-gray-500 text-sm">PNG, JPG or GIF (max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {uploadError && (
                    <div className="text-red-400 text-sm">{uploadError}</div>
                  )}
                  {uploading && (
                    <div className="text-gray-400 text-sm">Uploading...</div>
                  )}
                </div>
              )}
              <FormDescription className="text-gray-500 mt-4">
                Your school's logo will be displayed in the application
              </FormDescription>
            </div>

            {/* School Branding Section */}
            <div className="border-t border-[rgba(255,255,255,0.07)] pt-8">
              <h3 className="text-lg font-semibold text-white mb-6">
                Branding
              </h3>

              <FormField
                control={form.control}
                name="motto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">School Motto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Excellence in Education"
                        className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Your school's official motto or tagline
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Color Scheme Section */}
            <div className="border-t border-[rgba(255,255,255,0.07)] pt-8">
              <h3 className="text-lg font-semibold text-white mb-6">
                Color Scheme
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Primary Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="#1e40af"
                            className="flex-1 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
                            {...field}
                          />
                          <input
                            type="color"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-12 h-10 rounded border border-[rgba(255,255,255,0.1)] cursor-pointer"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Secondary Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="#0ea5e9"
                            className="flex-1 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
                            {...field}
                          />
                          <input
                            type="color"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-12 h-10 rounded border border-[rgba(255,255,255,0.1)] cursor-pointer"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accentColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Accent Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="#f59e0b"
                            className="flex-1 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
                            {...field}
                          />
                          <input
                            type="color"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-12 h-10 rounded border border-[rgba(255,255,255,0.1)] cursor-pointer"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="border-t border-[rgba(255,255,255,0.07)] pt-8">
              <h3 className="text-lg font-semibold text-white mb-6">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contactPersonName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Contact Person Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Dr. John Smith"
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
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Contact Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="altContactEmail"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel className="text-gray-300">Alternate Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@school.edu"
                        className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                {isLoading ? 'Saving...' : 'Next: Academic Session'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
