// ===== HOME.JS =====
function initHomePage() {
  // Featured properties
  const grid = document.getElementById('featuredGrid');
  if (grid) {
    const featured = getProperties().filter(p => p.featured).slice(0, 6);
    grid.innerHTML = (featured.length ? featured : getProperties().slice(0, 6)).map(p => renderPropertyCard(p)).join('');
  }

  // Governorates
  const govGrid = document.getElementById('govGrid');
  if (govGrid) {
    const props = getProperties();
    govGrid.innerHTML = GOVERNORATES.map(g => {
      const count = props.filter(p => p.gov === g.id).length;
      return `<a href="properties.html?gov=${g.id}" class="gov-card"><div class="gov-icon">${g.icon}</div><div class="gov-name">${g.name}</div><div class="gov-count">${count} عقار</div></a>`;
    }).join('');
  }

  // Hero stats animation
  document.querySelectorAll('.hero-stat .stat-num').forEach(el => {
    const target = parseInt(el.dataset.count) || 0;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString('ar-SY') + '+';
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
    tab.addEventListener('click', function () {
      document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
