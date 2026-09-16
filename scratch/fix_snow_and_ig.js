const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// =====================================================================
// 1. REPARAR ANIMACIÓN DE NIEVE (regex tolerante a CRLF/LF)
// =====================================================================
// El patrón roto empieza después del último "width = snowCanvas.width = window.innerWidth;"
// y va hasta el cierre })(); del IIFE de nieve
const brokenPattern = /window\.addEventListener\('resize',\s*\(\)\s*=>\s*\{[\s\S]*?\}\)\(\);\s*<\/script>/;

const snowRepaired = `window.addEventListener('resize', () => {
      width = snowCanvas.width = window.innerWidth;
      height = snowCanvas.height = window.innerHeight;
    });

    const particleCount = width < 768 ? 40 : 70;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const layer = Math.random();
      let radius, speedY, opacity, blur;

      if (layer > 0.75) {
        radius = Math.random() * 9 + 8;
        speedY = Math.random() * 1.0 + 0.7;
        opacity = Math.random() * 0.22 + 0.12;
        blur = true;
      } else if (layer > 0.35) {
        radius = Math.random() * 4 + 3;
        speedY = Math.random() * 0.8 + 0.5;
        opacity = Math.random() * 0.45 + 0.3;
        blur = false;
      } else {
        radius = Math.random() * 2 + 1.2;
        speedY = Math.random() * 0.5 + 0.3;
        opacity = Math.random() * 0.65 + 0.35;
        blur = false;
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: radius,
        speedY: speedY,
        opacity: opacity,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.02 + 0.01,
        swingAmplitude: Math.random() * 1.4 + 0.6,
        blur: blur
      });
    }

    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
      if (isVisible) requestAnimationFrame(renderSnow);
    });

    function renderSnow() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.swing += p.swingSpeed;
        p.x += Math.sin(p.swing) * p.swingAmplitude;

        if (p.y > height + p.radius * 2) {
          p.y = -p.radius * 2;
          p.x = Math.random() * width;
        }
        if (p.x > width + p.radius * 2) p.x = -p.radius * 2;
        if (p.x < -p.radius * 2) p.x = width + p.radius * 2;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        if (p.blur) {
          grad.addColorStop(0, \`rgba(255, 255, 255, \${p.opacity})\`);
          grad.addColorStop(0.4, \`rgba(255, 240, 248, \${p.opacity * 0.6})\`);
          grad.addColorStop(0.8, \`rgba(255, 230, 245, \${p.opacity * 0.2})\`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
          grad.addColorStop(0, \`rgba(255, 255, 255, \${p.opacity})\`);
          grad.addColorStop(0.65, \`rgba(255, 245, 250, \${p.opacity * 0.7})\`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(renderSnow);
    }

    requestAnimationFrame(renderSnow);
  }
})();
</script>`;

if (brokenPattern.test(html)) {
  html = html.replace(brokenPattern, snowRepaired);
  console.log('✅ Animación de nieve reparada');
} else {
  console.log('⚠️  Patrón de nieve no encontrado con regex general');
  // Buscar el bloque de nieve manualmente
  const snowStart = html.indexOf('// REALISTIC 3D BOKEH SNOW EFFECT');
  const snowEnd   = html.indexOf('</script>', snowStart > -1 ? snowStart : 0);
  console.log('  snowStart index:', snowStart, '| snowEnd index:', snowEnd);
  if (snowStart > -1 && snowEnd > snowStart) {
    const surrounding = html.substring(snowStart - 30, snowEnd + 20);
    console.log('  Fragmento encontrado (primeros 300 chars):');
    console.log(surrounding.substring(0, 300));
  }
}

// =====================================================================
// 2. AGREGAR SCRIPTS DE INSTAGRAM BEHOLD (si no están)
// =====================================================================
if (!html.includes('instaFeedConfig')) {
  const igBlock = `
  <!-- INSTAGRAM BEHOLD FEED — CONFIG (editable desde el CMS) -->
  <script id="instaFeedConfig" type="application/json">{"feedId":""}</script>

  <!-- INSTAGRAM LIVE FEED LOADER -->
  <script>
  (function () {
    'use strict';
    try {
      var cfgEl  = document.getElementById('instaFeedConfig');
      var feedId = cfgEl ? (JSON.parse(cfgEl.textContent || '{}').feedId || '') : '';
      var grid   = document.getElementById('instaBoxGrid');
      if (!grid || !feedId) return;
      var sk = '';
      for (var s = 0; s < 12; s++) sk += '<div class="insta-skeleton-item"></div>';
      grid.innerHTML = '<div class="insta-skeleton-grid">' + sk + '</div>';
      fetch('https://feeds.behold.so/' + feedId)
        .then(function (r) { return r.ok ? r.json() : Promise.reject('HTTP ' + r.status); })
        .then(function (posts) {
          if (!Array.isArray(posts) || !posts.length) throw new Error('sin posts');
          grid.innerHTML = posts.slice(0, 12).map(function (p) {
            var isVideo    = p.mediaType === 'VIDEO' || p.mediaType === 'REELS';
            var isCarousel = p.mediaType === 'CAROUSEL_ALBUM';
            var img   = p.thumbnailUrl || p.mediaUrl || '';
            var likes = (p.likeCount    || 0).toLocaleString('es-CO');
            var coms  = (p.commentsCount || 0).toLocaleString('es-CO');
            var link  = p.permalink || 'https://www.instagram.com/sublimadosmajestic';
            var alt   = (p.caption || 'Sublimados Majestic').substring(0, 80).replace(/"/g, '&quot;');
            var badge = isVideo
              ? '<span class="insta-badge-icon" title="Video Reel"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>'
              : isCarousel
              ? '<span class="insta-badge-icon" title="Carrusel"><svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg></span>'
              : '';
            return '<a href="' + link + '" target="_blank" rel="noopener" class="insta-box-item">'
              + '<img src="' + img + '" alt="' + alt + '" loading="lazy">'
              + badge
              + '<div class="insta-box-overlay">'
              + '<span class="insta-box-stat-item">\\u2764\\uFE0F ' + likes + '</span>'
              + '<span class="insta-box-stat-item">\\uD83D\\uDCAC ' + coms  + '</span>'
              + '</div></a>';
          }).join('');
        })
        .catch(function (e) {
          console.warn('[Majestic IG] Feed no disponible, mostrando galería local.', e);
        });
    } catch (e) {
      console.warn('[Majestic IG] Config error:', e);
    }
  })();
  </script>

`;
  html = html.replace('<!-- CMS ON-PAGE ENGINE -->', igBlock + '  <!-- CMS ON-PAGE ENGINE -->');
  console.log('✅ Scripts de Instagram Behold agregados');
} else {
  console.log('✅ Scripts de Instagram ya presentes');
}

// =====================================================================
// 3. ASEGURAR id="instaBoxGrid" en el div del grid
// =====================================================================
if (!html.includes('id="instaBoxGrid"')) {
  html = html.replace(
    'class="insta-box-grid">',
    'class="insta-box-grid" id="instaBoxGrid">'
  );
  console.log('✅ id="instaBoxGrid" agregado al grid');
} else {
  console.log('✅ id="instaBoxGrid" ya presente');
}

fs.writeFileSync(file, html, 'utf8');
const lines = html.split('\n').length;
console.log(`\n✅ index.html guardado — ${lines} líneas`);
