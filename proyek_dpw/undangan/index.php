<?php
$nama_tamu = "Tiara";
$tagline = "Our Love Story Awaits";
$pesan_selamat_datang = "Welcome to our wedding invitation page. We would be honored to have your presence and blessings on our special day.";
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Nicholas & Nahda – Wedding Invitation</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
    <link rel="stylesheet" href="style.css"/>
    <script src="script.js" defer></script>
</head>
<body>
<!-- HERO -->
<section class="hero" id="top">
    <div class="hero__bg-placeholder"></div>
    <img class="hero__bg" src="images/hero-bg.jpg" alt="Nicholas & Nahda" onerror="this.style.display='none'"/>
    <div class="hero__overlay"></div>
    <div class="hero__content">
        <div class="hero__names">
        <span class="hero__name">Nicholas</span>
        <span class="hero__amp">&amp;</span>
        <span class="hero__name">Nahda</span>
        </div>
        <div class="hero__card">
        <p class="hero__card-text">Together with our families, we invite you to<br>share in the joy of our wedding celebration.</p>
        <p class="hero__card-to">to <strong><?php echo $nama_tamu; ?></strong></p>
        </div>
</div>
</section>

<!-- INVITATION -->
<section class="invitation">
    <div class="invitation__inner">
        <div class="invitation__photo reveal">
            <img src="images/foto1.jpg" alt="Couple" onerror="this.style.display='none';document.getElementById('pFallback').style.display='flex'"/>
            <div class="invitation__photo-placeholder" id="pFallback" style="display:none;">foto2.jpg</div>
        </div>

        <div class="invitation__text">
            <div class="inv-label reveal" style="transition-delay:.07s">Wedding Invitation</div>
            <h2 class="inv-heading reveal" style="transition-delay:.13s">Hey Tiara</h2>
            <p class="inv-body reveal"><?php echo $pesan_selamat_datang; ?></p>
            <div class="inv-ornament reveal" style="transition-delay:.25s">
                <span class="inv-ornament__dot"></span>
                <span class="inv-ornament__line"></span>
                <span class="inv-ornament__diamond">◆</span>
                <span class="inv-ornament__line"></span>
                <span class="inv-ornament__dot"></span>
            </div>
                <p class="inv-tagline reveal"><?php echo $tagline; ?></p>
        </div>
    </div>
</section>

<!-- LOGIN -->
<section class="login-section" id="login">
    <div class="login__bg-placeholder"></div>
    <img class="login__bg" src="images/background-landing.jpg" alt="Wedding venue" onerror="this.style.display='none'"/>
    <div class="login__overlay"></div>
    <div class="login__glass">
        <h2 class="login__title">Login</h2>
        <div class="login__field">
            <input class="login__input" type="text" id="inputUser" placeholder="User" autocomplete="username"/>
        </div>
        <div class="login__field">
            <input class="login__input" type="password" id="inputPass" placeholder="Password" autocomplete="current-password"/>
        </div>
        <button class="login__btn" onclick="doLogin()">Login</button>
    </div>
</section>
<button id="musicToggle" class="music-btn">
    <i id="musicIcon" class="fas fa-play"></i>
</button>

<audio id="bgMusic" loop>
    <source src="music/wedding-music1.mp3" type="audio/mpeg">
</audio>
</body>
</html>