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
function selectAttendance(val, el) {
  document.getElementById('attendance-val').value = val;
  document.querySelectorAll('.attendance-btn').forEach(b => {
      b.classList.remove('ring-2', 'ring-[#321E04]');
  });
  el.classList.add('ring-2', 'ring-[#321E04]');
}

function selectCategory(val, el) {
  document.getElementById('category-val').value = val;
  document.querySelectorAll('.category-btn').forEach(b => {
      b.classList.remove('bg-[#8F7D65]/40', 'text-white');
  });
  el.classList.add('bg-[#8F7D65]/40');
}

document.getElementById('rsvp-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const status = document.getElementById('form-status');

    const nama      = this.name.value.trim();
    const attendance = document.getElementById('attendance-val').value;
    const category  = document.getElementById('category-val').value;
    const message   = this.message.value.trim();

    if (!nama || !attendance || !category) {
        status.textContent = 'Mohon lengkapi semua field.';
        status.className = 'text-center text-sm font-jost text-red-600';
        status.classList.remove('hidden');
        return;
    }

    // Ambil data tamu yang sudah ada
    const existing = JSON.parse(localStorage.getItem('tamus') || '[]');
    const nextId   = existing.length ? Math.max(...existing.map(t => t.id)) + 1 : 1;

    // Sesuaikan format dengan admin
    const newTamu = {
        id:        nextId,
        nama:      nama,
        kategori:  category === 'family' ? 'Keluarga' : 'Teman',
        pax:       null,
        status:    attendance === 'present' ? 'Hadir' : 'Tidak Hadir',
        ucapan:    message
    };

    existing.push(newTamu);
    localStorage.setItem('tamus', JSON.stringify(existing));

    status.textContent = 'Terima kasih! Konfirmasi kamu sudah terkirim.';
    status.className = 'text-center text-sm font-jost text-green-700';
    status.classList.remove('hidden');
    this.reset();
    document.getElementById('attendance-val').value = '';
    document.getElementById('category-val').value   = '';
});