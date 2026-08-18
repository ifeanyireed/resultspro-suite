import { GradebookTemplate } from './schoolData';

export const gradebookTemplates: { [key: string]: GradebookTemplate } = {
  standard: {
    name: 'Standard Gradebook',
    slug: 'standard',
    sections: [
      { key: 'header', label: 'School Header', enabled: true, order: 1 },
      { key: 'student-info', label: 'Student Information', enabled: true, order: 2 },
      { key: 'subjects', label: 'Subject Results', enabled: true, order: 3 },
      { key: 'performance-summary', label: 'Performance Summary', enabled: true, order: 4 },
      { key: 'grading-system', label: 'Grading System', enabled: true, order: 5 }
    ],
    gradingSystem: {
      A: { min: 80, max: 100, remark: 'Excellent' },
      B: { min: 70, max: 79, remark: 'Good' },
      C: { min: 60, max: 69, remark: 'Fair' },
      D: { min: 50, max: 59, remark: 'Poor' },
      F: { min: 0, max: 49, remark: 'Fail' }
    }
  },

  comprehensive: {
    name: 'Comprehensive Gradebook',
    slug: 'comprehensive',
    sections: [
      { key: 'header', label: 'School Header', enabled: true, order: 1 },
      { key: 'student-info', label: 'Student Information', enabled: true, order: 2 },
      { key: 'attendance', label: 'Attendance', enabled: true, order: 3 },
      { key: 'subjects', label: 'Subject Results', enabled: true, order: 4 },
      { key: 'performance-summary', label: 'Performance Summary', enabled: true, order: 5 },
      { key: 'class-averages', label: 'Class Averages', enabled: true, order: 6 },
      { key: 'affective-domain', label: 'Affective Domain', enabled: true, order: 7 },
      { key: 'psychomotor-domain', label: 'Psychomotor Domain', enabled: true, order: 8 },
      { key: 'teacher-comments', label: 'Comments', enabled: true, order: 9 },
      { key: 'grading-system', label: 'Grading System', enabled: true, order: 10 }
    ],
    gradingSystem: {
      A: { min: 80, max: 100, remark: 'Excellent' },
      B: { min: 70, max: 79, remark: 'Good' },
      C: { min: 60, max: 69, remark: 'Fair' },
      D: { min: 50, max: 59, remark: 'Poor' },
      F: { min: 0, max: 49, remark: 'Fail' }
    }
  },

  minimal: {
    name: 'Minimal Gradebook',
    slug: 'minimal',
    sections: [
      { key: 'header', label: 'School Header', enabled: true, order: 1 },
      { key: 'student-info', label: 'Student Information', enabled: true, order: 2 },
      { key: 'subjects', label: 'Subject Results', enabled: true, order: 3 },
      { key: 'performance-summary', label: 'Performance Summary', enabled: true, order: 4 }
    ],
    gradingSystem: {
      A: { min: 80, max: 100, remark: 'Excellent' },
      B: { min: 70, max: 79, remark: 'Good' },
      C: { min: 60, max: 69, remark: 'Fair' },
      D: { min: 50, max: 59, remark: 'Poor' },
      F: { min: 0, max: 49, remark: 'Fail' }
    }
  }
};

export function getTemplate(slug?: string): GradebookTemplate {
  if (!slug || !gradebookTemplates[slug]) {
    return gradebookTemplates.standard;
  }
  return gradebookTemplates[slug];
}

export function getEnabledSections(template: GradebookTemplate) {
  return template.sections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);
}
