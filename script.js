(function () {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const rand = () => CHARS[(Math.random() * CHARS.length) | 0];

  // ─── Split-flap name ───
  // Each tile cycles letters until its landing frame, staggered left to right.
  const board = document.getElementById('board');
  function flapRow(text, delay) {
    const row = document.createElement('span');
    row.className = 'board__row';
    row.setAttribute('aria-hidden', 'true');
    board.appendChild(row);
    [...text].forEach((ch, i) => {
      const t = document.createElement('span');
      t.className = 'flap';
      row.appendChild(t);
      if (reduce) { t.textContent = ch; return; }
      let n = 0;
      const stop = 10 + i * 3 + delay;
      const id = setInterval(() => {
        t.textContent = n >= stop ? ch : rand();
        t.classList.remove('tick'); void t.offsetWidth; t.classList.add('tick');
        if (n++ >= stop) clearInterval(id);
      }, 55);
    });
  }
  flapRow('ASHUTOSH', 0);
  flapRow('TIWARI', 12);

  // ─── Rotating phrase ───
  const words = ['AI systems', 'RAG assistants', 'data platforms', 'secure infrastructure', 'DevOps pipelines', 'systems at scale'];
  const word = document.getElementById('word');
  let w = 0;
  if (!reduce) setInterval(() => {
    const target = words[++w % words.length];
    let k = 0;
    const id = setInterval(() => {
      word.textContent = [...target].map((c, i) => (i < k || c === ' ') ? c : rand().toLowerCase()).join('');
      if (k++ > target.length) { word.textContent = target; clearInterval(id); }
    }, 34);
  }, 2800);

  // ─── Theme toggle ───
  document.getElementById('theme').addEventListener('click', () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : !matchMedia('(prefers-color-scheme: light)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  });

  // ─── Mobile menu ───
  const menu = document.getElementById('menu');
  const mobile = document.getElementById('mobile');
  const setMenu = (open) => { mobile.hidden = !open; menu.setAttribute('aria-expanded', open); };
  menu.addEventListener('click', () => setMenu(mobile.hidden));
  mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // ─── Card spotlight follows the cursor ───
  document.querySelectorAll('.card').forEach((c) => c.addEventListener('pointermove', (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', e.clientX - r.left + 'px');
    c.style.setProperty('--my', e.clientY - r.top + 'px');
  }));

  // ─── Scroll reveal ───
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: .08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
