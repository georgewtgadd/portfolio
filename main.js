/* ── SCROLL REVEAL ── */
const ro = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(r => ro.observe(r));

/* ── NAV COMPACT ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () =>
  nav.style.padding = scrollY > 60 ? '0.7rem 3rem' : '1.2rem 3rem'
);

/* ── SCROLL TOP ── */
const sb = document.getElementById('scrollTop');
window.addEventListener('scroll', () => sb.classList.toggle('visible', scrollY > 400));
sb.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

/* ── IMAGE MODAL ── */
function openImgModal(src, alt) {
  document.getElementById('modalImg').src = src;
  document.getElementById('modalImg').alt = alt || '';
  document.getElementById('imgModal').classList.add('open');
}
document.getElementById('modalClose').onclick = () =>
  document.getElementById('imgModal').classList.remove('open');
document.getElementById('imgModal').onclick = e => {
  if (e.target.id === 'imgModal') document.getElementById('imgModal').classList.remove('open');
};

/* ── VIDEO DATA ── */
const videos = [
{
  src: 'https://youtu.be/dYHADdi7Nys',
  title: 'Carol Case Study',
  desc: 'Students were struggling to engage with our problem-based learning scenarios because the hired actors lacked authenticity. To improve student buy-in for the Virtual Placement platform, we shifted from scripted actors to a real-world volunteer, filming "Carol," a colleague\'s mother with lived experience of COPD. This authentic approach significantly boosted student immersion, making the module an immediate hit and even leading to Carol making a guest appearance during a live lecture.'
},
 {
    src: 'https://youtu.be/11i9mJ_l7mI',
    title: 'An Introduction to Grounded Theory',
    desc: 'Grounded Theory is often perceived as a dry and complex subject, making it difficult for students to engage with the material. To reduce cognitive load, I designed a self-directed whiteboard animation that leverages Mayer’s Cognitive Theory of Multimedia Learning, using synchronized visual scaffolding and audio narration to clarify abstract concepts. Furthermore, by applying Universal Design for Learning (UDL) principles, I provided multimodal delivery options—including the video, an audio-only podcast, and a text transcript—empowering learners to choose the format that best aligns with their accessibility needs and learning environment.'
  },
  {
    src: 'https://youtu.be/BGiv_NG55PY',
    title: 'Ideal Ward Round Introduction',
    desc: `Within mental health care, ward rounds play an important and potentially very beneficial role in shaping a person's care — making sure that everyone concerned, including the person themselves, has a voice and is listened to. Ward rounds should be a way of ensuring that care is appropriate, dynamic and safe.

Here we meet Emma just before a ward round that is going to discuss her care. Whilst Emma's story is fictitious, you will also hear thoughts from individuals who have been involved in ward round situations in different capacities.`
  }
];

/* ── VIDEO CAROUSEL ── */
const track = document.getElementById('carouselTrack');
const dotsWrap = document.getElementById('carouselDots');

/**
 * Generate a thumbnail from an mp4 by loading it into a hidden video,
 * seeking to a frame, then drawing to a canvas.
 */
function generateThumbnail(src, canvas) {
  return new Promise(resolve => {
    const vid = document.createElement('video');
    vid.src = src;
    vid.crossOrigin = 'anonymous';
    vid.muted = true;
    vid.preload = 'metadata';
    vid.addEventListener('loadedmetadata', () => {
      // Seek to 10% of duration, or 1s if short
      vid.currentTime = Math.min(1, vid.duration * 0.1);
    });
    vid.addEventListener('seeked', () => {
      try {
        canvas.width = vid.videoWidth || 640;
        canvas.height = vid.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
        canvas.style.display = 'block';
        // Hide fallback
        const fallback = canvas.parentElement.querySelector('.carousel-thumb-fallback');
        if (fallback) fallback.style.display = 'none';
      } catch (e) {
        // CORS or decode error — leave fallback visible
      }
      resolve();
    });
    vid.addEventListener('error', () => resolve()); // fail gracefully
    vid.load();
  });
}

