// ===== SELL.JS =====
let selectedImages = [];
const MAX_IMAGES = 10;

function initSellPage() {
  if (!getCurrentUser()) { showToast('يرجى تسجيل الدخول', 'error'); setTimeout(() => location = 'login.html', 1000); return; }

  const typeSel = document.getElementById('propType');
  const govSel = document.getElementById('propGov');
  PROPERTY_TYPES.forEach(t => { const o = document.createElement('option'); o.value = t.id; o.textContent = t.icon + ' ' + t.name; typeSel?.appendChild(o); });
  GOVERNORATES.forEach(g => { const o = document.createElement('option'); o.value = g.id; o.textContent = g.icon + ' ' + g.name; govSel?.appendChild(o); });

  const user = getCurrentUser();
  if (user) {
    const n = document.getElementById('agentName'), p = document.getElementById('agentPhone'), e = document.getElementById('agentEmail');
    if (n) n.value = user.name || '';
    if (p) p.value = user.phone || '';
    if (e) e.value = user.email || '';
  }
}

function handleImageSelect(e) { processFiles(e.target.files); e.target.value = ''; }
function handleImageDrop(e) { e.preventDefault(); processFiles(e.dataTransfer.files); }

function processFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) { showToast('ليس ملف صورة', 'error'); return; }
    if (selectedImages.length >= MAX_IMAGES) { showToast('الحد ' + MAX_IMAGES + ' صور', 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => { selectedImages.push({ name: file.name, data: e.target.value }); renderPreviews(); };
    reader.readAsDataURL(file);
  });
}

function renderPreviews() {
  const grid = document.getElementById('imagePreviewGrid');
  if (!grid) return;
  grid.innerHTML = selectedImages.map((img, i) => `
    <div style="position:relative;width:100px;height:100px;border-radius:8px;overflow:hidden;border:2px solid var(--border)">
      <img src="${img.data}" style="width:100%;height:100%;object-fit:cover">
      <button onclick="removeImage(${i})" style="position:absolute;top:4px;left:4px;width:24px;height:24px;background:rgba(244,63,94,0.9);color:#fff;border-radius:50%;cursor:pointer">✕</button>
      ${i === 0 ? '<span style="position:absolute;bottom:0;left:0;right:0;background:var(--gold-500);color:#000;font-size:0.65rem;font-weight:700;text-align:center">رئيسية</span>' : ''}
    </div>`).join('');
}

function removeImage(i) { selectedImages.splice(i, 1); renderPreviews(); }

function submitProperty() {
  const title = document.getElementById('propTitle')?.value.trim();
  const type = document.getElementById('propType')?.value;
  const listing = document.getElementById('propListing')?.value;
  const desc = document.getElementById('propDesc')?.value.trim();
  const gov = document.getElementById('propGov')?.value;
  const area = parseFloat(document.getElementById('propArea')?.value);
  const price = parseFloat(document.getElementById('propPrice')?.value);
  const agent = document.getElementById('agentName')?.value.trim();
  const phone = document.getElementById('agentPhone')?.value.trim();

  if (!title || !type || !listing || !gov || !area || !price || !agent || !phone) { showToast('يرجى ملء جميع الحقول المطلوبة', 'error'); return; }

  const props = getProperties();
  const newId = props.length ? Math.max(...props.map(p => p.id)) + 1 : 1;

  saveProperty({
    id: newId, title, type, listing, gov,
    city: document.getElementById('propCity')?.value.trim() || '',
    area, price, currency: 'SYP', desc,
    rooms: parseInt(document.getElementById('propRooms')?.value) || 0,
    baths: parseInt(document.getElementById('propBaths')?.value) || 0,
    agent, agentPhone: phone,
    agentEmail: document.getElementById('agentEmail')?.value.trim() || '',
    images: selectedImages.map(img => img.data),
    featured: false, views: 0,
    date: new Date().toISOString().split('T')[0]
  });

  openModal('successModal');
}

document.addEventListener('DOMContentLoaded', initSellPage);
