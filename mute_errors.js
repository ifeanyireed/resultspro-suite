const fs = require('fs');
const glob = require('child_process').execSync('find . -type f -name "notifications.api.ts"').toString().split('\n').filter(Boolean);

glob.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/console\.warn/g, '// console.warn');
  content = content.replace(/console\.error/g, '// console.error');
  fs.writeFileSync(file, content);
});
