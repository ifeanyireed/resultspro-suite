import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { IconTrash2 as Trash2, IconPlus as Plus } from '@tabler/icons-react';

interface ExamComponent {
  id: string;
  name: string;
  score: number;
}

interface Step2Props {
  onNext: (data: any) => Promise<void>;
  onPrevious: () => void;
  initialData?: any;
  isLoading?: boolean;
  sessionTermData?: any;
}

const DEFAULT_COMPONENTS: ExamComponent[] = [
  { id: '1', name: 'Exam', score: 40 },
  { id: '2', name: 'CA 1', score: 10 },
  { id: '3', name: 'CA 2', score: 10 },
  { id: '4', name: 'Mid-Term', score: 20 },
  { id: '5', name: 'Project', score: 20 },
];

export const Step2ExamConfig = ({
  onNext,
  onPrevious,
  initialData,
  isLoading = false,
  sessionTermData,
}: Step2Props) => {
  const { toast } = useToast();
  
  // Parse initialData properly - handle both formats: { components: [...] } and { examConfigComponents: "..." }
  const getInitialComponents = () => {
    if (!initialData) return DEFAULT_COMPONENTS;
    
    if (initialData.components && Array.isArray(initialData.components)) {
      // Format: { components: [...] }
      return initialData.components.map((c: any, index: number) => ({
        id: c.id || `${Date.now()}-${index}`,
        name: c.name,
        score: c.score,
      }));
    }
    
    if (initialData.examConfigComponents) {
      // Format: { examConfigComponents: "..." } - JSON string from database
      try {
        const parsed = typeof initialData.examConfigComponents === 'string'
          ? JSON.parse(initialData.examConfigComponents)
          : initialData.examConfigComponents;
        return parsed.map((c: any, index: number) => ({
          id: c.id || `${Date.now()}-${index}`,
          name: c.name,
          score: c.score,
        }));
      } catch (e) {
        console.error('Failed to parse examConfigComponents:', e);
        return DEFAULT_COMPONENTS;
      }
    }
    
    return DEFAULT_COMPONENTS;
  };
  
  const [components, setComponents] = useState<ExamComponent[]>(getInitialComponents());
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Update components when initialData changes (e.g., on page refresh when data loads from DB)
  useEffect(() => {
    const updatedComponents = getInitialComponents();
    setComponents(updatedComponents);
    console.log('📝 Step 2 components loaded:', updatedComponents);
  }, [initialData]);

  const getTotalScore = () => components.reduce((sum, c) => sum + c.score, 0);

  const handleAddComponent = () => {
    const newComponent: ExamComponent = {
      id: Date.now().toString(),
      name: 'New Component',
      score: 0,
    };
    setComponents([...components, newComponent]);
  };

  const handleRemoveComponent = (id: string) => {
    if (components.length > 1) {
      setComponents(components.filter(c => c.id !== id));
    } else {
      toast({
        title: 'Error',
        description: 'You must have at least one component',
        variant: 'destructive',
      });
    }
  };

  const handleComponentChange = (id: string, field: 'name' | 'score', value: any) => {
    setComponents(components.map(c => 
      c.id === id 
        ? { ...c, [field]: field === 'score' ? Number(value) : value }
        : c
    ));
  };

  const onSubmit = async () => {
    try {
      setSubmitError(null);

      const totalScore = getTotalScore();
      if (totalScore !== 100) {
        setSubmitError(`Assessment components must sum to 100 (current: ${totalScore})`);
        return;
      }

      if (components.some(c => !c.name.trim() || c.score <= 0)) {
        setSubmitError('All components must have a name and score greater than 0');
        return;
      }

      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');

      const payload = {
        ...sessionTermData,
        examConfigComponents: components.map(({ id, ...rest }) => rest),
        totalExamScore: totalScore,
      };

      const response = await axios.post(
        'http://localhost:5000/api/results-setup/step/2',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Exam configuration saved',
        });
        // Pass components in the format initialData expects
        await onNext({
          ...response.data.data,
          components: components.map(({ id, ...rest }) => rest),
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to save exam configuration';
      setSubmitError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const totalScore = getTotalScore();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Exam Configuration
        </h2>
        <p className="text-gray-400 text-sm">
          Define assessment components and their weights (must total 100)
        </p>
      </div>

      {submitError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      {/* Total Score Indicator */}
      <div className={`pb-4 border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between`}>
        <div>
          <p className="text-gray-400 text-sm">Total Score</p>
          <p className="text-white font-semibold text-lg">{totalScore}/100</p>
        </div>
        <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
          totalScore === 100
            ? 'bg-green-500/10 border-2 border-green-500'
            : 'bg-yellow-500/10 border-2 border-yellow-500'
        }`}>
          <span className={`text-2xl font-bold ${
            totalScore === 100 ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {totalScore}%
          </span>
        </div>
      </div>

      {/* Assessment Components */}
      <div className="space-y-4">
        {components.map((component, index) => (
          <div key={component.id} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-gray-400 text-xs mb-1 block">Component Name</label>
              <Input
                value={component.name}
                onChange={(e) => handleComponentChange(component.id, 'name', e.target.value)}
                placeholder="e.g., CA 1, Project, Exam"
                className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
              />
            </div>
            <div className="w-24">
              <label className="text-gray-400 text-xs mb-1 block">Score</label>
              <Input
                type="number"
                value={component.score}
                onChange={(e) => handleComponentChange(component.id, 'score', e.target.value)}
                min="0"
                max="100"
                placeholder="0"
                className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveComponent(component.id)}
              disabled={components.length === 1}
              className="mb-0 p-2 text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Component Button */}
      <button
        type="button"
        onClick={handleAddComponent}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-gray-300 hover:bg-[rgba(255,255,255,0.1)] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Component
      </button>

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
          disabled={isLoading || totalScore !== 100}
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Next: Affective Domain'}
        </Button>
      </div>
    </div>
  );
};
