const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split(html.includes('\r\n') ? '\r\n' : '\n');

const cssStart = lines.findIndex(l => l.includes('INSTAGRAM WALL & FULL-WIDTH SCROLLEABLE FEED'));
console.log('CSS starts at line:', cssStart + 1);

const htmlStart = lines.findIndex(l => l.includes('<!-- Full-Width Instagram Feed Box & Wall -->'));
console.log('HTML starts at line:', htmlStart + 1);

const scriptStart = lines.findIndex(l => l.includes('id="instaScrollPrev"'));
console.log('Script starts at line:', scriptStart + 1);
