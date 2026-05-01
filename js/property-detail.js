// ===== PROPERTY DETAIL PAGE =====

let currentProp = null;

function loadProperty() {
  const id = parseInt(new URLSearchParams(window.location.search).get('id'));
  if (!id) { window.location.href = 'properties.html'; return; }
  const props = getProperties();
  const prop = props.find(p => p.id === id);
  if (!prop) { showToast('العقار غير موجود', 'error'); setTimeout(()=>window.location.href='properties.html',2000); return; }
  currentProp = prop;
  // Increment views
  prop.views = (prop.views || 0) + 1;
  saveProperty(prop);
  renderDetail(prop);
  renderSimilar(prop);
}

function renderDetail(prop) {
  document.title = prop.title + ' — عقاري سوريا';
  const icon = getTypeIcon(prop.type);
  const govName = getGovName(prop.gov);
  const typeName = getTypeName(prop.type);
  const listingName = getListingName(prop.listing);
  const listingColors = { sale:'badge-gold', rent:'badge-emerald', invest:'badge-indigo' };

  // Breadcrumb
  document.getElementById('breadcrumbTitle').textContent = prop.title.substring(0,40)+'...';
  // Gallery
  document.getElementById('mainIcon').textContent = icon;
  document.getElementById('mainType').textContent = typeName + ' — ' + govName;

  // Header
  document.getElementById('propHeader').innerHTML = `
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">
      <span class="badge ${listingColors[prop.listing]||'badge-gold'}">${listingName}</span>
      <span class="badge badge-indigo">${typeName}</span>
      ${prop.featured ? '<span class="badge badge-gold">⭐ مميز</span>' : ''}
    </div>
    <h1 style="font-size:clamp(1.4rem,3vw,2rem);font-weight:800;margin-bottom:12px;">${prop.title}</h1>
    <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;color:var(--text-muted);font-size:0.9rem;margin-bottom:20px;">
      <span>📍 ${govName}${prop.city?' — '+prop.city:''}</span>
      ${prop.year ? `<span>🗓️ بناء ${prop.year}</span>` : ''}
      ${prop.floor ? `<span>🏢 الطابق ${prop.floor}</span>` : ''}
      <span>👁 ${prop.views} مشاهدة</span>
    </div>
    <div style="display:flex;align-items:baseline;gap:10px;">
      <span style="font-size:2rem;font-weight:900;color:var(--gold-400);font-family:var(--font-heading);">${formatPrice(prop.price)}</span>
      ${prop.listing==='rent' ? '<span style="color:var(--text-muted);font-size:0.9rem;">/ شهرياً</span>' : ''}
    </div>
  `;

  // Specs
  const specs = [];
  if (prop.area)  specs.push({ val: prop.area + ' م²', label: 'المساحة' });
  if (prop.rooms) specs.push({ val: prop.rooms + ' غرف', label: 'عدد الغرف' });
  if (prop.baths) specs.push({ val: prop.baths + ' حمام', label: 'الحمامات' });
  if (prop.floor) specs.push({ val: 'الطابق ' + prop.floor, label: 'الطابق' });
  if (prop.year)  specs.push({ val: prop.year, label: 'سنة البناء' });
  specs.push({ val: getListingName(prop.listing), label: 'نوع العرض' });
  document.getElementById('propSpecs').innerHTML = specs.map(s => `
    <div class="spec-item">
      <div class="spec-value">${s.val}</div>
      <div class="spec-label">${s.label}</div>
    </div>`).join('');

  // Description
  document.getElementById('propDesc').innerHTML = `
    <h3 style="font-weight:700;margin-bottom:12px;">📝 وصف العقار</h3>
    <p style="color:var(--text-secondary);line-height:1.9;">${prop.desc || 'لا يوجد وصف متاح.'}</p>
  `;

  // Features
  if (prop.features?.length) {
    document.getElementById('propFeatures').innerHTML = `
      <h3 style="font-weight:700;margin-bottom:16px;">✅ المميزات والمرافق</h3>
      <div style="display:flex;flex-wrap:wrap;gap:10px;">
        ${prop.features.map(f=>`<span class="badge badge-emerald">${f}</span>`).join('')}
      </div>`;
  }

  // Location
  document.getElementById('propLocation').innerHTML = `
    <h3 style="font-weight:700;margin-bottom:12px;">📍 الموقع</h3>
    <div style="display:flex;gap:24px;flex-wrap:wrap;color:var(--text-secondary);">
      <div><span style="color:var(--text-muted);font-size:0.8rem;display:block;">المحافظة</span><strong>${govName}</strong></div>
      ${prop.city ? `<div><span style="color:var(--text-muted);font-size:0.8rem;display:block;">المنطقة / الحي</span><strong>${prop.city}</strong></div>` : ''}
    </div>
    <div style="margin-top:16px;background:var(--navy-700);border-radius:var(--radius-md);height:180px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);border:1px solid var(--border);">
      <div style="text-align:center;"><div style="font-size:2.5rem;margin-bottom:8px;">🗺️</div><p style="font-size:0.9rem;">الخريطة التفاعلية قريباً</p></div>
    </div>
  `;

  // Contact card
  const user = getCurrentUser();
  const isAdmin = user && user.role === 'admin';

  document.getElementById('contactCard').innerHTML = `
    <h3>تواصل مع الإدارة</h3>
    <div class="agent-info">
      <div class="agent-avatar">${prop.agent?.charAt(0)||'و'}</div>
      <div>
        <div class="agent-name">${prop.agent || 'العقارات السورية الذهبية'}</div>
        <div class="agent-title">إدارة المنصة</div>
      </div>
    </div>
    <div class="detail-actions">
      <a href="tel:${prop.agentPhone || '0900000000'}" class="btn btn-success" style="justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        اتصل الآن
      </a>
      <a href="https://wa.me/963${(prop.agentPhone || '0900000000').replace(/^0/,'')}" target="_blank" class="btn btn-primary" style="justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        واتساب
      </a>
      <button class="btn btn-ghost" style="justify-content:center;" onclick="openModal('supportModal')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        إرسال استفسار للإدارة
      </button>
    </div>
    ${isAdmin ? `
    <div style="margin-top:12px;">
      <button class="btn btn-danger" style="width:100%;justify-content:center;" onclick="deleteCurrentProp()">
        حذف العقار (صلاحية مدير)
      </button>
    </div>` : ''}
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);text-align:center;">
      <p style="font-size:0.78rem;color:var(--text-muted);">رمز العقار: #${prop.id.toString().padStart(4,'0')}</p>
    </div>
  `;
}

