import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

interface Student {
  id: string;
  classId: string;
  className: string;
  name: string;
  admissionNumber: string;
  parentEmail?: string;
}

interface Step6Props {
  onNext: (data: any) => Promise<void>;
  onPrevious: () => void;
  initialData?: any;
  isLoading?: boolean;
  sessionTermData?: any;
}

export const Step6AssignStudents = ({
  onNext,
  onPrevious,
  initialData,
  isLoading = false,
  sessionTermData,
}: Step6Props) => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState<Student[]>(initialData?.students || []);
  
  // Form state for new student
  const [name, setName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [addingStudent, setAddingStudent] = useState(false);

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:5000/api/onboarding/classes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(response.data.data?.classes || []);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
        toast({
          title: 'Error',
          description: 'Failed to load classes',
          variant: 'destructive',
        });
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [toast]);

  // Restore students from database on mount or when initialData changes
  useEffect(() => {
    const restoreStudents = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
        
        // Fetch all students for this school
        const response = await axios.get(
          'http://localhost:5000/api/results-setup/students',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const allStudents = response.data.data?.students || [];
        setStudents(allStudents);
      } catch (error) {
        console.error('Failed to restore students:', error);
        // Fallback to initialData if restore fails
        if (initialData?.students) {
          setStudents(initialData.students);
        }
      }
    };

    restoreStudents();
  }, [initialData?.students]);

  // Filter students when selected class changes
  useEffect(() => {
    if (!selectedClass) {
      // Show all students if no class selected
      return;
    }

    // Students are pre-fetched, just keep the current state
  }, [selectedClass]);

  const handleAddStudent = async () => {
    if (!selectedClass || !name) {
      toast({
        title: 'Validation Error',
        description: 'Please select a class and enter student name',
        variant: 'destructive',
      });
      return;
    }

    try {
      setAddingStudent(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      
      const response = await axios.post(
        'http://localhost:5000/api/results-setup/students/add',
        {
          classId: selectedClass,
          name: name.trim(),
          parentEmail: parentEmail.trim() || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const newStudent = {
          ...response.data.data.student,
          className: classes.find(c => c.id === selectedClass)?.name,
        };
        
        setStudents([...students, newStudent]);
        setName('');
        setParentEmail('');

        toast({
          title: 'Success',
          description: `Student ${newStudent.name} added with admission number ${newStudent.admissionNumber}`,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to add student';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setAddingStudent(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      
      await axios.delete(
        `http://localhost:5000/api/results-setup/students/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStudents(students.filter(s => s.id !== studentId));
      toast({
        title: 'Success',
        description: 'Student removed',
      });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to remove student';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  // Filter students based on selected class
  const filteredStudents = selectedClass 
    ? students.filter(s => s.classId === selectedClass)
    : students;

  const handleSubmit = async () => {
    try {
      setSubmitError(null);
      if (students.length === 0) {
        setSubmitError('Please add at least one student');
        return;
      }

      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');

      const payload = {
        ...sessionTermData,
        students: students.map(s => s.id),
      };

      const response = await axios.post(
        'http://localhost:5000/api/results-setup/step/6',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast({
          title: 'Success',
          description: `${students.length} students added`,
        });
        await onNext(response.data.data);
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to add students';
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
          Add Students
        </h2>
        <p className="text-gray-400 text-sm">
          Add students to classes for this results session. Admission numbers are auto-generated.
        </p>
      </div>

      {submitError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Student Form */}
        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Add New Student</h3>

          <div>
            <label className="text-gray-300 text-sm block mb-2">Select Class *</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              disabled={loadingClasses}
              className="w-full px-4 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-white rounded-lg focus:outline-none focus:border-blue-400 appearance-none cursor-pointer"
              style={{ backgroundColor: '#1f2937', color: '#ffffff' }}
            >
              <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Select a class...</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id} style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-300 text-sm block mb-2">Student Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name (e.g., Ebere Mbilitam)"
              className="w-full px-4 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm block mb-2">Parent Email</label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="Enter parent email (optional)"
              className="w-full px-4 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            onClick={handleAddStudent}
            disabled={addingStudent || !selectedClass}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            {addingStudent ? 'Adding...' : 'Add Student'}
          </button>
        </div>

        {/* Students List */}
        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">
            {selectedClass ? 'Class Students' : 'All Students'} ({filteredStudents.length})
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredStudents.length === 0 ? (
              <p className="text-gray-500 text-sm">
                {selectedClass ? 'No students in this class' : 'No students added yet'}
              </p>
            ) : (
              filteredStudents.map(student => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      {student.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Admission: {student.admissionNumber}
                    </p>
                    {student.parentEmail && (
                      <p className="text-gray-500 text-xs">{student.parentEmail}</p>
                    )}
                    <p className="text-gray-600 text-xs">{student.className}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveStudent(student.id)}
                    className="text-red-400 hover:text-red-300 p-1 ml-2"
                    title="Remove student"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
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
          onClick={handleSubmit}
          disabled={isLoading || students.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Next: Upload Results'}
        </Button>
      </div>
    </div>
  );
};

export default Step6AssignStudents;
