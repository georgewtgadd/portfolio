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
    { icon:'fa-search', title:'Needs Analysis & Storyboarding',
      text:`St Barnabas Hospice needed to translate two full days of face-to-face palliative and end-of-life care training into something busy healthcare professionals could complete flexibly online, without losing rigour. Drawing on Cognitive Load Theory, the course was restructured into four self-paced modules, with key concepts revisited later through Spaced Repetition to support retention. To bring case-study patients to life during drafting, AI-generated video created realistic personas — letting stakeholders review the learner experience early — while progression was storyboarded to gate on demonstrated understanding, applying Bloom's Mastery Learning and Gagn\u00e9's Conditions of Learning.`,
      points:['Cognitive Load Theory \u2192 four-module structure','Spaced Repetition for retention','AI-generated personas for early stakeholder review','Mastery-gated progression (Bloom\u2019s + Gagn\u00e9\u2019s Conditions of Learning)'] },
    { icon:'fa-code', title:'Development',
      text:`The Skills Network's EQUAL platform doesn't support traditional SCORM authoring tools, so rather than build in an authoring tool, the modules were hand-coded natively in HTML5, React.js and CSS — a deliberate, platform-driven tooling decision. WCAG accessibility checks and functional QA ran throughout, ahead of release.`,
      points:['Native HTML5 / React.js / CSS build','A deliberate, platform-driven tooling decision','WCAG accessibility checks + functional QA'] },
    { icon:'fa-rocket', title:'Launch & Evaluation',
      text:`The finished course was packaged and deployed on The Skills Network's EQUAL platform — a recognised LMS for workforce development across health and social care. The result: commercially viable, sellable learning packages that extend St Barnabas's expertise beyond the hospice and into the wider healthcare sector.`,
      points:['Deployed on EQUAL LMS','Commercially available product','Reach extended beyond the hospice'] }
  ],

  vp: [
    { icon:'fa-search', title:'Needs Analysis & Storyboarding',
      text:`Placement experiences in the East Midlands were becoming harder to source and more expensive to resource, particularly for healthcare courses where hands-on practice hours are essential. Students meet practice supervisor Krish and are guided through a virtual home visit to patient Lionel — a branching, decision-based scenario that was scripted and storyboarded, with self-assessment points mapped to the national CPAF 2024 framework.`,
      points:['Problem: placement scarcity & cost','Branching scenario: Krish & Lionel','Self-assessment mapped to CPAF 2024'] },
    { icon:'fa-code', title:'Development',
      text:`The platform — including an AI-driven practice assessor powered by the OpenAI API, and a self-assessment / digital badge dashboard — was custom-built in PHP, MySQL and JavaScript. The Lionel scenario was authored as a SCORM module in Articulate Storyline and embedded into this custom shell. The chatbot was deliberately scoped to remain relevant only to placement content, and accessibility audits using WAVE, axe DevTools and Silktide ensured the platform worked for diverse learners.`,
      points:['Custom PHP / MySQL / OpenAI platform','SCORM scenario embedded in the custom shell','WAVE / axe DevTools / Silktide audits'] },
    { icon:'fa-rocket', title:'Launch & Evaluation',
      text:`Rollout was carefully managed — embedded into Year 1 lectures and made compulsory before students' first real-world placement. The platform has now been rolled out across four student cohorts (400+ users), with a learning dashboard tracking competency development at three structured points across the placement.`,
      points:['4 cohorts, 400+ students','Compulsory pre-placement completion','3-point competency tracking'] }
  ],

  telehealth: [
    { icon:'fa-search', title:'Needs Analysis & Storyboarding',
      text:`The COVID-19 lockdown forced a rapid shift to telehealth consultations — clinical staff and students needed to understand and adapt to this new mode of care almost overnight. The resource was designed as a blended pathway: structured e-learning paired with immersive 360° exploration of virtual clinical environments.`,
      points:['Trigger: COVID-19 lockdown, urgent turnaround','Blended learning pathway','360° virtual environment exploration'] },
    { icon:'fa-code', title:'Development',
      text:`The core interactive learning content was authored in Articulate Storyline, exported as SCORM packages, and embedded within a bespoke Bootstrap website alongside the 360° tour experiences — combining rapid content authoring with custom web development for the immersive layer.`,
      points:['SCORM packages embedded in a custom Bootstrap shell','360° tours embedded alongside','Built under lockdown time pressure'] },
    { icon:'fa-rocket', title:'Launch & Evaluation',
      text:`The resource was integrated directly into the University's LMS, making it accessible within the existing curriculum with no disruption to how students already learned. It went on to become an important precursor to Virtual Placement, proving out the same experiential, practice-oriented design principles later scaled into that platform.`,
      points:['Integrated into the University LMS','Precursor to Virtual Placement','Validated the experiential design approach'] }
  ],

  adhd: [
    { icon:'fa-search', title:'Needs Analysis & Storyboarding',
      text:`Healthcare professionals and the public needed clearer, more accessible guidance on recognising and assessing ADHD in children and adults. Content was scripted in close collaboration with clinical stakeholders and split into two resources — Understanding ADHD, and The Role of the GP in ADHD Diagnosis and Management — endorsed by the Royal College of GPs.`,
      points:['Audience: HCPs and the public','Two resources, RCGP-endorsed'] },
    { icon:'fa-code', title:'Development',
      text:`Built in HTML5, CSS and PHP, then translated from English into French, Spanish and German — working closely with professional translators and global stakeholders to keep meaning and tone intact across languages.`,
      points:['HTML5 / CSS / PHP build','4 languages, professional translation partnership'] },
    { icon:'fa-rocket', title:'Launch & Evaluation',
      text:`Each language version went through accessibility audits using WAVE, Silktide and axe DevTools before release, to make sure the content stayed clear, inclusive and usable for every audience it was built for.`,
      points:['WAVE / Silktide / axe DevTools audits','Public + professional release'] }
  ]
};

