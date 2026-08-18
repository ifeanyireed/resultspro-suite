import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/axiosConfig';
import { 
  Upload, 
  Download, 
  AlertCircle, 
  Eye, 
  Printer, 
  FileText, 
  Share01, 
  X, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  UserGroup
} from '@/lib/hugeicons-compat';
import { CompactGradebook } from '@/components/gradebook/CompactGradebook';
import { SocialShareCard } from '@/components/SocialShareCard';
import { getTemplate } from '@/lib/gradebookTemplates';
import { School, SchoolResult, GradebookTemplate } from '@/lib/schoolData';

interface ExamComponent {
  name: string;
  score: number;
}

interface Step7Props {
  onNext: (data: any) => Promise<void>;
  onPrevious: () => void;
  initialData?: any;
  isLoading?: boolean;
  sessionTermData?: any;
  examConfig?: { 
    components?: ExamComponent[];
    examConfigComponents?: string | any;
  };
  affectiveDomainData?: any;
  psychomotorDomainData?: any;
  isEditMode?: boolean;
}

export const Step7ResultsCSV = ({
  onNext,
  onPrevious,
  initialData,
  isLoading = false,
  sessionTermData,
  examConfig,
  affectiveDomainData,
  psychomotorDomainData,
  isEditMode = false,
}: Step7Props) => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [affectiveTraits, setAffectiveTraits] = useState<string[]>([]);
  const [psychomotorSkills, setPsychomotorSkills] = useState<string[]>([]);
  const [examComponents, setExamComponents] = useState<ExamComponent[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showGradebookPreview, setShowGradebookPreview] = useState(false);
  const [showSocialPreview, setShowSocialPreview] = useState(false);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);
  const [previewGradebooks, setPreviewGradebooks] = useState<SchoolResult[]>([]);
  const [school, setSchool] = useState<School | null>(null);
  const [template, setTemplate] = useState<GradebookTemplate | null>(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [showInstanceNameDialog, setShowInstanceNameDialog] = useState(false);
  const [instanceName, setInstanceName] = useState(initialData?.instanceName || '');
  const [savingInstance, setSavingInstance] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [staffInfo, setStaffInfo] = useState<any>(null);

  // Load staff info (Step 5) to use in gradebook
  useEffect(() => {
    const fetchStaffInfo = async () => {
      try {
        const res = await axiosInstance.get('/results-setup/session');
        if (res.data.success && res.data.data) {
          const session = res.data.data;
          setStaffInfo({
            principalName: session.principalName,
            principalSignature: session.principalSignatureUrl,
            staffData: JSON.parse(session.staffData || '[]')
          });
        }
      } catch (err) {
        console.warn('Failed to fetch staff info');
      }
    };
    fetchStaffInfo();
  }, []);

  // Load exam components from Step 2 config
  useEffect(() => {
    let componentsToLoad = null;
    
    console.log('🔍 Step 7 - Received examConfig:', examConfig);
    
    if (examConfig?.components && Array.isArray(examConfig.components)) {
      console.log('✅ Found components array in examConfig');
      componentsToLoad = examConfig.components;
    } else if (examConfig?.examConfigComponents) {
      console.log('✅ Found examConfigComponents in examConfig');
      try {
        const parsed = typeof examConfig.examConfigComponents === 'string'
          ? JSON.parse(examConfig.examConfigComponents)
          : examConfig.examConfigComponents;
        componentsToLoad = Array.isArray(parsed) ? parsed : null;
      } catch (e) {
        console.error('❌ Failed to parse examConfigComponents:', e);
      }
    }
    
    if (componentsToLoad && componentsToLoad.length > 0) {
      console.log('📊 Setting examComponents to:', componentsToLoad);
      setExamComponents(componentsToLoad);
    } else {
      console.warn('⚠️ No exam components found in config, using defaults');
      setExamComponents([
        { name: 'Exam', score: 40 },
        { name: 'CA 1', score: 10 },
        { name: 'CA 2', score: 10 },
        { name: 'Mid-Term', score: 20 },
        { name: 'Project', score: 20 },
      ]);
    }
  }, [examConfig]);

  // Restore class if in edit mode or initial data exists
  useEffect(() => {
    if (sessionTermData?.classId) {
      setSelectedClass(sessionTermData.classId);
    } else if (initialData?.classId) {
      setSelectedClass(initialData.classId);
    }
  }, [sessionTermData, initialData]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const schoolId = localStorage.getItem('schoolId');

        const classesResponse = await axiosInstance.get('/onboarding/classes');
        setClasses(classesResponse.data.data?.classes || classesResponse.data.data || []);

        const studentsResponse = await axiosInstance.get('/onboarding/students');
        setStudents(studentsResponse.data.data?.students || studentsResponse.data.data || []);

        // Fetch school info for previews
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

        // Get affective traits
        let traits = affectiveDomainData?.traits || affectiveDomainData?.affectiveTraits || [];
        if (typeof traits === 'string') traits = JSON.parse(traits);
        setAffectiveTraits(Array.isArray(traits) ? traits : []);

        // Get psychomotor skills
        let skills = psychomotorDomainData?.skills || psychomotorDomainData?.psychomotorSkills || [];
        if (typeof skills === 'string') skills = JSON.parse(skills);
        setPsychomotorSkills(Array.isArray(skills) ? skills : []);

        setTemplate(getTemplate('comprehensive'));

        // If initialData has gradebookData (edit mode), use it
        if (initialData?.gradebookData && initialData.gradebookData.length > 0) {
          setPreviewGradebooks(initialData.gradebookData);
          setProcessingComplete(true);
        }

      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, [initialData]);

  // Load subjects when class is selected
  useEffect(() => {
    const loadSubjects = async () => {
      if (!selectedClass) {
        setSubjects([]);
        return;
      }

      try {
        const response = await axiosInstance.get(`/results-setup/class-subjects?classId=${selectedClass}`);
        setSubjects((response.data.data?.subjects || []).map((s: any) => s.name));
      } catch (error) {
        console.error('Failed to load subjects:', error);
      }
    };

    loadSubjects();
  }, [selectedClass]);

  const downloadTemplate = () => {
    if (!selectedClass) {
      toast({ title: 'Error', description: 'Please select a class', variant: 'destructive' });
      return;
    }

    const filteredStudents = students.filter(student => student.classId === selectedClass);
    if (filteredStudents.length === 0) {
      toast({ title: 'Error', description: 'No students in this class', variant: 'destructive' });
      return;
    }

    const mainHeaders = [
      'Student ID', 'Name', 'Attendance', 'Sex', 'DOB', 'Age', 'Height', 'Weight', 'Favourite Color',
      ...subjects.flatMap(s => [s, ...Array(examComponents.length - 1).fill('')]),
      ...(affectiveTraits.length > 0 ? ['Affective Domains', ...Array(affectiveTraits.length - 1).fill('')] : []),
      ...(psychomotorSkills.length > 0 ? ['Psychomotor Domains', ...Array(psychomotorSkills.length - 1).fill('')] : []),
      'Comments', ''
    ];

    const subHeaders = [
      '', '', '(days)', '(M/F)', '(YYYY-MM-DD)', '(years)', '', '', '',
      ...subjects.flatMap(() => examComponents.map(comp => `${comp.name} (${comp.score})`)),
      ...affectiveTraits, ...psychomotorSkills, 'Principal Comments', 'Form Tutor Comments'
    ];

    const rows = filteredStudents.map((s, index) => [
      s.admissionNumber || `STU-${index + 1}`, s.name, '70', '', '', '', '', '', '',
      ...subjects.flatMap(() => examComponents.map(() => '')),
      ...affectiveTraits.map(() => ''), ...psychomotorSkills.map(() => ''), '', ''
    ]);

    const csvContent = [
      mainHeaders.map(h => `"${h}"`).join(','),
      subHeaders.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `results-template-${selectedClass}.csv`;
    link.click();
  };

  const splitCSVLine = (line: string) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result.map(cell => cell.replace(/^"(.*)"$/, '$1').trim());
  };

  const handleFileSelect = async (file: File) => {
    setCsvFile(file);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) return;

      const headers = splitCSVLine(lines[0]);
      const rows = lines.slice(2, 7).map(line => splitCSVLine(line));
      setPreview({ headers, rows });
    } catch (e) {
      console.error('File read error:', e);
    }
  };

  const handleSubmit = async () => {
    if (!csvFile || !selectedClass) {
      toast({ title: 'Error', description: 'File and Class are required', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(l => l.trim());
      
      if (lines.length < 3) {
        throw new Error('CSV file is empty or invalid. Ensure it has at least 3 lines (Main Header, Sub-header, and Data).');
      }

      // 1. STRICT EXAM CONFIG EXTRACTION
      const subHeaderRow = splitCSVLine(lines[1]);
      const extractedComponents: ExamComponent[] = [];
      let componentIndex = 9; // Start of subject columns
      
      while (componentIndex < subHeaderRow.length) {
        const headerText = subHeaderRow[componentIndex];
        const match = headerText.match(/^(.*)\s*\((\d+)\)$/);
        
        if (match) {
          const name = match[1].trim();
          const score = parseInt(match[2]);
          
          // Stop if we hit a repeating component (start of next subject)
          if (extractedComponents.some(c => c.name === name)) {
            break;
          }
          
          extractedComponents.push({ name, score });
          componentIndex++;
        } else {
          // If we can't parse a header in the expected subject area, stop
          break;
        }
      }

      if (extractedComponents.length === 0) {
        throw new Error('CRITICAL ERROR: Could not parse exam configuration from CSV headers. Ensure sub-headers follow the format: "Component Name (Max Score)", e.g., "Exam (60)".');
      }

      console.log('✅ Strictly Parsed Config from CSV:', extractedComponents);
      setExamComponents(extractedComponents);

      // Parse rows
      const dataRows = lines.slice(2);
      const parsedResults: SchoolResult[] = [];
      const currentClass = classes.find(c => c.id === selectedClass);
      const classTeacherInfo = staffInfo?.staffData?.find((s: any) => s.classId === selectedClass);

      for (const rowText of dataRows) {
        const row = splitCSVLine(rowText);
        if (row.length < 2) continue;

        const admissionNumber = row[0];
        const studentName = row[1];
        
        const result: SchoolResult = {
          studentName,
          admissionNumber,
          term: `${sessionTermData?.termName || 'Term'}, ${sessionTermData?.sessionName || 'Session'}`,
          resultType: 'Terminal Result',
          classLevel: currentClass?.name || 'Unknown',
          position: '',
          positionInSchool: 0,
          totalStudents: dataRows.length,
          attendance: {
            daysPresent: parseInt(row[2]) || 0,
            daysSchoolOpen: 70, 
          },
          sex: row[3],
          dateOfBirth: row[4],
          age: parseInt(row[5]) || 0,
          height: row[6],
          weight: row[7],
          favouriteColor: row[8],
          subjects: [],
          affectiveDomain: {},
          psychomotorDomain: {},
          teacherComments: {
            principal: '',
            classTeacher: '',
          },
          staffInfo: {
            principalName: staffInfo?.principalName || 'Principal',
            principalSignature: staffInfo?.principalSignature,
            classTeacherName: classTeacherInfo?.teacherName || 'Class Teacher',
            classTeacherSignature: classTeacherInfo?.teacherSignatureUrl
          },
          examComponents: extractedComponents // Use the extracted ones
        };

        let currentIndex = 9;

        // Subjects
        for (const subjectName of subjects) {
          const subjectResult: any = { name: subjectName, score: 0 };
          let totalScore = 0;
          
          extractedComponents.forEach((comp) => {
            const score = parseFloat(row[currentIndex]) || 0;
            const compKey = comp.name.toLowerCase().replace(/\s+/g, '_');
            subjectResult[compKey] = score;
            
            // Map to standardized keys for analytics/processing
            const compName = comp.name.toLowerCase();
            if (compName.includes('ca 1') || compName === 'ca1') subjectResult.ca1 = score;
            else if (compName.includes('ca 2') || compName === 'ca2') subjectResult.ca2 = score;
            else if (compName.includes('project')) subjectResult.project = score;
            else if (compName.includes('exam')) subjectResult.exam = score;
            
            totalScore += score;
            currentIndex++;
          });

          subjectResult.score = totalScore;
          
          // Grading (using standard NG scale)
          if (totalScore >= 70) { subjectResult.grade = 'A'; subjectResult.color = 'green'; subjectResult.remark = 'Excellent'; }
          else if (totalScore >= 60) { subjectResult.grade = 'B'; subjectResult.color = 'blue'; subjectResult.remark = 'Very Good'; }
          else if (totalScore >= 50) { subjectResult.grade = 'C'; subjectResult.color = 'yellow'; subjectResult.remark = 'Credit'; }
          else if (totalScore >= 45) { subjectResult.grade = 'D'; subjectResult.color = 'orange'; subjectResult.remark = 'Pass'; }
          else { subjectResult.grade = 'F'; subjectResult.color = 'red'; subjectResult.remark = 'Fail'; }

          result.subjects.push(subjectResult);
        }

        // Affective Domain
        affectiveTraits.forEach(trait => {
          if (result.affectiveDomain) {
            result.affectiveDomain[trait] = parseInt(row[currentIndex]) || 0;
          }
          currentIndex++;
        });

        // Psychomotor Domain
        psychomotorSkills.forEach(skill => {
          if (result.psychomotorDomain) {
            result.psychomotorDomain[skill] = parseInt(row[currentIndex]) || 0;
          }
          currentIndex++;
        });

        // Comments - STRICTLY from the last 2 columns
        const principalComment = row[row.length - 2] || '';
        const teacherComment = row[row.length - 1] || '';
        
        result.principalComments = principalComment;
        result.classTeacherComments = teacherComment;
        result.teacherComments = {
          principal: principalComment,
          classTeacher: teacherComment,
        };

        // Calculate Average
        const total = result.subjects.reduce((sum, s) => sum + s.score, 0);
        result.overallAverage = result.subjects.length > 0 ? Math.round(total / result.subjects.length) : 0;

        parsedResults.push(result);
      }

      // Calculate positions and subject-level statistics
      parsedResults.forEach(result => {
        result.subjects.forEach(subject => {
          const allScoresForThisSubject = parsedResults.map(r => 
            r.subjects.find(s => s.name === subject.name)?.score || 0
          );
          const sum = allScoresForThisSubject.reduce((a, b) => a + b, 0);
          subject.classAverage = Math.round(sum / (allScoresForThisSubject.length || 1));
          
          const sortedScores = [...allScoresForThisSubject].sort((a, b) => b - a);
          subject.positionInClass = sortedScores.indexOf(subject.score) + 1;
        });
      });

      // Calculate Positions based on average
      const sortedByAverage = [...parsedResults].sort((a, b) => (b.overallAverage || 0) - (a.overallAverage || 0));
      parsedResults.forEach(r => {
        const pos = sortedByAverage.findIndex(s => s.admissionNumber === r.admissionNumber) + 1;
        r.position = getOrdinal(pos);
        r.positionInSchool = pos;
      });

      setPreviewGradebooks(parsedResults);
      setProcessingComplete(true);
      
      toast({ title: 'Success', description: `Processed results for ${parsedResults.length} students` });
    } catch (error: any) {
      console.error('Processing failed:', error);
      toast({ title: 'Error', description: error.message || 'Processing failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const handleSaveInstance = async () => {
    if (!instanceName.trim()) {
      toast({ title: 'Error', description: 'Instance name required', variant: 'destructive' });
      return;
    }

    setSavingInstance(true);
    try {
      const data = {
        classId: selectedClass,
        resultsFileName: csvFile?.name || initialData?.resultsFileName,
        resultsFileUrl: initialData?.resultsFileUrl || 'uploaded-to-s3-placeholder', 
        instanceName: instanceName,
        gradebookData: previewGradebooks,
        totalStudents: previewGradebooks.length,
        examConfigComponents: examComponents, // Include the strictly parsed components
      };
      await onNext(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Save failed', variant: 'destructive' });
    } finally {
      setSavingInstance(false);
    }
  };

  const totalClassStudents = students.filter(s => s.classId === selectedClass).length;
  const processedCount = previewGradebooks.length;
  const missingCount = Math.max(0, totalClassStudents - processedCount);

  if (processingComplete) {
    return (
      <div className="space-y-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Gradebook Preview</h2>
            <p className="text-gray-400">Review results before saving as an instance.</p>
          </div>
          <div className="flex gap-2">
            {!isEditMode && (
              <Button 
                variant="outline" 
                onClick={() => setProcessingComplete(false)}
                className="bg-transparent border-[rgba(255,255,255,0.2)] text-gray-300 hover:bg-white/5"
              >
                Upload Again
              </Button>
            )}
            <Button 
              onClick={() => setShowInstanceNameDialog(true)} 
              className="bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isEditMode ? 'Update Instance' : 'Save Instance'}
            </Button>
          </div>
        </div>

        {missingCount > 0 && !isEditMode && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3 text-yellow-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">
              Reminder: You are processing results for {processedCount} students. There are {missingCount} more students in this class without results in your CSV.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students Sidebar */}
          <div className="lg:col-span-1 bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <h3 className="font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Students ({previewGradebooks.length})
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {previewGradebooks.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedStudentIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                    selectedStudentIndex === idx ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-gray-400'
                  }`}
                >
                  <div className="truncate">
                    <p className={`font-medium text-sm ${selectedStudentIndex === idx ? 'text-white' : 'text-gray-200'}`}>
                      {r.studentName}
                    </p>
                    <p className="text-[10px] opacity-60">{r.admissionNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xs">{r.overallAverage}%</p>
                    <p className="text-[10px] opacity-60">{r.position}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
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

            <div className="bg-black/40 rounded-2xl border border-white/10 p-8 flex justify-center items-start overflow-auto h-[530px] custom-scrollbar">
              <div className="scale-[0.8] md:scale-[0.9] lg:scale-100 origin-top">
                {showSocialPreview ? (
                  <SocialShareCard 
                    school={school || {} as any} 
                    result={previewGradebooks[selectedStudentIndex]} 
                  />
                ) : (
                  <CompactGradebook 
                    school={school || {} as any} 
                    result={previewGradebooks[selectedStudentIndex]} 
                    template={template || {} as any}
                    examComponents={examComponents}
                    previewMode={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {showInstanceNameDialog && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-gray-900 p-8 rounded-[30px] max-w-md w-full border border-white/10 shadow-2xl">
              <h3 className="text-xl font-bold mb-2 text-white">Save Results Instance</h3>
              <p className="text-gray-400 text-sm mb-6">Give this result set a name to identify it in the results management page.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Instance Name</label>
                  <input
                    type="text"
                    value={instanceName}
                    onChange={(e) => setInstanceName(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g. 2024/2025 SS1 First Term"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowInstanceNameDialog(false)}
                    className="flex-1 bg-transparent border-white/10 text-gray-300 hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveInstance} 
                    disabled={savingInstance || !instanceName.trim()} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    {savingInstance ? 'Saving...' : isEditMode ? 'Update' : 'Confirm & Save'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      <div>
        <h2 className="text-2xl font-bold text-white">Results CSV Upload</h2>
        <p className="text-gray-400">Download the template and upload filled results.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">Select Class *</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={isEditMode}
            className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="" className="bg-gray-900">-- Choose a class --</option>
            {classes.map(c => <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>)}
          </select>
        </div>

        {selectedClass && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-between text-blue-400">
            <div className="flex items-center gap-3">
              <UserGroup className="w-5 h-5" />
              <p className="text-sm font-medium">
                {totalClassStudents} student{totalClassStudents !== 1 ? 's' : ''} registered in this class.
              </p>
            </div>
            <p className="text-xs opacity-70">CSV should contain results for these students.</p>
          </div>
        )}

        <Button 
          onClick={downloadTemplate} 
          variant="outline" 
          disabled={!selectedClass}
          className="w-full bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
        >
          <Download className="mr-2 w-4 h-4" /> Download Template
        </Button>

        <div 
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            csvFile ? 'border-green-500/50 bg-green-500/5' : 'border-[rgba(255,255,255,0.1)] hover:border-blue-500/50 hover:bg-blue-500/5'
          } cursor-pointer`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
          {csvFile ? (
            <CheckCircle className="mx-auto mb-4 w-12 h-12 text-green-400" />
          ) : (
            <Upload className="mx-auto mb-4 w-12 h-12 text-blue-400/50" />
          )}
          <p className="text-gray-300 font-medium">{csvFile ? csvFile.name : 'Click to upload or drag and drop CSV'}</p>
          <p className="text-gray-500 text-xs mt-2">Maximum file size: 10MB</p>
        </div>

        {preview && !processingComplete && (
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">File Preview (First 5 rows)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/5 text-gray-400">
                  <tr>
                    {preview.headers.map((h, i) => <th key={i} className="p-3 font-medium">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, i) => (
                    <tr key={i} className="border-t border-white/5">
                      {row.map((cell, j) => <td key={j} className="p-3 text-gray-300">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between border-t border-[rgba(255,255,255,0.07)] pt-8">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="bg-transparent border-[rgba(255,255,255,0.2)] text-gray-300 hover:bg-white/5 hover:text-white"
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!csvFile || uploading || !selectedClass} 
          className="bg-blue-600 hover:bg-blue-700 text-white min-w-[180px] font-bold"
        >
          {uploading ? 'Processing...' : 'Process & Preview'}
        </Button>
      </div>
    </div>
  );
};
