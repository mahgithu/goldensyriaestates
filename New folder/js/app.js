// ===== APP.JS — Main Application File =====

// AUTHENTICATION
function initAuth() {
  const users = JSON.parse(localStorage.getItem('aqari_users') || '[]');
  if (!users.length) {
    users.push({ id: 1, name: 'مدير النظام', email: 'admin@aqari.com', password: 'admin123', phone: '0900000000', role: 'admin', date: new Date().toISOString() });
    localStorage.setItem('aqari_users', JSON.stringify(users));
  }
}
function getUsers() { return JSON.parse(localStorage.getItem('aqari_users') || '[]'); }
function getCurrentUser() { const u = localStorage.getItem('aqari_current_user'); return u ? JSON.parse(u) : null; }
function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) { localStorage.setItem('aqari_current_user', JSON.stringify(user)); return { success: true, user }; }
  return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
}
function registerUser(name, email, password, phone) {
  const users = getUsers();
  if (users.find(u => u.email === email)) return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً' };
  const newUser = { id: Date.now(), name, email, password, phone, role: 'user', date: new Date().toISOString() };
  users.push(newUser);
  localStorage.setItem('aqari_users', JSON.stringify(users));
  localStorage.setItem('aqari_current_user', JSON.stringify(newUser));
  return { success: true, user: newUser };
}
function logoutUser() { localStorage.removeItem('aqari_current_user'); window.location.href = 'index.html'; }
function requireAuth(redirect = 'login.html') { const u = getCurrentUser(); if (!u) { window.location.href = redirect; return false; } return u; }
function requireAdmin(redirect = 'index.html') { const u = requireAuth(); if (u && u.role !== 'admin') { window.location.href = redirect; return false; } return u; }
initAuth();

// NAVBAR
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  if (navbar) window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 30));

  const user = getCurrentUser();
  if (navLinks && (!user || user.role !== 'admin')) {
    ['dashboard.html', 'contacts.html'].forEach(h => { const l = navLinks.querySelector(`a[href="${h}"]`); if (l) l.parentElement.remove(); });
  }

  const navActions = document.querySelector('.nav-actions');
  if (navActions) {
    const hamburger = '<button class="hamburger" id="hamburger"><span></span><span></span><span></span></button>';
    navActions.innerHTML = user
      ? `<a href="sell.html" class="btn btn-primary btn-sm">+ إضافة عقار</a><button onclick="logoutUser()" class="btn btn-outline btn-sm">خروج</button>${hamburger}`
      : `<a href="login.html" class="btn btn-outline btn-sm">دخول</a><a href="register.html" class="btn btn-primary btn-sm">حساب جديد</a>${hamburger}`;
  }

  document.getElementById('hamburger')?.addEventListener('click', () => navLinks?.classList.toggle('open'));

  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('active', a.getAttribute('href') === path));
}

