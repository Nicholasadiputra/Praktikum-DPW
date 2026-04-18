// 1. Smooth Scroll ke #login
document.querySelectorAll('a[href="#login"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('login')?.scrollIntoView({ behavior: 'smooth' });
    });
});

// 2. Fungsi Login
async function doLogin() {
    const user = document.getElementById('inputUser').value.trim();
    const pass = document.getElementById('inputPass').value.trim();

    // Kalau username = admin, cek ke database
    if (user === 'admin') {
        const formData = new FormData();
        formData.append('user', user);
        formData.append('pass', pass);

        try {
            const response = await fetch('proses_login.php', { method: 'POST', body: formData });
            const result   = await response.json();
            if (result.status === 'success') {
                window.location.href = result.redirect;
            } else {
                alert(result.message ?? 'Login gagal.');
                triggerShake();
            }
        } catch (error) {
            alert('Gagal memproses. Cek Console (F12).');
        }
        return;
    }

    // Selain admin → langsung masuk sebagai tamu
    const fd = new FormData();
    fd.append('guest', '1');
    const res = await fetch('proses_login.php', { method: 'POST', body: fd });
    const text = await res.text();
    console.log('Response tamu:', text); // tambah ini sementara
    window.location.href = 'utama.php';
}

function triggerShake() {
    const el = document.querySelector('.login__glass');
    if (!el) return;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 400);
}

// 3. Enter pada input → login
document.querySelectorAll('.login__input').forEach(el => {
    el.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
});

// 4. Kontrol musik melayang
const music     = document.getElementById('bgMusic');
const musicBtn  = document.getElementById('musicToggle');
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

// 5. Scroll Reveal
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));