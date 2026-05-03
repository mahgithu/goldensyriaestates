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
