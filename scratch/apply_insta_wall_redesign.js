const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the old CSS block
const oldCssMarkerStart = '    /* ==========================================================================\n       INSTAGRAM WALL & FULL-WIDTH SCROLLEABLE FEED\n       ========================================================================== */';
const oldCssMarkerEnd = '</style>';

// 2. New CSS matching the exact user screenshot
const newInstaCss = `
    /* ==========================================================================
       INSTAGRAM OFFICIAL FEED BOX - EXACT FEED WALL (3-COLUMN SCROLLABLE)
       ========================================================================== */
    .social-section {
      background: linear-gradient(180deg, var(--blanco) 0%, #FFF5F9 50%, var(--blanco) 100%);
      padding: 60px 20px;
      position: relative;
    }

    .insta-box-card {
      max-width: 880px;
      margin: 36px auto 0;
      background: #FFFFFF;
      border-radius: 20px;
      border: 1px solid rgba(232, 23, 122, 0.18);
      box-shadow: 0 16px 45px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(232, 23, 122, 0.05);
      overflow: hidden;
      box-sizing: border-box;
      font-family: var(--font-base, 'Nunito', sans-serif);
    }

    /* Top Status Bar */
    .insta-box-topbar {
      background: #FFF2F7;
      padding: 10px 20px;
      border-bottom: 1px solid #F8D8E6;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700;
    }

    .insta-box-topbar-left {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #7A3555;
    }

    .insta-live-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #E8177A;
      box-shadow: 0 0 8px #E8177A;
      animation: instaLivePulse 1.8s infinite;
      display: inline-block;
    }

    @keyframes instaLivePulse {
      0% { transform: scale(0.9); opacity: 0.8; }
      50% { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(0.9); opacity: 0.8; }
    }

    .insta-box-topbar-handle {
      color: #E8177A;
      font-weight: 800;
    }

    .insta-box-open-app {
      color: #E8177A;
      text-decoration: none;
      font-weight: 800;
      font-size: 12.5px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: color 0.15s, transform 0.15s;
    }

    .insta-box-open-app:hover {
      color: #B8105E;
      transform: translateX(2px);
    }

    /* Profile Header */
    .insta-box-profile-header {
      padding: 20px 24px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #FFFFFF;
      border-bottom: 1px solid #F4E4EC;
    }

    .insta-box-profile-left {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .insta-box-avatar-ring {
      width: 74px;
      height: 74px;
      border-radius: 50%;
      padding: 3px;
      background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 14px rgba(220, 39, 67, 0.28);
    }

    .insta-box-avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      background: #FFFFFF;
      border: 2px solid #FFFFFF;
      display: block;
    }

    .insta-box-profile-info {
      text-align: left;
    }

    .insta-box-username {
      font-size: 17.5px;
      font-weight: 800;
      color: #0F0A0D;
      line-height: 1.2;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .insta-box-subname {
      font-size: 14px;
      font-weight: 700;
      color: #4F3844;
      margin-top: 3px;
      line-height: 1.3;
    }

    .insta-box-stats {
      font-size: 13.5px;
      color: #7A5868;
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .insta-box-stats strong {
      color: #1A1117;
      font-weight: 800;
    }

    .insta-box-stats .stat-sep {
      color: #C2A8B5;
      font-size: 10px;
    }

    .insta-box-profile-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .insta-box-ig-icon {
      width: 32px;
      height: 32px;
      transition: transform 0.2s ease;
      display: block;
    }

    .insta-box-ig-icon:hover {
      transform: scale(1.1);
    }

    /* 3-Column Scrollable Wall */
    .insta-box-scroll-wall {
      max-height: 530px;
      overflow-y: scroll;
      overflow-x: hidden;
      background: #FFFFFF;
      scrollbar-width: thin;
      scrollbar-color: #B8105E #F9EEF3;
      position: relative;
    }

    .insta-box-scroll-wall::-webkit-scrollbar {
      width: 8px;
    }

    .insta-box-scroll-wall::-webkit-scrollbar-track {
      background: #F9EEF3;
    }

    .insta-box-scroll-wall::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #E8177A, #B8105E);
      border-radius: 10px;
    }

    .insta-box-scroll-wall::-webkit-scrollbar-thumb:hover {
      background: #B8105E;
    }

    .insta-box-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
      padding: 5px;
      background: #FFFFFF;
    }

    .insta-box-item {
      position: relative;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      background: #110B0E;
      text-decoration: none;
      display: block;
      cursor: pointer;
    }

    .insta-box-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.35s ease, filter 0.35s ease;
    }

    .insta-box-item:hover img {
      transform: scale(1.06);
      filter: brightness(0.9);
    }

    /* Media Type Badge (Reel Play / Carousel icon) */
    .insta-badge-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: rgba(15, 10, 13, 0.65);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      color: #FFFFFF;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    }

    .insta-badge-icon svg {
      width: 14px;
      height: 14px;
      fill: #FFFFFF;
    }

    /* Hover Stats Overlay */
    .insta-box-overlay {
      position: absolute;
      inset: 0;
      background: rgba(15, 10, 13, 0.52);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      opacity: 0;
      transition: opacity 0.22s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 800;
      z-index: 3;
      text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
    }

    .insta-box-item:hover .insta-box-overlay {
      opacity: 1;
    }

    .insta-box-stat-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    @media (max-width: 768px) {
      .insta-box-profile-header {
        padding: 16px;
      }
      .insta-box-avatar-ring {
        width: 60px;
        height: 60px;
      }
      .insta-box-username {
        font-size: 15.5px;
      }
      .insta-box-subname {
        font-size: 13px;
      }
      .insta-box-stats {
        font-size: 12px;
      }
      .insta-box-scroll-wall {
        max-height: 440px;
      }
      .insta-box-grid {
        gap: 3px;
        padding: 3px;
      }
    }
`;

