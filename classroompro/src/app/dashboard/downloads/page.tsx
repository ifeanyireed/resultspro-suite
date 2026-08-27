"use client";

import { IconDownload as Download, IconTrash as Trash2, IconWifiOff as WifiOff, IconCircleCheck as CheckCircle2, IconFileText as FileText, IconClock as Clock, IconExternalLink as ExternalLink, IconShieldCheck as ShieldCheck } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const downloadedContent = [
  { id: 1, title: "Biology: Photosynthesis (Detailed)", type: "Note", size: "2.4 MB", date: "Oct 12, 2025" },
  { id: 2, title: "Mathematics: Quadratic Equations", type: "Note", size: "1.8 MB", date: "Oct 14, 2025" },
  { id: 3, title: "Cell Biology Fundamentals Quiz", type: "Quiz", size: "0.5 MB", date: "Oct 20, 2025" },
];

export default function DownloadsPage() {
  return (
    <div className="flex-1">
      
      
      <main className="p-8 max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-display">Download Manager</h2>
            <p className="text-sm text-gray-500">Access your synced content even when you're offline.</p>
          </div>
          <div className="bg-emerald-50 border border-green/20 px-4 py-2 rounded-xl flex items-center gap-2">
             <ShieldCheck className="w-4 h-4 text-emerald-600" />
             <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">PWA Active</span>
          </div>
        </div>

        <div className="bg-blue/5 border border-blue/10 rounded-[32px] p-8 flex items-center gap-8">
           <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#146ef5] shrink-0">
              <WifiOff className="w-8 h-8" />
           </div>
           <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Study Anytime, Anywhere</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                 Downloaded notes and quizzes are saved locally to your device. 
                 ClassroomPRO will automatically switch to offline mode when internet is unavailable.
              </p>
           </div>
        </div>

        <div className="space-y-4">
           <div className="flex justify-between items-center px-2">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.2em]">Synced Resources</h3>
              <span className="text-[10px] font-bold text-gray-500 uppercase">{downloadedContent.length} Items</span>
           </div>

           <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] overflow-hidden">
              <div className="divide-y divide-gray-100">
                 {downloadedContent.map((item) => (
                    <div key={item.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500">
                             <FileText className="w-5 h-5" />
                          </div>
                          <div>
                             <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                             </div>
                             <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                <span>{item.type}</span>
                                <span className="w-1 h-1 bg-white/20 rounded-full" />
                                <span>{item.size}</span>
                                <span className="w-1 h-1 bg-white/20 rounded-full" />
                                <span>{item.date}</span>
                             </div>
                          </div>
                       </div>

                       <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-9 px-4 border-gray-100 hover:bg-gray-50 text-gray-900 font-bold text-[10px]">
                             Open
                          </Button>
                          <button className="p-2 rounded-lg hover:bg-red-400/10 text-gray-500 hover:text-red-400 transition-all">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] p-8 text-center">
           <div className="text-xs text-gray-500 mb-4 font-medium">Storage Usage</div>
           <div className="w-full max-w-md mx-auto h-2 bg-white shadow-sm border border-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-emerald-600 w-[15%]" />
           </div>
           <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              4.7 MB of 100 MB Used
           </div>
        </div>
      </main>
    </div>
  );
}
