const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/(portal)/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes('<size={')) {
    content = content.replace(/<size=\{([0-9]+)\}\s*\/>/g, '<PlusIcon style={{ width: $1, height: $1 }} />');
    changed = true;
  }
  
  if (content.includes('<style={{')) {
    content = content.replace(/<style=\{\{\s*width:\s*([0-9]+),\s*height:\s*([0-9]+)\s*\}\}\s*\/>/g, '<PlusIcon style={{ width: $1, height: $2 }} />');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Fixed tags in ${file}`);
  }
});
