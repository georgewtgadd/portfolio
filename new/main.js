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
    src: 'https://www.youtube.com/watch?v=GxNuMgE4-M4',
    title: 'An Introduction to Grounded Theory',
    desc: 'Grounded Theory is often perceived as a dry and complex subject, making it difficult for students to engage with the material. To reduce cognitive load, I designed a self-directed whiteboard animation that leverages Mayer’s Cognitive Theory of Multimedia Learning, using synchronized visual scaffolding and audio narration to clarify abstract concepts. Furthermore, by applying Universal Design for Learning (UDL) principles, I provided multimodal delivery options—including the video, an audio-only podcast, and a text transcript—empowering learners to choose the format that best aligns with their accessibility needs and learning environment.'
  },
  {
    src: 'https://youtu.be/BGiv_NG55PY',
    title: 'Ideal Ward Round Introduction',
    desc: `Within mental health care, ward rounds play an important and potentially very beneficial role in shaping a person's care — making sure that everyone concerned, including the person themselves, has a voice and is listened to. Ward rounds should be a way of ensuring that care is appropriate, dynamic and safe.\n\nHere we meet Emma just before a ward round that is going to discuss her care. Whilst Emma's story is fictitious, you will also hear thoughts from individuals who have been involved in ward round situations in different capacities.`
  },
  {
    src: 'https://youtube.com/shorts/Ehu8cfoCF2A?si=NG-HmbidYj6aqIXs',
    title: 'Clinical Skills Shorts',
    desc: 'Applying microlearning principles, I designed a series of "learning shorts" optimized for mobile platforms and social media. These bite-sized videos deliver focused, accessible content for on-the-go learning, effectively reinforcing key clinical skills and complementing longer-form curriculum resources to match modern student consumption habits.'
  }
];

/* ── VIDEO CAROUSEL ── */
const track = document.getElementById('carouselTrack');
const dotsWrap = document.getElementById('carouselDots');

function generateThumbnail(src, canvas) {
  return new Promise(resolve => {
    const vid = document.createElement('video');
    vid.src = src;
    vid.crossOrigin = 'anonymous';
    vid.muted = true;
    vid.preload = 'metadata';
    vid.addEventListener('loadedmetadata', () => {
      vid.currentTime = Math.min(1, vid.duration * 0.1);
    });
    vid.addEventListener('seeked', () => {
      try {
        canvas.width = vid.videoWidth || 640;
        canvas.height = vid.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
        canvas.style.display = 'block';
        const fallback = canvas.parentElement.querySelector('.carousel-thumb-fallback');
        if (fallback) fallback.style.display = 'none';
      } catch (e) { }
      resolve();
    });
    vid.addEventListener('error', () => resolve());
    vid.load();
  });
}

