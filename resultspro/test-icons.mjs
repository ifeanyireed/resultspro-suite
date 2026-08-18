import * as icons from 'hugeicons-react';
const homeIcons = Object.keys(icons).filter(k => k.toLowerCase().includes('home')).sort();
console.log('Home icon variants:');
homeIcons.forEach(icon => console.log('  -', icon));
