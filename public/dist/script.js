const localizedText = [...document.querySelectorAll('[data-tr]')].map(element => ({
  element,
  en: element.textContent,
  tr: element.dataset.tr
}));
const localizedImages = [...document.querySelectorAll('[data-alt-tr]')].map(image => ({
  image,
  en: image.alt,
  tr: image.dataset.altTr
}));
const languageButtons = document.querySelectorAll('.language-switch button');
const englishTitle = document.title;

function setLanguage(lang) {
  document.documentElement.lang = lang;
  document.title = lang === 'tr' ? 'Berk Kocabörek | IT Altyapısı ve Linux Sistemleri' : englishTitle;
  localizedText.forEach(({ element, ...copy }) => {
    element.textContent = copy[lang];
  });
  localizedImages.forEach(({ image, ...copy }) => {
    image.alt = copy[lang];
  });
  languageButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.lang === lang));
  });
}

function preferredLanguage() {
  try {
    return localStorage.getItem('language') === 'tr' ? 'tr' : 'en';
  } catch (error) {
    return 'en';
  }
}

setLanguage(preferredLanguage());
languageButtons.forEach(button => {
  button.addEventListener('click', () => {
    setLanguage(button.lang);
    try {
      localStorage.setItem('language', button.lang);
    } catch (error) {
      // Language switching remains available when browser storage is disabled.
    }
  });
});

const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const contactButton = contactForm.querySelector('button[type="submit"]');
const contactMessages = {
  en: {
    pending: 'Sending…',
    sent: 'Your message was sent.',
    failed: 'Message could not be sent. Please try again or email me directly.'
  },
  tr: {
    pending: 'Gönderiliyor…',
    sent: 'Mesajınız gönderildi.',
    failed: 'Mesaj gönderilemedi. Tekrar deneyebilir veya doğrudan e-posta gönderebilirsiniz.'
  }
};

function showContactStatus(status) {
  contactStatus.textContent = contactMessages[document.documentElement.lang][status];
}

contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  contactButton.disabled = true;
  showContactStatus('pending');

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Form submission failed');
    contactForm.reset();
    showContactStatus('sent');
  } catch (error) {
    showContactStatus('failed');
  } finally {
    contactButton.disabled = false;
  }
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const starfield = document.getElementById('starfield-container');

function initStarfield() {
  const {
    Scene, PerspectiveCamera, WebGLRenderer, BufferGeometry, BufferAttribute, PointsMaterial,
    Points, AdditiveBlending
  } = window.THREE;
  let renderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true });
  } catch (error) {
    return null;
  }

  const scene = new Scene();
  const camera = new PerspectiveCamera(60, 1, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  const count = 4000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < positions.length; i += 3) {
    positions.set([
      (Math.random() - 0.5) * 1000,
      (Math.random() - 0.5) * 1000,
      (Math.random() - 0.5) * 1000
    ], i);
    colors.set(Math.random() > 0.8 ? [0.5, 0.25, 1] : [1, 1, 1], i);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  const material = new PointsMaterial({
    size: 0.14,
    transparent: true,
    opacity: 0.9,
    vertexColors: true,
    blending: AdditiveBlending
  });
  const stars = new Points(geometry, material);
  scene.add(stars);
  starfield.appendChild(renderer.domElement);

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  resize();
  window.addEventListener('resize', resize);

  let targetX = 0;
  let targetY = 0;
  let active = false;
  window.addEventListener('pointermove', event => {
    if (!active) return;
    targetX = (event.clientX / window.innerWidth - 0.5) * 0.5;
    targetY = (event.clientY / window.innerHeight - 0.5) * 0.5;
  }, { passive: true });

  let lastFrame = 0;
  function renderFrame(time) {
    if (time - lastFrame < 32) return;
    lastFrame = time;
    stars.rotation.z += 0.001;
    stars.rotation.y += (targetX - stars.rotation.y) * 0.05;
    stars.rotation.x += (targetY - stars.rotation.x) * 0.05;
    renderer.render(scene, camera);
  }

  return function setActive(visible) {
    if (active === visible) return;
    active = visible;
    renderer.domElement.style.visibility = active ? 'visible' : 'hidden';
    renderer.setAnimationLoop(active ? renderFrame : null);
  };
}

function watchStarfield() {
  const desktop = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
  let heroVisible = false;
  let loadScheduled = false;
  let loadStarted = false;
  let setActive;
  const canAnimate = () => heroVisible && desktop.matches && !reducedMotion.matches
    && !document.hidden;

  function loadRenderer() {
    loadScheduled = false;
    if (!canAnimate()) return;
    loadStarted = true;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.addEventListener('load', updateStarfield);
    document.head.appendChild(script);
  }

  function updateStarfield() {
    const visible = canAnimate();
    if (visible && setActive === undefined && window.THREE) setActive = initStarfield();
    if (setActive) setActive(visible);
    if (!visible || loadScheduled || loadStarted || document.readyState !== 'complete') return;
    loadScheduled = true;
    if (window.requestIdleCallback) {
      window.requestIdleCallback(loadRenderer);
    } else {
      window.setTimeout(loadRenderer, 350);
    }
  }

  const heroObserver = new IntersectionObserver(([entry]) => {
    heroVisible = entry.intersectionRatio >= 0.15;
    starfield.style.opacity = heroVisible ? '1' : '0.45';
    updateStarfield();
  }, { threshold: 0.15 });
  heroObserver.observe(document.getElementById('home'));
  desktop.addEventListener('change', updateStarfield);
  reducedMotion.addEventListener('change', updateStarfield);
  document.addEventListener('visibilitychange', updateStarfield);
  window.addEventListener('load', updateStarfield);
}

function scrambleHeading(heading) {
  const { textContent: text } = heading;
  const { lang } = document.documentElement;
  const symbols = '!<>-_\\/[]{}=+*^?#';
  let step = 0;
  heading.setAttribute('aria-label', text);
  const interval = setInterval(() => {
    if (document.documentElement.lang !== lang || reducedMotion.matches || step >= text.length) {
      clearInterval(interval);
      if (document.documentElement.lang === lang) heading.textContent = text;
      heading.removeAttribute('aria-label');
      return;
    }
    heading.textContent = [...text].map((char, index) => (
      index < step || char === ' ' ? char : symbols[Math.floor(Math.random() * symbols.length)]
    )).join('');
    step += 1;
  }, 35);
}

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('awaiting-reveal');
      const heading = entry.target.querySelector('.section-title');
      if (heading && !reducedMotion.matches) scrambleHeading(heading);
      observer.unobserve(entry.target);
    });
  });
  document.querySelectorAll('.animate-on-scroll').forEach(section => {
    if (section.getBoundingClientRect().top >= window.innerHeight) {
      section.classList.add('awaiting-reveal');
    }
    revealObserver.observe(section);
  });
}

if ('IntersectionObserver' in window) watchStarfield();
