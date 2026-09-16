const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split(html.includes('\r\n') ? '\r\n' : '\n');
const startLine = lines.findIndex(l => l.includes('<section class="social-section"'));
console.log('social-section starts at line:', startLine + 1);

const faqLine = lines.findIndex(l => l.includes('<section class="faq-section"'));
console.log('faq-section starts at line:', faqLine + 1);

for (let i = startLine; i <= faqLine; i++) {
  let l = lines[i];
  if (l.length > 180) l = l.substring(0, 150) + '...';
  console.log(`L${i + 1}: ${l}`);
}
