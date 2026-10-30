/* ============================================================
   ASHUTOSH — Portfolio JavaScript
   Handles: animations, navigation, particles, scroll reveals,
            project rendering, and flip clock preview.
   ============================================================ */

(function () {
  'use strict';

  // ──────────────────────────────────────────────────────────
  // CONFIG
  // ──────────────────────────────────────────────────────────

  const CONFIG = {
    // Replace with your actual usernames / links
    social: {
      github: 'https://github.com/atiwari-dev',
      x: 'https://x.com/IlluminaughtyIN',
      email: 'mailto:ashuxtosh@gmail.com',
    },

    // X display handle for the writing section
    xHandle: '@IlluminaughtyIN',

    // Particle count for the hero background (keep low for performance)
    particleCount: 28,
  };

  // ──────────────────────────────────────────────────────────
  // PROJECTS DATA
  // Add a new project by appending an object to this array.
  // ──────────────────────────────────────────────────────────

  const PROJECTS = [
    {
      name: 'Flipday',
      description:
        'A calm, full-screen flip clock designed for focus and productivity.',
      features: [
        'Minimal flip clock',
        'Multiple time zones',
        'Timeboxing',
        'Task management',
        'Pomodoro timer',
        'Music integration',
      ],
      tech: ['JavaScript', 'CSS', 'Web Audio API'],
      github: 'https://github.com/YOUR_USERNAME/flipday',
      live: '#',
      featured: true,
    },
    {
      name: 'Project Two',
      description:
        'A placeholder for your next project. Replace this with something real.',
      features: [],
      tech: ['Python', 'FastAPI', 'PostgreSQL'],
      github: '#',
      live: null,
      featured: false,
      placeholder: true,
    },
    {
      name: 'Project Three',
      description:
        'Another placeholder. Swap in your own project details when ready.',
      features: [],
      tech: ['TypeScript', 'Node.js', 'Redis'],
      github: '#',
      live: null,
      featured: false,
      placeholder: true,
    },
  ];

  // ──────────────────────────────────────────────────────────
  // DOM READY
  // ──────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroAnimations();
    initParticles();
    renderProjects();
    initFlipClock();
    initScrollReveal();
    injectSocialLinks();
  });

  // ──────────────────────────────────────────────────────────
  // NAVIGATION
  // ──────────────────────────────────────────────────────────

  function initNavigation() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav__toggle');
    const mobileMenu = document.querySelector('.nav__mobile');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    // Scroll state
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      nav.classList.toggle('scrolled', scrollY > 40);
      lastScroll = scrollY;
    }, { passive: true });

    // Mobile toggle
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('active');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // ──────────────────────────────────────────────────────────
  // HERO ANIMATIONS
  // ──────────────────────────────────────────────────────────

  function initHeroAnimations() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Staggered name reveal
    const nameEl = document.querySelector('.hero__name');
    if (nameEl) {
      const text = nameEl.textContent.trim();
      nameEl.textContent = '';
      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${0.3 + i * 0.06}s`;
        span.style.animation = `charReveal 0.6s var(--ease-out) forwards`;
        span.style.animationDelay = `${0.3 + i * 0.06}s`;
        nameEl.appendChild(span);
      });
    }

    // Add char reveal keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
      @keyframes charReveal {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    // Fade in other hero elements
    const fadeTargets = [
      { el: '.hero__status', delay: 0.1 },
      { el: '.hero__tagline', delay: 0.8 },
      { el: '.hero__description', delay: 1.0 },
      { el: '.hero__terminal', delay: 1.15 },
      { el: '.hero__actions', delay: 1.3 },
      { el: '.hero__socials', delay: 1.45 },
    ];

    fadeTargets.forEach(({ el, delay }) => {
      const target = document.querySelector(el);
      if (target) {
        target.style.animation = `fadeInUp 0.7s var(--ease-out) ${delay}s forwards`;
      }
    });

    // Glow fade in
    const glow = document.querySelector('.hero__glow');
    if (glow) {
      glow.style.animation = `glowPulse 8s ease-in-out infinite, fadeInGlow 2s ease-out 0.5s forwards`;
      const glowStyle = document.createElement('style');
      glowStyle.textContent = `
        @keyframes fadeInGlow {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `;
      document.head.appendChild(glowStyle);
    }
  }

  // ──────────────────────────────────────────────────────────
  // PARTICLES
  // ──────────────────────────────────────────────────────────

  function initParticles() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const container = document.querySelector('.hero__particles');
    if (!container) return;

    for (let i = 0; i < CONFIG.particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${30 + Math.random() * 60}%`;
      p.style.animationDuration = `${6 + Math.random() * 10}s`;
      p.style.animationDelay = `${Math.random() * 8}s`;

      // Vary size slightly
      const size = 1.5 + Math.random() * 1.5;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;

      // Some particles use secondary color
      if (Math.random() > 0.7) {
        p.style.background = '#00C3FF';
      }

      container.appendChild(p);
    }
  }

  // ──────────────────────────────────────────────────────────
  // PROJECTS RENDERING
  // ──────────────────────────────────────────────────────────

  function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    grid.innerHTML = PROJECTS.map((project) => {
      const isFeatured = project.featured;

      // Features list (only for featured)
      const featuresHTML = project.features.length
        ? `<div class="project-card__features">
             ${project.features.map((f) => `<span class="project-card__feature">${f}</span>`).join('')}
           </div>`
        : '';

      // Tech tags
      const techHTML = project.tech.length
        ? `<div class="project-card__tech">
             ${project.tech.map((t) => `<span>${t}</span>`).join('')}
           </div>`
        : '';

      // Links
      const githubLink = project.github && project.github !== '#'
        ? `<a href="${project.github}" class="project-card__link" target="_blank" rel="noopener noreferrer" aria-label="View ${project.name} on GitHub">
             GitHub <span class="arrow">→</span>
           </a>`
        : '';

      const liveLink = project.live && project.live !== '#'
        ? `<a href="${project.live}" class="project-card__link" target="_blank" rel="noopener noreferrer" aria-label="View ${project.name} live demo">
             Live Demo <span class="arrow">→</span>
           </a>`
        : '';

      // Placeholder badge
      const placeholderBadge = project.placeholder
        ? `<span style="font-size: 0.7rem; color: var(--text-dim); font-style: italic; margin-left: 8px;">(example)</span>`
        : '';

      // Preview for featured project (flip clock)
      const previewHTML = isFeatured
        ? `<div class="project-card__preview">
             <div class="flip-clock-preview" id="flip-clock-preview" aria-hidden="true">
               <div class="flip-digit" data-digit="h1">0</div>
               <div class="flip-digit" data-digit="h2">0</div>
               <span class="flip-separator">:</span>
               <div class="flip-digit" data-digit="m1">0</div>
               <div class="flip-digit" data-digit="m2">0</div>
               <span class="flip-separator">:</span>
               <div class="flip-digit" data-digit="s1">0</div>
               <div class="flip-digit" data-digit="s2">0</div>
             </div>
           </div>`
        : '';

      return `
        <article class="project-card ${isFeatured ? 'project-card--featured' : ''} reveal">
          ${previewHTML}
          <div class="project-card__info">
            <h3 class="project-card__name">${project.name}${placeholderBadge}</h3>
            <p class="project-card__desc">${project.description}</p>
            ${featuresHTML}
            ${techHTML}
            <div class="project-card__links">
              ${githubLink}
              ${liveLink}
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // ──────────────────────────────────────────────────────────
  // FLIP CLOCK (live time in the preview)
  // ──────────────────────────────────────────────────────────

  function initFlipClock() {
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');

      setDigit('h1', h[0]);
      setDigit('h2', h[1]);
      setDigit('m1', m[0]);
      setDigit('m2', m[1]);
      setDigit('s1', s[0]);
      setDigit('s2', s[1]);
    }

    function setDigit(name, value) {
      const el = document.querySelector(`[data-digit="${name}"]`);
      if (el && el.textContent !== value) {
        el.textContent = value;
      }
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  // ──────────────────────────────────────────────────────────
  // SCROLL REVEAL (IntersectionObserver)
  // ──────────────────────────────────────────────────────────

  function initScrollReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Instantly show all
      document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  // ──────────────────────────────────────────────────────────
  // SOCIAL LINK INJECTION
  // Updates all social links from CONFIG so you only
  // change them in one place.
  // ──────────────────────────────────────────────────────────

  function injectSocialLinks() {
    // Hero socials
    document.querySelectorAll('[data-social="github"]').forEach((el) => {
      el.href = CONFIG.social.github;
    });
    document.querySelectorAll('[data-social="x"]').forEach((el) => {
      el.href = CONFIG.social.x;
    });
    document.querySelectorAll('[data-social="email"]').forEach((el) => {
      el.href = CONFIG.social.email;
    });

    // Writing section X handle
    const xHandleEl = document.getElementById('x-handle');
    if (xHandleEl) {
      xHandleEl.textContent = CONFIG.xHandle;
    }

    const writingLink = document.getElementById('writing-link');
    if (writingLink) {
      writingLink.href = CONFIG.social.x;
    }
  }
})();
