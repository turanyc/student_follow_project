const fs = require('fs');
const iconv = require('iconv-lite');

const filePath = 'src/pages/CoachDashboard.jsx';
const contentUtf8 = fs.readFileSync(filePath, 'utf8');

// The content was originally UTF-8.
// PowerShell read it as Windows-1254, meaning it interpreted the UTF-8 bytes as Windows-1254 characters.
// Then it saved it as UTF-8.
// To reverse: encode the string as Windows-1254 (giving us back the original UTF-8 bytes),
// then decode those bytes as UTF-8.

// Wait, does iconv-lite support windows-1254? Yes, win1254.
const bytes = iconv.encode(contentUtf8, 'win1254');
const fixedContent = bytes.toString('utf8');

// Just to be sure, let's write it to a test file first.
fs.writeFileSync('src/pages/CoachDashboard_fixed.jsx', fixedContent, 'utf8');
console.log('Fixed file generated');
