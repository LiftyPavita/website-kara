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
    "hallow, kamu jangan sedih sedih yaa, aku tau berat banget buat kamu, but it's okay, semangat princess ♡",
    "pasti lagi galau banget yaa, aku tau rasanya. tapi kamu nggak sendirian, aku ada di sini buat nemenin kamu.",
    "kalau ada yang bikin kamu sedih sampai pengen menangis, itu juga wajar. kamu nggak harus menyembunyikan rasa sakit itu demi terlihat baik-baik aja.",
    "jangan paksa diri buat baik-baik aja kalau hati kamu lagi remuk. biarin hari ini sedikit lebih lembut untukmu.",
    "kalo caca buat kamu sedih lagi hari ini, maafin dia yaa cantik, jangan sedih sedih, SEMANGAT!",
    "kenapa? ovt lagi nih soal caca? isokey jangan terlalu dipikirin yaa, aku tau kamu pasti bisa lewatin ini semua.",
    "kamu nggak perlu menahan semua air mata cuma karena orang lain nggak paham. menangis itu manusiawi, bukan tanda lemah.",
    "kalo ada yang ngeganjel di pikiran kamu, jangan dipendam sendiri. kamu berhak untuk mengekspresikan perasaanmu, walau itu sedih.",
    "jangan terlalu keras sama diri sendiri karena kamu sedang tidak baik-baik saja. kamu manusia, bukan mesin yang terus berfungsi.",
    "aku tahu kamu mungkin masih terganggu sama banyak hal, tapi kamu tetap berhak merasa tenang nanti, walaupun sekarang rasanya berat.",
    "kalau hari ini hati kamu lagi bersedih karena semua memori itu datang lagi, itu nggak salah. kamu cuma manusia yang masih merasakan.",
    "mungkin sekarang kamu nggak butuh solusi, tapi butuh tempat untuk nangis dan menenangkan diri. itu sangat cukup.",
    "semua rasa sakit itu nggak perlu kamu buktikan ke siapa pun. cukup, kamu tahu saja bahwa kamu sedang tidak nyaman, dan itu valid.",
    "kadang yang paling menenangkan bukan jawaban, tapi paham bahwa hari ini memang lagi berat dan kamu nggak harus kuat sekaligus.",
    "kalau kamu merasa sedih karena masa lalu, itu berarti kamu pernah sangat menyayangi. kamu tetap berhak diberi kasih sayang yang tenang."
  ],
  happy: [
    "wah, lihat kamu senang gini. semoga rasa ringan itu tetap tinggal lama di hati kamu, ya. ☀️",
    "senyum kamu hari ini lucu banget, dan aku senang banget kalau hati kamu lagi tenang dan bahagia.",
    "ayo simpan momen ini baik-baik. nanti kalau capek atau sedih, kamu bisa inget kalau dulu kamu pernah semangat seperti ini.",
    "kamu lagi happy, dan itu hal yang layak banget dihargai. jangan buru-buru ngelupain momen kecil yang bikin hati hangat ini.",
    "hari ini memang ada sesuatu yang bikin kamu kelihatan lebih ringan, dan itu bagus. biarin kamu menikmati itu sebentar.",
    "senyum kamu hari ini tuh bikin semua terasa lebih lembut. semoga kamu terus punya alasan kecil untuk bahagia seperti ini.",
    "cukup simpan momen ini di kepala. semoga kamu terus diberi hari-hari yang bikin hati kamu merasa ringan.",
    "bahagia itu kadang datang dari hal-hal kecil yang nggak diduga. dan kamu pantas banget merasa itu hari ini.",
    "semoga kamu nggak buru-buru menganggap hari ini biasa saja, karena hari yang bikin kamu senyum itu juga berharga.",
    "jangan terlalu cepat mematikan perasaan senang ini. biarkan hati kamu menikmati rasa itu sebentar.",
    "lihat kamu senyum lagi, rasanya seperti dunia jadi lebih ramah untuk beberapa saat.",
    "semoga kamu selalu punya ruang untuk merayakan hal-hal kecil yang bikin kamu bahagia, ya.",
    "kamu lagi bagus banget hari ini, dan aku cuma mau bilang—semoga kamu tetap semangat seperti ini dalam waktu lama.",
    "senyummu hari ini bikin hati jadi tenang. jangan takut untuk menikmati momen yang bikin kamu merasa baik.",
    "bahagia itu nggak harus besar, yang penting kamu merasa aman dan tenang di dalamnya."
  ],
  annoyed: [
    "oke, kalau kamu lagi bete, itu nggak salah. kamu boleh marah, kamu boleh kesel, kamu boleh pengen sendiri dulu.",
    "kalau hari ini kamu lagi kepanasan atau pengen meledak karena sesuatu, jangan dipaksa baik-baik aja dulu. ambil napas, lalu ambil ruang.",
    "kamu nggak harus terus sabar kalau hari ini memang bikin kamu nyolot. selah dulu, nanti baru atur ulang semuanya.",
    "jangan dipaksa ceria kalau hati kamu lagi sebel. kadang yang kamu butuh cuma udara yang lebih sejuk dan waktu yang lebih tenang.",
    "kalau ada hal yang bikin kamu kesal, nggak perlu semua yang lain ikut ditanggung. kamu boleh marah sempat, tapi jangan lupa kamu tetap berhak tenang.",
    "capek itu bisa muncul dalam bentuk kesal. kamu nggak salah. cuma hari ini memang lagi nggak enak, itu aja.",
    "kamu boleh sedikit jutek, boleh nyender dulu, boleh enggak mau ngomong. semua itu masih manusiawi.",
    "kalau hari ini kamu gampang tersinggung, mungkin karena kamu memang sedang kelelahan atau terlalu banyak yang masuk ke kepala.",
    "jangan terlalu keras sama diri sendiri cuma karena sedang tidak mood. orang yang sedang capek juga butuh ruang untuk marah.",
    "kalau kamu lagi bete karena kepanasan, karena tugas numpuk, atau karena sesuatu yang nggak jelas, itu tetap valid. kamu nggak perlu jadi sempurna.",
    "lepasin sedikit. hari ini memang bukan hari yang ramah, jadi nggak apa-apa kalau kamu ingin menghindar dulu sebentar.",
    "kesel itu tanda kamu juga manusia yang merasa. jangan menekan semuanya sampai kamu merasa lebih berat sendirian.",
    "kalau kamu lagi pengen diem, ambil waktu itu. bukan berarti kamu buruk, cuma hari ini kamu butuh lebih tenang.",
    "marah bukan selalu karena hal besar. kadang itu cuma karena kamu sudah capek banget dan butuh ruang untuk bernapas.",
    "jangan salahkan diri sendiri karena lagi bete. kadang itu hanya tanda kalau kamu sedang butuh pelan-pelan dan jauh dari keramaian."
  ],
  tired: [
    "kamu udah capek, dan itu bukan tanda kamu kurang kuat. kamu cuma manusia, dan manusia memang butuh istirahat.",
    "kalau hari ini kamu capenya bukan karena nggak semangat, tapi karena banyak hal masuk sekaligus, itu wajar.",
    "tugas numpuk, pikiran berisik, dan badan yang lelah bisa bikin hati jadi ngga enak. kamu nggak salah karena capek.",
    "izin buat istirahat dulu, ya. hari ini nggak perlu dipenuhi semua, cukup selamat sampai malam.",
    "mungkin hari ini kamu capek karena muak sama semua hal, muak sama rutinitas, muak sama pikirin banyak hal. itu valid, sayang.",
    "kamu nggak perlu terus memaksa diri buat produktif kalau hati dan tubuhmu sedang kehabisan tenaga.",
    "tidur atau istirahat sebentar bukan tanda nganggur. itu tanda kamu sadar kalau diri kamu butuh dihargai.",
    "kalau kepalamu berat karena mikirin tugas atau TKA atau hal-hal yang nyampah, itu artinya kamu memang sudah terlalu capek.",
    "biarin hari ini lebih kecil. bukan berarti kamu gagal, cuma emang hari ini kamu butuh beristirahat lebih dulu.",
    "kamu boleh minta waktu untuk tidak berpikir apa pun dulu. biarkan badan dan hati kamu kembali seimbang.",
    "capek itu bukan soal malas. kadang itu cuma tanda kalau kamu sudah terlalu banyak menahan dan terlalu lama bertahan sendiri.",
    "kalau hari ini badan kamu lelah, jangan dipaksa jadi orang yang sama seperti kemarin. cukup jadi diri yang lebih tenang.",
    "selamatkan tenagamu. nggak semua yang harus selesai hari ini harus selesai hari ini juga.",
    "kamu pantas untuk beristirahat tanpa merasa berdosa. benar, hari ini kamu sudah cukup bersusah payah.",
    "biarkan pikiranmu beristirahat sebentar. dunia akan tetap ada nanti, bahkan kalau hari ini kamu memilih tenang dulu."
  ],
  lonely: [
    "jangan merasa sendirian di tengah semua yang kamu tahan sendiri. kamu tetap punya ruang untuk dicintai dan ditemani, walau hari ini kamu merasa sepi.",
    "kalau kamu merasa sendiri, bayangkan aku duduk di samping kamu, tidak ngomong banyak, cuma menemani sampai kamu merasa lebih ringan.",
    "kamu nggak perlu selalu terlihat kuat biar dianggap baik. kamu juga berhak ditemani, dipahami, dan tidak ditinggal sendirian.",
    "aku tahu kadang sendirian itu terasa ngga enak, tapi kamu nggak sedang sendirian sepenuhnya. ada orang yang tetap peduli, walau diam.",
    "kamu nggak harus selalu bisa menyenangkan orang lain supaya pantas untuk ditemani. kamu sudah cukup berharga tanpa harus lucu dulu.",
    "kalau hari ini hati kamu merasa sepi, mungkin yang kamu butuhkan bukan solusi, tapi kehadiran. dan itu wajar banget.",
    "kamu masih berhak punya satu tempat yang terasa aman, walau cuma untuk hari ini. itu tidak terlalu banyak untuk diminta.",
    "sepi bukan berarti tidak disayang. terkadang sepi itu cuma tanda bahwa kamu butuh sedikit lebih banyak perhatian ke diri sendiri.",
    "bayangkan ini: ada satu orang yang duduk di sebelah kamu tanpa menuntut, tanpa menghakimi, hanya ingin kamu merasa sedikit lebih tenang.",
    "jangan menutup diri terlalu rapat, ya. kadang yang kamu butuh bukan untuk menahan semuanya sendiri, tapi untuk merasa ada yang peduli.",
    "kamu boleh merasa kesepian, tapi kamu nggak perlu menanggung sendirian. ada ruang yang tetap terbuka buat kamu merasa lebih aman.",
    "kamu nggak terlalu banyak. kamu cuma manusia yang kadang butuh ditemani. itu normal, dan itu wajar.",
    "kalau hari ini hati kamu terasa kosong, mungkin itu tanda kamu butuh rasa dekat, bukan hanya sekadar mencoba kuat.",
    "jangan takut untuk mengakui kalau kamu butuh teman, setidaknya untuk sebentar. kamu berhak diingatkan bahwa kamu tidak sendirian.",
    "meski hari ini terasa sunyi, kamu tetap berharga, tetap pantas untuk didengarkan, dan tetap layak untuk dicintai dengan lembut."
  ],
  hug: [
    "aku ingin peluk kamu dengan pelan, seperti bilang, 'tenang, kamu nggak harus kuat sekarang. cukup letakkan beban itu sebentar.' 🫂",
    "kalau aku bisa, aku pasti bakal memeluk kamu dengan sangat lembut sampai kamu merasa sedikit lebih ringan, sedikit lebih tenang.",
    "ini pelukan kecil untukmu. tidak perlu dijelaskan, tidak perlu dibenarkan. cukup rasa hangat yang kamu butuhkan hari ini.",
    "kamu boleh merasa lelah, kamu boleh merasa capek, kamu boleh merasa ingin dipeluk. dan itu benar-benar wajar.",
    "mungkin hari ini kamu butuh lebih dari sekadar kata-kata. kamu butuh rasa aman, dan aku mau kamu tahu bahwa kamu berhak diberi itu.",
    "peluk ini datangnya dari jauh, tapi semoga terasa hangat dan menenangkan seperti pelukan nyata.",
    "jangan takut untuk menerima kasih sayang, walau hanya dari kata-kata yang lembut. hari ini kamu pantas merasa hangat.",
    "biar aku jadi tempat paling aman untukmu sebentar. kamu boleh duduk di sini, rileks, dan tidak harus kuat dulu.",
    "aku ingin kamu tahu bahwa ada ruang hangat yang siap menampungmu hari ini tanpa menghakimi, tanpa menuntut, tanpa memaksa.",
    "pelukan ini bukan untuk menghapus semua rasa sakit, tapi untuk membantumu merasa sedikit lebih ringan dan sedikit lebih aman.",
    "kalau hari ini kamu merasa ingin ditenangkan, ini dia pelukan kecil dari aku yang mungkin nggak bisa hadir secara nyata, tapi tetap hangat.",
    "kamu nggak harus menghadapi semua sendirian. ada yang mau menenangkanmu dengan pelan, tanpa banyak tanya.",
    "sedikit hangat, sedikit tenang, sedikit lebih baik. semoga itu yang kamu dapat dari kata-kata ini hari ini.",
    "jangan menolak rasa yang baik hanya karena kamu merasa belum pantas. kamu pantas merasa dicintai, bahkan saat kamu sedang rapuh.",
    "kalau semua hari ini terasa berat, anggap saja ini pelukan kecil yang aku kirimkan supaya kamu tahu kamu tidak sendirian."
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

const moodHistory = {
  caca: [],
  sekolah: [],
  burnout: [],
  rumah: []
};

const favoriteKey = 'mood-favorite-messages';
let activeReason = 'caca';
let favorites = JSON.parse(localStorage.getItem(favoriteKey) || '[]');

const reasonButtons = document.querySelectorAll('.reason-option');
const noteInput = document.getElementById('moodNoteInput');
const generateBtn = document.querySelector('.mood-generate-btn');
const moodPanel = document.getElementById('moodMessagePanel');
const moodText = document.getElementById('moodMessageText');
const moodArt = document.getElementById('moodMessageArt');
const moodReasonBadge = document.getElementById('moodReasonBadge');
const moodFavoriteButton = document.querySelector('.mood-favorite-button');
const moodNextButton = document.querySelector('.mood-next-button');
const moodCopyButton = document.querySelector('.mood-copy-button');
const moodCloseButton = document.querySelector('.mood-close-btn');
const moodFavoritesToggle = document.querySelector('.mood-favorites-toggle');
const moodFavoritesPanel = document.getElementById('moodFavoritesPanel');
const moodFavoritesList = document.getElementById('moodFavoritesList');
const moodCloseFavorites = document.querySelector('.mood-close-favorites');

const moodTemplates = {
  caca: [
    "kalau lagi sedih karena caca, itu wajar. kamu nggak harus memaksa diri buat terlihat kuat. yang kamu rasain itu nyata, dan kamu juga berhak dibuat tenang.",
    "mungkin memang capek banget kalau hati kamu terus teringat sama dia. tapi jangan salahin diri sendiri karena masih merasa. kamu cuma manusia, bukan orang yang terlalu berlebihan.",
    "kalau caca yang bikin kamu nangis, mungkin yang kamu butuh bukan jawabannya, tapi waktu untuk merasa aman dan tidak terus diingat-ingat.",
    "kamu bisa sedih karena seseorang yang pernah bikin kamu nyaman. itu bukan tanda kamu terlalu berharap, itu cuma tanda kamu pernah sangat care.",
    "aku tahu rasanya berat ketika hati masih kepikiran orang yang sama. tapi kamu tetap berhak pulih, walaupun prosesnya nggak mulus."
  ],
  sekolah: [
    "kalau sekolah bikin kamu nyesek, itu bukan berarti kamu lemah. kamu cuma manusia, dan beban yang kamu tahan itu memang terlalu besar kalau ditanggung sendirian.",
    "nggak perlu memaksakan diri terlihat baik kalau kamu sedang terhuyung-huyung. sekolah itu capek, dan kamu boleh capek juga.",
    "mungkin kamu lagi merasa gagal karena tugas, target, dan tekanan datang sekaligus. itu wajar, tapi bukan tanda kalau kamu buruk.",
    "kalau pikiran kamu sudah penuh sama sekolah, jangan merasa bersalah karena butuh istirahat. tubuhmu juga punya batasnya.",
    "kamu nggak harus sempurna untuk diberi ruang tenang. hari ini kalau sekolah bikin kamu berat, cukup beri diri kamu waktu bernapas dulu."
  ],
  burnout: [
    "kalau kamu burnout, itu bukan berarti kamu malas. itu berarti kamu sudah terlalu lama menahan semuanya tanpa istirahat yang benar-benar memulihkanmu.",
    "kamu nggak harus tetap produktif kalau pikiran kamu sudah habis. kadang yang paling tepat adalah berhenti sebentar dan mengizinkan diri merasa berat.",
    "burnout itu bentuk lelah yang nggak cuma soal tidur, tapi juga pikiran yang terus berdengung, badan yang capek, dan hati yang mulai terasa kosong. kamu boleh menahan dulu.",
    "jangan terlalu keras sama diri sendiri hanya karena hari ini kamu ingin berhenti sejenak. beristirahat itu bukan kegagalan, itu pemulihan.",
    "kalau hari ini rasanya nggak ada tenaga, itu artinya kamu memang sudah terlalu lama berjuang. kamu berhak pulih tanpa merasa bersalah."
  ],
  rumah: [
    "kalau rumah jadi tempat yang bikin hati kamu sesak, maka kamu nggak salah kalau merasa nggak nyaman. rumah itu bukan cuma bangunan, tapi juga rasa aman. kalau itu mulai terasa berat, kamu boleh merasa lelah.",
    "kalau ada masalah di rumah yang terus mengganggu, kamu nggak harus menahannya sendirian hanya karena pengen kelihatan kuat. kamu boleh merasa capek, sedih, dan ingin pergi sebentar.",
    "mungkin rumah sekarang bukan tempat yang menenangkan, tapi itu bukan berarti kamu buruk. kamu cuma manusia yang ingin dilepas dari beban yang terlalu berat.",
    "kalau di rumah kamu merasa nggak aman atau terlalu tegang, itu memang sesuatu yang berat. kamu berhak merasa lelah dan butuh ruang untuk diri sendiri.",
    "kamu nggak perlu memelihara semua rasa sakit itu sendirian demi menjaga semuanya tetap baik. sebagian dari rasa yang kamu punya juga valid."
  ]
};

const reasonLabels = {
  caca: 'karena caca',
  sekolah: 'karena sekolah',
  burnout: 'karena burnout',
  rumah: 'karena masalah rumah'
};

const reasonIcons = {
  caca: '💭',
  sekolah: '📚',
  burnout: '🌧️',
  rumah: '🏡'
};

function pickReasonMessage(reason) {
  const list = moodTemplates[reason] || moodTemplates.caca;
  return list[Math.floor(Math.random() * list.length)];
}

function openMessagePanel(reason, message) {
  if (!moodPanel || !moodText || !moodArt || !moodReasonBadge) return;

  moodReasonBadge.textContent = reasonLabels[reason] || 'karena hari ini berat';
  moodArt.textContent = reasonIcons[reason] || '💌';
  moodText.textContent = message;

  const isSaved = favorites.includes(message);
  if (moodFavoriteButton) {
    moodFavoriteButton.classList.toggle('active', isSaved);
    moodFavoriteButton.textContent = isSaved ? '♥' : '♡';
  }

  moodPanel.classList.remove('hidden');
  moodPanel.classList.add('visible');
}

function closeMessagePanel() {
  if (!moodPanel) return;
  moodPanel.classList.remove('visible');
  moodPanel.classList.add('hidden');
}

function buildMessageFromInput() {
  const finalMessage = pickReasonMessage(activeReason);
  openMessagePanel(activeReason, finalMessage);
}

reasonButtons.forEach((button) => {
  button.addEventListener('click', () => {
    reasonButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    activeReason = button.dataset.reason;
  });
});

if (generateBtn) {
  generateBtn.addEventListener('click', buildMessageFromInput);
}

if (moodNextButton) {
  moodNextButton.addEventListener('click', () => {
    const nextMessage = pickReasonMessage(activeReason);
    openMessagePanel(activeReason, nextMessage);
  });
}

if (moodCloseButton) {
  moodCloseButton.addEventListener('click', closeMessagePanel);
}

if (moodFavoriteButton) {
  moodFavoriteButton.addEventListener('click', () => {
    const message = moodText.textContent;
    if (!message) return;

    if (favorites.includes(message)) {
      favorites = favorites.filter((item) => item !== message);
    } else {
      favorites = [message, ...favorites];
    }

    localStorage.setItem(favoriteKey, JSON.stringify(favorites));
    moodFavoriteButton.classList.toggle('active', favorites.includes(message));
    moodFavoriteButton.textContent = favorites.includes(message) ? '♥' : '♡';
    renderFavoriteList();
  });
}

if (moodCopyButton) {
  moodCopyButton.addEventListener('click', async () => {
    const message = moodText.textContent;
    if (!message) return;

    try {
      await navigator.clipboard.writeText(message);
      const original = moodCopyButton.textContent;
      moodCopyButton.textContent = 'tercatat di hati...';
      setTimeout(() => {
        moodCopyButton.textContent = original;
      }, 1200);
    } catch (error) {
      const original = moodCopyButton.textContent;
      moodCopyButton.textContent = 'copy gagal';
      setTimeout(() => {
        moodCopyButton.textContent = original;
      }, 1300);
    }
  });
}

if (moodFavoritesToggle) {
  moodFavoritesToggle.addEventListener('click', () => {
    renderFavoriteList();
    if (moodFavoritesPanel) {
      moodFavoritesPanel.classList.remove('hidden');
      moodFavoritesPanel.classList.add('visible');
    }
  });
}

if (moodCloseFavorites) {
  moodCloseFavorites.addEventListener('click', () => {
    if (moodFavoritesPanel) {
      moodFavoritesPanel.classList.remove('visible');
      moodFavoritesPanel.classList.add('hidden');
    }
  });
}

renderFavoriteList();
