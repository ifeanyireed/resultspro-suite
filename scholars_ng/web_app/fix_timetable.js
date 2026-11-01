const fs = require('fs');
let file = fs.readFileSync('src/app/(portal)/admin/timetable/page.tsx', 'utf8');

file = file.replace(/<FilterIcon size=\{18\} \/>/g, '<FilterIcon style={{ width: 18, height: 18 }} />');
file = file.replace(/<Plus01Icon size=\{20\} \/>/g, '<Plus01Icon style={{ width: 20, height: 20 }} />');
file = file.replace(/<Location01Icon size=\{10\} \/>/g, '<Location01Icon style={{ width: 12, height: 12 }} />'); // 10 is very small, using 12
file = file.replace(/<UserGroupIcon size=\{18\} color="([^"]+)" \/>/g, '<UserGroupIcon style={{ width: 18, height: 18, color: "$1" }} />');
file = file.replace(/<Location01Icon size=\{18\} color="([^"]+)" \/>/g, '<Location01Icon style={{ width: 18, height: 18, color: "$1" }} />');
file = file.replace(/<Clock01Icon size=\{18\} \/>/g, '<Clock01Icon style={{ width: 18, height: 18 }} />');

fs.writeFileSync('src/app/(portal)/admin/timetable/page.tsx', file);
console.log('Fixed icon props in timetable page');
