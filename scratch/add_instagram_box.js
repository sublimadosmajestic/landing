const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCrlf = html.includes('\r\n');
const nl = isCrlf ? '\r\n' : '\n';

// 1. CSS to insert right before </style>
const instaCss = `
    /* ==========================================================================
       INSTAGRAM WALL & FULL-WIDTH SCROLLEABLE FEED
       ========================================================================== */
    .social-section {
      background: linear-gradient(180deg, var(--blanco) 0%, #FFF5F9 50%, var(--blanco) 100%);
      padding: 75px 0 65px;
      overflow: hidden;
      position: relative;
    }

    .insta-wall-container {
      width: 100%;
      margin-top: 45px;
      position: relative;
    }

    /* Profile Header Pill */
    .insta-profile-bar {
      max-width: 580px;
      margin: 0 auto 30px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1.5px solid rgba(232, 23, 122, 0.22);
      border-radius: 100px;
      padding: 8px 18px 8px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 10px 30px rgba(232, 23, 122, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
      box-sizing: border-box;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .insta-profile-bar:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 36px rgba(232, 23, 122, 0.15);
      border-color: var(--rosa);
    }

    .insta-avatar-wrapper {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      padding: 2.5px;
      background: linear-gradient(45deg, #F5C800 0%, #E8177A 50%, #833AB4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(232, 23, 122, 0.3);
      animation: instaRingPulse 4s ease-in-out infinite;
    }

    @keyframes instaRingPulse {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(232,23,122,0.4)); }
      50% { transform: scale(1.04); filter: drop-shadow(0 0 8px rgba(232,23,122,0.6)); }
    }

    .insta-avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      background: #FFFFFF;
      border: 2px solid #FFFFFF;
    }

    .insta-profile-meta {
      flex: 1;
      min-width: 0;
      text-align: left;
    }

    .insta-profile-handle {
      font-size: 15px;
      font-weight: 800;
      color: var(--negro);
      display: flex;
      align-items: center;
      gap: 6px;
      line-height: 1.2;
    }

    .insta-verified-badge {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .insta-profile-bio {
      font-size: 12px;
      color: var(--texto-soft);
      margin: 2px 0 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.3;
    }

    .insta-follow-btn {
      background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%);
      color: #FFFFFF !important;
      font-size: 12.5px;
      font-weight: 800;
      padding: 9px 18px;
      border-radius: 100px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(253, 29, 29, 0.35);
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .insta-follow-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(253, 29, 29, 0.55);
      color: #FFFFFF;
    }

    /* Scrolleable Feed Carousel */
    .insta-feed-scroll-container {
      position: relative;
      width: 100%;
      padding: 0 40px;
      box-sizing: border-box;
    }

    .insta-feed-track {
      display: flex;
      gap: 18px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      padding: 12px 6px 24px;
      scrollbar-width: thin;
      scrollbar-color: var(--rosa) #FCEAF1;
      scroll-behavior: smooth;
    }

    .insta-feed-track::-webkit-scrollbar {
      height: 7px;
    }

    .insta-feed-track::-webkit-scrollbar-track {
      background: #FCEAF1;
      border-radius: 10px;
    }

    .insta-feed-track::-webkit-scrollbar-thumb {
      background: linear-gradient(90deg, #E8177A, #FF5BAE);
      border-radius: 10px;
    }

    /* Post Card */
    .insta-post-card {
      flex: 0 0 260px;
      scroll-snap-align: start;
      text-decoration: none;
      border-radius: 18px;
      overflow: hidden;
      background: #FFFFFF;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07);
      border: 1px solid rgba(232, 23, 122, 0.12);
      position: relative;
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease, border-color 0.28s ease;
      cursor: pointer;
    }

    .insta-post-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 36px rgba(232, 23, 122, 0.22);
      border-color: rgba(232, 23, 122, 0.45);
    }

    .insta-img-box {
      position: relative;
      width: 100%;
      aspect-ratio: 1/1;
      overflow: hidden;
      background: #0F0A0D;
    }

    .insta-img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.45s ease;
      display: block;
    }

    .insta-post-card:hover .insta-img-box img {
      transform: scale(1.09);
    }

    .insta-type-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(15, 10, 13, 0.68);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      z-index: 2;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .insta-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(15, 10, 13, 0.1) 0%, rgba(15, 10, 13, 0.88) 100%);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      opacity: 0;
      transition: opacity 0.25s ease;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 18px;
      color: #FFFFFF;
      text-align: left;
      box-sizing: border-box;
      z-index: 3;
    }

    .insta-post-card:hover .insta-overlay {
      opacity: 1;
    }

    .insta-stats {
      display: flex;
      gap: 14px;
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 8px;
      color: #FFFFFF;
      text-shadow: 0 1px 4px rgba(0,0,0,0.6);
    }

    .insta-caption {
      font-size: 12px;
      line-height: 1.4;
      color: rgba(255, 255, 255, 0.95);
      margin: 0 0 10px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-shadow: 0 1px 4px rgba(0,0,0,0.6);
    }

    .insta-cta-pill {
      font-size: 11px;
      font-weight: 800;
      background: linear-gradient(135deg, var(--rosa) 0%, #FF5BAE 100%);
      color: #FFFFFF;
      padding: 4px 12px;
      border-radius: 100px;
      display: inline-block;
      align-self: flex-start;
      box-shadow: 0 3px 10px rgba(232, 23, 122, 0.45);
    }

    /* Nav Buttons */
    .insta-nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1.5px solid rgba(232, 23, 122, 0.25);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: all 0.22s ease;
      color: var(--rosa);
    }

    .insta-nav-btn svg {
      width: 22px;
      height: 22px;
      fill: currentColor;
    }

    .insta-nav-btn.prev {
      left: 10px;
    }

    .insta-nav-btn.next {
      right: 10px;
    }

    .insta-nav-btn:hover {
      background: var(--rosa);
      color: #FFFFFF;
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 8px 24px rgba(232, 23, 122, 0.4);
      border-color: var(--rosa);
    }

    /* Footer Note */
    .insta-wall-footer {
      text-align: center;
      margin-top: 18px;
    }

    .insta-view-more-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13.5px;
      font-weight: 800;
      color: var(--rosa);
      text-decoration: none;
      padding: 9px 20px;
      border-radius: 100px;
      background: rgba(232, 23, 122, 0.08);
      border: 1.5px solid rgba(232, 23, 122, 0.22);
      transition: all 0.2s ease;
    }

    .insta-view-more-link:hover {
      background: rgba(232, 23, 122, 0.16);
      border-color: var(--rosa);
      transform: translateY(-2px);
      color: #B8105E;
      box-shadow: 0 4px 14px rgba(232, 23, 122, 0.15);
    }

    @media (max-width: 768px) {
      .insta-profile-bar {
        border-radius: 20px;
        flex-direction: column;
        text-align: center;
        padding: 16px;
        gap: 12px;
        max-width: 90%;
      }
      .insta-profile-meta {
        text-align: center;
      }
      .insta-profile-handle {
        justify-content: center;
      }
      .insta-post-card {
        flex: 0 0 220px;
      }
      .insta-feed-scroll-container {
        padding: 0 10px;
      }
      .insta-nav-btn {
        display: none;
      }
    }
`;