videos.forEach((v, i) => {
  const card = document.createElement('div');
  card.className = 'carousel-card';
  card.dataset.index = i;

  // Extract filename for a nicer fallback label
  const filename = v.src.split('/').pop().replace(/\.[^.]+$/, '').replace(/_/g, ' ');

  // Check if it's a YouTube video
  const isYouTube = v.src.includes('youtu.be') || v.src.includes('youtube.com');
  let thumbHtml = '';

  if (isYouTube) {
    // Grab the YouTube ID and use the official YouTube thumbnail URL
    const videoId = v.src.split('/').pop();
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    thumbHtml = `<img src="${thumbnailUrl}" style="width:100%;height:100%;object-fit:cover;" alt="${v.title} thumbnail">`;
  } else {
    // Canvas setup for .mp4 files
    thumbHtml = `
      <div class="carousel-thumb-fallback">
        <i class="fas fa-film"></i>
        <span>${filename}</span>
      </div>
      <canvas style="display:none;width:100%;height:100%;object-fit:cover;"></canvas>
    `;
  }

  card.innerHTML = `
    <div class="carousel-thumb">
      ${thumbHtml}
      <div class="carousel-play"><i class="fas fa-play"></i></div>
    </div>
    <div class="carousel-info">
      <div class="carousel-title">${v.title}</div>
      <div class="carousel-hint"><i class="fas fa-expand-alt"></i> Click to watch &amp; learn more</div>
    </div>`;

  card.addEventListener('click', () => openVideoModal(i));
  track.appendChild(card);

  // Only run the canvas thumbnail generator if it's NOT a YouTube video
  if (!isYouTube) {
    const canvas = card.querySelector('canvas');
    generateThumbnail(v.src, canvas);
  }

  // Dot
  const dot = document.createElement('button');
  dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to video ${i + 1}`);
  dot.addEventListener('click', () => scrollToCard(i));
  dotsWrap.appendChild(dot);
});

function scrollToCard(i) {
  const cards = track.querySelectorAll('.carousel-card');
  if (!cards[i]) return;
  track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
}

// Update active dot on scroll
track.addEventListener('scroll', () => {
  const cards = track.querySelectorAll('.carousel-card');
  const dots = dotsWrap.querySelectorAll('.carousel-dot');
  let closest = 0, minDist = Infinity;
  cards.forEach((c, i) => {
    const dist = Math.abs(c.getBoundingClientRect().left - track.getBoundingClientRect().left);
    if (dist < minDist) { minDist = dist; closest = i; }
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === closest));
});

document.getElementById('carouselPrev').addEventListener('click', () => {
  const dots = dotsWrap.querySelectorAll('.carousel-dot');
  let active = [...dots].findIndex(d => d.classList.contains('active'));
  scrollToCard(Math.max(0, active - 1));
});

document.getElementById('carouselNext').addEventListener('click', () => {
  const dots = dotsWrap.querySelectorAll('.carousel-dot');
  let active = [...dots].findIndex(d => d.classList.contains('active'));
  scrollToCard(Math.min(videos.length - 1, active + 1));
});

/* ── VIDEO MODAL ── */
function openVideoModal(index) {
  const v = videos[index];
  const modal = document.getElementById('videoModal');

  document.getElementById('vmodalTitle').textContent = v.title;
  document.getElementById('vmodalDesc').innerHTML = v.desc
    ? v.desc.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('')
    : '<p style="color:var(--muted);font-style:italic">No additional notes for this video.</p>';

  // Check if the source is a YouTube URL
  if (v.src.includes('youtu.be') || v.src.includes('youtube.com')) {
    // Extract the video ID from the youtu.be link
    const videoId = v.src.split('/').pop(); 
    document.getElementById('vmodalPlayer').innerHTML = `
      <div class="vmodal-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
          src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>`;
  } else {
    // Standard HTML5 video for .mp4 files
    document.getElementById('vmodalPlayer').innerHTML =
      `<div class="vmodal-embed"><video style="width:100%;" src="${v.src}" controls autoplay></video></div>`;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  document.getElementById('videoModal').classList.remove('open');
  document.getElementById('vmodalPlayer').innerHTML = '';
  document.body.style.overflow = '';
}

document.getElementById('vmodalClose').addEventListener('click', closeVideoModal);
document.getElementById('videoModal').addEventListener('click', e => {
  if (e.target.id === 'videoModal') closeVideoModal();
});

/* ── PROJECT MODAL ── */
function openProjectModal(id) {
  const data = projectData[id];
  if (!data) return;

  const mediaEl = document.getElementById('pmodalMedia');
  mediaEl.innerHTML = data.images.map(img =>
    `<img src="${img.src}" alt="${img.alt}" onclick="openImgModal('${img.src}','${img.alt}')" />`
  ).join('');

  document.getElementById('pmodalTag').textContent = data.tag;
  document.getElementById('pmodalTitle').textContent = data.title;
  document.getElementById('pmodalBody').innerHTML = data.body;
  document.getElementById('pmodalTech').innerHTML =
    data.tech.map(t => `<span class="tech-pill">${t}</span>`).join('');

  document.getElementById('projectModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  document.getElementById('projectModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('pmodalCloseBtn').addEventListener('click', closeProjectModal);
document.getElementById('projectModal').addEventListener('click', e => {
  if (e.target.id === 'projectModal') closeProjectModal();
});

/* ── PROJECT DATA ── */
const projectData = {
  vp: {
    tag: 'LMS Platform',
    title: 'Virtual Placement',
    images: [
      { src: 'images/vp1.png', alt: 'Virtual Placement – Landing Page' },
      { src: 'images/vp2.png', alt: 'Virtual Placement – AI Chat Interface' }
    ],
    body: `<p>Students on a wide range of courses, particularly in healthcare, are required to complete placement learning. Placement experiences are becoming increasingly difficult to source and more expensive to resource. To address this, a bespoke "Virtual Placement" (VP) platform was designed to provide authentic, practice-oriented experiences. Students are introduced to their practice supervisor, Krish, who guides them along their learning journey, including virtual home visits to a patient, Lionel.</p>
    <p>A key feature is the integration of the OpenAI API to power an AI-driven practice assessor, available to students 24/7 — providing on-demand guidance at any point in their learning journey. The chatbot was deliberately scoped and restricted to remain relevant only to the subject matter of the placement, ensuring a focused and educationally sound experience.</p>
    <p>A built-in learning dashboard enables students to self-assess and track their development across key clinical competencies at three structured points — at the start, mid-point, and end of the placement. These self-assessments are mapped directly to the <strong>Common Placement Assessment Form (CPAF) 2024</strong>, the nationally recognised framework used by healthcare programmes to evaluate student competency in real-world placements.</p>
    <p>Rollout was carefully managed to ensure genuine curriculum integration. The platform was embedded directly into Year 1 lectures, with sessions delivered in person. Completion was made compulsory prior to students attending their first real-world placement. This approach has been rolled out across four student cohorts (400+ users). Accessibility audits using WAVE, axe DevTools, and Silktide ensure compliance for diverse learners.</p>`,
    tech: ['PHP', 'HTML5', 'JavaScript', 'OpenAI API', 'MySQL', 'OAuth 2.0', 'Apache ECharts', 'Bootstrap']
  },
  telehealth: {
    tag: 'Blended Learning · LMS Embedded',
    title: 'Telehealth Learning Resource',
    images: [
      { src: 'images/telehealth.png', alt: 'Telehealth learning resource' }
    ],
    body: `<p>Developed during the COVID-19 lockdown period in response to rapidly evolving healthcare practices, this blended learning resource was built to support clinical staff and students in understanding and adapting to telehealth consultations.</p>
    <p>Built as a Bootstrap website, the resource incorporated embedded SCORM packages and immersive 360° tour experiences, allowing learners to explore virtual clinical environments without leaving the platform. It was integrated directly into the University's LMS, making it accessible within the existing curriculum structure.</p>
    <p>This project served as an important precursor to the Virtual Placement platform — establishing many of the same design principles around experiential, practice-oriented digital learning, and demonstrating the potential for immersive technology in healthcare education at scale.</p>`,
    tech: ['Bootstrap', 'HTML5', 'CSS', 'JavaScript', 'SCORM', '360° Tours', 'LMS Integration']
  },
  adhd: {
    tag: 'Multilingual RLO',
    title: 'ADHD Translation Resources',
    images: [
      { src: 'images/brain.png', alt: 'ADHD Translation Resource illustration' }
    ],
    body: `<p>This project focused on equipping healthcare professionals and the public with accessible information on assessing and recognising ADHD in both children and adults. The resources are endorsed by the Royal College of General Practitioners.</p>
    <p>Split into <em>Understanding ADHD</em> and <em>The Role of the General Practitioner in ADHD Diagnosis and Management</em>, both were translated from English into French, Spanish, and German. This involved close collaboration with stakeholders and professional translators, alongside accessibility audits using WAVE, Silktide, and axe DevTools to ensure content is clear, inclusive, and usable for diverse audiences.</p>`,
    tech: ['HTML5', 'CSS', 'PHP', 'JavaScript', 'WCAG Compliant', '4 Languages']
  }
};
