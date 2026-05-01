// ===== APP.JS — Shared Utilities =====

// ===== AUTHENTICATION =====
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
  if (user) { 
    user.lastLogin = new Date().toISOString();
    localStorage.setItem('aqari_users', JSON.stringify(users));
    localStorage.setItem('aqari_current_user', JSON.stringify(user)); 
    return { success: true, user }; 
  }
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
function requireAuth(redirectUrl = 'login.html') { const u = getCurrentUser(); if(!u) { window.location.href = redirectUrl; return false; } return u; }
function requireAdmin(redirectUrl = 'index.html') { const u = requireAuth(); if(u && u.role !== 'admin') { window.location.href = redirectUrl; return false; } return u; }
initAuth();

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navActions = document.querySelector('.nav-actions');
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  // Auth adjustments
  const user = getCurrentUser();
  if (navLinks) {
    // Hide api docs
    const apiLink = Array.from(navLinks.querySelectorAll('a')).find(a => a.getAttribute('href') === 'api-docs.html');
    if (apiLink && apiLink.parentElement) apiLink.parentElement.remove();
    
    // Hide dashboard & contacts if not admin
    const dashLink = Array.from(navLinks.querySelectorAll('a')).find(a => a.getAttribute('href') === 'dashboard.html');
    if (dashLink && (!user || user.role !== 'admin')) dashLink.parentElement.remove();

    const contactsLink = Array.from(navLinks.querySelectorAll('a')).find(a => a.getAttribute('href') === 'contacts.html');
    if (contactsLink && (!user || user.role !== 'admin')) contactsLink.parentElement.remove();
  }

  if (navActions) {
    if (user) {
      const sellBtn = `<a href="sell.html" class="btn btn-primary btn-sm">+ إضافة عقار</a>`;
      const logoutBtn = `<button onclick="logoutUser()" class="btn btn-outline btn-sm">تسجيل خروج</button>`;
      navActions.innerHTML = `${sellBtn} ${logoutBtn} <button class="hamburger" id="hamburger"><span></span><span></span><span></span></button>`;
    } else {
      const loginBtn = `<a href="login.html" class="btn btn-outline btn-sm">تسجيل الدخول</a>`;
      navActions.innerHTML = `${loginBtn} <button class="hamburger" id="hamburger"><span></span><span></span><span></span></button>`;
    }
  }

  const hamburger = document.getElementById('hamburger');
  if (hamburger) hamburger.addEventListener('click', () => {
    if (navLinks) navLinks.classList.toggle('open');
  });

  // Set active link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

// ===== TOAST =====
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success:'✓', error:'✕', info:'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type]||'✓'}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateX(-20px)'; toast.style.transition='all 0.3s'; setTimeout(()=>toast.remove(),300); }, 3500);
}

// ===== MODAL =====
function openModal(id)  { document.getElementById(id)?.classList.add('active'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
  if (e.target.classList.contains('modal-close')) e.target.closest('.modal-overlay')?.classList.remove('active');
});

// ===== CONFIRM DIALOG =====
function confirmDialog(message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.innerHTML = `
    <div class="modal" style="max-width:420px">
      <div class="modal-header"><h3>تأكيد العملية</h3></div>
      <div class="modal-body"><p style="color:var(--text-secondary)">${message}</p></div>
      <div class="modal-footer">
        <button class="btn btn-ghost btn-sm" onclick="this.closest('.modal-overlay').remove()">إلغاء</button>
        <button class="btn btn-danger btn-sm" id="confirmOk">تأكيد</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#confirmOk').onclick = () => { overlay.remove(); onConfirm(); };
}

// ===== PROPERTY CARD =====
function renderPropertyCard(prop) {
  const govName  = getGovName(prop.gov);
  const typeName = getTypeName(prop.type);
  const typeIcon = getTypeIcon(prop.type);
  const listingName = getListingName(prop.listing);
  const listingColors = { sale:'badge-gold', rent:'badge-emerald', invest:'badge-indigo' };
  const favs = JSON.parse(localStorage.getItem('aqari_favs') || '[]');
  const isFav = favs.includes(prop.id);

  return `
  <div class="property-card fade-in" data-id="${prop.id}" onclick="window.location='property-detail.html?id=${prop.id}'">
    <div class="card-image">
      <div class="card-image-placeholder">
        <span style="font-size:3rem">${typeIcon}</span>
        <span style="font-size:0.85rem;color:var(--text-muted)">${typeName}</span>
      </div>
      <div class="card-badges">
        <span class="badge ${listingColors[prop.listing]||'badge-gold'}">${listingName}</span>
        ${prop.featured ? '<span class="badge badge-gold">⭐ مميز</span>' : ''}
      </div>
      <button class="card-fav ${isFav?'active':''}" onclick="toggleFav(event,${prop.id})" aria-label="مفضلة">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFav?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
    </div>
    <div class="card-body">
      <div class="card-title">${prop.title}</div>
      <div class="card-location">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${govName}${prop.city ? ' — ' + prop.city : ''}
      </div>
      <div class="card-price">${formatPrice(prop.price)} <span>/ ${prop.type==='land'||prop.type==='farm'?'الأرض الكاملة':'الوحدة'}</span></div>
      <div class="card-meta">
        ${prop.area ? `<div class="card-meta-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>${prop.area} م²</div>` : ''}
        ${prop.rooms ? `<div class="card-meta-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>${prop.rooms} غرف</div>` : ''}
        ${prop.baths ? `<div class="card-meta-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16M4 12V6a2 2 0 0 1 2-2h1M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/></svg>${prop.baths} حمام</div>` : ''}
      </div>
    </div>
    <div class="card-footer">
      <span style="font-size:0.78rem;color:var(--text-muted)">👁 ${prop.views||0} مشاهدة</span>
      <a href="property-detail.html?id=${prop.id}" class="btn btn-primary btn-sm" onclick="event.stopPropagation()">عرض التفاصيل</a>
    </div>
  </div>`;
}

// ===== FAVORITES =====
function toggleFav(e, id) {
  e.stopPropagation();
  const favs = JSON.parse(localStorage.getItem('aqari_favs') || '[]');
  const idx = favs.indexOf(id);
  const btn = e.currentTarget;
  if (idx >= 0) {
    favs.splice(idx, 1);
    btn.classList.remove('active');
    btn.querySelector('path').setAttribute('fill','none');
    showToast('تمت إزالة العقار من المفضلة', 'info');
  } else {
    favs.push(id);
    btn.classList.add('active');
    btn.querySelector('path').setAttribute('fill','currentColor');
    showToast('تمت إضافة العقار إلى المفضلة ❤️', 'success');
  }
  localStorage.setItem('aqari_favs', JSON.stringify(favs));
}

// ===== COUNT-UP ANIMATION =====
function animateCount(el) {
  const target = parseInt(el.dataset.count);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString('ar-SY') + (el.dataset.suffix || '+');
  }, 16);
}

// ===== INTERSECTION OBSERVER for animations =====
function initObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        // Count up
        entry.target.querySelectorAll?.('[data-count]').forEach(animateCount);
        if (entry.target.dataset.count) animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in-up, [data-count]').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

// ===== PARTICLES =====
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    const colors = ['rgba(201,162,39,0.6)','rgba(99,102,241,0.5)','rgba(16,185,129,0.4)'];
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${Math.random()*15+10}s;
      animation-delay:${Math.random()*10}s;
      opacity:0;
    `;
    container.appendChild(p);
  }
}

