<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Nicholas & Nahda — Data Tamu</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="dataTamu.css"/>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="dataTamu.js" defer></script>
</head>
<body>

<button class="hamburger" id="hamburger" aria-label="Menu">
  <span></span><span></span><span></span>
</button>
<div class="overlay" id="overlay"></div>

<aside class="sidebar" id="sidebar">
  <div class="sidebar-logo">NICHOLAS<br>&amp;<br>NAHDA</div>
  <nav class="sidebar-nav">
    <a class="nav-item" href="index.php">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
      Dashboard
    </a>
    <a class="nav-item" href="editLanding.html">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
      Edit Landing Page
    </a>
    <a class="nav-item active" href="dataTamu.html">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
      Data Tamu
    </a>
  </nav>
  <div class="sidebar-logout">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
    </svg>
    Keluar
  </div>
</aside>

<main class="main">
  <h1 class="page-title">Data Tamu</h1>

  <div class="table-card">
    <div class="toolbar">
      <div class="search-wrap">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input type="text" id="searchInput" placeholder="Cari Nama Tamu…" />
      </div>
      <button class="btn btn-outline" onclick="downloadExcel()">Download Excel</button>
      <button class="btn btn-primary" onclick="openModal()">Tambah Tamu</button>
    </div>

    <div class="table-wrap">
      <table id="tamuTable">
        <thead>
          <tr>
            <th>Nama Tamu</th>
            <th>Kategori</th>
            <th>Pax</th>
            <th>Status</th>
            <th>Ucapan</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="tamuBody"></tbody>
      </table>
    </div>

    <div class="pagination" id="pagination"></div>
  </div>
</main>

<!-- Modal Tambah/Edit Tamu -->
<div class="modal-backdrop" id="modalBackdrop">
  <div class="modal">
    <h2 id="modalTitle">Tambah Tamu</h2>
    <div class="form-group">
      <label>Nama Tamu</label>
      <input type="text" id="fNama" placeholder="Contoh: Andi Saputra" />
    </div>
    <div class="form-group">
      <label>Kategori</label>
      <select id="fKategori">
        <option value="Keluarga">Keluarga</option>
        <option value="Teman">Teman</option>
        <option value="Rekan">Rekan</option>
      </select>
    </div>
    <div class="form-group">
      <label>Pax</label>
      <input type="number" id="fPax" placeholder="Jumlah tamu" min="1" />
    </div>
    <div class="form-group">
      <label>Status</label>
      <select id="fStatus">
        <option value="Hadir">Hadir</option>
        <option value="Tidak Hadir">Tidak Hadir</option>
        <option value="Menunggu">Menunggu Respon</option>
      </select>
    </div>
    <div class="form-group">
      <label>Ucapan</label>
      <input type="text" id="fUcapan" placeholder="Ucapan dari tamu" />
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="saveTamu()">Simpan</button>
    </div>
  </div>
</div>
</body>
</html>