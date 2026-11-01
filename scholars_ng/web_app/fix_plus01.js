const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/(portal)/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('Plus01Icon')) {
    // 1. Remove Plus01Icon from hugeicons-react import
    // It could be `Plus01Icon, ` or `, Plus01Icon` or just `Plus01Icon`
    content = content.replace(/Plus01Icon\s*,?\s*/g, '');
    
    // Clean up trailing commas in the hugeicons import if we left any
    content = content.replace(/,\s*}/g, ' }');
    
    // 2. Add PlusIcon from heroicons
    if (!content.includes("@heroicons/react/24/outline'")) {
       // if no heroicons import at all, add a new one
       content = content.replace(/(import.*['"]hugeicons-react['"];)/, "$1\nimport { PlusIcon } from '@heroicons/react/24/outline';");
    } else {
       // if there is a heroicons import, append PlusIcon to it
       content = content.replace(/(import\s*\{)([^}]*)(\}\s*from\s*['"]@heroicons\/react\/24\/outline['"];)/, "$1 PlusIcon, $2$3");
    }
    
    // 3. Replace the JSX tag and size prop
    // <Plus01Icon size={20} /> -> <PlusIcon style={{ width: 20, height: 20 }} />
    content = content.replace(/<Plus01Icon\s+size=\{([0-9]+)\}\s*[^>]*\/>/g, '<PlusIcon style={{ width: $1, height: $1 }} />');
    
    // Fallback for any other <Plus01Icon ...> usage
    content = content.replace(/<Plus01Icon/g, '<PlusIcon');

    fs.writeFileSync(file, content);
    console.log(`Fixed Plus01Icon in ${file}`);
  }
});
