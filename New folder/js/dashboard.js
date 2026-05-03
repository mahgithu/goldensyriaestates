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
      const propCurrency = p.currency || 'USD';
      const price = (propCurrency === curr) ? p.price : convertPrice(p.price, propCurrency, curr);
      return `<tr>
        <td><div style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.title}</div></td>
        <td>${getGovName(p.gov)}</td>
        <td>${getListingName(p.listing)}</td>
        <td style="color:var(--gold-400);font-weight:700;">${formatPrice(price, curr)}</td>
        <td>${p.views || 0}</td>
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
      <td>${u.phone || '—'}</td>
      <td>${new Date(u.date).toLocaleDateString('ar-SY')}</td>
    </tr>`).join('');
  }

  // Support messages
  const sLog = document.getElementById('supportMessagesLog');
  const sBadge = document.getElementById('unreadMessagesBadge');
  const msgs = JSON.parse(localStorage.getItem('aqari_support_messages') || '[]');
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
  const step = Math.max(1, Math.ceil(target / 40));
  const t = setInterval(() => {
    c = Math.min(c + step, target);
    el.textContent = c.toLocaleString();
    if (c >= target) clearInterval(t);
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
