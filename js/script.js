/* ============================================================
   KREASI KITA – script.js
   Fitur:
   1. Loading Screen
   2. Navbar Scroll & Active Link
   3. Hamburger Menu
   4. Dark Mode Toggle
   5. Smooth Scroll
   6. Hero Typing Effect
   7. Scroll Reveal (Intersection Observer)
   8. Counter Animation
   9. Portfolio Filter & Modal
   10. Testimonial Slider (Auto + Manual)
   11. FAQ Accordion
   12. Contact Form Validation
   13. Back to Top Button
   14. Footer Year
   ============================================================ */

'use strict';

/* ============================================================
   1. LOADING SCREEN
   ============================================================ */
window.addEventListener('load', () => {
  const loading = document.getElementById('loading-screen');
  // Minimal 1.8 detik agar animasi loading bar selesai
  setTimeout(() => {
    loading.classList.add('hidden');
    document.body.style.overflow = '';
  }, 1900);
});
// Cegah scroll saat loading
document.body.style.overflow = 'hidden';

/* ============================================================
   2. NAVBAR SCROLL & ACTIVE LINK
   ============================================================ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', () => {
  updateNavbar();
  updateActiveLink();
  showBackToTop();
}, { passive: true });

updateNavbar(); // Run on init

/* ============================================================
   3. HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinksMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen.toString());
});

// Tutup menu saat klik link
navLinksMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Tutup menu saat klik di luar
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinksMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ============================================================
   4. DARK MODE TOGGLE
   ============================================================ */
const darkToggle = document.getElementById('dark-toggle');
const html = document.documentElement;

// Load saved preference
const savedTheme = localStorage.getItem('kk-theme') || 'light';
html.setAttribute('data-theme', savedTheme);

darkToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('kk-theme', next);
});

/* ============================================================
   5. SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   6. HERO TYPING EFFECT
   ============================================================ */
const typingEl = document.getElementById('typing-target');
const words = ['Ide Digital', 'Website Anda', 'Brand Anda', 'Bisnis Anda'];
let wordIdx = 0;
let charIdx = 0;
let deleting = false;
let typingTimeout;

function type() {
  const word = words[wordIdx];
  if (!deleting) {
    typingEl.textContent = word.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === word.length) {
      // Pause sebelum hapus
      typingTimeout = setTimeout(() => { deleting = true; type(); }, 2000);
      return;
    }
  } else {
    typingEl.textContent = word.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      wordIdx = (wordIdx + 1) % words.length;
    }
  }
  typingTimeout = setTimeout(type, deleting ? 60 : 100);
}

// Mulai setelah loading selesai
setTimeout(type, 2100);

/* ============================================================
   7. SCROLL REVEAL – Intersection Observer API
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   8. COUNTER ANIMATION
   ============================================================ */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = start;
  }, 16);
}

const statsSection = document.getElementById('stats');
let countersStarted = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      animateCounter(el, target);
    });
  }
}, { threshold: 0.4 });

if (statsSection) statsObserver.observe(statsSection);

/* ============================================================
   9. PORTFOLIO FILTER & MODAL
   ============================================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const modal = document.getElementById('portfolio-modal');
const modalClose = document.getElementById('modal-close');
const modalCloseCta = document.getElementById('modal-close-cta');
const modalPreview = document.getElementById('modal-preview');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalCat = document.getElementById('modal-cat');

// Filter
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    portfolioItems.forEach(item => {
      const cat = item.getAttribute('data-cat');
      if (filter === 'all' || cat === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// Open Modal
document.querySelectorAll('.port-view').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const title = btn.getAttribute('data-title');
    const desc = btn.getAttribute('data-desc');
    const cat = btn.getAttribute('data-cat');
    const color = btn.getAttribute('data-color');
    const emoji = btn.closest('.portfolio-item').querySelector('.port-emoji').textContent;

    modalPreview.style.background = `linear-gradient(135deg, ${color}22, ${color}44)`;
    modalPreview.textContent = emoji;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalCat.textContent = cat;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalCloseCta.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

/* ============================================================
   10. TESTIMONIAL SLIDER (AUTO + MANUAL)
   ============================================================ */
const track = document.getElementById('testi-track');
const dots = document.querySelectorAll('.testi-dot');
const prevBtn = document.getElementById('testi-prev');
const nextBtn = document.getElementById('testi-next');
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.testi-card').length;
let autoSlide;

function goToSlide(index) {
  currentSlide = (index + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function startAuto() {
  autoSlide = setInterval(() => goToSlide(currentSlide + 1), 4500);
}
function stopAuto() { clearInterval(autoSlide); }

prevBtn.addEventListener('click', () => { stopAuto(); goToSlide(currentSlide - 1); startAuto(); });
nextBtn.addEventListener('click', () => { stopAuto(); goToSlide(currentSlide + 1); startAuto(); });

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => { stopAuto(); goToSlide(i); startAuto(); });
});

// Touch/swipe support
let touchStartX = 0;
track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) { stopAuto(); goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1); startAuto(); }
});

// Mulai auto-slide setelah loading
setTimeout(startAuto, 2200);

/* ============================================================
   11. FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Tutup semua
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Buka yang diklik (jika belum terbuka)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ============================================================
   12. CONTACT FORM VALIDATION
   ============================================================ */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

function showError(inputId, errorId, msg) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.add('error');
  error.textContent = msg;
}
function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.remove('error');
  error.textContent = '';
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Reset errors
  clearError('name', 'name-error');
  clearError('email', 'email-error');
  clearError('message', 'msg-error');

  if (!name) { showError('name', 'name-error', 'Nama tidak boleh kosong.'); valid = false; }
  else if (name.length < 2) { showError('name', 'name-error', 'Nama minimal 2 karakter.'); valid = false; }

  if (!email) { showError('email', 'email-error', 'Email tidak boleh kosong.'); valid = false; }
  else if (!emailRegex.test(email)) { showError('email', 'email-error', 'Format email tidak valid.'); valid = false; }

  if (!message) { showError('message', 'msg-error', 'Pesan tidak boleh kosong.'); valid = false; }
  else if (message.length < 10) { showError('message', 'msg-error', 'Pesan minimal 10 karakter.'); valid = false; }

  if (valid) {
    // Simulasi pengiriman
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    btnText.textContent = 'Mengirim...';
    submitBtn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      formSuccess.textContent = '✅ Pesan berhasil dikirim! Kami akan menghubungi Anda segera.';
      formSuccess.classList.add('show');
      btnText.textContent = 'Kirim Pesan';
      submitBtn.disabled = false;

      setTimeout(() => { formSuccess.classList.remove('show'); }, 5000);
    }, 1500);
  }
});

// Clear error on input
['name', 'email', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(id).classList.remove('error');
  });
});

/* ============================================================
   13. BACK TO TOP BUTTON
   ============================================================ */
const backToTop = document.getElementById('back-to-top');

function showBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   14. FOOTER YEAR
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();
