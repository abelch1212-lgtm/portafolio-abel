// ============================================================
// PORTAFOLIO — ABEL · Interacciones y efectos de scroll 3D
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- NAV: estado scrolled + menú móvil ---------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  /* ---------------- HERO: parallax de capas 3D en scroll ---------------- */
  const heroGrid = document.getElementById('hero-grid');
  const heroGlow = document.getElementById('hero-glow');
  const hero = document.getElementById('hero');

  if (!reduceMotion){
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const heroHeight = hero.offsetHeight;
      if (y < heroHeight){
        heroGrid.style.transform = `translate3d(0, ${y * 0.35}px, 0) rotateX(${y * 0.01}deg)`;
        heroGlow.style.transform = `translate3d(0, ${y * 0.15}px, 0)`;
      }
    }, { passive:true });

    // Parallax sutil con el mouse en el hero (profundidad 3D)
    hero.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const yPos = (e.clientY / innerHeight - 0.5) * 2;
      heroGrid.style.transform += ` `;
      heroGrid.style.transform = `translate3d(${x * 10}px, ${window.scrollY * 0.35 + yPos * 10}px, 0) rotateX(${yPos * 2}deg) rotateY(${x * 2}deg)`;
    });
  }

  /* ---------------- Reveal on scroll (IntersectionObserver) ---------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.15 });

  document.querySelectorAll('.reveal, .tl-item').forEach(el => revealObserver.observe(el));

  /* ---------------- ABOUT: foto con tilt 3D según posición del mouse ---------------- */
  const aboutPhoto = document.querySelector('.about-photo');
  if (aboutPhoto && !reduceMotion){
    const wrap = document.querySelector('.about-photo-wrap');
    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      aboutPhoto.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
    });
    wrap.addEventListener('mouseleave', () => {
      aboutPhoto.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });
  }

  /* ---------------- GALERÍA: filtros por categoría ---------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.g-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        const match = cat === 'all' || card.dataset.cat === cat;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ---------------- GALERÍA: tilt 3D en cada card según el mouse ---------------- */
  if (!reduceMotion){
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${x * 8}deg) rotateX(${y * -8}deg) translateZ(10px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(0)`;
      });
    });
  }

  /* ---------------- GALERÍA: scroll depth (cards se "acercan" al entrar en viewport) ---------------- */
  const depthObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.style.opacity = '1';
        entry.target.style.transform = entry.target.style.transform.includes('rotateY') ? entry.target.style.transform : 'translateZ(0) translateY(0)';
      }
    });
  }, { threshold:0.1 });
  cards.forEach(card => {
    card.style.transition = card.style.transition + ', opacity .6s ease';
    depthObserver.observe(card);
  });

  /* ---------------- LIGHTBOX ---------------- */
  const lightbox = document.getElementById('lightbox');
  const lbContent = lightbox.querySelector('.lb-content');
  const lbCaption = lightbox.querySelector('.lb-caption');
  const lbClose = lightbox.querySelector('.lb-close');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const type = card.dataset.type;
      const src = card.dataset.src;
      const caption = card.dataset.caption || '';

      lbContent.innerHTML = '';
      let el;
      if (type === 'video'){
        el = document.createElement('video');
        el.src = src;
        el.controls = true;
        el.autoplay = true;
      } else {
        el = document.createElement('img');
        el.src = src;
      }
      lbContent.appendChild(el);
      lbCaption.textContent = caption;
      lightbox.classList.add('open');
    });
  });

  function closeLightbox(){
    lightbox.classList.remove('open');
    lbContent.innerHTML = '';
  }
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------------- FORMULARIO DE CONTACTO (mailto) ---------------- */
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cName').value;
    const email = document.getElementById('cEmail').value;
    const msg = document.getElementById('cMsg').value;
    const subject = encodeURIComponent(`Contacto desde portafolio — ${name}`);
    const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
    window.location.href = `mailto:abelch1212@gmail.com?subject=${subject}&body=${body}`;
  });

});
