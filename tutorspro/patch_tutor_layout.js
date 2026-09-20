const fs = require('fs');
const file = fs.readFileSync('src/app/tutor/layout.tsx', 'utf8');

// I will just use sed or string replacement to inject the mapped array.
