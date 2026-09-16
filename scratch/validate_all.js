const fs = require('fs');

console.log('=== RUNNING CMS COMPREHENSIVE VALIDATION ===');

// 1. Check index.html
const html = fs.readFileSync('index.html', 'utf8');
const gridStart = html.indexOf('<div class="product-grid"');
const gridEnd = html.indexOf('<div class="ver-mas-row">');
const gridSnippet = html.substring(gridStart, gridEnd);

const productCards = gridSnippet.match(/<div class="product-card"/g) || [];
console.log('1. Product cards count in index.html:', productCards.length);
if (productCards.length !== 7) {
  throw new Error(`Expected 7 product cards, found ${productCards.length}`);
}

const hasAddTrigger = gridSnippet.includes('id="cms-add-product-trigger"') && gridSnippet.includes('class="cms-add-product-card"');
console.log('2. Add product trigger exists in product-grid:', hasAddTrigger);
if (!hasAddTrigger) {
  throw new Error('cms-add-product-trigger missing from product-grid');
}

// 2. Check cms-editor.css
const css = fs.readFileSync('cms-editor.css', 'utf8');
const hasHiddenByDefault = css.includes('.cms-add-product-card') && css.includes('display: none !important;');
console.log('3. CSS hides add product card by default:', hasHiddenByDefault);
if (!hasHiddenByDefault) throw new Error('CSS does not hide add-card by default');

const hasVisibleInActive = css.includes('body.cms-active:not(.cms-preview-mode) .cms-add-product-card') && css.includes('display: flex !important;');
console.log('4. CSS shows add product card when CMS active:', hasVisibleInActive);
if (!hasVisibleInActive) throw new Error('CSS does not display add-card when active');

const hasChips = css.includes('.cms-badge-chips') && css.includes('.cms-chip');
console.log('5. Badge chips CSS defined:', hasChips);
if (!hasChips) throw new Error('Badge chips missing in css');

// 3. Check cms-editor.js
const js = fs.readFileSync('cms-editor.js', 'utf8');
const checks = [
  { name: 'ensureAddProductCard defined', check: js.includes('function ensureAddProductCard()') },
  { name: 'openNewProductModal defined', check: js.includes('function openNewProductModal()') },
  { name: 'openCardModal has delete button', check: js.includes('cms-card-delete') && js.includes('Eliminar Producto') },
  { name: 'openCardModal has badge chips', check: js.includes('cms-badge-chips') },
  { name: 'openNewProductModal inserts before addTrigger', check: js.includes('grid.insertBefore(newCard, addCardTrigger)') },
  { name: 'openNewProductModal scrolls to new card', check: js.includes('newCard.scrollIntoView') },
  { name: 'getCleanHtml clears inline card styles', check: js.includes("c.style.boxShadow = '';") },
  { name: 'activateCMS calls ensureAddProductCard', check: js.includes('ensureAddProductCard();\n    scanEditableElements();') }
];

checks.forEach(c => {
  console.log(`6. Check ${c.name}:`, c.check);
  if (!c.check) throw new Error(`Failed check: ${c.name}`);
});

console.log('=== ALL VALIDATION TESTS PASSED! ===');
