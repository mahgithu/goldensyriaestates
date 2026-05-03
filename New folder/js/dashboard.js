// ===== DASHBOARD.JS =====
function loadDashboard() {
  if (!requireAdmin()) return;
  const props = getProperties();
  const contacts = getContacts();

  animateVal('statProps', props.length);
  animateVal('statContacts', contacts.length);
  animateVal('statViews', props.reduce((s, p) => s + (p.views || 0), 0));
  animateVal('statFeatured', props.filter(p => p.featured).length);

  // Properties table
  const tbody = document.getElementById('propsTableBody');
  if (tbody) {
    const curr = getPreferredCurrency();
    tbody.innerHTML = props.slice(0, 10).map(p => {
      const price = convertPrice(p.price, p.currency || 'SYP', curr);
      return `<tr><td><div class="td-title">${p.title}</div></td><td>${getGovName(p.gov)}</td><td>${getListingName(p.listing)}</td><td style="color:var(--gold-400);font-weight:700">${formatPrice(price, curr)}</td><td>${p.views || 0}</td><td><a href="property-detail.html?id=${p.id}" class="btn btn-ghost btn-sm">عرض</a> <button onclick="deleteProp(${p.id})" class="btn btn-danger btn-sm">حذف</button></td></tr>`;
    }).join('');
  }

  // Users table
  const uBody = document.getElementById('usersTableBody');
  if (uBody) {
    uBody.innerHTML = getUsers().map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.phone || '—'}</td><td>${new Date(u.date).toLocaleDateString('ar-SY')}</td></tr>`).join('');
  }

  // Support messages
  const sLog = document.getElementById('supportMessagesLog');
  const sBadge = document.getElementById('unreadMessagesBadge');
  const msgs = JSON.parse(localStorage.getItem('aqari_support_messages') || '[]');
  if (sBadge) sBadge.textContent = msgs.length;
  if (sLog) {
    sLog.innerHTML = msgs.length ? msgs.map(m => `<div style="padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:8px"><strong>${m.name}</strong> - ${m.phone}<br><small style="color:var(--text-muted)">${m.msg}</small></div>`).join('') : '<p style="color:var(--text-muted);text-align:center">لا توجد رسائل</p>';
  }

  // Exchange rate settings
  const exDiv = document.getElementById('exchangeRateSettings');
  if (exDiv) {
    exDiv.innerHTML = `<div class="table-card" style="margin-top:20px"><div class="table-card-header"><h3>💱 سعر الصرف</h3></div><div style="padding:20px"><div class="form-row"><div class="form-group"><label>1 دولار = ؟ ليرة</label><input type="number" id="exRate" class="form-control" value="${EXCHANGE_RATE.USD_TO_SYP}"></div><div class="form-group" style="display:flex;align-items:flex-end"><button class="btn btn-primary" onclick="saveExRate()">حفظ</button></div></div></div></div>`;
  }
}

function animateVal(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let c = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const t = setInterval(() => { c = Math.min(c + step, target); el.textContent = c.toLocaleString('ar-SY'); if (c >= target) clearInterval(t); }, 30);
}

function deleteProp(id) {
  confirmDialog('حذف العقار؟', () => { deleteProperty(id); loadDashboard(); });
}

function saveExRate() {
  const rate = parseInt(document.getElementById('exRate')?.value) || 25000;
  updateExchangeRate(rate);
  showToast('تم تحديث سعر الصرف', 'success');
}

document.addEventListener('DOMContentLoaded', loadDashboard);
