const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let match;
let i = 0;
let errors = 0;
while ((match = scriptRegex.exec(html)) !== null) {
  i++;
  const attrs = match[1];
  const code = match[2].trim();
  if (!code || attrs.includes('type="application/json"') || attrs.includes('src=')) continue;
  try {
    new Function(code);
    console.log(`Script ${i}: OK (${code.substring(0, 50).replace(/\s+/g, ' ')}...)`);
  } catch (err) {
    console.error(`Script ${i} ERROR:`, err.message);
    errors++;
  }
}
console.log(`\nValidation complete. Scripts tested: ${i}, Errors: ${errors}`);
