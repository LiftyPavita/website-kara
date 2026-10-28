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

const moodMessages = {
  sad: [
    "hey, it's okay if today isn't your day, okay? you don't have to be strong all the time. ♡",
    "if all you can do today is get through the day, that's enough. i'm proud of you.",
    "come here, pretend i'm giving you the biggest hug ever. no explanations needed. 🧸",
    "you don't have to fix everything tonight. take a breath, little one. one thing at a time.",
    "your feelings aren't a burden. you deserve kindness, especially from yourself.",
    "it's okay to be sad and still be lovable. nothing in you is too much for love.",
    "you are allowed to slow down. the world can wait for a minute while you catch your breath.",
    "tiny steps count. even if today feels messy, you are still doing your best.",
    "please let yourself cry if you need to. tears do not make you weak. they make you human.",
    "the heaviness is real, but it is not permanent. even soft days can still end gently.",
    "you don't have to explain the ache. being tired of hurting is enough reason to rest.",
    "maybe today is not for being brave. maybe today is just for being gentle.",
    "if your heart feels like it fell apart, that's okay. we can put it back together slowly.",
    "i know today feels ugly and loud inside. still, you are worthy of softness.",
    "no one has to earn a break from sadness. you are allowed to be tender with yourself."
  ],
  happy: [
    "LOOK AT YOU BEING ALL HAPPY AND CUTE!! please keep this little sunshine safe. ☀️",
    "i hope this happiness stays with you a little longer. you deserve moments like this.",
    "quick!! take a mental screenshot of this moment. future you might need this memory. ♡",
    "this is exactly the kind of joy that deserves to be noticed and held onto.",
    "your smile is a tiny miracle today. please let it stay a little while longer.",
    "you are glowing, and honestly? it's kind of unfair how cute this version of you is.",
    "this is one of those gentle little wins that deserves a happy little dance. ✨",
    "let yourself enjoy this. happiness doesn't need to be earned to be real.",
    "save this little pocket of joy. it matters more than you think.",
    "you look happy, and that makes my heart happy too. keep being soft and light.",
    "today is a good reminder that small joys can be giant magic.",
    "there is something really sweet about being this warm and this bright. keep it close.",
    "make room for this good feeling. it deserves a little celebration, even if it's tiny.",
    "you deserve all the sunshine you are collecting today. don't let it pass by unnoticed.",
    "even if you try to act cool, i can tell you are glowing. and honestly, i love it."
  ],
  annoyed: [
    "okay, grumpy little bunny. take a breath first, the world can wait for a minute. 😾",
    "you are allowed to take a break from everyone. drink some water and protect your peace.",
    "no need to reply to anyone right now. take your time until you feel a little better.",
    "your irritation isn't a flaw. sometimes your body just needs space from extra noise.",
    "it's okay to be annoyed. just don't let the grumpiness steal all your energy today.",
    "little mood alert: your peace is important. leave the chaos alone for a while.",
    "take a sec and let the bad energy pass. you don't owe anyone your sparkle while you're irritated.",
    "sometimes the most loving thing is saying, 'not today, not this version of me.'",
    "you can be mad and still deserve a soft landing. the world can be a little less loud.",
    "no need to be extra polite while your patience is running low. rest for a bit.",
    "if today feels a little too sharp, that's allowed. you don't have to smooth it all away.",
    "you can be annoyed without being mean. your feelings are still valid.",
    "take the room, and take the silence. sometimes the kindest thing is a little distance.",
    "grumpy isn't wrong. it just means your heart needs a smaller, calmer space for a while.",
    "breathe in, drop the extra weight, and let your mood calm down before you decide anything major."
  ],
  tired: [
    "you have done enough for today, sweetheart. you don't need to earn your rest.",
    "permission to do absolutely nothing for a little while: GRANTED. 💤",
    "put that little head down for a moment. not everything needs to be solved tonight.",
    "rest is not laziness. it is part of being human, especially when you are tired.",
    "you can stop pushing for a while. your energy is not a test to pass.",
    "it is okay to be tired. being drained does not mean you are failing.",
    "your body is asking for gentleness. answer it without guilt.",
    "if your brain feels a little dusty, that's okay. let it rest before you ask it to do more.",
    "today does not need to be productive to be valid. a quiet day is still a good day.",
    "rest is not a reward for being 'good enough'. it is a basic kindness to yourself.",
    "you are allowed to be sleepy, slow, and soft. the world will still be there later.",
    "take this as a permission slip to be cozy and low effort for a while.",
    "your energy is not infinite. even tiny rest counts.",
    "let the day be smaller, gentler, and less demanding for a little while.",
    "sleepy hearts need soft blankets, warm drinks, and zero pressure."
  ],
  lonely: [
    "even on the quiet days, you are still someone worth knowing and loving. ♡",
    "imagine a tiny bunny sitting beside you, keeping you company without asking a single question.",
    "you don't need to be entertaining or cheerful to deserve someone's company.",
    "sometimes you don't need a solution, you just need a little company and a gentle presence.",
    "i hope you know that being alone right now does not make you less lovable.",
    "if you need it, let this be a tiny virtual seat beside you. i'm here, quietly.",
    "you deserve to be wanted in the softest, kindest, most ordinary ways.",
    "even when the room feels empty, you are still not invisible.",
    "let this message be a little cozy place to sit for a while. no pressure, no performance.",
    "some hearts need company more than they need advice. you are allowed to need that.",
    "it is okay to want someone to stay close for a little while and just listen.",
    "being a little lonely does not mean you are too much. it means you need gentleness.",
    "picture a warm blanket, a soft pillow, and someone thinking kindly of you right now.",
    "you deserve quiet companionship, not just big moments of being adored.",
    "even if no one says it out loud right now, you are still worth soft company."
  ],
  hug: [
    "sending you one ridiculously long virtual hug. you can stay here for as long as you need. 🫂",
    "if i could, i'd wrap you in the softest blanket and let the world be quiet for a while.",
    "this is your reminder that you deserve gentleness, affection, and care.",
    "come here, little one. let this be the warmest, quietest hug you have all day.",
    "you are allowed to be held gently in your thoughts. no need to be perfect for this.",
    "i hope you feel the softness in this message. it is a hug, even from a little far away.",
    "you deserve the kind of care that makes your shoulders drop a little.",
    "if your heart needs a pause, let it rest in the warmth of this message for a while.",
    "a tiny little hug from me, with all the gentleness i can give you today. ♡",
    "i want the world to be kinder to you for a minute. may this card be your soft place.",
    "you don't have to be brave enough for everything right now. just accept this hug.",
    "may this message feel like a blanket, a pillow, and a hand on your back all at once.",
    "you deserve to be comforted without needing to explain why you need it.",
    "take this as permission to be cared for, even if just for a little while.",
    "if you are feeling fragile, let this hug be a reminder that you are not alone in it."
  ]
};

