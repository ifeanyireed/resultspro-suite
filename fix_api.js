const fs = require('fs');
const path = 'admin/src/lib/api.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(`export async function fetchExamproUsers() {
  const token = localStorage.getItem('resultspro_admin_token');
  const res = await fetch(\`\${EXAMS_API}/api/admin/users-access\`, {
    headers: token ? { Authorization: \`Bearer \${token}\` } : {}
  });
  if (!res.ok) throw new Error('failed to fetch users');
  return res.json();
}`, `export async function fetchExamproUsers() {
  const token = localStorage.getItem('resultspro_admin_token');
  const res = await fetch(\`\${EXAMS_API}/api/admin/users-access\`, {
    headers: token ? { Authorization: \`Bearer \${token}\` } : {},
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('failed to fetch users');
  return res.json();
}`);

fs.writeFileSync(path, content);
