const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const isCrlf = html.includes('\r\n');
const nl = isCrlf ? '\r\n' : '\n';
const lines = html.split(nl);

// Find the line with product-card-7
const card7Line = lines.findIndex(l => l.includes('data-cms="product-card-7"'));
console.log('Card 7 line found at:', card7Line + 1);

// Find the closing </div> of product-card-7, followed by closing </div> of product-grid
let insertIdx = -1;
for (let i = card7Line; i < card7Line + 30; i++) {
  if (lines[i].trim() === '</div>' && lines[i+1] && lines[i+1].trim() === '</div>') {
    insertIdx = i + 1; // right before lines[i+1]
    break;
  }
}

if (insertIdx === -1) {
  console.error('Could not find insertion index!');
  process.exit(1);
}

console.log('Inserting before line:', insertIdx + 1, 'which is:', lines[insertIdx]);

const addCardMarkup = [
  '      <!-- CMS Add Product Card Trigger -->',
  '      <div class="cms-add-product-card" id="cms-add-product-trigger" role="button" tabindex="0" title="Añadir nueva pijama a la colección">',
  '        <div class="cms-add-card-inner">',
  '          <div class="cms-add-icon-circle">',
  '            <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">',
  '              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>',
  '            </svg>',
  '          </div>',
  '          <div class="cms-add-card-title">Añadir Nueva Pijama</div>',
  '          <div class="cms-add-card-desc">Suma un nuevo diseño a la colección sin alterar la estructura</div>',
  '          <span class="cms-add-card-btn">',
  '            <span>+</span> Agregar Producto',
  '          </span>',
  '        </div>',
  '      </div>'
];

lines.splice(insertIdx, 0, ...addCardMarkup);
fs.writeFileSync('index.html', lines.join(nl), 'utf8');
console.log('Successfully inserted .cms-add-product-card into index.html');
