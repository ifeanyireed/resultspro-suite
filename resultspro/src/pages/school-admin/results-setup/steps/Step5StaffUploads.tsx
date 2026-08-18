import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Link as LinkIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { LoadingSpinner, InlineLoadingSpinner } from '@/components/LoadingSpinner';
import axiosInstance from '@/lib/axiosConfig';

interface TeacherSignature {
  classId: string;
  className: string;
  teacherName: string;
  teacherEmail: string;
  teacherSignatureUrl?: string;
  teacherSignatureS3Key?: string;
}

interface Step5Props {
  onNext: (data: any) => Promise<void>;
  onPrevious: () => void;
  initialData?: any;
  isLoading?: boolean;
  sessionTermData?: any;
}

export const Step5StaffUploads = ({
  onNext,
  onPrevious,
  initialData,
  isLoading = false,
  sessionTermData,
}: Step5Props) => {
  const { toast } = useToast();
  const [principalName, setPrincipalName] = useState(initialData?.principalName || '');
  const [principalSignatureUrl, setPrincipalSignatureUrl] = useState<string | null>(
    initialData?.principalSignatureUrl || null
  );
  const [principalS3Key, setPrincipalS3Key] = useState<string | null>(
    initialData?.principalS3Key || null
  );
  const [teacherSignatures, setTeacherSignatures] = useState<TeacherSignature[]>(
    initialData?.staffData ? (typeof initialData.staffData === 'string' ? JSON.parse(initialData.staffData) : initialData.staffData) : []
  );
  const [classes, setClasses] = useState<any[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [availableTeachers, setAvailableTeachers] = useState<any[]>([]);

  // Fetch classes and existing teachers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingClasses(true);
        const schoolId = localStorage.getItem('schoolId');

        const [classesRes, teachersRes] = await Promise.all([
          axiosInstance.get('/onboarding/classes'),
          axiosInstance.get(`/school/teachers?schoolId=${schoolId}&limit=100`)
        ]);

        const fetchedClasses = classesRes.data.data?.classes || [];
        setClasses(fetchedClasses);
        
        const fetchedTeachers = teachersRes.data.data || [];
        setAvailableTeachers(fetchedTeachers);

        // Initialize teacher signatures for each class if not already present
        if (teacherSignatures.length === 0 && fetchedClasses.length > 0) {
          const initialized = fetchedClasses.map((cls: any) => {
            // Try to find a teacher already assigned to this class
            const assignedTeacher = fetchedTeachers.find((t: any) => t.classId === cls.id);
            
            return {
              classId: cls.id,
              className: cls.name,
              teacherName: assignedTeacher?.fullName || '',
              teacherEmail: assignedTeacher?.email || '',
              teacherSignatureUrl: assignedTeacher?.signatureUrl || null,
              teacherSignatureS3Key: assignedTeacher?.signatureS3Key || null,
            };
          });
          setTeacherSignatures(initialized);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load staff data',
          variant: 'destructive',
        });
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchData();
  }, [toast]);

  const saveRealtime = async (updatedStaff: TeacherSignature[]) => {
    try {
      await axiosInstance.patch(
        '/results-setup/staff-data',
        {
          principalName,
          principalSignatureUrl,
          principalS3Key,
          staffData: updatedStaff,
        }
      );
    } catch (error) {
      console.error('Failed to save staff data:', error);
    }
  };

  const handlePrincipalNameChange = (name: string) => {
    setPrincipalName(name);
    saveRealtime(teacherSignatures);
  };

  const handleTeacherNameChange = (classId: string, teacherName: string) => {
    const updated = teacherSignatures.map(sig =>
      sig.classId === classId ? { ...sig, teacherName } : sig
    );
    setTeacherSignatures(updated);
    saveRealtime(updated);
  };

  const handleTeacherEmailChange = (classId: string, teacherEmail: string) => {
    const updated = teacherSignatures.map(sig =>
      sig.classId === classId ? { ...sig, teacherEmail } : sig
    );
    setTeacherSignatures(updated);
    saveRealtime(updated);
  };

  const autoLinkTeacher = (classId: string, email: string) => {
    const teacher = availableTeachers.find(t => t.email.toLowerCase() === email.toLowerCase());
    if (teacher) {
      const updated = teacherSignatures.map(sig =>
        sig.classId === classId ? { 
          ...sig, 
          teacherName: teacher.fullName || `${teacher.firstName} ${teacher.lastName}`,
          teacherSignatureUrl: teacher.signatureUrl,
          teacherSignatureS3Key: teacher.signatureS3Key
        } : sig
      );
      setTeacherSignatures(updated);
      saveRealtime(updated);
      toast({
        title: 'Teacher Linked',
        description: `Found existing record for ${email}`,
      });
    }
  };

  const handleSignatureUpload = async (
    file: File,
    signatureType: 'principal' | 'teacher',
    classId?: string
  ) => {
    try {
      setUploading(signatureType === 'principal' ? 'principal' : classId || '');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signatureType', signatureType);
      if (classId) {
        formData.append('classId', classId);
      }

      const response = await axiosInstance.post(
        '/results-setup/upload-signature',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.data.success) {
        const signatureUrl = response.data.s3Url;
        const s3Key = response.data.s3Key;

        if (signatureType === 'principal') {
          setPrincipalSignatureUrl(signatureUrl);
          setPrincipalS3Key(s3Key);
          
          await axiosInstance.patch('/results-setup/staff-data', {
            principalName,
            principalSignatureUrl: signatureUrl,
            principalS3Key: s3Key,
            staffData: teacherSignatures,
          });
        } else if (classId) {
          const updated = teacherSignatures.map(sig =>
            sig.classId === classId ? { 
              ...sig, 
              teacherSignatureUrl: signatureUrl,
              teacherSignatureS3Key: s3Key 
            } : sig
          );
          setTeacherSignatures(updated);
          saveRealtime(updated);
        }

        toast({
          title: 'Success',
          description: 'Signature uploaded and saved',
        });
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to upload signature',
        variant: 'destructive',
      });
    } finally {
      setUploading(null);
    }
  };

  const onSubmit = async () => {
    try {
      setSubmitError(null);

      if (!principalName.trim()) {
        setSubmitError('Principal name is required');
        return;
      }

      if (!principalSignatureUrl) {
        setSubmitError('Principal signature is required');
        return;
      }

      const allTeachersComplete = teacherSignatures.every(sig => sig.teacherName && sig.teacherEmail && sig.teacherSignatureUrl);
      if (!allTeachersComplete) {
        setSubmitError('All classes must have a form teacher name, email, and signature');
        return;
      }

      const payload = {
        ...sessionTermData,
        principalName,
        principalSignatureUrl,
        principalS3Key,
        staffData: teacherSignatures,
      };

      const response = await axiosInstance.post('/results-setup/step/5', payload);

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Staff uploads completed',
        });
        await onNext(response.data.data);
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to save staff uploads';
      setSubmitError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  if (loadingClasses) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-400">Loading staff data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Staff Uploads</h2>
        <p className="text-gray-400 text-sm">
          Add principal details and assign form teachers with their signatures. These will appear on student reports.
        </p>
      </div>

      {submitError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3 items-center">
          <AlertCircle className="text-red-400 w-5 h-5" />
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      {/* Principal Section */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] rounded-[20px] p-8 backdrop-blur-xl space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          Principal Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block font-medium">Principal Name *</label>
              <input
                type="text"
                value={principalName}
                onChange={(e) => handlePrincipalNameChange(e.target.value)}
                placeholder="Enter principal name"
                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-white focus:outline-none focus:border-blue-500/50 focus:bg-[rgba(255,255,255,0.05)] transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-gray-400 text-sm mb-2 block font-medium">Principal Signature *</label>
            {principalSignatureUrl ? (
              <div className="space-y-4">
                <div className="border border-[rgba(255,255,255,0.1)] rounded-xl p-6 bg-white/5 flex items-center justify-center min-h-[120px]">
                  <img src={principalSignatureUrl} alt="Principal signature" className="h-20 object-contain brightness-0 invert opacity-80" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('principal-sig-upload')?.click()}
                  disabled={uploading === 'principal'}
                  className="w-full border-dashed bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-300 h-11 rounded-xl"
                >
                  {uploading === 'principal' ? <InlineLoadingSpinner size="sm" /> : <Upload className="w-4 h-4 mr-2" />}
                  Change Signature
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full h-[120px] border-2 border-dashed border-white/10 bg-white/[0.02] hover:border-blue-500/50 hover:bg-blue-500/5 text-gray-400 hover:text-blue-400 rounded-xl transition-all flex flex-col items-center justify-center gap-2"
                onClick={() => document.getElementById('principal-sig-upload')?.click()}
                disabled={uploading === 'principal'}
              >
                {uploading === 'principal' ? <LoadingSpinner size="sm" /> : (
                  <>
                    <Upload className="w-8 h-8 opacity-50" />
                    <span className="font-medium">Upload Principal Signature</span>
                  </>
                )}
              </Button>
            )}
            <input id="principal-sig-upload" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleSignatureUpload(e.target.files[0], 'principal')} hidden />
          </div>
        </div>
      </div>

      {/* Teachers Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <h3 className="text-xl font-bold text-white">Form Teachers</h3>
            <p className="text-gray-500 text-sm mt-1">Assign teachers and signatures for each class</p>
          </div>
          <span className="text-[10px] text-blue-400 uppercase tracking-wider font-bold bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">Auto-sync Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teacherSignatures.map((teacher) => (
            <div key={teacher.classId} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] rounded-[20px] p-6 space-y-5 backdrop-blur-xl hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h4 className="font-bold text-lg text-blue-400">{teacher.className}</h4>
                {teacher.teacherSignatureUrl && (
                  <div className="flex items-center gap-1.5 text-green-500 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">Ready</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black mb-1.5 block tracking-widest">Teacher Email *</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={teacher.teacherEmail}
                        onChange={(e) => handleTeacherEmailChange(teacher.classId, e.target.value)}
                        onBlur={(e) => autoLinkTeacher(teacher.classId, e.target.value)}
                        placeholder="teacher@school.com"
                        className="w-full px-3 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:bg-white/10 focus:outline-none transition-all pr-10"
                      />
                      <button 
                        onClick={() => autoLinkTeacher(teacher.classId, teacher.teacherEmail)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-400 transition-colors"
                        title="Auto-fill from Teachers list"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black mb-1.5 block tracking-widest">Full Name *</label>
                    <input
                      type="text"
                      value={teacher.teacherName}
                      onChange={(e) => handleTeacherNameChange(teacher.classId, e.target.value)}
                      placeholder="Enter teacher name"
                      className="w-full px-3 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:bg-white/10 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-black mb-1.5 block tracking-widest">Teacher Signature *</label>
                  {teacher.teacherSignatureUrl ? (
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-xl border border-white/10 p-4 h-24 flex items-center justify-center group relative overflow-hidden">
                        <img src={teacher.teacherSignatureUrl} className="h-full object-contain brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                            onClick={() => document.getElementById(`teacher-sig-${teacher.classId}`)?.click()}
                            disabled={uploading === teacher.classId}
                          >
                            Replace
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full h-24 border-dashed border-white/10 bg-white/[0.02] hover:border-blue-500/50 hover:bg-blue-500/5 text-gray-400 hover:text-blue-400 rounded-xl transition-all flex flex-col items-center justify-center gap-1"
                      onClick={() => document.getElementById(`teacher-sig-${teacher.classId}`)?.click()}
                      disabled={uploading === teacher.classId}
                    >
                      {uploading === teacher.classId ? <InlineLoadingSpinner size="sm" /> : (
                        <>
                          <Upload className="w-6 h-6 opacity-40" />
                          <span className="text-xs font-medium">Upload Signature</span>
                        </>
                      )}
                    </Button>
                  )}
                  <input id={`teacher-sig-${teacher.classId}`} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleSignatureUpload(e.target.files[0], 'teacher', teacher.classId)} hidden />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-white/5 pt-8 flex gap-4 justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onPrevious} 
          disabled={isLoading}
          className="border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 rounded-xl h-12 px-8"
        >
          Back
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={isLoading || uploading !== null} 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-blue-600/20 min-w-[200px]"
        >
          {isLoading ? <InlineLoadingSpinner size="sm" /> : 'Next: Assign Students'}
        </Button>
      </div>
    </div>
  );
};
