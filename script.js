// --- 1. Three.js Dinamik Arka Plan ---
let scene;
let camera;
let renderer;
let stars;
let targetMouseX = 0;
let targetMouseY = 0;
let currentMouseX = 0;
let currentMouseY = 0;

function initStarfield() {
  const container = document.getElementById('starfield-container');
  if (!container) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  renderer = new THREE.WebGLRenderer({
    canvas: document.createElement('canvas'),
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const starCount = 10000;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i += 1) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 1000;
    positions[i3 + 1] = (Math.random() - 0.5) * 1000;
    positions[i3 + 2] = (Math.random() - 0.5) * 1000;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
    transparent: true,
    opacity: 0.7
  });
  stars = new THREE.Points(geometry, material);
  scene.add(stars);

  window.addEventListener('mousemove', onMouseMove, false);
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  currentMouseX += (targetMouseX - currentMouseX) * 0.05;
  currentMouseY += (targetMouseY - currentMouseY) * 0.05;

  if (stars) {
    stars.rotation.z += 0.0001;
  }
  if (camera) {
    camera.rotation.x = (Math.PI / 2) + (currentMouseY * 0.2);
    camera.rotation.y = currentMouseX * 0.2;
  }
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  targetMouseX = (event.clientX / window.innerWidth) - 0.5;
  targetMouseY = (event.clientY / window.innerHeight) - 0.5;
}

window.addEventListener('resize', onWindowResize, false);
initStarfield();

// --- 2. Arka Plan Kaybolma/Belirme Mantığı ---
const heroSection = document.getElementById('home');
const starfieldContainer = document.getElementById('starfield-container');
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      starfieldContainer.style.opacity = '1';
    } else {
      starfieldContainer.style.opacity = '0.3';
    }
  });
}, { threshold: 0.6 });
heroObserver.observe(heroSection);

// --- 3. İçerik Animasyonları (Scroll) ---
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
}, {
  rootMargin: '0px 0px -50px 0px'
});
animatedElements.forEach(el => scrollObserver.observe(el));

// --- 4. Formspree AJAX İletişim Formu ---
const contactForm = document.getElementById('contact-form');
const contactButton = document.getElementById('contact-submit-button');
const contactStatus = document.getElementById('contact-status');

// GÜNCELLENDİ: Formspree ID'si
const FORMSPREE_URL = 'https://formspree.io/f/xdkyzopw';

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  const currentLang = localStorage.getItem('language') || 'tr';

  contactButton.disabled = true;
  // HATA DÜZELTİLDİ: contact.sending'e doğru erişim
  contactButton.textContent = translations[currentLang]['contact.sending'] || 'Gönderiliyor...';
  contactStatus.textContent = '';

  const formData = new FormData(e.target);

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json'
      }
    });

    if (response.ok) {
      // HATA DÜZELTİLDİ: contact.success'e doğru erişim
      contactStatus.textContent = translations[currentLang]['contact.success'] || 'Mesajınız için teşekkürler!';
      contactStatus.className = 'text-center text-accent';
      contactForm.reset();
    } else {
      throw new Error('Network response was not ok.');
    }
  } catch (error) {
    // HATA DÜZELTİLDİ: contact.error'a doğru erişim
    contactStatus.textContent = translations[currentLang]['contact.error'] || 'Bir hata oluştu. Lütfen tekrar deneyin.';
    contactStatus.className = 'text-center text-red-500';
  } finally {
    contactButton.disabled = false;
    // HATA DÜZELTİLDİ: contact.submitButton'a doğru erişim
    contactButton.textContent = translations[currentLang]['contact.submitButton'] || 'Gönder';
  }
});

