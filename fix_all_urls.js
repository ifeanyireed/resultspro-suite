const fs = require('fs');
const path = require('path');

const map = {
  'examspro': 'https://resultspro-service-examspro.onrender.com/api',
  'classroompro': 'https://resultspro-service-classroompro.onrender.com/api',
  'coursespro': 'https://resultspro-service-coursespro.onrender.com/api',
  'tutorspro': 'https://resultspro-service-tutorspro.onrender.com/api',
};

function walkAndReplace(dir, targetUrl) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkAndReplace(fullPath, targetUrl);
    } else if (fullPath.match(/\.(tsx?|jsx?|ts|js)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      // We only want to replace the fallback for NEXT_PUBLIC_API_URL
      // The old script used: "NEXT_PUBLIC_API_URL || 'https://resultspro-service-users.onrender.com/api'"
      content = content.replace(/process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*['"`]https:\/\/resultspro-service-users\.onrender\.com\/api['"`]/g, `process.env.NEXT_PUBLIC_API_URL || '${targetUrl}'`);
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log("Fixed", fullPath);
      }
    }
  }
}

for (const [app, url] of Object.entries(map)) {
  walkAndReplace(path.join(app, 'src'), url);
}
console.log("Done");