const moodIcons = {
  sad: '🌧️',
  happy: '☀️',
  annoyed: '😾',
  tired: '💤',
  lonely: '🧸',
  hug: '🫂'
};

const moodHistory = {};
const favoriteKey = 'mood-favorite-messages';
let activeMood = null;
let activeCategoryMessages = [];
let currentMessageIndex = 0;
let favorites = JSON.parse(localStorage.getItem(favoriteKey) || '[]');

const moodPanel = document.getElementById('moodMessagePanel');
const moodGrid = document.getElementById('moodCardGrid');
const moodText = document.getElementById('moodMessageText');
const moodArt = document.getElementById('moodMessageArt');
const moodFavoriteButton = document.querySelector('.mood-favorite-button');
const moodNextButton = document.querySelector('.mood-next-button');
const moodBackButton = document.querySelector('.mood-back-button');
const moodCopyButton = document.querySelector('.mood-copy-button');
const moodCloseButton = document.querySelector('.mood-close-btn');
const moodFavoritesToggle = document.querySelector('.mood-favorites-toggle');
const moodFavoritesPanel = document.getElementById('moodFavoritesPanel');
const moodFavoritesList = document.getElementById('moodFavoritesList');
const moodCloseFavorites = document.querySelector('.mood-close-favorites');
const surpriseBtn = document.querySelector('.mood-surprise-btn');

function getMoodMessages(mood) {
  if (!moodHistory[mood]) moodHistory[mood] = [];
  return moodMessages[mood].filter((message) => !moodHistory[mood].includes(message));
}

