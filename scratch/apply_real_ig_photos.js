const fs = require('fs');

// 1. Actualizar index.html con los 6 posts reales de Instagram
let html = fs.readFileSync('index.html', 'utf8');

const oldGridHtml = `<div class="insta-box-grid" id="instaBoxGrid">
        <!-- Post 1 (Reel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item" data-cms="insta-post" data-cms-type="insta-post">
          <img src="pantalon-camisa-familia.jpg" alt="Pijamas Familiares" loading="lazy">
          <span class="insta-badge-icon" title="Video Reel">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 894</span>
            <span class="insta-box-stat-item">💬 67</span>
          </div>
        </a>

        <!-- Post 2 (Carousel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item" data-cms="insta-post" data-cms-type="insta-post">
          <img src="1Carrusel.jpg" alt="Pijama Short Lolita" loading="lazy">
          <span class="insta-badge-icon" title="Carrusel de Fotos">
            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"></path></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 742</span>
            <span class="insta-box-stat-item">💬 51</span>
          </div>
        </a>

        <!-- Post 3 (Reel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item" data-cms="insta-post" data-cms-type="insta-post">
          <img src="2Carrusel.jpg" alt="Pijama Short Bolero Rosa" loading="lazy">
          <span class="insta-badge-icon" title="Video Reel">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 920</span>
            <span class="insta-box-stat-item">💬 84</span>
          </div>
        </a>

        <!-- Post 4 (Carousel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item" data-cms="insta-post" data-cms-type="insta-post">
          <img src="3Carrusel.jpg" alt="Pijama Capri Exclusiva" loading="lazy">
          <span class="insta-badge-icon" title="Carrusel de Fotos">
            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"></path></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 631</span>
            <span class="insta-box-stat-item">💬 43</span>
          </div>
        </a>

        <!-- Post 5 (Reel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item" data-cms="insta-post" data-cms-type="insta-post">
          <img src="4Carrusel.jpg" alt="Pijamas Mayoristas Majestic" loading="lazy">
          <span class="insta-badge-icon" title="Video Reel">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 815</span>
            <span class="insta-box-stat-item">💬 62</span>
          </div>
        </a>

        <!-- Post 6 (Carousel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item" data-cms="insta-post" data-cms-type="insta-post">
          <img src="5Carrusel.jpg" alt="Batola Mood Relax" loading="lazy">
          <span class="insta-badge-icon" title="Carrusel de Fotos">
            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"></path></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 554</span>
            <span class="insta-box-stat-item">💬 39</span>
          </div>
        </a>`;

const newGridHtml = `<div class="insta-box-grid" id="instaBoxGrid">
        <!-- Post 1: Reel Lola Bunny en Tienda -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item" data-cms="insta-post" data-cms-type="insta-post">
          <img src="ig-post-1.jpg" alt="Reel Asesora en Tienda Pijama Lola Bunny Sublimados Majestic" loading="lazy">
          <span class="insta-badge-icon" title="Video Reel">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 1.420</span>
            <span class="insta-box-stat-item">💬 98</span>
          </div>
        </a>

        <!-- Post 2: Flyer Colección Capri Hello Kitty -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item" data-cms="insta-post" data-cms-type="insta-post">
          <img src="ig-post-2.jpg" alt="Nueva Colección Capri Camiseta Pluss Hello Kitty - Sublimados Majestic" loading="lazy">
          <span class="insta-badge-icon" title="Carrusel de Fotos">
            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"></path></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 2.180</span>
            <span class="insta-box-stat-item">💬 164</span>
          </div>
        </a>

        <!-- Post 3: Reel Pijamas Familiares Avengers -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item" data-cms="insta-post" data-cms-type="insta-post">
          <img src="ig-post-3.jpg" alt="Reel Familia Pijamas Avengers Hulk Capitán América en Tienda" loading="lazy">
          <span class="insta-badge-icon" title="Video Reel">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 3.450</span>
            <span class="insta-box-stat-item">💬 215</span>
          </div>
        </a>

        <!-- Post 4: Frase Prioridades La Felicidad en Pijama -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item" data-cms="insta-post" data-cms-type="insta-post">
          <img src="ig-post-4.jpg" alt="A veces me dan ganas de hacer dieta... la felicidad también viene en pijama" loading="lazy">
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 4.820</span>
            <span class="insta-box-stat-item">💬 310</span>
          </div>
        </a>

        <!-- Post 5: Flyer Colección Pantalón Camisa Niña Pingüino -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item" data-cms="insta-post" data-cms-type="insta-post">
          <img src="ig-post-5.jpg" alt="Nueva Colección Pantalón Camisa Niña Pingüino - Sublimados Majestic" loading="lazy">
          <span class="insta-badge-icon" title="Carrusel de Fotos">
            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"></path></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 1.890</span>
            <span class="insta-box-stat-item">💬 142</span>
          </div>
        </a>

        <!-- Post 6: Reel Top Gatitos en Tienda -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item" data-cms="insta-post" data-cms-type="insta-post">
          <img src="ig-post-6.jpg" alt="Reel Modelo en Tienda Pijama Gatitos Rosa Sublimados Majestic" loading="lazy">
          <span class="insta-badge-icon" title="Video Reel">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 2.760</span>
            <span class="insta-box-stat-item">💬 188</span>
          </div>
        </a>`;

if (html.includes(oldGridHtml)) {
  html = html.replace(oldGridHtml, newGridHtml);
  console.log('✅ index.html actualizado con las 6 fotos reales de Instagram');
} else {
  console.log('⚠️ oldGridHtml no coincidió exactamente, usando reemplazo por regex');
  const startIdx = html.indexOf('<div class="insta-box-grid" id="instaBoxGrid">');
  const post7Idx = html.indexOf('<!-- Post 7 (Reel) -->');
  if (startIdx !== -1 && post7Idx !== -1) {
    html = html.substring(0, startIdx) + newGridHtml + '\n\n        ' + html.substring(post7Idx);
    console.log('✅ index.html actualizado mediante índices');
  }
}

fs.writeFileSync('index.html', html, 'utf8');

// 2. Actualizar cms-editor.js para que la galería incluya las fotos de Instagram
let cms = fs.readFileSync('cms-editor.js', 'utf8');
const oldGalleryStart = "const DEFAULT_GALLERY = [";
const newGalleryStart = `const DEFAULT_GALLERY = [
    { name: 'Instagram 1 - Reel Lola Bunny', url: 'ig-post-1.jpg' },
    { name: 'Instagram 2 - Capri Hello Kitty', url: 'ig-post-2.jpg' },
    { name: 'Instagram 3 - Reel Familia Avengers', url: 'ig-post-3.jpg' },
    { name: 'Instagram 4 - Frase La Felicidad en Pijama', url: 'ig-post-4.jpg' },
    { name: 'Instagram 5 - Pantalón Niña Pingüino', url: 'ig-post-5.jpg' },
    { name: 'Instagram 6 - Reel Top Gatitos Tienda', url: 'ig-post-6.jpg' },`;

if (!cms.includes('ig-post-1.jpg')) {
  cms = cms.replace(oldGalleryStart, newGalleryStart);
  fs.writeFileSync('cms-editor.js', cms, 'utf8');
  console.log('✅ cms-editor.js actualizado con las fotos en DEFAULT_GALLERY');
}

console.log('🎉 Todo actualizado correctamente');
