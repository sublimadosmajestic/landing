const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split(html.includes('\r\n') ? '\r\n' : '\n');
for (let i = 655; i < 710 && i < lines.length; i++) {
  console.log(`L${i + 1}: ${lines[i]}`);
}
