'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
  IdentificationIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';

export interface TutorAssignmentRecord {
  id: string;
  tenant_id: string;
  subject_id: string;
  subject_code: string;
  subject_title: string;
  department: string;
  arm_id: string;
  arm_name: string;
  teacher_id: string;
  teacher_name: string;
  role: string;
  weekly_periods: number;
  created_at?: string;
}

export interface TutorProfileRecord {
  staff_id: string;
  staff_number: string;
  title: string;
  full_name: string;
  display_name: string;
  gender: string;
  email: string;
  phone: string;
  cadre: string;
  designation: string;
  department: string;
  qualification: string;
  trcn_number: string;
  assigned_arm_id: string;
  assigned_arm_name: string;
  is_form_teacher: boolean;
  status: string;
  assignments: TutorAssignmentRecord[];
  subjects_taught: string[];
  classes_taught: string[];
  total_weekly_periods: number;
  workload_status: 'Optimal Load' | 'Full Capacity' | 'Overloaded' | 'Under-Allocated' | 'Unassigned' | string;
  attendance_rate: number;
}

export interface TutorSummaryMetrics {
  total_tutors: number;
  assigned_count: number;
  unassigned_count: number;
  form_teachers_count: number;
  avg_weekly_periods: number;
  overloaded_count: number;
  total_subjects_count: number;
  unassigned_subjects_count: number;
}

interface AvailableStaff {
  id: string;
  name: string;
  full_name: string;
  designation: string;
  department: string;
}

interface AvailableSubject {
  id: string;
  code: string;
  title: string;
  department: string;
  periods_per_week: number;
}

interface AvailableArm {
  id: string;
  name: string;
  arm_code: string;
  class_name: string;
  room_number: string;
  form_teacher_name?: string;
}

interface TutorAssignmentManagerProps {
  onTutorsCountChange?: (count: number) => void;
}