// --- 5. DİL ÇEVİRİ MANTIĞI ---
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
    'about.p1': 'Merhaba! Ben Berk, Akdeniz Üniversitesi’nde İngilizce Bilgisayar Mühendisliği öğrencisiyim. Cloud ve DevOps alanlarında kendimi geliştiriyorum ve özellikle sistem yönetimi, Docker, CI/CD süreçleri ve bulut servisleri (AWS, Azure) ile ilgileniyorum.',
    'about.p2': 'Projelerimi her zaman pratik ve etkili çözümler üretmek için tasarlıyorum; kod yazmayı, problemlere yaratıcı çözümler bulmayı ve teknolojiyi üretken şekilde kullanmayı seviyorum. Bu site, hem teknik yeteneklerimi hem de kişisel tarzımı bir araya getirdiğim dijital portföyüm.',
    'about.p3': 'Benimle iletişime geçmekten çekinmeyin; yeni projelerde birlikte çalışmayı ve yeni teknolojiler öğrenmeyi her zaman heyecan verici buluyorum.',
    'skills.title': 'Yetkinliklerim',
    'experience.title': 'Eğitim',
    'experience.item1.time': 'Eylül 2023 - Günümüz',
    'experience.item1.title': 'Lisans Derecesi, Bilgisayar Mühendisliği',
    'experience.item1.company': 'Akdeniz Üniversitesi, Antalya',
    'projects.title': 'Projelerim',
    'projects.nodesc': 'Bu proje için henüz bir açıklama eklenmemiş.',
    'projects.error': 'Projeler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
    'projects.none': 'Gösterilecek herkese açık proje bulunamadı.',
    'contact.title': 'İletişime Geçin',
    'contact.subtitle': 'Benimle iletişime geçmekten çekinmeyin!',
    'contact.nameLabel': 'Adınız',
    'contact.emailLabel': 'E-posta Adresiniz',
    'contact.messageLabel': 'Mesajınız',
    'contact.namePlaceholder': 'Adınızı buraya yazın...',
    'contact.emailPlaceholder': 'eposta@adresiniz.com',
    'contact.messagePlaceholder': 'Mesajınızı buraya yazın...',
    'contact.submitButton': 'Gönder',
    'contact.sending': 'Gönderiliyor...',
    'contact.success': 'Mesajınız için teşekkürler!',
    'contact.error': 'Bir hata oluştu. Lütfen tekrar deneyin.',
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
    'about.p1': 'Hello! I\'m Berk, a Computer Engineering student at Akdeniz University (English Program). I am developing my skills in the Cloud and DevOps fields, with a strong interest in system administration, Docker, CI/CD pipelines, and cloud services (AWS, Azure).',
    'about.p2': 'I design my projects to deliver practical, effective solutions. I love writing code, finding creative answers to complex problems, and using technology productively. This site is my digital portfolio, where I combine my technical skills and personal style.',
    'about.p3': 'Feel free to reach out; I am always excited to collaborate on new projects and explore new technologies.',
    'skills.title': 'My Skills',
    'experience.title': 'Education',
    'experience.item1.time': 'September 2023 - Present',
    'experience.item1.title': 'BSc in Computer Engineering',
    'experience.item1.company': 'Akdeniz University, Antalya',
    'projects.title': 'My Projects',
    'projects.nodesc': 'No description has been added for this project yet.',
    'projects.error': 'An error occurred while loading projects. Please try again later.',
    'projects.none': 'No public projects found to display.',
    'contact.title': 'Get In Touch',
    'contact.subtitle': 'Have a project in mind, or just want to say hello? Drop me a line!',
    'contact.nameLabel': 'Your Name',
    'contact.emailLabel': 'Your Email',
    'contact.messageLabel': 'Your Message',
    'contact.namePlaceholder': 'Enter your name...',
    'contact.emailPlaceholder': 'your@email.com',
    'contact.messagePlaceholder': 'Enter your message...',
    'contact.submitButton': 'Send',
    'contact.sending': 'Sending...',
    'contact.success': 'Thank you for your message!',
    'contact.error': 'An error occurred. Please try again.',
    'stats.repos': 'Public Repos',
    'stats.followers': 'Followers'
  }
};

const langTrButton = document.getElementById('lang-tr');
const langEnButton = document.getElementById('lang-en');

function setLanguage(lang) {
  if (!translations[lang]) return;

  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-key');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder-key');
    if (translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  if (lang === 'tr') {
    langTrButton.classList.add('font-bold', 'text-accent');
    langTrButton.classList.remove('font-normal', 'text-gray-400');
    langEnButton.classList.add('font-normal', 'text-gray-400');
    langEnButton.classList.remove('font-bold', 'text-accent');
    document.documentElement.lang = 'tr';
  } else {
    langEnButton.classList.add('font-bold', 'text-accent');
    langEnButton.classList.remove('font-normal', 'text-gray-400');
    langTrButton.classList.add('font-normal', 'text-gray-400');
    langTrButton.classList.remove('font-bold', 'text-accent');
    document.documentElement.lang = 'en';
  }

  localStorage.setItem('language', lang);
}

langTrButton.addEventListener('click', () => setLanguage('tr'));
langEnButton.addEventListener('click', () => setLanguage('en'));

