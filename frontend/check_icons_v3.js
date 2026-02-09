import * as Icons from 'lucide-react';
const iconsToCheck = ['Github', 'Play', 'Download', 'Terminal', 'Zap', 'ShieldCheck', 'HardDrive', 'Files', 'Copy'];
iconsToCheck.forEach(icon => {
    console.log(`${icon}: ${!!Icons[icon]}`);
});
console.log('Total icons:', Object.keys(Icons).length);
