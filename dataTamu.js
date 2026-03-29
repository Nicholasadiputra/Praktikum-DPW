  /* ── DATA ── */
  const dummyTamus = [
    { id:1, nama:'Andi',  kategori:'Keluarga', pax:4,    status:'Hadir',        ucapan:'Selamat Ya' },
    { id:2, nama:'Budi',  kategori:'Keluarga', pax:4,    status:'Hadir',        ucapan:'Selamat Ya' },
    { id:3, nama:'Citra', kategori:'Teman',    pax:null, status:'Tidak Hadir',  ucapan:'Maaf Jika Tidak Bisa Hadir' },
    { id:4, nama:'Halim', kategori:'Teman',    pax:2,    status:'Hadir',        ucapan:'Semoga Lancar' },
    { id:5, nama:'Dewi',  kategori:'Keluarga', pax:3,    status:'Hadir',        ucapan:'Bahagia Selalu' },
    { id:6, nama:'Rudi',  kategori:'Rekan',    pax:null, status:'Menunggu',     ucapan:'' },
    { id:7, nama:'Sari',  kategori:'Teman',    pax:2,    status:'Hadir',        ucapan:'Selamat Menempuh Hidup Baru' },
    { id:8, nama:'Hasan', kategori:'Keluarga', pax:null, status:'Tidak Hadir',  ucapan:'Maaf Jika Tidak Bisa' },
    { id:9, nama:'Lina',  kategori:'Teman',    pax:1,    status:'Hadir',        ucapan:'Selamat Ya' },
    { id:10,nama:'Doni',  kategori:'Rekan',    pax:null, status:'Menunggu',     ucapan:'' },
    { id:11,nama:'Maya',  kategori:'Keluarga', pax:4,    status:'Hadir',        ucapan:'Semoga Bahagia' },
    { id:12,nama:'Rizky', kategori:'Teman',    pax:2,    status:'Tidak Hadir',  ucapan:'Maaf Tidak Bisa Hadir' },
  ];

  let tamus   = JSON.parse(localStorage.getItem('tamus') || 'null') ?? dummyTamus;
  let nextId  = tamus.length ? Math.max(...tamus.map(t => t.id)) + 1 : 13;

  // Tambah helper sync
  function syncStorage() {
    localStorage.setItem('tamus', JSON.stringify(tamus));
  }

  /* ── RENDER ── */
  function statusBadge(s) {
    if (s === 'Hadir')       return `<span class="badge badge-hadir">Hadir</span>`;
    if (s === 'Tidak Hadir') return `<span class="badge badge-tidak">Tidak Hadir</span>`;
    return `<span class="badge badge-tunggu">Menunggu</span>`;
  }
  function kategoriBadge(k) {
    if (k === 'Keluarga') return `<span class="badge badge-keluarga">Keluarga</span>`;
    if (k === 'Teman')    return `<span class="badge badge-teman">Teman</span>`;
    return `<span class="badge badge-teman">${k}</span>`;
  }

  function render() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    filtered = tamus.filter(t => t.nama.toLowerCase().includes(q));

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;

    const slice = filtered.slice((currentPage-1)*PER_PAGE, currentPage*PER_PAGE);
    const tbody = document.getElementById('tamuBody');
    tbody.innerHTML = slice.map(t => `
      <tr>
        <td>${t.nama}</td>
        <td>${kategoriBadge(t.kategori)}</td>
        <td>${t.pax ?? '—'}</td>
        <td>${statusBadge(t.status)}</td>
        <td class="ucapan-text">${t.ucapan ? `"${t.ucapan.length > 22 ? t.ucapan.slice(0,22)+'…' : t.ucapan}"` : '—'}</td>
        <td>
          <div class="actions">
            <button class="action-btn action-edit" onclick="editTamu(${t.id})" title="Edit">
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

    // pagination
    const pg = document.getElementById('pagination');
    pg.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const b = document.createElement('button');
      b.className = 'page-btn' + (i === currentPage ? ' active' : '');
      b.textContent = i;
      b.onclick = () => { currentPage = i; render(); };
      pg.appendChild(b);
    }
  }

  document.getElementById('searchInput').addEventListener('input', () => { currentPage = 1; render(); });
  render();

  /* ── MODAL ── */
  function openModal(id = null) {
    editingId = id;
    document.getElementById('modalTitle').textContent = id ? 'Edit Tamu' : 'Tambah Tamu';
    if (id) {
      const t = tamus.find(x => x.id === id);
      document.getElementById('fNama').value     = t.nama;
      document.getElementById('fKategori').value = t.kategori;
      document.getElementById('fPax').value      = t.pax ?? '';
      document.getElementById('fStatus').value   = t.status;
      document.getElementById('fUcapan').value   = t.ucapan;
    } else {
      document.getElementById('fNama').value     = '';
      document.getElementById('fKategori').value = 'Keluarga';
      document.getElementById('fPax').value      = '';
      document.getElementById('fStatus').value   = 'Hadir';
      document.getElementById('fUcapan').value   = '';
    }
    document.getElementById('modalBackdrop').classList.add('open');
  }
  function closeModal() { document.getElementById('modalBackdrop').classList.remove('open'); }

  // Di saveTamu() — tambah syncStorage() sebelum closeModal()
  function saveTamu() {
    const nama     = document.getElementById('fNama').value.trim();
    const kategori = document.getElementById('fKategori').value;
    const pax      = parseInt(document.getElementById('fPax').value) || null;
    const status   = document.getElementById('fStatus').value;
    const ucapan   = document.getElementById('fUcapan').value.trim();
    if (!nama) { alert('Nama tamu wajib diisi!'); return; }

    if (editingId) {
        const idx = tamus.findIndex(x => x.id === editingId);
        tamus[idx] = { id: editingId, nama, kategori, pax, status, ucapan };
    } else {
        tamus.push({ id: nextId++, nama, kategori, pax, status, ucapan });
    }
    syncStorage(); // ← tambah ini
    closeModal();
    render();
  }

  function editTamu(id)   { openModal(id); }
  // Di deleteTamu() — tambah syncStorage()
  function deleteTamu(id) {
    if (!confirm('Hapus tamu ini?')) return;
    tamus = tamus.filter(x => x.id !== id);
    syncStorage();
    render();
  }


  /* ── DOWNLOAD EXCEL (CSV) ── */
  function downloadExcel() {
    const rows = [['Nama Tamu','Kategori','Pax','Status','Ucapan']];
    tamus.forEach(t => rows.push([t.nama, t.kategori, t.pax ?? '', t.status, t.ucapan]));
    const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = 'data-tamu-nicholas-nahda.csv';
    a.click();
  }

  /* ── SIDEBAR TOGGLE ── */
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('overlay');
  const hamburger = document.getElementById('hamburger');
  hamburger.addEventListener('click', () => sidebar.classList.toggle('open') || overlay.classList.toggle('open'));
  overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); });

  /* close modal on backdrop click */
  document.getElementById('modalBackdrop').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });