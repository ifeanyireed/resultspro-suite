'use client';

import { GripVertical, Copy, Trash2 } from 'lucide-react';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon,
  Cog6ToothIcon,
  PlayIcon,
  PlusIcon,
  Bars3Icon,
  DocumentTextIcon,
  VideoCameraIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import api, { coursesApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { RichTextEditor } from '@/components/RichTextEditor';
import { QuizBuilderModal } from './QuizBuilderModal';
import { PreviewModal } from './PreviewModal';



export type ContentItem = {
  id: string;
  type: 'TEXT' | 'VIDEO' | 'AUDIO' | 'PDF' | 'QUIZ' | 'HTML' | 'ASSIGNMENT' | 'PPT' | 'COMPILER' | 'LIVE_CLASS';
  title?: string;
  content?: string;
  url?: string;
  is_group_assignment?: boolean;
};

const parseContents = (mod: any): ContentItem[] => {
  let items: ContentItem[] = [];
  if (mod.contents_json) {
    try {
      items = JSON.parse(mod.contents_json);
    } catch(e) {}
  }
  // Migrate legacy
  if (items.length === 0) {
    if (mod.content_markdown !== undefined) {
      items.push({ id: 'legacy-text', type: 'TEXT', content: mod.content_markdown });
    } else if (mod.video_url !== undefined) {
      items.push({ id: 'legacy-video', type: 'VIDEO', url: mod.video_url });
    }
  }
  return items;
};

const getHtmlSnippet = (html: string) => {
  if (!html) return { heading: 'Text Lesson', excerpt: 'This module has text content.' };
  
  // Try to extract the first heading
  const headingMatch = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
  let extractedHeading = '';
  if (headingMatch && headingMatch[1]) {
    extractedHeading = headingMatch[1].replace(/<[^>]+>/g, '').trim();
  }
  
  // Strip all HTML tags
  const plainText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Use the extracted heading if found, otherwise use up to 80 chars
  let excerpt = extractedHeading || plainText.slice(0, 80);
  
  if (!extractedHeading && plainText.length > 80) {
    excerpt += '...';
  }
  if (!excerpt) excerpt = 'This module has text content.';
  
  return { heading: 'Text Lesson', excerpt };
};

export default function BuilderOSPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [program, setProgram] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const [modules, setModules] = React.useState<any[]>([]);
  const [selectedModuleId, setSelectedModuleId] = React.useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const [editingTextLessonId, setEditingTextLessonId] = React.useState<string | null>(null);
  const [uploadingHtmlId, setUploadingHtmlId] = React.useState<string | null>(null);
  const [quizzes, setQuizzes] = React.useState<any[]>([]);
  const [isQuizModalOpen, setIsQuizModalOpen] = React.useState<string | null>(null);
  const [moduleTextContext, setModuleTextContext] = React.useState('');
  const [textLessonDraft, setTextLessonDraft] = React.useState<string>('');
  const [draggedContent, setDraggedContent] = React.useState<{ modId: string; index: number } | null>(null);
  React.useEffect(() => {
    const fetchProgramAndStages = async () => {
      try {
        // Fetch sequentially to prevent hitting rate limits on the auth introspection endpoint
        const progRes = await coursesApi.get(`/api/admin/programs`);
        try { const quizzesRes = await coursesApi.get(`/api/admin/quizzes`); setQuizzes(quizzesRes.data.quizzes || []); } catch(e){}
        const found = progRes.data.programs?.find((p: any) => p.id === id);
        setProgram(found || { title: "Untitled Journey", id });
        
        try {
          const stagesRes = await coursesApi.get(`/api/admin/programs/${id}/stages`);
          if (stagesRes.data?.stages) {
            setModules(stagesRes.data.stages.map((s: any) => ({
              id: s.id,
              title: s.title,
              description: s.description || '',
              content_markdown: s.content_markdown,
              video_url: s.video_url,
              contents_json: s.contents_json,
              type: 'module'
            })));
          }
        } catch (stageErr) {
          console.warn("Could not fetch stages, defaulting to empty. Make sure backend is updated.");
        }
      } catch (e) {
        console.error("Failed to fetch program:", e);
        setProgram({ title: "Untitled Journey", id });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProgramAndStages();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading Builder OS...</div>;
  }

  const handleAddModule = async () => {
    const stageNumber = modules.length + 1;
    try {
      const res = await coursesApi.post(`/api/admin/stages`, {
        program_id: id,
        stage_number: stageNumber,
        title: 'New Module'
      });
      const newStage = res.data.stage;
      const newModule = { id: newStage.id, title: newStage.title, description: newStage.description || '', type: 'module' };
      setModules([...modules, newModule]);
      setSelectedModuleId(newModule.id);
      setIsSidebarOpen(true);
    } catch (e) {
      console.error("Failed to create module", e);
      alert("Failed to create module. Make sure backend is running.");
    }
  };

  const handleUpdateModule = async (moduleId: string, updates: any) => {
    try {
      await coursesApi.put(`/api/admin/stages/${moduleId}`, updates);
    } catch (e) {
      console.error("Failed to update module", e);
    }
  };

  const handleAddTextLesson = (moduleId: string) => {
    const mod = modules.find(m => m.id === moduleId);
    setTextLessonDraft(mod?.content_markdown || '');
    setEditingTextLessonId(moduleId);
    
    // If it doesn't have the field yet, initialize it
    if (mod?.content_markdown === undefined) {
      setModules(modules.map(m => m.id === moduleId ? { ...m, content_markdown: '' } : m));
    }
  };

  const handleSaveTextLesson = () => {
    if (editingTextLessonId) {
      const [itemId, modId] = editingTextLessonId.split('_');
      const mod = modules.find(m => m.id === modId);
      if (mod) {
        const items = parseContents(mod);
        const item = items.find(i => i.id === itemId);
        if (item) {
          item.content = textLessonDraft;
          setModules(modules.map(m => m.id === modId ? { ...m, contents_json: JSON.stringify(items), content_markdown: undefined, video_url: undefined } : m));
          handleUpdateModule(modId, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
        }
      }
      setEditingTextLessonId(null);
    }
  };

  const handleAddVideo = (moduleId: string) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, video_url: '' } : m));
    handleUpdateModule(moduleId, { video_url: '' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-gray-50 -mx-8 -mb-8 -mt-2 rounded-t-2xl overflow-hidden border-t border-gray-200 shadow-sm">
      {/* Builder Top Nav */}
      <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between pl-4 pr-10 sticky top-0 z-10 shrink-0">
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
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
          >
            <PlayIcon className="w-4 h-4 stroke-2" />
            Preview
          </button>
          <button className="px-4 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800">
            Publish
          </button>
        </div>
      </div>

      {/* Builder Workspace */}
      <div className="flex-1 flex overflow-hidden pr-6">
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
                <AnimatePresence>
                  {modules.map(mod => (
                    <motion.div 
                      key={mod.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`group flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-md transition-colors ${selectedModuleId === mod.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 cursor-grab shrink-0 transition-opacity" />
                        <button
                          className="flex-1 text-left truncate focus:outline-none"
                          onClick={() => {
                            setSelectedModuleId(mod.id);
                            setIsSidebarOpen(true);
                          }}
                        >
                          {mod.title || 'Untitled Module'}
                        </button>
                      </div>
                      
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                        <button 
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors" 
                          title="Duplicate Module"
                          onClick={(e) => {
                            e.stopPropagation();
                            // duplicate module logic
                            const newMod = {
                              ...mod,
                              id: crypto.randomUUID(),
                              title: (mod.title || 'Untitled Module') + ' (Copy)'
                            };
                            setModules([...modules, newMod]);
                            handleUpdateModule(newMod.id, newMod);
                          }}
                        >
                          <Copy className="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors" 
                          title="Delete Module"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm("Are you sure you want to delete this module?")) {
                              setModules(modules.filter(m => m.id !== mod.id));
                              if (selectedModuleId === mod.id) setSelectedModuleId(null);
                              try {
                                await coursesApi.delete(`/api/admin/stages/${mod.id}`);
                              } catch(err) {
                                console.error("Failed to delete", err);
                              }
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
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
                <AnimatePresence>
                  {modules.map(mod => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      transition={{ duration: 0.2 }}
                      key={mod.id} 
                      className={`bg-white border rounded-xl p-6 shadow-sm transition-colors cursor-pointer ${selectedModuleId === mod.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`} 
                      onClick={() => { 
                        setSelectedModuleId(mod.id); 
                        setIsSidebarOpen(true); 
                      }}
                    >
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{mod.title || 'Untitled Module'}</h3>
                    

                    
                    <div className="space-y-4">
                      {parseContents(mod).map((item, index) => {
                        return (
                          <div 
                            key={item.id} 
                            draggable
                            onDragStart={(e) => {
                              setDraggedContent({ modId: mod.id, index });
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'move';
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (!draggedContent || draggedContent.modId !== mod.id || draggedContent.index === index) return;
                              const items = parseContents(mod);
                              const draggedItem = items[draggedContent.index];
                              items.splice(draggedContent.index, 1);
                              items.splice(index, 0, draggedItem);
                              setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items), content_markdown: undefined, video_url: undefined } : m));
                              handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                              setDraggedContent(null);
                            }}
                            onDragEnd={() => setDraggedContent(null)}
                            className={`relative group bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center gap-3 hover:border-slate-300 transition-colors ${draggedContent?.modId === mod.id && draggedContent?.index === index ? 'opacity-50 border-dashed border-blue-400 bg-blue-50/30' : ''}`}
                          >
                            <div className="absolute top-2 left-2 cursor-grab text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={(e) => { 
                                   e.stopPropagation();
                                   const items = parseContents(mod);
                                   const newItems = [...items];
                                   newItems.splice(index, 0, { ...item, id: Math.random().toString(36).substring(7) });
                                   setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(newItems), content_markdown: undefined, video_url: undefined } : m));
                                   handleUpdateModule(mod.id, { contents_json: JSON.stringify(newItems), content_markdown: null, video_url: null });
                                 }}
                                 className="p-1.5 text-slate-400 hover:text-slate-700 bg-white shadow-sm rounded border border-slate-200" title="Duplicate"
                               >
                                 <DocumentDuplicateIcon className="w-4 h-4 stroke-2" />
                               </button>
                               <button 
                                 onClick={(e) => { 
                                   e.stopPropagation();
                                   if(confirm('Delete this content block?')) {
                                     const items = parseContents(mod);
                                     items.splice(index, 1);
                                     setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items), content_markdown: undefined, video_url: undefined } : m));
                                     handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                                   }
                                 }}
                                 className="p-1.5 text-red-400 hover:text-red-600 bg-white shadow-sm rounded border border-slate-200" title="Delete"
                               >
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                               </button>
                            </div>

                            {item.type === 'TEXT' && (
                              <>
                                <DocumentTextIcon className="w-8 h-8 text-blue-500 stroke-1" />
                                <div className="text-center">
                                  <h4 className="font-medium text-slate-800 mb-1">{getHtmlSnippet(item.content || '').heading}</h4>
                                  <p className="text-sm text-slate-500">{getHtmlSnippet(item.content || '').excerpt}</p>
                                </div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setEditingTextLessonId(item.id + '_' + mod.id); setTextLessonDraft(item.content || ''); }}
                                  className="mt-2 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  Edit Text Lesson
                                </button>
                              </>
                            )}

                            {item.type === 'VIDEO' && (
                              <div className="w-full text-left" onClick={e => e.stopPropagation()}>
                                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2"><VideoCameraIcon className="w-4 h-4 text-purple-500"/> Video URL</label>
                                <input 
                                  type="text" 
                                  className="w-full border border-slate-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 outline-none"
                                  placeholder="https://"
                                  value={item.url || ''}
                                  onChange={(e) => {
                                     const items = parseContents(mod);
                                     items[index].url = e.target.value;
                                     setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items) } : m));
                                  }}
                                  onBlur={(e) => {
                                     const items = parseContents(mod);
                                     handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                                  }}
                                />
                              </div>
                            )}

                            {item.type === 'AUDIO' && (
                              <div className="w-full text-left" onClick={e => e.stopPropagation()}>
                                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg> Audio URL</label>
                                <input type="text" className="w-full border border-slate-300 rounded-md p-2 text-sm" value={item.url || ''} onChange={e => { const i = parseContents(mod); i[index].url = e.target.value; setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); }} onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)), content_markdown: null, video_url: null })} />
                                <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
                                  <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Card Title (Optional)</label>
                                    <input type="text" className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="Enter title to wrap in a white card..." value={item.title || ''} onChange={e => { const i = parseContents(mod); i[index].title = e.target.value; setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); }} onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)) })} />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Card Body (Optional)</label>
                                    <textarea className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="Enter context to wrap in a white card..." rows={2} value={item.content || ''} onChange={e => { const i = parseContents(mod); i[index].content = e.target.value; setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); }} onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)) })} />
                                  </div>
                                </div>

                              </div>
                            )}

                            {item.type === 'PDF' && (
                              <div className="w-full text-left" onClick={e => e.stopPropagation()}>
                                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2"><svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> PDF Document URL</label>
                                <input type="text" className="w-full border border-slate-300 rounded-md p-2 text-sm" value={item.url || ''} onChange={e => { const i = parseContents(mod); i[index].url = e.target.value; setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); }} onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)), content_markdown: null, video_url: null })} />
                                <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
                                  <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Card Title (Optional)</label>
                                    <input type="text" className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="Enter title to wrap in a white card..." value={item.title || ''} onChange={e => { const i = parseContents(mod); i[index].title = e.target.value; setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); }} onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)) })} />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Card Body (Optional)</label>
                                    <textarea className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="Enter context to wrap in a white card..." rows={2} value={item.content || ''} onChange={e => { const i = parseContents(mod); i[index].content = e.target.value; setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); }} onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)) })} />
                                  </div>
                                </div>

                              </div>
                            )}

                            {item.type === 'HTML' && (
                              <div className="w-full text-left" onClick={e => e.stopPropagation()}>
                                <label className="block text-xs font-medium text-slate-700 mb-2 flex items-center gap-2"><svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> HTML File Upload</label>
                                
                                {item.url ? (
                                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-md p-2 text-sm">
                                    <div className="flex-1 truncate text-slate-600">{item.url}</div>
                                    <button 
                                      className="text-xs text-red-500 font-medium hover:text-red-700 whitespace-nowrap"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const i = parseContents(mod); 
                                        i[index].url = ''; 
                                        setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); 
                                        handleUpdateModule(mod.id, { contents_json: JSON.stringify(i) });
                                      }}
                                    >Remove</button>
                                  </div>
                                ) : (
                                  <div>
                                    <input 
                                      type="file" 
                                      accept=".html,.htm,.zip" 
                                      className="hidden" 
                                      id={'html-upload-' + item.id}
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setUploadingHtmlId(item.id);
                                        try {
                                          const data = new FormData();
                                          data.append('file', file);
                                          data.append('folder', 'uploads/html');
                                          const res = await api.post('/api/v1/upload', data, {
                                            headers: { 'Content-Type': 'multipart/form-data' }
                                          });
                                          if (res.data && res.data.url) {
                                            const i = parseContents(mod);
                                            i[index].url = res.data.url;
                                            setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m));
                                            handleUpdateModule(mod.id, { contents_json: JSON.stringify(i) });
                                          }
                                        } catch (err) {
                                          console.error("Upload failed", err);
                                          alert("Failed to upload file.");
                                        } finally {
                                          setUploadingHtmlId(null);
                                        }
                                      }}
                                    />
                                    <label htmlFor={'html-upload-' + item.id} className="cursor-pointer inline-flex items-center justify-center w-full px-4 py-2 border border-dashed border-slate-300 rounded-md text-sm font-medium text-slate-600 hover:border-blue-500 hover:text-blue-500 transition-colors bg-white">
                                      {uploadingHtmlId === item.id ? 'Uploading...' : 'Click to select an HTML file'}
                                    </label>
                                <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
                                  <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Card Title (Optional)</label>
                                    <input type="text" className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="Enter title to wrap in a white card..." value={item.title || ''} onChange={e => { const i = parseContents(mod); i[index].title = e.target.value; setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); }} onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)) })} />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Card Body (Optional)</label>
                                    <textarea className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="Enter context to wrap in a white card..." rows={2} value={item.content || ''} onChange={e => { const i = parseContents(mod); i[index].content = e.target.value; setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); }} onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)) })} />
                                  </div>
                                </div>

                                  </div>
                                )}
                              </div>
                            )}

                            
                            {item.type === 'COMPILER' && (
                              <div className="w-full text-left bg-white p-3 border border-slate-200 rounded-md shadow-sm" onClick={e => e.stopPropagation()}>
                                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                                  Programming Language
                                </label>
                                <select 
                                  className="w-full border border-slate-300 rounded-md p-2 text-sm mb-3 outline-none focus:border-blue-500"
                                  value={item.url || ''} 
                                  onChange={e => { 
                                    const i = parseContents(mod); 
                                    i[index].url = e.target.value; 
                                    setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); 
                                  }} 
                                  onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)) })}
                                >
                                  <option value="">-- Select Language --</option>
                                  <option value="python">Python</option>
                                  <option value="javascript">JavaScript</option>
                                  <option value="html">HTML/CSS/JS</option>
                                  <option value="java">Java</option>
                                  <option value="cpp">C++</option>
                                  <option value="c">C</option>
                                  <option value="csharp">C#</option>
                                  <option value="go">Go</option>
                                  <option value="rust">Rust</option>
                                  <option value="php">PHP</option>
                                  <option value="ruby">Ruby</option>
                                </select>
                                
                                <label className="block text-xs font-medium text-slate-700 mb-1">Initial Code Snippet (Optional)</label>
                                <textarea 
                                  className="w-full border border-slate-300 rounded-md p-2 text-sm font-mono" 
                                  rows={5} 
                                  placeholder="def hello_world():
    print('Hello')"
                                  value={item.content || ''} 
                                  onChange={e => { 
                                    const i = parseContents(mod); 
                                    i[index].content = e.target.value; 
                                    setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); 
                                  }} 
                                  onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)) })}
                                />
                                
                                <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
                                  <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Card Title (Optional)</label>
                                    <input type="text" className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="e.g. Try it yourself!" value={item.title || ''} onChange={e => { const i = parseContents(mod); i[index].title = e.target.value; setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); }} onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)) })} />
                                  </div>
                                </div>
                              </div>
                            )}

                            {item.type === 'QUIZ' && (
                              <div className="w-full text-left bg-white p-3 border border-slate-200 rounded-md shadow-sm" onClick={e => e.stopPropagation()}>
                                <label className="block text-xs font-medium text-slate-700 mb-2 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
                                  Select or Create a Quiz
                                </label>
                                <div className="flex items-center gap-2">
                                  <select 
                                    className="flex-1 border border-slate-300 rounded-md p-2 text-sm outline-none focus:border-blue-500"
                                    value={item.url || ''}
                                    onChange={e => { 
                                      const i = parseContents(mod); 
                                      i[index].url = e.target.value; 
                                      setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); 
                                      handleUpdateModule(mod.id, { contents_json: JSON.stringify(i) });
                                    }}
                                  >
                                    <option value="">-- Select a previously created quiz --</option>
                                    {quizzes.map(q => (
                                      <option key={q.id} value={q.id}>{q.title}</option>
                                    ))}
                                  </select>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const allText = parseContents(mod).filter((i: any) => i.type === 'TEXT').map((i: any) => i.content).join('\n\n');
                                      setModuleTextContext(allText);
                                      setIsQuizModalOpen(mod.id + ':' + item.id);
                                    }}
                                    className="px-3 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 rounded-md text-sm font-medium whitespace-nowrap"
                                  >
                                    + Create New
                                  </button>
                                  {item.url && (
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const allText = parseContents(mod).filter((i: any) => i.type === 'TEXT').map((i: any) => i.content).join('\n\n');
                                        setModuleTextContext(allText);
                                        setIsQuizModalOpen(mod.id + ':' + item.id + ':' + item.url);
                                      }}
                                      className="px-3 py-2 bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 rounded-md text-sm font-medium whitespace-nowrap"
                                    >
                                      Edit Quiz
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            {item.type === 'LIVE_CLASS' && (
                              <div className="w-full text-left" onClick={e => e.stopPropagation()}>
                                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2"><VideoCameraIcon className="w-4 h-4 text-emerald-500"/> Meeting URL (Optional, fallback if not set per cohort)</label>
                                <input 
                                  type="text" 
                                  className="w-full border border-slate-300 rounded-md shadow-sm p-2 text-sm focus:ring-emerald-500 outline-none"
                                  placeholder="https://zoom.us/j/..."
                                  value={item.url || ''}
                                  onChange={(e) => {
                                     const items = parseContents(mod);
                                     items[index].url = e.target.value;
                                     setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items) } : m));
                                  }}
                                  onBlur={(e) => {
                                     const items = parseContents(mod);
                                     handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                                  }}
                                />
                                <p className="text-[10px] text-gray-400 mt-1">This module will be schedule-able in the Cohort Configurator.</p>
                                
                                {item.url && item.url.length > 5 && (
                                  <div className="mt-4 p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden pr-4">
                                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                        <VideoCameraIcon className="w-5 h-5 text-emerald-600" />
                                      </div>
                                      <div className="truncate">
                                        <h4 className="text-sm font-semibold text-emerald-900">Live Class Room</h4>
                                        <p className="text-xs text-emerald-600 truncate">{item.url}</p>
                                      </div>
                                    </div>
                                    <a 
                                      href={item.url.startsWith('http') ? item.url : `https://${item.url}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors whitespace-nowrap"
                                    >
                                      Test Link
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                            {item.type === 'ASSIGNMENT' && (
                              <div className="w-full text-left" onClick={e => e.stopPropagation()}>
                                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2"><svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> Assignment Instructions</label>
                                <textarea className="w-full border border-slate-300 rounded-md p-2 text-sm h-32 mb-3" placeholder="Describe the assignment task here..." value={item.content || ''} onChange={e => { const i = parseContents(mod); i[index].content = e.target.value; setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); }} onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)), content_markdown: null, video_url: null })} />
                                
                                <label className="block text-xs font-medium text-slate-700 mb-1">Requested Submission Type</label>
                                <select 
                                  className="w-full border border-slate-300 rounded-md p-2 text-sm outline-none focus:border-blue-500"
                                  value={item.url || 'TEXT'}
                                  onChange={e => { 
                                    const i = parseContents(mod); 
                                    i[index].url = e.target.value; 
                                    setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); 
                                  }}
                                  onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)), content_markdown: null, video_url: null })}
                                >
                                  <option value="TEXT">Text Input</option>
                                  <option value="LINK">Link Attachment</option>
                                  <option value="FILE">File Upload</option>
                                  <option value="ANY">Any (File, Link, or Text)</option>
                                </select>
                                
                                <label className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-700 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={item.is_group_assignment || false}
                                    onChange={e => {
                                      const i = parseContents(mod); 
                                      i[index].is_group_assignment = e.target.checked; 
                                      setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); 
                                      handleUpdateModule(mod.id, { contents_json: JSON.stringify(i), content_markdown: null, video_url: null });
                                    }}
                                  />
                                  Make this a Group Assignment (Peer-to-Peer Pairing)
                                </label>
                              </div>
                            )}

                            {item.type === 'PPT' && (
                              <div className="w-full text-left" onClick={e => e.stopPropagation()}>
                                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2"><svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg> Presentation URL (Google Slides, etc.)</label>
                                <input type="text" className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="Paste presentation link here..." value={item.url || ''} onChange={e => { const i = parseContents(mod); i[index].url = e.target.value; setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); }} onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)), content_markdown: null, video_url: null })} />
                                <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
                                  <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Card Title (Optional)</label>
                                    <input type="text" className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="Enter title to wrap in a white card..." value={item.title || ''} onChange={e => { const i = parseContents(mod); i[index].title = e.target.value; setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); }} onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)) })} />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Card Body (Optional)</label>
                                    <textarea className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="Enter context to wrap in a white card..." rows={2} value={item.content || ''} onChange={e => { const i = parseContents(mod); i[index].content = e.target.value; setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); }} onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)) })} />
                                  </div>
                                </div>

                              </div>
                            )}




                            <div className="w-full mt-2 flex items-center justify-center border-t border-slate-100 pt-3">
                               <select 
                                 className="text-xs bg-transparent text-slate-500 hover:text-slate-900 outline-none cursor-pointer"
                                 value={item.type}
                                 onChange={(e) => {
                                   e.stopPropagation();
                                   const items = parseContents(mod);
                                   items[index].type = e.target.value as any;
                                   if(items[index].type === 'TEXT' || items[index].type === 'HTML' || items[index].type === 'ASSIGNMENT') items[index].content = '';
                                   else items[index].url = '';
                                   setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items) } : m));
                                   handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                                 }}
                                 onClick={e => e.stopPropagation()}
                               >
                                 <option value="TEXT">Text Lesson</option>
                                 <option value="VIDEO">Video</option>
                                 <option value="AUDIO">Audio</option>
                                 <option value="PDF">PDF Document</option>
                                 <option value="HTML">HTML Embed</option>
                                 <option value="QUIZ">Quiz</option>
                                 <option value="ASSIGNMENT">Assignment</option>
                                 <option value="PPT">Presentation</option>
                                 <option value="COMPILER">Code Compiler</option>
                                 <option value="LIVE_CLASS">Live Class</option>
                               </select>
                            </div>

                          </div>
                        );
                      })}

                      {parseContents(mod).length === 0 && (
                        <div className="bg-gray-50 border border-gray-100 border-dashed rounded-lg p-8 text-center">
                          <p className="text-sm text-gray-500 mb-4">No content in this module yet.</p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const items = parseContents(mod);
                            items.push({ id: Math.random().toString(36).substring(7), type: 'TEXT', content: '' });
                            setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items), content_markdown: undefined, video_url: undefined } : m));
                            handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                            setEditingTextLessonId(items[items.length-1].id + '_' + mod.id);
                            setTextLessonDraft('');
                          }}
                          className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
                        >
                          <DocumentTextIcon className="w-4 h-4 text-blue-500 stroke-2" />
                          Add Text
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const items = parseContents(mod);
                            items.push({ id: Math.random().toString(36).substring(7), type: 'VIDEO', url: '' });
                            setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items), content_markdown: undefined, video_url: undefined } : m));
                            handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                          }}
                          className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
                        >
                          <VideoCameraIcon className="w-4 h-4 text-purple-500 stroke-2" />
                          Add Video
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const items = parseContents(mod);
                            items.push({ id: Math.random().toString(36).substring(7), type: 'AUDIO', url: '' });
                            setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items), content_markdown: undefined, video_url: undefined } : m));
                            handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                          }}
                          className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
                        >
                          <svg className="w-4 h-4 text-green-500 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                          Add Audio
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const items = parseContents(mod);
                            items.push({ id: Math.random().toString(36).substring(7), type: 'PDF', url: '' });
                            setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items), content_markdown: undefined, video_url: undefined } : m));
                            handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                          }}
                          className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
                        >
                          <svg className="w-4 h-4 text-red-500 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                          Add PDF
                        </button>

                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const items = parseContents(mod);
                            items.push({ id: Math.random().toString(36).substring(7), type: 'HTML', url: '' });
                            setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items), content_markdown: undefined, video_url: undefined } : m));
                            handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                          }}
                          className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
                        >
                          <svg className="w-4 h-4 text-orange-500 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                          Add HTML
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const items = parseContents(mod);
                            items.push({ id: Math.random().toString(36).substring(7), type: 'QUIZ', url: '' });
                            setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items), content_markdown: undefined, video_url: undefined } : m));
                            handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                          }}
                          className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
                        >
                          <svg className="w-4 h-4 text-pink-500 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Add Quiz
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const items = parseContents(mod);
                            items.push({ id: Math.random().toString(36).substring(7), type: 'ASSIGNMENT', content: '' });
                            setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items), content_markdown: undefined, video_url: undefined } : m));
                            handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                          }}
                          className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
                        >
                          <svg className="w-4 h-4 text-indigo-500 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                          Add Assignment
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const items = parseContents(mod);
                            items.push({ id: Math.random().toString(36).substring(7), type: 'PPT', url: '' });
                            setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items), content_markdown: undefined, video_url: undefined } : m));
                            handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                          }}
                          className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
                        >
                          <svg className="w-4 h-4 text-orange-600 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                          Add Presentation
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const items = parseContents(mod);
                            items.push({ id: Math.random().toString(36).substring(7), type: 'COMPILER', url: '' });
                            setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items), content_markdown: undefined, video_url: undefined } : m));
                            handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                          }}
                          className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
                        >
                          <svg className="w-4 h-4 text-emerald-600 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                          Add Compiler
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const items = parseContents(mod);
                            items.push({ id: Math.random().toString(36).substring(7), type: 'LIVE_CLASS', url: '' });
                            setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(items), content_markdown: undefined, video_url: undefined } : m));
                            handleUpdateModule(mod.id, { contents_json: JSON.stringify(items), content_markdown: null, video_url: null });
                          }}
                          className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
                        >
                          <VideoCameraIcon className="w-4 h-4 text-emerald-500 stroke-2" />
                          Add Live Class
                        </button>


                      </div>
                    </div>
                    </motion.div>

                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar (Properties) */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="border-l border-gray-200 bg-white flex flex-col shrink-0 overflow-hidden"
            >
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
                    onBlur={(e) => {
                      if (selectedModuleId) {
                        handleUpdateModule(selectedModuleId, { title: e.target.value });
                      }
                    }}
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm h-28 resize-none focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Optional description"
                    value={modules.find(m => m.id === selectedModuleId)?.description || ''}
                    onChange={(e) => {
                      setModules(modules.map(m => m.id === selectedModuleId ? { ...m, description: e.target.value } : m));
                    }}
                    onBlur={(e) => {
                      if (selectedModuleId) {
                        handleUpdateModule(selectedModuleId, { description: e.target.value });
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-8">
                Select an item to edit its properties
              </div>
            )}
          </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text Lesson Editor Modal */}
      <AnimatePresence>
        {editingTextLessonId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <h3 className="text-lg font-semibold text-slate-900">Edit Text Lesson</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditingTextLessonId(null)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSaveTextLesson}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                <RichTextEditor
                  content={textLessonDraft}
                  onChange={setTextLessonDraft}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        programTitle={program?.title || 'Untitled Program'}
        modules={modules}
      />

      <QuizBuilderModal
        isOpen={!!isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(null)}
        moduleId={isQuizModalOpen ? isQuizModalOpen.split(':')[0] : ''}
        moduleTextContext={moduleTextContext}
        existingQuizId={isQuizModalOpen && isQuizModalOpen.split(':').length === 3 ? isQuizModalOpen.split(':')[2] : undefined}
        onSave={async (newQuizId) => {
          if (!isQuizModalOpen) return;
          const [mId, iId] = isQuizModalOpen.split(':');
          
          // Refresh quizzes
          try {
            const quizzesRes = await coursesApi.get('/api/admin/quizzes');
            setQuizzes(quizzesRes.data.quizzes || []);
          } catch(e) {}

          const mod = modules.find(m => m.id === mId);
          if (mod) {
            const i = parseContents(mod);
            const target = i.find(x => x.id === iId);
            if (target) {
              target.url = newQuizId;
              setModules(modules.map(m => m.id === mId ? { ...m, contents_json: JSON.stringify(i) } : m));
              handleUpdateModule(mId, { contents_json: JSON.stringify(i) });
            }
          }
        }}
      />
    </div>
  );
}

