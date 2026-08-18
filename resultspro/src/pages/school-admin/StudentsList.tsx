import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Eye, Edit02, Archive } from '@/lib/hugeicons-compat';
import axiosInstance from '@/lib/axiosConfig';
import { useToast } from '@/hooks/use-toast';
import { InlineLoadingSpinner } from '@/components/LoadingSpinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  parentEmail: string | null;
  classId: string;
  className?: string;
  status: string;
  parent?: {
    id: string;
    user: {
      id: string;
      fullName: string;
      firstName: string;
      lastName: string;
      email: string;
    }
  } | null;
}

interface Class {
  id: string;
  name: string;
  level: string;
}

const StudentsList: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    name: '',
    parentName: '',
    parentEmail: '',
    classId: '',
  });
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  // Parent Edit Modal State
  const [isEditParentModalOpen, setIsEditParentModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<any>(null);
  const [parentFormData, setParentFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [isSavingParent, setIsSavingParent] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch classes first to map class names
      const classesRes = await axiosInstance.get('/onboarding/classes');
      const classesData = classesRes.data.data?.classes || 
                         (Array.isArray(classesRes.data.data) ? classesRes.data.data : []);
      setClasses(classesData);

      // Fetch students with status filter
      const studentsRes = await axiosInstance.get('/results-setup/students', {
        params: { status: statusFilter }
      });
      
      const studentData = studentsRes.data.data?.students || 
                         (Array.isArray(studentsRes.data.data) ? studentsRes.data.data : []);
        
      setStudents(studentData);
    } catch (err: any) {
      console.error('Failed to fetch students data:', err);
      const errMsg = err.response?.data?.error || 'Failed to load students';
      setError(errMsg);
      toast({
        title: 'Error',
        description: errMsg,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [toast, statusFilter]);

  const handleAddStudent = async () => {
    if (!newStudentData.name || !newStudentData.parentName || !newStudentData.parentEmail || !newStudentData.classId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsAddingStudent(true);
      const response = await axiosInstance.post('/results-setup/students/add', newStudentData);

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Student added successfully',
        });
        setIsAddModalOpen(false);
        setNewStudentData({ name: '', parentName: '', parentEmail: '', classId: '' });
        fetchData();
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to add student',
        variant: 'destructive',
      });
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleArchiveStudent = async (studentId: string) => {
    if (!window.confirm('Are you sure you want to archive this student? This action cannot be undone and the student will still count towards your plan limit.')) {
      return;
    }

    try {
      await axiosInstance.patch(`/results-setup/students/${studentId}/archive`);
      toast({
        title: 'Success',
        description: 'Student archived successfully',
      });
      fetchData();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to archive student',
        variant: 'destructive',
      });
    }
  };

  const handleEditParent = (student: Student) => {
    if (!student.parent) {
      toast({
        title: 'No Parent Linked',
        description: 'This student does not have a linked parent account yet.',
        variant: 'destructive',
      });
      return;
    }

    setEditingParent(student.parent);
    setParentFormData({
      firstName: student.parent.user.firstName || student.parent.user.fullName?.split(' ')[0] || '',
      lastName: student.parent.user.lastName || student.parent.user.fullName?.split(' ').slice(1).join(' ') || '',
      email: student.parent.user.email,
      phoneNumber: (student.parent as any).phoneNumber || '',
    });
    setIsEditParentModalOpen(true);
  };

  const handleSaveParent = async () => {
    try {
      setIsSavingParent(true);
      await axiosInstance.patch(`/school/parents/${editingParent.id}`, parentFormData);

      toast({
        title: 'Success',
        description: 'Parent information updated successfully',
      });
      
      setIsEditParentModalOpen(false);
      fetchData(); // Refresh list
    } catch (err: any) {
      console.error('Failed to update parent:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to update parent information',
        variant: 'destructive',
      });
    } finally {
      setIsSavingParent(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <InlineLoadingSpinner size={40} />
        <p className="text-gray-400 mt-4">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Students Management</h2>
          <p className="text-gray-400 text-sm mt-1">View and manage all students</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-400 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
          />
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
        >
          <option value="all">All Classes</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
        >
          <option value="ACTIVE">Active Students</option>
          <option value="ARCHIVED">Archived Students</option>
          <option value="ALL">All Students</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5 bg-white/2.5">
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Admission No.</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Name</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Parent Name</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Parent Email</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Class</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                <th className="text-right py-4 px-6 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-6 text-white font-medium">{row.admissionNumber}</td>
                    <td className="py-4 px-6 text-white">{row.name}</td>
                    <td className="py-4 px-6 text-white">
                      {row.parent?.user.fullName || (row.parent?.user.firstName ? `${row.parent.user.firstName} ${row.parent.user.lastName}` : 'N/A')}
                    </td>
                    <td className="py-4 px-6 text-gray-400">{row.parentEmail || row.parent?.user.email || 'N/A'}</td>
                    <td className="py-4 px-6 text-gray-400">
                      {row.className || classes.find(c => c.id === row.classId)?.name || 'Unknown'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        row.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="View Profile">
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1a1f2e] border-white/10 text-white">
                            <DropdownMenuItem 
                              className="focus:bg-white/5 cursor-pointer flex items-center gap-2"
                              onClick={() => handleEditParent(row)}
                            >
                              <Edit02 className="w-4 h-4 text-blue-400" />
                              <span>Edit Parent</span>
                            </DropdownMenuItem>
                            {row.status === 'ACTIVE' && (
                              <DropdownMenuItem 
                                className="focus:bg-white/5 cursor-pointer flex items-center gap-2 text-amber-400 focus:text-amber-400"
                                onClick={() => handleArchiveStudent(row.id)}
                              >
                                <Archive className="w-4 h-4" />
                                <span>Archive Student</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    {searchTerm || selectedClass !== 'all' ? 'No students match your search' : 'No students found. Click "Add Student" to add a student.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-[#1a1f2e] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="classId">Select Class *</Label>
              <select
                id="classId"
                value={newStudentData.classId}
                onChange={(e) => setNewStudentData({ ...newStudentData, classId: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
                style={{ backgroundColor: '#1a1f2e' }}
              >
                <option value="">Select a class...</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Student Name *</Label>
              <Input
                id="name"
                value={newStudentData.name}
                onChange={(e) => setNewStudentData({ ...newStudentData, name: e.target.value })}
                placeholder="Enter student name"
                className="bg-white/5 border-white/10 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent Name *</Label>
              <Input
                id="parentName"
                value={newStudentData.parentName}
                onChange={(e) => setNewStudentData({ ...newStudentData, parentName: e.target.value })}
                placeholder="Enter parent's name"
                className="bg-white/5 border-white/10 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentEmail">Parent Email *</Label>
              <Input
                id="parentEmail"
                type="email"
                value={newStudentData.parentEmail}
                onChange={(e) => setNewStudentData({ ...newStudentData, parentEmail: e.target.value })}
                placeholder="Enter parent's email"
                className="bg-white/5 border-white/10 focus:border-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              className="bg-transparent border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddStudent}
              disabled={isAddingStudent}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAddingStudent ? 'Adding...' : 'Add Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Parent Modal */}
      <Dialog open={isEditParentModalOpen} onOpenChange={setIsEditParentModalOpen}>
        <DialogContent className="bg-[#1a1f2e] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Parent Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={parentFormData.firstName}
                  onChange={(e) => setParentFormData({ ...parentFormData, firstName: e.target.value })}
                  className="bg-white/5 border-white/10 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={parentFormData.lastName}
                  onChange={(e) => setParentFormData({ ...parentFormData, lastName: e.target.value })}
                  className="bg-white/5 border-white/10 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={parentFormData.email}
                onChange={(e) => setParentFormData({ ...parentFormData, email: e.target.value })}
                className="bg-white/5 border-white/10 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={parentFormData.phoneNumber}
                onChange={(e) => setParentFormData({ ...parentFormData, phoneNumber: e.target.value })}
                className="bg-white/5 border-white/10 focus:border-blue-500"
                placeholder="+234..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditParentModalOpen(false)}
              className="bg-transparent border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveParent}
              disabled={isSavingParent}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSavingParent ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Total Students</p>
          <p className="text-3xl font-bold text-white">{students.length}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Active</p>
          <p className="text-3xl font-bold text-green-400">
            {students.filter(s => s.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Archived</p>
          <p className="text-3xl font-bold text-amber-400">
            {students.filter(s => s.status === 'ARCHIVED').length}
          </p>
        </div>
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Plan Limit</p>
          <p className="text-3xl font-bold text-purple-400">Check Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default StudentsList;
