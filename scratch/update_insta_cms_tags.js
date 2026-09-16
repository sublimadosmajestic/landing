const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Quitar data-cms del contenedor padre insta-box-card
html = html.replace('<div class="insta-box-card" data-cms="insta-box-card">', '<div class="insta-box-card">');

// 2. Agregar data-cms y data-cms-type a la foto del avatar
html = html.replace(
  '<img src="Logo_Sublimados_Majestic.jpeg" alt="Sublimados Majestic" class="insta-box-avatar-img">',
  '<img src="Logo_Sublimados_Majestic.jpeg" alt="Sublimados Majestic" class="insta-box-avatar-img" data-cms="insta-avatar-img" data-cms-type="image">'
);

// 3. Agregar data-cms="insta-post" y data-cms-type="insta-post" a todos los <a> de los posts
html = html.replace(
  /<a href="https:\/\/www\.instagram\.com\/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item">/g,
  '<a href="https://www.instagram.com/sublimadosmajestic" target="_blank" rel="noopener" class="insta-box-item" data-cms="insta-post" data-cms-type="insta-post">'
);

// 4. Asegurar el resguardo backupHtml en el loader en vivo
const oldLoader = `      var sk = '';
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
        });`;

const newLoader = `      var backupHtml = grid.innerHTML;
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
            return '<a href="' + link + '" target="_blank" rel="noopener" class="insta-box-item" data-cms="insta-post" data-cms-type="insta-post">'
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
          grid.innerHTML = backupHtml;
        });`;

if (html.includes(oldLoader)) {
  html = html.replace(oldLoader, newLoader);
  console.log('✅ Loader actualizado con backupHtml');
} else {
  console.log('ℹ️ Loader no coincidió con oldLoader exacto');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ index.html actualizado con tags data-cms de Instagram');
