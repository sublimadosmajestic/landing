const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const isCrlf = html.includes('\r\n');
const nl = isCrlf ? '\r\n' : '\n';

// Remove the wrongly inserted block first
html = html.replace(/\s*<!-- CMS Add Product Card Trigger -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '\n        </div>\n      </div>\n    </div>');

// Let's locate the exact end of card 7:
const target = `        <div class="card-body">
          <div class="card-name">Pijama que es Tendencia</div>
          <div class="card-note">💬 Consultar precio por WhatsApp</div>
          <a href="https://pijamasalmayor.com/sublimados_majestic" target="_blank" rel="noopener" class="card-cta"><svg viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"></path></svg> Ver en Catálogo Digital</a>
        </div>
      </div>
    </div>`;

// Wait, let's normalize newlines to test
const normalizedHtml = html.replace(/\r\n/g, '\n');
const normTarget = target.replace(/\r\n/g, '\n');

if (!normalizedHtml.includes(normTarget)) {
  console.log('Normalized target not found, let us check current index.html around card 7');
} else {
  const normReplacement = `        <div class="card-body">
          <div class="card-name">Pijama que es Tendencia</div>
          <div class="card-note">💬 Consultar precio por WhatsApp</div>
          <a href="https://pijamasalmayor.com/sublimados_majestic" target="_blank" rel="noopener" class="card-cta"><svg viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"></path></svg> Ver en Catálogo Digital</a>
        </div>
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

  const updatedHtml = normalizedHtml.replace(normTarget, normReplacement);
  fs.writeFileSync('index.html', isCrlf ? updatedHtml.replace(/\n/g, '\r\n') : updatedHtml, 'utf8');
  console.log('Replacement succeeded!');
}
