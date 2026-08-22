const fs = require('fs');
const path = 'classroompro/src/app/dashboard/layout.tsx';
let code = fs.readFileSync(path, 'utf8');

// There's a line: import { useRouter, usePathname } from "next/navigation";
// and another: import { usePathname } from 'next/navigation';
// Let's remove the second one.
code = code.replace("import { usePathname } from 'next/navigation';", "");

fs.writeFileSync(path, code);
