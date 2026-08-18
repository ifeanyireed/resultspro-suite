import React from 'react';
import { SchoolResult, School, GradebookTemplate } from '@/lib/schoolData';

interface ExamComponent {
  name: string;
  score: number;
}

interface CompactGradebookProps {
  school: School;
  result: SchoolResult;
  template: GradebookTemplate;
  examComponents?: ExamComponent[];
  previewMode?: boolean;
}

export const CompactGradebook: React.FC<CompactGradebookProps> = ({ 
  school, 
  result, 
  template, 
  examComponents, 
  previewMode = false 
}) => {
  // Use provided exam components, or those from the result, or fallback to an empty array (no default)
  const displayComponents = examComponents && examComponents.length > 0 
    ? examComponents 
    : result.examComponents && result.examComponents.length > 0
      ? result.examComponents
      : [];
  
  const totalObtained = result.subjects.reduce((sum, s) => sum + s.score, 0);
  const totalObtainable = result.totalObtainable || (result.subjects.length * 100);
  const percentage = Math.round((totalObtained / totalObtainable) * 100);
  
  let overallGrade = 'F';
  const gradingSystem = template.gradingSystem;
  for (const [grade, range] of Object.entries(gradingSystem)) {
    if (percentage >= (range as any).min && percentage <= (range as any).max) {
      overallGrade = grade;
      break;
    }
  }

  return (
    <div style={{ width: '150mm', height: previewMode ? 'auto' : '297mm', padding: '5mm', fontSize: '12px', fontFamily: 'Arial, sans-serif', backgroundColor: 'white', color: '#000' }}>
      {/* Header with Logo Top-Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5mm', marginBottom: '2mm' }}>
        {school.logo && (
          <img 
            src={school.logo} 
            alt="School Logo"
            style={{ width: '30mm', height: '30mm', objectFit: 'contain', flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1, paddingLeft: '3mm', borderLeft: '0.5px solid #ddd' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 1.5mm 0', textAlign: 'left', lineHeight: '1' }}>
            {school.name}
          </h1>
          <p style={{ fontSize: '8px', margin: '0.5mm 0', textAlign: 'left', color: '#666', lineHeight: '1' }}>
            {school.fullAddress}
          </p>
          <p style={{ fontSize: '8px', margin: '0.5mm 0', textAlign: 'left', color: '#666', lineHeight: '1' }}>
            Phone: {school.contactPhone} | {school.contactPhone2}
          </p>
          <p style={{ fontSize: '8px', margin: '0', textAlign: 'left', color: '#666', lineHeight: '1' }}>
            Email: {school.contactEmail} | {school.contactEmail2}
          </p>
        </div>
      </div>

      {/* Student Info Header */}
      <div style={{ borderBottom: '1px solid #000', paddingBottom: '1mm', marginBottom: '1.5mm', fontSize: '9px', maxWidth: '200mm' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '2mm' }}>
          <div>
            <span style={{ fontWeight: 'bold' }}>NAME:</span> {result.studentName}
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>CLASS:</span> {result.classLevel}
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>ADMISSION NO.:</span> {result.admissionNumber}
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>SEX:</span> {result.sex || 'N/A'}
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>AGE:</span> {result.age || 'N/A'}
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>DOB:</span> {result.dateOfBirth || 'N/A'}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '2mm', marginTop: '1mm' }}>
          <div>
            <span style={{ fontWeight: 'bold' }}>SESSION:</span> {result.session ? `${result.session}, ${result.term}` : result.term}
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>HEIGHT:</span> {result.height || 'N/A'}
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>WEIGHT:</span> {result.weight || 'N/A'}
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>FAV. COLOUR:</span> {result.favouriteColor || 'N/A'}
          </div>
          <div></div>
          <div></div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '100mm 1fr', gap: '1mm', marginBottom: '1mm' }}>
        {/* LEFT: Subjects Table */}
        <div style={{ maxWidth: '100mm' }}>
          <h3 style={{ fontSize: '9px', fontWeight: 'bold', margin: '0 0 0.5mm 0', paddingBottom: '0' }}>
            SUBJECTS
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8px', tableLayout: 'auto', borderTop: '1px solid #000' }}>
            <thead>
              <tr style={{ backgroundColor: '#e0e0e0', borderBottom: '0.5px solid #000' }}>
                <th style={{ border: '0.5px solid #000', padding: '0.25mm', textAlign: 'left' }}>Subject</th>
                {displayComponents.map((comp) => (
                  <th key={comp.name} style={{ border: '0.5px solid #000', padding: '0.25mm', textAlign: 'center' }}>{comp.name}</th>
                ))}
                <th style={{ border: '0.5px solid #000', padding: '0.25mm', textAlign: 'center' }}>Total</th>
                <th style={{ border: '0.5px solid #000', padding: '0.25mm', textAlign: 'center' }}>Grd</th>
                <th style={{ border: '0.5px solid #000', padding: '0.25mm', textAlign: 'center' }}>Avg</th>
                <th style={{ border: '0.5px solid #000', padding: '0.25mm', textAlign: 'center' }}>Pos</th>
                <th style={{ border: '0.5px solid #000', padding: '0.25mm', textAlign: 'left' }}>Remark</th>
              </tr>
            </thead>
            <tbody>
              {result.subjects.map((subject, idx) => (
                <tr key={idx} style={{ borderBottom: '0.5px solid #ccc', height: '4mm' }}>
                  <td style={{ border: '0.5px solid #000', padding: '0.25mm' }}>{subject.name}</td>
                  {displayComponents.map((comp) => {
                    const compKey = comp.name.toLowerCase().replace(/\s+/g, '_');
                    const score = (subject as any)[compKey] !== undefined 
                      ? (subject as any)[compKey] 
                      : null;
                    return (
                      <td key={comp.name} style={{ border: '0.5px solid #000', padding: '0.25mm', textAlign: 'center' }}>
                        {score !== null ? score : '-'}
                      </td>
                    );
                  })}
                  <td style={{ border: '0.5px solid #000', padding: '0.25mm', textAlign: 'center', fontWeight: 'bold' }}>{subject.score}</td>
                  <td style={{ border: '0.5px solid #000', padding: '0.25mm', textAlign: 'center', fontWeight: 'bold' }}>{subject.grade}</td>
                  <td style={{ border: '0.5px solid #000', padding: '0.25mm', textAlign: 'center' }}>{subject.classAverage || '-'}</td>
                  <td style={{ border: '0.5px solid #000', padding: '0.25mm', textAlign: 'center' }}>{subject.positionInClass || '-'}</td>
                  <td style={{ border: '0.5px solid #000', padding: '0.25mm', textAlign: 'left' }}>{subject.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Performance Summary - Below Subject Table */}
          <div style={{ border: '1px solid #000', padding: '1mm', fontSize: '9px', marginTop: '1mm' }}>
            <h4 style={{ fontSize: '9px', fontWeight: 'bold', margin: '0 0 0.5mm 0' }}>PERFORMANCE SUMMARY</h4>
            <div style={{ fontSize: '8px', lineHeight: '1.2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5mm' }}>
              <div style={{ borderRight: '0.5px solid #ccc', borderBottom: '0.5px solid #ccc', padding: '0.25mm' }}>Total Marks Obtainable: {totalObtainable}</div>
              <div style={{ borderBottom: '0.5px solid #ccc', padding: '0.25mm' }}>Total Marks Obtained: {totalObtained}</div>
              <div style={{ borderRight: '0.5px solid #ccc', borderBottom: '0.5px solid #ccc', padding: '0.25mm' }}>Percentage: {percentage}%</div>
              <div style={{ fontWeight: 'bold', borderBottom: '0.5px solid #ccc', padding: '0.25mm' }}>Grade: {overallGrade}</div>
              <div style={{ borderRight: '0.5px solid #ccc', padding: '0.25mm' }}>Position: {result.position}/{result.totalStudents}</div>
              <div style={{ fontWeight: 'bold', padding: '0.25mm' }}>Overall Remark: {result.overallRemark || 'Excellent'}</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Summary Boxes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5mm', paddingTop: '4mm' }}>
          {/* Attendance */}
          {result.attendance && (
            <div style={{ border: '1px solid #000', padding: '1mm', fontSize: '9px', maxWidth: '60mm', width: '100%' }}>
              <h4 style={{ fontSize: '9px', fontWeight: 'bold', margin: '0 0 0.5mm 0' }}>ATTENDANCE</h4>
              <div style={{ fontSize: '8px' }}>
                <div style={{ borderBottom: '0.5px solid #ccc', padding: '0.25mm 0' }}>Present: {result.attendance.daysPresent}/{result.attendance.daysSchoolOpen}</div>
                <div style={{ borderBottom: '0.5px solid #ccc', padding: '0.25mm 0' }}>%: {Math.round((result.attendance.daysPresent / result.attendance.daysSchoolOpen) * 100)}%</div>
              </div>
            </div>
          )}

          {/* Grading Scale Mini */}
          <div style={{ border: '1px solid #000', padding: '0.8mm', fontSize: '8px', maxWidth: '60mm', width: '100%' }}>
            <h4 style={{ fontSize: '8px', fontWeight: 'bold', margin: '0 0 0.3mm 0' }}>GRADING</h4>
            <div style={{ lineHeight: '1.1' }}>
              {Object.entries(template.gradingSystem || {}).map(([grade, range]) => (
                <div key={grade} style={{ borderBottom: '0.5px solid #ccc', padding: '0.25mm 0' }}>
                  <strong>{grade}:</strong> {(range as any).min}-{(range as any).max}
                </div>
              ))}
            </div>
          </div>

          {/* Affective Domain */}
          {result.affectiveDomain && Object.keys(result.affectiveDomain).length > 0 && (
            <div style={{ border: '1px solid #000', padding: '1mm' }}>
              <h4 style={{ fontSize: '8px', fontWeight: 'bold', margin: '0 0 0.3mm 0' }}>AFFECTIVE</h4>
              <div style={{ fontSize: '8px', lineHeight: '1.2' }}>
                {Object.entries(result.affectiveDomain).map(([trait, rating]) => (
                  <div key={trait} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '0.5px solid #ccc', padding: '0.25mm 0' }}>
                    <span>{trait}</span>
                    <span style={{ fontWeight: 'bold' }}>{rating === 0 || !rating ? '-' : rating}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Psychomotor Domain */}
          {result.psychomotorDomain && Object.keys(result.psychomotorDomain).length > 0 && (
            <div style={{ border: '1px solid #000', padding: '1mm' }}>
              <h4 style={{ fontSize: '8px', fontWeight: 'bold', margin: '0 0 0.3mm 0' }}>PSYCHOMOTOR</h4>
              <div style={{ fontSize: '8px', lineHeight: '1.2' }}>
                {Object.entries(result.psychomotorDomain).map(([skill, rating]) => (
                  <div key={skill} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '0.5px solid #ccc', padding: '0.25mm 0' }}>
                    <span>{skill}</span>
                    <span style={{ fontWeight: 'bold' }}>{rating === 0 || !rating ? '-' : rating}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Teacher Comments & Signatures */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm', marginBottom: '1mm' }}>
        {/* Class Teacher Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '140mm' }}>
          <div style={{ border: '1px solid #000', padding: '1mm', minHeight: '15mm', width: '100%' }}>
            <h4 style={{ fontSize: '8px', fontWeight: 'bold', margin: '0 0 0.3mm 0' }}>CLASS TEACHER'S COMMENT</h4>
            <p style={{ fontSize: '8px', margin: 0, lineHeight: '1.2', maxHeight: '13mm', overflow: 'hidden' }}>
              {result.classTeacherComments || result.teacherComments?.classTeacher || ' '}
            </p>
          </div>
          <div style={{ marginTop: '0.5mm', fontSize: '8px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2mm' }}>
            <div>
              <div style={{ fontSize: '8px', fontWeight: 'bold' }}>TEACHER'S NAME:</div>
              <div style={{ fontSize: '8px' }}>{result.staffInfo?.classTeacherName || 'Class Teacher'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '14mm', height: '7mm', marginLeft: 'auto' }}>
              {result.staffInfo?.classTeacherSignature && 
                <img src={result.staffInfo.classTeacherSignature} alt="Teacher Signature" style={{ maxHeight: '7mm', maxWidth: '14mm', objectFit: 'contain' }} />
              }
            </div>
          </div>
        </div>

        {/* Principal Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '140mm' }}>
          <div style={{ border: '1px solid #000', padding: '1mm', minHeight: '15mm', width: '100%' }}>
            <h4 style={{ fontSize: '8px', fontWeight: 'bold', margin: '0 0 0.3mm 0' }}>PRINCIPAL'S COMMENT</h4>
            <p style={{ fontSize: '8px', margin: 0, lineHeight: '1.2', maxHeight: '13mm', overflow: 'hidden' }}>
              {result.principalComments || result.teacherComments?.principal || ' '}
            </p>
          </div>
          <div style={{ marginTop: '0.5mm', fontSize: '8px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2mm' }}>
            <div>
              <div style={{ fontSize: '8px', fontWeight: 'bold' }}>PRINCIPAL'S NAME:</div>
              <div style={{ fontSize: '8px' }}>{result.staffInfo?.principalName || 'Principal'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '14mm', height: '7mm', marginLeft: 'auto' }}>
              {result.staffInfo?.principalSignature &&
                <img src={result.staffInfo.principalSignature} alt="Principal Signature" style={{ maxHeight: '7mm', maxWidth: '14mm', objectFit: 'contain' }} />
              }
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ fontSize: '8px', textAlign: 'center', borderTop: '1px solid #000', paddingTop: '0.5mm', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ margin: '0' }}>Generated: {new Date().toLocaleDateString('en-NG')} | {school.name}</p>
        <p style={{ margin: '0', fontWeight: 'bold' }}>Managed by ResultPRO</p>
      </div>
    </div>
  );
};