videos.forEach((v, i) => {
  const card = document.createElement('div');
  card.className = 'carousel-card';
  card.dataset.index = i;

  const filename = v.src.split('/').pop().replace(/\.[^.]+$/, '').replace(/_/g, ' ');
  const isYouTube = v.src.includes('youtu.be') || v.src.includes('youtube.com');
  let thumbHtml = '';

  if (isYouTube) {
    // FIXED: Robust YouTube ID extraction
    const match = v.src.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^&?]+)/);
    const videoId = match ? match[1] : '';
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    thumbHtml = `<img src="${thumbnailUrl}" style="width:100%;height:100%;object-fit:cover;" alt="${v.title} thumbnail">`;
  } else {
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

  if (!isYouTube) {
    const canvas = card.querySelector('canvas');
    generateThumbnail(v.src, canvas);
  }

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

  if (v.src.includes('youtu.be') || v.src.includes('youtube.com')) {
    // FIXED: Robust YouTube ID extraction for the embed
    const match = v.src.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^&?]+)/);
    const videoId = match ? match[1] : '';
    
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

  const lifecycleMount = document.getElementById('pmodalBody').querySelector('.lifecycle-mount');
  if (lifecycleMount && lifecycleData[id]) {
    renderLifecycle(lifecycleMount, lifecycleData[id], { size: 'mini' });
  }

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
    tag: 'LMS Platform · Storyline Scenario',
    title: 'Virtual Placement',
    images: [
      { src: 'images/vp1.png', alt: 'Virtual Placement – Landing Page' },
      { src: 'images/vp2.png', alt: 'Virtual Placement – AI Chat Interface' }
    ],
    body: `<p>Students on a wide range of courses, particularly in healthcare, are required to complete placement learning. Placement experiences in the East Midlands are becoming increasingly difficult to source and more expensive to resource — a bespoke "Virtual Placement" (VP) platform was designed to provide authentic, practice-oriented experiences instead.</p>
    <div class="lifecycle-mount"></div>`,
    tech: ['PHP', 'HTML5', 'JavaScript', 'Articulate Storyline', 'OpenAI API', 'MySQL', 'OAuth 2.0', 'Apache ECharts', 'Bootstrap']
  },
  telehealth: {
    tag: 'Blended Learning · Storyline SCORM',
    title: 'Telehealth Learning Resource',
    images: [
      { src: 'images/360.png', alt: 'Telehealth 360 image' }
    ],
    body: `<p>Developed during the COVID-19 lockdown period in response to rapidly evolving healthcare practices, this blended learning resource was built to support clinical staff and students in understanding and adapting to telehealth consultations.</p>
    <div class="lifecycle-mount"></div>`,
    tech: ['Bootstrap', 'HTML5', 'CSS', 'JavaScript', 'Articulate Storyline', 'SCORM', '360° Tours', 'LMS Integration']
  },
  adhd: {
    tag: 'Multilingual RLO',
    title: 'ADHD Translation Resources',
    images: [
      { src: 'images/brain.png', alt: 'ADHD Translation Resource illustration' }
    ],
    body: `<p>This project focused on equipping healthcare professionals and the public with accessible information on assessing and recognising ADHD in both children and adults. The resources are endorsed by the Royal College of General Practitioners.</p>
    <div class="lifecycle-mount"></div>`,
    tech: ['HTML5', 'CSS', 'PHP', 'JavaScript', 'WCAG Compliant', '4 Languages']
  }
};

