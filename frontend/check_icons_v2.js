import * as Icons from 'lucide-react';
const iconsToCheck = ['Github', 'GitHub', 'Files', 'File', 'HardDrive', 'HardDisk', 'Copy'];
iconsToCheck.forEach(icon => {
    console.log(`${icon}: ${!!Icons[icon]}`);
});
