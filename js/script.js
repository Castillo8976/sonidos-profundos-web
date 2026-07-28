// =========================================================
// SONIDO PROFUNDO DE TIMBIQUÍ — script.js
// =========================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header state on scroll + river progress + hero parallax ---------- */
  const header = document.getElementById('siteHeader');
  const riverFill = document.getElementById('riverFill');
  const heroMedia = document.querySelector('.hero__media');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onScroll = () => {
  const scrollY = window.scrollY;
  header.classList.toggle('is-scrolled', scrollY > 40);

  if (riverFill) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    riverFill.style.width = `${Math.min(progress, 100)}%`;
  }

  if (heroMedia && !prefersReducedMotion && scrollY < window.innerHeight) {
    heroMedia.style.setProperty('--parallax', `${scrollY * 0.25}px`);
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navOverlay = document.getElementById('navOverlay');

  const closeNav = () => {
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    navOverlay.classList.remove('is-open');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navOverlay.classList.toggle('is-open', isOpen);
  });

  navOverlay.addEventListener('click', closeNav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('is-open')) closeNav();
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  /* ---------- Scroll reveal (fade/slide + staggered groups) ---------- */
  const revealEls = document.querySelectorAll('.reveal, .stagger');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Animated stat counters (hero) ---------- */
  const statEls = document.querySelectorAll('[data-count]');
  if (statEls.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10);
      if (prefersReducedMotion) {
        el.textContent = target;
        return;
      }
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      statEls.forEach(el => statObserver.observe(el));
    } else {
      statEls.forEach(el => { el.textContent = el.dataset.count; });
    }
  }

  /* ---------- Gallery "ver más fotos" toggle ---------- */
  const galleryToggle = document.getElementById('galleryToggle');
  const galleryMore = document.getElementById('galleryMore');
  if (galleryToggle && galleryMore) {
    galleryToggle.addEventListener('click', () => {
      const isHidden = galleryMore.hasAttribute('hidden');
      if (isHidden) {
        galleryMore.removeAttribute('hidden');
        galleryToggle.textContent = 'Ver menos fotos';
        galleryToggle.setAttribute('aria-expanded', 'true');
      } else {
        galleryMore.setAttribute('hidden', '');
        galleryToggle.textContent = 'Ver más fotos';
        galleryToggle.setAttribute('aria-expanded', 'false');
        galleryToggle.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      }
    });
  }

  /* ---------- Gallery lightbox ---------- */
  const galleryButtons = document.querySelectorAll('.gallery__item[data-full]');
  if (galleryButtons.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox__close" aria-label="Cerrar imagen">&times;</button>
      <img src="" alt="">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox__close');

    const openLightbox = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    galleryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const img = btn.querySelector('img');
        openLightbox(btn.dataset.full, img ? img.alt : '');
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        status.textContent = 'Por favor completa los campos obligatorios.';
        status.classList.add('is-error');
        form.reportValidity();
        return;
      }

      const accessKey = form.querySelector('[name="access_key"]').value;
      const submitBtn = form.querySelector('button[type="submit"]');

      // If the Web3Forms access key hasn't been configured yet,
      // fall back to a friendly local confirmation instead of
      // sending a request that will fail.
      if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
        status.classList.remove('is-error');
        status.textContent = 'Formulario listo. Configura tu access key de Web3Forms (o el servicio de envío que prefieras) en index.html para activar el envío real.';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      try {
        const formData = new FormData(form);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        const result = await response.json();

        if (result.success) {
          status.classList.remove('is-error');
          status.textContent = '¡Gracias! Tu mensaje fue enviado. Te contactaremos pronto.';
          form.reset();
        } else {
          throw new Error(result.message || 'Error desconocido');
        }
      } catch (err) {
        status.classList.add('is-error');
        status.textContent = 'No pudimos enviar el mensaje. Intenta de nuevo o escríbenos directamente a los contactos indicados.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar mensaje';
      }
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Pending social links (placeholder href="#") ---------- */
  // Prevents an unexpected jump-to-top while the real profile links
  // (Facebook, YouTube, Spotify, etc.) are still being added.
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => e.preventDefault());
  });

});
