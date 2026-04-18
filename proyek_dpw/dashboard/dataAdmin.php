<?php

require_once __DIR__ . '/auth_check.php';
require_once __DIR__ . '/config/database.php';

$pdo = getDB();
$msg = ''; $msgType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action   = $_POST['action']   ?? '';
    $id       = (int)($_POST['id'] ?? 0);
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $role     = $_POST['role'] ?? 'tamu';

    if ($action === 'tambah') {
        if (!$username || !$password) {
            $msg = 'Username dan password wajib diisi.'; $msgType = 'error';
        } else {
            $cek = $pdo->prepare('SELECT id FROM users WHERE username = ?');
            $cek->execute([$username]);
            if ($cek->fetch()) {
                $msg = 'Username sudah digunakan.'; $msgType = 'error';
            } else {
                $hash = password_hash($password, PASSWORD_BCRYPT);
                $pdo->prepare('INSERT INTO users (username, password, role) VALUES (?,?,?)')->execute([$username, $hash, $role]);
                $msg = 'Akun berhasil ditambahkan.'; $msgType = 'success';
            }
        }
    } elseif ($action === 'edit') {
        if (!$username) { $msg = 'Username wajib diisi.'; $msgType = 'error'; }
        else {
            $cek = $pdo->prepare('SELECT id FROM users WHERE username = ? AND id != ?');
            $cek->execute([$username, $id]);
            if ($cek->fetch()) { $msg = 'Username sudah digunakan.'; $msgType = 'error'; }
            else {
                if ($password) {
                    $hash = password_hash($password, PASSWORD_BCRYPT);
                    $pdo->prepare('UPDATE users SET username=?, password=?, role=? WHERE id=?')->execute([$username, $hash, $role, $id]);
                } else {
                    $pdo->prepare('UPDATE users SET username=?, role=? WHERE id=?')->execute([$username, $role, $id]);
                }
                $msg = 'Akun berhasil diperbarui.'; $msgType = 'success';
            }
        }
    } elseif ($action === 'hapus') {
        if ($id == (int)$_SESSION['user_id']) { $msg = 'Tidak bisa hapus akun sendiri.'; $msgType = 'error'; }
        else { $pdo->prepare('DELETE FROM users WHERE id=?')->execute([$id]); $msg = 'Akun berhasil dihapus.'; $msgType = 'success'; }
    }
}