/* ── PROJECT LIFECYCLE DATA ── */
const lifecycleData = {

  stbarnabas: [
    { icon:'fa-search', title:'Discovery & Needs Analysis',
      text:`St Barnabas Hospice needed to translate two full days of face-to-face palliative and end-of-life care training into something busy healthcare professionals could complete flexibly online — without losing rigour. The core design challenge, and the constraints on the audience, were captured up front to shape everything that followed.`,
      points:['Client: St Barnabas Hospice','Audience: healthcare professionals across the wider sector','Constraint: must fit around shift patterns, self-paced'] },
    { icon:'fa-pencil-ruler', title:'Design & Instructional Strategy',
      text:`Drawing on Cognitive Load Theory, the two-day course was deliberately restructured into four bite-sized modules learners can complete at their own pace. Key concepts are introduced early and revisited later — Spaced Repetition — a principle shown to improve long-term retention and transfer into practice.`,
      points:['Cognitive Load Theory','Four-module structure','Spaced Repetition for retention'] },
    { icon:'fa-clipboard-check', title:'Storyboarding & Stakeholder Sign-off',
      text:`To bring case-study patients to life during drafting, AI-generated video created realistic patient personas — letting hospice stakeholders visualise and review the learner experience early, before full build. Progression was designed to gate on demonstrated understanding (Bloom's Mastery Learning, aligned with Gagné's Conditions of Learning), so knowledge is sequenced intentionally.`,
      points:['AI-generated personas for early stakeholder review','Mastery-gated progression','Bloom\u2019s Mastery Learning + Gagn\u00e9\u2019s Conditions of Learning'] },
    { icon:'fa-code', title:'Build & Development',
      text:`The Skills Network's EQUAL platform doesn't support traditional SCORM authoring tools — so rather than build in Storyline, the modules were hand-coded natively in HTML5, React.js and CSS. It's a good example of choosing the right tool for the platform, not just the tool I know best.`,
      points:['Native HTML5 / React.js / CSS build','A deliberate, platform-driven tooling decision','No SCORM wrapper — built for EQUAL directly'] },
    { icon:'fa-vial', title:'Testing, QA & Launch',
      text:`As with all my projects, WCAG accessibility checks and functional QA ran ahead of release. The finished course was then packaged and deployed on The Skills Network's EQUAL platform — a recognised LMS for workforce development across health and social care.`,
      points:['WCAG accessibility checks','Functional QA before release','Deployed on EQUAL LMS'] },
    { icon:'fa-chart-line', title:'Evaluation & Impact',
      text:`The result: commercially viable, sellable learning packages that extend St Barnabas's expertise beyond the hospice and into the wider healthcare sector — proof that complex, sensitive subject matter can be translated into structured digital learning within real technical and platform constraints.`,
      points:['Commercially available product','Reach extended beyond the hospice','Sensitive subject matter, structured delivery'] }
  ],

  vp: [
    { icon:'fa-search', title:'Discovery',
      text:`Placement experiences in the East Midlands were becoming harder to source and more expensive to resource — particularly for healthcare courses where hands-on practice hours are essential. The brief was to design a scalable alternative that still felt authentic and practice-oriented.`,
      points:['Problem: placement scarcity & cost','Need: an authentic, scalable alternative'] },
    { icon:'fa-pencil-ruler', title:'Design & Scenario Scripting',
      text:`Students meet practice supervisor Krish and are guided through a virtual home visit to patient Lionel. This branching, decision-based scenario was scripted and storyboarded, then authored in Articulate Storyline as a SCORM-compliant module — a natural fit for Storyline's strengths in branching logic and scenario-based learning.`,
      storyline:'branching scenario for the Lionel home visit',
      points:['Branching scenario design','SCORM module authored in Storyline','Self-assessment mapped to CPAF 2024'] },
    { icon:'fa-code', title:'Build & Integration',
      text:`The wider platform — including an AI-driven practice assessor powered by the OpenAI API, and a self-assessment / digital badge dashboard — was custom-built in PHP, MySQL and JavaScript. The Storyline SCORM module was embedded directly into this bespoke shell, pairing fast authoring-tool development with full custom platform control where it mattered most.`,
      points:['Custom PHP / MySQL / OpenAI platform','Storyline SCORM module embedded in the custom shell','Chatbot deliberately scoped to placement content only'] },
    { icon:'fa-vial', title:'Testing & Rollout',
      text:`Accessibility audits using WAVE, axe DevTools and Silktide ensured the platform worked for diverse learners. Rollout was carefully managed — embedded into Year 1 lectures and made compulsory before students' first real-world placement.`,
      points:['WAVE / axe DevTools / Silktide audits','Compulsory pre-placement completion','In-person lecture integration'] },
    { icon:'fa-chart-line', title:'Evaluation & Scale',
      text:`The platform has now been rolled out across four student cohorts — 400+ users — with self-assessment data feeding a learning dashboard that tracks competency development at three structured points across the placement.`,
      points:['4 cohorts, 400+ students','3-point competency tracking','Mapped to the national CPAF framework'] }
  ],

  telehealth: [
    { icon:'fa-search', title:'Discovery',
      text:`The COVID-19 lockdown forced a rapid shift to telehealth consultations — clinical staff and students needed to understand and adapt to this new mode of care almost overnight.`,
      points:['Trigger: COVID-19 lockdown','Urgent turnaround required'] },
    { icon:'fa-pencil-ruler', title:'Design',
      text:`The resource was designed as a blended pathway: structured e-learning content paired with immersive 360° exploration of virtual clinical environments, so learners could explore realistic settings without leaving the platform.`,
      points:['Blended learning pathway','360° virtual environment exploration'] },
    { icon:'fa-code', title:'Build',
      text:`The core interactive learning content was authored in Articulate Storyline and exported as SCORM packages, then embedded within a bespoke Bootstrap website alongside the 360° tour experiences — pairing Storyline's rapid authoring workflow with custom web development for the immersive layer.`,
      storyline:'SCORM modules embedded in the Bootstrap shell',
      points:['Storyline-authored SCORM packages','Bootstrap website shell','360° tours embedded alongside'] },
    { icon:'fa-rocket', title:'Deploy',
      text:`The resource was integrated directly into the University's LMS, making it accessible within the existing curriculum structure with no disruption to how students already accessed their learning.`,
      points:['Integrated into the University LMS','No workflow disruption for students'] },
    { icon:'fa-chart-line', title:'Legacy & Evaluation',
      text:`This project became an important precursor to Virtual Placement — proving out the same experiential, practice-oriented design principles that were later scaled into that larger platform.`,
      points:['Precursor to Virtual Placement','Validated the experiential design approach'] }
  ],

  adhd: [
    { icon:'fa-search', title:'Discovery',
      text:`Healthcare professionals and the public needed clearer, more accessible guidance on recognising and assessing ADHD in children and adults — content that could be trusted and endorsed at a professional level.`,
      points:['Audience: HCPs and the public','Endorsement: Royal College of GPs'] },
    { icon:'fa-pencil-ruler', title:'Content Development',
      text:`Content was split into two resources — Understanding ADHD, and The Role of the GP in ADHD Diagnosis and Management — scripted in close collaboration with clinical stakeholders.`,
      points:['Two distinct resources','Endorsed by the Royal College of GPs'] },
    { icon:'fa-code', title:'Build & Localisation',
      text:`Built in HTML5, CSS and PHP, then translated from English into French, Spanish and German — working closely with professional translators and global stakeholders to keep meaning and tone intact across languages.`,
      points:['HTML5 / CSS / PHP build','4 languages','Professional translation partnership'] },
    { icon:'fa-vial', title:'Testing',
      text:`Each language version went through accessibility audits using WAVE, Silktide and axe DevTools, to make sure the content stayed clear, inclusive and usable for every audience it was built for.`,
      points:['WAVE / Silktide / axe DevTools audits','Checked for consistency across all 4 languages'] },
    { icon:'fa-rocket', title:'Publish',
      text:`The resources were released for use by healthcare professionals and the public alike — accessible, multilingual, and backed by professional endorsement.`,
      points:['Public + professional release','Multilingual accessibility'] }
  ]
};

