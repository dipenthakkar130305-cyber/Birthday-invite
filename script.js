// ---------- Party video (vertical) with tap-for-sound ----------
(function () {
  const video = document.getElementById('partyVideo');
  const placeholder = document.getElementById('videoPlaceholder');
  const soundBtn = document.getElementById('soundBtn');

  function showVideo() {
    video.style.display = 'block';
    soundBtn.style.display = 'block';
    placeholder.style.display = 'none';
  }
  function showPlaceholder() {
    video.style.display = 'none';
    soundBtn.style.display = 'none';
    placeholder.style.display = 'flex';
  }

  video.addEventListener('loadedmetadata', showVideo);
  video.addEventListener('error', showPlaceholder);
  if (video.readyState >= 1) showVideo();

  function setSound(on) {
    video.muted = !on;
    soundBtn.textContent = on ? '🔇 Mute' : '🔊 Tap for sound';
    soundBtn.classList.toggle('on', on);
  }

  soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const turnOn = video.muted;
    if (turnOn) video.currentTime = 0;
    setSound(turnOn);
    video.play().catch(() => {});
  });

  // Tapping the video itself: play/pause
  video.addEventListener('click', () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });

  // Autoplay (muted) — some browsers need a nudge
  video.play().catch(() => {});
})();

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

// ---------- "Are you in?" buttons ----------
(function () {
  const buttons = document.getElementById('answerButtons');
  const thankYou = document.getElementById('thankYou');

  buttons.querySelectorAll('.answer-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.hidden = true;
      thankYou.hidden = false;
      launchConfetti(160);
      try { localStorage.setItem('harsh26-joined', '1'); } catch (e) {}
    });
  });

  // If they already answered on this device, keep showing the thank-you
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
