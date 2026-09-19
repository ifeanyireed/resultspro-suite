'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon,
  Cog6ToothIcon,
  PlayIcon,
  PlusIcon,
  Bars3Icon,
  DocumentTextIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { coursesApi } from '@/lib/api';

export default function BuilderOSPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [program, setProgram] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await coursesApi.get(`/api/admin/programs`);
        const found = res.data.programs?.find((p: any) => p.id === params.id);
        setProgram(found || { title: "Untitled Journey", id: params.id });
      } catch (e) {
        console.error(e);
        setProgram({ title: "Untitled Journey", id: params.id });
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [params.id]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading Builder OS...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 -m-8">
      {/* Builder Top Nav */}
      <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/program-builder')}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-md">DRAFT</span>
            <h1 className="font-semibold text-gray-900 text-sm">{program?.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <Cog6ToothIcon className="w-4 h-4" />
            Settings
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <PlayIcon className="w-4 h-4" />
            Preview
          </button>
          <button className="px-4 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800">
            Publish
          </button>
        </div>
      </div>

      {/* Builder Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Modules / Outline) */}
        <div className="w-72 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Journey Outline</h2>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400">
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-center text-sm text-gray-400 py-8">
              No modules yet. <br/> Click + to add your first module.
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-gray-50/50 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-gray-200 border-dashed rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PlusIcon className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Select a module to edit</h3>
              <p className="text-sm text-gray-500 mb-6">Create your curriculum by adding modules to the outline.</p>
              <div className="flex items-center justify-center gap-3">
                <button className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4 text-blue-500" />
                  Add Text Lesson
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <VideoCameraIcon className="w-4 h-4 text-purple-500" />
                  Add Video
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar (Properties) */}
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
           <div className="p-4 border-b border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Properties</h2>
          </div>
          <div className="flex-1 p-4">
            <div className="text-sm text-gray-500 text-center py-8">
              Select an item to edit its properties
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
