const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
const card7Idx = lines.findIndex(l => l.includes('product-card-7'));
console.log('Card 7 line:', card7Idx + 1);
for (let i = card7Idx; i < card7Idx + 45 && i < lines.length; i++) {
  let l = lines[i];
  if (l.length > 200) l = l.substring(0, 150) + '... [TRUNCATED]';
  console.log(`L${i + 1}: ${l}`);
}