// Insert CSS right before </style>
html = html.replace('    </style>', instaCss + '\n    </style>');

// 2. HTML to insert in .social-section
const instaWallHtml = `
  <!-- Full-Width Instagram Feed Box & Wall -->
  <div class="insta-wall-container" data-cms="insta-wall-box">
    <!-- Profile Header Bar -->
    <div class="insta-profile-bar">
      <div class="insta-avatar-wrapper">
        <img src="logo.png" alt="Sublimados Majestic" class="insta-avatar-img">
      </div>
      <div class="insta-profile-meta">
        <div class="insta-profile-handle">
          <span data-cms="insta-handle">sublimadosmajestic</span>
          <svg class="insta-verified-badge" viewBox="0 0 24 24" title="Cuenta Oficial">
            <path fill="#0095F6" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <p class="insta-profile-bio" data-cms="insta-bio">Pijamas Sublimadas al Mayor y Detal en Cali 🇨🇴 • Diseños Exclusivos</p>
      </div>
      <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-follow-btn" data-cms="insta-follow-btn" data-cms-type="link">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
        Seguir en Instagram
      </a>
    </div>

    <!-- Scrolleable Carousel Track -->
    <div class="insta-feed-scroll-container">
      <button class="insta-nav-btn prev" id="instaScrollPrev" aria-label="Ver fotos anteriores">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      
      <div class="insta-feed-track" id="instaFeedTrack">
        <!-- Post 1 -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-post-card">
          <div class="insta-img-box">
            <img src="1Carrusel.jpg" alt="Pijama Lolita Majestic" loading="lazy">
            <div class="insta-type-badge">📷</div>
            <div class="insta-overlay">
              <div class="insta-stats">
                <span>❤️ 482</span>
                <span>💬 39</span>
              </div>
              <p class="insta-caption">Pijama Lolita en tonos pastel. Tela suave de alta calidad que no destiñe 💕</p>
              <span class="insta-cta-pill">Ver post ↗</span>
            </div>
          </div>
        </a>

        <!-- Post 2 -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-post-card">
          <div class="insta-img-box">
            <img src="pantalon-camisa-familia.jpg" alt="Pijamas Familiares Majestic" loading="lazy">
            <div class="insta-type-badge">📹</div>
            <div class="insta-overlay">
              <div class="insta-stats">
                <span>❤️ 894</span>
                <span>💬 67</span>
              </div>
              <p class="insta-caption">👨‍👩‍👧 Pijamas familiares coordinadas. ¡El mejor regalo para toda la familia!</p>
              <span class="insta-cta-pill">Ver post ↗</span>
            </div>
          </div>
        </a>

        <!-- Post 3 -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-post-card">
          <div class="insta-img-box">
            <img src="2Carrusel.jpg" alt="Pijamas Tendencia Sublimados Majestic" loading="lazy">
            <div class="insta-type-badge">📷</div>
            <div class="insta-overlay">
              <div class="insta-stats">
                <span>❤️ 512</span>
                <span>💬 41</span>
              </div>
              <p class="insta-caption">✨ Colección Tendencia 2026. Diseños exclusivos confeccionados en Cali 🇨🇴</p>
              <span class="insta-cta-pill">Ver post ↗</span>
            </div>
          </div>
        </a>

        <!-- Post 4 -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-post-card">
          <div class="insta-img-box">
            <img src="3Carrusel.jpg" alt="Pijama Capri Exclusiva" loading="lazy">
            <div class="insta-type-badge">📹</div>
            <div class="insta-overlay">
              <div class="insta-stats">
                <span>❤️ 631</span>
                <span>💬 54</span>
              </div>
              <p class="insta-caption">🌸 Pijama Capri fresca y ligera. Pregunta por catálogo mayorista con precios especiales</p>
              <span class="insta-cta-pill">Ver post ↗</span>
            </div>
          </div>
        </a>

        <!-- Post 5 -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-post-card">
          <div class="insta-img-box">
            <img src="4Carrusel.jpg" alt="Pijamas Mayoristas Majestic" loading="lazy">
            <div class="insta-type-badge">📷</div>
            <div class="insta-overlay">
              <div class="insta-stats">
                <span>❤️ 725</span>
                <span>💬 59</span>
              </div>
              <p class="insta-caption">🔥 Despachos diarios a todo el país. Emprende con nosotros y aumenta tus ganancias</p>
              <span class="insta-cta-pill">Ver post ↗</span>
            </div>
          </div>
        </a>

        <!-- Post 6 -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-post-card">
          <div class="insta-img-box">
            <img src="5Carrusel.jpg" alt="Batolas y Conjuntos Majestic" loading="lazy">
            <div class="insta-type-badge">📷</div>
            <div class="insta-overlay">
              <div class="insta-stats">
                <span>❤️ 443</span>
                <span>💬 32</span>
              </div>
              <p class="insta-caption">🛏️ Batola Mood Relax. Silueta holgada y fresca para descansar como te mereces</p>
              <span class="insta-cta-pill">Ver post ↗</span>
            </div>
          </div>
        </a>

        <!-- Post 7 -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-post-card">
          <div class="insta-img-box">
            <img src="6Carrusel.jpg" alt="Diseños Exclusivos Majestic" loading="lazy">
            <div class="insta-type-badge">📹</div>
            <div class="insta-overlay">
              <div class="insta-stats">
                <span>❤️ 918</span>
                <span>💬 88</span>
              </div>
              <p class="insta-caption">🎁 Los regalos favoritos de la temporada. ¡Escríbenos por WhatsApp y pide tu catálogo!</p>
              <span class="insta-cta-pill">Ver post ↗</span>
            </div>
          </div>
        </a>

        <!-- Post 8 -->
        <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-post-card">
          <div class="insta-img-box">
            <img src="7Carrusel.jpg" alt="Sublimación de Alta Definición" loading="lazy">
            <div class="insta-type-badge">📷</div>
            <div class="insta-overlay">
              <div class="insta-stats">
                <span>❤️ 677</span>
                <span>💬 49</span>
              </div>
              <p class="insta-caption">💎 Colores vivos que duran lavada tras lavada. Calidad garantizada Sublimados Majestic</p>
              <span class="insta-cta-pill">Ver post ↗</span>
            </div>
          </div>
        </a>
      </div>

      <button class="insta-nav-btn next" id="instaScrollNext" aria-label="Ver más fotos">
        <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
      </button>
    </div>

    <!-- Footer View More Link -->
    <div class="insta-wall-footer">
      <a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-view-more-link" data-cms="insta-footer-link" data-cms-type="link">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
        <span>Ver más fotos y videos en Instagram: <strong>@sublimadosmajestic</strong></span>
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6h-2v6H5V5z"/></svg>
      </a>
    </div>
  </div>
`;

