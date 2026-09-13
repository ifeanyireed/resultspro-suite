const fs = require('fs');
const glob = require('glob');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove conflicting text colors like "text-white text-gray-900"
    content = content.replace(/text-white text-gray-900/g, 'text-white');
    content = content.replace(/text-gray-900 text-white/g, 'text-white');
    content = content.replace(/bg-red-500 text-gray-900/g, 'bg-red-500 text-white');
    content = content.replace(/bg-green-500 text-gray-900/g, 'bg-green-500 text-white');

    // Player 1 (Blue) -> secondary
    content = content.replace(/bg-\[#146ef5\]/g, 'bg-secondary');
    content = content.replace(/text-\[#146ef5\]/g, 'text-secondary');
    content = content.replace(/border-\[#146ef5\]/g, 'border-secondary');
    content = content.replace(/from-\[#146ef5\]/g, 'from-secondary');
    content = content.replace(/to-\[#146ef5\]/g, 'to-secondary');

    // Player 2 (Red) -> primary
    content = content.replace(/bg-red-500/g, 'bg-primary');
    content = content.replace(/text-red-500/g, 'text-primary');
    content = content.replace(/border-red-500/g, 'border-primary');
    content = content.replace(/from-red-500/g, 'from-primary');
    content = content.replace(/to-red-500/g, 'to-primary');
    content = content.replace(/bg-red-600/g, 'bg-primary/90');
    content = content.replace(/bg-red-400/g, 'bg-primary/80');
    content = content.replace(/text-red-400/g, 'text-primary');
    content = content.replace(/border-red-400/g, 'border-primary');

    // Green/Amber -> secondary/primary if they want "strictly"
    // Wait, let's keep green for correctness, but maybe use primary for buttons?
    // "strictly the primary and secondary blue and red."
    content = content.replace(/bg-green-500/g, 'bg-secondary');
    content = content.replace(/text-green-500/g, 'text-secondary');
    content = content.replace(/border-green-500/g, 'border-secondary');
    content = content.replace(/border-green/g, 'border-secondary');
    content = content.replace(/shadow-green/g, 'shadow-secondary');
    
    content = content.replace(/text-amber-500/g, 'text-primary');
    content = content.replace(/text-amber/g, 'text-primary');

    // Ensure text inside primary/secondary is white
    content = content.replace(/bg-primary text-gray-900/g, 'bg-primary text-primary-foreground');
    content = content.replace(/bg-secondary text-gray-900/g, 'bg-secondary text-secondary-foreground');
    content = content.replace(/bg-primary text-white/g, 'bg-primary text-primary-foreground');
    content = content.replace(/bg-secondary text-white/g, 'bg-secondary text-secondary-foreground');

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
}

const files = [
    'examspro/src/app/battle-mode/screen/page.tsx',
    'examspro/src/app/battle-mode/result/page.tsx',
    'examspro/src/app/battle-mode/matchmaking/page.tsx',
    'examspro/src/app/battle-mode/tournament/page.tsx'
];

files.forEach(fixFile);
