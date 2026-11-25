"use client";

import { IconTrophy as Trophy, IconDownload as Download, IconExternalLink as ExternalLink, IconAward as Award, IconShieldCheck as ShieldCheck, IconCalendar as Calendar, IconSearch as Search, IconChevronRight as ChevronRight, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { RoleGate } from '@/components/RoleGate';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/student/certificates');
        setCertificates(res.data || []);
      } catch (err) {
        console.error("Failed to fetch certificates");
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </main>
    );
  }

  const filteredCerts = certificates.filter(cert => 
    cert.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RoleGate allowedRoles={['STUDENT', 'PARENT', 'SUPERADMIN']}>
      <main className="min-h-screen bg-gray-50 pb-24">
                
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          <MotionRise className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black text-gray-900 mb-2">
                My <span className="text-blue">Certificates</span>
              </h1>
              <p className="text-gray-600">Digital proof of your academic achievements and milestones.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search certificates..." 
                  className="w-full md:w-64 bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm text-gray-900 focus:outline-none focus:border-blue transition-all shadow-sm" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </MotionRise>

          <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCerts.length > 0 ? filteredCerts.map((cert) => (
              <div key={cert.id} className="group relative">
                 <div className="relative p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-green/20 text-navy flex items-center justify-center">
                        <Award className="w-8 h-8" />
                      </div>
                      <div className="px-3 py-1 rounded-full bg-green/20 text-[10px] font-bold text-navy uppercase tracking-widest flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-display font-bold text-gray-900 mb-2 group-hover:text-blue transition-colors leading-tight">{cert.title}</h3>
                      <p className="text-xs text-gray-500 mb-6">{cert.issuedBy}</p>
                      
                      <div className="space-y-4 mb-8">
                         <div className="flex items-center gap-3 text-sm text-gray-600">
                           <Calendar className="w-4 h-4 text-gray-400" />
                           <span>Issued on {cert.date}</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-gray-600">
                           <Trophy className="w-4 h-4 text-gray-400" />
                           <span>Grade Achievement: <span className="text-gray-900 font-bold">{cert.grade}</span></span>
                         </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex gap-3">
                      <button className="flex-1 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                         <Download className="w-4 h-4" /> PDF
                      </button>
                      <button className="flex-1 py-3 rounded-xl bg-green text-navy text-xs font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                         <ExternalLink className="w-4 h-4" /> SHARE
                      </button>
                    </div>
                 </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                 <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No certificates found</p>
              </div>
            )}

            {/* Locked / Upcoming Certificate */}
            <div className="p-8 rounded-[40px] bg-white border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center group cursor-help">
               <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                 <Award className="w-8 h-8 text-gray-400" />
               </div>
               <h4 className="text-lg font-bold text-gray-900 mb-2">Next Milestone</h4>
               <p className="text-xs text-gray-500 max-w-[200px] mb-6">Complete the &quot;Chemistry of Life&quot; series to unlock your next certificate.</p>
               <button className="text-xs font-bold text-blue flex items-center gap-2 group-hover:underline">
                 View Requirements <ChevronRight className="w-3 h-3" />
               </button>
            </div>
          </MotionStagger>
          {/* ... verification notice ... */}
          <MotionRise delay={0.1} className="mt-16 p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-green/20 flex items-center justify-center text-navy">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                   <h4 className="text-xl font-display font-bold text-gray-900 mb-1">Authenticity Guaranteed</h4>
                   <p className="text-sm text-gray-600 max-w-lg">All TutorsPRO certificates are digitally signed and verifiable via our public blockchain ledger to prevent fraud.</p>
                </div>
             </div>
             <button className="px-8 py-4 rounded-2xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-all">
                Verify a Certificate
             </button>
          </MotionRise>
        </div>
      </main>
    </RoleGate>
  );
}
