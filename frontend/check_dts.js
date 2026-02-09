import fs from 'fs';
const content = fs.readFileSync('node_modules/lucide-react/dist/lucide-react.d.ts', 'utf8');
console.log('Contains Github:', content.includes('Github'));
console.log('Contains HardDrive:', content.includes('HardDrive'));
console.log('Contains Files:', content.includes('Files'));

// Find similar names
const matches = content.match(/declare const (\w+):/g);
if (matches) {
    const names = matches.map(m => m.split(' ')[2].replace(':', ''));
    console.log('Found icons starting with Git:', names.filter(n => n.startsWith('Git')));
    console.log('Found icons starting with Hard:', names.filter(n => n.startsWith('Hard')));
    console.log('Found icons starting with File:', names.filter(n => n.startsWith('File')));
}
