const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'src', 'app', '(app)', 'layout.tsx');
let content = fs.readFileSync(layoutPath, 'utf8');

const modules = [
  'journey', 'projects', 'workspace', 'portfolio', 'resources',
  'classroom', 'peers', 'mentor', 'leaderboard', 'achievements',
  'messages', 'calendar', 'settings', 'help'
];

modules.forEach(mod => {
  const hrefRegex = new RegExp('href="/' + mod + '"', 'g');
  content = content.replace(hrefRegex, 'href="/dashboard/' + mod + '"');
  
  const activeRegex = new RegExp("isActive\\('/" + mod + "'\\)", 'g');
  content = content.replace(activeRegex, "isActive('/dashboard/" + mod + "')");
});

fs.writeFileSync(layoutPath, content);
console.log('Layout links updated.');
