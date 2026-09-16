const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
for (let i = 465; i < 520; i++) {
  if (i < lines.length) {
    let l = lines[i];
    if (l.length > 200) l = l.substring(0, 150) + '... [TRUNCATED]';
    console.log(`L${i + 1}: ${l}`);
  }
}
