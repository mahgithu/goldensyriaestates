// ===== CONTACTS PAGE =====

const AVATAR_COLORS = ['#C9A227','#6366F1','#10B981','#F59E0B','#F43F5E','#8B5CF6','#06B6D4','#84CC16','#EC4899'];
let selectedContactId = null;

function getAvatarColor(name) {
  let hash = 0;
  for (let c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function buildContactFilters() {
  const govSel = document.getElementById('contactGovFilter');
  GOVERNORATES.forEach(g => {
    const o = document.createElement('option');
    o.value = g.id; o.textContent = g.name;
    govSel?.appendChild(o);
  });
  const cGov = document.getElementById('cGov');
  GOVERNORATES.forEach(g => {
    const o = document.createElement('option');
    o.value = g.id; o.textContent = g.name;
    cGov?.appendChild(o);
  });
}

function renderContacts() {
  const q       = document.getElementById('contactSearch')?.value.trim().toLowerCase() || '';
  const typeF   = document.getElementById('contactTypeFilter')?.value || '';
  const govF    = document.getElementById('contactGovFilter')?.value || '';
  let contacts  = getContacts();

  if (q)     contacts = contacts.filter(c => c.name.toLowerCase().includes(q) || (c.speciality||'').toLowerCase().includes(q) || (c.notes||'').toLowerCase().includes(q));
  if (typeF) contacts = contacts.filter(c => c.type === typeF);
  if (govF)  contacts = contacts.filter(c => c.gov  === govF);

  const list = document.getElementById('contactsList');
  const count = document.getElementById('contactsCount');
  if (count) count.textContent = contacts.length + ' جهة اتصال';

  if (!contacts.length) {
    list.innerHTML = '<div class="empty-state"><p>لا توجد نتائج</p><button class="btn btn-outline btn-sm" onclick="clearContactFilters()">مسح الفلاتر</button></div>';
    return;
  }

  const typeLabels = { agent:'وكيل عقاري', owner:'مالك عقار', buyer:'مشتري' };
  list.innerHTML = contacts.map(c => `
    <div class="contact-item ${c.id===selectedContactId?'active':''}" onclick="selectContact(${c.id})">
      <div class="contact-avatar" style="background:${getAvatarColor(c.name)}22;color:${getAvatarColor(c.name)};border:2px solid ${getAvatarColor(c.name)}44;">${c.avatar||c.name.charAt(0)}</div>
      <div class="contact-info">
        <div class="contact-name">${c.name}</div>
        <div class="contact-role">${typeLabels[c.type]||c.role} ${c.gov?'— '+getGovName(c.gov):''}</div>
        <div class="contact-meta">${c.speciality||''}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">
        <span class="badge ${c.type==='agent'?'badge-gold':c.type==='buyer'?'badge-emerald':'badge-indigo'}" style="font-size:0.7rem;">${typeLabels[c.type]||c.role}</span>
        ${c.rating ? `<span style="font-size:0.75rem;color:var(--amber);">⭐ ${c.rating}</span>` : ''}
      </div>
    </div>`).join('');
}

function selectContact(id) {
  selectedContactId = id;
  document.querySelectorAll('.contact-item').forEach(el => el.classList.remove('active'));
  document.querySelector(`.contact-item[onclick="selectContact(${id})"]`)?.classList.add('active');
  const contact = getContacts().find(c => c.id === id);
  if (!contact) return;
  renderContactDetail(contact);
}

function renderContactDetail(c) {
  const color = getAvatarColor(c.name);
  const typeLabels = { agent:'وكيل عقاري', owner:'مالك عقار', buyer:'مشتري / مستأجر' };
  const panel = document.getElementById('contactDetail');
  panel.innerHTML = `
    <div class="contact-detail-header">
      <div class="contact-detail-avatar" style="background:${color}22;color:${color};border:3px solid ${color}44;">${c.avatar||c.name.charAt(0)}</div>
      <div class="contact-detail-name">${c.name}</div>
      <div class="contact-detail-role">${typeLabels[c.type]||c.role}</div>
      ${c.rating ? `<div style="margin-top:8px;color:var(--amber);">⭐ ${c.rating} — ${c.deals||0} صفقة</div>` : ''}
    </div>

    <div class="contact-info-grid">
      <div class="info-item"><label>الهاتف</label><p>${c.phone||'—'}</p></div>
      <div class="info-item"><label>البريد</label><p>${c.email||'—'}</p></div>
      <div class="info-item"><label>المحافظة</label><p>${c.gov?getGovName(c.gov):'—'}</p></div>
      <div class="info-item"><label>التخصص</label><p>${c.speciality||'—'}</p></div>
      ${c.notes ? `<div class="info-item" style="grid-column:1/-1;"><label>ملاحظات</label><p>${c.notes}</p></div>` : ''}
    </div>

    <div class="contact-actions-row" style="margin-bottom:20px;">
      <a href="tel:${c.phone}" class="btn btn-success btn-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>اتصال
      </a>
      ${c.whatsapp ? `<a href="https://wa.me/${c.whatsapp}" target="_blank" class="btn btn-primary btn-sm">واتساب</a>` : ''}
      ${c.email ? `<a href="mailto:${c.email}" class="btn btn-ghost btn-sm">إيميل</a>` : ''}
    </div>

    <div style="display:flex;gap:10px;padding-top:16px;border-top:1px solid var(--border);">
      <button class="btn btn-outline btn-sm" onclick="editContact(${c.id})" style="flex:1;justify-content:center;">✏️ تعديل</button>
      <button class="btn btn-danger btn-sm" onclick="deleteContactItem(${c.id})">🗑️ حذف</button>
    </div>`;
}

function editContact(id) {
  const c = getContacts().find(c => c.id === id);
  if (!c) return;
  document.getElementById('editContactId').value = id;
  document.getElementById('cName').value = c.name || '';
  document.getElementById('cType').value = c.type || 'agent';
  document.getElementById('cPhone').value = c.phone || '';
  document.getElementById('cEmail').value = c.email || '';
  document.getElementById('cGov').value = c.gov || '';
  document.getElementById('cSpeciality').value = c.speciality || '';
  document.getElementById('cNotes').value = c.notes || '';
  document.getElementById('contactModalTitle').textContent = 'تعديل جهة الاتصال';
  openModal('addContactModal');
}

function saveContactForm() {
  const name  = document.getElementById('cName').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  if (!name || !phone) { showToast('يرجى ملء الاسم ورقم الهاتف', 'error'); return; }

  const editId = parseInt(document.getElementById('editContactId').value) || null;
  const contact = {
    id:         editId || Date.now(),
    name,
    type:       document.getElementById('cType').value,
    phone,
    email:      document.getElementById('cEmail').value.trim(),
    gov:        document.getElementById('cGov').value,
    speciality: document.getElementById('cSpeciality').value.trim(),
    notes:      document.getElementById('cNotes').value.trim(),
    whatsapp:   '963' + phone.replace(/^0/,''),
    avatar:     name.charAt(0),
    color:      getAvatarColor(name),
    rating:     null,
    deals:      0,
    date:       new Date().toISOString().split('T')[0],
  };

  saveContact(contact);
  closeModal('addContactModal');
  document.getElementById('editContactId').value = '';
  document.getElementById('contactModalTitle').textContent = 'إضافة جهة اتصال جديدة';
  ['cName','cPhone','cEmail','cSpeciality','cNotes'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  renderContacts();
  selectContact(contact.id);
  showToast(editId ? 'تم تحديث جهة الاتصال ✅' : 'تمت إضافة جهة الاتصال ✅', 'success');
}

function deleteContactItem(id) {
  confirmDialog('هل أنت متأكد من حذف جهة الاتصال هذه؟', () => {
    deleteContact(id);
    selectedContactId = null;
    document.getElementById('contactDetail').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);"><div style="font-size:3rem;margin-bottom:12px;">👈</div><p>اختر جهة اتصال لعرض التفاصيل</p></div>';
    renderContacts();
    showToast('تم حذف جهة الاتصال', 'info');
  });
}

function clearContactFilters() {
  document.getElementById('contactSearch').value = '';
  document.getElementById('contactTypeFilter').value = '';
  document.getElementById('contactGovFilter').value = '';
  renderContacts();
}

document.addEventListener('DOMContentLoaded', () => {
  buildContactFilters();
  renderContacts();
});
