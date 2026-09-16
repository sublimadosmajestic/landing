const fs = require('fs');

let code = fs.readFileSync('cms-editor.js', 'utf8');

// 1. Añadir logo circular a DEFAULT_GALLERY
if (!code.includes('Logo_Sublimados_Majestic (2).jpeg')) {
  code = code.replace(
    "{ name: 'Logo Majestic', url: 'logo.png' }",
    "{ name: 'Logo Majestic', url: 'logo.png' },\n    { name: 'Logo Majestic Circular', url: 'Logo_Sublimados_Majestic (2).jpeg' }"
  );
  console.log('✅ DEFAULT_GALLERY actualizado');
}

// 2. Añadir instaFeedId a state.config
if (!code.includes('instaFeedId:')) {
  code = code.replace(
    "githubBranch: 'main'",
    "githubBranch: 'main',\n      instaFeedId: ''"
  );
  console.log('✅ state.config actualizado con instaFeedId');
}

// 3. Sincronizar instaFeedId en loadConfig()
if (!code.includes('cfgEl && !state.config.instaFeedId')) {
  const oldLoadConfig = `      if (!state.config.githubToken) {
        state.config.githubToken = DEFAULT_TOKEN;
      }
    } catch (e) {`;

  const newLoadConfig = `      if (!state.config.githubToken) {
        state.config.githubToken = DEFAULT_TOKEN;
      }
      try {
        const cfgEl = document.getElementById('instaFeedConfig');
        if (cfgEl && !state.config.instaFeedId) {
          const parsed = JSON.parse(cfgEl.textContent || '{}');
          if (parsed.feedId) state.config.instaFeedId = parsed.feedId;
        }
      } catch (_) {}
    } catch (e) {`;

  code = code.replace(oldLoadConfig, newLoadConfig);
  console.log('✅ loadConfig() actualizado');
}

// 4. Actualizar detectElementType para reconocer .insta-box-item
if (!code.includes("if (el.classList.contains('insta-box-item')) return 'insta-post';")) {
  code = code.replace(
    "function detectElementType(el) {",
    "function detectElementType(el) {\n    if (el.classList.contains('insta-box-item')) return 'insta-post';"
  );
  console.log('✅ detectElementType() actualizado');
}

// 5. Actualizar scanEditableElements para despachar type === 'insta-post'
if (!code.includes("openInstaPostModal(el);")) {
  code = code.replace(
    "} else if (type === 'card') {\n          openCardModal(el);\n        } else {",
    "} else if (type === 'card') {\n          openCardModal(el);\n        } else if (type === 'insta-post') {\n          openInstaPostModal(el);\n        } else {"
  );
  console.log('✅ scanEditableElements() actualizado');
}

