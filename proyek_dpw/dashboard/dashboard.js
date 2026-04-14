 /* ── SIDEBAR TOGGLE ── */
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('overlay');
  const hamburger= document.getElementById('hamburger');

  function openSidebar()  { sidebar.classList.add('open');  overlay.classList.add('open'); }
  function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('open'); }

  hamburger.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
  overlay.addEventListener('click', closeSidebar);

  /* ── DONUT CHART (vanilla canvas) ── */
  function drawDonut() {
    const canvas = document.getElementById('donutChart');
    const ctx    = canvas.getContext('2d');
    const cx = canvas.width / 2, cy = canvas.height / 2, r = 55, lw = 22;

    const total   = parseInt(document.getElementById('totalTamu').textContent) || 100;
    const hadir   = parseInt(document.getElementById('konfHadir').textContent) || 83;
    const tidak   = parseInt(document.getElementById('konfTidak').textContent) || 10;
    const tunggu  = parseInt(document.getElementById('menunggu').textContent)  || 7;

    const slices = [
      { val: hadir,  color: '#6abf8a' },
      { val: tidak,  color: '#f28b82' },
      { val: tunggu, color: '#f4a623' },
    ];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let start = -Math.PI / 2;

    slices.forEach(s => {
      const angle = (s.val / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.lineWidth   = lw;
      ctx.strokeStyle = s.color;
      ctx.stroke();
      start += angle;
    });

    // update pct labels
    document.getElementById('pctHadir').textContent   = Math.round(hadir / total * 100) + '%';
    document.getElementById('pctTidak').textContent   = Math.round(tidak / total * 100) + '%';
    document.getElementById('pctMenunggu').textContent= Math.round(tunggu/ total * 100) + '%';
    document.getElementById('donutTotal').textContent = total;
  }

  drawDonut();

  /* ── COUNTDOWN ── */
  // Set your wedding date here (YYYY, MM-1, DD, HH, mm, ss)
  const weddingDate = new Date('2026-07-05T00:00:00'); // example: July 23 2025

  function pad(n, w = 2) { return String(n).padStart(w, '0'); }

  function updateCountdown() {
    const now  = new Date();
    let diff   = weddingDate - now;
    if (diff < 0) diff = 0;

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cdDays').textContent    = pad(days, 3);
    document.getElementById('cdHours').textContent   = pad(hours);
    document.getElementById('cdMinutes').textContent = pad(minutes);
    document.getElementById('cdSeconds').textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);