'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Book02Icon, 
  Video01Icon,
  Task01Icon, 
  HelpCircleIcon,
  AnalyticsUpIcon
} from 'hugeicons-react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { 
  TeacherCreateNoteView, 
  TeacherCreateVideoView,
  TeacherCreateQuizView, 
  TeacherAnalyticsView 
} from '@classroompro/modules';

function TeacherClassroomStream() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/teacher/classroom');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch teacher classroom data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ color: '#64748b', padding: '2rem' }}>Loading Classroom...</div>;
  if (!data) return <div style={{ color: '#64748b', padding: '2rem' }}>Failed to load classroom data.</div>;

  const { assigned_classes, recent_notes } = data;

  return (
    <div style={{ maxWidth: '1200px', padding: '1rem 0 4rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            Classroom Learning Overview
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
            Classes and rosters are synced from CampusPRO. Author NERDC lesson notes, generate AI quizzes, and track topic mastery here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/teacher/campus-os?subtab=rollcall"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-extrabold transition-colors"
          >
            CampusPRO Roll Call
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/teacher/campus-os?subtab=messaging"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0D1060] text-[#FBBC04] text-xs font-extrabold transition-colors"
          >
            CampusPRO Messaging Hub
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
         {/* Assigned Classes (Read-only from CampusPRO) */}
         <div>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                Assigned Classes (Synced from CampusPRO)
              </h3>
              <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-[#1565C0]">
                System of Record: CampusPRO
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
               {assigned_classes.map((cls: any) => (
                 <div key={cls.id} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '1.5rem', padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                       <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{cls.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{cls.subject}</span>
                       </div>
                       <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#146ef5', padding: '0.25rem 0.6rem', borderRadius: '0.5rem', fontWeight: '800' }}>
                         {cls.students_count} Students
                       </span>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.4rem' }}>
                          <span>NERDC Curriculum Covered</span>
                          <span>{cls.curriculum_coverage}%</span>
                       </div>
                       <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${cls.curriculum_coverage}%`, height: '100%', background: '#146ef5', borderRadius: '3px' }} />
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                       <Link
                         href="/teacher/campus-os?subtab=rollcall"
                         style={{ flex: 1, textAlign: 'center', textDecoration: 'none', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', padding: '0.6rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '0.8rem' }}
                       >
                         Roll Call (CampusPRO)
                       </Link>
                       <Link
                         href="/teacher/results"
                         style={{ flex: 1, textAlign: 'center', textDecoration: 'none', background: '#0D1060', color: '#FBBC04', padding: '0.6rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '0.8rem' }}
                       >
                         ResultsPRO OCR
                       </Link>
                    </div>
                 </div>
               ))}
            </div>

            {/* Published Notes / Resources */}
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.25rem' }}>Recent Published Lesson Notes</h3>
            <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '1.5rem', overflow: 'hidden' }}>
               {recent_notes.map((note: any, idx: number) => (
                 <div key={note.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', borderBottom: idx !== recent_notes.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: '#eff6ff', color: '#146ef5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Book02Icon size={20} />
                       </div>
                       <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>{note.title}</h4>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{note.class} • {note.date}</span>
                       </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>{note.views} reads</span>
                 </div>
               ))}
            </div>
         </div>

         {/* System Boundary Handoff Card (Replaces duplicate inline messaging) */}
         <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
               <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#0D1060] text-[#FBBC04] text-[10px] font-black uppercase tracking-wider">
                 Zero-Duplication Architecture
               </span>
               <h3 className="text-base font-extrabold text-gray-900">
                 Need Messaging, Roll Call, or Marksheet OCR?
               </h3>
               <p className="text-xs text-gray-500 leading-relaxed">
                 To keep records unified across Laurel Academy, school communications and attendance live in <strong>CampusPRO</strong>, while handwritten marksheet OCR and report card remarks live in <strong>ResultsPRO</strong>.
               </p>
               <div className="space-y-2 pt-1">
                 <Link
                   href="/teacher/campus-os?subtab=messaging"
                   className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-800 text-xs font-extrabold flex items-center justify-between transition-colors"
                 >
                   <span>Open CampusPRO Messaging</span>
                   <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-500" />
                 </Link>
                 <Link
                   href="/teacher/campus-os?subtab=rollcall"
                   className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-800 text-xs font-extrabold flex items-center justify-between transition-colors"
                 >
                   <span>Open CampusPRO Attendance</span>
                   <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-500" />
                 </Link>
                 <Link
                   href="/teacher/results"
                   className="w-full py-2.5 px-4 rounded-xl bg-[#0D1060] text-[#FBBC04] text-xs font-extrabold flex items-center justify-between transition-colors"
                 >
                   <span>Open ResultsPRO AI Console</span>
                   <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                 </Link>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export default function TeacherClassroomHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'stream',
      label: 'Classroom Stream',
      icon: Book02Icon,
      component: TeacherClassroomStream,
    },
    {
      id: 'create-note',
      label: 'NERDC Lesson Note & AI Story Editor',
      icon: Task01Icon,
      component: TeacherCreateNoteView,
    },
    {
      id: 'create-video',
      label: 'Publish Video Lesson',
      icon: Video01Icon,
      component: TeacherCreateVideoView,
    },
    {
      id: 'create-quiz',
      label: 'AI Quiz Generator & Exam Moderation',
      icon: HelpCircleIcon,
      component: TeacherCreateQuizView,
    },
    {
      id: 'analytics',
      label: 'Topic Mastery & CampusPRO Score Sync',
      icon: AnalyticsUpIcon,
      component: TeacherAnalyticsView,
    },
  ];

  return (
    <SpecialistAppContainer
      appTitle="ClassroomPRO — Teacher Digital Learning & Formative Assessment Hub"
      appSubtitle="NERDC curriculum lesson authoring, AI storybooks, moderated quiz generation, multi-year attempt history, and traceable score synchronization to CampusPRO."
      appBadge="ClassroomPRO"
      accentColor="#0D1060"
      tabs={tabs}
      defaultTabId="stream"
    />
  );
}
