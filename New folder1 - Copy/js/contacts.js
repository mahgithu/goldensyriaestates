// ===== CONTACTS.JS =====
let selectedContactId = null;

function initContacts() {
  if (!requireAdmin()) return;
  const govF = document.getElementById('contactGovFilter');
  const cGov = document.getElementById('cGov');
  GOVERNORATES.forEach(g => {
    const o1 = document.createElement('option'); o1.value = g.id; o1.textContent = g.name; govF?.appendChild(o1);
    const o2 = document.createElement('option'); o2.value = g.id; o2.textContent = g.name; cGov?.appendChild(o2);
  });
  renderContacts();
}

function renderContacts() {
  const q = document.getElementById('contactSearch')?.value.toLowerCase() || '';
  const typeF = document.getElementById('contactTypeFilter')?.value || '';
  const govF = document.getElementById('contactGovFilter')?.value || '';
  let contacts = getContacts();
  if (q) contacts = contacts.filter(c => c.name.toLowerCase().includes(q));
  if (typeF) contacts = contacts.filter(c => c.type === typeF);
  if (govF) contacts = contacts.filter(c => c.gov === govF);

  const list = document.getElementById('contactsList');
  const count = document.getElementById('contactsCount');
  if (count) count.textContent = contacts.length + ' جهة اتصال';

  const labels = { agent: 'وكيل', owner: 'مالك', buyer: 'مشتري' };
  list.innerHTML = contacts.length ? contacts.map(c => `
    <div class="contact-item ${c.id === selectedContactId ? 'active' : ''}" onclick="selectContact(${c.id})">
      <div class="contact-avatar" style="background:${c.color || '#C9A227'}22;color:${c.color || '#C9A227'}">${c.name.charAt(0)}</div>
      <div class="contact-info"><div class="contact-name">${c.name}</div><div class="contact-role">${labels[c.type] || c.type} ${c.gov ? '— ' + getGovName(c.gov) : ''}</div></div>
    </div>`).join('') : '<div class="empty-state"><p>لا توجد نتائج</p></div>';
}

function selectContact(id) {
  selectedContactId = id;
  const c = getContacts().find(x => x.id === id);
  if (!c) return;
  document.querySelectorAll('.contact-item').forEach(el => el.classList.remove('active'));
  document.querySelector(`.contact-item[onclick="selectContact(${id})"]`)?.classList.add('active');

  const labels = { agent: 'وكيل عقاري', owner: 'مالك عقار', buyer: 'مشتري' };
  document.getElementById('contactDetail').innerHTML = `
    <div class="contact-detail-header">
      <div class="contact-detail-avatar" style="background:${c.color || '#C9A227'}22;color:${c.color || '#C9A227'}">${c.name.charAt(0)}</div>
      <div class="contact-detail-name">${c.name}</div>
      <div class="contact-detail-role">${labels[c.type] || c.type}</div>
    </div>
    <div class="contact-info-grid">
      <div class="info-item"><label>الهاتف</label><p>${c.phone || '—'}</p></div>
      <div class="info-item"><label>البريد</label><p>${c.email || '—'}</p></div>
      <div class="info-item"><label>المحافظة</label><p>${c.gov ? getGovName(c.gov) : '—'}</p></div>
    </div>
    <div style="display:flex;gap:10px;margin-top:16px">
      <a href="tel:${c.phone}" class="btn btn-success btn-sm" style="flex:1;justify-content:center">اتصال</a>
      <button class="btn btn-danger btn-sm" onclick="deleteContactItem(${c.id})">حذف</button>
    </div>`;
}

function saveContactForm() {
  const name = document.getElementById('cName')?.value.trim();
  const phone = document.getElementById('cPhone')?.value.trim();
  if (!name || !phone) { showToast('الاسم والهاتف مطلوبان', 'error'); return; }
  const editId = parseInt(document.getElementById('editContactId')?.value) || null;
  saveContact({
    id: editId || Date.now(), name, phone,
    type: document.getElementById('cType')?.value || 'agent',
    email: document.getElementById('cEmail')?.value.trim(),
    gov: document.getElementById('cGov')?.value,
    speciality: document.getElementById('cSpeciality')?.value.trim(),
    notes: document.getElementById('cNotes')?.value.trim(),
    date: new Date().toISOString().split('T')[0]
  });
  closeModal('addContactModal');
  renderContacts();
  showToast(editId ? 'تم التحديث ✅' : 'تمت الإضافة ✅', 'success');
}

function deleteContactItem(id) {
  confirmDialog('هل تريد حذف جهة الاتصال؟', () => {
    deleteContact(id);
    renderContacts();
    document.getElementById('contactDetail').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">اختر جهة اتصال</div>';
  });
}

document.addEventListener('DOMContentLoaded', initContacts);