// TOAST
function showToast(message, type = 'success') {
  let c = document.getElementById('toast-container');
  if (!c) { c = document.createElement('div'); c.id = 'toast-container'; document.body.appendChild(c); }
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${icons[type]}</span> ${message}`;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
}

// MODAL
function openModal(id) { document.getElementById(id)?.classList.add('active'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
  if (e.target.classList.contains('modal-close')) e.target.closest('.modal-overlay')?.classList.remove('active');
});

// CONFIRM
function confirmDialog(msg, onOk) {
  const o = document.createElement('div');
  o.className = 'modal-overlay active';
  o.innerHTML = `<div class="modal" style="max-width:400px"><div class="modal-header"><h3>تأكيد</h3></div><div class="modal-body"><p style="color:var(--text-secondary)">${msg}</p></div><div class="modal-footer"><button class="btn btn-ghost btn-sm" onclick="this.closest('.modal-overlay').remove()">إلغاء</button><button class="btn btn-danger btn-sm" id="okBtn">تأكيد</button></div></div>`;
  document.body.appendChild(o);
  o.querySelector('#okBtn').onclick = () => { o.remove(); onOk(); };
}

// PROPERTY CARD
function renderPropertyCard(prop) {
  const gov = getGovName(prop.gov), type = getTypeName(prop.type), icon = getTypeIcon(prop.type);
  const listingColors = { sale: 'badge-gold', rent: 'badge-emerald', invest: 'badge-indigo' };
  const favs = JSON.parse(localStorage.getItem('aqari_favs') || '[]');
  const isFav = favs.includes(prop.id);
  const curr = getPreferredCurrency();
  const price = convertPrice(prop.price, prop.currency || 'SYP', curr);
  const hasImg = prop.images && prop.images.length > 0;

  return `<div class="property-card fade-in" onclick="location='property-detail.html?id=${prop.id}'">
    <div class="card-image">
      ${hasImg ? `<img src="${prop.images[0]}" style="width:100%;height:100%;object-fit:cover;">` : `<div class="card-image-placeholder"><span style="font-size:3rem">${icon}</span></div>`}
      <div class="card-badges"><span class="badge ${listingColors[prop.listing] || 'badge-gold'}">${getListingName(prop.listing)}</span>${prop.featured ? '<span class="badge badge-gold">⭐</span>' : ''}</div>
      <button class="card-fav ${isFav ? 'active' : ''}" onclick="toggleFav(event,${prop.id})"><svg width="16" height="16" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
    </div>
    <div class="card-body">
      <div class="card-title">${prop.title}</div>
      <div class="card-location"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${gov}${prop.city ? ' — ' + prop.city : ''}</div>
      <div class="card-price">${formatPrice(price, curr)} <span>/ ${prop.type === 'land' || prop.type === 'farm' ? 'الأرض' : 'الوحدة'}</span></div>
      <div class="card-meta">
        ${prop.area ? `<div class="card-meta-item">📐 ${prop.area} م²</div>` : ''}
        ${prop.rooms ? `<div class="card-meta-item">🚪 ${prop.rooms} غرف</div>` : ''}
      </div>
    </div>
    <div class="card-footer">
      <span style="font-size:0.78rem;color:var(--text-muted)">👁 ${prop.views || 0}</span>
      <a href="property-detail.html?id=${prop.id}" class="btn btn-primary btn-sm" onclick="event.stopPropagation()">عرض</a>
    </div>
  </div>`;
}

function toggleFav(e, id) {
  e.stopPropagation();
  const favs = JSON.parse(localStorage.getItem('aqari_favs') || '[]');
  const idx = favs.indexOf(id);
  if (idx >= 0) { favs.splice(idx, 1); showToast('تمت الإزالة من المفضلة', 'info'); }
  else { favs.push(id); showToast('تمت الإضافة للمفضلة ❤️', 'success'); }
  localStorage.setItem('aqari_favs', JSON.stringify(favs));
  if (typeof applyFilters === 'function') applyFilters();
}

// SUPPORT WIDGET
function initSupportWidget() {
  if (!document.getElementById('supportModal')) {
    const m = document.createElement('div');
    m.className = 'modal-overlay'; m.id = 'supportModal';
    m.innerHTML = `<div class="modal" style="max-width:480px"><div class="support-modal-header"><div class="support-modal-icon">💬</div><h2>خدمة العملاء</h2></div><div class="modal-body"><div class="form-group"><label>الاسم</label><input type="text" id="suppName" class="form-control"></div><div class="form-group"><label>الهاتف</label><input type="text" id="suppPhone" class="form-control"></div><div class="form-group"><label>الرسالة</label><textarea id="suppMsg" class="form-control" rows="4"></textarea></div></div><div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal('supportModal')">إلغاء</button><button class="btn btn-primary" style="flex:1" onclick="submitSupportMsg()">إرسال</button></div></div>`;
    document.body.appendChild(m);
  }
  if (!document.getElementById('supportBtnFixed')) {
    const b = document.createElement('button');
    b.id = 'supportBtnFixed'; b.className = 'support-btn-fixed';
    b.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    b.onclick = () => openModal('supportModal');
    document.body.appendChild(b);
  }
}

window.submitSupportMsg = function () {
  const n = document.getElementById('suppName')?.value.trim();
  const p = document.getElementById('suppPhone')?.value.trim();
  const m = document.getElementById('suppMsg')?.value.trim();
  if (!n || !p || !m) { showToast('يرجى ملء جميع الحقول', 'error'); return; }
  const msgs = JSON.parse(localStorage.getItem('aqari_support_messages') || '[]');
  msgs.unshift({ id: Date.now(), name: n, phone: p, msg: m, date: new Date().toISOString() });
  localStorage.setItem('aqari_support_messages', JSON.stringify(msgs));
  showToast('تم إرسال رسالتك بنجاح ✅', 'success');
  closeModal('supportModal');
};

// INIT
document.addEventListener('DOMContentLoaded', () => { initNavbar(); initSupportWidget(); });
