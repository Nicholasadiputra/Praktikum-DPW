/* ── SIDEBAR ── */
const sidebar   = document.getElementById('sidebar');
const overlay   = document.getElementById('overlay');
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('open'); });
overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); });

/* ── TEMPLATE SELECT ── */
let selectedTemplate = 'bohemian';
function selectTemplate(name) {
selectedTemplate = name;
document.querySelectorAll('.template-item').forEach(el => el.classList.remove('selected'));
document.getElementById('tpl-' + name).classList.add('selected');
const labels = { bohemian:'Bohemian Template', modern:'Modern Template' };
document.getElementById('previewLabel').textContent = labels[name] || name;
}

/* ── UPLOAD HANDLERS ── */
function handleUpload(input, type) {
const file = input.files[0];
if (!file) return;
const labelEl = document.getElementById(type === 'thumbnail' ? 'thumb-label' : 'html-label');
labelEl.textContent = file.name.length > 20 ? file.name.slice(0,20)+'…' : file.name;
if (type === 'thumbnail' && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = e => {
    const prev = document.querySelector('.review-preview-placeholder');
    prev.style.background = `url(${e.target.result}) center/cover`;
    };
    reader.readAsDataURL(file);
}
}

/* ── SAVE ── */
function handleSave() {
const settings = {
    template:  selectedTemplate,
    animasi:   document.getElementById('tog-animasi').checked,
    musik:     document.getElementById('tog-musik').checked,
    namaTamu:  document.getElementById('tog-nama').checked,
    privat:    document.getElementById('tog-privat').checked,
};
console.log('Saved settings:', settings);

// visual feedback
const btn = document.querySelector('.btn-save');
btn.textContent = 'SAVED ✓';
btn.style.background = '#4caf50';
setTimeout(() => { btn.textContent = 'SAVE'; btn.style.background = ''; }, 2000);
}