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
  const q = (document.getElementById('contactSearch')?.value || '').toLowerCase();
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
  
  if (list) {
    list.innerHTML = contacts.length ? contacts.map(c => `
      <div class="contact-item ${c.id===selectedContactId?'active':''}" onclick="selectContact(${c.id})">
        <div style="width:40px;height:40px;border-radius:50%;background:var(--gold-500);color:var(--navy-900);display:flex;align-items:center;justify-content:center;font-weight:700;">${c.name.charAt(0)}</div>
        <div>
          <div style="font-weight:600;">${c.name}</div>
          <div style="font-size:0.8rem;color:var(--text-muted);">${labels[c.type]||c.type}</div>
        </div>
      </div>`).join('') : '<div style="text-align:center;padding:40px;color:var(--text-muted)">لا توجد نتائج</div>';
  }
}

function selectContact(id) {
  selectedContactId = id;
  const c = getContacts().find(x => x.id === id);
  if (!c) return;
  
  document.querySelectorAll('.contact-item').forEach(el => el.classList.remove('active'));
  event.currentTarget?.classList.add('active');
  
  const labels = { agent: 'وكيل عقاري', owner: 'مالك عقار', buyer: 'مشتري' };
  const detail = document.getElementById('contactDetail');
  if (detail) {
    detail.innerHTML = `
      <div style="text-align:center;padding:20px;">
        <div style="width:60px;height:60px;border-radius:50%;background:var(--gold-500);color:var(--navy-900);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;margin:0 auto 12px;">${c.name.charAt(0)}</div>
        <h3>${c.name}</h3>
        <p style="color:var(--text-muted);">${labels[c.type]||c.type}</p>
        <p>📱 ${c.phone||'—'}</p>
        <p>📧 ${c.email||'—'}</p>
        <div style="display:flex;gap:10px;margin-top:16px;justify-content:center;">
          <a href="tel:${c.phone}" class="btn btn-success btn-sm">اتصال</a>
          <button onclick="deleteContactItem(${c.id})" class="btn btn-danger btn-sm">حذف</button>
        </div>
      </div>`;
  }
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
    const detail = document.getElementById('contactDetail');
    if (detail) detail.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">اختر جهة اتصال</div>';
  });
}

document.addEventListener('DOMContentLoaded', initContacts);
