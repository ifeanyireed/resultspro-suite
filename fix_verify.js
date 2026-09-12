const fs = require('fs');
const path = 'admin/src/app/(dashboard)/exampro/tabs/UsersTab.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  `      await fetch(\`\${EXAMS_API}/api/admin/users-access/\${userId}/verify\`, {
        method: 'PUT',
        headers: getAuthHeader()
      });`,
  `      const res = await fetch(\`\${EXAMS_API}/api/admin/users-access/\${userId}/verify\`, {
        method: 'PUT',
        headers: getAuthHeader()
      });
      if (!res.ok) throw new Error("API request failed with status: " + res.status);`
);

fs.writeFileSync(path, content);
