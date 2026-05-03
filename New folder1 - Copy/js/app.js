# ✅ الملفات النهائية الكاملة - مع إصلاح الصور والدولار

سأرسل لك كل ملف بالتفصيل:

---

## 📄 ملف `js/data.js` (استبدله بالكامل):

```javascript
// ===== DATA STORE WITH USD CURRENCY =====

const GOVERNORATES = [
  { id:'damascus',     name:'دمشق',       icon:'🏛️' },
  { id:'aleppo',       name:'حلب',        icon:'🕌' },
  { id:'homs',         name:'حمص',        icon:'🏙️' },
  { id:'hama',         name:'حماة',       icon:'🌿' },
  { id:'latakia',      name:'اللاذقية',   icon:'🌊' },
  { id:'tartus',       name:'طرطوس',      icon:'⚓' },
  { id:'deir-ezzor',   name:'دير الزور',  icon:'🌾' },
  { id:'raqqa',        name:'الرقة',      icon:'🌅' },
  { id:'sweida',       name:'السويداء',   icon:'🏔️' },
  { id:'daraa',        name:'درعا',       icon:'🌻' },
  { id:'quneitra',     name:'القنيطرة',   icon:'🌄' },
  { id:'idlib',        name:'إدلب',       icon:'🌱' },
  { id:'hasakah',      name:'الحسكة',     icon:'🌿' },
  { id:'rif-damascus', name:'ريف دمشق',   icon:'🏡' },
];

const PROPERTY_TYPES = [
  { id:'apartment', name:'شقة',       icon:'🏢' },
  { id:'villa',     name:'فيلا',      icon:'🏰' },
  { id:'house',     name:'منزل',      icon:'🏠' },
  { id:'land',      name:'أرض',       icon:'🌍' },
  { id:'commercial',name:'محل تجاري', icon:'🏪' },
  { id:'farm',      name:'مزرعة',     icon:'🌾' },
  { id:'office',    name:'مكتب',      icon:'🏗️' },
  { id:'warehouse', name:'مستودع',    icon:'🏭' },
];

const LISTING_TYPES = [
  { id:'sale',   name:'للبيع' },
  { id:'rent',   name:'للإيجار' },
  { id:'invest', name:'للاستثمار' },
];

// ===== CURRENCY SYSTEM =====
const CURRENCIES = {
  SYP: { code: 'SYP', name: 'ليرة سورية', symbol: 'ل.س', flag: '🇸🇾' },
  USD: { code: 'USD', name: 'دولار أمريكي', symbol: '$', flag: '🇺🇸' }
};

let EXCHANGE_RATE = { USD_TO_SYP: 15000, SYP_TO_USD: 0.000067, lastUpdated: new Date().toISOString() };

function loadExchangeRate() {
  const saved = localStorage.getItem('aqari_exchange_rate');
  if (saved) { 
    try { 
      const p = JSON.parse(saved);
      EXCHANGE_RATE.USD_TO_SYP = p.USD_TO_SYP || 15000;
      EXCHANGE_RATE.SYP_TO_USD = 1 / EXCHANGE_RATE.USD_TO_SYP;
    } catch(e) {} 
  }
}

function saveExchangeRate() {
  EXCHANGE_RATE.lastUpdated = new Date().toISOString();
  localStorage.setItem('aqari_exchange_rate', JSON.stringify(EXCHANGE_RATE));
}

function updateExchangeRate(rate) {
  EXCHANGE_RATE.USD_TO_SYP = parseInt(rate) || 15000;
  EXCHANGE_RATE.SYP_TO_USD = 1 / EXCHANGE_RATE.USD_TO_SYP;
  saveExchangeRate();
}

function convertPrice(amount, from, to) {
  if (from === to) return Math.round(amount);
  amount = parseFloat(amount) || 0;
  if (from === 'SYP' && to === 'USD') return Math.round(amount / EXCHANGE_RATE.USD_TO_SYP);
  if (from === 'USD' && to === 'SYP') return Math.round(amount * EXCHANGE_RATE.USD_TO_SYP);
  return Math.round(amount);
}

function formatPrice(price, currency) {
  price = parseFloat(price) || 0;
  currency = currency || 'USD';
  
  if (currency === 'USD') {
    if (price >= 1000000) return '$' + (price / 1000000).toFixed(1) + 'M';
    if (price >= 1000) return '$' + (price / 1000).toFixed(0) + 'K';
    return '$' + price.toLocaleString('en-US');
  }
  
  if (price >= 1000000000) return (price / 1000000000).toFixed(1) + 'B SYP';
  if (price >= 1000000) return (price / 1000000).toFixed(0) + 'M SYP';
  return price.toLocaleString('en-US') + ' SYP';
}

function getPreferredCurrency() { 
  if (!localStorage.getItem('aqari_currency')) {
    localStorage.setItem('aqari_currency', 'USD'); // افتراضي: دولار
  }
  return localStorage.getItem('aqari_currency');
}

function setPreferredCurrency(c) { localStorage.setItem('aqari_currency', c); }

loadExchangeRate();

// ===== PROPERTIES (أسعار بالدولار) =====
let PROPERTIES = [
  { id:1, title:'شقة فاخرة في قلب دمشق — المزة', type:'apartment', listing:'sale', gov:'damascus', city:'المزة', area:180, rooms:4, baths:2, floor:8, price:30000, currency:'USD', year:2019, desc:'شقة راقية بتشطيب سوبر لوكس في أرقى أحياء دمشق.', features:['موقف سيارة','تكييف مركزي','مولد كهربائي'], agent:'أحمد الخطيب', agentPhone:'0991234567', featured:true, views:1240, date:'2025-11-15', images:[] },
  { id:2, title:'فيلا فخمة مع حديقة — المالكية', type:'villa', listing:'sale', gov:'damascus', city:'المالكية', area:420, rooms:6, baths:4, price:120000, currency:'USD', year:2020, desc:'فيلا استثنائية مع حديقة 300 م٢ ومسبح خاص.', features:['حديقة خاصة','مسبح','كراج'], agent:'سمر الأسعد', agentPhone:'0992345678', featured:true, views:890, date:'2025-11-20', images:[] },
  { id:3, title:'شقة مميزة للإيجار — حلب', type:'apartment', listing:'rent', gov:'aleppo', city:'شارع بغداد', area:140, rooms:3, baths:2, floor:4, price:1500, currency:'USD', year:2018, desc:'شقة نظيفة ومميزة في حي راقي بحلب.', features:['مفروشة جزئياً','تكييف','انترنت'], agent:'مازن السعدي', agentPhone:'0993456789', featured:true, views:650, date:'2025-11-25', images:[] },
  { id:4, title:'أرض صناعية — حمص', type:'land', listing:'sale', gov:'homs', city:'المنطقة الصناعية', area:5000, price:50000, currency:'USD', features:['مسورة','وثائق كاملة'], agent:'خالد النوري', agentPhone:'0994567890', featured:false, views:320, date:'2025-11-10', images:[] },
  { id:5, title:'شالية بحري — اللاذقية', type:'villa', listing:'sale', gov:'latakia', city:'شاطئ الزراعة', area:250, rooms:4, baths:3, price:65000, currency:'USD', year:2021, desc:'شالية بحري فاخر على بُعد 50م من الشاطئ.', features:['إطلالة بحرية','بركة سباحة'], agent:'ريم الحسن', agentPhone:'0995678901', featured:true, views:1560, date:'2025-12-01', images:[] },
  { id:6, title:'محل تجاري — حماة', type:'commercial', listing:'sale', gov:'hama', city:'وسط المدينة', area:80, baths:1, price:22000, currency:'USD', year:2015, desc:'محل تجاري بموقع استراتيجي.', features:['موقع مميز','واجهة كبيرة'], agent:'بسام القاسم', agentPhone:'0996789012', featured:false, views:280, date:'2025-10-20', images:[] },
  { id:7, title:'شقة للإيجار — طرطوس', type:'apartment', listing:'rent', gov:'tartus', city:'شاطئ طرطوس', area:110, rooms:3, baths:2, floor:3, price:1200, currency:'USD', year:2017, desc:'شقة مطلة على البحر.', features:['إطلالة بحرية','شرفة'], agent:'لمى شاهين', agentPhone:'0997890123', featured:false, views:445, date:'2025-11-05', images:[] },
  { id:8, title:'مزرعة — ريف دمشق', type:'farm', listing:'sale', gov:'rif-damascus', city:'يبرود', area:15000, rooms:2, baths:1, price:45000, currency:'USD', desc:'مزرعة 15 دونم مزروعة بالزيتون.', features:['بئر مياه','منزل ريفي'], agent:'علي الزعبي', agentPhone:'0998901234', featured:false, views:390, date:'2025-10-15', images:[] },
  { id:9, title:'شقة استثمارية — السويداء', type:'apartment', listing:'invest', gov:'sweida', city:'مركز السويداء', area:130, rooms:3, baths:2, floor:2, price:18000, currency:'USD', year:2022, desc:'شقة حديثة مناسبة للاستثمار.', features:['بناء حديث','عائد استثماري'], agent:'نادين البرازي', agentPhone:'0999012345', featured:false, views:210, date:'2025-12-05', images:[] },
  { id:10, title:'فيلا — إدلب', type:'villa', listing:'sale', gov:'idlib', city:'إدلب المدينة', area:350, rooms:5, baths:3, price:35000, currency:'USD', year:2016, desc:'فيلا واسعة في حي هادئ.', features:['حديقة','مرآب'], agent:'سامر الرفاعي', agentPhone:'0990123456', featured:false, views:178, date:'2025-11-28', images:[] },
];

// ===== CONTACTS =====
let CONTACTS = [
  { id:1, name:'أحمد الخطيب', role:'وكيل عقاري', gov:'damascus', phone:'0991234567', email:'ahmad@aqari.sy', speciality:'شقق وفلل دمشق', rating:4.9, deals:142, type:'agent', date:'2025-01-10' },
  { id:2, name:'سمر الأسعد', role:'مالكة عقار', gov:'damascus', phone:'0992345678', speciality:'فلل راقية', rating:4.7, deals:23, type:'owner', date:'2025-03-15' },
  { id:3, name:'مازن السعدي', role:'وكيل عقاري', gov:'aleppo', phone:'0993456789', speciality:'شقق حلب', rating:4.5, deals:89, type:'agent', date:'2025-02-20' },
  { id:4, name:'ريم الحسن', role:'وكيلة عقارية', gov:'latakia', phone:'0995678901', speciality:'شاليهات وعقارات بحرية', rating:4.8, deals:67, type:'agent', date:'2025-01-25' },
];

// ===== HELPERS =====
function loadData(key, fallback) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch(e) { return fallback; }
}
function saveData(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) {} }

function initData() {
  if (!loadData('aqari_properties', null)) saveData('aqari_properties', PROPERTIES);
  if (!loadData('aqari_contacts', null)) saveData('aqari_contacts', CONTACTS);
}
function getProperties() { return loadData('aqari_properties', PROPERTIES); }
function getContacts() { return loadData('aqari_contacts', CONTACTS); }

function saveProperty(prop) {
  const props = getProperties();
  const idx = props.findIndex(p => p.id === prop.id);
  if (idx >= 0) props[idx] = prop; else props.unshift(prop);
  saveData('aqari_properties', props);
}

function deleteProperty(id) {
  saveData('aqari_properties', getProperties().filter(p => p.id !== id));
}

function saveContact(c) {
  const contacts = getContacts();
  const idx = contacts.findIndex(x => x.id === c.id);
  if (idx >= 0) contacts[idx] = c; else contacts.unshift(c);
  saveData('aqari_contacts', contacts);
}

function deleteContact(id) {
  saveData('aqari_contacts', getContacts().filter(c => c.id !== id));
}

function getGovName(id) { return GOVERNORATES.find(g=>g.id===id)?.name || id; }
function getTypeName(id) { return PROPERTY_TYPES.find(t=>t.id===id)?.name || id; }
function getListingName(id) { return LISTING_TYPES.find(l=>l.id===id)?.name || id; }
function getTypeIcon(id) { return PROPERTY_TYPES.find(t=>t.id===id)?.icon || '🏠'; }

initData();
```

