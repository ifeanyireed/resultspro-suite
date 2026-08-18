import React, { useState, useEffect } from 'react';
import { 
  Send, 
  CheckCircle, 
  Eye, 
  Share01, 
  Search, 
  X,
  FileText,
  Printer,
  Mail,
  AlertCircle
} from '@/lib/hugeicons-compat';
import axiosInstance from '@/lib/axiosConfig';
import { CompactGradebook } from '@/components/gradebook';
import { SocialShareCard } from '@/components/SocialShareCard';
import { School, SchoolResult } from '@/lib/schoolData';
import { getTemplate } from '@/lib/gradebookTemplates';
import { InlineLoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResultsInstance {
  id: string;
  instanceName: string;
  className: string;
  sessionName: string;
  termName: string;
  totalStudents: number;
  gradebookData?: any;
  status: string;
  createdAt: string;
}

const ResultsPublishing: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [instances, setInstances] = useState<ResultsInstance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<ResultsInstance | null>(null);
  
  const [previewStudent, setPreviewStudent] = useState<SchoolResult | null>(null);
  const [previewType, setPreviewType] = useState<'gradebook' | 'social' | null>(null);
  
  const [school, setSchool] = useState<School | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [emailingStudent, setEmailingStudent] = useState(false);
  const gradesheetRef = React.useRef<HTMLDivElement>(null);
  
  // Publishing options
  const [publishToResultChecker, setPublishToResultChecker] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(false);

  useEffect(() => {
    fetchInstances();
    loadSchoolInfo();
  }, []);

  const loadSchoolInfo = async () => {
    try {
      const schoolId = localStorage.getItem('schoolId');
      if (schoolId) {
        const schoolRes = await axiosInstance.get(`/onboarding/school/${schoolId}`);
        if (schoolRes.data.data) {
          const s = schoolRes.data.data;
          const tier = s.subscriptionTier?.toUpperCase();
          const isPro = tier === 'PRO' || tier === 'PREMIUM';
          
          setSchool({
            slug: s.id,
            name: s.name,
            motto: s.motto || '',
            logo: s.logoUrl,
            primaryColor: s.primaryColor || '#3b82f6',
            secondaryColor: s.secondaryColor || '#1e40af',
            accentColor: s.accentColor || '#FCD34D',
            contactEmail: s.contactEmail,
            contactPhone: s.contactPhone,
            fullAddress: s.fullAddress,
            subscriptionTier: s.subscriptionTier,
          });

          // Default to true only for Pro users
          if (isPro) {
            setPublishToResultChecker(true);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load school info:', error);
    }
  };

  const fetchInstances = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/results-setup/instances');

      if (response.data.success) {
        const parsed = response.data.data.map((inst: any) => {
          let sessionName = inst.session?.name || inst.sessionName;
          let termName = inst.term?.name || inst.termName;
          
          if (!sessionName && inst.sessionId) {
            sessionName = `Session ${inst.sessionId.slice(0, 8)}`;
          }
          if (!termName && inst.termId) {
            termName = `Term ${inst.termId.slice(0, 8)}`;
          }
          
          return {
            ...inst,
            className: inst.class?.name || inst.classId || 'Unknown',
            sessionName: sessionName || 'Unknown Session',
            termName: termName || 'Unknown Term',
          };
        });
        setInstances(parsed.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (error) {
      console.error('Failed to fetch instances:', error);
      toast({
        title: 'Error',
        description: 'Failed to load results instances',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishAll = async () => {
    if (!selectedInstance) return;
    
    try {
      setPublishing(true);
      
      const response = await axiosInstance.post(`/results-setup/instances/${selectedInstance.id}/publish`, {
        sendEmail,
        sendSms,
        publishToResultChecker,
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message || `Successfully published ${response.data.count} results`,
        });
        
        // Refresh instances to update status
        fetchInstances();
        setSelectedInstance({
          ...selectedInstance,
          status: 'published'
        });
      }
    } catch (error: any) {
      console.error('Publishing failed:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to publish results',
        variant: 'destructive',
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleEmailSingle = async (student: SchoolResult) => {
    if (!selectedInstance) return;
    
    try {
      setEmailingStudent(true);
      const response = await axiosInstance.post(`/results-setup/instances/${selectedInstance.id}/publish`, {
        sendEmail: true,
        sendSms: false,
        publishToResultChecker: false,
        studentAdmissionNumber: student.admissionNumber
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: `Result emailed to ${student.studentName}'s parent`,
        });
      }
    } catch (error: any) {
      console.error('Emailing failed:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to email result',
        variant: 'destructive',
      });
    } finally {
      setEmailingStudent(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!gradesheetRef.current || !previewStudent) return;
    
    try {
      toast({
        title: 'Generating PDF',
        description: 'Please wait while we prepare your document...',
      });

      const canvas = await html2canvas(gradesheetRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${previewStudent.studentName}_Gradebook.pdf`);
      
      toast({
        title: 'Success',
        description: 'Result downloaded successfully',
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <InlineLoadingSpinner size="lg" />
        <p className="mt-4 text-gray-400">Loading instances...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Results Publishing</h2>
          <p className="text-gray-400 text-sm mt-1">Select an instance to review and publish</p>
        </div>
      </div>

      {/* Instance Selection */}
      <div className="bg-[rgba(255,255,255,0.02)] p-6 rounded-[20px] border border-[rgba(255,255,255,0.07)]">
        <label className="text-xs text-gray-500 uppercase font-bold mb-3 block">Select Results Instance</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instances.map(inst => (
            <button
              key={inst.id}
              onClick={() => setSelectedInstance(inst)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedInstance?.id === inst.id 
                  ? 'bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/50' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <p className="text-white font-bold truncate">{inst.instanceName}</p>
              <p className="text-xs text-gray-400 mt-1">{inst.className} • {inst.sessionName}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">
                  {inst.totalStudents} Students
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded ${
                  inst.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                  inst.status === 'published' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {inst.status.toUpperCase()}
                </span>
              </div>
            </button>
          ))}
          {instances.length === 0 && (
            <div className="col-span-full py-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
              <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500">No results instances found. Create one in Results Management.</p>
            </div>
          )}
        </div>
      </div>

      {selectedInstance && (
        <>
          {/* Students List */}
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
              <h3 className="text-lg font-semibold text-white">Results Preview: {selectedInstance.instanceName}</h3>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 transition-all">
                  <Printer className="w-3.5 h-3.5" />
                  Print All
                </button>
                <span className="text-xs text-gray-400">{selectedInstance.gradebookData?.length || 0} Students</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/5 bg-white/2.5">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Admission No</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Student Name</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Average</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Position</th>
                    <th className="text-right py-4 px-6 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInstance.gradebookData?.map((student: SchoolResult, i: number) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 text-gray-400 font-mono">{student.admissionNumber}</td>
                      <td className="py-4 px-6 text-white font-medium">{student.studentName}</td>
                      <td className="py-4 px-6">
                        <span className="text-blue-400 font-bold">{student.overallAverage || 0}%</span>
                      </td>
                      <td className="py-4 px-6 text-white">{student.position || '-'}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              setPreviewStudent(student);
                              setPreviewType('gradebook');
                            }}
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all border border-blue-500/20"
                            title="Preview Gradebook"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setPreviewStudent(student);
                              setPreviewType('social');
                            }}
                            className="p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all border border-purple-500/20"
                            title="Preview Social Card"
                          >
                            <Share01 className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-all border border-white/10"
                            title="Print PDF"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Publishing Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Ready to Publish
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/2.5 border border-white/5">
                  <span className="text-gray-400">Total Students in Class</span>
                  <span className="text-white font-bold">{selectedInstance.totalStudents}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/2.5 border border-white/5">
                  <span className="text-gray-400">Results Processed</span>
                  <span className="text-green-400 font-bold">{selectedInstance.gradebookData?.length || 0}</span>
                </div>
                <button 
                  onClick={handlePublishAll}
                  disabled={publishing || !selectedInstance.gradebookData}
                  className="w-full mt-4 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {publishing ? (
                    <InlineLoadingSpinner size="sm" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {selectedInstance.status === 'published' ? 'Republish Results' : 'Publish Selected Results'}
                </button>
              </div>
            </div>

            <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
              <h3 className="text-lg font-semibold text-white mb-6">Delivery Channels</h3>
              <div className="space-y-4">
                {/* Result Checker Channel */}
                <label className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                  school?.subscriptionTier?.toUpperCase() === 'PRO' || school?.subscriptionTier?.toUpperCase() === 'PREMIUM'
                    ? 'hover:bg-white/5 cursor-pointer border-transparent hover:border-white/5'
                    : 'opacity-50 cursor-not-allowed border-white/5 bg-black/20'
                }`}>
                  <input 
                    type="checkbox" 
                    checked={publishToResultChecker}
                    onChange={(e) => setPublishToResultChecker(e.target.checked)}
                    disabled={!(school?.subscriptionTier?.toUpperCase() === 'PRO' || school?.subscriptionTier?.toUpperCase() === 'PREMIUM')}
                    className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-500 disabled:opacity-50" 
                  />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">Result Checker Portal</p>
                        {!(school?.subscriptionTier?.toUpperCase() === 'PRO' || school?.subscriptionTier?.toUpperCase() === 'PREMIUM') && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold">PRO</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {school?.subscriptionTier?.toUpperCase() === 'PRO' || school?.subscriptionTier?.toUpperCase() === 'PREMIUM'
                          ? 'Make results searchable via PIN on public portal'
                          : 'Searchable results portal (Pro Plan only)'}
                      </p>
                    </div>
                  </div>
                </label>

                {/* Email Channel */}
                <label className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/5 transition-all">
                  <input 
                    type="checkbox" 
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-500" 
                  />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Email Delivery</p>
                      <p className="text-xs text-gray-500">Send PDF gradebooks to parent emails</p>
                    </div>
                  </div>
                </label>

                {/* SMS Channel */}
                <label className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                  school?.subscriptionTier?.toUpperCase() === 'PRO' || school?.subscriptionTier?.toUpperCase() === 'PREMIUM'
                    ? 'hover:bg-white/5 cursor-pointer border-transparent hover:border-white/5'
                    : 'opacity-50 cursor-not-allowed border-white/5 bg-black/20'
                }`}>
                  <input 
                    type="checkbox" 
                    checked={sendSms}
                    onChange={(e) => setSendSms(e.target.checked)}
                    disabled={!(school?.subscriptionTier?.toUpperCase() === 'PRO' || school?.subscriptionTier?.toUpperCase() === 'PREMIUM')}
                    className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-500 disabled:opacity-50" 
                  />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">SMS Notifications</p>
                        {!(school?.subscriptionTier?.toUpperCase() === 'PRO' || school?.subscriptionTier?.toUpperCase() === 'PREMIUM') && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold">PRO</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Send score summaries via SMS (Pro Plan only)</p>
                    </div>
                  </div>
                </label>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 opacity-80">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Parent Portal</p>
                      <p className="text-xs text-gray-500">Enabled automatically after publishing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Preview Modal */}
      {previewStudent && previewType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-[30px] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2.5">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {previewType === 'gradebook' ? 'Gradebook Preview' : 'Social Card Preview'}
                </h3>
                <p className="text-sm text-gray-400">{previewStudent.studentName} • {selectedInstance?.className}</p>
              </div>
              <button 
                onClick={() => {
                  setPreviewStudent(null);
                  setPreviewType(null);
                }}
                className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-8 flex justify-center bg-black/40">
              <div className="shadow-2xl scale-90 md:scale-100 origin-top" ref={gradesheetRef}>
                {previewType === 'gradebook' ? (
                  <CompactGradebook 
                    school={school || {} as any} 
                    result={previewStudent} 
                    template={getTemplate('comprehensive')} 
                    previewMode={true}
                  />
                ) : (
                  <SocialShareCard 
                    school={school || {} as any} 
                    result={previewStudent} 
                  />
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-white/5 flex justify-end gap-4 bg-white/2.5">
              <button 
                onClick={() => {
                  setPreviewStudent(null);
                  setPreviewType(null);
                }}
                className="px-6 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Result
              </button>
              <button 
                onClick={() => handleEmailSingle(previewStudent)}
                disabled={emailingStudent}
                className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all shadow-lg shadow-green-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {emailingStudent ? <InlineLoadingSpinner size="sm" /> : <Mail className="w-4 h-4" />}
                {emailingStudent ? 'Sending...' : 'Email to Parent'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPublishing;
