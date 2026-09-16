const fs = require('fs');

// Read files
const html = fs.readFileSync('index.html', 'utf8');
const cms = fs.readFileSync('cms-editor.js', 'utf8');

// Verify key markers in index.html
const checks = [
  { name: 'instaFeedConfig script present', test: html.includes('id="instaFeedConfig"') },
  { name: 'instaBoxGrid id present', test: html.includes('id="instaBoxGrid"') },
  { name: 'insta-post data-cms present', test: html.includes('data-cms="insta-post"') },
  { name: 'backupHtml guard present', test: html.includes('var backupHtml = grid.innerHTML;') },
  { name: 'snow effect complete', test: html.includes('// REALISTIC 3D BOKEH SNOW EFFECT') && html.includes('requestAnimationFrame(renderSnow);') },
  { name: 'cms-editor openInstaPostModal', test: cms.includes('function openInstaPostModal') },
  { name: 'cms-editor cms-set-feedid', test: cms.includes('id="cms-set-feedid"') },
  { name: 'cms-editor detectElementType insta-post', test: cms.includes("if (el.classList.contains('insta-box-item')) return 'insta-post';") },
  { name: 'cms-editor scanEditableElements insta-post', test: cms.includes("openInstaPostModal(el);") },
  { name: 'cms-editor getCleanHtml syncs instaFeedConfig', test: cms.includes("cfgEl.textContent = JSON.stringify({ feedId: state.config.instaFeedId") }
];

console.log('--- VALIDATION RESULTS ---');
let allPassed = true;
checks.forEach(c => {
  const status = c.test ? '✅ PASS' : '❌ FAIL';
  if (!c.test) allPassed = false;
  console.log(`${status}: ${c.name}`);
});

if (allPassed) {
  console.log('\n🎉 ALL CHECKS PASSED PERFECTLY!');
} else {
  console.error('\n⚠️ Some checks failed.');
  process.exit(1);
}
