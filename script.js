let scene, camera, renderer, stars;
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function initStarfield() {
  const container = document.getElementById('starfield-container');
  if (!container) return;

  scene = new THREE.Scene();

  const fov = isMobile ? 75 : 60;
  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  renderer = new THREE.WebGLRenderer({
    canvas: document.createElement('canvas'),
    alpha: true,
    antialias: !isMobile
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  container.appendChild(renderer.domElement);

  const starCount = isMobile ? 1500 : 6000;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1000;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: isMobile ? 0.25 : 0.02,
    color: 0xffffff,
    transparent: true,
    opacity: isMobile ? 0.9 : 0.7
  });

  stars = new THREE.Points(geometry, material);
  scene.add(stars);

  window.addEventListener('resize', onWindowResize, false);

  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('touchmove', onTouchMove, { passive: false });

  animate();
}

function onMouseMove(event) {
  targetX = (event.clientX / window.innerWidth) - 0.5;
  targetY = (event.clientY / window.innerHeight) - 0.5;
}

function onTouchMove(event) {
  if (event.touches.length > 0) {
    targetX = (event.touches[0].clientX / window.innerWidth) - 0.5;
    targetY = (event.touches[0].clientY / window.innerHeight) - 0.5;
  }
}

function animate() {
  requestAnimationFrame(animate);

  if (isMobile) {
    targetY += 0.0001;
    targetX += 0.0001;
  }

  currentX += (targetX - currentX) * 0.05;
  currentY += (targetY - currentY) * 0.05;

  if (stars) {
    stars.rotation.z += 0.0005;

    stars.rotation.y = currentX * 0.5;
    stars.rotation.x = currentY * 0.5;
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

initStarfield();

const heroSection = document.getElementById('home');
const starfieldContainer = document.getElementById('starfield-container');

const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    starfieldContainer.style.opacity = entry.isIntersecting ? '1' : '0.4';
  });
}, { threshold: 0.1 });

if (heroSection) heroObserver.observe(heroSection);

const animatedElements = document.querySelectorAll('.animate-on-scroll');
const scrollObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const heading = entry.target.querySelector('.scramble-effect');
      if (heading && !heading.dataset.scrambled) {
        heading.dataset.scrambled = 'true';
        scrambleEffect(heading);
      }
      observer.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -50px 0px' });
animatedElements.forEach(el => scrollObserver.observe(el));

const contactForm = document.getElementById('contact-form');
const contactButton = document.getElementById('contact-submit-button');
const contactStatus = document.getElementById('contact-status');
const FORMSPREE_URL = 'https://formspree.io/f/xdkyzopw';

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const currentLang = localStorage.getItem('language') || 'tr';
    contactButton.disabled = true;
    contactButton.textContent = translations[currentLang]['contact.sending'] || 'Gönderiliyor...';
    contactStatus.textContent = '';

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: new FormData(e.target),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        contactStatus.textContent = translations[currentLang]['contact.success'];
        contactStatus.className = 'text-center text-accent';
        contactForm.reset();
      } else {
        throw new Error('Network response error');
      }
    } catch (error) {
      contactStatus.textContent = translations[currentLang]['contact.error'];
      contactStatus.className = 'text-center text-red-500';
    } finally {
      contactButton.disabled = false;
      contactButton.textContent = translations[currentLang]['contact.submitButton'];
    }
  });
}

const translations = {
  tr: {
    'nav.about': 'Hakkımda',
    'nav.skills': 'Teknolojiler',
    'nav.experience': 'Eğitim',
    'nav.projects': 'Projeler',
    'nav.contact': 'İletişim',
    'hero.greeting': 'Merhaba, ben',
    'hero.subtitle': 'Cloud & DevOps Engineer',
    'about.title': 'Hakkımda',
    'about.p1': 'Merhaba! Ben Berk, Akdeniz Üniversitesi’nde İngilizce Bilgisayar Mühendisliği öğrencisiyim. Cloud ve DevOps alanlarında kendimi geliştiriyorum.',
    'about.p2': 'Projelerimi her zaman pratik ve etkili çözümler üretmek için tasarlıyorum.',
    'about.p3': 'Benimle iletişime geçmekten çekinmeyin.',
    'skills.title': 'Yetkinliklerim',
    'experience.title': 'Eğitim',
    'experience.item1.time': 'Eylül 2023 - Günümüz',
    'experience.item1.title': 'Lisans Derecesi, Bilgisayar Mühendisliği',
    'experience.item1.company': 'Akdeniz Üniversitesi, Antalya',
    'projects.title': 'Projelerim',
    'projects.nodesc': 'Bu proje için henüz bir açıklama eklenmemiş.',
    'projects.error': 'Projeler yüklenirken bir hata oluştu.',
    'projects.none': 'Gösterilecek herkese açık proje bulunamadı.',
    'contact.title': 'İletişime Geçin',
    'contact.subtitle': 'Benimle iletişime geçmekten çekinmeyin!',
    'contact.nameLabel': 'Adınız',
    'contact.emailLabel': 'E-posta Adresiniz',
    'contact.messageLabel': 'Mesajınız',
    'contact.submitButton': 'Gönder',
    'contact.sending': 'Gönderiliyor...',
    'contact.success': 'Mesajınız için teşekkürler!',
    'contact.error': 'Bir hata oluştu.',
    'stats.repos': 'Public Repos',
    'stats.followers': 'Takipçi'
  },
  en: {
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.experience': 'Education',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'hero.greeting': 'Hello, I am',
    'hero.subtitle': 'Cloud & DevOps Engineer',
    'about.title': 'About Me',
    'about.p1': 'Hello! I\'m Berk, a Computer Engineering student at Akdeniz University.',
    'about.p2': 'I design my projects to deliver practical solutions.',
    'about.p3': 'Feel free to reach out.',
    'skills.title': 'My Skills',
    'experience.title': 'Education',
    'experience.item1.time': 'September 2023 - Present',
    'experience.item1.title': 'BSc in Computer Engineering',
    'experience.item1.company': 'Akdeniz University, Antalya',
    'projects.title': 'My Projects',
    'projects.nodesc': 'No description provided.',
    'projects.error': 'An error occurred while loading projects.',
    'projects.none': 'No public projects found.',
    'contact.title': 'Get In Touch',
    'contact.subtitle': 'Drop me a line!',
    'contact.nameLabel': 'Your Name',
    'contact.emailLabel': 'Your Email',
    'contact.messageLabel': 'Your Message',
    'contact.submitButton': 'Send',
    'contact.sending': 'Sending...',
    'contact.success': 'Thank you!',
    'contact.error': 'Error occurred.',
    'stats.repos': 'Public Repos',
    'stats.followers': 'Followers'
  }
};