---

## 📄 ملف `js/app.js` (استبدله بالكامل):

```javascript
// ===== APP.JS — Main Application =====

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
  if (navbar) window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 30));
  
  const user = getCurrentUser();
  const navLinks = document.getElementById('navLinks');
  if (navLinks && (!user || user.role !== 'admin')) {
    ['dashboard.html', 'contacts.html', 'api-docs.html'].forEach(h => { const l = navLinks.querySelector(`a[href="${h}"]`); if (l) l.parentElement.remove(); });
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
  if (!c) { c = document.createElement('div'); c.id = 'toast-container'; c.style.cssText = 'position:fixed;top:20px;left:20px;z-index:9999;display:flex;flex-direction:column;gap:10px'; document.body.appendChild(c); }
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const colors = { success: '#10B981', error: '#F43F5E', info: '#6366F1' };
  const t = document.createElement('div');
  t.style.cssText = `background:var(--navy-800);border:1px solid ${colors[type]};color:#fff;padding:12px 20px;border-radius:8px;display:flex;align-items;gap:8px;animation:slideIn 0.3s ease;min-width:250px;`;
  t.innerHTML = `<span style="color:${colors[type]};font-weight:bold">${icons[type]}</span> ${message}`;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(-20px)'; t.style.transition = 'all 0.3s'; setTimeout(() => t.remove(), 300); }, 3000);
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

