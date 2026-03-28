/* ============================================================
   DASHBOARD.JS — Nicholas & Nahda Wedding
   Features:
   - Navbar toggle (mobile)
   - Countdown timer to wedding date
   - RSVP button group toggling
   - Smooth scroll
   - Scroll-triggered fade-in animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     1. NAVBAR MOBILE TOGGLE
     ============================================= */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      // Animate hamburger → X
      navToggle.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // Navbar background opacity on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.background = 'rgba(30, 10, 0, 0.97)';
    } else {
      navbar.style.background = 'rgba(50, 30, 4, 0.85)';
    }
  });


  /* =============================================
     2. COUNTDOWN TIMER
     ============================================= */
  const weddingDate = new Date('2026-12-05T09:30:00').getTime();

  const daysEl    = document.getElementById('days');
  const hoursEl   = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const now  = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
      if (daysEl)    daysEl.textContent    = '00';
      if (hoursEl)   hoursEl.textContent   = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl)    daysEl.textContent    = pad(days);
    if (hoursEl)   hoursEl.textContent   = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* =============================================
     3. RSVP TOGGLE BUTTONS
     ============================================= */
  function bindToggleGroup(ids) {
    ids.forEach(id => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        // Remove active from siblings in same group
        ids.forEach(otherId => {
          const other = document.getElementById(otherId);
          if (other) other.classList.remove('active');
        });
        btn.classList.add('active');
      });
    });
  }

  // Attendance toggle
  bindToggleGroup(['btnPresent', 'btnAbsent']);
  // Category toggle
  bindToggleGroup(['btnFamily', 'btnFriends']);

  // RSVP form submission
  const rsvpSubmit = document.querySelector('.rsvp-submit');
  if (rsvpSubmit) {
    rsvpSubmit.addEventListener('click', () => {
      const nameInput = document.querySelector('.rsvp-field input');
      const name      = nameInput ? nameInput.value.trim() : '';
      const attendance = document.querySelector('.rsvp-choice.active');
      const attendanceText = attendance ? attendance.textContent : '';

      if (!name) {
        alert('Mohon isi nama Anda terlebih dahulu.');
        return;
      }

      // Show confirmation toast
      showToast(`Terima kasih, ${name}! Konfirmasi kehadiran berhasil dikirim. 💌`);

      // Reset form
      document.querySelectorAll('.rsvp-field input, .rsvp-field textarea').forEach(el => {
        el.value = '';
      });
      document.querySelectorAll('.rsvp-choice').forEach(btn => btn.classList.remove('active'));
      document.getElementById('btnPresent')?.classList.add('active');
    });
  }


  /* =============================================
     4. TOAST NOTIFICATION
     ============================================= */
  function showToast(message) {
    let toast = document.getElementById('rsvpToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'rsvpToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(80px);
        background: #321E04;
        color: #F5EFE0;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.75rem;
        letter-spacing: 1px;
        padding: 16px 28px;
        border-radius: 4px;
        box-shadow: 0 8px 32px rgba(50,30,4,0.35);
        z-index: 9999;
        transition: transform 0.4s ease, opacity 0.4s ease;
        opacity: 0;
        max-width: 90vw;
        text-align: center;
        border-left: 3px solid #C9A84C;
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    // Slide in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Slide out after 4s
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(80px)';
    }, 4000);
  }


  /* =============================================
     5. SCROLL FADE-IN ANIMATION
     ============================================= */
  const fadeTargets = document.querySelectorAll(
    '.beginning, .save-date, .venue, .countdown-section, ' +
    '.timeline-section, .dresscode, .story, .gallery-section, ' +
    '.rsvp, .thankyou, .gallery-card, .gs-item, .tl-event, ' +
    '.venue-grid, .ty-grid, .story-grid, .dresscode-grid, .beginning-grid'
  );

  // Apply initial hidden state via JS (so non-JS browsers still see content)
  fadeTargets.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeTargets.forEach(el => observer.observe(el));


  /* =============================================
     6. DRESS CODE CAROUSEL DOTS
     ============================================= */
  const dots = document.querySelectorAll('.dc-dots .dot');
  const dcImages = document.querySelectorAll('.dc-img');

  if (dots.length > 0) {
    let currentDot = 0;

    function activateDot(index) {
      dots.forEach(d => d.classList.remove('active'));
      dots[index]?.classList.add('active');
      currentDot = index;
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => activateDot(i));
    });

    // Auto-rotate every 3s
    setInterval(() => {
      const next = (currentDot + 1) % dots.length;
      activateDot(next);
    }, 3000);
  }


  /* =============================================
     7. GALLERY SCROLL — mouse drag support
     ============================================= */
  const scrollWrap = document.querySelector('.gallery-scroll-wrap');
  if (scrollWrap) {
    let isDown   = false;
    let startY   = 0;
    let scrollTop = 0;

    scrollWrap.addEventListener('mousedown', e => {
      isDown    = true;
      startY    = e.pageY - scrollWrap.offsetTop;
      scrollTop = scrollWrap.scrollTop;
      scrollWrap.style.cursor = 'grabbing';
    });

    scrollWrap.addEventListener('mouseleave', () => {
      isDown = false;
      scrollWrap.style.cursor = 'default';
    });

    scrollWrap.addEventListener('mouseup', () => {
      isDown = false;
      scrollWrap.style.cursor = 'default';
    });

    scrollWrap.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const y     = e.pageY - scrollWrap.offsetTop;
      const walk  = (y - startY) * 1.2;
      scrollWrap.scrollTop = scrollTop - walk;
    });
  }


  /* =============================================
     8. SMOOTH SCROLL (fallback for older browsers)
     ============================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 64; // navbar height
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* =============================================
     9. PLACEHOLDER IMAGE FALLBACK
        (shows a styled placeholder when img fails to load)
     ============================================= */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      const label = this.alt || 'Foto';
      this.style.display = 'none';

      // Create placeholder div
      const ph = document.createElement('div');
      ph.style.cssText = `
        width: 100%; height: 100%;
        min-height: 120px;
        background: linear-gradient(135deg, #8B6914 0%, #5C3D11 50%, #321E04 100%);
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        color: rgba(245,239,224,0.6);
        font-family: 'Montserrat', sans-serif;
        font-size: 0.55rem;
        letter-spacing: 2px;
        text-transform: uppercase;
        text-align: center;
        border-radius: inherit;
        gap: 8px;
      `;
      ph.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="m21 15-5-5L5 21"/>
        </svg>
        <span>${label}</span>
      `;

      if (this.parentNode) {
        this.parentNode.style.position = 'relative';
        this.parentNode.insertBefore(ph, this.nextSibling);
      }
    });
  });

});