// 3. New HTML matching the screenshot
const newInstaHtml = `
  <!-- Exact Instagram Profile Feed Box (3-Column Scrollable Wall) -->
  <div class="insta-box-card" data-cms="insta-box-card">
    <!-- Top Live Status Bar -->
    <div class="insta-box-topbar">
      <div class="insta-box-topbar-left">
        <span class="insta-live-dot"></span>
        <span>Feed Oficial en Directo • <strong class="insta-box-topbar-handle" data-cms="insta-handle-top">@sublimadosmajestic</strong></span>
      </div>
      <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-open-app">
        <span>Abrir en App</span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6h-2v6H5V5z"/></svg>
      </a>
    </div>

    <!-- Instagram Profile Header -->
    <div class="insta-box-profile-header">
      <div class="insta-box-profile-left">
        <div class="insta-box-avatar-ring">
          <img src="Logo_Sublimados_Majestic.jpeg" alt="Sublimados Majestic" class="insta-box-avatar-img">
        </div>
        <div class="insta-box-profile-info">
          <div class="insta-box-username" data-cms="insta-profile-name">
            <span>sublimadosmajestic</span>
          </div>
          <div class="insta-box-subname" data-cms="insta-profile-sub">
            Sublimados Majestic | Pijamas al por mayor
          </div>
          <div class="insta-box-stats" data-cms="insta-profile-stats">
            <span><strong>13 mil</strong> seguidores</span>
            <span class="stat-sep">•</span>
            <span><strong>516</strong> publicaciones</span>
          </div>
        </div>
      </div>
      <div class="insta-box-profile-right">
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" title="Ver perfil en Instagram">
          <svg class="insta-box-ig-icon" viewBox="0 0 24 24">
            <defs>
              <radialGradient id="igIconGrad" r="150%" cx="30%" cy="107%">
                <stop stop-color="#fdf497" offset="0%"/>
                <stop stop-color="#fdf497" offset="5%"/>
                <stop stop-color="#fd5949" offset="45%"/>
                <stop stop-color="#d6249f" offset="60%"/>
                <stop stop-color="#285AEB" offset="90%"/>
              </radialGradient>
            </defs>
            <path fill="url(#igIconGrad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- 3-Column Scrollable Feed Wall (Exact Instagram Layout) -->
    <div class="insta-box-scroll-wall" id="instaBoxWall">
      <div class="insta-box-grid">
        <!-- Post 1 (Reel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item">
          <img src="pantalon-camisa-familia.jpg" alt="Pijamas Familiares" loading="lazy">
          <span class="insta-badge-icon" title="Video Reel">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 894</span>
            <span class="insta-box-stat-item">💬 67</span>
          </div>
        </a>

        <!-- Post 2 (Carousel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item">
          <img src="1Carrusel.jpg" alt="Pijama Short Lolita" loading="lazy">
          <span class="insta-badge-icon" title="Carrusel de Fotos">
            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 742</span>
            <span class="insta-box-stat-item">💬 51</span>
          </div>
        </a>

        <!-- Post 3 (Reel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item">
          <img src="2Carrusel.jpg" alt="Pijama Short Bolero Rosa" loading="lazy">
          <span class="insta-badge-icon" title="Video Reel">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 920</span>
            <span class="insta-box-stat-item">💬 84</span>
          </div>
        </a>

        <!-- Post 4 (Carousel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item">
          <img src="3Carrusel.jpg" alt="Pijama Capri Exclusiva" loading="lazy">
          <span class="insta-badge-icon" title="Carrusel de Fotos">
            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 631</span>
            <span class="insta-box-stat-item">💬 43</span>
          </div>
        </a>

        <!-- Post 5 (Reel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item">
          <img src="4Carrusel.jpg" alt="Pijamas Mayoristas Majestic" loading="lazy">
          <span class="insta-badge-icon" title="Video Reel">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 815</span>
            <span class="insta-box-stat-item">💬 62</span>
          </div>
        </a>

        <!-- Post 6 (Carousel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item">
          <img src="5Carrusel.jpg" alt="Batola Mood Relax" loading="lazy">
          <span class="insta-badge-icon" title="Carrusel de Fotos">
            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 554</span>
            <span class="insta-box-stat-item">💬 39</span>
          </div>
        </a>

        <!-- Post 7 (Reel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item">
          <img src="6Carrusel.jpg" alt="Colección Tendencia Majestic" loading="lazy">
          <span class="insta-badge-icon" title="Video Reel">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 973</span>
            <span class="insta-box-stat-item">💬 95</span>
          </div>
        </a>

        <!-- Post 8 (Carousel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item">
          <img src="7Carrusel.jpg" alt="Short Lolita Exclusivo" loading="lazy">
          <span class="insta-badge-icon" title="Carrusel de Fotos">
            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 866</span>
            <span class="insta-box-stat-item">💬 71</span>
          </div>
        </a>

        <!-- Post 9 (Reel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item">
          <img src="pijamas-familia-catalogo.png" alt="Pijamas Familiares Catálogo" loading="lazy">
          <span class="insta-badge-icon" title="Video Reel">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 1.120</span>
            <span class="insta-box-stat-item">💬 108</span>
          </div>
        </a>

        <!-- Post 10 (Carousel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item">
          <img src="familia-santa-parallax.jpg" alt="Colección Familiar Santa" loading="lazy">
          <span class="insta-badge-icon" title="Carrusel de Fotos">
            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 689</span>
            <span class="insta-box-stat-item">💬 52</span>
          </div>
        </a>

        <!-- Post 11 (Reel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item">
          <img src="header-banner.png" alt="Lanzamientos Sublimados Majestic" loading="lazy">
          <span class="insta-badge-icon" title="Video Reel">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 840</span>
            <span class="insta-box-stat-item">💬 79</span>
          </div>
        </a>

        <!-- Post 12 (Carousel) -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item">
          <img src="pantalon-camisa-familia.jpg" alt="Pijamas al por Mayor Cali" loading="lazy">
          <span class="insta-badge-icon" title="Carrusel de Fotos">
            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
          </span>
          <div class="insta-box-overlay">
            <span class="insta-box-stat-item">❤️ 952</span>
            <span class="insta-box-stat-item">💬 83</span>
          </div>
        </a>
      </div>
    </div>
  </div>
`;

