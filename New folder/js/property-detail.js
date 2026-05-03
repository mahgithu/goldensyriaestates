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
