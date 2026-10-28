// ---------- Map toggle ----------
(function () {
  const btn = document.querySelector('.toggle-map');
  const wrapper = document.querySelector('.map-wrapper');
  if (!btn || !wrapper) return;

  const setText = () => {
    btn.textContent = wrapper.classList.contains('collapsed') ? 'Show Map' : 'Hide Map';
  };
  if (window.innerWidth < 768) wrapper.classList.add('collapsed');
  setText();

  btn.addEventListener('click', () => {
    wrapper.classList.toggle('collapsed');
    setText();
  });
})();

// ---------- Fireworks ----------
const Fireworks = (function () {
  const canvas = document.getElementById('fireworks');
  const ctx = canvas.getContext('2d');
  const colors = ['#FFC857', '#FF3CAC', '#7B61FF', '#2BD9FE', '#FFFFFF', '#FF6B35', '#7CFF6B'];
  let rockets = [];
  let sparks = [];
  let running = false;
  let launcher = null;
  let dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function launch() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    rockets.push({
      x: w * (0.15 + Math.random() * 0.7),
      y: h + 10,
      vx: (Math.random() - 0.5) * 2,
      vy: -(h * 0.012 + Math.random() * h * 0.006),
      targetY: h * (0.12 + Math.random() * 0.35),
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  function explode(r) {
    const count = 70 + Math.floor(Math.random() * 50);
    const speed = 3 + Math.random() * 3;
    const twoTone = Math.random() > 0.5 ? colors[Math.floor(Math.random() * colors.length)] : r.color;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const v = speed * (0.5 + Math.random() * 0.6);
      sparks.push({
        x: r.x,
        y: r.y,
        vx: Math.cos(angle) * v,
        vy: Math.sin(angle) * v,
        life: 1,
        decay: 0.011 + Math.random() * 0.012,
        color: i % 2 ? r.color : twoTone,
        size: 1.6 + Math.random() * 1.6,
      });
    }
  }

  function frame() {
    if (!running && rockets.length === 0 && sparks.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    // Fade previous frame for trails
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalCompositeOperation = 'lighter';

    rockets = rockets.filter((r) => {
      r.x += r.vx;
      r.y += r.vy;
      r.vy *= 0.985;
      ctx.fillStyle = r.color;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
      if (r.y <= r.targetY || r.vy > -1.5) {
        explode(r);
        return false;
      }
      return true;
    });

    sparks = sparks.filter((p) => {
      p.vx *= 0.97;
      p.vy = p.vy * 0.97 + 0.06; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) return false;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      return true;
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(frame);
  }

  function start() {
    resize();
    running = true;
    // Opening salvo
    for (let i = 0; i < 4; i++) setTimeout(launch, i * 180);
    launcher = setInterval(() => {
      launch();
      if (Math.random() > 0.55) setTimeout(launch, 150);
    }, 650);
    requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    clearInterval(launcher);
  }

  window.addEventListener('resize', () => { if (running) resize(); });
  return { start, stop };
})();

// ---------- "Are you in?" buttons → full-screen celebration ----------
(function () {
  const buttons = document.getElementById('answerButtons');
  const thankYou = document.getElementById('thankYou');
  const overlay = document.getElementById('celebration');
  const closeBtn = document.getElementById('closeCelebration');

  function openCelebration() {
    overlay.hidden = false;
    document.body.classList.add('no-scroll');
    Fireworks.start();
    launchConfetti(140);
  }

  function closeCelebration() {
    overlay.hidden = true;
    document.body.classList.remove('no-scroll');
    Fireworks.stop();
    buttons.hidden = true;
    thankYou.hidden = false;
  }

  buttons.querySelectorAll('.answer-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      openCelebration();
      try { localStorage.setItem('harsh26-joined', '1'); } catch (e) {}
    });
  });
  closeBtn.addEventListener('click', closeCelebration);

  // If they already answered on this device, show the small thank-you
  try {
    if (localStorage.getItem('harsh26-joined') === '1') {
      buttons.hidden = true;
      thankYou.hidden = false;
    }
  } catch (e) {}
})();

// ---------- Confetti ----------
function launchConfetti(count = 100) {
  const container = document.getElementById('confetti-container');
  const colors = ['#FFC857', '#FF3CAC', '#7B61FF', '#2BD9FE', '#FFFFFF'];

  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    const size = Math.random() * 8 + 5;
    c.style.width = size + 'px';
    c.style.height = size * (Math.random() > 0.5 ? 1 : 2.2) + 'px';
    c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    c.style.left = Math.random() * 100 + 'vw';
    c.style.borderRadius = Math.random() > 0.6 ? '50%' : '2px';
    container.appendChild(c);

    c.animate(
      [
        { transform: 'translate3d(0,-20px,0) rotate(0deg)', opacity: 1 },
        {
          transform: `translate3d(${(Math.random() - 0.5) * 200}px, ${window.innerHeight + 40}px, 0) rotate(${720 * Math.random()}deg)`,
          opacity: 0.6,
        },
      ],
      {
        duration: Math.random() * 3000 + 2500,
        delay: Math.random() * 400,
        easing: 'cubic-bezier(0.25, 0.6, 0.5, 1)',
        fill: 'forwards',
      }
    ).onfinish = () => c.remove();
  }
}

// Little welcome burst on load
window.addEventListener('load', () => setTimeout(() => launchConfetti(80), 600));
