import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Check } from 'lucide-react';

const AFFECTIVE_TRAITS = [
  'Attentiveness',
  'Honesty',
  'Neatness',
  'Politeness',
  'Punctuality/Assembly',
  'Self Control/Calmness',
  'Obedience',
  'Reliability',
  'Sense of Responsibility',
  'Relationship with Others',
];

interface Step3Props {
  onNext: (data: any) => Promise<void>;
  onPrevious: () => void;
  initialData?: any;
  isLoading?: boolean;
  sessionTermData?: any;
}

export const Step3AffectiveDomain = ({
  onNext,
  onPrevious,
  initialData,
  isLoading = false,
  sessionTermData,
}: Step3Props) => {
  const { toast } = useToast();
  const [selectedTraits, setSelectedTraits] = useState<string[]>(
    initialData?.traits || []
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Update selected traits when initialData changes (e.g., on page refresh when data loads from DB)
  useEffect(() => {
    if (initialData?.traits && initialData.traits.length > 0) {
      setSelectedTraits(initialData.traits);
    }
  }, [initialData?.traits]);

  const toggleTrait = (trait: string) => {
    setSelectedTraits(prev =>
      prev.includes(trait)
        ? prev.filter(t => t !== trait)
        : [...prev, trait]
    );
  };

  const onSubmit = async () => {
    try {
      setSubmitError(null);

      if (selectedTraits.length === 0) {
        setSubmitError('Please select at least one affective trait');
        return;
      }

      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');

      const payload = {
        ...sessionTermData,
        affectiveTraits: selectedTraits,
      };

      const response = await axios.post(
        'http://localhost:5000/api/results-setup/step/3',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Affective domain traits selected',
        });
        await onNext(response.data.data);
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to save affective domain';
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
          Affective Domain
        </h2>
        <p className="text-gray-400 text-sm">
          Select the affective traits you want to include in the gradebook (1-5 rating scale)
        </p>
      </div>

      {submitError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      {/* Trait Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AFFECTIVE_TRAITS.map(trait => (
          <button
            key={trait}
            type="button"
            onClick={() => toggleTrait(trait)}
            className={`p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
              selectedTraits.includes(trait)
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.2)]'
            }`}
          >
            <span className={selectedTraits.includes(trait) ? 'text-blue-300 font-medium' : 'text-gray-300'}>
              {trait}
            </span>
            {selectedTraits.includes(trait) && (
              <Check className="w-5 h-5 text-blue-400" />
            )}
          </button>
        ))}
      </div>

      {/* Selection Summary */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4">
        <p className="text-gray-400 text-sm">
          {selectedTraits.length === 0 ? (
            'No traits selected'
          ) : (
            <>
              Selected: <span className="text-blue-400 font-medium">{selectedTraits.length}</span> of{' '}
              <span className="text-gray-300">{AFFECTIVE_TRAITS.length}</span> traits
            </>
          )}
        </p>
        {selectedTraits.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedTraits.map(trait => (
              <span
                key={trait}
                className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs rounded-full"
              >
                {trait}
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
          disabled={isLoading || selectedTraits.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Next: Psychomotor Domain'}
        </Button>
      </div>
    </div>
  );
};
