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

const replacements = {
  'bg-white/5': 'bg-white shadow-sm border border-gray-100',
  'border-white/10': 'border-gray-100',
  'border-white/20': 'border-gray-200',
  'text-white': 'text-gray-900',
  'text-muted-foreground': 'text-gray-500',
  'bg-navy/50': 'bg-gray-50',
  'bg-navy': 'bg-[#146ef5]',
  'text-navy': 'text-white',
  'bg-white/\\[0\\.02\\]': 'bg-gray-50',
  'bg-white/10': 'bg-gray-100',
  'text-green': 'text-emerald-600',
  'bg-green/10': 'bg-emerald-50',
  'bg-green/20': 'bg-emerald-100',
  'bg-green': 'bg-emerald-600',
  'text-blue': 'text-[#146ef5]',
  'bg-blue/10': 'bg-blue-50',
  'bg-amber/10': 'bg-amber-50',
  'text-amber': 'text-amber-600',
  'text-purple-400': 'text-purple-600',
  'bg-purple-400/10': 'bg-purple-50',
  'hover:bg-white/5': 'hover:bg-gray-50',
  'hover:border-white/20': 'hover:border-gray-200'
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Remove DashboardHeader import and tags
  content = content.replace(/import\s*{\s*DashboardHeader\s*}\s*from\s*["']@\/components\/DashboardLayout["'];?\n?/g, '');
  content = content.replace(/<DashboardHeader[^>]*\/>/g, '');

  // Perform string replacements for classes
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    content = content.replace(regex, value);
  }

  // Handle specific text-white replacements inside Buttons and badges where we actually want white text
  // Since we replaced all text-white with text-gray-900, let's fix buttons.
  // We can look for `text-gray-900` inside elements that also have `bg-[#146ef5]` or `bg-emerald-600`
  content = content.replace(/bg-\[#146ef5\](.*?)text-gray-900/g, 'bg-[#146ef5]$1text-white');
  content = content.replace(/bg-emerald-600(.*?)text-gray-900/g, 'bg-emerald-600$1text-white');
  content = content.replace(/bg-red-500(.*?)text-gray-900/g, 'bg-red-500$1text-white');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
});
