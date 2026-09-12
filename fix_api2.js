const fs = require('fs');
const path = 'admin/src/lib/api.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(`export async function fetchExamproPlans() {
  const res = await fetch(\`\${EXAMS_API}/api/admin/plans\`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch plans');
  return res.json();
}`, `export async function fetchExamproPlans() {
  const res = await fetch(\`\${EXAMS_API}/api/admin/plans\`, { headers: getAuthHeader(), cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch plans');
  return res.json();
}`);

fs.writeFileSync(path, content);
