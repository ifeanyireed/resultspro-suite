const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  content = content.replace(/mfa_enabled = 1/g, 'mfa_enabled = true');
  content = content.replace(/used = 1/g, 'used = true');
  content = content.replace(/revoked = 1/g, 'revoked = true');
  content = content.replace(/mfa_enabled = 0/g, 'mfa_enabled = false');
  content = content.replace(/used = 0/g, 'used = false');
  content = content.replace(/revoked = 0/g, 'revoked = false');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log("Fixed", filePath);
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.match(/\.go$/)) {
      replaceInFile(fullPath);
    }
  }
}
walk('service_users/handlers');