// Replace CSS in index.html
const cssStartIdx = html.indexOf('/* ==========================================================================\n       INSTAGRAM WALL');
const cssStartIdxCrlf = html.indexOf('/* ==========================================================================\r\n       INSTAGRAM WALL');
let realCssStart = cssStartIdx !== -1 ? cssStartIdx : cssStartIdxCrlf;

if (realCssStart !== -1) {
  const cssEndIdx = html.indexOf('</style>', realCssStart);
  html = html.substring(0, realCssStart) + newInstaCss.trim() + '\n    ' + html.substring(cssEndIdx);
  console.log('Replaced old Instagram CSS with new 3-column scrollable wall CSS');
} else {
  console.log('Old CSS marker not found, inserting before </style>');
  html = html.replace('    </style>', newInstaCss + '\n    </style>');
}

// Replace HTML in index.html
const htmlStartIdx = html.indexOf('<!-- Full-Width Instagram Feed Box & Wall -->');
if (htmlStartIdx !== -1) {
  const htmlEndIdx = html.indexOf('</section>', htmlStartIdx);
  html = html.substring(0, htmlStartIdx) + newInstaHtml.trim() + '\n' + html.substring(htmlEndIdx);
  console.log('Replaced old Instagram HTML with new exact 3-column box HTML');
} else {
  console.log('Old HTML marker not found');
}

// Remove obsolete carousel script before </body>
html = html.replace(/<script>\s*\(function\(\)\s*\{\s*var track = document\.getElementById\('instaFeedTrack'\)[\s\S]*?<\/script>/, '');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Finished updating index.html with exact Instagram Box matching user screenshot!');