$users = $pdo->query('SELECT id, username, role, created_at FROM users ORDER BY role ASC, id ASC')->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Nicholas & Nahda — Data Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="dashboard.css"/>
  <style>
    .table-card{background:#fff;border-radius:16px;box-shadow:0 2px 16px rgba(0,0,0,.07);padding:24px}
    .toolbar{display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap}
    .toolbar h2{flex:1;font-size:17px;font-weight:600;color:#3d2c1e}
    .btn{padding:9px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:'DM Sans',sans-serif}
    .btn-primary{background:#3d2c1e;color:#fff}.btn-primary:hover{background:#5a4536}
    .btn-outline{background:#fff;color:#3d2c1e;border:1.5px solid #c5b49f}.btn-outline:hover{background:#f5f0ea}
    .btn-danger{background:#e05a52;color:#fff}.btn-danger:hover{background:#c0392b}
    .btn-sm{padding:6px 12px;font-size:12px}
    table{width:100%;border-collapse:collapse}
    thead th{padding:12px 14px;text-align:left;font-size:12px;font-weight:600;color:#8F7D65;text-transform:uppercase;letter-spacing:.5px;border-bottom:1.5px solid #f0e8dc}
    tbody td{padding:12px 14px;font-size:14px;color:#3d2c1e;border-bottom:1px solid #f5f0ea;vertical-align:middle}
    tbody tr:last-child td{border-bottom:none}
    .actions{display:flex;gap:8px}
    .modal-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:999;align-items:center;justify-content:center}
    .modal-backdrop.open{display:flex}
    .modal{background:#fff;border-radius:16px;padding:32px 28px 24px;width:100%;max-width:420px;box-shadow:0 8px 40px rgba(0,0,0,.15)}
    .modal h2{font-family:'Playfair Display',serif;font-size:20px;color:#3d2c1e;margin-bottom:20px}
    .form-group{margin-bottom:16px}
    .form-group label{display:block;font-size:13px;font-weight:600;color:#5a4536;margin-bottom:6px}
    .form-group input,.form-group select{width:100%;padding:10px 14px;border:1.5px solid #e0d5c8;border-radius:8px;font-size:14px;font-family:'DM Sans',sans-serif;color:#3d2c1e;outline:none;background:#faf8f5}
    .form-group input:focus,.form-group select:focus{border-color:#8F7D65}
    .form-group small{color:#9e8878;font-size:12px}
    .modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}
    .notif{padding:12px 16px;border-radius:10px;font-size:13px;margin-bottom:20px}
    .notif.success{background:#e8f5e9;color:#2e7d32}.notif.error{background:#fdecea;color:#c0392b}
    .badge-role-admin{background:#e8f0fe;color:#3d5afe;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600}
    .badge-role-tamu{background:#f3e5f5;color:#6a1b9a;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600}
    .badge-self{background:#fff3e0;color:#b36200;padding:2px 8px;border-radius:20px;font-size:11px;margin-left:6px}
  </style>
</head>
<body>
<button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
<div class="overlay" id="overlay"></div>

<aside class="sidebar" id="sidebar">
  <div class="sidebar-logo">NICHOLAS<br>&amp;<br>NAHDA</div>
  <nav class="sidebar-nav">
    <a class="nav-item" href="index.php">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg> Dashboard
    </a>
    <a class="nav-item" href="editLanding.php">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg> Edit Landing Page
    </a>
    <a class="nav-item" href="dataTamu.php">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg> Data Tamu
    </a>
    <a class="nav-item active" href="dataAdmin.php">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4"/>
        <path d="M20 21a8 8 0 10-16 0"/>
      </svg> Data Admin
    </a>
  </nav>
  <a href="logout.php" class="sidebar-logout">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
    </svg> Keluar
  </a>
</aside>

<main class="main">
  <h1 class="page-title">Data Admin</h1>

  <?php if ($msg): ?>
    <div class="notif <?= $msgType ?>"><?= htmlspecialchars($msg) ?></div>
  <?php endif; ?>

  <div class="table-card">
    <div class="toolbar">
      <h2>Kelola Akun</h2>
      <button class="btn btn-primary" onclick="openModal()">+ Tambah Akun</button>
    </div>
    <table>
      <thead>
        <tr><th>#</th><th>Username</th><th>Role</th><th>Dibuat</th><th></th></tr>
      </thead>
      <tbody>
        <?php foreach ($users as $i => $u): ?>
        <tr>
          <td><?= $i + 1 ?></td>
          <td>
            <?= htmlspecialchars($u['username']) ?>
            <?php if ($u['id'] == $_SESSION['user_id']): ?>
              <span class="badge-self">Kamu</span>
            <?php endif; ?>
          </td>
          <td><span class="badge-role-<?= $u['role'] ?>"><?= $u['role'] === 'admin' ? 'Admin' : 'Tamu' ?></span></td>
          <td><?= date('d/m/Y', strtotime($u['created_at'])) ?></td>
          <td>
            <div class="actions">
              <button class="btn btn-outline btn-sm"
                onclick="openEditModal(<?= $u['id'] ?>, '<?= addslashes($u['username']) ?>', '<?= $u['role'] ?>')">Edit</button>
              <?php if ($u['id'] != $_SESSION['user_id']): ?>
              <form method="POST" style="display:inline" onsubmit="return confirm('Hapus akun ini?')">
                <input type="hidden" name="action" value="hapus"/>
                <input type="hidden" name="id" value="<?= $u['id'] ?>"/>
                <button type="submit" class="btn btn-danger btn-sm">Hapus</button>
              </form>
              <?php endif; ?>
            </div>
          </td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($users)): ?>
          <tr><td colspan="5" style="text-align:center;padding:24px;color:#999">Belum ada akun.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</main>

<!-- Modal Tambah -->
<div class="modal-backdrop" id="modalTambah">
  <div class="modal">
    <h2>Tambah Akun</h2>
    <form method="POST">
      <input type="hidden" name="action" value="tambah"/>
      <div class="form-group">
        <label>Username</label>
        <input type="text" name="username" placeholder="Contoh: tiara2025" required/>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" name="password" placeholder="Minimal 6 karakter" required/>
      </div>
      <div class="form-group">
        <label>Role</label>
        <select name="role">
          <option value="tamu">Tamu (login ke halaman undangan)</option>
          <option value="admin">Admin (login ke dashboard)</option>
        </select>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" onclick="closeModal('modalTambah')">Batal</button>
        <button type="submit" class="btn btn-primary">Simpan</button>
      </div>
    </form>
  </div>
</div>

<!-- Modal Edit -->
<div class="modal-backdrop" id="modalEdit">
  <div class="modal">
    <h2>Edit Akun</h2>
    <form method="POST">
      <input type="hidden" name="action" value="edit"/>
      <input type="hidden" name="id" id="editId"/>
      <div class="form-group">
        <label>Username</label>
        <input type="text" name="username" id="editUsername" required/>
      </div>
      <div class="form-group">
        <label>Password Baru <small>(kosongkan jika tidak ingin ganti)</small></label>
        <input type="password" name="password" placeholder="Kosongkan jika tidak diganti"/>
      </div>
      <div class="form-group">
        <label>Role</label>
        <select name="role" id="editRole">
          <option value="tamu">Tamu (login ke halaman undangan)</option>
          <option value="admin">Admin (login ke dashboard)</option>
        </select>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" onclick="closeModal('modalEdit')">Batal</button>
        <button type="submit" class="btn btn-primary">Simpan</button>
      </div>
    </form>
  </div>
</div>

<script>
function openModal() { document.getElementById('modalTambah').classList.add('open'); }
function openEditModal(id, username, role) {
  document.getElementById('editId').value       = id;
  document.getElementById('editUsername').value = username;
  document.getElementById('editRole').value     = role;
  document.getElementById('modalEdit').classList.add('open');
}
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-backdrop').forEach(el => {
  el.addEventListener('click', e => { if (e.target === el) el.classList.remove('open'); });
});
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
document.getElementById('hamburger')?.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('open'); });
overlay?.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); });
</script>
</body>
</html>