const welcomeScreen = document.getElementById('welcomeScreen');
const enterBtn = document.getElementById('enterBtn');
const loader = document.getElementById('loader');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const revealItems = document.querySelectorAll('.reveal');
const galleryItems = Array.from(document.querySelectorAll('.gallery-item img, .memory-card img'));
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.querySelector('.lightbox-close');
const prevBtn = document.querySelector('.lightbox-nav.prev');
const nextBtn = document.querySelector('.lightbox-nav.next');
const letterEnvelope = document.querySelector('.letter-envelope');
const letterPaper = document.getElementById('letterPaper');
const bgMusic = document.getElementById('bgMusic');
const backToTop = document.querySelector('.back-to-top');
const floatingHearts = document.querySelector('.floating-hearts');
const cursorSparkles = document.querySelector('.cursor-sparkles');
const parallaxItems = document.querySelectorAll('.parallax-item');

let currentImageIndex = 0;
const galleryImages = galleryItems;

function startBackgroundMusic() {
  if (!bgMusic) return;

  bgMusic.volume = 0.45;
  bgMusic.play().catch(() => {
    // Browser may block autoplay until a user interaction happens.
  });
}

window.addEventListener('load', () => {
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 900);
  }
});

if (enterBtn && welcomeScreen) {
  enterBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    startBackgroundMusic();
  });
}

document.addEventListener('pointerdown', startBackgroundMusic, { once: true });

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navMenu) navMenu.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  });
});

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function openLightbox(index) {
  if (!lightbox || !lightboxImage || !galleryImages.length) return;

  currentImageIndex = index;
  const image = galleryImages[index];
  if (!image) return;

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightbox.classList.add('visible');
  lightbox.setAttribute('aria-hidden', 'false');
}

if (galleryImages.length) {
  galleryImages.forEach((image, index) => {
    image.style.cursor = 'pointer';
    image.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openLightbox(index);
    });
  });
}

function moveLightbox(direction) {
  if (!lightbox || !lightboxImage || !galleryImages.length) return;

  currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
  lightboxImage.src = galleryImages[currentImageIndex].src;
  lightboxImage.alt = galleryImages[currentImageIndex].alt;
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', () => {
    if (!lightbox) return;
    lightbox.classList.remove('visible');
    lightbox.setAttribute('aria-hidden', 'true');
  });
}

if (prevBtn) prevBtn.addEventListener('click', () => moveLightbox(-1));
if (nextBtn) nextBtn.addEventListener('click', () => moveLightbox(1));

window.addEventListener('keydown', (event) => {
  if (!lightbox || !lightbox.classList.contains('visible')) return;

  if (event.key === 'Escape') {
    lightbox.classList.remove('visible');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  if (event.key === 'ArrowRight') moveLightbox(1);
  if (event.key === 'ArrowLeft') moveLightbox(-1);
});

if (letterEnvelope) {
  letterEnvelope.addEventListener('click', () => {
    letterEnvelope.classList.add('open');
    setTimeout(() => {
      if (letterPaper) letterPaper.classList.add('visible');
    }, 350);
  });
}

function createFloatingHeart() {
  if (!floatingHearts) return;

  const heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = ['♡', '♥', '❤'][Math.floor(Math.random() * 3)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${Math.random() * 18 + 12}px`;
  heart.style.animationDuration = `${Math.random() * 12 + 12}s`;
  heart.style.opacity = String(Math.random() * 0.8 + 0.2);
  floatingHearts.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 15000);
}

setInterval(createFloatingHeart, 900);

if (window.matchMedia('(pointer: fine)').matches && cursorSparkles) {
  document.addEventListener('pointermove', (event) => {
    const dot = document.createElement('span');
    dot.className = 'sparkle-dot';
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    cursorSparkles.appendChild(dot);
    setTimeout(() => dot.remove(), 700);
  });
}

document.addEventListener('click', (event) => {
  const burst = document.createElement('span');
  burst.textContent = '♡';
  burst.style.position = 'fixed';
  burst.style.left = `${event.clientX}px`;
  burst.style.top = `${event.clientY}px`;
  burst.style.fontSize = `${Math.random() * 30 + 18}px`;
  burst.style.color = 'rgba(255, 105, 180, 0.9)';
  burst.style.pointerEvents = 'none';
  burst.style.zIndex = '1800';
  burst.style.transform = 'translate(-50%, -50%)';
  burst.style.animation = 'floatUp 1s ease forwards';
  document.body.appendChild(burst);

  setTimeout(() => burst.remove(), 900);
});

window.addEventListener('pointermove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 18;
  const y = (event.clientY / window.innerHeight - 0.5) * 18;

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed || 0.7);
    const currentRotation = getComputedStyle(item).getPropertyValue('--rotation') || '0deg';
    item.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${currentRotation})`;
  });
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
