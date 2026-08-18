import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const step1Schema = z.object({
  sessionId: z.string().min(1, 'Please select a session'),
  termId: z.string().min(1, 'Please select a term'),
  instanceName: z.string().min(3, 'Instance name must be at least 3 characters'),
});

type Step1FormData = z.infer<typeof step1Schema>;

interface Step1Props {
  onNext: (data: any) => Promise<void>;
  onPrevious: () => void;
  initialData?: any;
  isLoading?: boolean;
  isEditMode?: boolean;
}

export const Step1SelectSessionTerm = ({
  onNext,
  onPrevious,
  initialData,
  isLoading = false,
  isEditMode = false,
}: Step1Props) => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: initialData || {
      sessionId: '',
      termId: '',
      instanceName: '',
    },
  });

  // Fetch sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
        const schoolId = localStorage.getItem('schoolId');
        
        if (!schoolId) {
          throw new Error('School ID not found');
        }

        const response = await axios.get(
          `http://localhost:5000/api/onboarding/school/${schoolId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const academicSessions = response.data.data?.academicSessions || [];
        setSessions(academicSessions);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load sessions',
          variant: 'destructive',
        });
      } finally {
        setLoadingSessions(false);
      }
    };
    fetchSessions();
  }, [toast]);

  // Restore form when sessions are loaded
  useEffect(() => {
    if (initialData?.sessionId && sessions.length > 0 && !loadingSessions) {
      const selectedSession = sessions.find(s => s.id === initialData.sessionId);
      if (selectedSession?.terms) {
        setTerms(selectedSession.terms);
      }
      
      form.reset({
        sessionId: initialData.sessionId,
        termId: initialData.termId,
        instanceName: initialData.instanceName || '',
      });
    }
  }, [initialData, sessions, loadingSessions, form]);

  const selectedSessionId = form.watch('sessionId');
  const selectedTermId = form.watch('termId');

  // Auto-generate instance name when session/term changes
  useEffect(() => {
    if (isEditMode) return; // Don't auto-generate in edit mode

    if (selectedSessionId && selectedTermId && sessions.length > 0) {
      const session = sessions.find(s => s.id === selectedSessionId);
      const term = terms.find(t => t.id === selectedTermId);
      
      if (session && term) {
        const generatedName = `${session.name} - ${term.name} Results`;
        if (!form.getValues('instanceName')) {
          form.setValue('instanceName', generatedName);
        }
      }
    }
  }, [selectedSessionId, selectedTermId, sessions, terms, form, isEditMode]);

  // Update terms when session changes
  useEffect(() => {
    if (selectedSessionId && sessions.length > 0) {
      const selectedSession = sessions.find(s => s.id === selectedSessionId);
      if (selectedSession?.terms) {
        setTerms(selectedSession.terms);
      }
    }
  }, [selectedSessionId, sessions]);

  const onSubmit = async (data: Step1FormData) => {
    try {
      setSubmitError(null);
      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      
      const selectedSession = sessions.find(s => s.id === data.sessionId);
      const selectedTerm = terms.find(t => t.id === data.termId);

      const payload = {
        sessionId: data.sessionId,
        termId: data.termId,
        sessionName: selectedSession?.name,
        termName: selectedTerm?.name,
        startDate: selectedTerm?.startDate,
        endDate: selectedTerm?.endDate,
        instanceName: data.instanceName,
      };

      // If in edit mode, we don't necessarily need to save to setup session, 
      // but we can to keep them in sync or just pass data forward
      if (!isEditMode) {
        await axios.post(
          'http://localhost:5000/api/results-setup/step/1',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast({
        title: 'Success',
        description: 'Session and term configured successfully',
      });
      await onNext(payload);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to save session configuration';
      setSubmitError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isEditMode ? 'Instance Details' : 'Select Session & Term'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isEditMode 
              ? 'Review the instance details. Session and term cannot be changed for an existing instance.' 
              : "Choose the academic session and term for which you're setting up results"}
          </p>
        </div>

        {submitError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{submitError}</p>
          </div>
        )}

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="instanceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Instance Name *</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    placeholder="e.g. 2024/2025 - First Term Results"
                    className="w-full px-4 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-white rounded-lg focus:outline-none focus:border-blue-400"
                  />
                </FormControl>
                <FormDescription className="text-gray-500 text-xs">
                  A unique name to identify this results setup
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="sessionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Academic Session *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={loadingSessions || isEditMode}
                      className="w-full px-4 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-white rounded-lg focus:outline-none focus:border-blue-400 disabled:opacity-50 appearance-none"
                    >
                      <option value="" style={{ backgroundColor: '#1f2937' }}>Select a session...</option>
                      {sessions.map((session) => (
                        <option key={session.id} value={session.id} style={{ backgroundColor: '#1f2937' }}>
                          {session.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Term *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={!selectedSessionId || terms.length === 0 || isEditMode}
                      className="w-full px-4 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-white rounded-lg focus:outline-none focus:border-blue-400 disabled:opacity-50 appearance-none"
                    >
                      <option value="" style={{ backgroundColor: '#1f2937' }}>Select a term...</option>
                      {terms.map((term) => (
                        <option key={term.id} value={term.id} style={{ backgroundColor: '#1f2937' }}>
                          {term.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? 'Saving...' : 'Next: Exam Config'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