/* ── PROJECT LIFECYCLE (collapsible accordion) ── */
function renderLifecycle(container, stages, opts = {}) {
  if (!container || !stages) return;
  const size = opts.size || 'full';
  container.classList.add('lifecycle');
  container.dataset.size = size;

  container.innerHTML = `
    <div class="lifecycle-hint"><i class="fas fa-hand-pointer"></i> Click a stage to expand it</div>
    <div class="lc-accordion"></div>
  `;
  const accordion = container.querySelector('.lc-accordion');

  stages.forEach((s, i) => {
    const item = document.createElement('div');
    item.className = 'lc-item' + (i === 0 ? ' open' : '');
    item.innerHTML = `
      <button type="button" class="lc-item-header" aria-expanded="${i === 0 ? 'true' : 'false'}">
        <span class="lc-item-num">${i + 1}</span>
        <span class="lc-item-icon"><i class="fas ${s.icon}"></i></span>
        <span class="lc-item-title">${s.title}</span>
        <span class="lc-item-chevron"><i class="fas fa-chevron-down"></i></span>
      </button>
      <div class="lc-item-body">
        <div class="lc-item-body-inner">
          <div class="lc-item-body-content">
            <p class="lc-item-text">${s.text}</p>
            ${s.points ? `<ul class="lc-item-points">${s.points.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
          </div>
        </div>
      </div>
    `;
    const header = item.querySelector('.lc-item-header');
    header.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      accordion.querySelectorAll('.lc-item').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.lc-item-header').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
    accordion.appendChild(item);
  });
}

/* Render the full St Barnabas lifecycle straight into the page */
renderLifecycle(document.getElementById('lifecycle-stbarnabas'), lifecycleData.stbarnabas, { size: 'full' });

/* ── COLLAPSIBLE THEORY DEFINITIONS ── */
const theoryDefs = {
  'Cognitive Load Theory': 'Working memory has limited capacity \u2014 breaking content into smaller chunks prevents overload and supports learning.',
  'Spaced Repetition': 'Revisiting key concepts at increasing intervals strengthens long-term retention and transfer into practice.',
  "Bloom's Taxonomy": 'A framework for structuring learning objectives, from basic recall through to higher-order application and evaluation.'
};

document.querySelectorAll('.theory-chips').forEach(wrap => {
  const defBox = document.createElement('div');
  defBox.className = 'theory-def';
  defBox.innerHTML = `<div class="theory-def-inner"><p class="theory-def-text"></p></div>`;
  wrap.insertAdjacentElement('afterend', defBox);
  const defText = defBox.querySelector('.theory-def-text');

  wrap.querySelectorAll('.theory-chip').forEach(chip => {
    chip.setAttribute('aria-expanded', 'false');
    chip.addEventListener('click', () => {
      const isOpen = chip.getAttribute('aria-expanded') === 'true';
      wrap.querySelectorAll('.theory-chip').forEach(c => c.setAttribute('aria-expanded', 'false'));
      if (isOpen) {
        defBox.classList.remove('open');
      } else {
        chip.setAttribute('aria-expanded', 'true');
        defText.textContent = theoryDefs[chip.textContent.trim()] || '';
        defBox.classList.add('open');
      }
    });
  });
});