// 6. Insertar función openInstaPostModal justo antes de openSettingsModal
const instaModalCode = `
  // Modal: Editor de Publicación de Instagram
  function openInstaPostModal(el) {
    const imgEl = el.querySelector('img');
    const badgeEl = el.querySelector('.insta-badge-icon');
    const stats = el.querySelectorAll('.insta-box-stat-item');
    const currentImg = imgEl ? imgEl.getAttribute('src') : '';
    const currentAlt = imgEl ? (imgEl.getAttribute('alt') || '') : '';
    const currentHref = el.getAttribute('href') || 'https://www.instagram.com/sublimadosmajestic';

    let currentLikes = '850';
    let currentComs = '50';
    if (stats.length >= 2) {
      currentLikes = stats[0].innerText.replace(/[^0-9.,kKmM]/g, '').trim();
      currentComs = stats[1].innerText.replace(/[^0-9.,kKmM]/g, '').trim();
    }

    let currentType = 'none';
    if (badgeEl) {
      const title = badgeEl.getAttribute('title') || '';
      if (title.toLowerCase().includes('reel') || badgeEl.innerHTML.includes('8 5v14l11-7z')) {
        currentType = 'reel';
      } else {
        currentType = 'carousel';
      }
    }

    let galleryHtml = '';
    DEFAULT_GALLERY.forEach((item) => {
      const isSelected = item.url === currentImg ? 'selected' : '';
      galleryHtml += \`
        <div class="cms-gallery-item \${isSelected}" data-img-url="\${item.url}" title="\${item.name}">
          <img src="\${item.url}" alt="\${item.name}" loading="lazy" />
          <span class="cms-gallery-label">\${item.name}</span>
        </div>
      \`;
    });

    const backdrop = document.createElement('div');
    backdrop.className = 'cms-modal-backdrop active';
    backdrop.innerHTML = \`
      <div class="cms-modal" style="max-width: 600px;">
        <div class="cms-modal-header">
          <h3 class="cms-modal-title">📸 Editar Publicación de Instagram</h3>
          <button class="cms-modal-close">&times;</button>
        </div>
        <div class="cms-modal-body">
          <div class="cms-form-group">
            <label class="cms-form-label">Foto / Portada de la Publicación</label>
            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 10px;">
              <img id="cms-insta-preview" src="\${currentImg}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #E8D5DE;" />
              <div style="flex: 1;">
                <input type="text" id="cms-insta-img" class="cms-form-input" value="\${currentImg}" placeholder="Ruta o URL de imagen" />
                <input type="file" id="cms-insta-file" accept="image/*" class="cms-form-input" style="margin-top: 6px; font-size: 12px;" />
              </div>
            </div>
            <div class="cms-gallery-grid" id="cms-insta-gallery" style="max-height: 130px; overflow-y: auto;">
              \${galleryHtml}
            </div>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Enlace al Post en Instagram</label>
            <input type="text" id="cms-insta-href" class="cms-form-input" value="\${currentHref}" placeholder="https://www.instagram.com/p/..." />
            <small class="cms-form-help">URL directa al Reel, carrusel o post en Instagram.</small>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Tipo de Publicación</label>
            <select id="cms-insta-type" class="cms-form-select">
              <option value="reel" \${currentType === 'reel' ? 'selected' : ''}>▶ Video Reel (Icono de Reproducción)</option>
              <option value="carousel" \${currentType === 'carousel' ? 'selected' : ''}>📑 Carrusel (Icono de Fotos Múltiples)</option>
              <option value="none" \${currentType === 'none' ? 'selected' : ''}>🖼️ Foto Normal (Sin Icono)</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="cms-form-group">
              <label class="cms-form-label">❤️ Me gusta (Likes)</label>
              <input type="text" id="cms-insta-likes" class="cms-form-input" value="\${currentLikes}" placeholder="894" />
            </div>
            <div class="cms-form-group">
              <label class="cms-form-label">💬 Comentarios</label>
              <input type="text" id="cms-insta-coms" class="cms-form-input" value="\${currentComs}" placeholder="67" />
            </div>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Texto Descriptivo (Alt)</label>
            <input type="text" id="cms-insta-alt" class="cms-form-input" value="\${escapeHtml(currentAlt)}" placeholder="Descripción de la prenda" />
          </div>
        </div>
        <div class="cms-modal-footer">
          <button class="cms-btn cms-btn-cancel">Cancelar</button>
          <button id="cms-insta-save" class="cms-btn cms-btn-save">Guardar Publicación</button>
        </div>
      </div>
    \`;
    document.body.appendChild(backdrop);

    const previewImg = backdrop.querySelector('#cms-insta-preview');
    const imgInput = backdrop.querySelector('#cms-insta-img');
    const fileInput = backdrop.querySelector('#cms-insta-file');
    const hrefInput = backdrop.querySelector('#cms-insta-href');
    const typeSelect = backdrop.querySelector('#cms-insta-type');
    const likesInput = backdrop.querySelector('#cms-insta-likes');
    const comsInput = backdrop.querySelector('#cms-insta-coms');
    const altInput = backdrop.querySelector('#cms-insta-alt');
    const galleryItems = backdrop.querySelectorAll('#cms-insta-gallery .cms-gallery-item');
    const saveBtn = backdrop.querySelector('#cms-insta-save');
    const closeBtns = backdrop.querySelectorAll('.cms-modal-close, .cms-btn-cancel');

    closeBtns.forEach((btn) => btn.addEventListener('click', () => backdrop.remove()));

    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        galleryItems.forEach((i) => i.classList.remove('selected'));
        item.classList.add('selected');
        const url = item.getAttribute('data-img-url');
        imgInput.value = url;
        previewImg.src = url;
      });
    });

    fileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImg.src = e.target.result;
        imgInput.value = e.target.result;
        galleryItems.forEach((i) => i.classList.remove('selected'));
      };
      reader.readAsDataURL(file);
    });

    imgInput.addEventListener('input', () => {
      previewImg.src = imgInput.value;
    });

    saveBtn.addEventListener('click', () => {
      const newImg = imgInput.value.trim();
      const newHref = hrefInput.value.trim() || 'https://www.instagram.com/sublimadosmajestic';
      const newType = typeSelect.value;
      const newLikes = likesInput.value.trim() || '0';
      const newComs = comsInput.value.trim() || '0';
      const newAlt = altInput.value.trim() || 'Sublimados Majestic';

      if (imgEl && newImg) {
        imgEl.src = newImg;
        imgEl.alt = newAlt;
      }
      el.setAttribute('href', newHref);

      let existingBadge = el.querySelector('.insta-badge-icon');
      if (newType === 'reel') {
        if (!existingBadge) {
          existingBadge = document.createElement('span');
          existingBadge.className = 'insta-badge-icon';
          if (imgEl && imgEl.nextSibling) {
            el.insertBefore(existingBadge, imgEl.nextSibling);
          } else {
            el.appendChild(existingBadge);
          }
        }
        existingBadge.title = 'Video Reel';
        existingBadge.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
      } else if (newType === 'carousel') {
        if (!existingBadge) {
          existingBadge = document.createElement('span');
          existingBadge.className = 'insta-badge-icon';
          if (imgEl && imgEl.nextSibling) {
            el.insertBefore(existingBadge, imgEl.nextSibling);
          } else {
            el.appendChild(existingBadge);
          }
        }
        existingBadge.title = 'Carrusel de Fotos';
        existingBadge.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>';
      } else {
        if (existingBadge) existingBadge.remove();
      }

      let overlayEl = el.querySelector('.insta-box-overlay');
      if (!overlayEl) {
        overlayEl = document.createElement('div');
        overlayEl.className = 'insta-box-overlay';
        el.appendChild(overlayEl);
      }
      overlayEl.innerHTML = \`
        <span class="insta-box-stat-item">❤️ \${newLikes}</span>
        <span class="insta-box-stat-item">💬 \${newComs}</span>
      \`;

      state.hasUnsavedChanges = true;
      backdrop.remove();
      showToast('Publicación de Instagram actualizada', 'success');
    });
  }
`;

