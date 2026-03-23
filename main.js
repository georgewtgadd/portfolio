/* Scroll reveal */
const ro = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(r => ro.observe(r));

/* Project card toggle */
function toggleCard(header) {
  const body = header.nextElementSibling;
  const toggle = header.querySelector('.project-toggle');
  body.classList.toggle('open');
  toggle.classList.toggle('open');
}

/* Image modal */
function openImgModal(src, alt) {
  document.getElementById('modalImg').src = src;
  document.getElementById('modalImg').alt = alt;
  document.getElementById('imgModal').classList.add('open');
}
document.getElementById('modalClose').onclick = () =>
  document.getElementById('imgModal').classList.remove('open');
document.getElementById('imgModal').onclick = e => {
  if (e.target.id === 'imgModal') document.getElementById('imgModal').classList.remove('open');
};

/* Video modal */
document.querySelectorAll('.video-thumb').forEach(t => {
  t.onclick = () => {
    document.getElementById('videoIframe').src =
      'https://www.youtube.com/embed/' + t.dataset.videoid + '?autoplay=1';
    document.getElementById('videoModal').classList.add('open');
  };
});

function closeVideo() {
  document.getElementById('videoModal').classList.remove('open');
  document.getElementById('videoIframe').src = '';
}
document.getElementById('videoModalClose').onclick = closeVideo;
document.getElementById('videoModal').onclick = e => {
  if (e.target.id === 'videoModal') closeVideo();
};

/* Scroll top */
const sb = document.getElementById('scrollTop');
window.addEventListener('scroll', () => sb.classList.toggle('visible', scrollY > 400));
sb.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

/* Nav compact */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () =>
  nav.style.padding = scrollY > 60 ? '0.7rem 3rem' : '1.2rem 3rem'
);
