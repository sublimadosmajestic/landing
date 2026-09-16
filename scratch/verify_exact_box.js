const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

console.log('=== VERIFYING EXACT INSTAGRAM BOX WALL ===');

// Check container
if (!html.includes('class="insta-box-card"')) throw new Error('Missing insta-box-card');

// Check topbar
if (!html.includes('Feed Oficial en Directo •') || !html.includes('Abrir en App')) {
  throw new Error('Missing topbar elements');
}

// Check profile header
if (!html.includes('sublimadosmajestic') || !html.includes('13 mil') || !html.includes('516 publicaciones')) {
  throw new Error('Missing profile header info');
}

// Check 3-col wall
const items = html.split('class="insta-box-item"');
console.log('Total grid items:', items.length - 1);
if (items.length - 1 < 9) throw new Error('Expected at least 9 grid items');

// Check scrollbar in CSS
if (!html.includes('.insta-box-scroll-wall') || !html.includes('overflow-y: scroll;')) {
  throw new Error('Missing vertical scroll styling');
}

console.log('=== ALL INSTAGRAM BOX WALL CHECKS PASSED! ===');
