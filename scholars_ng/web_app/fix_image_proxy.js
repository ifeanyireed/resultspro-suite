const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/(portal)/admin/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('Smart Proxy Fallback')) {
    // Inject photo handler
    content = content.replace(
      /if \(prop === 'amount'\) return '\$5,000';/,
      "if (prop === 'amount') return '$5,000';\n            if (prop === 'photo' || prop === 'image' || prop === 'avatar' || prop === 'src') return '/photo01.jpeg';"
    );
    
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed image URLs in smart proxy');
