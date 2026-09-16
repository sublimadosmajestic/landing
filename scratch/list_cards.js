const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const cardMatches = [...html.matchAll(/<div class="product-card"([^>]*)>/g)];
console.log('Found cards:', cardMatches.length);
cardMatches.forEach((m, idx) => {
  console.log(`Card ${idx + 1}: attributes = ${m[1]}`);
});
