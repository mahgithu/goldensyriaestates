// ===== PROPERTIES PAGE =====

let currentView = 'grid';
let activeFilters = { types:[], listings:[], govs:[], special:[] };

function buildFilters() {
  // Type filters
  const typeContainer = document.getElementById('typeFilters');
  if (typeContainer) {
    typeContainer.innerHTML = PROPERTY_TYPES.map(t => `
      <div class="filter-option" data-val="${t.id}" data-group="types" onclick="toggleFilter(this)">
        <div class="filter-checkbox"><svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" fill="none" stroke="#0A1628" stroke-width="2"/></svg></div>
        <span>${t.icon} ${t.name}</span>
      </div>`).join('');
  }
  // Gov filters
  const govContainer = document.getElementById('govFilters');
  if (govContainer) {
    govContainer.innerHTML = GOVERNORATES.map(g => `
      <div class="filter-option" data-val="${g.id}" data-group="govs" onclick="toggleFilter(this)">
        <div class="filter-checkbox"><svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" fill="none" stroke="#0A1628" stroke-width="2"/></svg></div>
        <span>${g.icon} ${g.name}</span>
      </div>`).join('');
  }
  // Quick filter dropdowns
  const govSel = document.getElementById('filterGov');
  if (govSel) GOVERNORATES.forEach(g => { const o=document.createElement('option'); o.value=g.id; o.textContent=g.name; govSel.appendChild(o); });
  const typeSel = document.getElementById('filterType');
  if (typeSel) PROPERTY_TYPES.forEach(t => { const o=document.createElement('option'); o.value=t.id; o.textContent=t.name; typeSel.appendChild(o); });
}

function toggleFilter(el) {
  el.classList.toggle('selected');
  const group = el.dataset.group;
  const val   = el.dataset.val;
  if (!activeFilters[group]) activeFilters[group] = [];
  const idx = activeFilters[group].indexOf(val);
  if (idx >= 0) activeFilters[group].splice(idx, 1);
  else activeFilters[group].push(val);
  applyFilters();
}

function applyFilters() {
  let props = getProperties();
  const q       = (document.getElementById('quickSearch')?.value || '').trim().toLowerCase();
  const govSel  = document.getElementById('filterGov')?.value;
  const typeSel = document.getElementById('filterType')?.value;
  const lstSel  = document.getElementById('filterListing')?.value;
  const prMin   = parseFloat(document.getElementById('priceMin')?.value) || 0;
  const prMax   = parseFloat(document.getElementById('priceMax')?.value) || Infinity;
  const arMin   = parseFloat(document.getElementById('areaMin')?.value) || 0;
  const arMax   = parseFloat(document.getElementById('areaMax')?.value) || Infinity;
  const sort    = document.getElementById('sortSelect')?.value || 'date-desc';

  if (q)       props = props.filter(p => p.title.toLowerCase().includes(q) || (p.city||'').toLowerCase().includes(q) || getGovName(p.gov).includes(q));
  if (govSel)  props = props.filter(p => p.gov === govSel);
  if (typeSel) props = props.filter(p => p.type === typeSel);
  if (lstSel)  props = props.filter(p => p.listing === lstSel);

  if (activeFilters.types?.length)    props = props.filter(p => activeFilters.types.includes(p.type));
  if (activeFilters.listings?.length) props = props.filter(p => activeFilters.listings.includes(p.listing));
  if (activeFilters.govs?.length)     props = props.filter(p => activeFilters.govs.includes(p.gov));
  if (activeFilters.special?.includes('featured')) props = props.filter(p => p.featured);

  props = props.filter(p => p.price >= prMin && p.price <= prMax && p.area >= arMin && p.area <= arMax);

  // Sort
  const [sortKey, sortDir] = sort.split('-');
  props.sort((a,b) => {
    const aVal = sortKey === 'date' ? new Date(a.date||0) : (a[sortKey]||0);
    const bVal = sortKey === 'date' ? new Date(b.date||0) : (b[sortKey]||0);
    return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
  });

  renderResults(props);
}

function renderResults(props) {
  const grid  = document.getElementById('propertiesGrid');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('resultsCount');
  if (!grid) return;
  if (count) count.textContent = props.length;
  if (!props.length) {
    grid.style.display = 'none';
    if (empty) empty.style.display = 'block';
    return;
  }
  grid.style.display = '';
  if (empty) empty.style.display = 'none';
  grid.innerHTML = props.map(renderPropertyCard).join('');
}

function setView(v) {
  currentView = v;
  const grid = document.getElementById('propertiesGrid');
  document.getElementById('gridViewBtn')?.classList.toggle('active', v==='grid');
  document.getElementById('listViewBtn')?.classList.toggle('active', v==='list');
  if (v === 'list') {
    grid.style.gridTemplateColumns = '1fr';
  } else {
    grid.style.gridTemplateColumns = '';
  }
}

function clearFilters() {
  activeFilters = { types:[], listings:[], govs:[], special:[] };
  document.querySelectorAll('.filter-option.selected').forEach(el => el.classList.remove('selected'));
  ['quickSearch','filterGov','filterType','filterListing','priceMin','priceMax','areaMin','areaMax'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  applyFilters();
}

// Read URL params on load
function readURLParams() {
  const params = new URLSearchParams(window.location.search);
  const gov  = params.get('gov');
  const type = params.get('type');
  const listing = params.get('listing');
  const budget = params.get('budget');

  if (gov) { const el = document.getElementById('filterGov'); if(el) el.value = gov; }
  if (type) { const el = document.getElementById('filterType'); if(el) el.value = type; }
  if (listing) { const el = document.getElementById('filterListing'); if(el) el.value = listing; }
  if (budget && budget !== '500+') {
    const [min, max] = budget.split('-').map(n => parseInt(n) * 1000000);
    const minEl = document.getElementById('priceMin');
    const maxEl = document.getElementById('priceMax');
    if (minEl) minEl.value = min || '';
    if (maxEl && max) maxEl.value = max;
  }
}

document.getElementById('quickSearch')?.addEventListener('input', applyFilters);

document.addEventListener('DOMContentLoaded', () => {
  buildFilters();
  readURLParams();
  applyFilters();
});
