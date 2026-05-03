// ===== PROPERTY-DETAIL.JS =====
function loadDetail() {
  const id = parseInt(new URLSearchParams(window.location.search).get('id'));
  if (!id) return;
  const prop = getProperties().find(p => p.id === id);
  if (!prop) return;

  prop.views = (prop.views || 0) + 1;
  saveProperty(prop);

  const curr = getPreferredCurrency();
  const price = convertPrice(prop.price, prop.currency || 'SYP', curr);
  const icon = getTypeIcon(prop.type);
  const hasImg = prop.images && prop.images.length > 0;

  document.getElementById('breadcrumbTitle').textContent = prop.title;

  const mainImg = document.getElementById('mainImg');
  mainImg.innerHTML = hasImg ? `<img src="${prop.images[0]}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="text-align:center"><span style="font-size:5rem">${icon}</span><br><span style="color:var(--text-muted)">${getTypeName(prop.type)}</span></div>`;

  document.getElementById('propHeader').innerHTML = `
    <h1 style="font-size:1.6rem;font-weight:800">${prop.title}</h1>
    <div style="color:var(--text-muted);margin:8px 0">📍 ${getGovName(prop.gov)}${prop.city ? ' — ' + prop.city : ''}</div>
    <div style="font-size:1.8rem;font-weight:900;color:var(--gold-400)">${formatPrice(price, curr)}</div>
    <div style="color:var(--text-muted);font-size:0.85rem">👁 ${prop.views || 0} مشاهدة</div>`;

  const specs = [];
  if (prop.area) specs.push({ v: prop.area + ' م²', l: 'المساحة' });
  if (prop.rooms) specs.push({ v: prop.rooms, l: 'غرف' });
  if (prop.baths) specs.push({ v: prop.baths, l: 'حمام' });
  document.getElementById('propSpecs').innerHTML = specs.length ? `<div class="detail-specs">${specs.map(s => `<div class="spec-item"><div class="spec-value">${s.v}</div><div class="spec-label">${s.l}</div></div>`).join('')}</div>` : '';

  document.getElementById('propDesc').innerHTML = `<h3 style="font-weight:700;margin-bottom:12px">📝 الوصف</h3><p style="color:var(--text-secondary);line-height:1.8">${prop.desc || 'لا يوجد وصف'}</p>`;

  if (prop.features && prop.features.length) {
    document.getElementById('propFeatures').innerHTML = `<h3 style="font-weight:700;margin-bottom:12px">✅ المميزات</h3><div style="display:flex;flex-wrap:wrap;gap:8px">${prop.features.map(f => `<span class="badge badge-gold">${f}</span>`).join('')}</div>`;
  }

  document.getElementById('contactCard').innerHTML = `
    <h3>معلومات التواصل</h3>
    <div class="agent-info"><div class="agent-avatar">${(prop.agent || 'و').charAt(0)}</div><div><div class="agent-name">${prop.agent || 'وكيل'}</div></div></div>
    <div class="detail-actions">
      <a href="tel:${prop.agentPhone || ''}" class="btn btn-success" style="flex:1;justify-content:center">📞 اتصال</a>
      <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="openModal('contactModal')">💬 استفسار</button>
    </div>`;

  // Similar
  const similar = getProperties().filter(p => p.id !== id && (p.type === prop.type || p.gov === prop.gov)).slice(0, 3);
  document.getElementById('similarGrid').innerHTML = similar.map(p => renderPropertyCard(p)).join('');
}

function sendInquiry() {
  const n = document.getElementById('inquiryName')?.value.trim();
  const p = document.getElementById('inquiryPhone')?.value.trim();
  const m = document.getElementById('inquiryMsg')?.value.trim();
  if (!n || !p) { showToast('يرجى إدخال الاسم والهاتف', 'error'); return; }
  const id = parseInt(new URLSearchParams(window.location.search).get('id'));
  const prop = getProperties().find(x => x.id === id);
  const msgs = JSON.parse(localStorage.getItem('aqari_support_messages') || '[]');
  msgs.unshift({ id: Date.now(), type: 'inquiry', name: n, phone: p, msg: m, propId: id, propTitle: prop?.title || '', date: new Date().toISOString() });
  localStorage.setItem('aqari_support_messages', JSON.stringify(msgs));
  showToast('تم إرسال استفسارك ✅', 'success');
  closeModal('contactModal');
}

document.addEventListener('DOMContentLoaded', loadDetail);
