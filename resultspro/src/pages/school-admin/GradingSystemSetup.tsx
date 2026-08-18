import React, { useState, useEffect } from 'react';
import { Plus, Edit02, Trash01, AlertCircle, Settings } from '@/lib/hugeicons-compat';
import axiosInstance from '@/lib/axiosConfig';
import GradingSystemModal from './components/GradingSystemModal';
import { useToast } from '@/components/ui/use-toast';

interface Grade {
  id: string;
  gradeName: string;
  minScore: number;
  maxScore: number;
  description: string;
}

const GradingSystemSetup: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [systemName, setSystemName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGradingSystem();
  }, []);

  const fetchGradingSystem = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/onboarding/grading-system');
      
      if (response.data.success && response.data.data.gradingSystem) {
        setGrades(response.data.data.grades);
        setSystemName(response.data.data.gradingSystem.name);
      } else {
        // Fallback or default
        setSystemName('Standard Grading');
        setGrades([
          { id: '1', gradeName: 'A', minScore: 80, maxScore: 100, description: 'Excellent' },
          { id: '2', gradeName: 'B', minScore: 70, maxScore: 79, description: 'Very Good' },
          { id: '3', gradeName: 'C', minScore: 60, maxScore: 69, description: 'Good' },
          { id: '4', gradeName: 'D', minScore: 50, maxScore: 59, description: 'Credit' },
          { id: '5', gradeName: 'E', minScore: 40, maxScore: 49, description: 'Pass' },
          { id: '6', gradeName: 'F', minScore: 0, maxScore: 39, description: 'Fail' },
        ]);
      }
    } catch (err: any) {
      console.error('Error fetching grading system:', err);
      setError('Failed to load grading system. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post('/onboarding/step/5', data);
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Grading system updated successfully',
        });
        setIsModalOpen(false);
        await fetchGradingSystem();
      }
    } catch (err: any) {
      console.error('Error saving grading system:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to save grading system',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGradeColor = (grade: string) => {
    const g = grade.toUpperCase();
    if (g.startsWith('A')) return 'bg-green-400';
    if (g.startsWith('B')) return 'bg-blue-400';
    if (g.startsWith('C')) return 'bg-cyan-400';
    if (g.startsWith('D')) return 'bg-amber-400';
    if (g.startsWith('E')) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Grading System Setup</h2>
          <p className="text-gray-400 text-sm mt-1">
            {loading ? 'Loading system...' : `Currently using: ${systemName}`}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-400 font-medium transition-colors"
        >
          <Settings className="w-4 h-4" />
          Configure System
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Grade Boundaries Table */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5 bg-white/2.5">
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Grade</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Min Score</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Max Score</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Remark</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Color</th>
                <th className="text-right py-4 px-6 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      <span>Loading grading boundaries...</span>
                    </div>
                  </td>
                </tr>
              ) : grades.length > 0 ? (
                grades.map((row, i) => (
                  <tr key={row.id || i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-white/10 text-white">
                        {row.gradeName}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white">{row.minScore}%</td>
                    <td className="py-4 px-6 text-white">{row.maxScore}%</td>
                    <td className="py-4 px-6 text-gray-400">{row.description || 'N/A'}</td>
                    <td className="py-4 px-6">
                      <div className={`w-8 h-8 rounded-full ${getGradeColor(row.gradeName)} opacity-30 border ${getGradeColor(row.gradeName)}`} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => setIsModalOpen(true)} className="text-blue-400 hover:text-blue-300"><Edit02 className="w-4 h-4" /></button>
                        <button className="text-red-400 hover:text-red-300 opacity-50 cursor-not-allowed"><Trash01 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 italic">
                    No grade boundaries found. Please setup your grading system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Details */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 transition-all hover:bg-white/[0.04]">
            <h3 className="text-lg font-semibold text-white mb-6">Grading Scale Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5">
                <span className="text-gray-400">Percentage Scale</span>
                <input type="radio" name="scale" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 opacity-50">
                <span className="text-gray-400">Point Scale (Coming Soon)</span>
                <input type="radio" name="scale" disabled className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 opacity-50">
                <span className="text-gray-400">4.0 GPA Scale (Coming Soon)</span>
                <input type="radio" name="scale" disabled className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 transition-all hover:bg-white/[0.04]">
            <h3 className="text-lg font-semibold text-white mb-6">Passing Grade</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-2">Minimum Passing Grade</p>
                <div className="flex items-center gap-3">
                  <select disabled className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white opacity-50 cursor-not-allowed">
                    <option>C (60%)</option>
                    <option>D (50%)</option>
                    <option>E (40%)</option>
                  </select>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Distinction Grade</p>
                <div className="flex items-center gap-3">
                  <select disabled className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white opacity-50 cursor-not-allowed">
                    <option>A (80%)</option>
                    <option>B (70%)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      <GradingSystemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={{ gradingSystem: { name: systemName }, grades }}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default GradingSystemSetup;
