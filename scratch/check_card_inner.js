const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const cardMatches = html.split('<div class="product-card"');
for (let i = 1; i <= Math.min(3, cardMatches.length - 1); i++) {
  let c = cardMatches[i].split('</div>\n      </div>')[0];
  c = c.replace(/src="data:image[^"]+"/g, 'src="[BASE64]"');
  console.log(`--- CARD ${i} ---`);
  console.log(c.trim());
}
