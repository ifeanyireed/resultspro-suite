import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Send } from '@/lib/hugeicons-compat';
import { TrendingDown } from 'lucide-react';
import { axiosInstance as axios } from '@/lib/axiosConfig';

interface AtRiskStudent {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  overallAverage: number;
  attendance: number;
  riskScore: number;
  riskLevel: string;
  riskFactors: string[];
  failingSubjects: string[];
  position: number;
  classSize: number;
}

const TeacherAtRiskStudents: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState<AtRiskStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<AtRiskStudent | null>(null);
  const [messageModal, setMessageModal] = useState(false);

  const sessionId = (location.state as any)?.sessionId || '';

  useEffect(() => {
    fetchAtRiskStudents();
  }, [classId, sessionId]);

  const fetchAtRiskStudents = async () => {
    try {
      const response = await axios.get(
        `/teacher-analytics/class/${classId}/at-risk?sessionId=${sessionId}&termId=1`
      );
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch at-risk students:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'from-red-600 to-red-700';
      case 'HIGH':
        return 'from-orange-600 to-orange-700';
      case 'MEDIUM':
        return 'from-yellow-600 to-yellow-700';
      case 'LOW':
        return 'from-green-600 to-green-700';
      default:
        return 'from-slate-600 to-slate-700';
    }
  };

  const handleContactParent = (student: AtRiskStudent) => {
    setSelectedStudent(student);
    setMessageModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-400">Loading at-risk students...</p>
        </div>
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
          <h1 className="text-3xl font-bold mb-2">At-Risk Students</h1>
          <p className="text-slate-400">
            {students.length} student{students.length !== 1 ? 's' : ''} requiring intervention
          </p>
        </div>

        {/* Risk Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-red-600/20 border border-red-600 rounded-lg p-6">
            <p className="text-red-300 text-sm">Critical Risk</p>
            <p className="text-3xl font-bold mt-2">
              {students.filter((s) => s.riskLevel === 'CRITICAL').length}
            </p>
          </div>
          <div className="bg-orange-600/20 border border-orange-600 rounded-lg p-6">
            <p className="text-orange-300 text-sm">High Risk</p>
            <p className="text-3xl font-bold mt-2">
              {students.filter((s) => s.riskLevel === 'HIGH').length}
            </p>
          </div>
          <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-6">
            <p className="text-yellow-300 text-sm">Medium Risk</p>
            <p className="text-3xl font-bold mt-2">
              {students.filter((s) => s.riskLevel === 'MEDIUM').length}
            </p>
          </div>
          <div className="bg-green-600/20 border border-green-600 rounded-lg p-6">
            <p className="text-green-300 text-sm">Low Risk</p>
            <p className="text-3xl font-bold mt-2">
              {students.filter((s) => s.riskLevel === 'LOW').length}
            </p>
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-4">
          {students.length === 0 ? (
            <div className="text-center py-20">
              <AlertTriangle size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg">No at-risk students identified</p>
            </div>
          ) : (
            students.map((student) => (
              <div
                key={student.studentId}
                className={`bg-gradient-to-r ${getRiskColor(student.riskLevel)} rounded-lg p-6 shadow-lg`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Student Info */}
                  <div className="flex-1 mb-4 lg:mb-0">
                    <h3 className="text-xl font-bold mb-2">{student.studentName}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm opacity-80">Admission #</p>
                        <p className="font-semibold">{student.admissionNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-80">Overall Average</p>
                        <p className="font-semibold">{student.overallAverage.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-80">Attendance</p>
                        <p className="font-semibold">{student.attendance.toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-80">Risk Score</p>
                        <p className="font-semibold">{student.riskScore.toFixed(0)}</p>
                      </div>
                    </div>

                    {/* Risk Factors */}
                    {student.riskFactors.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-2">Risk Factors:</p>
                        <div className="flex flex-wrap gap-2">
                          {student.riskFactors.map((factor, idx) => (
                            <span
                              key={idx}
                              className="bg-black/30 px-3 py-1 rounded-full text-xs"
                            >
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Failing Subjects */}
                    {student.failingSubjects.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-2">Failing Subjects:</p>
                        <div className="flex flex-wrap gap-2">
                          {student.failingSubjects.map((subject, idx) => (
                            <span
                              key={idx}
                              className="bg-red-500/50 px-3 py-1 rounded text-xs"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/teacher/student/${student.studentId}`, {
                        state: { sessionId },
                      })}
                      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition text-sm font-semibold"
                    >
                      <TrendingDown size={16} />
                      View Profile
                    </button>
                    <button
                      onClick={() => handleContactParent(student)}
                      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition text-sm font-semibold"
                    >
                      <Send size={16} />
                      Message Parent
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Intervention Recommendations */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">📋 Intervention Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded">
              <p className="text-green-400 font-semibold mb-2">For Critical Risk Students</p>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Immediate parent-teacher meeting</li>
                <li>• Structured tutoring program</li>
                <li>• Weekly progress monitoring</li>
                <li>• Subject-specific support</li>
              </ul>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <p className="text-blue-400 font-semibold mb-2">For High/Medium Risk</p>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Enhanced classroom support</li>
                <li>• Peer mentoring programs</li>
                <li>• Formative assessment tracking</li>
                <li>• Bi-weekly progress reviews</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {messageModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              Message Parent for {selectedStudent.studentName}
            </h3>
            <textarea
              className="w-full bg-slate-700 text-white p-3 rounded-lg mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              defaultValue={`Dear Parent/Guardian of ${selectedStudent.studentName},\n\nI am writing to inform you that ${selectedStudent.studentName} requires academic intervention...`}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setMessageModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle sending message
                  setMessageModal(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAtRiskStudents;
