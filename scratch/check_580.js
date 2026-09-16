const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
for (let i = 575; i < 585; i++) {
  console.log(`L${i+1}: ${lines[i]}`);
}