// PROPERTY CARD (مع دعم الصور والدولار)
function renderPropertyCard(prop) {
  const gov = getGovName(prop.gov), icon = getTypeIcon(prop.type);
  const listingColors = { sale: 'badge-gold', rent: 'badge-emerald', invest: 'badge-indigo' };
  const favs = JSON.parse(localStorage.getItem('aqari_favs') || '[]');
  const isFav = favs.includes(prop.id);
  const curr = getPreferredCurrency();
  
  // تحويل السعر
  const propCurrency = prop.currency || 'USD';
  const displayPrice = (propCurrency === curr) ? prop.price : convertPrice(prop.price, propCurrency, curr);
  
  // الصور
  const hasImages = prop.images && prop.images.length > 0 && prop.images[0] && prop.images[0].length > 100;
  
  let imageHTML;
  if (hasImages) {
    imageHTML = `<img src="${prop.images[0]}" alt="${prop.title}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='<div class=\\'card-image-placeholder\\'><span style=\\'font-size:3rem\\'>${icon}</span></div>'">`;
  } else {
    imageHTML = `<div class="card-image-placeholder"><span style="font-size:3rem">${icon}</span><span style="font-size:0.8rem;color:var(--text-muted)">${getTypeName(prop.type)}</span></div>`;
  }
  
  return `<div class="property-card fade-in" onclick="location='property-detail.html?id=${prop.id}'">
    <div class="card-image">
      ${imageHTML}
      <div class="card-badges"><span class="badge ${listingColors[prop.listing]||'badge-gold'}">${getListingName(prop.listing)}</span>${prop.featured?'<span class="badge badge-gold">⭐</span>':''}</div>
      <button class="card-fav ${isFav?'active':''}" onclick="toggleFav(event,${prop.id})"><svg width="16" height="16" viewBox="0 0 24 24" fill="${isFav?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
    </div>
    <div class="card-body">
      <div class="card-title">${prop.title}</div>
      <div class="card-location">📍 ${gov}${prop.city?' — '+prop.city:''}</div>
      <div class="card-price">${formatPrice(displayPrice, curr)}</div>
      <div class="card-meta">
        ${prop.area?`<span class="card-meta-item">📐 ${prop.area} م²</span>`:''}
        ${prop.rooms?`<span class="card-meta-item">🚪 ${prop.rooms}</span>`:''}
      </div>
    </div>
    <div class="card-footer">
      <span style="font-size:0.78rem;color:var(--text-muted)">👁 ${prop.views||0}</span>
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
    b.id = 'supportBtnFixed';
    b.style.cssText = 'position:fixed;bottom:24px;left:24px;background:var(--gold-500);color:var(--navy-900);border:none;border-radius:50%;width:56px;height:56px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:998;box-shadow:0 4px 20px rgba(201,162,39,0.4);';
    b.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    b.onclick = () => openModal('supportModal');
    document.body.appendChild(b);
  }
}

window.submitSupportMsg = function() {
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
```

---

## 📄 ملف `js/sell.js` (استبدله بالكامل - إصلاح الصور):

```javascript
// ===== SELL.JS — إضافة عقار مع رفع الصور المصحح =====

let selectedImages = [];
const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function initSellPage() {
  const user = getCurrentUser();
  if (!user) { 
    showToast('يرجى تسجيل الدخول أولاً', 'error'); 
    setTimeout(() => window.location.href = 'login.html', 1500); 
    return; 
  }

  // Populate selects
  const typeSel = document.getElementById('propType');
  const govSel = document.getElementById('propGov');
  
  PROPERTY_TYPES.forEach(t => { 
    const o = document.createElement('option'); 
    o.value = t.id; 
    o.textContent = t.icon + ' ' + t.name; 
    if (typeSel) typeSel.appendChild(o); 
  });
  
  GOVERNORATES.forEach(g => { 
    const o = document.createElement('option'); 
    o.value = g.id; 
    o.textContent = g.icon + ' ' + g.name; 
    if (govSel) govSel.appendChild(o); 
  });

  // Features
  const features = ['موقف سيارة','تكييف مركزي','مولد كهربائي','مصعد','شرفة','حديقة','مسبح','أمن 24/7','ديكور فاخر','مفروشة'];
  const featGrid = document.getElementById('featuresGrid');
  if (featGrid) {
    featGrid.innerHTML = features.map(f => `
      <label style="display:flex;align-items:center;gap:8px;padding:8px 14px;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:8px;cursor:pointer;">
        <input type="checkbox" value="${f}" style="accent-color:var(--gold-500);">
        <span style="font-size:0.88rem;">${f}</span>
      </label>`).join('');
  }

  // Auto-fill agent
  if (user) {
    const n = document.getElementById('agentName');
    const p = document.getElementById('agentPhone');
    const e = document.getElementById('agentEmail');
    if (n) n.value = user.name || '';
    if (p) p.value = user.phone || '';
    if (e) e.value = user.email || '';
  }

  // Image upload events
  setupImageUpload();
}

function setupImageUpload() {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('propImages');
  
  if (!uploadArea || !fileInput) return;
  
  // Click to upload
  uploadArea.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    fileInput.click();
  };
  
  // File input change
  fileInput.onchange = function(e) {
    e.preventDefault();
    if (this.files && this.files.length > 0) {
      processFiles(this.files);
    }
    this.value = ''; // Reset for re-select
  };
  
  // Drag and drop
  uploadArea.ondragover = function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.borderColor = 'var(--gold-500)';
    this.style.background = 'rgba(201,162,39,0.1)';
  };
  
  uploadArea.ondragleave = function(e) {
    e.preventDefault();
    this.style.borderColor = 'var(--border)';
    this.style.background = 'transparent';
  };
  
  uploadArea.ondrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.borderColor = 'var(--border)';
    this.style.background = 'transparent';
    
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };
}

function processFiles(files) {
  const previewGrid = document.getElementById('imagePreviewGrid');
  if (!previewGrid) return;
  
  let addedCount = 0;
  
  Array.from(files).forEach(file => {
    // Validate type
    if (!file.type || !file.type.startsWith('image/')) {
      showToast(`"${file.name}" ليس ملف صورة`, 'error');
      return;
    }
    
    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      showToast(`"${file.name}" أكبر من 2MB`, 'error');
      return;
    }
    
    // Check limit
    if (selectedImages.length >= MAX_IMAGES) {
      showToast(`الحد الأقصى ${MAX_IMAGES} صور`, 'error');
      return;
    }
    
    // Read file
    const reader = new FileReader();
    
    reader.onload = function(e) {
      if (e.target && e.target.result) {
        selectedImages.push({ 
          name: file.name, 
          data: e.target.result 
        });
        addedCount++;
        renderPreviews();
      }
    };
    
    reader.onerror = function() {
      showToast(`خطأ في قراءة "${file.name}"`, 'error');
    };
    
    reader.readAsDataURL(file);
  });
  
  if (addedCount > 0) {
    showToast(`تم إضافة ${addedCount} صورة ✅`, 'success');
  }
}

function renderPreviews() {
  const grid = document.getElementById('imagePreviewGrid');
  if (!grid) return;
  
  if (selectedImages.length === 0) {
    grid.innerHTML = '';
    return;
  }
  
  grid.innerHTML = selectedImages.map((img, i) => `
    <div style="position:relative;width:100px;height:100px;border-radius:8px;overflow:hidden;border:2px solid var(--border);flex-shrink:0;">
      <img src="${img.data}" alt="${img.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23333%22 width=%22100%22 height=%22100%22/><text fill=%22%23999%22 x=%2250%22 y=%2250%22 text-anchor=%22middle%22>صورة</text></svg>'">
      <button type="button" onclick="removeImage(${i})" style="position:absolute;top:4px;left:4px;width:24px;height:24px;background:rgba(244,63,94,0.9);color:#fff;border:none;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;cursor:pointer;line-height:1;">✕</button>
      ${i === 0 ? '<span style="position:absolute;bottom:0;left:0;right:0;background:var(--gold-500);color:var(--navy-900);font-size:0.65rem;font-weight:700;text-align:center;padding:2px;">رئيسية</span>' : ''}
    </div>
  `).join('');
  
  // Update upload area text
  const uploadArea = document.getElementById('uploadArea');
  if (uploadArea) {
    const textDiv = uploadArea.querySelector('div > div');
    if (textDiv) {
      textDiv.textContent = `تم اختيار ${selectedImages.length} صورة — اضغط لإضافة المزيد`;
    }
  }
}

function removeImage(index) {
  if (index >= 0 && index < selectedImages.length) {
    selectedImages.splice(index, 1);
    renderPreviews();
    showToast('تم حذف الصورة', 'info');
  }
}

function submitProperty() {
  // Validation
  const title = document.getElementById('propTitle')?.value.trim();
  const type = document.getElementById('propType')?.value;
  const listing = document.getElementById('propListing')?.value;
  const desc = document.getElementById('propDesc')?.value.trim();
  const gov = document.getElementById('propGov')?.value;
  const area = parseFloat(document.getElementById('propArea')?.value);
  const price = parseFloat(document.getElementById('propPrice')?.value);
  const agent = document.getElementById('agentName')?.value.trim();
  const phone = document.getElementById('agentPhone')?.value.trim();
  const commissionAgree = document.getElementById('commissionAgree')?.checked;

  if (!title) { showToast('يرجى إدخال عنوان الإعلان', 'error'); return; }
  if (!type) { showToast('يرجى اختيار نوع العقار', 'error'); return; }
  if (!listing) { showToast('يرجى اختيار نوع العرض', 'error'); return; }
  if (!desc) { showToast('يرجى كتابة وصف العقار', 'error'); return; }
  if (!gov) { showToast('يرجى اختيار المحافظة', 'error'); return; }
  if (!area || area <= 0) { showToast('يرجى إدخال المساحة', 'error'); return; }
  if (!price || price <= 0) { showToast('يرجى إدخال السعر', 'error'); return; }
  if (!agent) { showToast('يرجى إدخال اسمك', 'error'); return; }
  if (!phone) { showToast('يرجى إدخال رقم الهاتف', 'error'); return; }
  if (!commissionAgree) { showToast('يرجى الموافقة على شروط العمولة', 'error'); return; }

  // Collect features
  const features = [];
  document.querySelectorAll('#featuresGrid input:checked').forEach(cb => {
    features.push(cb.value);
  });

  // Create property
  const props = getProperties();
  const newId = props.length > 0 ? Math.max(...props.map(p => p.id)) + 1 : 1;

  const newProp = {
    id: newId,
    title,
    type,
    listing,
    gov,
    city: document.getElementById('propCity')?.value.trim() || '',
    area,
    price,
    currency: 'USD', // الدولار افتراضي
    desc,
    features,
    rooms: parseInt(document.getElementById('propRooms')?.value) || 0,
    baths: parseInt(document.getElementById('propBaths')?.value) || 0,
    floor: parseInt(document.getElementById('propFloor')?.value) || 0,
    year: parseInt(document.getElementById('propYear')?.value) || 0,
    agent,
    agentPhone: phone,
    agentEmail: document.getElementById('agentEmail')?.value.trim() || '',
    images: selectedImages.map(img => img.data),
    featured: false,
    views: 0,
    date: new Date().toISOString().split('T')[0]
  };

  saveProperty(newProp);
  showToast('تم نشر إعلانك بنجاح! 🎉', 'success');
  
  // Show success modal
  setTimeout(() => {
    openModal('successModal');
  }, 500);
}

function resetForm() {
  const fields = ['propTitle','propType','propListing','propDesc','propGov','propCity','propArea','propPrice','propRooms','propBaths','propFloor','propYear'];
  fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  
  const commission = document.getElementById('commissionAgree');
  if (commission) commission.checked = false;
  
  document.querySelectorAll('#featuresGrid input').forEach(cb => cb.checked = false);
  
  selectedImages = [];
  renderPreviews();
}

document.addEventListener('DOMContentLoaded', initSellPage);
```

---

## 📄 ملف `js/property-detail.js` (استبدله):

```javascript
// ===== PROPERTY-DETAIL.JS مع إصلاح الصور =====

function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  
  if (!id) {
    showError('لم يتم تحديد العقار');
    return;
  }
  
  const prop = getProperties().find(p => p.id === id);
  if (!prop) {
    showError('العقار غير موجود');
    return;
  }
  
  // Increment views
  prop.views = (prop.views || 0) + 1;
  saveProperty(prop);
  
  const curr = getPreferredCurrency();
  const propCurrency = prop.currency || 'USD';
  const displayPrice = (propCurrency === curr) ? prop.price : convertPrice(prop.price, propCurrency, curr);
  const icon = getTypeIcon(prop.type);
  
  // Breadcrumb
  const breadcrumbTitle = document.getElementById('breadcrumbTitle');
  if (breadcrumbTitle) breadcrumbTitle.textContent = prop.title;
  
  // Main Image
  const mainImg = document.getElementById('mainImg');
  const hasImages = prop.images && prop.images.length > 0 && prop.images[0] && prop.images[0].length > 100;
  
  if (mainImg) {
    if (hasImages) {
      mainImg.innerHTML = `<img src="${prop.images[0]}" alt="${prop.title}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--text-muted)\\'><span style=\\'font-size:5rem\\'>${icon}</span><span>${getTypeName(prop.type)}</span></div>'">`;
    } else {
      mainImg.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--text-muted)"><span style="font-size:5rem">${icon}</span><span>${getTypeName(prop.type)}</span></div>`;
    }
  }
  
  // Sub images
  const subImgs = document.querySelectorAll('.detail-sub-img');
  subImgs.forEach((el, i) => {
    if (prop.images && prop.images[i + 1] && prop.images[i + 1].length > 100) {
      el.innerHTML = `<img src="${prop.images[i + 1]}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`;
    }
  });
  
  // Header
  const header = document.getElementById('propHeader');
  if (header) {
    header.innerHTML = `
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
        <span class="badge badge-gold">${getListingName(prop.listing)}</span>
        <span class="badge badge-indigo">${getTypeName(prop.type)}</span>
        ${prop.featured ? '<span class="badge badge-gold">⭐ مميز</span>' : ''}
      </div>
      <h1 style="font-size:1.6rem;font-weight:800;margin-bottom:8px;">${prop.title}</h1>
      <div style="color:var(--text-muted);margin-bottom:12px;">📍 ${getGovName(prop.gov)}${prop.city ? ' — ' + prop.city : ''}</div>
      <div style="font-size:2rem;font-weight:900;color:var(--gold-400);">${formatPrice(displayPrice, curr)}</div>
      <div style="color:var(--text-muted);font-size:0.85rem;margin-top:8px;">👁 ${(prop.views || 0).toLocaleString()} مشاهدة</div>`;
  }
  
  // Specs
  const specs = [];
  if (prop.area) specs.push({ v: prop.area + ' م²', l: 'المساحة' });
  if (prop.rooms) specs.push({ v: prop.rooms, l: 'غرف' });
  if (prop.baths) specs.push({ v: prop.baths, l: 'حمام' });
  if (prop.floor) specs.push({ v: prop.floor === 0 ? 'أرضي' : prop.floor, l: 'الطابق' });
  if (prop.year) specs.push({ v: prop.year, l: 'سنة البناء' });
  
  const specsEl = document.getElementById('propSpecs');
  if (specsEl) {
    specsEl.innerHTML = specs.length ? `
      <div class="detail-specs">
        ${specs.map(s => `<div class="spec-item"><div class="spec-value">${s.v}</div><div class="spec-label">${s.l}</div></div>`).join('')}
      </div>` : '';
  }
  
  // Description
  const descEl = document.getElementById('propDesc');
  if (descEl) {
    descEl.innerHTML = `<h3 style="font-weight:700;margin-bottom:12px;">📝 الوصف</h3><p style="color:var(--text-secondary);line-height:1.8;">${prop.desc || 'لا يوجد وصف'}</p>`;
  }
  
  // Features
  const featEl = document.getElementById('propFeatures');
  if (featEl) {
    if (prop.features && prop.features.length) {
      featEl.innerHTML = `<h3 style="font-weight:700;margin-bottom:12px;">✅ المميزات</h3><div style="display:flex;flex-wrap:wrap;gap:8px;">${prop.features.map(f => `<span class="badge badge-gold">${f}</span>`).join('')}</div>`;
      featEl.style.display = 'block';
    } else {
      featEl.style.display = 'none';
    }
  }
  
  // Location
  const locEl = document.getElementById('propLocation');
  if (locEl) {
    locEl.innerHTML = `<h3 style="font-weight:700;margin-bottom:12px;">📍 الموقع</h3><p style="color:var(--text-secondary);">${getGovName(prop.gov)}${prop.city ? ' — ' + prop.city : ''}</p>`;
  }
  
  // Contact Card
  const contactEl = document.getElementById('contactCard');
  if (contactEl) {
    contactEl.innerHTML = `
      <h3 style="font-weight:700;margin-bottom:16px;">معلومات التواصل</h3>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:48px;height:48px;border-radius:50%;background:var(--gold-500);color:var(--navy-900);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:700;">${(prop.agent || 'و').charAt(0)}</div>
        <div>
          <div style="font-weight:700;">${prop.agent || 'وكيل عقاري'}</div>
          <div style="font-size:0.85rem;color:var(--text-muted);">${prop.agentEmail || ''}</div>
        </div>
      </div>
      <div style="display:flex;gap:10px;">
        <a href="tel:${prop.agentPhone || ''}" class="btn btn-success" style="flex:1;justify-content:center;">📞 اتصال</a>
        <button class="btn btn-primary" style="flex:1;justify-content:center;" onclick="openModal('contactModal')">💬 استفسار</button>
      </div>`;
  }
  
  // Similar properties
  const similar = getProperties().filter(p => p.id !== id && (p.type === prop.type || p.gov === prop.gov)).slice(0, 3);
  const similarGrid = document.getElementById('similarGrid');
  const similarSection = document.getElementById('similarSection');
  
  if (similar.length > 0 && similarGrid) {
    if (similarSection) similarSection.style.display = 'block';
    similarGrid.innerHTML = similar.map(p => renderPropertyCard(p)).join('');
  } else {
    if (similarSection) similarSection.style.display = 'none';
  }
}

