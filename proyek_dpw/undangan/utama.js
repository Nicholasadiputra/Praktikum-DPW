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

  // Reset semua button ke default
  document.querySelectorAll('.attendance-btn').forEach(b => {
    b.classList.remove('bg-green-500', 'bg-red-700', 'text-white', 'border-green-500', 'border-red-700');
    b.classList.add('bg-transparent', 'text-[#321E04]', 'border-[#8F7D65]');
  });

  // Apply warna ke button yang dipilih
  if (val === 'present') {
    el.classList.remove('bg-transparent', 'text-[#321E04]', 'border-[#8F7D65]');
    el.classList.add('bg-green-500', 'text-white', 'border-green-500');
  } else {
    el.classList.remove('bg-transparent', 'text-[#321E04]', 'border-[#8F7D65]');
    el.classList.add('bg-red-700', 'text-white', 'border-red-700');
  }
}

function selectCategory(val, el) {
    document.getElementById('category-val').value = val;
    
    // Tentukan kuota default
    const paxValue = (val === 'family') ? 4 : 2;
    document.getElementById('pax-val').value = paxValue;

    document.querySelectorAll('.category-btn').forEach(b => {
        b.classList.remove('bg-[#8F7D65]/40', 'text-white');
    });
    el.classList.add('bg-[#8F7D65]/40');
}

document.getElementById('rsvp-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const status = document.getElementById('form-status');

    const nama = this.name.value.trim();
    const attendance = document.getElementById('attendance-val').value;
    const category = document.getElementById('category-val').value;
    const message = this.message.value.trim();
    
    // Ambil nilai pax dari hidden input
    let pax = document.getElementById('pax-val').value;

    if (!nama || !attendance || !category) {
        status.textContent = 'Mohon lengkapi semua field.';
        status.className = 'text-center text-sm font-jost text-red-600 mt-4';
        status.classList.remove('hidden');
        return;
    }

    // Set nilai ke 0 jika tidak hadir
    if (attendance !== 'present') {
        pax = 0; 
    }

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('kehadiran', attendance === 'present' ? 'Hadir' : 'Tidak Hadir');
    formData.append('kategori', category === 'family' ? 'Keluarga' : 'Teman');
    formData.append('pax', pax); 
    formData.append('pesan', message);

    try {
        const response = await fetch('proses_rsvp.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.status === 'success') {
            status.textContent = result.message;
            status.className = 'text-center text-sm font-jost text-green-700 mt-4';
            this.reset();
            
            // Reset tampilan dan nilai hidden
            document.querySelectorAll('.attendance-btn, .category-btn').forEach(b => {
                b.classList.remove('bg-green-500', 'bg-red-700', 'text-white', 'border-green-500', 'border-red-700', 'bg-[#8F7D65]/40');
                if (b.classList.contains('attendance-btn')) {
                    b.classList.add('bg-transparent', 'text-[#321E04]', 'border-[#8F7D65]');
                }
            });
            document.getElementById('attendance-val').value = '';
            document.getElementById('category-val').value = '';
            document.getElementById('pax-val').value = '';
        } else {
            status.textContent = result.message;
            status.className = 'text-center text-sm font-jost text-red-600 mt-4';
        }
    } catch (error) {
        status.textContent = 'Terjadi kesalahan jaringan.';
        status.className = 'text-center text-sm font-jost text-red-600 mt-4';
    }
    status.classList.remove('hidden');
});

// 1. Inisialisasi Navigasi Smooth Scroll
document.querySelectorAll('a[href="#login"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById('login');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// 2. Fungsi Login dan Aktivasi Multimedia
function doLogin() {
    const user = document.getElementById('inputUser').value;
    const pass = document.getElementById('inputPass').value;
    const music = document.getElementById('bgMusic');

    if (user.trim() !== "" && pass.trim() !== "") {
        // Memicu audio dan menyimpan status sesi sebelum pindah halaman
        if (music) {
            music.play().then(() => {
                sessionStorage.setItem('musicPlaying', 'true');
            }).catch(error => {
                console.log("Autoplay dicegah peramban, status tetap disimpan.");
                sessionStorage.setItem('musicPlaying', 'true');
            });
        }

        // Delay singkat untuk memastikan proses audio dimulai sebelum navigasi
        setTimeout(() => {
            window.location.href = "utama.php";
        }, 150);
    } else {
        // Feedback jika input kosong
        const loginGlass = document.querySelector('.login__glass');
        if (loginGlass) {
            loginGlass.classList.add('shake');
            setTimeout(() => loginGlass.classList.remove('shake'), 400);
        }
        document.getElementById('inputUser').focus();
    }
}

// 3. Listener Tombol Enter pada Input Form
document.querySelectorAll('.login__input').forEach(function(el) {
    el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') doLogin();
    });
});

// 4. Kontrol Tombol Musik Melayang (Music Toggle)
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');

if (musicBtn && music) {
    musicBtn.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            musicIcon.classList.replace('fa-play', 'fa-pause');
            musicBtn.classList.add('playing');
            sessionStorage.setItem('musicPlaying', 'true');
        } else {
            music.pause();
            musicIcon.classList.replace('fa-pause', 'fa-play');
            musicBtn.classList.remove('playing');
            sessionStorage.setItem('musicPlaying', 'false');
        }
    });
}

// 5. Scroll Reveal Animation (Intersection Observer)
const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
});
