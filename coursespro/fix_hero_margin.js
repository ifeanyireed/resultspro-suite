const fs = require('fs');
const path = require('path');

const files = [
    'src/app/cohorts/page.tsx',
    'src/app/enterprise/page.tsx',
    'src/app/pricing/page.tsx',
    'src/app/apply/page.tsx'
];

for (const file of files) {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');

    // Replace the first section tag
    content = content.replace(
        /<section className="section-py bg-navy text-white([^"]*)">/,
        '<section className="section-py bg-navy text-white$1" style={{ marginTop: "-72px", paddingTop: "calc(5rem + 72px)" }}>'
    );

    fs.writeFileSync(fullPath, content);
    console.log(`Fixed margin in ${file}`);
}
