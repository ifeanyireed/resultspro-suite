"use client";

import { 
  ShieldCheck, 
  FileText, 
  Video, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getTutorVerifications, updateTutorVerificationStatus } from '@/lib/platform.api';

interface TutorVerification {
  id: number;
  name: string;
  subjects: string[];
  documents: number;
  video: boolean;
  submitted: string;
}

export default function TutorVerification() {
  const [selectedTutor, setSelectedTutor] = useState<number | null>(null);
  const [pendingTutors, setPendingTutors] = useState<TutorVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    setIsLoading(true);
    try {
      const data = await getTutorVerifications();
      setPendingTutors(data);
    } catch (error) {
      toast.error("Failed to load tutor verifications.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (verificationId: number, status: string) => {
    const toastId = toast.loading(`Updating verification status to ${status}...`);
    try {
      const response = await updateTutorVerificationStatus(String(verificationId), status);
      toast.success(response.message || "Verification status updated!", { id: toastId });
      fetchVerifications();
      setSelectedTutor(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status.", { id: toastId });
    }
  };

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Tutor Verification Queue</h1>
          <p className="text-gray-400">Review qualifications, identities, and sample lessons for new tutor applications.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-gray-500 text-center py-10">Loading applications...</p>
              ) : (
                pendingTutors.map((tutor) => (
                <div 
                  key={tutor.id} 
                  onClick={() => setSelectedTutor(tutor.id)}
                  className={`p-6 rounded-[32px] border transition-all cursor-pointer flex items-center justify-between group ${
                    selectedTutor === tutor.id ? 'bg-green/10 border-green/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                  }`}
                >
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-green transition-colors font-bold text-xl">
                         {tutor.name.charAt(0)}
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-white mb-1">{tutor.name}</h3>
                         <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                            <span className="text-green">{tutor.subjects.join(', ')}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-6">
                      <ChevronRight className={`w-5 h-5 transition-all ${selectedTutor === tutor.id ? 'text-green translate-x-1' : 'text-gray-600'}`} />
                   </div>
                </div>
              )))}
            </div>
          </div>

          {/* Review Panel Section */}
          <div className="space-y-8">
             {selectedTutor ? (
               <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 animate-in fade-in slide-in-from-right-4 duration-500 sticky top-8">
                  <div className="text-center mb-8">
                     <div className="w-20 h-20 rounded-3xl bg-green/10 flex items-center justify-center text-green mx-auto mb-4 border border-green/20">
                        <ShieldCheck className="w-10 h-10" />
                     </div>
                     <h2 className="text-2xl font-display font-bold text-white mb-1">Reviewing Application</h2>
                     <p className="text-sm text-gray-500">ID: #TTR-2026-00{selectedTutor}</p>
                  </div>
                  <div className="space-y-3">
                     <button onClick={() => handleUpdateStatus(selectedTutor, 'Approved')} className="w-full py-4 rounded-2xl bg-green text-navy font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-green/10">
                        <CheckCircle2 className="w-5 h-5" /> Approve Tutor
                     </button>
                     <button onClick={() => handleUpdateStatus(selectedTutor, 'Rejected')} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-rose font-bold flex items-center justify-center gap-2 hover:bg-rose/5 transition-all">
                        <XCircle className="w-5 h-5" /> Reject with Notes
                     </button>
                  </div>
               </div>
             ) : (
               <div className="p-12 rounded-[40px] bg-white/[0.01] border border-white/5 border-dashed flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-700 mb-6">
                     <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-white font-bold mb-2">No Tutor Selected</h3>
                  <p className="text-xs text-gray-600">Select an application from the queue to start the verification process.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </main>
  );
}
