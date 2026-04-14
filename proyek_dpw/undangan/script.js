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
async function doLogin() {
    const user = document.getElementById('inputUser').value;
    const pass = document.getElementById('inputPass').value;
    const music = document.getElementById('bgMusic');

    if (user.trim() !== "" && pass.trim() !== "") {
        const formData = new FormData();
        formData.append('user', user);
        formData.append('pass', pass);

        try {
            const response = await fetch('proses_login.php', {
                method: 'POST',
                body: formData
            });
            
            // --- BAGIAN DEBUGGING MULAI ---
            const rawText = await response.text(); // Baca aslinya sebagai teks dulu
            console.log("Balasan dari server:", rawText); // Tampilkan di console F12
            
            const result = JSON.parse(rawText); // Baru ubah ke JSON
            // --- BAGIAN DEBUGGING SELESAI ---

            if (result.status === 'success') {
                if (music) {
                    music.play().then(() => {
                        sessionStorage.setItem('musicPlaying', 'true');
                    }).catch(error => {
                        sessionStorage.setItem('musicPlaying', 'true');
                    });
                }
                setTimeout(() => {
                    window.location.href = "utama.php";
                }, 150);
            } else {
                alert(result.message);
                triggerShake();
            }
        } catch (error) {
            console.error("Detail Error:", error); // Tampilkan error aslinya
            alert('Gagal memproses data server. Cek Console (F12).');
        }
    } else {
        triggerShake();
        document.getElementById('inputUser').focus();
    }
}

function triggerShake() {
    const loginGlass = document.querySelector('.login__glass');
    if (loginGlass) {
        loginGlass.classList.add('shake');
        setTimeout(() => loginGlass.classList.remove('shake'), 400);
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