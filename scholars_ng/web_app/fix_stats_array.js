const fs = require('fs');

const files = [
  'src/app/(portal)/admin/transport/page.tsx',
  'src/app/(portal)/admin/fees/page.tsx',
  'src/app/(portal)/admin/hostel/page.tsx',
  'src/app/(portal)/admin/enrollment/page.tsx',
  'src/app/(portal)/admin/library/page.tsx',
  'src/app/(portal)/admin/procurement/page.tsx',
  'src/app/(portal)/admin/admissions/pipeline/page.tsx'
];

const mockStatsArray = [
  { label: 'Total', val: '1,248', trend: '+12%', icon: 'dollar', bg: '#eff6ff', color: '#146ef5' },
  { label: 'Active', val: '98%', trend: '+2%', icon: 'invoice', bg: '#f0fdf4', color: '#10b981' },
  { label: 'Pending', val: '45', trend: '-5%', icon: 'card', bg: '#fef2f2', color: '#ef4444' }
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the block: const response = { data: { ... } };
  // We can just use a regex to replace "stats": { ... } with "stats": [ ... ]
  // Be careful not to replace other things.
  
  const statsRegex = /"stats":\s*\{\s*"total":[^}]+\}/;
  if (content.match(statsRegex)) {
    content = content.replace(statsRegex, `"stats": ${JSON.stringify(mockStatsArray)}`);
    fs.writeFileSync(file, content);
    console.log(`Fixed stats map error in ${file}`);
  }
});
