const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('.card-body') || l.includes('.card-name') || l.includes('.card-note') || l.includes('.card-cta')) {
    console.log(`Line ${idx + 1}: ${l}`);
  }
});