function showError(msg) {
  const content = document.getElementById('detailContent');
  if (content) {
    content.innerHTML = `
      <div class="container" style="padding:80px 24px;text-align:center;">
        <div style="font-size:4rem;margin-bottom:16px;">😕</div>
        <h2 style="font-weight:700;margin-bottom:8px;">${msg}</h2>
        <a href="properties.html" class="btn btn-primary" style="margin-top:24px;display:inline-block;">العودة للعقارات</a>
      </div>`;
  }
}

function sendInquiry() {
  const n = document.getElementById('inquiryName')?.value.trim();
  const p = document.getElementById('inquiryPhone')?.value.trim();
  const m = document.getElementById('inquiryMsg')?.value.trim();
  
  if (!n || !p) { showToast('يرجى إدخال الاسم والهاتف', 'error'); return; }
  
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const prop = getProperties().find(x => x.id === id);
  
  const msgs = JSON.parse(localStorage.getItem('aqari_support_messages') || '[]');
  msgs.unshift({ 
    id: Date.now(), 
    type: 'inquiry', 
    name: n, 
    phone: p, 
    msg: m, 
    propId: id, 
    propTitle: prop?.title || '', 
    date: new Date().toISOString() 
  });
  localStorage.setItem('aqari_support_messages', JSON.stringify(msgs));
  
  showToast('تم إرسال استفسارك ✅', 'success');
  closeModal('contactModal');
  
  // Clear form
  document.getElementById('inquiryName').value = '';
  document.getElementById('inquiryPhone').value = '';
  document.getElementById('inquiryMsg').value = '';
}

