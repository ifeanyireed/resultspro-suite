const fs = require('fs');
const path = require('path');

const map = {
  'examspro': 'https://resultspro-service-examspro.onrender.com/api',
  'admin': 'https://resultspro-service-users.onrender.com/api/v1',
  'landing_page': 'https://resultspro-service-users.onrender.com/api/v1',
  'classroompro': 'https://resultspro-service-classroompro.onrender.com/api',
  'coursespro': 'https://resultspro-service-coursespro.onrender.com/api',
  'tutorspro': 'https://resultspro-service-tutorspro.onrender.com/api',
};

for (const [app, url] of Object.entries(map)) {
  const envPath = path.join(app, '.env.local');
  if (fs.existsSync(envPath)) {
    let content = fs.readFileSync(envPath, 'utf8');
    if (!content.includes('NEXT_PUBLIC_API_URL')) {
      fs.appendFileSync(envPath, `\nNEXT_PUBLIC_API_URL=${url}\n`);
    } else {
      content = content.replace(/NEXT_PUBLIC_API_URL=.*/, `NEXT_PUBLIC_API_URL=${url}`);
      fs.writeFileSync(envPath, content);
    }
  }
  
  const envExamplePath = path.join(app, '.env.example');
  if (fs.existsSync(envExamplePath)) {
    let content = fs.readFileSync(envExamplePath, 'utf8');
    if (!content.includes('NEXT_PUBLIC_API_URL')) {
      fs.appendFileSync(envExamplePath, `\nNEXT_PUBLIC_API_URL=${url}\n`);
    } else {
      content = content.replace(/NEXT_PUBLIC_API_URL=.*/, `NEXT_PUBLIC_API_URL=${url}`);
      fs.writeFileSync(envExamplePath, content);
    }
  }

  // Also fix the fallback in api.ts
  const apiPath = path.join(app, 'src', 'lib', 'api.ts');
  if (fs.existsSync(apiPath)) {
    let content = fs.readFileSync(apiPath, 'utf8');
    content = content.replace(/process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*['"`][^'"`]+['"`]/g, `process.env.NEXT_PUBLIC_API_URL || '${url}'`);
    fs.writeFileSync(apiPath, content);
  }
}
console.log("Fixed NEXT_PUBLIC_API_URL in all apps");