function renderSimilar(prop) {
  const similar = getProperties().filter(p => p.id !== prop.id && (p.type === prop.type || p.gov === prop.gov)).slice(0,3);
  const grid = document.getElementById('similarGrid');
  if (grid) grid.innerHTML = similar.map(renderPropertyCard).join('') || '<p style="color:var(--text-muted)">لا توجد عقارات مشابهة حالياً.</p>';
}

function submitPurchaseRequest(name, phone) {
  const form = document.createElement('form');
  form.action = 'https://formspree.io/f/xnjwqvyr';
  form.method = 'POST';
  
  const data = {
    "الاسم": name,
    "الهاتف": phone,
    "نوع الطلب": "طلب شراء عقار",
    "العقار": currentProp?.title,
    "رابط العقار": window.location.href,
    "_subject": "🛒 طلب شراء جديد: " + name
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

  showToast('تم إرسال طلبك بنجاح! سيقوم المدير بالتواصل معك قريباً ✅', 'success');
  closeModal('purchaseModal');
}

function sendInquiry() {
  const name  = document.getElementById('inquiryName').value.trim();
  const phone = document.getElementById('inquiryPhone').value.trim();
  if (!name || !phone) { showToast('يرجى ملء الاسم ورقم الهاتف', 'error'); return; }
  
  const messages = JSON.parse(localStorage.getItem('aqari_support_messages') || '[]');
  messages.unshift({
    id: Date.now(),
    type: 'purchase_request',
    name,
    phone,
    propId: currentProp?.id,
    propTitle: currentProp?.title,
    date: new Date().toISOString()
  });
  localStorage.setItem('aqari_support_messages', JSON.stringify(messages));
  
  closeModal('contactModal');
  showToast('تم إرسال طلب الشراء للإدارة بنجاح! سيتم التواصل معك قريباً ✅', 'success');
}

function deleteCurrentProp() {
  if (!currentProp) return;
  confirmDialog('هل أنت متأكد من حذف هذا العقار نهائياً؟', () => {
    deleteProperty(currentProp.id);
    showToast('تم حذف العقار', 'info');
    setTimeout(() => { window.location.href = 'properties.html'; }, 1000);
  });
}

document.addEventListener('DOMContentLoaded', loadProperty);
