// ===== HOME PAGE =====

function doHeroSearch() {
  const gov    = document.getElementById('searchGov').value;
  const type   = document.getElementById('searchType').value;
  const budget = document.getElementById('searchBudget').value;
  const tab    = document.querySelector('.search-tab.active')?.dataset.type || '';
  const params = new URLSearchParams();
  if (gov)    params.set('gov', gov);
  if (type)   params.set('type', type);
  if (budget) params.set('budget', budget);
  if (tab)    params.set('listing', tab);
  window.location.href = 'properties.html?' + params.toString();
}

// Search tab switching
document.querySelectorAll('.search-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.search-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Enter key search
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('heroSearchBtn')) doHeroSearch();
});

// ===== FEATURED PROPERTIES =====
function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const featured = getProperties().filter(p => p.featured).slice(0, 6);
  if (!featured.length) {
    grid.innerHTML = '<div class="empty-state"><p>لا توجد عقارات مميزة حالياً</p></div>';
    return;
  }
  grid.innerHTML = featured.map(renderPropertyCard).join('');
}

// ===== GOVERNORATES GRID =====
function renderGovGrid() {
  const grid = document.getElementById('govGrid');
  if (!grid) return;
  grid.innerHTML = GOVERNORATES.map(g => `
    <a href="properties.html?gov=${g.id}" class="gov-card hover-lift">
      <div class="gov-icon">${g.icon}</div>
      <div class="gov-name">${g.name}</div>
      <div class="gov-count">${g.count} عقار</div>
    </a>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  renderGovGrid();
});