// Fallback initial data in case of initial offline boot
const FALLBACK_TUTORS: TutorProfileRecord[] = [
  {
    staff_id: 'stf-1',
    staff_number: 'STF-2026-001',
    title: 'Engr.',
    full_name: 'David Adeleke',
    display_name: 'Engr. David Adeleke',
    gender: 'MALE',
    email: 'd.adeleke@scholars.ng',
    phone: '+234 803 442 1190',
    cadre: 'TEACHING',
    designation: 'HOD Sciences & Further Mathematics Lead',
    department: 'Sciences & Mathematics',
    qualification: 'B.Sc (Ed) Mathematics, COREN Registered',
    trcn_number: 'TRCN/LA/88219/2021',
    assigned_arm_id: 'arm-ss3-sci',
    assigned_arm_name: 'SS 3 Science A',
    is_form_teacher: true,
    status: 'ACTIVE',
    assignments: [
      { id: 'asgn-1', tenant_id: '', subject_id: 's-mth', subject_code: 'MTH-201', subject_title: 'General Mathematics', department: 'Sciences & Mathematics', arm_id: 'arm-1', arm_name: 'SS 1 Science', teacher_id: 'stf-1', teacher_name: 'David Adeleke', role: 'Lead Educator', weekly_periods: 5 },
      { id: 'asgn-2', tenant_id: '', subject_id: 's-mth', subject_code: 'MTH-201', subject_title: 'General Mathematics', department: 'Sciences & Mathematics', arm_id: 'arm-2', arm_name: 'SS 2 Science', teacher_id: 'stf-1', teacher_name: 'David Adeleke', role: 'Lead Educator', weekly_periods: 5 },
      { id: 'asgn-3', tenant_id: '', subject_id: 's-fmth', subject_code: 'FMT-202', subject_title: 'Further Mathematics', department: 'Sciences & Mathematics', arm_id: 'arm-3', arm_name: 'SS 3 Science (WAEC)', teacher_id: 'stf-1', teacher_name: 'David Adeleke', role: 'HOD / Lead', weekly_periods: 6 },
    ],
    subjects_taught: ['General Mathematics', 'Further Mathematics'],
    classes_taught: ['SS 1 Science', 'SS 2 Science', 'SS 3 Science (WAEC)'],
    total_weekly_periods: 16,
    workload_status: 'Optimal Load',
    attendance_rate: 98.4,
  },
  {
    staff_id: 'stf-2',
    staff_number: 'STF-2026-003',
    title: 'Dr.',
    full_name: 'Samuel Eze',
    display_name: 'Dr. Samuel Eze',
    gender: 'MALE',
    email: 's.eze@scholars.ng',
    phone: '+234 809 332 1092',
    cadre: 'TEACHING',
    designation: 'Senior Physics Master & Lab Director',
    department: 'Sciences & Mathematics',
    qualification: 'Ph.D Physics Education, TRCN Fellow',
    trcn_number: 'TRCN/AB/19082/2018',
    assigned_arm_id: 'arm-ss1-sci',
    assigned_arm_name: 'SS 1 Science',
    is_form_teacher: true,
    status: 'ACTIVE',
    assignments: [
      { id: 'asgn-4', tenant_id: '', subject_id: 's-phy', subject_code: 'PHY-204', subject_title: 'Physics & Lab Practicals', department: 'Sciences & Mathematics', arm_id: 'arm-1', arm_name: 'SS 1 Science', teacher_id: 'stf-2', teacher_name: 'Samuel Eze', role: 'Subject Specialist', weekly_periods: 6 },
      { id: 'asgn-5', tenant_id: '', subject_id: 's-phy', subject_code: 'PHY-204', subject_title: 'Physics & Lab Practicals', department: 'Sciences & Mathematics', arm_id: 'arm-2', arm_name: 'SS 2 Science', teacher_id: 'stf-2', teacher_name: 'Samuel Eze', role: 'Subject Specialist', weekly_periods: 6 },
      { id: 'asgn-6', tenant_id: '', subject_id: 's-phy', subject_code: 'PHY-204', subject_title: 'Physics & Lab Practicals', department: 'Sciences & Mathematics', arm_id: 'arm-3', arm_name: 'SS 3 Science (WAEC)', teacher_id: 'stf-2', teacher_name: 'Samuel Eze', role: 'Subject Specialist', weekly_periods: 8 },
    ],
    subjects_taught: ['Physics & Lab Practicals'],
    classes_taught: ['SS 1 Science', 'SS 2 Science', 'SS 3 Science (WAEC)'],
    total_weekly_periods: 20,
    workload_status: 'Optimal Load',
    attendance_rate: 99.1,
  },
  {
    staff_id: 'stf-3',
    staff_number: 'STF-2026-002',
    title: 'Mrs.',
    full_name: 'Funke Adebayo',
    display_name: 'Mrs. Funke Adebayo',
    gender: 'FEMALE',
    email: 'f.adebayo@scholars.ng',
    phone: '+234 802 884 9912',
    cadre: 'TEACHING',
    designation: 'Lead English Educator & Diction Specialist',
    department: 'Arts & Humanities',
    qualification: 'B.A. (Ed) English Language, M.Ed Literature',
    trcn_number: 'TRCN/EN/44012/2019',
    assigned_arm_id: 'arm-jss1-gld',
    assigned_arm_name: 'JSS 1 Gold',
    is_form_teacher: true,
    status: 'ACTIVE',
    assignments: [
      { id: 'asgn-7', tenant_id: '', subject_id: 's-eng', subject_code: 'ENG-101', subject_title: 'English Language & Diction', department: 'Arts & Humanities', arm_id: 'arm-4', arm_name: 'JSS 1 Gold', teacher_id: 'stf-3', teacher_name: 'Funke Adebayo', role: 'Lead Educator', weekly_periods: 8 },
      { id: 'asgn-8', tenant_id: '', subject_id: 's-eng', subject_code: 'ENG-101', subject_title: 'English Language & Diction', department: 'Arts & Humanities', arm_id: 'arm-5', arm_name: 'JSS 1 Diamond', teacher_id: 'stf-3', teacher_name: 'Funke Adebayo', role: 'Lead Educator', weekly_periods: 8 },
      { id: 'asgn-9', tenant_id: '', subject_id: 's-eng', subject_code: 'ENG-101', subject_title: 'English Language & Diction', department: 'Arts & Humanities', arm_id: 'arm-6', arm_name: 'JSS 2 Gold', teacher_id: 'stf-3', teacher_name: 'Funke Adebayo', role: 'Lead Educator', weekly_periods: 8 },
    ],
    subjects_taught: ['English Language & Diction'],
    classes_taught: ['JSS 1 Gold', 'JSS 1 Diamond', 'JSS 2 Gold'],
    total_weekly_periods: 24,
    workload_status: 'Full Capacity',
    attendance_rate: 97.5,
  },
  {
    staff_id: 'stf-4',
    staff_number: 'STF-2026-005',
    title: 'Mr.',
    full_name: 'Emeka Okafor',
    display_name: 'Mr. Emeka Okafor',
    gender: 'MALE',
    email: 'e.okafor@scholars.ng',
    phone: '+234 812 778 9012',
    cadre: 'TEACHING',
    designation: 'STEM Robotics & Coding Mentor',
    department: 'Commercial & ICT',
    qualification: 'B.Eng Mechanical, PGDE',
    trcn_number: 'TRCN/LA/66014/2022',
    assigned_arm_id: 'arm-jss3-emd',
    assigned_arm_name: 'JSS 3 Emerald',
    is_form_teacher: true,
    status: 'ACTIVE',
    assignments: [
      { id: 'asgn-10', tenant_id: '', subject_id: 's-ict', subject_code: 'DPR-208', subject_title: 'Data Processing & AI', department: 'Commercial & ICT', arm_id: 'arm-1', arm_name: 'SS 1 Science', teacher_id: 'stf-4', teacher_name: 'Emeka Okafor', role: 'Subject Specialist', weekly_periods: 4 },
      { id: 'asgn-11', tenant_id: '', subject_id: 's-puz', subject_code: 'COD-101', subject_title: 'PuzzlePRO Coding Lab', department: 'Commercial & ICT', arm_id: 'arm-4', arm_name: 'JSS 1 Gold', teacher_id: 'stf-4', teacher_name: 'Emeka Okafor', role: 'Lab Instructor', weekly_periods: 4 },
      { id: 'asgn-12', tenant_id: '', subject_id: 's-puz', subject_code: 'COD-101', subject_title: 'PuzzlePRO Coding Lab', department: 'Commercial & ICT', arm_id: 'arm-6', arm_name: 'JSS 2 Gold', teacher_id: 'stf-4', teacher_name: 'Emeka Okafor', role: 'Lab Instructor', weekly_periods: 4 },
      { id: 'asgn-13', tenant_id: '', subject_id: 's-puz', subject_code: 'COD-101', subject_title: 'PuzzlePRO Coding Lab', department: 'Commercial & ICT', arm_id: 'arm-7', arm_name: 'JSS 3 Emerald', teacher_id: 'stf-4', teacher_name: 'Emeka Okafor', role: 'Lab Instructor', weekly_periods: 6 },
    ],
    subjects_taught: ['Data Processing & AI', 'PuzzlePRO Coding Lab'],
    classes_taught: ['SS 1 Science', 'JSS 1 Gold', 'JSS 2 Gold', 'JSS 3 Emerald'],
    total_weekly_periods: 18,
    workload_status: 'Optimal Load',
    attendance_rate: 96.0,
  },
  {
    staff_id: 'stf-5',
    staff_number: 'STF-2026-004',
    title: 'Ms.',
    full_name: 'Zainab Lawal',
    display_name: 'Ms. Zainab Lawal',
    gender: 'FEMALE',
    email: 'z.lawal@scholars.ng',
    phone: '+234 818 550 4421',
    cadre: 'TEACHING',
    designation: 'Biology & Integrated Science Master',
    department: 'Sciences & Mathematics',
    qualification: 'B.Sc (Ed) Biology, TRCN Certified',
    trcn_number: 'TRCN/OG/77103/2017',
    assigned_arm_id: 'arm-jss2-gld',
    assigned_arm_name: 'JSS 2 Gold',
    is_form_teacher: true,
    status: 'ACTIVE',
    assignments: [
      { id: 'asgn-14', tenant_id: '', subject_id: 's-bio', subject_code: 'BIO-205', subject_title: 'Biology & Environmental Science', department: 'Sciences & Mathematics', arm_id: 'arm-1', arm_name: 'SS 1 Science', teacher_id: 'stf-5', teacher_name: 'Zainab Lawal', role: 'Subject Specialist', weekly_periods: 6 },
      { id: 'asgn-15', tenant_id: '', subject_id: 's-bio', subject_code: 'BIO-205', subject_title: 'Biology & Environmental Science', department: 'Sciences & Mathematics', arm_id: 'arm-2', arm_name: 'SS 2 Science', teacher_id: 'stf-5', teacher_name: 'Zainab Lawal', role: 'Subject Specialist', weekly_periods: 6 },
      { id: 'asgn-16', tenant_id: '', subject_id: 's-bsci', subject_code: 'BSC-103', subject_title: 'Basic Science & Technology', department: 'Sciences & Mathematics', arm_id: 'arm-7', arm_name: 'JSS 3 Emerald', teacher_id: 'stf-5', teacher_name: 'Zainab Lawal', role: 'Subject Specialist', weekly_periods: 5 },
    ],
    subjects_taught: ['Biology & Environmental Science', 'Basic Science & Technology'],
    classes_taught: ['SS 1 Science', 'SS 2 Science', 'JSS 3 Emerald'],
    total_weekly_periods: 17,
    workload_status: 'Optimal Load',
    attendance_rate: 98.8,
  },
  {
    staff_id: 'stf-6',
    staff_number: 'STF-2026-007',
    title: 'Mrs.',
    full_name: 'Ngozi Obi',
    display_name: 'Mrs. Ngozi Obi',
    gender: 'FEMALE',
    email: 'n.obi@scholars.ng',
    phone: '+234 803 998 1284',
    cadre: 'TEACHING',
    designation: 'Commercial Studies Lead & Economics Tutor',
    department: 'Commercial & ICT',
    qualification: 'B.Sc Accounting, PGDE',
    trcn_number: 'TRCN/AN/33109/2021',
    assigned_arm_id: 'arm-ss2-com',
    assigned_arm_name: 'SS 2 Commercial',
    is_form_teacher: true,
    status: 'ACTIVE',
    assignments: [
      { id: 'asgn-17', tenant_id: '', subject_id: 's-eco', subject_code: 'ECO-209', subject_title: 'Economics', department: 'Commercial & ICT', arm_id: 'arm-8', arm_name: 'SS 1 Commercial', teacher_id: 'stf-6', teacher_name: 'Ngozi Obi', role: 'Lead Educator', weekly_periods: 6 },
      { id: 'asgn-18', tenant_id: '', subject_id: 's-eco', subject_code: 'ECO-209', subject_title: 'Economics', department: 'Commercial & ICT', arm_id: 'arm-9', arm_name: 'SS 2 Commercial', teacher_id: 'stf-6', teacher_name: 'Ngozi Obi', role: 'Lead Educator', weekly_periods: 6 },
      { id: 'asgn-19', tenant_id: '', subject_id: 's-acc', subject_code: 'ACC-210', subject_title: 'Financial Accounting', department: 'Commercial & ICT', arm_id: 'arm-10', arm_name: 'SS 3 Commercial', teacher_id: 'stf-6', teacher_name: 'Ngozi Obi', role: 'Subject Specialist', weekly_periods: 7 },
    ],
    subjects_taught: ['Economics', 'Financial Accounting'],
    classes_taught: ['SS 1 Commercial', 'SS 2 Commercial', 'SS 3 Commercial'],
    total_weekly_periods: 19,
    workload_status: 'Optimal Load',
    attendance_rate: 97.0,
  },
];