function pickNextMessage(mood) {
  const available = getMoodMessages(mood);
  if (!available.length) {
    moodHistory[mood] = [];
    activeCategoryMessages = [...moodMessages[mood]];
    const randomIndex = Math.floor(Math.random() * activeCategoryMessages.length);
    currentMessageIndex = randomIndex;
    return activeCategoryMessages[randomIndex];
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  const chosen = available[randomIndex];
  moodHistory[mood].push(chosen);
  activeCategoryMessages = moodMessages[mood].filter((msg) => !moodHistory[mood].includes(msg));
  if (!activeCategoryMessages.length) {
    moodHistory[mood] = [];
  }
  return chosen;
}

function renderFavoriteList() {
  moodFavoritesList.innerHTML = '';

  if (!favorites.length) {
    const empty = document.createElement('div');
    empty.className = 'mood-favorites-empty';
    empty.textContent = 'no favorite messages yet... maybe one of these little notes will stay with you soon. ♡';
    moodFavoritesList.appendChild(empty);
    return;
  }

  favorites.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'mood-favorite-item';
    row.innerHTML = `<span>${item}</span><button type="button" aria-label="Remove favorite">×</button>`;
    const removeBtn = row.querySelector('button');
    removeBtn.addEventListener('click', () => {
      favorites = favorites.filter((entry) => entry !== item);
      localStorage.setItem(favoriteKey, JSON.stringify(favorites));
      renderFavoriteList();
    });
    moodFavoritesList.appendChild(row);
  });
}

function openMessagePanel(mood, message) {
  activeMood = mood;
  moodText.textContent = message;
  moodArt.textContent = moodIcons[mood] || '✨';

  const isSaved = favorites.includes(message);
  moodFavoriteButton.classList.toggle('active', isSaved);
  moodFavoriteButton.textContent = isSaved ? '♥' : '♡';

  moodPanel.classList.add('visible');
}

function closeMessagePanel() {
  moodPanel.classList.remove('visible');
}

function showSurpriseMessage() {
  const moods = Object.keys(moodMessages);
  let mood = moods[Math.floor(Math.random() * moods.length)];
  let notSame = false;

  if (activeMood) {
    while (!notSame && moods.length > 1) {
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      if (randomMood !== activeMood) {
        mood = randomMood;
        notSame = true;
      }
    }
  }

  const msg = pickNextMessage(mood);
  openMessagePanel(mood, msg);
}

moodGrid.addEventListener('click', (event) => {
  const card = event.target.closest('.mood-card');
  if (!card) return;

  const mood = card.dataset.mood;
  const message = pickNextMessage(mood);
  openMessagePanel(mood, message);
});

moodNextButton.addEventListener('click', () => {
  if (!activeMood) return;
  const nextMessage = pickNextMessage(activeMood);
  openMessagePanel(activeMood, nextMessage);
});

moodBackButton.addEventListener('click', () => {
  closeMessagePanel();
});

moodCloseButton.addEventListener('click', () => {
  closeMessagePanel();
});

moodFavoriteButton.addEventListener('click', () => {
  if (!activeMood || !moodText.textContent) return;

  const message = moodText.textContent;
  if (favorites.includes(message)) {
    favorites = favorites.filter((entry) => entry !== message);
  } else {
    favorites = [message, ...favorites];
  }

  localStorage.setItem(favoriteKey, JSON.stringify(favorites));
  moodFavoriteButton.classList.toggle('active', favorites.includes(message));
  moodFavoriteButton.textContent = favorites.includes(message) ? '♥' : '♡';
  renderFavoriteList();
});

moodFavoritesToggle.addEventListener('click', () => {
  renderFavoriteList();
  moodFavoritesPanel.classList.add('visible');
});

moodCloseFavorites.addEventListener('click', () => {
  moodFavoritesPanel.classList.remove('visible');
});

surpriseBtn.addEventListener('click', () => {
  showSurpriseMessage();
});

moodCopyButton.addEventListener('click', async () => {
  const message = moodText.textContent;
  if (!message) return;

  try {
    await navigator.clipboard.writeText(message);
    const original = moodCopyButton.textContent;
    moodCopyButton.textContent = 'saved in your heart... and clipboard! ♡';
    setTimeout(() => {
      moodCopyButton.textContent = original;
    }, 1500);
  } catch (error) {
    const original = moodCopyButton.textContent;
    moodCopyButton.textContent = 'copy not available on this browser';
    setTimeout(() => {
      moodCopyButton.textContent = original;
    }, 1600);
  }
});

document.querySelectorAll('.mood-reaction').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood-reaction').forEach((item) => item.classList.remove('active'));
    btn.classList.add('active');
    const original = btn.textContent;
    btn.textContent = 'saved in your heart ♡';
    setTimeout(() => {
      btn.textContent = original;
    }, 1200);
  });
});

renderFavoriteList();
