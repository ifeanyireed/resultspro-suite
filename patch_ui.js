const fs = require('fs');

// 1. dialog.tsx
let dialog = fs.readFileSync('examspro/src/components/ui/dialog.tsx', 'utf8');
dialog = dialog.replace(/z-50/g, 'z-[100]');
fs.writeFileSync('examspro/src/components/ui/dialog.tsx', dialog);

// 2. select.tsx
let select = fs.readFileSync('examspro/src/components/ui/select.tsx', 'utf8');
select = select.replace(/focus:ring-2 focus:ring-ring focus:ring-offset-2/g, 'focus:ring-0 focus:outline-none focus:ring-offset-0');
fs.writeFileSync('examspro/src/components/ui/select.tsx', select);

// 3. input.tsx
let input = fs.readFileSync('examspro/src/components/ui/input.tsx', 'utf8');
input = input.replace(/focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2/g, 'focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0');
fs.writeFileSync('examspro/src/components/ui/input.tsx', input);

// 4. battle-mode/page.tsx
let page = fs.readFileSync('examspro/src/app/battle-mode/page.tsx', 'utf8');
// reduce height along y axis for Create Battle Modal
page = page.replace(/max-h-\[90vh\]/g, 'max-h-[75vh]');
// The user says "the red is enough", so I'll also change `focus:ring-red-600/50` to `focus:border-red-600 focus:ring-1 focus:ring-red-600` so it looks nice!
page = page.replace(/focus:ring-red-600\/50/g, 'focus:border-red-600 focus:ring-1 focus:ring-red-600');
page = page.replace(/focus-visible:ring-red-600\/50/g, 'focus-visible:border-red-600 focus-visible:ring-1 focus-visible:ring-red-600');
fs.writeFileSync('examspro/src/app/battle-mode/page.tsx', page);

console.log("Patched UI components");
