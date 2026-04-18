<?php

session_start();

// Jika sudah login, langsung redirect ke dashboard
if (!empty($_SESSION['admin_id'])) {
    header('Location: index.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/config/database.php';

    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username && $password) {
        $pdo  = getDB();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND role = 'admin' LIMIT 1");
        $stmt->execute([$username]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($password, $admin['password'])) {
            $_SESSION['login']      = true;
            $_SESSION['admin_id']   = $admin['id'];
            $_SESSION['admin_nama'] = $admin['nama'];
            $_SESSION['admin_user'] = $admin['username'];
            $_SESSION['role']       = 'admin';
            header('Location: index.php');
            exit;
        } else {
            $error = 'Username atau password salah.';
        }
    } else {
        $error = 'Username dan password wajib diisi.';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Nicholas & Nahda — Login Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f0ea 0%, #e8ddd0 100%);
      display: flex; align-items: center; justify-content: center;
      font-family: 'DM Sans', sans-serif;
    }
    .card {
      background: #fff;
      border-radius: 20px;
      padding: 48px 40px 40px;
      width: 100%; max-width: 420px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.10);
      text-align: center;
    }
    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 22px; color: #3d2c1e;
      letter-spacing: 2px; line-height: 1.4;
      margin-bottom: 4px;
    }
    .sub { font-size: 13px; color: #9e8878; margin-bottom: 32px; }
    .form-group { text-align: left; margin-bottom: 18px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: #5a4536; margin-bottom: 6px; }
    .form-group input {
      width: 100%; padding: 12px 16px;
      border: 1.5px solid #e0d5c8; border-radius: 10px;
      font-size: 14px; font-family: 'DM Sans', sans-serif;
      color: #3d2c1e; outline: none;
      background: #faf8f5; transition: border-color .2s;
    }
    .form-group input:focus { border-color: #8F7D65; }
    .btn {
      width: 100%; padding: 13px;
      background: #3d2c1e; color: #fff;
      border: none; border-radius: 10px;
      font-size: 15px; font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer; margin-top: 6px;
      transition: background .2s;
    }
    .btn:hover { background: #5a4536; }
    .error {
      background: #fdecea; color: #c0392b;
      border-radius: 8px; padding: 10px 14px;
      font-size: 13px; margin-bottom: 18px;
    }
  </style>
</head>
<body>
<div class="card">
  <div class="logo">NICHOLAS<br>&amp; NAHDA</div>
  <div class="sub">Admin Dashboard</div>

  <?php if ($error): ?>
    <div class="error"><?= htmlspecialchars($error) ?></div>
  <?php endif; ?>

  <form method="POST" action="login.php">
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" id="username" name="username"
             value="<?= htmlspecialchars($_POST['username'] ?? '') ?>"
             placeholder="Masukkan username" autocomplete="username" required/>
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" name="password"
             placeholder="Masukkan password" autocomplete="current-password" required/>
    </div>
    <button type="submit" class="btn">Masuk</button>
  </form>
</div>
</body>
</html>