import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Check } from 'lucide-react';

const PSYCHOMOTOR_SKILLS = [
  'Handling of Tools',
  'Drawing/Painting',
  'Handwriting',
  'Public Speaking',
  'Speech Fluency',
  'Sports and Games',
];

interface Step4Props {
  onNext: (data: any) => Promise<void>;
  onPrevious: () => void;
  initialData?: any;
  isLoading?: boolean;
  sessionTermData?: any;
}

export const Step4PsychomotorDomain = ({
  onNext,
  onPrevious,
  initialData,
  isLoading = false,
  sessionTermData,
}: Step4Props) => {
  const { toast } = useToast();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    initialData?.skills || []
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Update selected skills when initialData changes (e.g., on page refresh when data loads from DB)
  useEffect(() => {
    if (initialData?.skills && initialData.skills.length > 0) {
      setSelectedSkills(initialData.skills);
    }
  }, [initialData?.skills]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const onSubmit = async () => {
    try {
      setSubmitError(null);

      if (selectedSkills.length === 0) {
        setSubmitError('Please select at least one psychomotor skill');
        return;
      }

      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');

      const payload = {
        ...sessionTermData,
        psychomotorSkills: selectedSkills,
      };

      const response = await axios.post(
        'http://localhost:5000/api/results-setup/step/4',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Psychomotor domain skills selected',
        });
        await onNext(response.data.data);
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to save psychomotor domain';
      setSubmitError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Psychomotor Domain
        </h2>
        <p className="text-gray-400 text-sm">
          Select the psychomotor skills you want to include in the gradebook (1-5 rating scale)
        </p>
      </div>

      {submitError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      {/* Skills Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PSYCHOMOTOR_SKILLS.map(skill => (
          <button
            key={skill}
            type="button"
            onClick={() => toggleSkill(skill)}
            className={`p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
              selectedSkills.includes(skill)
                ? 'border-green-500 bg-green-500/10'
                : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.2)]'
            }`}
          >
            <span className={selectedSkills.includes(skill) ? 'text-green-300 font-medium' : 'text-gray-300'}>
              {skill}
            </span>
            {selectedSkills.includes(skill) && (
              <Check className="w-5 h-5 text-green-400" />
            )}
          </button>
        ))}
      </div>

      {/* Selection Summary */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4">
        <p className="text-gray-400 text-sm">
          {selectedSkills.length === 0 ? (
            'No skills selected'
          ) : (
            <>
              Selected: <span className="text-green-400 font-medium">{selectedSkills.length}</span> of{' '}
              <span className="text-gray-300">{PSYCHOMOTOR_SKILLS.length}</span> skills
            </>
          )}
        </p>
        {selectedSkills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedSkills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
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
          onClick={onSubmit}
          disabled={isLoading || selectedSkills.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Next: Staff Uploads'}
        </Button>
      </div>
    </div>
  );
};
