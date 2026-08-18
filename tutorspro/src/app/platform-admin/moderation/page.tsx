"use client";

import { 
  ShieldAlert, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle,
  Eye,
  MessageSquare,
  FileText,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getModeration } from '@/lib/platform.api';

export default function ContentModeration() {
  const [activeQueue, setActiveQueue] = useState('Flagged Messages');
  const [flaggedItems, setFlaggedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModeration = async () => {
      try {
        const data = await getModeration();
        setFlaggedItems(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch moderation flags');
      } finally {
        setLoading(false);
      }
    };

    fetchModeration();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-green animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-rose/10 text-rose p-6 rounded-3xl inline-block">
          <p className="font-bold mb-2">Error Loading Moderation</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Content Moderation</h1>
            <p className="text-gray-400">Review flagged messages, resources, and user-generated content.</p>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-6">
                <div className="text-center">
                   <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Queue Size</div>
                   <div className="text-lg font-bold text-white">18</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                   <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Risk Level</div>
                   <div className="text-lg font-bold text-amber">Medium</div>
                </div>
             </div>
          </div>
        </div>

        {/* Queues */}
        <div className="flex flex-col lg:flex-row gap-8">
           {/* Sidebar Queues */}
           <div className="lg:w-64 space-y-2">
              {['Flagged Messages', 'Resource Files', 'User Profiles', 'Public Forum', 'Escalated'].map((queue) => (
                <button 
                  key={queue}
                  onClick={() => setActiveQueue(queue)}
                  className={`w-full text-left px-6 py-4 rounded-2xl text-sm font-bold transition-all border ${
                    activeQueue === queue ? 'bg-green/10 border-green/30 text-green shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {queue}
                </button>
              ))}
           </div>

           {/* Content List */}
           <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                 <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search moderation log..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-white focus:outline-none focus:border-green/50 transition-all"
                    />
                 </div>
                 <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                    <Filter className="w-5 h-5" />
                 </button>
              </div>

              {flaggedItems.map((item) => (
                <div key={item.id} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                   <div className="flex flex-col md:flex-row justify-between gap-8">
                      <div className="flex gap-6 flex-1">
                         <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-green/20 transition-all">
                            {item.type === 'Message' ? <MessageSquare className="w-8 h-8 text-blue" /> : item.type === 'Resource' ? <FileText className="w-8 h-8 text-green" /> : <ShieldAlert className="w-8 h-8 text-amber" />}
                         </div>
                         <div className="space-y-3">
                            <div className="flex items-center gap-3">
                               <span className="px-3 py-1 rounded-full bg-rose/10 text-rose text-[10px] font-bold uppercase tracking-widest">{item.reason}</span>
                               <span className="text-xs text-gray-500 font-medium">{item.time}</span>
                            </div>
                            <p className="text-white font-medium leading-relaxed italic border-l-2 border-white/10 pl-4">
                               "{item.content}"
                            </p>
                            <div className="text-xs text-gray-500">
                               Flagged by <span className="text-white font-bold">{item.actor}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex flex-col gap-3 min-w-[200px]">
                         <button className="w-full py-3 rounded-xl bg-green/10 text-green font-bold text-xs hover:bg-green hover:text-navy transition-all flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Approve Content
                         </button>
                         <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-rose font-bold text-xs hover:bg-rose hover:text-white transition-all flex items-center justify-center gap-2">
                            <XCircle className="w-4 h-4" /> Remove Item
                         </button>
                         <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 font-bold text-xs hover:text-white transition-all flex items-center justify-center gap-2">
                            <Eye className="w-4 h-4" /> View Context
                         </button>
                      </div>
                   </div>
                </div>
              ))}

              <div className="p-8 rounded-[40px] bg-white/[0.01] border border-white/5 border-dashed flex items-center justify-center text-center">
                 <div className="text-sm text-gray-600 font-medium flex items-center gap-2 italic">
                    <AlertTriangle className="w-4 h-4" /> Automated moderation is currently handling 92% of traffic.
                 </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
