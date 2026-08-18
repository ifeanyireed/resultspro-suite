import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BarChart01, Mail, Phone } from '@/lib/hugeicons-compat';
import { TrendingUp } from 'lucide-react';
import { axiosInstance as axios } from '@/lib/axiosConfig';
import { useToast } from '@/hooks/use-toast';

interface StudentDetailData {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  parentContact: string;
  parentId: string;
  parentUserId: string;
  overallAverage: number;
  position: number;
  classSize: number;
  classAverage: number;
  attendance: {
    daysPresent: number;
    daysSchoolOpen: number;
    percentage: string;
  };
  subjects: Array<{
    name: string;
    score: number;
    grade: string;
    ca1: number;
    ca2: number;
    exam: number;
    project: number;
    classAverage: number;
  }>;
  affectiveDomain: Record<string, number>;
  psychomotorDomain: Record<string, number>;
}

const TeacherStudentDetail: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [data, setData] = useState<StudentDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [contacting, setContacting] = useState(false);

  const sessionId = (location.state as any)?.sessionId || '';

  useEffect(() => {
    fetchStudentDetail();
  }, [studentId, sessionId]);

  const fetchStudentDetail = async () => {
    try {
      const response = await axios.get(
        `/teacher-analytics/student/${studentId}?sessionId=${sessionId}&termId=1`
      );
      setData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch student detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactParent = async () => {
    if (!data?.parentUserId) {
      toast({
        title: "Contact info missing",
        description: "This parent has not yet activated their account.",
        variant: "destructive"
      });
      return;
    }

    try {
      setContacting(true);
      // Initialize a conversation or just navigate to messages with intent
      // For now, let's just go to messages. If we wanted to create an actual message first:
      /*
      await axios.post('/messages/send', {
        recipientId: data.parentUserId,
        studentId: data.studentId,
        body: "Hello, I'd like to discuss your child's progress.",
        subject: `Regarding ${data.studentName}`
      });
      */
      navigate('/teacher/messages');
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not initiate conversation.",
        variant: "destructive"
      });
    } finally {
      setContacting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-400">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <p className="text-slate-400">Failed to load student data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-400 hover:text-blue-300 mb-4"
          >
            ← Back
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{data.studentName}</h1>
              <p className="text-slate-400">
                Admission #: {data.admissionNumber} • {data.className}
              </p>
            </div>
            <button
              onClick={handleContactParent}
              disabled={contacting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              <Mail size={16} />
              {contacting ? 'Connecting...' : 'Contact Parent'}
            </button>
          </div>
        </div>

        {/* Overall Performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-lg">
            <p className="text-blue-100 text-sm">Overall Average</p>
            <p className="text-4xl font-bold mt-2">{data.overallAverage.toFixed(1)}</p>
            <p className="text-blue-100 text-xs mt-2">Class Avg: {data.classAverage.toFixed(1)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-lg">
            <p className="text-green-100 text-sm">Class Position</p>
            <p className="text-4xl font-bold mt-2">
              #{data.position}
            </p>
            <p className="text-green-100 text-xs mt-2">Out of {data.classSize}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 rounded-lg">
            <p className="text-orange-100 text-sm">Attendance</p>
            <p className="text-4xl font-bold mt-2">{data.attendance.percentage}%</p>
            <p className="text-orange-100 text-xs mt-2">
              {data.attendance.daysPresent}/{data.attendance.daysSchoolOpen} days
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-lg">
            <p className="text-purple-100 text-sm">Parent Contact</p>
            <p className="text-lg font-bold mt-2 truncate">{data.parentContact || 'Not available'}</p>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart01 size={20} />
            Subject Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-3 text-slate-400">Subject</th>
                  <th className="text-center p-3 text-slate-400">CA1</th>
                  <th className="text-center p-3 text-slate-400">CA2</th>
                  <th className="text-center p-3 text-slate-400">Project</th>
                  <th className="text-center p-3 text-slate-400">Exam</th>
                  <th className="text-center p-3 text-slate-400">Total</th>
                  <th className="text-center p-3 text-slate-400">Grade</th>
                  <th className="text-center p-3 text-slate-400">Class Avg</th>
                </tr>
              </thead>
              <tbody>
                {data.subjects.map((subject) => (
                  <tr key={subject.name} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="p-3 font-medium">{subject.name}</td>
                    <td className="text-center p-3">{subject.ca1.toFixed(1)}</td>
                    <td className="text-center p-3">{subject.ca2.toFixed(1)}</td>
                    <td className="text-center p-3">{subject.project.toFixed(1)}</td>
                    <td className="text-center p-3">{subject.exam.toFixed(1)}</td>
                    <td className="text-center p-3 font-bold">{subject.score.toFixed(1)}</td>
                    <td className="text-center p-3 font-bold">
                      <span
                        className={
                          subject.grade === 'A'
                            ? 'text-green-400'
                            : subject.grade === 'B'
                              ? 'text-blue-400'
                              : subject.grade === 'C'
                                ? 'text-yellow-400'
                                : 'text-red-400'
                        }
                      >
                        {subject.grade}
                      </span>
                    </td>
                    <td className="text-center p-3 text-slate-400">
                      {subject.classAverage.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Affective and Psychomotor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Affective Traits</h3>
            <div className="space-y-3">
              {Object.entries(data.affectiveDomain).map(([trait, value]: any) => (
                <div key={trait}>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm capitalize">{trait}</p>
                    <p className="text-sm font-semibold">{value}/5</p>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
                      style={{ width: `${(value / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Psychomotor Skills</h3>
            <div className="space-y-3">
              {Object.entries(data.psychomotorDomain).map(([skill, value]: any) => (
                <div key={skill}>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm capitalize">{skill}</p>
                    <p className="text-sm font-semibold">{value}/5</p>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                      style={{ width: `${(value / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes/Recommendations Section */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">📝 Teacher Notes</h3>
          <textarea
            className="w-full bg-slate-700 text-white p-3 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add notes about this student's progress, behavior, or recommendations..."
          />
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition font-semibold">
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherStudentDetail;