document.addEventListener('DOMContentLoaded', loadDetail);
```

---

## 📄 ملف `js/properties.js` (استبدله):

```javascript
// ===== PROPERTIES.JS =====
let activeFilters = { type: [], listing: [], gov: [], special: [] };

function initPropertiesPage() {
  const params = new URLSearchParams(window.location.search);
  
  // Populate selects
  const govSel = document.getElementById('filterGov');
  const typeSel = document.getElementById('filterType');
  
  GOVERNORATES.forEach(g => { const o = document.createElement('option'); o.value = g.id; o.textContent = g.name; govSel?.appendChild(o); });
  PROPERTY_TYPES.forEach(t => { const o = document.createElement('option'); o.value = t.id; o.textContent = t.icon + ' ' + t.name; typeSel?.appendChild(o); });
  
  // Build sidebar filters
  const typeF = document.getElementById('typeFilters');
  const govF = document.getElementById('govFilters');
  
  if (typeF) {
    typeF.innerHTML = PROPERTY_TYPES.map(t => 
      `<div class="filter-option" data-val="${t.id}" data-group="type" onclick="toggleFilter(this)">
        <div class="filter-checkbox"><svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" fill="none" stroke="#0A1628" stroke-width="2"/></svg></div>
        <span>${t.icon} ${t.name}</span>
      </div>`
    ).join('');
  }
  
  if (govF) {
    govF.innerHTML = GOVERNORATES.map(g => 
      `<div class="filter-option" data-val="${g.id}" data-group="gov" onclick="toggleFilter(this)">
        <div class="filter-checkbox"><svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" fill="none" stroke="#0A1628" stroke-width="2"/></svg></div>
        <span>${g.icon} ${g.name}</span>
      </div>`
    ).join('');
  }
  
  // Apply URL params
  if (params.get('gov')) { 
    activeFilters.gov = [params.get('gov')]; 
    if (govSel) govSel.value = params.get('gov');
    document.querySelectorAll('#govFilters .filter-option').forEach(el => {
      if (el.dataset.val === params.get('gov')) el.classList.add('selected');
    });
  }
  if (params.get('type')) { 
    activeFilters.type = [params.get('type')]; 
    if (typeSel) typeSel.value = params.get('type');
    document.querySelectorAll('#typeFilters .filter-option').forEach(el => {
      if (el.dataset.val === params.get('type')) el.classList.add('selected');
    });
  }
  if (params.get('listing')) { 
    activeFilters.listing = [params.get('listing')];
    document.querySelectorAll('#listingFilters .filter-option').forEach(el => {
      if (el.dataset.val === params.get('listing')) el.classList.add('selected');
    });
  }
  
  applyFilters();
}

