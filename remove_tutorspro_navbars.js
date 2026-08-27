const fs = require('fs');
const path = require('path');

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('<Navbar />') || content.includes('<Navbar/>') || content.includes('import Navbar')) {
                content = content.replace(/import\s+Navbar\s+from\s+[^;]+;\n?/g, '');
                content = content.replace(/<Navbar\s*\/>\n?/g, '');
                fs.writeFileSync(fullPath, content);
                console.log('Removed Navbar from', fullPath);
            }
        }
    }
}

processDir(path.join(__dirname, 'tutorspro/src/app/tutor'));
processDir(path.join(__dirname, 'tutorspro/src/app/student'));
processDir(path.join(__dirname, 'tutorspro/src/app/parent'));
