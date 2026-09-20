'use client';

import React, { use } from 'react';
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

export default function BuilderOSPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [program, setProgram] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const [modules, setModules] = React.useState<any[]>([]);
  const [selectedModuleId, setSelectedModuleId] = React.useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await coursesApi.get(`/api/admin/programs`);
        const found = res.data.programs?.find((p: any) => p.id === id);
        setProgram(found || { title: "Untitled Journey", id });
      } catch (e) {
        console.error(e);
        setProgram({ title: "Untitled Journey", id });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProgram();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading Builder OS...</div>;
  }

  const handleAddModule = () => {
    const newModule = { id: Date.now().toString(), title: 'New Module' };
    setModules([...modules, newModule]);
    setSelectedModuleId(newModule.id);
    setIsSidebarOpen(true);
  };

  const handleAddTextLesson = (moduleId: string) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, content_markdown: '' } : m));
  };

  const handleAddVideo = (moduleId: string) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, video_url: '' } : m));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-gray-50 -mx-8 -mb-8 -mt-2 rounded-t-2xl overflow-hidden border-t border-gray-200 shadow-sm">
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
            <Cog6ToothIcon className="w-4 h-4 stroke-2" />
            Settings
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <PlayIcon className="w-4 h-4 stroke-2" />
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
        <div className="w-72 border-r border-gray-200 bg-white flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Journey Outline</h2>
            <button onClick={handleAddModule} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400">
              <PlusIcon className="w-4 h-4 stroke-2" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {modules.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-8">
                No modules yet. <br/> Click + to add your first module.
              </div>
            ) : (
              <div className="space-y-1">
                {modules.map(mod => (
                  <button 
                    key={mod.id}
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                      setIsSidebarOpen(true);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-colors ${selectedModuleId === mod.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {mod.title || 'Untitled Module'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-gray-50/50 p-8 overflow-y-auto min-w-0">
          <div className="max-w-3xl mx-auto">
            {modules.length === 0 ? (
              <div className="bg-white border border-gray-200 border-dashed rounded-xl p-12 text-center">
                <button onClick={handleAddModule} className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4 hover:bg-gray-50 transition-colors focus:outline-none">
                  <PlusIcon className="w-6 h-6 text-gray-400 stroke-2" />
                </button>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Create your first module</h3>
                <p className="text-sm text-gray-500 mb-6">Create your curriculum by adding modules to the outline.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {modules.map(mod => (
                  <div 
                    key={mod.id} 
                    className={`bg-white border rounded-xl p-6 shadow-sm transition-colors cursor-pointer ${selectedModuleId === mod.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`} 
                    onClick={() => { 
                      setSelectedModuleId(mod.id); 
                      setIsSidebarOpen(true); 
                    }}
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{mod.title || 'Untitled Module'}</h3>
                    
                    {mod.content_markdown !== undefined ? (
                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <textarea 
                          className="w-full p-4 h-64 resize-y outline-none font-mono text-sm text-gray-800"
                          placeholder="Write your markdown content here..."
                          value={mod.content_markdown}
                          onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, content_markdown: e.target.value } : m))}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ) : mod.video_url !== undefined ? (
                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white p-4">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Video URL (YouTube, Vimeo, etc.)</label>
                        <input 
                          type="text" 
                          className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          placeholder="https://"
                          value={mod.video_url}
                          onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, video_url: e.target.value } : m))}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-100 border-dashed rounded-lg p-8 text-center">
                        <p className="text-sm text-gray-500 mb-4">No lessons in this module yet.</p>
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAddTextLesson(mod.id); }}
                            className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <DocumentTextIcon className="w-4 h-4 text-blue-500 stroke-2" />
                            Add Text Lesson
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAddVideo(mod.id); }}
                            className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <VideoCameraIcon className="w-4 h-4 text-purple-500 stroke-2" />
                            Add Video
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar (Properties) */}
        <div className={`border-l border-gray-200 bg-white flex flex-col shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80' : 'w-0 border-l-0 overflow-hidden'}`}>
           <div className="p-4 border-b border-gray-100 flex items-center justify-between whitespace-nowrap min-w-[320px]">
            <h2 className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Properties</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto min-w-[320px]">
            {selectedModuleId ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Module Title</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    value={modules.find(m => m.id === selectedModuleId)?.title || ''}
                    onChange={(e) => {
                      setModules(modules.map(m => m.id === selectedModuleId ? { ...m, title: e.target.value } : m));
                    }}
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm h-28 resize-none focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Optional description"
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-8">
                Select an item to edit its properties
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
