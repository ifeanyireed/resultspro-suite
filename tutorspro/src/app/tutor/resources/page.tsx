"use client";

import { IconFolderPlus as FolderPlus, IconFileText as FileText, IconPhoto as ImageIcon, IconVideo as Video, IconSearch as Search, IconFilter as Filter, IconDotsVertical as MoreVertical, IconDownload as Download, IconShare2 as Share2, IconTrash as Trash2, IconFolder as Folder, IconChevronRight as ChevronRight, IconPlus as Plus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

export default function TutorResources() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const files = [
    { id: 1, name: 'calculus_derivatives.pdf', type: 'PDF', size: '2.4 MB', date: 'May 10, 2026', folder: 'Mathematics' },
    { id: 2, name: 'physics_forces_diagram.png', type: 'IMG', size: '1.1 MB', date: 'May 08, 2026', folder: 'Physics' },
    { id: 3, name: 'intro_video.mp4', type: 'VID', size: '45.0 MB', date: 'May 05, 2026', folder: 'General' },
    { id: 4, name: 'english_essay_rubric.docx', type: 'DOC', size: '840 KB', date: 'April 28, 2026', folder: 'English' },
  ];

  const folders = ['Mathematics', 'Physics', 'English', 'General'];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
            
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <MotionRise className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-gray-900 mb-2">
              Resource <span className="text-blue">Library</span>
            </h1>
            <p className="text-gray-600">Upload, organize, and share lesson materials with your students.</p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
                <FolderPlus className="w-5 h-5" /> NEW FOLDER
             </button>
             <button className="px-8 py-3 rounded-2xl bg-green text-navy font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-sm">
                <Plus className="w-5 h-5" /> UPLOAD FILE
             </button>
          </div>
        </MotionRise>

        {/* Search and Filters */}
        <MotionRise delay={0.05} className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search resources..." className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm text-gray-900 focus:outline-none focus:border-blue transition-all shadow-sm" />
           </div>
           <div className="flex gap-3 overflow-x-auto w-full md:w-auto pb-2 no-scrollbar">
              {['All', 'PDFs', 'Images', 'Videos', 'Docs'].map((t) => (
                <button key={t} className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-gray-900 hover:bg-gray-50 transition-all whitespace-nowrap shadow-sm">
                   {t}
                </button>
              ))}
              <button className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 transition-all shadow-sm"><Filter size={18} /></button>
           </div>
        </MotionRise>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Folders Sidebar */}
          <MotionRise delay={0.1} className="space-y-8">
             <section>
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-6">FOLDERS</h3>
                <div className="space-y-2">
                   {folders.map((folder) => (
                     <button key={folder} className="w-full p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue/30 transition-all text-left">
                        <div className="flex items-center gap-3">
                           <Folder className="w-5 h-5 text-blue" />
                           <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{folder}</span>
                        </div>
                        <ChevronRight size={14} className="text-gray-400 group-hover:text-blue transition-colors" />
                     </button>
                   ))}
                </div>
             </section>

             <section className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm">
                <div className="text-3xl font-display font-black text-gray-900 mb-2">2.4 GB</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">of 10 GB Storage Used</div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-8">
                   <div className="w-1/4 h-full bg-blue rounded-full" />
                </div>
                <button className="w-full py-4 rounded-2xl bg-gray-100 border border-gray-200 text-gray-900 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all">
                   Upgrade Storage
                </button>
             </section>
          </MotionRise>

          {/* Files Grid */}
          <MotionRise delay={0.15} className="lg:col-span-3">
             <MotionStagger className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {files.map((file) => (
                  <div key={file.id} className="p-6 rounded-[32px] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
                     <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                           file.type === 'PDF' ? 'bg-red-50 text-red-600' :
                           file.type === 'VID' ? 'bg-purple-50 text-purple-600' :
                           file.type === 'IMG' ? 'bg-green/20 text-navy' : 'bg-blue/10 text-blue'
                        }`}>
                           {file.type === 'VID' ? <Video size={24} /> : <FileText size={24} />}
                        </div>
                        <button className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100"><MoreVertical size={16} /></button>
                     </div>
                     
                     <h4 className="font-bold text-gray-900 text-sm mb-1 truncate pr-8" title={file.name}>{file.name}</h4>
                     <div className="text-[10px] text-gray-500 font-black uppercase tracking-tighter mb-6">{file.size} • {file.date}</div>
                     
                     <div className="flex gap-2">
                        <button className="flex-1 py-2 rounded-xl bg-gray-50 border border-gray-200 text-[10px] font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                           <Download size={12} /> DOWNLOAD
                        </button>
                        <button className="flex-1 py-2 rounded-xl bg-gray-50 border border-gray-200 text-[10px] font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                           <Share2 size={12} /> SHARE
                        </button>
                     </div>
                  </div>
                ))}
             </MotionStagger>
          </MotionRise>
        </div>
      </div>
    </main>
  );
}