if (!code.includes('function openInstaPostModal')) {
  code = code.replace('  // Modal 5: Configuración', instaModalCode + '\n  // Modal 5: Configuración');
  console.log('✅ openInstaPostModal agregado');
}

// 7. Modificar openSettingsModal para incluir el Feed ID de Instagram
const settingsOldPin = `          <div class="cms-form-group">
            <label class="cms-form-label">PIN de Administrador</label>
            <input type="text" id="cms-set-pin" class="cms-form-input" value="\${state.config.pin}" maxlength="8" />
          </div>`;

const settingsNewPin = `          <div class="cms-form-group">
            <label class="cms-form-label">PIN de Administrador</label>
            <input type="text" id="cms-set-pin" class="cms-form-input" value="\${state.config.pin}" maxlength="8" />
          </div>

          <div style="border-top: 1px solid #E8D5DE; padding-top: 14px; margin-top: 14px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 18px;">📸</span>
              <label class="cms-form-label" style="margin: 0; font-size: 14px; font-weight: 800; color: #111;">Feed de Instagram en Vivo (Opcional)</label>
            </div>
            <input type="text" id="cms-set-feedid" class="cms-form-input" value="\${state.config.instaFeedId || ''}" placeholder="Ej: kM8xY9zABC... (Feed ID de behold.so)" />
            <small class="cms-form-help" style="margin-top: 6px; line-height: 1.5;">
              <strong>¿Deseas conectar tus fotos en tiempo real?</strong><br/>
              1. Crea tu cuenta gratuita en <a href="https://behold.so" target="_blank" rel="noopener" style="color: var(--cms-primary); font-weight: 700; text-decoration: underline;">behold.so</a>.<br/>
              2. Conecta tu perfil <strong>@sublimadosmajestic</strong>.<br/>
              3. Pega aquí el <strong>Feed ID</strong> generado y guarda.<br/>
              <em>Si lo dejas vacío, se mostrará el muro nativo interactivo con tus 12 publicaciones curadas (las cuales puedes editar haciendo clic en cada una en modo CMS).</em>
            </small>
          </div>`;

