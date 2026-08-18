import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import axiosInstance from '@/lib/axiosConfig';
import { CompactGradebook } from '@/components/gradebook';
import { SocialShareCard } from '@/components/SocialShareCard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ArrowRight01, Download01, Share01, Mail, X, AlertCircle } from '@/lib/hugeicons-compat';
import { Camera, FileText } from '@/lib/hugeicons-compat';
import { getTemplate } from '@/lib/gradebookTemplates';

const ResultChecker: React.FC = () => {
  const { schoolSlug } = useParams<{ schoolSlug: string }>();
  
  const [school, setSchool] = useState<any>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingSchool, setFetchingSchool] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSocialPreview, setShowSocialPreview] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  
  // Modal state
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const [gradesheetRef, setGradesheetRef] = useState<HTMLDivElement | null>(null);
  const [achievementCardRef, setAchievementCardRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (schoolSlug) {
      fetchSchoolInfo();
    }
  }, [schoolSlug]);

  const fetchSchoolInfo = async () => {
    try {
      setFetchingSchool(true);
      // We need a public endpoint to get school info by slug
      const response = await axiosInstance.get(`/onboarding/school/slug/${schoolSlug}`);
      if (response.data.success) {
        setSchool(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch school info:', err);
    } finally {
      setFetchingSchool(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/scratch-cards/validate', {
        pin,
        studentAdmissionNumber: admissionNumber,
      });

      if (response.data.success) {
        setResultData(response.data.data);
        setSubmitted(true);
      } else {
        setError(response.data.error || 'Invalid credentials or scratch card');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to validate scratch card. Please check your PIN and admission number.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!gradesheetRef) return;
    
    try {
      const canvas = await html2canvas(gradesheetRef, {
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
      pdf.save(`${resultData.student.name}_Gradebook.pdf`);
      
      setShowDownloadModal(false);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF');
    }
  };

  const handleGenerateShareImage = async () => {
    if (!achievementCardRef) return;
    
    try {
      setIsGeneratingShare(true);
      setShowShareModal(true);
      
      // Give it a tiny bit of time to render
      setTimeout(async () => {
        const canvas = await html2canvas(achievementCardRef, {
          backgroundColor: '#000000',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: 644,
          height: 618
        });
        
        const imgData = canvas.toDataURL('image/png');
        setShareImage(imgData);
        setIsGeneratingShare(false);
      }, 500);
      
    } catch (err) {
      console.error('Error generating share image:', err);
      setIsGeneratingShare(false);
      alert('Failed to generate share image');
    }
  };

  const handleDownloadShareImage = () => {
    if (!shareImage) return;
    const link = document.createElement('a');
    link.download = `${resultData.student.name}_Achievement.png`;
    link.href = shareImage;
    link.click();
  };

  if (fetchingSchool) {
    return (
      <div className="w-full bg-black text-white min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="mt-4 text-gray-400">Loading school information...</p>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="w-full bg-black text-white min-h-screen flex flex-col items-center justify-center px-4">
        <Navigation />
        <div className="flex flex-col items-center gap-4 mt-20">
          <AlertCircle className="w-16 h-16 text-red-400" />
          <h1 className="text-2xl font-bold">School Not Found</h1>
          <p className="text-gray-400">The school "{schoolSlug}" could not be found.</p>
          <Link to="/" className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const subjects = resultData?.results?.subjects || {};
  const subjectList = Array.isArray(subjects) 
    ? subjects 
    : Object.entries(subjects).map(([name, data]: [string, any]) => ({ name, ...data }));

  // Convert resultData to the format expected by Gradebook and Social Card
  const formattedResult = resultData ? {
    ...resultData.student,
    ...resultData.results,
    studentName: resultData.student.name,
    classLevel: resultData.student.className,
    subjects: subjectList,
    attendance: {
      daysPresent: resultData.results.daysPresent,
      daysSchoolOpen: resultData.results.daysSchoolOpen
    },
    affectiveDomain: resultData.results.affectiveDomain,
    psychomotorDomain: resultData.results.psychomotorDomain,
    examComponents: resultData.results.examComponents,
    staffInfo: resultData.results.staffInfo,
    teacherComments: {
      principal: resultData.results.principalComments,
      classTeacher: resultData.results.classTeacherComments
    }
  } : null;

  return (
    <div className="w-full bg-black text-white">
      <Navigation />

      <section className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden bg-black pt-20 pb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/Hero.png" 
            alt="" 
            className="absolute h-full w-full object-cover inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center w-full">
          <div className="flex items-center justify-start gap-6 mb-6">
            {(school.logoUrl || school.logo) && (
              <img 
                src={school.logoUrl || school.logo} 
                alt="School Logo"
                style={{ maxWidth: '144px', maxHeight: '144px', flexShrink: 0 }}
                className="object-cover rounded-xl"
              />
            )}
            <div className="border-l border-white/20 pl-6 text-left">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                {school.name}
              </h1>
              {school.motto && <p className="text-gray-400 mt-2 italic text-sm">{school.motto}</p>}
            </div>
          </div>

          <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-10 shadow-2xl">
            <h2 className="text-xl font-semibold mb-8 text-blue-400">Result Checker</h2>
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase font-bold ml-1">Admission Number</label>
                <input
                  type="text"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                  className="w-full px-6 py-4 rounded-[15px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-lg"
                  placeholder="e.g. RP/2026/0001"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase font-bold ml-1">Scratch Card PIN</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-6 py-4 rounded-[15px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-lg"
                  placeholder="Enter PIN"
                  required
                />
              </div>

              {error && (
                <div className="p-4 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !admissionNumber.trim() || !pin.trim()}
                className="w-full py-4 rounded-[15px] font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    Check Result
                    <ArrowRight01 className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 text-xs mt-4">
                Verify your results instantly using your scratch card PIN.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Results View Modal (Triggered when result is fetched) */}
      {submitted && resultData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#111] w-full max-w-5xl rounded-[30px] border border-white/10 overflow-hidden flex flex-col shadow-2xl my-8 max-h-[95vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111] flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-white">Academic Results</h3>
                <p className="text-sm text-gray-400">{resultData.student.name} • {resultData.student.className}</p>
              </div>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setResultData(null);
                  setAdmissionNumber('');
                  setPin('');
                }}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-10 flex justify-center items-start custom-scrollbar bg-black/40">
              <div className="origin-top shadow-2xl scale-[0.8] md:scale-[0.9] lg:scale-100 mb-10">
                {showSocialPreview ? (
                  <SocialShareCard 
                    school={{...school, ...(resultData.school || {}), logo: school?.logoUrl || school?.logo || resultData?.school?.logo}} 
                    result={formattedResult as any} 
                  />
                ) : (
                  <div ref={setGradesheetRef} className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                    <CompactGradebook 
                      school={{...school, ...(resultData.school || {}), logo: school?.logoUrl || school?.logo || resultData?.school?.logo}} 
                      result={formattedResult as any} 
                      template={getTemplate('comprehensive')} 
                      previewMode={true}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Sticky Bottom Bar with Toggle and Actions */}
            <div className="sticky bottom-0 z-20 p-6 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center bg-[#111] backdrop-blur-md gap-6 flex-shrink-0">
              {/* Toggle in bottom bar */}
              <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                <button
                  onClick={() => setShowSocialPreview(false)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    !showSocialPreview ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Gradebook
                </button>
                <button
                  onClick={() => setShowSocialPreview(true)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    showSocialPreview ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Share01 className="w-3.5 h-3.5" />
                  Social Card
                </button>
              </div>

              <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
                <div className="flex gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] text-gray-500 uppercase font-bold leading-none mb-1">Average</p>
                    <p className="text-lg font-bold text-blue-400 leading-none">{resultData.results.overallAverage}%</p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] text-gray-500 uppercase font-bold leading-none mb-1">Position</p>
                    <p className="text-lg font-bold text-purple-400 leading-none">{resultData.results.overallPosition}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setSubmitted(false);
                      setResultData(null);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-white/5 text-white text-sm font-bold hover:bg-white/10 transition-colors border border-white/10"
                  >
                    Done
                  </button>
                  {showSocialPreview ? (
                    <button 
                      onClick={handleGenerateShareImage}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
                    >
                      <Share01 className="w-4 h-4" />
                      Share
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowDownloadModal(true)}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                      <Download01 className="w-4 h-4" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden container for Social Share Card generation */}
      <div className="fixed -left-[2000px] top-0 overflow-hidden pointer-events-none">
        <div ref={setAchievementCardRef}>
          {formattedResult && (
            <SocialShareCard 
              school={school} 
              result={formattedResult as any} 
            />
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111]">
              <h3 className="font-bold text-xl">Share Achievement</h3>
              <button onClick={() => { setShowShareModal(false); setShareImage(null); }} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <div className="p-8 flex flex-col items-center">
              {isGeneratingShare ? (
                <div className="aspect-[644/618] w-full bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 animate-pulse">
                  <Camera className="w-12 h-12 text-blue-500 animate-bounce" />
                  <p className="text-gray-400 font-medium">Capturing your success...</p>
                </div>
              ) : shareImage ? (
                <div className="space-y-6 w-full">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <img src={shareImage} alt="Social Achievement" className="w-full h-auto" />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={handleDownloadShareImage}
                      className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download01 className="w-5 h-5" />
                      Save Image to Gallery
                    </button>
                    <p className="text-center text-gray-500 text-xs">
                      The image is ready! You can now save it and share to WhatsApp, Instagram or Facebook.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white text-black rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="sticky top-0 right-0 p-6 flex justify-end bg-white z-10 border-b border-gray-100">
              <button onClick={() => setShowDownloadModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-12" ref={setGradesheetRef}>
              <CompactGradebook 
                school={{...school, ...(resultData.school || {}), logo: school?.logoUrl || school?.logo || resultData?.school?.logo}} 
                result={{
                  studentName: resultData.student.name,
                  admissionNumber: resultData.student.admissionNumber,
                  classLevel: resultData.student.className,
                  overallAverage: resultData.results.overallAverage,
                  position: resultData.results.overallPosition,
                  subjects: subjectList,
                  term: resultData.results.term || 'First Term',
                  attendance: {
                    daysPresent: resultData.results.daysPresent,
                    daysSchoolOpen: resultData.results.daysSchoolOpen
                  },
                  affectiveDomain: resultData.results.affectiveDomain,
                  psychomotorDomain: resultData.results.psychomotorDomain,
                  examComponents: resultData.results.examComponents,
                  staffInfo: resultData.results.staffInfo,
                  teacherComments: {
                    principal: resultData.results.principalComments,
                    classTeacher: resultData.results.classTeacherComments
                  },
                  principalComments: resultData.results.principalComments,
                  classTeacherComments: resultData.results.classTeacherComments
                } as any} 
                template={getTemplate('comprehensive')} 
              />
            </div>
            <div className="p-8 border-t border-gray-100 flex gap-4">
              <button onClick={handleDownloadPDF} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Download01 className="w-5 h-5" />
                Confirm Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultChecker;