// --- 6. GITHUB PROJELERİNİ ÇEKME ---
const GITHUB_USERNAME = 'littleborek';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&type=owner`;

async function fetchGitHubProjects(initialLang) {
  const grid = document.getElementById('projects-grid');
  const loader = document.getElementById('projects-loader');
  const t = translations[initialLang] || translations.tr;

  try {
    const response = await fetch(GITHUB_API_URL);
    if (!response.ok) {
      if (response.status === 404) {
        console.error(`GitHub kullanıcısı bulunamadı: ${GITHUB_USERNAME}`);
        throw new Error('Kullanıcı bulunamadı.');
      }
      throw new Error(`GitHub API hatası: ${response.status}`);
    }

    const repos = await response.json();

    if (loader) loader.remove();
    grid.innerHTML = '';

    if (repos.length === 0) {
      grid.innerHTML = `<p class='text-center col-span-1 md:col-span-2 text-gray-400' data-i18n-key='projects.none'>${t.projects.none}</p>`;
      return;
    }

    repos.forEach(repo => {
      const descriptionHTML = repo.description
        ? `<p class='text-gray-300 mb-4 h-20 overflow-hidden text-ellipsis'>${repo.description}</p>`
        : `<p class='text-gray-300 mb-4 h-20 overflow-hidden text-ellipsis' data-i18n-key='projects.nodesc'>${t.projects.nodesc}</p>`;

      const topicsHTML = (repo.topics && repo.topics.length > 0)
        ? repo.topics.slice(0, 3).map(topic => `<span class='bg-gray-800 text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded'>${topic}</span>`).join('')
        : '';

      const languageHTML = repo.language
        ? `<span class='bg-gray-700 text-accent text-xs font-semibold px-2.5 py-0.5 rounded'>${repo.language}</span>`
        : '';

      const projectCard = `
            <a href='${repo.html_url}' target='_blank' rel='noopener noreferrer' class='block frosted-glass p-6 transform transition-transform duration-300 hover:scale-105 hover:border-accent'>
                <div class='flex justify-between items-start mb-2'>
                    <h3 class='text-2xl font-bold text-white truncate pr-4'>${repo.name}</h3>
                    <div class='flex items-center text-sm text-gray-400 flex-shrink-0 ml-2'>
                        <svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4 mr-1' viewBox='0 0 20 20' fill='currentColor'>
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                        </svg>
                        <span>${repo.stargazers_count}</span>
                    </div>
                </div>
                ${descriptionHTML}
                <div class='flex flex-wrap gap-2'>
                    ${languageHTML}
                    ${topicsHTML}
                </div>
            </a>
            `;
      grid.innerHTML += projectCard;
    });
  } catch (error) {
    console.error('GitHub projeleri çekilirken hata oluştu:', error);
    if (loader) loader.remove();
    grid.innerHTML = `<p class='text-center col-span-1 md:col-span-2 text-red-400' data-i18n-key='projects.error'>${t.projects.error}</p>`;
  }
}

// --- 7. "HACKER" METİN ÇÖZÜLME EFEKTİ FONKSİYONU ---
function scrambleEffect(element) {
  const originalText = element.textContent;
  const chars = '!<>-_\\/[]{}—=+*^?#';
  let frameRequest;
  let iterations = 0;

  const animateScramble = () => {
    iterations += 1;

    const newText = originalText.split('')
      .map((char, index) => {
        if (char === ' ') return ' ';

        if (index < (iterations / 7)) {
          return originalText[index];
        }

        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    element.textContent = newText;

    if (iterations / 7 >= originalText.length) {
      element.textContent = originalText;
      cancelAnimationFrame(frameRequest);
    } else {
      frameRequest = requestAnimationFrame(animateScramble);
    }
  };

  frameRequest = requestAnimationFrame(animateScramble);
}

// --- 8. MOBİL MENÜ MANTIĞI ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenuCloseButton = document.getElementById('mobile-menu-close-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

const toggleMenu = () => {
  mobileMenu.classList.toggle('hidden');
};

mobileMenuButton.addEventListener('click', toggleMenu);
mobileMenuCloseButton.addEventListener('click', toggleMenu);

mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (!mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }
  });
});

// --- YENİ: 9. GITHUB İSTATİSTİKLERİNİ ÇEKME ---
async function fetchGitHubStats() {
  const statsUrl = 'https://api.github.com/users/littleborek';
  const reposEl = document.getElementById('github-repos');
  const followersEl = document.getElementById('github-followers');

  try {
    const response = await fetch(statsUrl);
    if (!response.ok) throw new Error('GitHub stats API error');

    const stats = await response.json();

    reposEl.textContent = stats.public_repos;
    followersEl.textContent = stats.followers;
  } catch (error) {
    console.error('GitHub istatistikleri çekilemedi:', error);
    reposEl.textContent = 'N/A';
    followersEl.textContent = 'N/A';
  }
}

// --- SAYFA YÜKLEME SIRASI (GÜNCELLENDİ) ---
const savedLang = localStorage.getItem('language') || 'tr';
fetchGitHubProjects(savedLang);
fetchGitHubStats();
setLanguage(savedLang);