// Insert the HTML right before </section> of .social-section
const socialTarget = '</section>\r\n\r\n<section class="faq-section" id="faq">';
const socialTargetLf = '</section>\n\n<section class="faq-section" id="faq">';

if (html.includes(socialTarget)) {
  html = html.replace(socialTarget, instaWallHtml + '\r\n</section>\r\n\r\n<section class="faq-section" id="faq">');
} else if (html.includes(socialTargetLf)) {
  html = html.replace(socialTargetLf, instaWallHtml + '\n</section>\n\n<section class="faq-section" id="faq">');
} else {
  // Regex fallback
  html = html.replace(/<\/div>\s*<\/section>\s*<section class="faq-section"/, '</div>' + instaWallHtml + '\n</section>\n<section class="faq-section"');
}

// 3. Navigation Script right before </body>
const navScript = `
<script>
  (function() {
    var track = document.getElementById('instaFeedTrack');
    var prevBtn = document.getElementById('instaScrollPrev');
    var nextBtn = document.getElementById('instaScrollNext');
    if (!track || !prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', function() {
      track.scrollBy({ left: -290, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', function() {
      track.scrollBy({ left: 290, behavior: 'smooth' });
    });
  })();
</script>
`;

html = html.replace('</body>', navScript + '\n</body>');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully added Instagram Wall Box & Feed to index.html!');