// ===== SUPPORT WIDGET =====
function initSupportWidget() {
  // 1. Inject Modal HTML if not exists
  if (!document.getElementById('supportModal')) {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal-overlay';
    modalDiv.id = 'supportModal';
    modalDiv.innerHTML = `
      <div class="modal" style="max-width:480px">
        <div class="support-modal-header">
          <div class="support-modal-icon">💬</div>
          <h2>خدمة العملاء</h2>
          <p style="color:var(--text-muted)">اترك رسالتك وسنقوم بالرد عليك في أقرب وقت</p>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>الاسم الكامل</label>
            <input type="text" id="suppName" class="form-control" placeholder="أدخل اسمك">
          </div>
          <div class="form-group">
            <label>رقم الهاتف / واتساب</label>
            <input type="text" id="suppPhone" class="form-control" placeholder="09xxxxxxxx">
          </div>
          <div class="form-group">
            <label>رسالتك أو استفسارك</label>
            <textarea id="suppMsg" class="form-control" rows="4" placeholder="اكتب استفسارك هنا..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModal('supportModal')">إلغاء</button>
          <button class="btn btn-primary" style="flex:1;justify-content:center;" onclick="submitSupportMsg()">إرسال الاستفسار</button>
        </div>
      </div>`;
    document.body.appendChild(modalDiv);
  }

  // 2. Create Floating Button
  if (!document.getElementById('supportBtnFixed')) {
    const widget = document.createElement('button');
    widget.id = 'supportBtnFixed';
    widget.className = 'support-btn-fixed';
    widget.innerHTML = `
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span class="support-badge">خدمة العملاء</span>
    `;
    widget.onclick = () => openModal('supportModal');
    document.body.appendChild(widget);
  }
}

window.submitSupportMsg = function() {
  const name = document.getElementById('suppName')?.value.trim();
  const phone = document.getElementById('suppPhone')?.value.trim();
  const msg = document.getElementById('suppMsg')?.value.trim();
  
  if (!name || !phone || !msg) { showToast('يرجى ملء جميع الحقول', 'error'); return; }
  
  // Save locally
  const messages = JSON.parse(localStorage.getItem('aqari_support_messages') || '[]');
  messages.unshift({ id: Date.now(), type: 'support_message', name, phone, msg, date: new Date().toISOString() });
  localStorage.setItem('aqari_support_messages', JSON.stringify(messages));

  showToast('جاري إرسال استفسارك... ✅', 'success');

  // Direct Form Submission via Formspree ID
  const form = document.createElement('form');
  form.action = 'https://formspree.io/f/xnjwqvyr';
  form.method = 'POST';
  form.target = '_blank'; // Add this to see the result
  
  const data = {
    "الاسم": name,
    "الهاتف": phone,
    "الرسالة": msg,
    "_subject": "رسالة دعم جديدة: " + name
  };

  for (const key in data) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = data[key];
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
  
  closeModal('supportModal');
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initObserver();
  initParticles();
  initSupportWidget();
});
