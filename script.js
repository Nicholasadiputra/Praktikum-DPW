// Navbar blur saat scroll
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    nav.style.background = "rgba(255,255,255,0.4)";
  } else {
    nav.style.background = "rgba(255,255,255,0.2)";
  }
});

function updateCountdown() {
  const target = new Date('2026-07-05T00:00:00');
  const now    = new Date();
  const diff   = target - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent    = '000';
    document.getElementById('cd-hours').textContent   = '00';
    document.getElementById('cd-minutes').textContent = '00';
    document.getElementById('cd-seconds').textContent = '00';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent    = String(days).padStart(3, '0');
  document.getElementById('cd-hours').textContent   = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

const path   = document.getElementById('tl-path');
const title  = document.getElementById('tl-title');
const events = document.querySelectorAll('.ev-group');
 
// ── Konfigurasi dash ──
const DASH = 6;   // panjang dash (px dalam viewBox)
const GAP  = 5;   // jarak antar dash
const UNIT = DASH + GAP;
 
// ── Ukur total panjang path ──
const totalLen = path.getTotalLength();
 
// ── Set dashed pattern dari awal (bukan solid) ──
path.style.strokeDasharray = `${DASH},${GAP}`;
 
// Offset dibulatkan ke kelipatan UNIT agar pola dash mulai rapi
const startOffset = Math.ceil(totalLen / UNIT) * UNIT;
path.style.strokeDashoffset = startOffset;
 
// ── Paksa browser hitung layout dulu sebelum transisi ──
path.getBoundingClientRect();
 
// ── Aktifkan transisi lalu gerakkan offset ke 0 (garis menggambar dirinya) ──
path.style.transition = 'stroke-dashoffset 2.6s cubic-bezier(0.4, 0, 0.2, 1)';
 
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    path.style.strokeDashoffset = '0';
  });
});
 
// ── Munculkan setiap event sesuai data-delay (ms) ──
events.forEach(ev => {
  const delay = parseInt(ev.dataset.delay, 10);
  setTimeout(() => ev.classList.add('visible'), delay);
});
 
// ── Munculkan title terakhir ──
setTimeout(() => title.classList.add('visible'), 2750);

