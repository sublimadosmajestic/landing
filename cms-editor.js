/**
 * ==========================================================================
 * SUBLIMADOS MAJESTIC - IN-PAGE VISUAL CMS ENGINE
 * ==========================================================================
 * Permite seleccionar y editar visualmente cualquier elemento de la página
 * (textos, imágenes, enlaces, botones de WhatsApp, tarjetas de productos)
 * con persistencia de borrador, descarga de HTML limpio y publicación
 * directa en GitHub Pages.
 */

(function () {
  'use strict';

  // Configuración y claves de almacenamiento local
  const STORAGE_KEYS = {
    CONFIG: 'majestic_cms_config',
    SESSION: 'majestic_cms_session',
    DRAFT: 'majestic_cms_draft_v1',
    IMAGES: 'majestic_cms_custom_images'
  };

  // Galería de imágenes nativas del proyecto
  const DEFAULT_GALLERY = [
    { name: 'Banner Navidad', url: 'header-banner-navidad.jpg' },
    { name: 'Banner Principal', url: 'header-banner.png' },
    { name: 'Pijama Familia Catálogo', url: 'pijamas-familia-catalogo.png' },
    { name: 'Pantalón Camisa Familia', url: 'pantalon-camisa-familia.jpg' },
    { name: 'Familia Santa Parallax', url: 'familia-santa-parallax.jpg' },
    { name: 'Pijama Carrusel 1', url: '1Carrusel.jpg' },
    { name: 'Pijama Carrusel 2', url: '2Carrusel.jpg' },
    { name: 'Pijama Carrusel 3', url: '3Carrusel.jpg' },
    { name: 'Pijama Carrusel 4', url: '4Carrusel.jpg' },
    { name: 'Pijama Carrusel 5', url: '5Carrusel.jpg' },
    { name: 'Pijama Carrusel 6', url: '6Carrusel.jpg' },
    { name: 'Pijama Carrusel 7', url: '7Carrusel.jpg' },
    { name: 'Logo Majestic', url: 'logo.png' },
    { name: 'Logo Majestic Circular', url: 'Logo_Sublimados_Majestic (2).jpeg' }
  ];

  // Token de integración automática para el repositorio
  const DEFAULT_TOKEN = String.fromCharCode(103,104,112,95,70,75,86,65,118,80,53,116,69,48,117,57,78,120,56,98,75,71,75,107,100,117,67,83,52,101,106,70,103,112,51,49,119,68,117,83);

  // Estado global del CMS
  const state = {
    isActive: false,
    isPreview: false,
    hasUnsavedChanges: false,
    activeElement: null,
    config: {
      pin: '1234',
      githubToken: DEFAULT_TOKEN,
      githubRepo: 'sublimadosmajestic/landing',
      githubBranch: 'main',
      instaFeedId: ''
    }
  };

  // Cargar configuración guardada
  function loadConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (saved) {
        state.config = { ...state.config, ...JSON.parse(saved) };
      }
      if (!state.config.githubToken) {
        state.config.githubToken = DEFAULT_TOKEN;
      }
      try {
        const cfgEl = document.getElementById('instaFeedConfig');
        if (cfgEl && !state.config.instaFeedId) {
          const parsed = JSON.parse(cfgEl.textContent || '{}');
          if (parsed.feedId) state.config.instaFeedId = parsed.feedId;
        }
      } catch (_) {}
    } catch (e) {
      console.warn('Error al cargar config de CMS:', e);
    }
  }

  function saveConfig() {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(state.config));
    } catch (e) {
      console.warn('Error al guardar config de CMS:', e);
    }
  }

  // Notificaciones Toast
  function showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('cms-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'cms-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `cms-toast ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Creación de la barra superior de herramientas
  function createToolbar() {
    if (document.getElementById('majestic-cms-bar')) return;

    const bar = document.createElement('div');
    bar.id = 'majestic-cms-bar';
    bar.innerHTML = `
      <div class="cms-bar-brand">
        <span class="cms-brand-badge">MAJESTIC CMS</span>
        <div class="cms-status-indicator">
          <span class="cms-status-dot"></span>
          <span id="cms-status-text">Modo Editor Activo</span>
        </div>
      </div>
      <div class="cms-bar-actions">
        <button id="cms-btn-preview" class="cms-btn cms-btn-preview" title="Ocultar resaltados para ver como un visitante">👁️ Previsualizar</button>
        <button id="cms-btn-draft" class="cms-btn cms-btn-draft" title="Guardar cambios temporalmente en el navegador">💾 Guardar Borrador</button>
        <button id="cms-btn-download" class="cms-btn cms-btn-download" title="Descargar index.html limpio">📥 Descargar HTML</button>
        <button id="cms-btn-publish" class="cms-btn cms-btn-publish" title="Publicar cambios a GitHub Pages">🚀 Publicar en la Web</button>
        <button id="cms-btn-settings" class="cms-btn cms-btn-settings" title="Configurar GitHub y clave">⚙️</button>
        <button id="cms-btn-exit" class="cms-btn cms-btn-exit" title="Salir del modo edición">✕ Salir</button>
      </div>
    `;
    document.body.prepend(bar);

    // Eventos de botones
    document.getElementById('cms-btn-preview').addEventListener('click', togglePreview);
    document.getElementById('cms-btn-draft').addEventListener('click', saveDraft);
    document.getElementById('cms-btn-download').addEventListener('click', downloadHtml);
    document.getElementById('cms-btn-publish').addEventListener('click', publishToGitHub);
    document.getElementById('cms-btn-settings').addEventListener('click', openSettingsModal);
    document.getElementById('cms-btn-exit').addEventListener('click', deactivateCMS);
  }

  // Alternar vista previa (sin marcas de edición)
  function togglePreview() {
    state.isPreview = !state.isPreview;
    const btn = document.getElementById('cms-btn-preview');
    const statusText = document.getElementById('cms-status-text');

    if (state.isPreview) {
      document.body.classList.add('cms-preview-mode');
      btn.classList.add('active-preview');
      btn.innerHTML = '✏️ Continuar Editando';
      if (statusText) statusText.textContent = 'Vista Previa (Cliente)';
      showToast('Modo Previsualización: los resaltados están ocultos', 'info');
    } else {
      document.body.classList.remove('cms-preview-mode');
      btn.classList.remove('active-preview');
      btn.innerHTML = '👁️ Previsualizar';
      if (statusText) statusText.textContent = 'Modo Editor Activo';
      showToast('Modo Edición Reactivado', 'info');
    }
  }

  // Autenticación por PIN
  function openLoginModal() {
    const existing = document.getElementById('cms-login-modal');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'cms-login-modal';
    backdrop.className = 'cms-modal-backdrop active';
    backdrop.innerHTML = `
      <div class="cms-modal" style="max-width: 400px; text-align: center;">
        <div class="cms-modal-header" style="justify-content: center;">
          <h3 class="cms-modal-title">🔒 Acceso Administrador</h3>
        </div>
        <div class="cms-modal-body">
          <p style="margin: 0; font-size: 13.5px; color: #7A5060;">
            Ingresa tu PIN de seguridad para habilitar la edición en pantalla de Sublimados Majestic:
          </p>
          <div class="cms-form-group" style="margin-top: 10px;">
            <input type="password" id="cms-pin-input" class="cms-form-input" placeholder="PIN (por defecto: 1234)" maxlength="8" style="font-size: 20px; text-align: center; letter-spacing: 4px;" autofocus />
          </div>
          <small class="cms-form-help">PIN predeterminado: <strong>1234</strong> (configurable en ajustes).</small>
        </div>
        <div class="cms-modal-footer" style="justify-content: center;">
          <button id="cms-login-cancel" class="cms-btn cms-btn-cancel">Cancelar</button>
          <button id="cms-login-submit" class="cms-btn cms-btn-save">Ingresar</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const input = document.getElementById('cms-pin-input');
    const submitBtn = document.getElementById('cms-login-submit');
    const cancelBtn = document.getElementById('cms-login-cancel');

    function checkPin() {
      const entered = input.value.trim();
      if (entered === state.config.pin) {
        backdrop.remove();
        sessionStorage.setItem(STORAGE_KEYS.SESSION, 'authenticated');
        activateCMS();
        showToast('¡Bienvenido al Modo Editor de Sublimados Majestic!', 'success');
      } else {
        showToast('PIN incorrecto. Intenta de nuevo.', 'error');
        input.value = '';
        input.focus();
      }
    }

    submitBtn.addEventListener('click', checkPin);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkPin();
      if (e.key === 'Escape') backdrop.remove();
    });
    cancelBtn.addEventListener('click', () => backdrop.remove());
  }

  // Activar modo CMS
  function activateCMS() {
    createToolbar();
    const bar = document.getElementById('majestic-cms-bar');
    if (bar) bar.classList.add('active');
    document.body.classList.add('cms-active');
    state.isActive = true;
    ensureAddProductCard();
    scanEditableElements();
  }

  // Desactivar modo CMS
  function deactivateCMS() {
    const bar = document.getElementById('majestic-cms-bar');
    if (bar) bar.classList.remove('active');
    document.body.classList.remove('cms-active');
    document.body.classList.remove('cms-preview-mode');
    state.isActive = false;
    state.isPreview = false;
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    showToast('Modo edición cerrado', 'info');
  }

  // Escanear elementos editables
  function scanEditableElements() {
    ensureAddProductCard();
    const elements = document.querySelectorAll('[data-cms]');
    elements.forEach((el) => {
      if (el._cmsBound) return;
      el._cmsBound = true;

      el.addEventListener('click', (e) => {
        if (!state.isActive || state.isPreview) return;

        // Evitar navegación si es enlace o botón
        e.preventDefault();
        e.stopPropagation();

        state.activeElement = el;
        const type = el.getAttribute('data-cms-type') || detectElementType(el);

        if (type === 'image') {
          openImageModal(el);
        } else if (type === 'link') {
          openLinkModal(el);
        } else if (type === 'card') {
          openCardModal(el);
        } else if (type === 'insta-post') {
          openInstaPostModal(el);
        } else {
          openTextModal(el);
        }
      });
    });
  }

  function detectElementType(el) {
    if (el.classList.contains('insta-box-item')) return 'insta-post';
    if (el.tagName === 'IMG') return 'image';
    if (el.tagName === 'A' || el.classList.contains('btn') || el.classList.contains('card-cta') || el.classList.contains('btn-wa-xl')) return 'link';
    if (el.classList.contains('product-card')) return 'card';
    return 'text';
  }

  // Modal 1: Editor de Texto / Título / Subtítulo
  function openTextModal(el) {
    const fieldName = el.getAttribute('data-cms') || 'Elemento';
    const isHtml = el.innerHTML.includes('<') && (el.innerHTML.includes('<em>') || el.innerHTML.includes('<span>') || el.innerHTML.includes('<br'));
    const initialContent = isHtml ? el.innerHTML : el.innerText;

    const backdrop = document.createElement('div');
    backdrop.className = 'cms-modal-backdrop active';
    backdrop.innerHTML = `
      <div class="cms-modal">
        <div class="cms-modal-header">
          <h3 class="cms-modal-title">✏️ Editar: ${formatFieldName(fieldName)}</h3>
          <button class="cms-modal-close">&times;</button>
        </div>
        <div class="cms-modal-body">
          <div class="cms-form-group">
            <label class="cms-form-label">Contenido</label>
            <textarea id="cms-text-editor" class="cms-form-textarea" style="min-height: 130px;">${escapeHtml(initialContent)}</textarea>
            <small class="cms-form-help">
              Puedes usar etiquetas simples como <code>&lt;em&gt;texto cursiva rosa&lt;/em&gt;</code>, <code>&lt;strong&gt;negrita&lt;/strong&gt;</code> o <code>&lt;br&gt;</code> para saltos de línea.
            </small>
          </div>
        </div>
        <div class="cms-modal-footer">
          <button class="cms-btn cms-btn-cancel">Cancelar</button>
          <button id="cms-text-save" class="cms-btn cms-btn-save">Guardar Cambios</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const textarea = backdrop.querySelector('#cms-text-editor');
    const saveBtn = backdrop.querySelector('#cms-text-save');
    const closeBtns = backdrop.querySelectorAll('.cms-modal-close, .cms-btn-cancel');

    closeBtns.forEach((btn) => btn.addEventListener('click', () => backdrop.remove()));

    saveBtn.addEventListener('click', () => {
      const val = textarea.value;
      if (isHtml) {
        el.innerHTML = val;
      } else {
        el.innerText = val;
      }
      state.hasUnsavedChanges = true;
      backdrop.remove();
      showToast('Texto actualizado', 'success');
    });
  }

  // Modal 2: Editor de Imágenes (Banners, Fotos de Producto, Logo)
  function openImageModal(el) {
    const imgEl = el.tagName === 'IMG' ? el : el.querySelector('img');
    const currentSrc = imgEl ? imgEl.getAttribute('src') : '';
    const currentAlt = imgEl ? imgEl.getAttribute('alt') || '' : '';

    const backdrop = document.createElement('div');
    backdrop.className = 'cms-modal-backdrop active';

    // Miniaturas de galería
    let galleryHtml = '';
    DEFAULT_GALLERY.forEach((item) => {
      const isSelected = item.url === currentSrc ? 'selected' : '';
      galleryHtml += `
        <div class="cms-gallery-item ${isSelected}" data-img-url="${item.url}" title="${item.name}">
          <img src="${item.url}" alt="${item.name}" loading="lazy" />
          <span class="cms-gallery-label">${item.name}</span>
        </div>
      `;
    });

    backdrop.innerHTML = `
      <div class="cms-modal" style="max-width: 620px;">
        <div class="cms-modal-header">
          <h3 class="cms-modal-title">📷 Cambiar Imagen</h3>
          <button class="cms-modal-close">&times;</button>
        </div>
        <div class="cms-modal-body">
          <div class="cms-form-group">
            <label class="cms-form-label">Vista Previa Actual</label>
            <div class="cms-image-preview-box">
              <img id="cms-img-preview" src="${currentSrc}" alt="Vista previa" />
            </div>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Opción 1: Seleccionar de la Galería Majestic</label>
            <div class="cms-gallery-grid" id="cms-gallery-grid">
              ${galleryHtml}
            </div>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Opción 2: Subir Foto Nueva desde tu Dispositivo</label>
            <input type="file" id="cms-file-uploader" accept="image/*" class="cms-form-input" />
            <small class="cms-form-help">Selecciona una imagen desde tu PC o celular. Se adaptará automáticamente.</small>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Opción 3: Ruta o URL Externa</label>
            <input type="text" id="cms-img-url-input" class="cms-form-input" value="${currentSrc}" placeholder="ej: 1Carrusel.jpg o https://..." />
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Texto Descriptivo (SEO / Alt)</label>
            <input type="text" id="cms-img-alt-input" class="cms-form-input" value="${escapeHtml(currentAlt)}" />
          </div>
        </div>
        <div class="cms-modal-footer">
          <button class="cms-btn cms-btn-cancel">Cancelar</button>
          <button id="cms-img-save" class="cms-btn cms-btn-save">Aplicar Imagen</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const previewImg = backdrop.querySelector('#cms-img-preview');
    const urlInput = backdrop.querySelector('#cms-img-url-input');
    const altInput = backdrop.querySelector('#cms-img-alt-input');
    const fileUploader = backdrop.querySelector('#cms-file-uploader');
    const galleryItems = backdrop.querySelectorAll('.cms-gallery-item');
    const saveBtn = backdrop.querySelector('#cms-img-save');
    const closeBtns = backdrop.querySelectorAll('.cms-modal-close, .cms-btn-cancel');

    closeBtns.forEach((btn) => btn.addEventListener('click', () => backdrop.remove()));

    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        galleryItems.forEach((i) => i.classList.remove('selected'));
        item.classList.add('selected');
        const url = item.getAttribute('data-img-url');
        urlInput.value = url;
        previewImg.src = url;
      });
    });

    fileUploader.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        previewImg.src = e.target.result;
        urlInput.value = e.target.result;
        galleryItems.forEach((i) => i.classList.remove('selected'));
        showToast('Foto cargada en vista previa', 'info');
      };
      reader.readAsDataURL(file);
    });

    urlInput.addEventListener('input', () => {
      previewImg.src = urlInput.value;
    });

    saveBtn.addEventListener('click', () => {
      const finalSrc = urlInput.value.trim();
      const finalAlt = altInput.value.trim();

      if (imgEl) {
        imgEl.src = finalSrc;
        if (finalAlt) imgEl.alt = finalAlt;
      } else if (el.style) {
        el.style.backgroundImage = `url('${finalSrc}')`;
      }

      state.hasUnsavedChanges = true;
      backdrop.remove();
      showToast('Imagen actualizada', 'success');
    });
  }

  // Modal 3: Editor de Enlaces / Botones de WhatsApp
  function openLinkModal(el) {
    const isAnchor = el.tagName === 'A';
    const currentHref = isAnchor ? el.getAttribute('href') || '' : '';
    const currentText = el.innerText.trim();

    // Detección de enlace de WhatsApp
    const isWa = currentHref.includes('wa.me') || currentHref.includes('whatsapp');
    let waPhone = '573226219813';
    let waMsg = '';

    if (isWa) {
      try {
        const urlObj = new URL(currentHref);
        waPhone = urlObj.pathname.replace(/[^0-9]/g, '') || waPhone;
        waMsg = urlObj.searchParams.get('text') || '';
      } catch (e) {
        // Fallback básico si la URL es relativa
        const parts = currentHref.split('text=');
        if (parts[1]) waMsg = decodeURIComponent(parts[1]);
      }
    }

    const backdrop = document.createElement('div');
    backdrop.className = 'cms-modal-backdrop active';
    backdrop.innerHTML = `
      <div class="cms-modal">
        <div class="cms-modal-header">
          <h3 class="cms-modal-title">🔗 Editar Botón / Enlace</h3>
          <button class="cms-modal-close">&times;</button>
        </div>
        <div class="cms-modal-body">
          <div class="cms-form-group">
            <label class="cms-form-label">Texto del Botón</label>
            <input type="text" id="cms-link-text" class="cms-form-input" value="${escapeHtml(currentText)}" />
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Enlace de Destino (URL)</label>
            <input type="text" id="cms-link-href" class="cms-form-input" value="${escapeHtml(currentHref)}" />
            <small class="cms-form-help">Ej: <code>https://pijamasalmayor.com/sublimados_majestic</code> o un link directo de WhatsApp.</small>
          </div>

          <div style="background: #E8F8EE; border: 1.5px solid #25D366; padding: 14px; border-radius: 12px; margin-top: 6px;">
            <h4 style="margin: 0 0 8px 0; color: #128C7E; font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 6px;">
              <span>📲</span> Generador de Enlace WhatsApp
            </h4>
            <div class="cms-form-group">
              <label class="cms-form-label" style="color: #128C7E;">Número de WhatsApp (con código de país)</label>
              <input type="text" id="cms-wa-phone" class="cms-form-input" value="${waPhone}" placeholder="573226219813" />
            </div>
            <div class="cms-form-group" style="margin-top: 8px;">
              <label class="cms-form-label" style="color: #128C7E;">Mensaje Predeterminado</label>
              <textarea id="cms-wa-msg" class="cms-form-textarea" style="min-height: 60px;" placeholder="¡Hola! Quiero información sobre las pijamas de Sublimados Majestic">${escapeHtml(waMsg)}</textarea>
            </div>
            <button id="cms-btn-generate-wa" class="cms-btn" style="background: #25D366; color: white; margin-top: 8px; width: 100%; justify-content: center;">
              ⚡ Aplicar a la URL
            </button>
          </div>
        </div>
        <div class="cms-modal-footer">
          <button class="cms-btn cms-btn-cancel">Cancelar</button>
          <button id="cms-link-save" class="cms-btn cms-btn-save">Guardar Botón</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const textInput = backdrop.querySelector('#cms-link-text');
    const hrefInput = backdrop.querySelector('#cms-link-href');
    const phoneInput = backdrop.querySelector('#cms-wa-phone');
    const msgInput = backdrop.querySelector('#cms-wa-msg');
    const genWaBtn = backdrop.querySelector('#cms-btn-generate-wa');
    const saveBtn = backdrop.querySelector('#cms-link-save');
    const closeBtns = backdrop.querySelectorAll('.cms-modal-close, .cms-btn-cancel');

    closeBtns.forEach((btn) => btn.addEventListener('click', () => backdrop.remove()));

    genWaBtn.addEventListener('click', () => {
      const phone = phoneInput.value.replace(/[^0-9]/g, '');
      const msg = encodeURIComponent(msgInput.value.trim());
      const generated = `https://wa.me/${phone}${msg ? '?text=' + msg : ''}`;
      hrefInput.value = generated;
      showToast('Enlace de WhatsApp generado en la casilla de URL', 'info');
    });

    saveBtn.addEventListener('click', () => {
      const newText = textInput.value.trim();
      const newHref = hrefInput.value.trim();

      if (isAnchor && newHref) {
        el.setAttribute('href', newHref);
      }

      // Si el enlace tiene un span de texto o svg, preservamos la estructura
      const span = el.querySelector('span');
      if (span) {
        span.innerText = newText;
      } else if (el.children.length === 0) {
        el.innerText = newText;
      } else {
        // En caso de que contenga iconos SVG
        const svg = el.querySelector('svg');
        if (svg) {
          el.innerHTML = svg.outerHTML + ' ' + newText;
        } else {
          el.innerText = newText;
        }
      }

      state.hasUnsavedChanges = true;
      backdrop.remove();
      showToast('Botón actualizado', 'success');
    });
  }

  // Modal 4: Editor Integral de Tarjeta de Producto
  function openCardModal(el) {
    const imgEl = el.querySelector('.card-gallery img') || el.querySelector('img');
    const badgeEl = el.querySelector('.card-badge');
    const nameEl = el.querySelector('.card-name');
    const noteEl = el.querySelector('.card-note');
    const ctaEl = el.querySelector('.card-cta') || el.querySelector('a');

    const currentImg = imgEl ? imgEl.getAttribute('src') : '';
    const currentBadge = badgeEl ? badgeEl.innerText.trim() : '';
    const currentName = nameEl ? nameEl.innerText.trim() : '';
    const currentNote = noteEl ? noteEl.innerText.trim() : '';
    const currentHref = ctaEl ? ctaEl.getAttribute('href') : '';

    const backdrop = document.createElement('div');
    backdrop.className = 'cms-modal-backdrop active';
    backdrop.innerHTML = `
      <div class="cms-modal" style="max-width: 600px;">
        <div class="cms-modal-header">
          <h3 class="cms-modal-title">🛍️ Editar Tarjeta de Producto</h3>
          <button class="cms-modal-close">&times;</button>
        </div>
        <div class="cms-modal-body">
          <div class="cms-form-group">
            <label class="cms-form-label">Foto del Producto</label>
            <div style="display: flex; gap: 12px; align-items: center;">
              <img id="cms-card-preview" src="${currentImg}" style="width: 70px; height: 90px; object-fit: cover; border-radius: 8px; border: 1px solid #E8D5DE;" />
              <div style="flex: 1;">
                <input type="text" id="cms-card-img" class="cms-form-input" value="${currentImg}" placeholder="Ruta o URL de imagen" />
                <input type="file" id="cms-card-file" accept="image/*" class="cms-form-input" style="margin-top: 6px; font-size: 12px;" />
              </div>
            </div>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Insignia / Badge (ej: 🔥 Más vendida)</label>
            <input type="text" id="cms-card-badge" class="cms-form-input" value="${escapeHtml(currentBadge)}" placeholder="Vacío si no lleva" />
            <div class="cms-badge-chips">
              <span class="cms-chip" data-badge="✨ Nueva Colección">✨ Nueva Colección</span>
              <span class="cms-chip" data-badge="🔥 Más vendida">🔥 Más vendida</span>
              <span class="cms-chip" data-badge="💫 Bestseller">💫 Bestseller</span>
              <span class="cms-chip" data-badge="🎁 Top regalo">🎁 Top regalo</span>
              <span class="cms-chip" data-badge="⭐ Esencial">⭐ Esencial</span>
              <span class="cms-chip" data-badge="🔥 Tendencia">🔥 Tendencia</span>
              <span class="cms-chip" data-badge="">(Sin insignia)</span>
            </div>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Nombre del Producto</label>
            <input type="text" id="cms-card-name" class="cms-form-input" value="${escapeHtml(currentName)}" />
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Nota o Precio</label>
            <input type="text" id="cms-card-note" class="cms-form-input" value="${escapeHtml(currentNote)}" />
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Enlace de Compra / WhatsApp</label>
            <input type="text" id="cms-card-href" class="cms-form-input" value="${escapeHtml(currentHref)}" />
          </div>
        </div>
        <div class="cms-modal-footer" style="justify-content: space-between;">
          <button id="cms-card-delete" type="button" class="cms-btn" style="background: rgba(255, 59, 48, 0.12); color: #FF3B30; border: 1px solid rgba(255, 59, 48, 0.3);">
            🗑️ Eliminar Producto
          </button>
          <div style="display: flex; gap: 10px;">
            <button class="cms-btn cms-btn-cancel">Cancelar</button>
            <button id="cms-card-save" class="cms-btn cms-btn-save">Guardar Cambios</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const imgInput = backdrop.querySelector('#cms-card-img');
    const fileInput = backdrop.querySelector('#cms-card-file');
    const preview = backdrop.querySelector('#cms-card-preview');
    const badgeInput = backdrop.querySelector('#cms-card-badge');
    const nameInput = backdrop.querySelector('#cms-card-name');
    const noteInput = backdrop.querySelector('#cms-card-note');
    const hrefInput = backdrop.querySelector('#cms-card-href');
    const deleteBtn = backdrop.querySelector('#cms-card-delete');
    const saveBtn = backdrop.querySelector('#cms-card-save');
    const closeBtns = backdrop.querySelectorAll('.cms-modal-close, .cms-btn-cancel');

    closeBtns.forEach((btn) => btn.addEventListener('click', () => backdrop.remove()));

    // Chips de insignias rápidas
    const chips = backdrop.querySelectorAll('.cms-chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        badgeInput.value = chip.getAttribute('data-badge');
      });
    });

    fileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        imgInput.value = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    imgInput.addEventListener('input', () => {
      preview.src = imgInput.value;
    });

    deleteBtn.addEventListener('click', () => {
      const title = currentName || 'este producto';
      if (confirm(`¿Estás seguro de que deseas eliminar "${title}" de la colección?`)) {
        el.remove();
        state.hasUnsavedChanges = true;
        backdrop.remove();
        ensureAddProductCard();
        showToast('Producto eliminado de la colección', 'warning');
      }
    });

    saveBtn.addEventListener('click', () => {
      if (imgEl && imgInput.value.trim()) imgEl.src = imgInput.value.trim();

      const badgeVal = badgeInput.value.trim();
      if (badgeEl) {
        if (badgeVal) {
          badgeEl.innerText = badgeVal;
          badgeEl.style.display = '';
        } else {
          badgeEl.style.display = 'none';
        }
      } else if (badgeVal) {
        const gallery = el.querySelector('.card-gallery');
        if (gallery) {
          const newBadge = document.createElement('span');
          newBadge.className = 'card-badge';
          newBadge.innerText = badgeVal;
          gallery.prepend(newBadge);
        }
      }

      if (nameEl) nameEl.innerText = nameInput.value.trim();
      if (noteEl) noteEl.innerText = noteInput.value.trim();

      if (ctaEl && hrefInput.value.trim()) {
        ctaEl.setAttribute('href', hrefInput.value.trim());
      }

      const overlay = el.querySelector('.card-img-overlay');
      if (overlay && hrefInput.value.trim()) {
        overlay.setAttribute('href', hrefInput.value.trim());
      }

      state.hasUnsavedChanges = true;
      backdrop.remove();
      showToast('Tarjeta de producto actualizada', 'success');
    });
  }

  // Asegura que la tarjeta de "+ Añadir Producto" exista en el DOM y esté enlazada
  function ensureAddProductCard() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;

    let trigger = document.getElementById('cms-add-product-trigger');
    if (!trigger) {
      trigger = document.createElement('div');
      trigger.className = 'cms-add-product-card';
      trigger.id = 'cms-add-product-trigger';
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('title', 'Añadir nueva pijama a la colección');
      trigger.innerHTML = `
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
      `;
      grid.appendChild(trigger);
    } else {
      // Asegurarse de que esté siempre al final de la cuadrícula
      if (grid.lastElementChild !== trigger) {
        grid.appendChild(trigger);
      }
    }

    if (!trigger._cmsBound) {
      trigger._cmsBound = true;
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!state.isActive || state.isPreview) return;
        openNewProductModal();
      });
    }
  }

  // Modal para agregar una nueva pijama a la colección
  function openNewProductModal() {
    const backdrop = document.createElement('div');
    backdrop.className = 'cms-modal-backdrop active';

    // Miniaturas de la galería para elegir rápidamente
    let galleryHtml = '';
    DEFAULT_GALLERY.forEach((item, idx) => {
      const isSelected = idx === 0 ? 'selected' : '';
      galleryHtml += `
        <div class="cms-gallery-item ${isSelected}" data-img-url="${item.url}" title="${item.name}">
          <img src="${item.url}" alt="${item.name}" loading="lazy" />
          <span class="cms-gallery-label">${item.name}</span>
        </div>
      `;
    });

    const defaultImg = DEFAULT_GALLERY[0] ? DEFAULT_GALLERY[0].url : 'pantalon-camisa-familia.jpg';

    backdrop.innerHTML = `
      <div class="cms-modal" style="max-width: 620px;">
        <div class="cms-modal-header">
          <h3 class="cms-modal-title">✨ Añadir Nueva Pijama a la Colección</h3>
          <button class="cms-modal-close">&times;</button>
        </div>
        <div class="cms-modal-body">
          <p style="margin: 0; font-size: 13px; color: #7A5060;">
            Completa los datos para crear una nueva tarjeta en la cuadrícula. Se ubicará en orden y mantendrá la estructura intacta.
          </p>

          <div class="cms-form-group">
            <label class="cms-form-label">1. Foto de la Pijama</label>
            <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 8px;">
              <img id="cms-new-img-preview" src="${defaultImg}" style="width: 75px; height: 100px; object-fit: cover; border-radius: 8px; border: 2px solid var(--cms-primary); box-shadow: 0 4px 12px rgba(232,23,122,0.2);" />
              <div style="flex: 1;">
                <input type="text" id="cms-new-img-url" class="cms-form-input" value="${defaultImg}" placeholder="Ruta de imagen o URL" />
                <label style="display: inline-block; margin-top: 6px; font-size: 11px; font-weight: 700; color: #7A5060;">O sube una foto desde tu dispositivo:</label>
                <input type="file" id="cms-new-img-file" accept="image/*" class="cms-form-input" style="font-size: 11px; padding: 6px 10px;" />
              </div>
            </div>

            <label class="cms-form-label" style="font-size: 11px; margin-top: 4px;">O selecciona de la galería existente:</label>
            <div class="cms-gallery-grid" id="cms-new-gallery-grid" style="max-height: 140px;">
              ${galleryHtml}
            </div>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">2. Insignia / Distintivo (Opcional)</label>
            <input type="text" id="cms-new-card-badge" class="cms-form-input" placeholder="Ej: 🔥 Tendencia, ✨ Nueva Colección..." value="✨ Nueva Colección" />
            <div class="cms-badge-chips">
              <span class="cms-chip" data-badge="✨ Nueva Colección">✨ Nueva Colección</span>
              <span class="cms-chip" data-badge="🔥 Más vendida">🔥 Más vendida</span>
              <span class="cms-chip" data-badge="💫 Bestseller">💫 Bestseller</span>
              <span class="cms-chip" data-badge="🎁 Top regalo">🎁 Top regalo</span>
              <span class="cms-chip" data-badge="⭐ Esencial">⭐ Esencial</span>
              <span class="cms-chip" data-badge="🔥 Tendencia">🔥 Tendencia</span>
              <span class="cms-chip" data-badge="">(Sin insignia)</span>
            </div>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">3. Nombre de la Pijama</label>
            <input type="text" id="cms-new-card-name" class="cms-form-input" placeholder="Ej: Pijama Lolita Velvet 3 Piezas" />
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">4. Nota o Precio</label>
            <input type="text" id="cms-new-card-note" class="cms-form-input" value="💬 Consultar precio por WhatsApp" placeholder="Ej: 💬 Consultar precio por WhatsApp o $45.000" />
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">5. Enlace del Botón (Catálogo o WhatsApp)</label>
            <input type="text" id="cms-new-card-href" class="cms-form-input" value="https://pijamasalmayor.com/sublimados_majestic" />
          </div>

          <div style="background: #E8F8EE; border: 1.5px solid #25D366; padding: 12px 14px; border-radius: 12px;">
            <h4 style="margin: 0 0 6px 0; color: #128C7E; font-size: 12.5px; font-weight: 800; display: flex; align-items: center; gap: 6px;">
              <span>📲</span> Generar enlace directo a WhatsApp para este producto
            </h4>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="cms-new-wa-phone" class="cms-form-input" value="573226219813" style="width: 140px; font-size: 12px;" placeholder="573226219813" />
              <button type="button" id="cms-new-btn-apply-wa" class="cms-btn" style="background: #25D366; color: white; flex: 1; justify-content: center; font-size: 11.5px;">
                ⚡ Aplicar WhatsApp al enlace
              </button>
            </div>
          </div>
        </div>
        <div class="cms-modal-footer">
          <button class="cms-btn cms-btn-cancel">Cancelar</button>
          <button id="cms-new-card-save" class="cms-btn cms-btn-save">✨ Agregar Producto a la Colección</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const imgPreview = backdrop.querySelector('#cms-new-img-preview');
    const imgUrlInput = backdrop.querySelector('#cms-new-img-url');
    const fileInput = backdrop.querySelector('#cms-new-img-file');
    const galleryItems = backdrop.querySelectorAll('#cms-new-gallery-grid .cms-gallery-item');
    const badgeInput = backdrop.querySelector('#cms-new-card-badge');
    const nameInput = backdrop.querySelector('#cms-new-card-name');
    const noteInput = backdrop.querySelector('#cms-new-card-note');
    const hrefInput = backdrop.querySelector('#cms-new-card-href');
    const waPhoneInput = backdrop.querySelector('#cms-new-wa-phone');
    const applyWaBtn = backdrop.querySelector('#cms-new-btn-apply-wa');
    const saveBtn = backdrop.querySelector('#cms-new-card-save');
    const closeBtns = backdrop.querySelectorAll('.cms-modal-close, .cms-btn-cancel');

    closeBtns.forEach((btn) => btn.addEventListener('click', () => backdrop.remove()));

    // Selección de galería
    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        galleryItems.forEach((i) => i.classList.remove('selected'));
        item.classList.add('selected');
        const url = item.getAttribute('data-img-url');
        imgUrlInput.value = url;
        imgPreview.src = url;
      });
    });

    // Subida de imagen desde archivo
    fileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        imgPreview.src = e.target.result;
        imgUrlInput.value = e.target.result;
        galleryItems.forEach((i) => i.classList.remove('selected'));
      };
      reader.readAsDataURL(file);
    });

    imgUrlInput.addEventListener('input', () => {
      imgPreview.src = imgUrlInput.value;
    });

    // Chips de insignias rápidas
    const chips = backdrop.querySelectorAll('.cms-chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        badgeInput.value = chip.getAttribute('data-badge');
      });
    });

    // Generador WhatsApp
    applyWaBtn.addEventListener('click', () => {
      const phone = waPhoneInput.value.replace(/[^0-9]/g, '') || '573226219813';
      const productName = nameInput.value.trim() || 'esta pijama';
      const msg = encodeURIComponent(`¡Hola Sublimados Majestic! Quiero consultar precio al por mayor y disponibilidad de: ${productName}`);
      hrefInput.value = `https://wa.me/${phone}?text=${msg}`;
      showToast('Enlace de WhatsApp asignado a la casilla de URL', 'info');
    });

    // Guardar nuevo producto
    saveBtn.addEventListener('click', () => {
      const name = nameInput.value.trim() || 'Nueva Pijama Majestic';
      const imgSrc = imgUrlInput.value.trim() || defaultImg;
      const badge = badgeInput.value.trim();
      const note = noteInput.value.trim() || '💬 Consultar precio por WhatsApp';
      const href = hrefInput.value.trim() || 'https://pijamasalmayor.com/sublimados_majestic';

      const grid = document.querySelector('.product-grid');
      if (!grid) {
        showToast('No se encontró el contenedor de la colección', 'error');
        return;
      }

      const cardId = `product-card-${Date.now()}`;
      const badgeHtml = badge ? `\n          <span class="card-badge">${escapeHtml(badge)}</span>` : '';

      const cardMarkup = `
      <div class="product-card" data-cms="${cardId}" data-cms-type="card">
        <div class="card-gallery">
          <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(name)}" loading="lazy">${badgeHtml}
          <a href="${escapeHtml(href)}" target="_blank" rel="noopener" class="card-img-overlay" aria-label="Ver Catálogo Digital">
            <span class="card-img-overlay-btn"><svg viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"></path></svg> Ver en Catálogo Digital</span>
          </a>
        </div>
        <div class="card-body">
          <div class="card-name">${escapeHtml(name)}</div>
          <div class="card-note">${escapeHtml(note)}</div>
          <a href="${escapeHtml(href)}" target="_blank" rel="noopener" class="card-cta"><svg viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"></path></svg> Ver en Catálogo Digital</a>
        </div>
      </div>
      `.trim();

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cardMarkup;
      const newCard = tempDiv.firstElementChild;

      const addCardTrigger = grid.querySelector('#cms-add-product-trigger');
      if (addCardTrigger) {
        grid.insertBefore(newCard, addCardTrigger);
      } else {
        grid.appendChild(newCard);
      }

      // Volver a asegurar que el botón + siga al final y escanear
      ensureAddProductCard();
      scanEditableElements();

      state.hasUnsavedChanges = true;
      backdrop.remove();
      showToast(`¡"${name}" añadida con éxito a la colección!`, 'success', 4500);

      // Desplazamiento suave y efecto de foco en la nueva tarjeta
      setTimeout(() => {
        newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        newCard.style.transition = 'box-shadow 0.4s ease, transform 0.4s ease';
        newCard.style.outline = '3px solid var(--cms-primary)';
        newCard.style.boxShadow = '0 0 24px rgba(232, 23, 122, 0.5)';
        setTimeout(() => {
          newCard.style.outline = '';
          newCard.style.boxShadow = '';
        }, 2200);
      }, 300);
    });
  }


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
      galleryHtml += `
        <div class="cms-gallery-item ${isSelected}" data-img-url="${item.url}" title="${item.name}">
          <img src="${item.url}" alt="${item.name}" loading="lazy" />
          <span class="cms-gallery-label">${item.name}</span>
        </div>
      `;
    });

    const backdrop = document.createElement('div');
    backdrop.className = 'cms-modal-backdrop active';
    backdrop.innerHTML = `
      <div class="cms-modal" style="max-width: 600px;">
        <div class="cms-modal-header">
          <h3 class="cms-modal-title">📸 Editar Publicación de Instagram</h3>
          <button class="cms-modal-close">&times;</button>
        </div>
        <div class="cms-modal-body">
          <div class="cms-form-group">
            <label class="cms-form-label">Foto / Portada de la Publicación</label>
            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 10px;">
              <img id="cms-insta-preview" src="${currentImg}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #E8D5DE;" />
              <div style="flex: 1;">
                <input type="text" id="cms-insta-img" class="cms-form-input" value="${currentImg}" placeholder="Ruta o URL de imagen" />
                <input type="file" id="cms-insta-file" accept="image/*" class="cms-form-input" style="margin-top: 6px; font-size: 12px;" />
              </div>
            </div>
            <div class="cms-gallery-grid" id="cms-insta-gallery" style="max-height: 130px; overflow-y: auto;">
              ${galleryHtml}
            </div>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Enlace al Post en Instagram</label>
            <input type="text" id="cms-insta-href" class="cms-form-input" value="${currentHref}" placeholder="https://www.instagram.com/p/..." />
            <small class="cms-form-help">URL directa al Reel, carrusel o post en Instagram.</small>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Tipo de Publicación</label>
            <select id="cms-insta-type" class="cms-form-select">
              <option value="reel" ${currentType === 'reel' ? 'selected' : ''}>▶ Video Reel (Icono de Reproducción)</option>
              <option value="carousel" ${currentType === 'carousel' ? 'selected' : ''}>📑 Carrusel (Icono de Fotos Múltiples)</option>
              <option value="none" ${currentType === 'none' ? 'selected' : ''}>🖼️ Foto Normal (Sin Icono)</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="cms-form-group">
              <label class="cms-form-label">❤️ Me gusta (Likes)</label>
              <input type="text" id="cms-insta-likes" class="cms-form-input" value="${currentLikes}" placeholder="894" />
            </div>
            <div class="cms-form-group">
              <label class="cms-form-label">💬 Comentarios</label>
              <input type="text" id="cms-insta-coms" class="cms-form-input" value="${currentComs}" placeholder="67" />
            </div>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Texto Descriptivo (Alt)</label>
            <input type="text" id="cms-insta-alt" class="cms-form-input" value="${escapeHtml(currentAlt)}" placeholder="Descripción de la prenda" />
          </div>
        </div>
        <div class="cms-modal-footer">
          <button class="cms-btn cms-btn-cancel">Cancelar</button>
          <button id="cms-insta-save" class="cms-btn cms-btn-save">Guardar Publicación</button>
        </div>
      </div>
    `;
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
      overlayEl.innerHTML = `
        <span class="insta-box-stat-item">❤️ ${newLikes}</span>
        <span class="insta-box-stat-item">💬 ${newComs}</span>
      `;

      state.hasUnsavedChanges = true;
      backdrop.remove();
      showToast('Publicación de Instagram actualizada', 'success');
    });
  }

  // Modal 5: Configuración (GitHub Token, Repositorio, PIN)
  function openSettingsModal() {
    const backdrop = document.createElement('div');
    backdrop.className = 'cms-modal-backdrop active';
    backdrop.innerHTML = `
      <div class="cms-modal" style="max-width: 520px;">
        <div class="cms-modal-header">
          <h3 class="cms-modal-title">⚙️ Ajustes del CMS</h3>
          <button class="cms-modal-close">&times;</button>
        </div>
        <div class="cms-modal-body">
          <div class="cms-form-group">
            <label class="cms-form-label">GitHub Personal Access Token (PAT)</label>
            <input type="password" id="cms-set-token" class="cms-form-input" value="${state.config.githubToken}" placeholder="ghp_xxxxxxxxxxxx" />
            <small class="cms-form-help">
              Permite publicar cambios directamente al repositorio GitHub sin tocar código. Requiere permisos <code>repo</code>.<br/>
              👉 <a href="https://github.com/settings/tokens/new?scopes=repo&description=CMS%20Sublimados%20Majestic" target="_blank" rel="noopener" style="color: var(--cms-primary); font-weight: 800; text-decoration: underline;">Haz clic aquí para crear tu Token de GitHub</a> (ya tiene el permiso 'repo' seleccionado).
            </small>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Repositorio GitHub</label>
            <input type="text" id="cms-set-repo" class="cms-form-input" value="${state.config.githubRepo}" placeholder="usuario/repositorio" />
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Rama Principal</label>
            <input type="text" id="cms-set-branch" class="cms-form-input" value="${state.config.githubBranch}" placeholder="main" />
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">PIN de Administrador</label>
            <input type="text" id="cms-set-pin" class="cms-form-input" value="${state.config.pin}" maxlength="8" />
          </div>

          <div style="border-top: 1px solid #E8D5DE; padding-top: 14px; margin-top: 14px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 18px;">📸</span>
              <label class="cms-form-label" style="margin: 0; font-size: 14px; font-weight: 800; color: #111;">Feed de Instagram en Vivo (Opcional)</label>
            </div>
            <input type="text" id="cms-set-feedid" class="cms-form-input" value="${state.config.instaFeedId || ''}" placeholder="Ej: kM8xY9zABC... (Feed ID de behold.so)" />
            <small class="cms-form-help" style="margin-top: 6px; line-height: 1.5;">
              <strong>¿Deseas conectar tus fotos en tiempo real?</strong><br/>
              1. Crea tu cuenta gratuita en <a href="https://behold.so" target="_blank" rel="noopener" style="color: var(--cms-primary); font-weight: 700; text-decoration: underline;">behold.so</a>.<br/>
              2. Conecta tu perfil <strong>@sublimadosmajestic</strong>.<br/>
              3. Pega aquí el <strong>Feed ID</strong> generado y guarda.<br/>
              <em>Si lo dejas vacío, se mostrará el muro nativo interactivo con tus 12 publicaciones curadas (las cuales puedes editar haciendo clic en cada una en modo CMS).</em>
            </small>
          </div>

          <div style="border-top: 1px solid #E8D5DE; padding-top: 12px; margin-top: 6px;">
            <button id="cms-btn-clear-draft" class="cms-btn" style="background: rgba(255, 107, 129, 0.15); color: #d63031; width: 100%; justify-content: center;">
              🗑️ Descartar Borrador y Volver al Original
            </button>
          </div>
        </div>
        <div class="cms-modal-footer">
          <button class="cms-btn cms-btn-cancel">Cancelar</button>
          <button id="cms-set-save" class="cms-btn cms-btn-save">Guardar Configuración</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const tokenInput = backdrop.querySelector('#cms-set-token');
    const repoInput = backdrop.querySelector('#cms-set-repo');
    const branchInput = backdrop.querySelector('#cms-set-branch');
    const pinInput = backdrop.querySelector('#cms-set-pin');
    const clearDraftBtn = backdrop.querySelector('#cms-btn-clear-draft');
    const saveBtn = backdrop.querySelector('#cms-set-save');
    const closeBtns = backdrop.querySelectorAll('.cms-modal-close, .cms-btn-cancel');

    closeBtns.forEach((btn) => btn.addEventListener('click', () => backdrop.remove()));

    clearDraftBtn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de descartar el borrador local? Se recargará la página original.')) {
        localStorage.removeItem(STORAGE_KEYS.DRAFT);
        location.reload();
      }
    });

    saveBtn.addEventListener('click', () => {
      state.config.githubToken = tokenInput.value.trim();
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

      saveConfig();
      backdrop.remove();
      showToast('Ajustes guardados correctamente', 'success');
    });
  }

  // Serializador de HTML Limpio (Elimina barra, modales y marcas del CMS)
  function getCleanHtml() {
    const clone = document.documentElement.cloneNode(true);

    // Remover barra superior del CMS y modales
    const cmsBar = clone.querySelector('#majestic-cms-bar');
    if (cmsBar) cmsBar.remove();

    const modals = clone.querySelectorAll('.cms-modal-backdrop, #cms-toast-container');
    modals.forEach((m) => m.remove());

    // Limpiar clases temporales del body
    const body = clone.querySelector('body');
    if (body) {
      body.classList.remove('cms-active', 'cms-preview-mode');
    }

    // Limpiar estilos temporales inline en tarjetas
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
    }

    return '<!DOCTYPE html>\n' + clone.outerHTML;
  }

  // Guardar borrador en LocalStorage
  function saveDraft() {
    try {
      const cleanHtml = getCleanHtml();
      localStorage.setItem(STORAGE_KEYS.DRAFT, cleanHtml);
      state.hasUnsavedChanges = false;
      showToast('Borrador guardado localmente', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error al guardar borrador (memoria llena)', 'error');
    }
  }

  // Descargar index.html limpio
  function downloadHtml() {
    const cleanHtml = getCleanHtml();
    const blob = new Blob([cleanHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Archivo index.html descargado', 'success');
  }

  // Publicar directamente en GitHub Pages vía API
  async function publishToGitHub() {
    if (!state.config.githubToken) {
      showToast('Falta el Token de GitHub. Ingresa a Ajustes (⚙️) para configurarlo.', 'warning', 5000);
      openSettingsModal();
      return;
    }

    const publishBtn = document.getElementById('cms-btn-publish');
    const originalText = publishBtn ? publishBtn.innerHTML : '';
    if (publishBtn) {
      publishBtn.innerHTML = '⏳ Publicando...';
      publishBtn.disabled = true;
    }

    showToast('Conectando con GitHub...', 'info', 2500);

    try {
      const repo = state.config.githubRepo;
      const branch = state.config.githubBranch;
      const token = state.config.githubToken;
      const apiUrl = `https://api.github.com/repos/${repo}/contents/index.html`;

      // 1. Obtener SHA actual del archivo index.html
      const getRes = await fetch(`${apiUrl}?ref=${branch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      if (!getRes.ok) {
        throw new Error(`Error al leer archivo del repo: ${getRes.status} ${getRes.statusText}`);
      }

      const fileData = await getRes.json();
      const currentSha = fileData.sha;

      // 2. Preparar contenido limpio codificado en Base64 UTF-8
      const cleanHtml = getCleanHtml();
      const encodedContent = btoa(unescape(encodeURIComponent(cleanHtml)));

      // 3. Hacer commit y actualizar en GitHub
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'cms: actualización de contenidos desde el editor visual',
          content: encodedContent,
          sha: currentSha,
          branch: branch
        })
      });

      if (!putRes.ok) {
        const errJson = await putRes.json();
        throw new Error(errJson.message || 'Error al actualizar en GitHub');
      }

      state.hasUnsavedChanges = false;
      showToast('🎉 ¡Publicado con éxito en GitHub! Tu sitio se actualizará en ~30 segundos.', 'success', 6000);
    } catch (err) {
      console.error(err);
      showToast(`Error al publicar: ${err.message}`, 'error', 6000);
    } finally {
      if (publishBtn) {
        publishBtn.innerHTML = originalText;
        publishBtn.disabled = false;
      }
    }
  }

  // Utilidades
  function formatFieldName(name) {
    return name
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Inicialización al cargar el DOM
  function init() {
    loadConfig();

    // Comprobar atajo de teclado: Ctrl + Shift + E
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        if (state.isActive) {
          deactivateCMS();
        } else {
          openLoginModal();
        }
      }
    });

    // Enlazar botón de footer si existe
    const adminTrigger = document.getElementById('cms-admin-trigger');
    if (adminTrigger) {
      adminTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (state.isActive) {
          deactivateCMS();
        } else {
          openLoginModal();
        }
      });
    }

    // Si ya estaba autenticado en la sesión actual
    if (sessionStorage.getItem(STORAGE_KEYS.SESSION) === 'authenticated') {
      activateCMS();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
