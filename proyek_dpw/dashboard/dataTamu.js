document.addEventListener('DOMContentLoaded', () => {
  const API      = 'api/tamu_api.php';
  const PER_PAGE = 10;
  let currentPage = 1;
  let totalPages  = 1;
  let editingId   = null;
  let allData     = [];

  window.autoSetPax = function(kategori) {
    document.getElementById('fPax').value = kategori === 'Family' ? 4 : 2;
  };

  async function loadTamu() {
    const q   = document.getElementById('searchInput').value.trim();
    const url = `${API}?page=${currentPage}&limit=${PER_PAGE}&search=${encodeURIComponent(q)}`;

    try {
      const res  = await fetch(url, { credentials: 'same-origin' });
      if (res.status === 401) { window.location.href = '../undangan/index.php'; return; }
      const json = await res.json();

      totalPages = json.totalPages ?? 1;
      allData    = json.data ?? [];
      renderTable(allData);
      renderPagination(json.total ?? 0);
    } catch (e) { console.error('Gagal muat data:', e); }
  }

  function statusBadge(s) {
    if (s === 'Hadir')       return `<span class="badge badge-hadir">Hadir</span>`;
    if (s === 'Tidak Hadir') return `<span class="badge badge-tidak">Tidak Hadir</span>`;
    return `<span class="badge badge-tunggu">Menunggu</span>`;
  }

  function kategoriBadge(k) {
    const val = k.toLowerCase();
    if (val === 'keluarga' || val === 'family') {
      return `<span class="badge badge-keluarga">Keluarga</span>`;
    }
    if (val === 'teman' || val === 'friends') {
      return `<span class="badge badge-teman">Teman</span>`;
    }
    return `<span class="badge badge-teman">${k}</span>`;
  }

  function renderTable(rows) {
    const tbody = document.getElementById('tamuBody');
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:#999">Belum ada data tamu.</td></tr>`;
      return;
    }
    tbody.innerHTML = rows.map(t => `
      <tr>
        <td>${t.nama}</td>
        <td>${kategoriBadge(t.kategori)}</td>
        <td>${t.pax ?? '—'}</td>
        <td>${statusBadge(t.status)}</td>
        <td class="ucapan-text">${t.ucapan ? `"${t.ucapan.length > 22 ? t.ucapan.slice(0,22)+'…' : t.ucapan}"` : '—'}</td>
        <td>
          <div class="actions">
            <button class="action-btn action-edit"  onclick="editTamu(${t.id})"   title="Edit">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
            <button class="action-btn action-delete" onclick="deleteTamu(${t.id})" title="Hapus">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function renderPagination(total) {
    const pg = document.getElementById('pagination');
    pg.innerHTML = '';

    const info = document.createElement('span');
    info.className   = 'page-info';
    info.textContent = `Total: ${total} tamu`;
    pg.appendChild(info);

    for (let i = 1; i <= totalPages; i++) {
      const b = document.createElement('button');
      b.className   = 'page-btn' + (i === currentPage ? ' active' : '');
      b.textContent = i;
      b.onclick     = () => { currentPage = i; loadTamu(); };
      pg.appendChild(b);
    }
  }

  document.getElementById('searchInput').addEventListener('input', () => {
    currentPage = 1; loadTamu();
  });

    // Fungsi untuk menyembunyikan/menampilkan field Pax berdasarkan Status
  window.togglePaxByStatus = function(status) {
      const paxGroup = document.getElementById('paxGroup'); // Container div di HTML
      const fPax = document.getElementById('fPax');
      const kategori = document.getElementById('fKategori').value;

      if (status === 'Tidak Hadir') {
          if (paxGroup) paxGroup.style.display = 'none';
          fPax.value = 0;
      } else {
          if (paxGroup) paxGroup.style.display = 'block';
          // Set ulang nilai berdasarkan kategori yang sedang terpilih
          fPax.value = (kategori === 'Family') ? 4 : 2;
      }
  };

  // Update fungsi autoSetPax agar mempertimbangkan status saat ini
  window.autoSetPax = function(kategori) {
      const fPax = document.getElementById('fPax');
      const status = document.getElementById('fStatus').value;
      
      if (status === 'Hadir') {
          fPax.value = (kategori === 'Family') ? 4 : 2;
      } else {
          fPax.value = 0;
      }
  };

  window.openModal = function(id = null) {
      editingId = id;
      const modalTitle = document.getElementById('modalTitle');
      modalTitle.textContent = id ? 'Edit Tamu' : 'Tambah Tamu';

      // 1. Reset Form ke Default
      document.getElementById('fNama').value     = '';
      document.getElementById('fKategori').value = 'Family';
      document.getElementById('fStatus').value   = 'Hadir';
      document.getElementById('fUcapan').value   = '';
      document.getElementById('fPax').value      = '4';

      if (id) {
          // 2. Mode EDIT: Ambil data dari allData
          const t = allData.find(x => x.id == id);
          if (t) {
              document.getElementById('fNama').value = t.nama;
              
              // Sinkronisasi Kategori (DB: Keluarga/Teman -> UI: Family/Friend)
              const kategoriUI = (t.kategori === 'Keluarga') ? 'Family' : 'Friend';
              document.getElementById('fKategori').value = kategoriUI;
              
              document.getElementById('fStatus').value = t.status;
              document.getElementById('fUcapan').value = t.ucapan ?? '';
              document.getElementById('fPax').value    = t.pax ?? 0;

              // Jalankan toggle untuk menyesuaikan tampilan field Pax
              togglePaxByStatus(t.status);
          }
      } else {
          // 3. Mode TAMBAH: Pastikan tampilan default konsisten
          togglePaxByStatus('Hadir');
      }

      document.getElementById('modalBackdrop').classList.add('open');
  };

  window.closeModal = function() {
    document.getElementById('modalBackdrop').classList.remove('open');
  };

  window.saveTamu = async function() {
    const nama        = document.getElementById('fNama').value.trim();
    const kategoriRaw = document.getElementById('fKategori').value;
    const kategori = kategoriRaw === 'Family' ? 'Keluarga' : 'Teman';
    const pax = document.getElementById('fPax').value !== '' ? parseInt(document.getElementById('fPax').value) : null;
    const status      = document.getElementById('fStatus').value;
    const ucapan      = document.getElementById('fUcapan').value.trim();

    if (!nama) { alert('Nama tamu wajib diisi!'); return; }

    const url    = editingId ? `${API}?id=${editingId}` : API;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res  = await fetch(url, {
        method, credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, kategori, pax, status, ucapan }),
      });
      const json = await res.json();
      if (json.success || json.id) { closeModal(); loadTamu(); }
      else alert(json.error ?? 'Gagal menyimpan.');
    } catch (e) { console.error(e); alert('Terjadi kesalahan.'); }
  };

  window.editTamu   = function(id) { openModal(id); };

  window.deleteTamu = async function(id) {
    if (!confirm('Hapus tamu ini?')) return;
    try {
      const res  = await fetch(`${API}?id=${id}`, { method: 'DELETE', credentials: 'same-origin' });
      const json = await res.json();
      if (json.success) loadTamu();
      else alert(json.error ?? 'Gagal menghapus.');
    } catch (e) { console.error(e); }
  };

  window.downloadExcel = async function() {
    try {
      const res   = await fetch(`${API}?page=1&limit=9999`, { credentials: 'same-origin' });
      const json  = await res.json();
      const tamus = json.data ?? [];

      const rows = [['Nama Tamu','Kategori','Pax','Status','Ucapan']];
      tamus.forEach(t => rows.push([t.nama, t.kategori, t.pax ?? '', t.status, t.ucapan ?? '']));

      const csv  = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const a    = Object.assign(document.createElement('a'), {
        href: URL.createObjectURL(blob), download: 'data-tamu-nicholas-nahda.csv'
      });
      a.click();
    } catch (e) { console.error(e); }
  };

  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('overlay');
  const hamburger = document.getElementById('hamburger');
  hamburger?.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('open'); });
  overlay?.addEventListener('click',   () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); });

  document.getElementById('modalBackdrop')?.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  loadTamu();
});