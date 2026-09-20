'use client';

import React from 'react';
import { TrendingUp, BookOpen, FileCheck2, MonitorPlay } from 'lucide-react';

function GradientMetricCard({ title, value, subtitle, trend, icon: Icon }: any) {
  return (
    <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full filter blur-[3rem] opacity-20"></div>
      
      <div className="flex justify-between items-start z-10">
        <h3 className="text-xl font-normal text-white">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-[#146ef5] transition-colors">
          {Icon && <Icon className="w-4 h-4" />}
        </div>
      </div>
      <div className="z-10 mt-6">
        <h2 className="text-5xl font-medium tracking-tight text-white mb-2">{value}</h2>
        <div className="flex items-center gap-1.5 text-xs text-white/80">
          {trend && (
            <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
              {trend}
            </div>
          )}
          <span>{subtitle}</span>
        </div>
      </div>
    </div>
  );
}

function WhiteMetricCard({ title, value, subtitle, trend, icon: Icon, trendColor = 'gray' }: any) {
  const trendBg = trendColor === 'green' ? 'bg-green-100 text-green-700' : 
                  trendColor === 'red' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600';

  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-normal text-gray-900">{title}</h3>
        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
          {Icon && <Icon className="w-4 h-4" />}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{value}</h2>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          {trend && (
            <div className={`${trendBg} px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1`}>
              {trend}
            </div>
          )}
          <span>{subtitle}</span>
        </div>
      </div>
    </div>
  );
}

import { 
  PlusIcon,
  Bars3BottomLeftIcon,
  DocumentDuplicateIcon,
  ArrowUpRightIcon
} from '@heroicons/react/24/outline';
import { coursesApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ProgramBuilderPage() {
  const router = useRouter();
  const [programs, setPrograms] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any>({ total_modules: 0, total_videos: 0, total_quizzes: 0 });
  const [loading, setLoading] = React.useState(true);
  const [creating, setCreating] = React.useState(false);

  const fetchPrograms = async () => {
    try {
      const res = await coursesApi.get('/api/admin/programs');
      setPrograms(res.data.programs || []);
      if (res.data.stats) {
        setStats(res.data.stats);
      }
    } catch (e: any) {
      console.error("[fetchPrograms Error Data]:", e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPrograms();
  }, []);

  const handleCreateProgram = async () => {
    const title = prompt("Enter a title for the new Journey (Program):");
    if (!title) return;
    
    setCreating(true);
    try {
      await coursesApi.post('/api/admin/programs', {
        title,
        description: "New authored journey",
        duration_weeks: 12,
        base_price: 0
      });
      await fetchPrograms();
    } catch (e) {
      alert("Failed to create journey");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Program Builder</h2>
          <p className="text-sm text-gray-500 mt-1">Create journeys, modules, and author content.</p>
        </div>
        <button 
          disabled={creating}
          onClick={handleCreateProgram}
          className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 disabled:opacity-70"
        >
          <PlusIcon className="w-4 h-4" />
          {creating ? 'Creating...' : 'Create Journey'}
        </button>
      </div>

            {/* Top-Level KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <GradientMetricCard
          title="Total Journeys"
          value={programs.length}
          subtitle="Active curriculum programs"
          trend="+3"
          icon={TrendingUp}
        />
        <WhiteMetricCard
          title="Published Modules"
          value={stats.total_modules || 0}
          subtitle="Content blocks delivered"
          trend="+12%"
          trendColor="green"
          icon={BookOpen}
        />
        <WhiteMetricCard
          title="Video Lessons"
          value={stats.total_videos || 0}
          subtitle="Interactive media assets"
          trend="+5"
          trendColor="green"
          icon={MonitorPlay}
        />
        <WhiteMetricCard
          title="Active Quizzes"
          value={stats.total_quizzes || 0}
          subtitle="Assessments currently live"
          trend="+2"
          trendColor="green"
          icon={FileCheck2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Existing Journeys */}
        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="text-gray-500 p-4">Loading journeys...</div>
          ) : programs.length === 0 ? (
            <div className="bg-white rounded-[1.5rem] p-8 text-center shadow-sm border border-gray-100">
              <DocumentDuplicateIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-900 font-medium">No journeys found</h3>
              <p className="text-gray-500 text-sm mt-1">Click "Create Journey" to start authoring.</p>
            </div>
          ) : (
            programs.map((prog) => (
              <div 
                key={prog.id} 
                onClick={() => router.push(`/admin/program-builder/${prog.id}`)}
                className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:-translate-y-1 transition-transform cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center">
                    <DocumentDuplicateIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{prog.title}</h3>
                    <p className="text-sm text-gray-500">{prog.duration_weeks} Weeks • {prog.modules_count || 0} Modules</p>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
                  <ArrowUpRightIcon className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Quick Stats / Drafts */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Content Library</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <Bars3BottomLeftIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">Total Programs</span>
              </div>
              <span className="text-lg font-bold text-[#146ef5]">{programs.length}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <DocumentDuplicateIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">Drafts</span>
              </div>
              <span className="text-lg font-bold text-gray-900">8</span>
            </div>
          </div>
        </div>
      </div>

          </>
  );
}
