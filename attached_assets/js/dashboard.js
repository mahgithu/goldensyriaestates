// ===== DASHBOARD PAGE =====

function loadDashboard() {
  if (!requireAdmin('index.html')) return;
  const props    = getProperties();
  const contacts = getContacts();
  const totalViews = props.reduce((s, p) => s + (p.views || 0), 0);
  const featured   = props.filter(p => p.featured).length;

  // Stat cards
  animateStatVal('statProps',    props.length);
  animateStatVal('statContacts', contacts.length);
  animateStatVal('statViews',    totalViews);
  animateStatVal('statFeatured', featured);

  document.getElementById('statPropsChange').textContent    = '↑ ' + props.filter(p => p.date && p.date >= thisMonth()).length + ' هذا الشهر';
  document.getElementById('statContactsChange').textContent = '↑ ' + contacts.filter(c => c.date && c.date >= thisMonth()).length + ' هذا الشهر';

  renderPropsTable(props);
  renderGovDistribution(props);
  renderTypeDistribution(props);
  renderWebhooksLog();
  renderUsersTable();
  if (isSuperAdmin()) {
    renderSupportMessages();
  } else {
    const supportCard = document.querySelector('#supportMessagesLog')?.closest('.table-card');
    if (supportCard) supportCard.style.display = 'none';
  }
}

function thisMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`;
}

function animateStatVal(elId, target) {
  const el = document.getElementById(elId);
  if (!el) return;
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('ar-SY');
    if (current >= target) clearInterval(timer);
  }, 30);
}

function renderPropsTable(props) {
  const tbody = document.getElementById('propsTableBody');
  if (!tbody) return;
  const latest = [...props].sort((a,b) => new Date(b.date||0) - new Date(a.date||0)).slice(0, 10);
  const listingColors = { sale:'badge-gold', rent:'badge-emerald', invest:'badge-indigo' };

  tbody.innerHTML = latest.map(p => `
    <tr>
      <td>
        <div class="td-title" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${p.title}">${p.title}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${new Date(p.date||Date.now()).toLocaleDateString('ar-SY')}</div>
      </td>
      <td>${getGovName(p.gov)}</td>
      <td><span class="badge ${listingColors[p.listing]||'badge-gold'}" style="font-size:0.72rem;">${getListingName(p.listing)}</span></td>
      <td style="color:var(--gold-400);font-weight:700;white-space:nowrap;">${formatPrice(p.price)}</td>
      <td>${(p.views||0).toLocaleString('ar-SY')}</td>
      <td>
        <div style="display:flex;gap:6px;">
          <a href="property-detail.html?id=${p.id}" class="btn btn-ghost btn-sm" style="padding:4px 10px;font-size:0.78rem;">عرض</a>
          <button class="btn btn-danger btn-sm" style="padding:4px 10px;font-size:0.78rem;" onclick="deletePropFromDash(${p.id})">حذف</button>
        </div>
      </td>
    </tr>`).join('');
}

function deletePropFromDash(id) {
  confirmDialog('هل تريد حذف هذا العقار؟', () => {
    deleteProperty(id);
    showToast('تم حذف العقار', 'info');
    loadDashboard();
  });
}

function renderGovDistribution(props) {
  const el = document.getElementById('govDistribution');
  if (!el) return;
  const govCount = {};
  props.forEach(p => { govCount[p.gov] = (govCount[p.gov]||0)+1; });
  const sorted = Object.entries(govCount).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const max = sorted[0]?.[1] || 1;

  el.innerHTML = sorted.map(([gov, count]) => `
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:0.85rem;">
        <span>${getGovName(gov)}</span>
        <strong>${count} عقار</strong>
      </div>
      <div style="background:rgba(255,255,255,0.06);border-radius:4px;height:8px;overflow:hidden;">
        <div style="height:100%;width:${(count/max*100).toFixed(0)}%;background:linear-gradient(90deg,var(--gold-500),var(--gold-400));border-radius:4px;transition:width 1s ease;"></div>
      </div>
    </div>`).join('') || '<p style="color:var(--text-muted);font-size:0.85rem;">لا توجد بيانات</p>';
}

function renderTypeDistribution(props) {
  const el = document.getElementById('typeDistribution');
  if (!el) return;
  const typeCount = {};
  props.forEach(p => { typeCount[p.type] = (typeCount[p.type]||0)+1; });
  const colors = ['#C9A227','#6366F1','#10B981','#F59E0B','#F43F5E','#8B5CF6','#06B6D4','#84CC16'];

  el.innerHTML = Object.entries(typeCount).map(([type,count],i) => `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
      <div style="width:12px;height:12px;border-radius:50%;background:${colors[i%colors.length]};flex-shrink:0;"></div>
      <span style="flex:1;font-size:0.85rem;color:var(--text-secondary);">${getTypeIcon(type)} ${getTypeName(type)}</span>
      <strong style="font-size:0.85rem;">${count}</strong>
    </div>`).join('') || '<p style="color:var(--text-muted);font-size:0.85rem;">لا توجد بيانات</p>';
}

function renderWebhooksLog() {
  const el = document.getElementById('webhooksLog');
  if (!el) return;
  const logs = JSON.parse(localStorage.getItem('aqari_webhooks') || '[]');
  if (!logs.length) { el.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;">لا توجد أحداث بعد</p>'; return; }
  el.innerHTML = logs.slice(0,10).map(log => `
    <div style="padding:10px;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:8px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span class="badge badge-emerald" style="font-size:0.72rem;">${log.event}</span>
        <span style="font-size:0.72rem;color:var(--text-muted);">${new Date(log.timestamp).toLocaleTimeString('ar-SY')}</span>
      </div>
      <p style="font-size:0.78rem;color:var(--text-muted);">ID: ${log.data?.id || '—'} — ${log.data?.title?.substring(0,30)||''}...</p>
    </div>`).join('');
}

function renderUsersTable() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;
  const users = getUsers().sort((a,b) => new Date(b.date||0) - new Date(a.date||0));
  
  tbody.innerHTML = users.map(u => `
    <tr>
      <td>
        <div style="font-weight:700;">${u.name}</div>
        ${u.role === 'admin' ? '<span class="badge badge-gold" style="font-size:0.7rem;margin-top:4px;">مدير النظام</span>' : ''}
      </td>
      <td style="color:var(--text-secondary);">${u.email === 'admin@aqari.com' && !isSuperAdmin() ? '••••@aqari.com' : u.email}</td>
      <td>${u.phone || '—'}</td>
      <td>
        <div style="font-size:0.85rem;">تاريخ التسجيل: ${new Date(u.date||Date.now()).toLocaleDateString('ar-SY')}</div>
        ${u.lastLogin ? `<div style="font-size:0.75rem;color:var(--emerald);margin-top:4px;">آخر دخول: ${new Date(u.lastLogin).toLocaleDateString('ar-SY')} ${new Date(u.lastLogin).toLocaleTimeString('ar-SY')}</div>` : '<div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">لم يسجل الدخول</div>'}
      </td>
    </tr>
  `).join('') || '<tr><td colspan="4" style="text-align:center;">لا يوجد عملاء مسجلين</td></tr>';
}

function renderSupportMessages() {
  const el = document.getElementById('supportMessagesLog');
  const badge = document.getElementById('unreadMessagesBadge');
  if (!el) return;
  
  // Debug log to console (visible in DevTools)
  const rawData = localStorage.getItem('aqari_support_messages');
  console.log('Support Messages Raw Data:', rawData);
  
  const messages = JSON.parse(rawData || '[]');
  
  if (badge) badge.textContent = messages.length;
  
  if (!messages.length) { 
    el.innerHTML = `
      <div style="text-align:center;padding:20px;border:1px dashed var(--border);border-radius:12px;">
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:16px;">لا توجد رسائل حالياً</p>
        <div style="display:flex;flex-direction:column;gap:10px;max-width:200px;margin:0 auto;">
          <button class="btn btn-outline btn-sm" onclick="loadDashboard()">🔄 تحديث القائمة</button>
          <button class="btn btn-primary btn-sm" onclick="createManualTestMsg()">🧪 إضافة رسالة تجربة</button>
        </div>
      </div>`; 
    return; 
  }
  
  el.innerHTML = `
    <div style="margin-bottom:12px;text-align:left;">
      <button class="btn btn-ghost btn-sm" onclick="loadDashboard()" style="font-size:0.7rem;">🔄 تحديث</button>
    </div>
    ` + messages.map(msg => `
    <div style="padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:8px;margin-bottom:10px;animation: fadeIn 0.3s ease;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span class="badge ${msg.type === 'purchase_request' ? 'badge-gold' : 'badge-indigo'}" style="font-size:0.72rem;">
          ${msg.type === 'purchase_request' ? '🛒 طلب شراء' : '💬 رسالة دعم'}
        </span>
        <span style="font-size:0.72rem;color:var(--text-muted);">${new Date(msg.date).toLocaleDateString('ar-SY')}</span>
      </div>
      <div style="font-weight:700;font-size:0.9rem;margin-bottom:4px;color:var(--text-primary);">${msg.name}</div>
      <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;">📱 ${msg.phone}</div>
      
      ${msg.type === 'purchase_request' ? `
        <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:4px;padding:8px;background:rgba(201,162,39,0.05);border-radius:4px;">
          <strong>العقار:</strong> <a href="property-detail.html?id=${msg.propId}" style="color:var(--gold-400);">${msg.propTitle}</a>
        </div>
      ` : `
        <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;line-height:1.5;white-space:pre-wrap;">${msg.msg}</div>
      `}
      
      <div style="margin-top:12px;display:flex;gap:8px;">
        <a href="https://wa.me/963${msg.phone.replace(/^0/,'')}" target="_blank" class="btn btn-primary btn-sm" style="flex:1;justify-content:center;font-size:0.75rem;">واتساب</a>
        <button onclick="deleteSupportMsg(${msg.id})" class="btn btn-ghost btn-sm" style="color:var(--rose);font-size:0.75rem;">حذف</button>
      </div>
    </div>
  `).join('');
}

window.deleteSupportMsg = function(id) {
  confirmDialog('هل أنت متأكد من حذف هذه الرسالة؟', () => {
    let messages = JSON.parse(localStorage.getItem('aqari_support_messages') || '[]');
    messages = messages.filter(m => m.id !== id);
    localStorage.setItem('aqari_support_messages', JSON.stringify(messages));
    renderSupportMessages();
    showToast('تم حذف الرسالة', 'info');
  });
};

window.createManualTestMsg = function() {
  const messages = JSON.parse(localStorage.getItem('aqari_support_messages') || '[]');
  messages.unshift({
    id: Date.now(),
    type: 'support_message',
    name: 'عميل تجريبي',
    phone: '0912345678',
    msg: 'هذه رسالة تجريبية تم إنشاؤها من لوحة التحكم للتأكد من عمل النظام.',
    date: new Date().toISOString()
  });
  localStorage.setItem('aqari_support_messages', JSON.stringify(messages));
  renderSupportMessages();
  showToast('تم إنشاء رسالة تجريبية بنجاح!', 'success');
};

document.addEventListener('DOMContentLoaded', loadDashboard);
