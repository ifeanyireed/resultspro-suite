import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/axiosConfig';
import { Archive, Trash2, Eye, Download, Clock, CheckCircle, AlertCircle, X, FileText, Plus } from 'lucide-react';
import { Share01 } from '@/lib/hugeicons-compat';
import { useNavigate } from 'react-router-dom';
import { CompactGradebook } from '@/components/gradebook/CompactGradebook';
import { SocialShareCard } from '@/components/SocialShareCard';
import { getTemplate } from '@/lib/gradebookTemplates';
import { School, SchoolResult } from '@/lib/schoolData';

interface ResultsInstance {
  id: string;
  instanceName: string;
  className: string;
  classId: string;
  sessionName: string;
  sessionId: string;
  termName: string;
  termId: string;
  status: 'active' | 'archived';
  totalStudents: number;
  createdAt: string;
  createdBy?: string;
  csvFileUrl?: string;
  gradebookData?: any;
}

interface Class {
  id: string;
  name: string;
}

interface Session {
  id: string;
  name: string;
}

export const ResultsEntryPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [instances, setInstances] = useState<ResultsInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredInstances, setFilteredInstances] = useState<ResultsInstance[]>([]);
  const [school, setSchool] = useState<School | null>(null);
  const [usage, setUsage] = useState<any>(null);

  // Filter states
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all'); // all, active, archived

  // Modal states
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [showConfirmArchive, setShowConfirmArchive] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [archiving, setArchiving] = useState<string | null>(null);
  
  // View Modal states
  const [viewingInstance, setViewingInstance] = useState<ResultsInstance | null>(null);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);
  const [showSocialPreview, setShowSocialPreview] = useState(false);

  // Load instances and metadata
  useEffect(() => {
    loadInstances();
    loadMetadata();
    loadSchoolInfo();
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const response = await axiosInstance.get('/payment/subscription/usage');
      if (response.data.success) {
        setUsage(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    }
  };

  const loadSchoolInfo = async () => {
    try {
      const schoolId = localStorage.getItem('schoolId');
      if (schoolId) {
        const schoolRes = await axiosInstance.get(`/onboarding/school/${schoolId}`);
        if (schoolRes.data.data) {
          const s = schoolRes.data.data;
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
          });
        }
      }
    } catch (error) {
      console.error('Failed to load school info:', error);
    }
  };

  // Extract unique sessions from instances
  useEffect(() => {
    if (instances.length > 0) {
      const uniqueSessions = Array.from(
        new Map(
          instances
            .filter(inst => inst.sessionName)
            .map(inst => [inst.sessionName, { id: inst.sessionId, name: inst.sessionName }])
        ).values()
      );
      setSessions(uniqueSessions);
    }
  }, [instances]);

  // Filter instances when filters change
  useEffect(() => {
    let filtered = instances;

    if (selectedClass) {
      filtered = filtered.filter(i => i.className === selectedClass || i.classId === selectedClass);
    }

    if (selectedSession) {
      filtered = filtered.filter(i => i.sessionName === selectedSession || i.sessionId === selectedSession);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(i => i.status === selectedStatus);
    }

    setFilteredInstances(filtered);
  }, [instances, selectedClass, selectedSession, selectedStatus]);

  const loadInstances = async () => {
    try {
      const response = await axiosInstance.get('/results-setup/instances');

      if (response.data.success) {
        // Parse instances and extract class/session names from related objects
        const parsed = response.data.data.map((inst: any) => {
          // Try to find session/term names from related objects first
          let sessionName = inst.session?.name || inst.sessionName;
          let termName = inst.term?.name || inst.termName;
          
          // Only fallback to ID slice if absolutely necessary, but add a label
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
    } catch (error: any) {
      console.error('Error loading instances:', error);
      toast({
        title: 'Error',
        description: 'Failed to load results instances',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMetadata = async () => {
    try {
      // Load classes for this school
      try {
        const classRes = await axiosInstance.get('/onboarding/classes');
        if (classRes.data.success && Array.isArray(classRes.data.data?.classes)) {
          setClasses(classRes.data.data.classes);
        } else if (classRes.data.data?.classes && Array.isArray(classRes.data.data.classes)) {
          setClasses(classRes.data.data.classes);
        } else {
          setClasses([]);
        }
      } catch (err) {
        console.warn('Failed to load classes, will extract from instances:', err);
        setClasses([]);
      }
    } catch (error) {
      console.error('Error loading metadata:', error);
      setClasses([]);
      setSessions([]);
    }
  };

  const handleArchive = async (instanceId: string) => {
    try {
      setArchiving(instanceId);
      const response = await axiosInstance.put(`/results-setup/instances/${instanceId}/archive`, {});

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Instance archived successfully',
        });
        
        // Update local state
        setInstances(instances.map(i => 
          i.id === instanceId ? { ...i, status: 'archived' } : i
        ));
        setShowConfirmArchive(null);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to archive instance',
        variant: 'destructive',
      });
    } finally {
      setArchiving(null);
    }
  };

  const handleDelete = async (instanceId: string) => {
    try {
      setDeleting(instanceId);
      const response = await axiosInstance.delete(`/results-setup/instances/${instanceId}`);

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Instance deleted successfully',
        });
        
        // Update local state
        setInstances(instances.filter(i => i.id !== instanceId));
        setShowConfirmDelete(null);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete instance',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleDownloadCSV = async (instance: ResultsInstance) => {
    try {
      const response = await axiosInstance.get(
        `/results-setup/instances/${instance.id}/download-csv`,
        { responseType: 'blob' }
      );

      // Create download link
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${instance.instanceName}-results.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'CSV downloaded successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to download CSV',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-400">Loading instances...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Results Management</h2>
          <p className="text-gray-400 text-sm">View, manage, and export student results</p>
          {usage && (
            <div className={`flex items-center gap-1.5 mt-2 font-black uppercase tracking-tighter text-[10px] ${usage.results.remaining < 10 ? 'text-red-400' : 'text-blue-400'}`}>
              <AlertCircle className="w-3 h-3" />
              <span>{usage.results.remaining} Result Instance spots left for this term ({usage.results.termName})</span>
            </div>
          )}
        </div>
        
        <button
          onClick={() => navigate('/school-admin/results-setup?fresh=true')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shrink-0 h-fit"
        >
          <Plus className="w-4 h-4" />
          New Results Instance
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-gray-300 text-sm font-medium mb-2 block">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-blue-400 outline-none"
            >
              <option value="">All Classes</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-300 text-sm font-medium mb-2 block">Session</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-blue-400 outline-none"
            >
              <option value="">All Sessions</option>
              {sessions.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-300 text-sm font-medium mb-2 block">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-blue-400 outline-none"
            >
              <option value="all">All Instances</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="text-gray-300 text-sm font-medium mb-2 block">Results</label>
            <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm">
              {filteredInstances.length} instance{filteredInstances.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

        {/* Instances Table */}
        {filteredInstances.length > 0 ? (
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Instance Name</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Class</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Session</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Students</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Status</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Created</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstances.map((instance, idx) => (
                  <tr key={instance.id} className={`border-t border-[rgba(255,255,255,0.07)] ${idx % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{instance.instanceName}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{instance.className}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{instance.sessionName}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{instance.totalStudents}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {instance.status === 'active' ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm">Active</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-400 text-sm">Archived</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(instance.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setViewingInstance(instance);
                            setSelectedStudentIndex(0);
                            setShowSocialPreview(false);
                          }}
                          className="text-blue-400 hover:text-blue-300 p-1 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadCSV(instance)}
                          className="text-green-400 hover:text-green-300 p-1 transition-colors"
                          title="Download CSV"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {instance.status === 'active' && (
                          <button
                            onClick={() => setShowConfirmArchive(instance.id)}
                            className="text-yellow-400 hover:text-yellow-300 p-1 transition-colors"
                            title="Archive"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setShowConfirmDelete(instance.id)}
                          className="text-red-400 hover:text-red-300 p-1 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No results instances found</p>
            <button
              onClick={() => navigate('/school-admin/results-setup?fresh=true')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Create First Instance
            </button>
          </div>
        )}

      {/* View Instance Modal */}
      {viewingInstance && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-white/10 rounded-[30px] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div>
                <h3 className="text-xl font-bold text-white">{viewingInstance.instanceName}</h3>
                <p className="text-sm text-gray-400">{viewingInstance.className} • {viewingInstance.sessionName} • {viewingInstance.termName}</p>
              </div>
              <button 
                onClick={() => setViewingInstance(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4">
              {/* Sidebar: Student List */}
              <div className="lg:col-span-1 border-r border-white/10 overflow-y-auto bg-white/[0.02] p-4 custom-scrollbar">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Students ({viewingInstance.gradebookData?.length || 0})</h4>
                <div className="space-y-1">
                  {viewingInstance.gradebookData?.map((student: SchoolResult, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedStudentIndex(idx)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                        selectedStudentIndex === idx ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-gray-400'
                      }`}
                    >
                      <div className="truncate">
                        <p className={`font-medium text-sm ${selectedStudentIndex === idx ? 'text-white' : 'text-gray-200'}`}>
                          {student.studentName}
                        </p>
                        <p className="text-[10px] opacity-60">{student.admissionNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xs">{student.overallAverage}%</p>
                        <p className="text-[10px] opacity-60">{student.position}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content: Preview Area */}
              <div className="lg:col-span-3 flex flex-col overflow-hidden bg-black/40">
                <div className="p-4 border-b border-white/10 flex items-center gap-2 justify-center">
                  <button
                    onClick={() => setShowSocialPreview(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      !showSocialPreview ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Gradebook
                  </button>
                  <button
                    onClick={() => setShowSocialPreview(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      showSocialPreview ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Share01 className="w-4 h-4" />
                    Social Card
                  </button>
                </div>

                <div className="flex-1 overflow-auto p-8 flex justify-center items-start custom-scrollbar">
                  {viewingInstance.gradebookData && viewingInstance.gradebookData[selectedStudentIndex] ? (
                    <div className="scale-[0.8] md:scale-[0.9] lg:scale-100 origin-top shadow-2xl">
                      {showSocialPreview ? (
                        <SocialShareCard 
                          school={school || {} as any} 
                          result={viewingInstance.gradebookData[selectedStudentIndex]} 
                        />
                      ) : (
                        <CompactGradebook 
                          school={school || {} as any} 
                          result={viewingInstance.gradebookData[selectedStudentIndex]} 
                          template={getTemplate('comprehensive')}
                          previewMode={true}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 mt-20">No data available for this student</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/10 rounded-[20px] p-6 max-w-md mx-auto backdrop-blur-xl shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Delete Instance?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This will permanently delete the results instance. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(null)}
                disabled={deleting === showConfirmDelete}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showConfirmDelete)}
                disabled={deleting === showConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting === showConfirmDelete ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Archive Modal */}
      {showConfirmArchive && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/10 rounded-[20px] p-6 max-w-md mx-auto backdrop-blur-xl shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Archive Instance?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This will archive the instance. You can restore it later from the archived instances list.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmArchive(null)}
                disabled={archiving === showConfirmArchive}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleArchive(showConfirmArchive)}
                disabled={archiving === showConfirmArchive}
                className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {archiving === showConfirmArchive ? 'Archiving...' : 'Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsEntryPage;
