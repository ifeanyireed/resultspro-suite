"use client";

import { IconBookOpen as BookOpen, IconPlus as Plus, IconSearch as Search, IconUsers as Users, IconClock as Clock, IconChevronRight as ChevronRight, IconFilter as Filter, IconX as X } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getSchoolClasses, createSchoolClass, CreateClassData, getSchoolTeachers } from '@/lib/school.api';

interface Class {
  id: string;
  name: string;
  teacher: { fullName: string };
  students: any[]; // Replace with actual student type
  schedule: string; // This might be a complex object later
  status: 'Active' | 'Draft';
}

interface Teacher {
  id: string;
  fullName: string;
}

export default function SchoolClasses() {
  const [activeTab, setActiveTab] = useState('All');
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newClassName, setNewClassName] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [classesData, teachersData] = await Promise.all([
        getSchoolClasses(),
        getSchoolTeachers()
      ]);
      setClasses(classesData.map(enrichClassData));
      setTeachers(teachersData.filter((t: any) => t.role === 'TUTOR'));
    } catch (err: any) {
      const msg = err.error || "Failed to fetch initial data.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const enrichClassData = (cls: any): Class => ({
    id: cls.id,
    name: cls.name,
    teacher: cls.teacher || { fullName: 'Not Assigned' },
    students: cls.students || [],
    schedule: 'Not Set', // Placeholder
    status: cls.status || 'Draft',
  });

  const handleCreateClass = async () => {
    if (!newClassName || !selectedTeacherId) {
      toast.error("Class name and teacher are required.");
      return;
    }
    setIsCreating(true);
    const classData: CreateClassData = {
      name: newClassName,
      teacher_id: selectedTeacherId
    };

    try {
      const newClass = await createSchoolClass(classData);
      setClasses(prev => [...prev, enrichClassData(newClass)]);
      toast.success(`Class "${newClassName}" created!`);
      setIsModalOpen(false);
      setNewClassName('');
      setSelectedTeacherId('');
    } catch (err: any) {
      const msg = err.error || "Failed to create class.";
      toast.error(msg);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Class Management</h1>
            <p className="text-gray-400">Organize students into classes and assign teachers.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-purple text-white font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all text-sm">
            <Plus className="w-5 h-5" /> Create New Class
          </button>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p className="text-gray-500">Loading classes...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            classes.map((cls) => (
              <div key={cls.id} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-purple/30 hover:bg-purple/[0.02] transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center text-purple">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    cls.status === 'Active' ? 'bg-green/10 text-green' : 'bg-white/5 text-gray-500'
                  }`}>
                    {cls.status}
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-purple transition-colors">{cls.name}</h3>
                <p className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                  Teacher: <span className="text-white font-medium">{cls.teacher.fullName}</span>
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Users className="w-4 h-4 text-purple" />
                    <span>{cls.students.length} Students Enrolled</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Clock className="w-4 h-4 text-purple" />
                    <span>{cls.schedule}</span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Create New Card */}
          <button onClick={() => setIsModalOpen(true)} className="p-8 rounded-[40px] border-2 border-dashed border-white/5 hover:border-purple/30 hover:bg-purple/[0.02] transition-all group flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-purple/10 group-hover:text-purple transition-all mb-4">
              <Plus className="w-8 h-8" />
            </div>
            <div className="text-lg font-bold text-white mb-1">Add New Class</div>
            <div className="text-sm text-gray-500">Scale your school's curriculum</div>
          </button>
        </div>
      </div>

       {/* Create Class Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="max-w-md w-full bg-navy border border-white/10 rounded-[40px] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-display text-white">Create a New Class</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Class Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Grade 10 Algebra"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-purple/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Assign Teacher</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-purple/50 appearance-none transition-all"
                >
                  <option value="" disabled>Select a teacher...</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.fullName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                Cancel
              </button>
              <button 
                onClick={handleCreateClass}
                disabled={isCreating}
                className="flex-[2] py-4 rounded-2xl bg-purple text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all disabled:bg-purple/50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating Class...' : 'Create Class'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
