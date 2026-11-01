const fs = require('fs');
const path = require('path');
const glob = require('glob');

const mocks = {
  '/admin/insights': {
    stats: { total: 1248, active: 1100, pending: 148, revenue: '$1.2M' },
    focus_areas: [
      { title: 'Academic Performance', value: '85%', color: '#146ef5' },
      { title: 'Student Attendance', value: '94%', color: '#10b981' },
      { title: 'Teacher Retention', value: '98%', color: '#f59e0b' }
    ],
    products: [
      { label: 'Q1', val: 45, color: '#146ef5' },
      { label: 'Q2', val: 60, color: '#10b981' },
      { label: 'Q3', val: 85, color: '#f59e0b' }
    ]
  },
  '/admin/transport': {
    stats: { total: 24, active: 20, pending: 4, revenue: '$45k' },
    active_buses: ['Bus A - Route 1', 'Bus B - Route 2', 'Bus C - Route 3'],
    incidents: ['Minor delay on Route 2', 'Scheduled maintenance for Bus D']
  },
  '/admin/fees': {
    stats: { total: '$1.5M', active: '$1.2M', pending: '$300k', revenue: '$1.2M' },
    collection_goal: { value: 80, label: 'Collection Goal' },
    recent_transactions: [
      { id: 'TRX-01', amount: '$5,000', status: 'Completed' },
      { id: 'TRX-02', amount: '$2,500', status: 'Pending' }
    ]
  },
  '/admin/hostel': {
    stats: { total: 400, active: 380, pending: 20, revenue: '$120k' },
    blocks: ['Block A (Boys)', 'Block B (Girls)', 'Block C (Staff)'],
    recent_issues: ['Plumbing issue in Room 204', 'AC repair in Common Room']
  },
  '/admin/enrollment': {
    stats: { total: 1248, active: 1200, pending: 48, revenue: '$2.5M' },
    grades: ['Primary 1', 'Primary 2', 'Secondary 1', 'Secondary 2'],
    growth: [
      { label: '2023', val: 70, color: '#146ef5' },
      { label: '2024', val: 85, color: '#10b981' }
    ]
  },
  '/admin/library': {
    stats: { total: 15000, active: 12000, pending: 3000, revenue: '$5k' },
    categories: ['Science Fiction', 'Textbooks', 'History', 'Literature'],
    alerts: ['Overdue book: Physics 101', 'New arrival: Advanced Calculus']
  },
  '/admin/operations': {
    stats: { total: 100, active: 95, pending: 5, revenue: '$0' },
    departments: ['Maintenance', 'Security', 'IT Support', 'Cleaning'],
    kpis: [
      { title: 'Resolution Time', value: '2.5 hrs', color: '#10b981' },
      { title: 'Ticket Volume', value: '45', color: '#f59e0b' }
    ]
  },
  '/admin/procurement': {
    stats: { total: '$500k', active: '$400k', pending: '$100k', revenue: '$0' },
    categories: ['Electronics', 'Stationery', 'Furniture'],
    recent_transactions: [
      { id: 'PO-1001', amount: '$12,000', status: 'Approved' },
      { id: 'PO-1002', amount: '$3,500', status: 'Pending' }
    ]
  },
  '/admin/admissions/pipeline': {
    stats: { total: 450, active: 200, pending: 250, revenue: '$15k' },
    funnel: [
      { title: 'Inquiries', value: 450, color: '#146ef5' },
      { title: 'Applications', value: 300, color: '#3b82f6' },
      { title: 'Interviews', value: 200, color: '#60a5fa' },
      { title: 'Offers', value: 150, color: '#93c5fd' }
    ]
  },
  '/admin/admissions/tours': {
    stats: { total: 50, active: 30, pending: 20, revenue: '$0' },
    tours: ['Campus Tour (Morning)', 'Campus Tour (Afternoon)', 'Virtual Tour'],
    schedule: ['Monday 10:00 AM', 'Wednesday 2:00 PM', 'Friday 10:00 AM']
  },
  '/admin/performance': {
    stats: { total: 100, active: 85, pending: 15, revenue: '$0' },
    faculty: ['Science Dept', 'Math Dept', 'Arts Dept'],
    insights: [
      { title: 'Average Score', value: '85%', color: '#10b981' },
      { title: 'Improvement', value: '+5%', color: '#146ef5' }
    ]
  },
  '/admin/timetable': {
    stats: { utilization: '92%', rooms: 45, conflicts: 0, total: 100, active: 100, pending: 0, revenue: '$0' },
    classes: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Master'],
    schedule: []
  }
};

const pages = glob.sync('src/app/(portal)/admin/**/page.tsx');

pages.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the API route being called
  const match = content.match(/api\.get\(['"]([^'"]+)['"]\)/);
  if (match) {
    const route = match[1];
    const mockData = mocks[route] || { stats: { total: 10 } };
    
    const mockString = JSON.stringify(mockData, null, 2);
    
    // Replace the try-catch block with a direct set of the mock data
    const tryCatchRegex = /try\s*\{\s*const\s*response\s*=\s*await\s*api\.get\(['"][^'"]+['"]\);\s*setData\(response\.data\);\s*\}\s*catch\s*\([^)]*\)\s*\{\s*console\.error\([^)]+\);\s*\}\s*finally\s*\{\s*setLoading\(false\);\s*\}/g;
    
    const replacement = `try {
        // Disconnected from API to use fallback mock data
        const response = { data: ${mockString} };
        setData(response.data);
      } catch (error) {
        console.error('Failed', error);
      } finally {
        setLoading(false);
      }`;
      
    if (content.match(tryCatchRegex)) {
      content = content.replace(tryCatchRegex, replacement);
      fs.writeFileSync(file, content);
      console.log(`Patched ${file} with mock data for ${route}`);
    } else {
       // Just in case formatting is different, we can inject into catch block
       const catchRegex = /\.catch\([^)]+\)/g;
       if (content.match(catchRegex)) {
          // Promise based
       } else {
          // Manual string replacement
          const fetchBlock = content.substring(content.indexOf('const fetchData'), content.indexOf('fetchData();'));
          if (fetchBlock.includes('api.get')) {
             const newFetchBlock = `const fetchData = async () => {
        setData(${mockString});
        setLoading(false);
    };
    `;
             content = content.replace(fetchBlock, newFetchBlock);
             fs.writeFileSync(file, content);
             console.log(`Patched ${file} with manual replacement`);
          }
       }
    }
  }
});
console.log('Finished disconnecting pages and adding fallback data.');
