const fs = require('fs');
const path = 'classroompro/src/app/dashboard/layout.tsx';
let code = fs.readFileSync(path, 'utf8');

// Remove all instances of "use client";
code = code.replace(/"use client";\n?/g, '');
code = code.replace(/'use client';\n?/g, '');

// Prepend it to the very top
code = '"use client";\n' + code;

fs.writeFileSync(path, code);