/* ── PROJECT LIFECYCLE (click-through) ── */
function renderLifecycle(container, stages, opts = {}) {
  if (!container || !stages) return;
  const size = opts.size || 'full';
  container.classList.add('lifecycle');
  container.dataset.size = size;
  let current = 0;

  container.innerHTML = `
    <div class="lifecycle-hint"><i class="fas fa-hand-pointer"></i> Click through the project lifecycle</div>
    <div class="lifecycle-track" role="tablist" aria-label="Project lifecycle stages"></div>
    <div class="lifecycle-panel" role="tabpanel"></div>
  `;
  const track = container.querySelector('.lifecycle-track');
  const panel = container.querySelector('.lifecycle-panel');

  stages.forEach((s, i) => {
    const node = document.createElement('button');
    node.type = 'button';
    node.className = 'lifecycle-node' + (i === 0 ? ' active' : '');
    node.setAttribute('role', 'tab');
    node.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    node.innerHTML = `
      <span class="lifecycle-node-num">${i + 1}</span>
      ${s.storyline ? '<span class="lifecycle-node-flag" title="Includes an Articulate Storyline element"><i class="fas fa-bolt"></i></span>' : ''}
      <span class="lifecycle-node-icon"><i class="fas ${s.icon}"></i></span>
      <span class="lifecycle-node-label">${s.title}</span>
    `;
    node.addEventListener('click', () => setStage(i));
    track.appendChild(node);
  });

  function setStage(i) {
    current = i;
    track.querySelectorAll('.lifecycle-node').forEach((n, idx) => {
      n.classList.toggle('active', idx === i);
      n.setAttribute('aria-selected', idx === i ? 'true' : 'false');
    });
    const s = stages[i];
    panel.innerHTML = `
      <div class="lifecycle-panel-eyebrow">Stage ${i + 1} of ${stages.length}</div>
      <div class="lifecycle-panel-title">${s.title}</div>
      ${s.storyline ? `<div class="storyline-flag"><i class="fas fa-bolt"></i> Articulate Storyline \u2014 ${s.storyline}</div>` : ''}
      <p class="lifecycle-panel-text">${s.text}</p>
      ${s.points ? `<ul class="lifecycle-panel-points">${s.points.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
      <div class="lifecycle-nav">
        <button type="button" class="lifecycle-nav-btn lifecycle-prev" ${i === 0 ? 'disabled' : ''}><i class="fas fa-arrow-left"></i> Prev</button>
        <span class="lifecycle-progress-label">${i + 1} / ${stages.length}</span>
        <button type="button" class="lifecycle-nav-btn lifecycle-next" ${i === stages.length - 1 ? 'disabled' : ''}>Next <i class="fas fa-arrow-right"></i></button>
      </div>
    `;
    const prevBtn = panel.querySelector('.lifecycle-prev');
    const nextBtn = panel.querySelector('.lifecycle-next');
    if (prevBtn) prevBtn.addEventListener('click', () => setStage(Math.max(0, current - 1)));
    if (nextBtn) nextBtn.addEventListener('click', () => setStage(Math.min(stages.length - 1, current + 1)));
  }

  setStage(0);
}

/* Render the full St Barnabas lifecycle straight into the page */
renderLifecycle(document.getElementById('lifecycle-stbarnabas'), lifecycleData.stbarnabas, { size: 'full' });