const langTrButton = document.getElementById('lang-tr');
const langEnButton = document.getElementById('lang-en');

function setLanguage(lang) {
  if (!translations[lang]) return;
  document.documentElement.lang = lang;
  localStorage.setItem('language', lang);

  if (langTrButton && langEnButton) {
    if (lang === 'tr') {
      langTrButton.classList.add('font-bold', 'text-accent');
      langTrButton.classList.remove('font-normal', 'text-gray-400');
      langEnButton.classList.add('font-normal', 'text-gray-400');
      langEnButton.classList.remove('font-bold', 'text-accent');
    } else {
      langEnButton.classList.add('font-bold', 'text-accent');
      langEnButton.classList.remove('font-normal', 'text-gray-400');
      langTrButton.classList.add('font-normal', 'text-gray-400');
      langTrButton.classList.remove('font-bold', 'text-accent');
    }
  }

  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-key');
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder-key');
    if (translations[lang][key]) el.placeholder = translations[lang][key];
  });
}

if (langTrButton) langTrButton.addEventListener('click', () => setLanguage('tr'));
if (langEnButton) langEnButton.addEventListener('click', () => setLanguage('en'));

const GITHUB_USERNAME = 'littleborek';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&type=owner`;

async function fetchGitHubProjects(initialLang) {
  const grid = document.getElementById('projects-grid');
  const loader = document.getElementById('projects-loader');
  const t = translations[initialLang] || translations.tr;

  if (!grid) return;

  try {
    const response = await fetch(GITHUB_API_URL);

    if (!response.ok) {
      throw new Error(t['projects.error'] || 'API Hatası');
    }

    const repos = await response.json();

    if (repos.length > 0) {
      grid.innerHTML = '';

      repos.forEach(repo => {
        const descText = repo.description || t['projects.nodesc'];

        const topicsHTML = (repo.topics || []).slice(0, 3).map(topic => `<span class='bg-gray-800 text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded'>${topic}</span>`).join('');

        const langHTML = repo.language
          ? `<span class='bg-gray-700 text-accent text-xs font-semibold px-2.5 py-0.5 rounded'>${repo.language}</span>`
          : '';

        grid.innerHTML += `
                <a href='${repo.html_url}' target='_blank' class='block frosted-glass p-6 transition-transform duration-300 hover:scale-105 hover:border-accent border border-transparent'>
                    <div class='flex justify-between items-start mb-2'>
                        <h3 class='text-2xl font-bold text-white truncate pr-4'>${repo.name}</h3>
                        <div class='flex items-center text-sm text-gray-400 ml-2 flex-shrink-0'>
                            <span>★ ${repo.stargazers_count}</span>
                        </div>
                    </div>
                    <p class='text-gray-300 mb-4 h-20 overflow-hidden text-ellipsis'>${descText}</p>
                    <div class='flex flex-wrap gap-2'>${langHTML}${topicsHTML}</div>
                </a>`;
      });
    }

    if (loader) loader.remove();
  } catch (error) {
    console.error('GitHub API Error: ', error);
    if (loader) loader.remove();
    if (grid) grid.innerHTML = `<p class="text-center text-red-400 w-full">${t['projects.error']}</p>`;
  }
}

function scrambleEffect(element) {
  const originalText = element.textContent;
  const chars = '!<>-_\\/[]{}—=+*^?#';
  let iterations = 0;

  const interval = setInterval(() => {
    element.textContent = originalText.split('')
      .map((char, index) => {
        if (index < iterations) return originalText[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

    if (iterations >= originalText.length) clearInterval(interval);
    iterations += 1 / 3;
  }, 30);
}

const mobileMenuBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const toggleMenu = () => mobileMenu.classList.toggle('hidden');

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
if (document.getElementById('mobile-menu-close-button')) document.getElementById('mobile-menu-close-button').addEventListener('click', toggleMenu);
document.querySelectorAll('.mobile-menu-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.add('hidden')));

async function fetchGitHubStats() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if (!res.ok) return;
    const data = await res.json();
    const repoEl = document.getElementById('github-repos');
    const followEl = document.getElementById('github-followers');
    if (repoEl) repoEl.textContent = data.public_repos;
    if (followEl) followEl.textContent = data.followers;
  } catch (e) { console.error(e); }
}

const savedLang = localStorage.getItem('language') || 'tr';
setLanguage(savedLang);
fetchGitHubProjects(savedLang);
fetchGitHubStats();
