const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const badSnippet = `        </div>
      <!-- CMS Add Product Card Trigger -->
      <div class="cms-add-product-card" id="cms-add-product-trigger" role="button" tabindex="0" title="Añadir nueva pijama a la colección">
        <div class="cms-add-card-inner">
          <div class="cms-add-icon-circle">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
          <div class="cms-add-card-title">Añadir Nueva Pijama</div>
          <div class="cms-add-card-desc">Suma un nuevo diseño a la colección sin alterar la estructura</div>
          <span class="cms-add-card-btn">
            <span>+</span> Agregar Producto
          </span>
        </div>
      </div>
      </div>
    </div>`;

const goodSnippet = `        </div>
      </div>
      
      <!-- CMS Add Product Card Trigger -->
      <div class="cms-add-product-card" id="cms-add-product-trigger" role="button" tabindex="0" title="Añadir nueva pijama a la colección">
        <div class="cms-add-card-inner">
          <div class="cms-add-icon-circle">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
          <div class="cms-add-card-title">Añadir Nueva Pijama</div>
          <div class="cms-add-card-desc">Suma un nuevo diseño a la colección sin alterar la estructura</div>
          <span class="cms-add-card-btn">
            <span>+</span> Agregar Producto
          </span>
        </div>
      </div>
    </div>`;

// Handle both CRLF and LF
const isCrlf = html.includes('\r\n');
const search = isCrlf ? badSnippet.replace(/\n/g, '\r\n') : badSnippet;
const replace = isCrlf ? goodSnippet.replace(/\n/g, '\r\n') : goodSnippet;

if (html.includes(search)) {
  html = html.replace(search, replace);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Successfully adjusted closing tag order!');
} else {
  console.log('Could not match search string');
}