export default function TutorAssignmentManager({ onTutorsCountChange }: TutorAssignmentManagerProps) {
  const [tutors, setTutors] = useState<TutorProfileRecord[]>(FALLBACK_TUTORS);
  const [metrics, setMetrics] = useState<TutorSummaryMetrics>({
    total_tutors: 12,
    assigned_count: 6,
    unassigned_count: 6,
    form_teachers_count: 6,
    avg_weekly_periods: 19.0,
    overloaded_count: 0,
    total_subjects_count: 28,
    unassigned_subjects_count: 4,
  });

  const [availableStaff, setAvailableStaff] = useState<AvailableStaff[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<AvailableSubject[]>([]);
  const [availableArms, setAvailableArms] = useState<AvailableArm[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [workloadFilter, setWorkloadFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'tutors' | 'classes'>('tutors');

  const [bannerNotice, setBannerNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState<TutorAssignmentRecord | null>(null);

  // Form State for New Assignment
  const [assignForm, setAssignForm] = useState({
    staff_id: '',
    teacher_name: '',
    subject_id: '',
    arm_ids: [] as string[],
    role: 'Subject Specialist',
    weekly_periods: 4,
    is_form_teacher: false,
    form_arm_id: '',
  });

  // Form State for Editing an Assignment
  const [editForm, setEditForm] = useState({
    assignment_id: '',
    weekly_periods: 4,
    role: 'Subject Specialist',
    arm_id: '',
    arm_name: '',
  });

  const showNotification = (type: 'success' | 'error', text: string) => {
    setBannerNotice({ type, text });
    setTimeout(() => {
      setBannerNotice(null);
    }, 4500);
  };

  // Fetch live tutors & allocation metrics
  const fetchTutorsData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (departmentFilter !== 'ALL') params.set('department', departmentFilter);
      if (workloadFilter !== 'ALL') params.set('workload', workloadFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const res = await api.get(`/v1/campus/tutors${queryStr}`).catch(async () => {
        return await api.get(`/campus/tutors${queryStr}`);
      });

      if (res.data?.success) {
        if (Array.isArray(res.data.tutors)) {
          setTutors(res.data.tutors);
          if (onTutorsCountChange) {
            onTutorsCountChange(res.data.tutors.length);
          }
        }
        if (res.data.metrics) {
          setMetrics(res.data.metrics);
        }
        if (Array.isArray(res.data.available_staff)) {
          setAvailableStaff(res.data.available_staff);
        }
        if (Array.isArray(res.data.available_subjects)) {
          setAvailableSubjects(res.data.available_subjects);
        }
        if (Array.isArray(res.data.available_arms)) {
          setAvailableArms(res.data.available_arms);
        }
      }
    } catch (err: any) {
      console.warn('TutorAssignmentManager: fetch error, using cached records.', err?.message);
    } finally {
      setLoading(false);
    }
  }, [departmentFilter, workloadFilter, searchQuery, onTutorsCountChange]);

  useEffect(() => {
    fetchTutorsData();
  }, [fetchTutorsData]);

  // Handle Assign Tutor Submit
  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.subject_id) {
      showNotification('error', 'Please select a subject to assign.');
      return;
    }
    if (!assignForm.staff_id && !assignForm.teacher_name.trim()) {
      showNotification('error', 'Please select or enter an educator name.');
      return;
    }
    if (assignForm.arm_ids.length === 0) {
      showNotification('error', 'Please select at least one class arm.');
      return;
    }

    try {
      setSaving(true);
      await api.post('/v1/campus/tutors', assignForm).catch(async () => {
        return await api.post('/campus/tutors', assignForm);
      });

      showNotification('success', 'Tutor successfully allocated to class arm(s) and persisted in database.');
      setIsAssignModalOpen(false);
      setAssignForm({
        staff_id: '',
        teacher_name: '',
        subject_id: '',
        arm_ids: [],
        role: 'Subject Specialist',
        weekly_periods: 4,
        is_form_teacher: false,
        form_arm_id: '',
      });
      await fetchTutorsData();
    } catch (err: any) {
      showNotification('error', err?.response?.data?.error || 'Failed to allocate tutor.');
    } finally {
      setSaving(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (asgn: TutorAssignmentRecord) => {
    setAssignmentToEdit(asgn);
    setEditForm({
      assignment_id: asgn.id,
      weekly_periods: asgn.weekly_periods,
      role: asgn.role,
      arm_id: asgn.arm_id,
      arm_name: asgn.arm_name,
    });
    setIsEditModalOpen(true);
  };

  // Save Edit Allocation
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentToEdit) return;

    try {
      setSaving(true);
      await api.put('/v1/campus/tutors', editForm).catch(async () => {
        return await api.put('/campus/tutors', editForm);
      });

      showNotification('success', 'Teaching allocation updated successfully.');
      setIsEditModalOpen(false);
      await fetchTutorsData();
    } catch (err: any) {
      showNotification('error', 'Failed to update allocation.');
    } finally {
      setSaving(false);
    }
  };

  // Delete / Unassign Record
  const handleUnassign = async (assignmentId: string, tutorName: string, subjectName: string) => {
    if (!confirm(`Are you sure you want to unassign ${tutorName} from ${subjectName}?`)) {
      return;
    }

    try {
      setSaving(true);
      await api.delete(`/v1/campus/tutors?id=${assignmentId}`).catch(async () => {
        return await api.delete(`/campus/tutors?id=${assignmentId}`);
      });

      showNotification('success', `Unassigned from ${subjectName}.`);
      await fetchTutorsData();
    } catch (err: any) {
      showNotification('error', 'Failed to remove allocation.');
    } finally {
      setSaving(false);
    }
  };

  // Quick Open Modal with pre-selected staff member
  const handleQuickAssignForTutor = (tutor: TutorProfileRecord) => {
    setAssignForm({
      staff_id: tutor.staff_id,
      teacher_name: tutor.full_name,
      subject_id: availableSubjects[0]?.id || '',
      arm_ids: [],
      role: 'Subject Specialist',
      weekly_periods: 4,
      is_form_teacher: tutor.is_form_teacher,
      form_arm_id: tutor.assigned_arm_id,
    });
    setIsAssignModalOpen(true);
  };

  // Class Arm Centric Grouping
  const classArmsView = useMemo(() => {
    const map = new Map<string, { armName: string; formTeacher: string; subjects: { subjectTitle: string; teacherName: string; periods: number; role: string }[] }>();

    tutors.forEach((t) => {
      t.assignments.forEach((asgn) => {
        const key = asgn.arm_name || 'General Campus';
        if (!map.has(key)) {
          map.set(key, { armName: key, formTeacher: t.is_form_teacher && t.assigned_arm_name === key ? t.display_name : '—', subjects: [] });
        }
        map.get(key)!.subjects.push({
          subjectTitle: asgn.subject_title,
          teacherName: t.display_name,
          periods: asgn.weekly_periods,
          role: asgn.role,
        });
      });
    });

    return Array.from(map.values());
  }, [tutors]);

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {bannerNotice && (
        <div
          className={`px-4 py-3 rounded-2xl flex items-center justify-between text-sm font-semibold transition-all shadow-sm ${
            bannerNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {bannerNotice.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <ExclamationTriangleIcon className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{bannerNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerNotice(null)}
            className="text-gray-400 hover:text-gray-700 ml-4 p-1 rounded-full cursor-pointer"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Workload & Allocation Analytics Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Faculty */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Teaching Faculty</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#146ef5] flex items-center justify-center">
              <UserGroupIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">{metrics.total_tutors}</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>{metrics.assigned_count} Active Allocations</span>
              <span className="text-gray-300">·</span>
              <span className="text-amber-600">{metrics.unassigned_count} Unassigned</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Average Period Load */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Weekly Load</span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ClockIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {metrics.avg_weekly_periods.toFixed(1)} <span className="text-sm font-semibold text-gray-400">P/wk</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 font-medium flex items-center gap-1.5">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px]">Optimal Range</span>
              <span>18–24 Periods Norm</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Form Teachers */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Form Masters</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AcademicCapIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">{metrics.form_teachers_count}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">
              Pastoral care, attendance &amp; broadsheet sign-off
            </div>
          </div>
        </div>

        {/* Metric 4: Curriculum Subject Gaps */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject Coverage</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpenIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {metrics.total_subjects_count - metrics.unassigned_subjects_count} / {metrics.total_subjects_count}
            </div>
            <div className="text-xs font-medium mt-1">
              {metrics.unassigned_subjects_count > 0 ? (
                <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full text-[10px]">
                  {metrics.unassigned_subjects_count} Subjects Need Tutors
                </span>
              ) : (
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                  100% Subject Faculty Assigned
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Toolbar & Controls */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Assigned Tutors &amp; Subject Allocation
              </h2>
              <span className="text-xs font-bold bg-blue-50 text-[#146ef5] px-2.5 py-1 rounded-full">
                {tutors.length} Educators
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Map faculty and subject specialists to specific class arms and monitor weekly teaching workloads against institutional capacity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Switcher Toggle */}
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1 border border-gray-200/60">
              <button
                type="button"
                onClick={() => setViewMode('tutors')}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === 'tutors' ? 'bg-white text-[#146ef5] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                By Educator
              </button>
              <button
                type="button"
                onClick={() => setViewMode('classes')}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === 'classes' ? 'bg-white text-[#146ef5] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                By Class Arm
              </button>
            </div>

            {/* Refresh / Sync */}
            <button
              type="button"
              onClick={fetchTutorsData}
              disabled={loading}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              title="Refresh allocations"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Primary CTA: Assign Tutor */}
            <button
              type="button"
              onClick={() => {
                setAssignForm({
                  staff_id: availableStaff[0]?.id || '',
                  teacher_name: availableStaff[0]?.name || '',
                  subject_id: availableSubjects[0]?.id || '',
                  arm_ids: [],
                  role: 'Subject Specialist',
                  weekly_periods: 4,
                  is_form_teacher: false,
                  form_arm_id: '',
                });
                setIsAssignModalOpen(true);
              }}
              className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" />
              Assign Tutor to Class
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
          <div className="relative">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tutor by name, staff ID, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium pl-9 pr-3.5 py-2.5 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
            />
          </div>

          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full text-xs font-bold px-3.5 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5] cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              <option value="Sciences & Mathematics">Sciences &amp; Mathematics</option>
              <option value="Arts & Humanities">Arts &amp; Humanities</option>
              <option value="Commercial & ICT">Commercial &amp; ICT</option>
              <option value="Languages">Languages &amp; Diction</option>
              <option value="Vocational & Trade">Vocational &amp; Trade</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={workloadFilter}
              onChange={(e) => setWorkloadFilter(e.target.value)}
              className="w-full text-xs font-bold px-3.5 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5] cursor-pointer"
            >
              <option value="ALL">All Workload Statuses</option>
              <option value="Optimal Load">Optimal Load (16–23 Periods)</option>
              <option value="Full Capacity">Full Capacity (24–26 Periods)</option>
              <option value="Overloaded">Overloaded (&gt;26 Periods)</option>
              <option value="Under-Allocated">Under-Allocated (&lt;16 Periods)</option>
              <option value="Unassigned">Unassigned (0 Allocations)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Main Data Content: By Educator View */}
      {viewMode === 'tutors' && (
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Tutor / Educator</th>
                  <th className="px-6 py-4">Designation &amp; Dept</th>
                  <th className="px-6 py-4">Form Teacher Arm</th>
                  <th className="px-6 py-4">Subjects &amp; Class Arms Assigned</th>
                  <th className="px-6 py-4">Weekly Load</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {tutors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      <UserGroupIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No tutors match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  tutors.map((t) => (
                    <tr key={t.staff_id || t.full_name} className="hover:bg-gray-50/50 transition-colors">
                      {/* 1. Name & Staff Profile */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 text-sm">{t.display_name}</div>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                          {t.staff_number || 'STF-FACULTY'}
                          {t.trcn_number && (
                            <span className="text-gray-300"> · {t.trcn_number}</span>
                          )}
                        </div>
                        {t.qualification && (
                          <div className="text-[10px] text-gray-500 mt-1 line-clamp-1">{t.qualification}</div>
                        )}
                      </td>

                      {/* 2. Designation & Department */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{t.designation || 'Subject Educator'}</div>
                        <div className="text-[11px] text-[#146ef5] font-medium mt-0.5">{t.department || 'Academics'}</div>
                      </td>

                      {/* 3. Form Master Assignment */}
                      <td className="px-6 py-4">
                        {t.is_form_teacher && t.assigned_arm_name ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <SparklesIcon className="w-3.5 h-3.5 text-amber-600" />
                            {t.assigned_arm_name}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[11px]">Not Form Master</span>
                        )}
                      </td>

                      {/* 4. Assigned Subjects & Class Arms */}
                      <td className="px-6 py-4">
                        {t.assignments.length === 0 ? (
                          <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-[10px] font-bold">
                            Zero Subject Allocations
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 max-w-md">
                            {t.assignments.map((asgn) => (
                              <div
                                key={asgn.id}
                                className="group relative bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl px-2.5 py-1 flex items-center gap-2 text-[11px] transition-colors"
                              >
                                <span className="font-bold text-gray-800 group-hover:text-[#146ef5]">
                                  {asgn.subject_title}
                                </span>
                                {asgn.arm_name && (
                                  <span className="text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                    {asgn.arm_name}
                                  </span>
                                )}
                                <span className="font-bold text-[#146ef5]">{asgn.weekly_periods}p</span>

                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(asgn)}
                                  className="text-gray-400 hover:text-blue-600 p-0.5"
                                  title="Edit period load"
                                >
                                  <PencilSquareIcon className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUnassign(asgn.id, t.display_name, asgn.subject_title)}
                                  className="text-gray-400 hover:text-rose-600 p-0.5"
                                  title="Unassign"
                                >
                                  <TrashIcon className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* 5. Weekly Period Load & Status */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-gray-900">{t.total_weekly_periods}</span>
                          <span className="text-[10px] text-gray-400 uppercase font-semibold">Periods / wk</span>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              t.workload_status === 'Optimal Load'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : t.workload_status === 'Full Capacity'
                                ? 'bg-blue-50 text-[#146ef5] border border-blue-200'
                                : t.workload_status === 'Overloaded'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {t.workload_status}
                          </span>
                        </div>
                      </td>

                      {/* 6. Quick Action Button */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleQuickAssignForTutor(t)}
                          className="text-xs font-bold text-[#146ef5] hover:text-[#105bd1] hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                          Allocate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Main Data Content: By Class Arm View */}
      {viewMode === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classArmsView.map((armGroup) => (
            <div key={armGroup.armName} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-base font-extrabold text-gray-900">{armGroup.armName}</h3>
                  <span className="text-[10px] font-bold bg-blue-50 text-[#146ef5] px-2.5 py-1 rounded-full">
                    {armGroup.subjects.length} Subjects Taught
                  </span>
                </div>

                <div className="mt-3 text-xs space-y-1">
                  <div className="text-gray-500 font-medium flex items-center justify-between">
                    <span>Form Master:</span>
                    <span className="font-bold text-gray-800">{armGroup.formTeacher}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Subject Teachers:</div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {armGroup.subjects.map((s, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-2.5 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-gray-900">{s.subjectTitle}</div>
                          <div className="text-[10px] text-gray-500">{s.teacherName}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#146ef5] text-xs">{s.periods}p/wk</div>
                          <div className="text-[9px] text-gray-400">{s.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. MODAL: Assign Tutor to Class Arm & Subject */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Assign Tutor to Class &amp; Subject</h3>
                <p className="text-xs text-gray-500">Maps teaching faculty to specific academic class arms.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              {/* Select Educator */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Teaching Faculty *</label>
                <select
                  value={assignForm.staff_id}
                  onChange={(e) => {
                    const stf = availableStaff.find((s) => s.id === e.target.value);
                    setAssignForm({
                      ...assignForm,
                      staff_id: e.target.value,
                      teacher_name: stf?.name || '',
                    });
                  }}
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5] bg-white cursor-pointer"
                >
                  <option value="">-- Choose Educator from Staff Directory --</option>
                  {availableStaff.map((stf) => (
                    <option key={stf.id} value={stf.id}>
                      {stf.name} ({stf.designation} · {stf.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Or manual educator name */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Educator Name (Display)</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Samuel Eze"
                  value={assignForm.teacher_name}
                  onChange={(e) => setAssignForm({ ...assignForm, teacher_name: e.target.value })}
                  required
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              {/* Select Subject */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Subject to Teach *</label>
                <select
                  value={assignForm.subject_id}
                  onChange={(e) => {
                    const subj = availableSubjects.find((s) => s.id === e.target.value);
                    setAssignForm({
                      ...assignForm,
                      subject_id: e.target.value,
                      weekly_periods: subj?.periods_per_week || 4,
                    });
                  }}
                  required
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5] bg-white cursor-pointer"
                >
                  <option value="">-- Select Curriculum Subject --</option>
                  {availableSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} · {s.title} ({s.department}) - {s.periods_per_week}p/wk
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Target Class Arms */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Target Class Arms * <span className="text-gray-400 font-normal">(select one or more)</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 rounded-xl border border-gray-200 bg-gray-50/50">
                  {availableArms.map((arm) => {
                    const isChecked = assignForm.arm_ids.includes(arm.id);
                    return (
                      <label
                        key={arm.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                          isChecked ? 'bg-blue-50 border-[#146ef5] text-[#146ef5] font-bold' : 'bg-white border-gray-200 text-gray-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignForm({ ...assignForm, arm_ids: [...assignForm.arm_ids, arm.id] });
                            } else {
                              setAssignForm({ ...assignForm, arm_ids: assignForm.arm_ids.filter((id) => id !== arm.id) });
                            }
                          }}
                          className="rounded text-[#146ef5] focus:ring-[#146ef5]"
                        />
                        <span className="truncate">{arm.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Role & Weekly Periods */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Role in Subject</label>
                  <select
                    value={assignForm.role}
                    onChange={(e) => setAssignForm({ ...assignForm, role: e.target.value })}
                    className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5] bg-white cursor-pointer"
                  >
                    <option value="Subject Specialist">Subject Specialist</option>
                    <option value="Lead Educator / HOD">Lead Educator / HOD</option>
                    <option value="Co-Teacher">Co-Teacher</option>
                    <option value="Laboratory Instructor">Laboratory Instructor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Periods / Week per Arm</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={assignForm.weekly_periods}
                    onChange={(e) => setAssignForm({ ...assignForm, weekly_periods: parseInt(e.target.value, 10) || 4 })}
                    className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              {/* Form Teacher Checkbox */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={assignForm.is_form_teacher}
                    onChange={(e) => setAssignForm({ ...assignForm, is_form_teacher: e.target.checked })}
                    className="rounded text-[#146ef5] focus:ring-[#146ef5]"
                  />
                  <span>Designate as Form Teacher / Class Master</span>
                </label>

                {assignForm.is_form_teacher && (
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Form Class Arm</label>
                    <select
                      value={assignForm.form_arm_id}
                      onChange={(e) => setAssignForm({ ...assignForm, form_arm_id: e.target.value })}
                      className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5] bg-white cursor-pointer"
                    >
                      <option value="">-- Choose Class Arm to Supervise --</option>
                      {availableArms.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:text-gray-900 rounded-full bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 font-bold text-white rounded-full bg-[#146ef5] hover:bg-[#105bd1] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Allocating...' : 'Allocate Tutor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: Edit Allocation */}
      {isEditModalOpen && assignmentToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Edit Teaching Allocation
                </h3>
                <p className="text-xs text-gray-500">
                  {assignmentToEdit.teacher_name} · {assignmentToEdit.subject_title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Class Arm</label>
                <input
                  type="text"
                  value={editForm.arm_name}
                  onChange={(e) => setEditForm({ ...editForm, arm_name: e.target.value })}
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Weekly Periods</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={editForm.weekly_periods}
                  onChange={(e) => setEditForm({ ...editForm, weekly_periods: parseInt(e.target.value, 10) || 4 })}
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5] bg-white cursor-pointer"
                >
                  <option value="Subject Specialist">Subject Specialist</option>
                  <option value="Lead Educator / HOD">Lead Educator / HOD</option>
                  <option value="Co-Teacher">Co-Teacher</option>
                  <option value="Laboratory Instructor">Laboratory Instructor</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:text-gray-900 rounded-full bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 font-bold text-white rounded-full bg-[#146ef5] hover:bg-[#105bd1] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