if (!code.includes('cms-set-feedid')) {
  code = code.replace(settingsOldPin, settingsNewPin);
  
  // Guardar feedId en saveBtn
  const oldSaveBtn = `      state.config.githubToken = tokenInput.value.trim();
      state.config.githubRepo = repoInput.value.trim() || 'sublimadosmajestic/landing';
      state.config.githubBranch = branchInput.value.trim() || 'main';
      state.config.pin = pinInput.value.trim() || '1234';

      saveConfig();`;

  const newSaveBtn = `      state.config.githubToken = tokenInput.value.trim();
      state.config.githubRepo = repoInput.value.trim() || 'sublimadosmajestic/landing';
      state.config.githubBranch = branchInput.value.trim() || 'main';
      state.config.pin = pinInput.value.trim() || '1234';
      
      const feedIdInput = backdrop.querySelector('#cms-set-feedid');
      const newFeedId = feedIdInput ? feedIdInput.value.trim() : '';
      state.config.instaFeedId = newFeedId;

      let cfgEl = document.getElementById('instaFeedConfig');
      if (!cfgEl) {
        cfgEl = document.createElement('script');
        cfgEl.id = 'instaFeedConfig';
        cfgEl.type = 'application/json';
        document.body.appendChild(cfgEl);
      }
      cfgEl.textContent = JSON.stringify({ feedId: newFeedId });
      state.hasUnsavedChanges = true;

      saveConfig();`;

  code = code.replace(oldSaveBtn, newSaveBtn);
  console.log('✅ openSettingsModal actualizado con feedId');
}

// 8. Actualizar getCleanHtml para sincronizar instaFeedConfig
if (!code.includes('clone.querySelector(\'#instaFeedConfig\')')) {
  const oldCleanCardClean = `    // Limpiar estilos temporales inline en tarjetas
    clone.querySelectorAll('.product-card').forEach((c) => {
      c.style.boxShadow = '';
      c.style.outline = '';
      c.style.transition = '';
    });`;

  const newCleanCardClean = `    // Limpiar estilos temporales inline en tarjetas
    clone.querySelectorAll('.product-card').forEach((c) => {
      c.style.boxShadow = '';
      c.style.outline = '';
      c.style.transition = '';
    });

    // Sincronizar script de configuración de Instagram Feed
    let cfgEl = clone.querySelector('#instaFeedConfig');
    if (!cfgEl && state.config.instaFeedId) {
      cfgEl = clone.ownerDocument.createElement('script');
      cfgEl.id = 'instaFeedConfig';
      cfgEl.type = 'application/json';
      const b = clone.querySelector('body') || clone;
      b.appendChild(cfgEl);
    }
    if (cfgEl) {
      cfgEl.textContent = JSON.stringify({ feedId: state.config.instaFeedId || '' });
    }`;

  code = code.replace(oldCleanCardClean, newCleanCardClean);
  console.log('✅ getCleanHtml() actualizado');
}

fs.writeFileSync('cms-editor.js', code, 'utf8');
console.log('✅ cms-editor.js guardado exitosamente');
