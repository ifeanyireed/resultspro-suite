const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') && !dirFile.endsWith('layout.tsx') && dirFile !== 'src/app/dashboard/page.tsx') {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync('src/app/dashboard');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Fix bg-emerald-600-600 and bg-emerald-600-700 (caused by word boundary on bg-green)
  content = content.replace(/bg-emerald-600-600/g, 'bg-emerald-600');
  content = content.replace(/bg-emerald-600-700/g, 'bg-emerald-700');
  
  // Fix double borders
  content = content.replace(/border border-gray-100 border border-gray-100/g, 'border border-gray-100');
  
  // Fix hover:bg-white shadow-sm border border-gray-100 (caused by hover:bg-white/5 if not matched earlier)
  // Actually hover:bg-white/5 was explicitly replaced, so it shouldn't have done this. But let's fix just in case.
  content = content.replace(/hover:bg-white shadow-sm border border-gray-100/g, 'hover:bg-gray-50');

  // Fix empty className=" " or duplicated classes
  content = content.replace(/divide-white\/10/g, 'divide-gray-100');
  
  fs.writeFileSync(file, content, 'utf8');
});
console.log("Cleanup complete!");
