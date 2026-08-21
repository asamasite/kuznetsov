const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

function closeMenu() {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(opened));
  menuButton.setAttribute('aria-label', opened ? 'Закрыть меню' : 'Открыть меню');
  document.body.classList.toggle('menu-open', opened);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 25), { passive: true });

document.querySelectorAll('.faq-item button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const opened = item.classList.toggle('open');
    button.setAttribute('aria-expanded', String(opened));
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const slides = [...document.querySelectorAll('.review-slide')];
const dots = [...document.querySelectorAll('.review-dots button')];
let reviewIndex = 0;
function showReview(index) {
  reviewIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === reviewIndex));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === reviewIndex));
}
document.querySelector('.review-prev').addEventListener('click', () => showReview(reviewIndex - 1));
document.querySelector('.review-next').addEventListener('click', () => showReview(reviewIndex + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => showReview(i)));

const photos = [
  ['assets/images/clinic-3.webp', 'Коридор и кабинет № 221'],
  ['assets/images/clinic-1.webp', 'Вход в здание'],
  ['assets/images/clinic-6.webp', 'Здание стоматологии летом'],
  ['assets/images/clinic-4.webp', 'Вход со стороны двора']
];
const track = document.querySelector('.gallery-track');
if (track) {
  const cards = [...track.querySelectorAll('.photo-card')];
  const counter = document.querySelector('.gallery-counter');
  const step = () => cards[0].getBoundingClientRect().width + 16;
  const current = () => Math.min(cards.length - 1, Math.round(track.scrollLeft / step()));
  const updateCounter = () => { counter.textContent = `${current() + 1} / ${cards.length}`; };
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  function slide(direction) {
    track.scrollBy({ left: direction * step(), behavior: calm.matches ? 'auto' : 'smooth' });
    setTimeout(updateCounter, 450);
  }
  document.querySelector('.gallery-prev').addEventListener('click', () => slide(-1));
  document.querySelector('.gallery-next').addEventListener('click', () => slide(1));
  track.addEventListener('scroll', updateCounter, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    slide(event.key === 'ArrowLeft' ? -1 : 1);
  });
  updateCounter();
}

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('figcaption');
let photoIndex = 0;
function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  lightboxImage.src = photos[photoIndex][0];
  lightboxImage.alt = photos[photoIndex][1];
  lightboxCaption.textContent = `${photoIndex + 1} / ${photos.length} · ${photos[photoIndex][1]}`;
}
function openLightbox(index) {
  showPhoto(index);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
  lightbox.querySelector('.lightbox-close').focus();
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
}
document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => openLightbox(Number(button.dataset.photo))));
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(photoIndex + 1));
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showPhoto(photoIndex - 1);
  if (event.key === 'ArrowRight') showPhoto(photoIndex + 1);
});