function toggleFilter(el) {
  const val = el.dataset.val, group = el.dataset.group;
  el.classList.toggle('selected');
  const idx = activeFilters[group].indexOf(val);
  if (idx >= 0) activeFilters[group].splice(idx, 1); 
  else activeFilters[group].push(val);
  applyFilters();
}

function applyFilters() {
  const q = (document.getElementById('quickSearch')?.value || '').toLowerCase();
  const gov = document.getElementById('filterGov')?.value || '';
  const type = document.getElementById('filterType')?.value || '';
  const listing = document.getElementById('filterListing')?.value || '';
  const sort = document.getElementById('sortSelect')?.value || 'date-desc';
  
  let props = getProperties();
  
  if (q) props = props.filter(p => p.title.toLowerCase().includes(q) || (p.city || '').toLowerCase().includes(q));
  if (gov) props = props.filter(p => p.gov === gov);
  if (type) props = props.filter(p => p.type === type);
  if (listing) props = props.filter(p => p.listing === listing);
  if (activeFilters.type.length) props = props.filter(p => activeFilters.type.includes(p.type));
  if (activeFilters.listing.length) props = props.filter(p => activeFilters.listing.includes(p.listing));
  if (activeFilters.gov.length) props = props.filter(p => activeFilters.gov.includes(p.gov));
  if (activeFilters.special.includes('featured')) props = props.filter(p => p.featured);
  
  switch(sort) {
    case 'price-asc': props.sort((a,b) => a.price - b.price); break;
    case 'price-desc': props.sort((a,b) => b.price - a.price); break;
    default: props.sort((a,b) => new Date(b.date || 0) - new Date(a.date || 0));
  }
  
  const grid = document.getElementById('propertiesGrid');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('resultsCount');
  
  if (count) count.textContent = props.length;
  
  if (!props.length) { 
    if (grid) grid.innerHTML = ''; 
    if (empty) empty.style.display = 'block'; 
    return; 
  }
  
  if (empty) empty.style.display = 'none';
  if (grid) grid.innerHTML = props.map(p => renderPropertyCard(p)).join('');
}

