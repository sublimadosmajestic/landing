const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const gridStart = html.indexOf('<div class="product-grid"');
const gridEnd = html.indexOf('</div>', html.indexOf('product-card', gridStart) + 100);
// Let's find the closing div of product-grid
let depth = 0;
let pos = gridStart;
let endPos = -1;
while (pos < html.length) {
  if (html.startsWith('<div', pos)) {
    depth++;
    pos += 4;
  } else if (html.startsWith('</div>', pos)) {
    depth--;
    if (depth === 0) {
      endPos = pos + 6;
      break;
    }
    pos += 6;
  } else {
    pos++;
  }
}

const gridContent = html.substring(gridStart, endPos);
console.log('Grid content length:', gridContent.length);
const cards = gridContent.split('<div class="product-card"');
console.log('Total cards:', cards.length - 1);
if (cards.length > 1) {
  // Print structure of first card (truncate base64/long strings)
  let c = cards[1];
  c = c.replace(/src="data:image[^"]+"/g, 'src="[BASE64_IMAGE]"');
  console.log('First card structure:\n<div class="product-card"' + c);
}
