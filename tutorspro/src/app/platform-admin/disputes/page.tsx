"use client";

import { 
  AlertCircle, 
  MessageSquare, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle,
  Clock,
  ChevronRight,
  Gavel,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getDisputes } from '@/lib/platform.api';

export default function DisputeResolution() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const data = await getDisputes();
        setDisputes(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch disputes');
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
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
          <p className="font-bold mb-2">Error Loading Disputes</p>
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
            <h1 className="text-3xl font-display font-bold text-white mb-2">Dispute Resolution</h1>
            <p className="text-gray-400">Manage student-tutor conflicts, refund requests, and quality complaints.</p>
          </div>
          <div className="flex p-1 rounded-2xl bg-white/5 border border-white/5">
            {['All', 'Open', 'Review', 'Closed'].map((tab) => (
              <button key={tab} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'Open' ? 'bg-green text-navy' : 'text-gray-500 hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green transition-colors" />
            <input 
              type="text" 
              placeholder="Search disputes by ID, user or tutor..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-green/50 transition-all"
            />
          </div>
          <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-bold text-sm hover:text-white transition-all flex items-center gap-2">
             <Filter className="w-4 h-4" /> Priority
          </button>
        </div>

        {/* Disputes Grid */}
        <div className="grid grid-cols-1 gap-4">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all flex flex-col md:flex-row items-center justify-between gap-6 group cursor-pointer">
               <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    dispute.priority === 'High' ? 'bg-rose/10 text-rose' : dispute.priority === 'Medium' ? 'bg-amber/10 text-amber' : 'bg-blue/10 text-blue'
                  }`}>
                     <Gavel className="w-7 h-7" />
                  </div>
                  <div>
                     <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-bold text-white group-hover:text-green transition-colors">{dispute.id}</h4>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                          dispute.priority === 'High' ? 'bg-rose text-white' : 'bg-white/10 text-gray-400'
                        }`}>
                          {dispute.priority} Priority
                        </span>
                     </div>
                     <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <span className="text-white">{dispute.type}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                        <span>Submitted by {dispute.user}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                        <span>{dispute.submitted}</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  <div className="flex flex-col items-end">
                     <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Status</div>
                     <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${dispute.status === 'Open' ? 'bg-green animate-pulse' : 'bg-gray-600'}`} />
                        <span className="text-sm text-white font-medium">{dispute.status}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="px-6 py-3 rounded-xl bg-green/10 text-green font-bold text-xs hover:bg-green hover:text-navy transition-all">
                        Take Action
                     </button>
                     <button className="p-3 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all">
                        <MoreVertical className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Resolution History Note */}
        <div className="mt-12 text-center">
           <p className="text-gray-500 text-sm">Disputes are logged with a full audit trail of session recordings and chat logs. <button className="text-green font-bold hover:underline">View Ruling Guidelines</button></p>
        </div>
      </div>
    </main>
  );
}
