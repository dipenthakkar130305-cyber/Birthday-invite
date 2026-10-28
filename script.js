// ---------- Video slot: show video if media/party-video.mp4 exists, else placeholder ----------
(function () {
  const video = document.getElementById('partyVideo');
  const placeholder = document.getElementById('videoPlaceholder');

  function showPlaceholder() {
    video.style.display = 'none';
    placeholder.style.display = 'flex';
  }
  function showVideo() {
    video.style.display = 'block';
    placeholder.style.display = 'none';
  }

  video.addEventListener('error', showPlaceholder);
  video.addEventListener('loadeddata', showVideo);
  video.addEventListener('loadedmetadata', showVideo);
  // Start with placeholder until the video proves it can load
  showPlaceholder();
  video.load();
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
