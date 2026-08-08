// ===== SCROLL-ANIMATED DAY COUNTER & PHASE BAR =====
const dayCounter = document.getElementById('day-counter');
const phaseFill = document.getElementById('phase-fill');
const phaseName = document.getElementById('phase-name');
const phasePct = document.getElementById('phase-pct');
const milestones = document.querySelectorAll('.milestone');
const milestoneDots = document.querySelectorAll('.milestone-dot');
const challengeSection = document.getElementById('challenge');

const phases = [
  { day: 1, name: 'START', pct: 5 },
  { day: 15, name: 'BUILD', pct: 36 },
  { day: 30, name: 'MOMENTUM', pct: 67 },
  { day: 45, name: 'VISIBILITY', pct: 98 },
  { day: 60, name: 'SHIP', pct: 100 },
];

function getPhaseIndex(day) {
  if (day < 15) return 0;
  if (day < 30) return 1;
  if (day < 45) return 2;
  if (day < 60) return 3;
  return 4;
}

function updateChallenge(day) {
  const clamped = Math.max(1, Math.min(60, Math.round(day)));
  dayCounter.textContent = String(clamped).padStart(2, '0');

  const pct = Math.round(((clamped - 1) / 59) * 100);
  phaseFill.style.width = pct + '%';
  phasePct.textContent = pct + '%';

  const idx = getPhaseIndex(clamped);
  phaseName.textContent = phases[idx].name;

  milestones.forEach((m, i) => {
    m.classList.toggle('active', i === idx);
  });
  milestoneDots.forEach((d, i) => {
    d.classList.toggle('active', i <= idx);
  });
}

// Animate from Day 01 → Day 60 as section scrolls into view
function onChallengeScroll() {
  if (!challengeSection) return;
  const rect = challengeSection.getBoundingClientRect();
  const winH = window.innerHeight;
  // start animating when section top hits bottom of viewport
  // end animating when section bottom hits top of viewport
  const sectionH = challengeSection.offsetHeight;
  const progress = 1 - (rect.top - winH * 0.2) / (sectionH + winH * 0.6);
  const clamped = Math.max(0, Math.min(1, progress));
  const day = 1 + clamped * 59;
  updateChallenge(day);
}

window.addEventListener('scroll', onChallengeScroll, { passive: true });
onChallengeScroll();

// ===== GENERATE HEATMAP =====
function buildHeatmap() {
  const heatmap = document.getElementById('heatmap');
  if (!heatmap) return;

  // 60 cells; first 12 are "done" (some dim variations), rest empty
  const patterns = [
    'done', 'done-dim', 'done', 'done', 'done-faint', 'done-dim',
    'done', 'done-faint', 'done', 'done', 'done', 'done',
    '', '', '', 'done-faint', '', 'done-faint', '', '',
    '', '', 'done-dim', '', '', 'done-faint', '', 'done-dim',
    '', '', '', '', 'done-faint', '', '', 'done',
    '', 'done-faint', '', '', '', '', 'done-dim', '',
    '', '', '', '', '', '', '', '',
    '', 'done', 'done-dim', '', '', '', '', '',
    '', '', '', '', '', 'done-faint', '', '',
    '', 'done-dim', '', '', '', '', 'done', 'done',
  ];

  for (let i = 0; i < 60; i++) {
    const cell = document.createElement('div');
    cell.className = 'hm-cell' + (patterns[i] ? ' ' + patterns[i] : '');
    heatmap.appendChild(cell);
  }
}

buildHeatmap();

// ===== DAILY LOOP STEP ANIMATION =====
const loopSteps = document.querySelectorAll('.loop-step');

function animateLoopSteps() {
  if (!loopSteps.length) return;
  const loopSection = document.getElementById('daily-loop');
  if (!loopSection) return;
  const rect = loopSection.getBoundingClientRect();
  const winH = window.innerHeight;
  const progress = (winH - rect.top) / (winH + rect.height);
  const clampedProgress = Math.max(0, Math.min(1, progress));

  const activeIdx = Math.floor(clampedProgress * loopSteps.length);

  loopSteps.forEach((step, i) => {
    const isActive = i === activeIdx;
    const bar = step.querySelector('.step-accent-bar');
    const nameEl = step.querySelector('.step-name');
    const descEl = step.querySelector('.step-desc');

    if (isActive) {
      step.classList.add('active');
      if (bar) { bar.style.display = 'block'; }
      if (nameEl) { nameEl.classList.remove('muted'); }
      if (descEl) { descEl.classList.remove('muted'); }
    } else {
      step.classList.remove('active');
      if (bar) { bar.style.display = i === 0 && activeIdx !== 0 ? 'none' : (i === 0 ? 'block' : 'none'); }
      if (nameEl) { nameEl.classList.add('muted'); }
      if (descEl) { descEl.classList.add('muted'); }
    }
  });
}

// Init: only step 0 active
loopSteps.forEach((step, i) => {
  const bar = step.querySelector('.step-accent-bar');
  if (bar && i !== 0) bar.style.display = 'none';
});

window.addEventListener('scroll', animateLoopSteps, { passive: true });
animateLoopSteps();

// ===== SCROLL REVEAL =====
function setupReveal() {
  const sections = document.querySelectorAll('.challenge-section, .daily-loop-section, .evidence-section, .social-section, .transformation-section, .cta-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.reveal').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 80);
        });
      }
    });
  }, { threshold: 0.08 });

  sections.forEach(s => observer.observe(s));
}

// Add reveal class to key elements
document.querySelectorAll('.loop-step, .ev-step, .tl-item, .closing-line, .plat-stat, .stat-item').forEach(el => {
  el.classList.add('reveal');
});

setupReveal();

// ===== NAVBAR SCROLL STATE =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.style.borderBottomColor = 'rgba(30,32,48,0.6)';
  } else {
    navbar.style.borderBottomColor = 'rgba(30,32,48,1)';
  }
}, { passive: true });

// ===== EVIDENCE SECTION - step highlight on scroll =====
const evSteps = document.querySelectorAll('.ev-step');
const evDividers = document.querySelectorAll('.ev-divider');

function animateEvidence() {
  const evSection = document.getElementById('evidence');
  if (!evSection) return;
  const rect = evSection.getBoundingClientRect();
  const winH = window.innerHeight;
  const progress = (winH - rect.top) / (winH + rect.height * 0.5);
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const activeIdx = Math.min(evSteps.length - 1, Math.floor(clampedProgress * evSteps.length));

  evSteps.forEach((step, i) => {
    const nameEl = step.querySelector('.ev-name');
    if (nameEl) {
      nameEl.style.color = i <= activeIdx ? '#fff' : 'var(--muted)';
    }
  });

  evDividers.forEach((div, i) => {
    if (i < activeIdx) {
      div.style.background = 'var(--blue)';
    } else {
      div.style.background = i === 1 ? 'var(--blue)' : 'var(--border)';
    }
  });
}

window.addEventListener('scroll', animateEvidence, { passive: true });
animateEvidence();

// ===== COUNTER ANIMATION for platform numbers =====
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const isDecimal = String(target).includes(',');

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(ease * target);

    el.textContent = current.toLocaleString() + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

const platformObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const platNums = entry.target.querySelectorAll('.plat-num');
      platNums.forEach(el => {
        const text = el.textContent.replace(/[^0-9]/g, '');
        const val = parseInt(text);
        const hasPlus = el.textContent.includes('+');
        el.dataset.suffix = hasPlus ? '+' : '';
        if (!isNaN(val)) animateCounter(el, val);
      });
      platformObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const socialSection = document.querySelector('.social-section');
if (socialSection) platformObserver.observe(socialSection);
