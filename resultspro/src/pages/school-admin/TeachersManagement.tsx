import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Trash01,
  Shield,
  Eye,
  Edit02,
  AlertCircle,
  Upload,
} from '@/lib/hugeicons-compat';
import { teacherAPI } from '@/lib/api-user-management';
import { Teacher } from '@/types/user-management';
import axiosInstance from '@/lib/axiosConfig';
import { InlineLoadingSpinner, LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const TeachersManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Load teachers and classes
  useEffect(() => {
    loadTeachers();
  }, [page, searchTerm, filterStatus]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get('/onboarding/classes');
      setClasses(response.data.data?.classes || []);
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const schoolId = localStorage.getItem('schoolId') || '';
      const response = await teacherAPI.listTeachers(schoolId, page, 20, {
        search: searchTerm,
        status: filterStatus !== 'ALL' ? filterStatus : undefined,
      });

      const teachersData = Array.isArray(response) ? response : (response.data || []);
      setTeachers(teachersData as Teacher[]);
      const pages = Array.isArray(response) ? 1 : (response.pagination?.pages || 1);
      setTotalPages(pages);
    } catch (error) {
      console.error('Failed to load teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setShowTeacherModal(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowTeacherModal(true);
  };

  const handleSaveTeacher = async (data: any) => {
    try {
      if (selectedTeacher) {
        await teacherAPI.updateTeacher(selectedTeacher.id, data);
      } else {
        await teacherAPI.createTeacher(data);
      }
      setShowTeacherModal(false);
      loadTeachers();
    } catch (error: any) {
      console.error('Failed to save teacher:', error);
      alert(error.response?.data?.error || 'Failed to save teacher. Please try again.');
    }
  };

  const handleToggleStatus = async (teacherId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await teacherAPI.toggleTeacherStatus(teacherId, newStatus as any);
      loadTeachers();
    } catch (error) {
      console.error('Failed to update teacher status:', error);
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      try {
        await teacherAPI.deleteTeacher(teacherId);
        loadTeachers();
      } catch (error) {
        console.error('Failed to delete teacher:', error);
      }
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ((teacher as any).fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (teacher.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (teacher.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-white">Teachers Management</h1>
          <p className="text-gray-400">Manage teachers, class assignments, and signatures</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddTeacher}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Total Teachers</p>
          <p className="text-3xl font-bold text-white">{teachers.length}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Active</p>
          <p className="text-3xl font-bold text-green-400">
            {teachers.filter((t) => t.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Assigned Classes</p>
          <p className="text-3xl font-bold text-blue-400">
            {teachers.filter((t) => t.classId).length}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search teachers by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-12 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
          style={{ backgroundColor: '#1a1f2e' }}
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {/* Teachers Table */}
      <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)] bg-white/5">
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Teacher Name</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Email</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Assigned Class</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm text-center">Signature</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Status</th>
                <th className="text-right py-4 px-6 text-gray-400 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    <LoadingSpinner size="sm" />
                  </td>
                </tr>
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No teachers found
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5">
                    <td className="py-4 px-6 text-white font-medium">
                      {(teacher as any).fullName || `${teacher.firstName} ${teacher.lastName || ''}`}
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-sm">{teacher.email}</td>
                    <td className="py-4 px-6 text-gray-300">
                      {(teacher as any).assignedClass?.name || 'Unassigned'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {(teacher as any).signatureUrl ? (
                        <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded">Uploaded</span>
                      ) : (
                        <span className="text-gray-500 text-xs bg-white/5 px-2 py-1 rounded">None</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          teacher.status === 'ACTIVE'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {teacher.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditTeacher(teacher)}
                          title="Edit Teacher"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit02 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowPermissionModal(true);
                          }}
                          title="Manage Permissions"
                          className="text-purple-400 hover:text-purple-300"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(teacher.id, teacher.status)}
                          title={teacher.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          className={teacher.status === 'ACTIVE' ? 'text-yellow-400' : 'text-green-400'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash01 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-4 py-2 rounded-lg ${
                page === p
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Teacher Add/Edit Modal */}
      {showTeacherModal && (
        <TeacherModal
          teacher={selectedTeacher}
          classes={classes}
          onClose={() => {
            setShowTeacherModal(false);
            setSelectedTeacher(null);
          }}
          onSave={handleSaveTeacher}
        />
      )}

      {/* Permission Management Modal */}
      {showPermissionModal && selectedTeacher && (
        <TeacherPermissionModal
          teacher={selectedTeacher}
          onClose={() => {
            setShowPermissionModal(false);
            setSelectedTeacher(null);
          }}
          onSave={() => {
            setShowPermissionModal(false);
            loadTeachers();
          }}
        />
      )}
    </div>
  );
};

interface TeacherModalProps {
  teacher: Teacher | null;
  classes: any[];
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

const TeacherModal: React.FC<TeacherModalProps> = ({ teacher, classes, onClose, onSave }) => {
  const [firstName, setFirstName] = useState(teacher?.firstName || '');
  const [lastName, setLastName] = useState(teacher?.lastName || '');
  const [email, setEmail] = useState(teacher?.email || '');
  const [classId, setClassId] = useState(teacher?.classId || '');
  const [signatureUrl, setSignatureUrl] = useState((teacher as any)?.signatureUrl || '');
  const [signatureS3Key, setSignatureS3Key] = useState((teacher as any)?.signatureS3Key || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!email || !firstName) {
      alert('Email and First Name are required');
      return;
    }

    setSaving(true);
    try {
      await onSave({ firstName, lastName, email, classId, signatureUrl, signatureS3Key });
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signatureType', 'teacher');
      formData.append('classId', classId);

      const response = await axiosInstance.post(
        '/results-setup/upload-signature',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        setSignatureUrl(response.data.s3Url);
        setSignatureS3Key(response.data.s3Key);
        toast({
          title: 'Success',
          description: 'Signature uploaded',
        });
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Upload failed',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1f2e] rounded-[20px] p-8 max-w-md w-full border border-white/10 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-white mb-6">
          {teacher ? 'Edit Teacher' : 'Add New Teacher'}
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 placeholder:text-gray-600"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 placeholder:text-gray-600"
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!teacher}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 disabled:opacity-50 placeholder:text-gray-600"
              placeholder="teacher@school.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Assign to Class</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
              style={{ backgroundColor: '#1a1f2e' }}
            >
              <option value="">No Class Assigned</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-white/5">
            <label className="block text-sm font-medium text-gray-300 mb-2">Digital Signature</label>
            {signatureUrl ? (
              <div className="space-y-3">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-center h-24">
                  <img src={signatureUrl} alt="Teacher signature" className="h-full object-contain brightness-0 invert" />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs" 
                  disabled={uploading}
                  onClick={() => {
                    if (!classId) {
                      toast({
                        title: 'Class Required',
                        description: 'Please select a class before uploading a signature',
                        variant: 'destructive',
                      });
                      return;
                    }
                    document.getElementById('teacher-sig-input')?.click();
                  }}
                >
                  {uploading ? <InlineLoadingSpinner size="sm" /> : "Change Signature"}
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full h-24 border-2 border-dashed border-white/10 hover:border-blue-500/50"
                disabled={uploading}
                onClick={() => {
                  if (!classId) {
                    toast({
                      title: 'Class Required',
                      description: 'Please select a class before uploading a signature',
                      variant: 'destructive',
                    });
                    return;
                  }
                  document.getElementById('teacher-sig-input')?.click();
                }}
              >
                {uploading ? <LoadingSpinner size="sm" /> : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-6 h-6 mb-2 text-gray-400" />
                    <span className="text-xs">Upload Signature</span>
                  </div>
                )}
              </Button>
            )}
            <input 
              id="teacher-sig-input" 
              type="file" 
              accept="image/*" 
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} 
              hidden 
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : (teacher ? 'Save Changes' : 'Add Teacher')}
          </button>
        </div>
      </div>
    </div>
  );
};

interface TeacherPermissionModalProps {
  teacher: Teacher;
  onClose: () => void;
  onSave: () => void;
}

const TeacherPermissionModal: React.FC<TeacherPermissionModalProps> = ({
  teacher,
  onClose,
  onSave,
}) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const allPermissions = [
    { id: 'ENTER_RESULTS', label: 'Enter Student Results' },
    { id: 'VIEW_RESULTS', label: 'View Results' },
    { id: 'MANAGE_CLASS', label: 'Manage Class Info' },
    { id: 'UPLOAD_GRADES', label: 'Upload Bulk Grades' },
    { id: 'VIEW_ANALYTICS', label: 'View Analytics' },
    { id: 'EDIT_PROFILE', label: 'Edit Profile' },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await teacherAPI.updatePermissions(teacher.id, permissions);
      onSave();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1f2e] rounded-[20px] p-8 max-w-md w-full border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Teacher Permissions</h2>
        <p className="text-gray-400 mb-6">{teacher.email}</p>

        <div className="space-y-3 mb-6">
          {allPermissions.map((perm) => (
            <label
              key={perm.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={permissions.includes(perm.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPermissions([...permissions, perm.id]);
                  } else {
                    setPermissions(permissions.filter((p) => p !== perm.id));
                  }
                }}
                className="w-4 h-4"
              />
              <span className="text-gray-300">{perm.label}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeachersManagement;