function clearFilters() {
  activeFilters = { type: [], listing: [], gov: [], special: [] };
  document.querySelectorAll('.filter-option').forEach(el => el.classList.remove('selected'));
  ['quickSearch','filterGov','filterType','filterListing'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  applyFilters();
}

document.addEventListener('DOMContentLoaded', initPropertiesPage);
```

---

## 📄 ملف `js/home.js`:

```javascript
// ===== HOME.JS =====
function initHomePage() {
  // Featured properties
  const grid = document.getElementById('featuredGrid');
  if (grid) {
    const featured = getProperties().filter(p => p.featured).slice(0, 6);
    const props = featured.length ? featured : getProperties().slice(0, 6);
    grid.innerHTML = props.map(p => renderPropertyCard(p)).join('');
  }
  
  // Governorates
  const govGrid = document.getElementById('govGrid');
  if (govGrid) {
    const props = getProperties();
    govGrid.innerHTML = GOVERNORATES.map(g => {
      const count = props.filter(p => p.gov === g.id).length;
      return `<a href="properties.html?gov=${g.id}" class="gov-card">
        <div class="gov-icon">${g.icon}</div>
        <div class="gov-name">${g.name}</div>
        <div class="gov-count">${count} عقار</div>
      </a>`;
    }).join('');
  }
  
  // Hero stats animation
  document.querySelectorAll('.hero-stat .stat-num').forEach(el => {
    const target = parseInt(el.dataset.count) || 0;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + '+';
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

function doHeroSearch() {
  const gov = document.getElementById('searchGov')?.value || '';
  const type = document.getElementById('searchType')?.value || '';
  const listing = document.querySelector('.search-tab.active')?.dataset.type || 'buy';
  
  let url = 'properties.html?';
  const params = [];
  if (gov) params.push('gov=' + gov);
  if (type) params.push('type=' + type);
  if (listing === 'rent') params.push('listing=rent');
  else if (listing === 'invest') params.push('listing=invest');
  else params.push('listing=sale');
  
  window.location.href = url + params.join('&');
}

document.addEventListener('DOMContentLoaded', () => {
  initHomePage();
  
  document.querySelectorAll('.search-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
```

---

## 📄 ملف `js/dashboard.js`:

```javascript
// ===== DASHBOARD.JS =====
function loadDashboard() {
  if (!requireAdmin()) return;
  
  const props = getProperties();
  const contacts = getContacts();
  
  animateVal('statProps', props.length);
  animateVal('statContacts', contacts.length);
  animateVal('statViews', props.reduce((s,p) => s + (p.views||0), 0));
  animateVal('statFeatured', props.filter(p=>p.featured).length);
  
  // Properties table
  const tbody = document.getElementById('propsTableBody');
  if (tbody) {
    const curr = getPreferredCurrency();
    tbody.innerHTML = props.slice(0,10).map(p => {
      const propCurrency = p.currency || 'USD';
      const price = (propCurrency === curr) ? p.price : convertPrice(p.price, propCurrency, curr);
      return `<tr>
        <td><div style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.title}</div></td>
        <td>${getGovName(p.gov)}</td>
        <td>${getListingName(p.listing)}</td>
        <td style="color:var(--gold-400);font-weight:700;">${formatPrice(price, curr)}</td>
        <td>${p.views||0}</td>
        <td>
          <a href="property-detail.html?id=${p.id}" class="btn btn-ghost btn-sm">عرض</a>
          <button onclick="deleteProp(${p.id})" class="btn btn-danger btn-sm">حذف</button>
        </td>
      </tr>`;
    }).join('');
  }
  
  // Users table
  const uBody = document.getElementById('usersTableBody');
  if (uBody) {
    uBody.innerHTML = getUsers().map(u => `<tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone||'—'}</td>
      <td>${new Date(u.date).toLocaleDateString('ar-SY')}</td>
    </tr>`).join('');
  }
  
  // Support messages
  const sLog = document.getElementById('supportMessagesLog');
  const sBadge = document.getElementById('unreadMessagesBadge');
  const msgs = JSON.parse(localStorage.getItem('aqari_support_messages')||'[]');
  if (sBadge) sBadge.textContent = msgs.length;
  if (sLog) {
    sLog.innerHTML = msgs.length ? msgs.map(m => `
      <div style="padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:8px;">
        <strong>${m.name}</strong> - ${m.phone}<br>
        <small style="color:var(--text-muted)">${m.msg}</small>
      </div>`).join('') : '<p style="color:var(--text-muted);text-align:center">لا توجد رسائل</p>';
  }
  
  // Exchange rate
  const exDiv = document.getElementById('exchangeRateSettings');
  if (exDiv) {
    document.getElementById('rateLastUpdated').textContent = new Date(EXCHANGE_RATE.lastUpdated).toLocaleDateString('ar-SY');
    document.getElementById('exchangeRateInput').value = EXCHANGE_RATE.USD_TO_SYP;
    document.getElementById('rateDisplay').textContent = EXCHANGE_RATE.USD_TO_SYP.toLocaleString();
  }
}

function animateVal(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let c = 0;
  const step = Math.max(1, Math.ceil(target/40));
  const t = setInterval(() => { 
    c = Math.min(c+step, target); 
    el.textContent = c.toLocaleString(); 
    if (c>=target) clearInterval(t); 
  }, 30);
}

function deleteProp(id) {
  confirmDialog('حذف العقار؟', () => { deleteProperty(id); loadDashboard(); });
}

function saveExchangeRate() {
  const rate = parseInt(document.getElementById('exchangeRateInput')?.value) || 15000;
  updateExchangeRate(rate);
  document.getElementById('rateDisplay').textContent = rate.toLocaleString();
  showToast('تم تحديث سعر الصرف ✅', 'success');
}

document.addEventListener('DOMContentLoaded', loadDashboard);
```

---

## 📄 ملف `js/contacts.js`:

```javascript
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
```

---

## ✅ ملخص التغييرات:

| المشكلة | الحل |
|---------|------|
| الصور لا تُرفع | إصلاح `FileReader` و `processFiles` بالكامل |
| الدولار غير مفعّل | جميع الأسعار بالدولار + تحويل تلقائي |
| خطأ في `auth.js` | حذفه والاكتفاء بـ `app.js` |
| عرض الصور | إضافة `onerror` كبديل |

---

**هل تريد أن أرسل لك ملف CSS محدث أيضاً؟** 🎨
