const fs = require('fs');
let file = fs.readFileSync('src/app/(portal)/admin/timetable/page.tsx', 'utf8');

file = file.replace(/PlusIcon,\s*PlusIcon as FunnelIcon as FilterIcon/, 'PlusIcon, FunnelIcon as FilterIcon');

fs.writeFileSync('src/app/(portal)/admin/timetable/page.tsx', file);
