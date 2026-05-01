// ===== SELL PAGE =====

const FEATURES_OPTIONS = [
  'موقف سيارة','مصعد','تكييف مركزي','مولد كهربائي','خزان مياه',
  'حديقة خاصة','مسبح','شرفة','تراس','بئر مياه','كراج مغطى',
  'أمن وحراسة','واي فاي مشترك','غرفة خادمة','مطبخ مجهز',
  'ديكور فاخر','تشطيب سوبر لوكس','إطلالة مميزة','وثائق قانونية كاملة','مسورة',
];

let selectedFeatures = [];
let uploadedImages = [];

// Image Upload Handlers
function handleImageDrop(e) {
  e.preventDefault();
  e.currentTarget.style.borderColor = 'var(--border)';
  e.currentTarget.style.background = 'transparent';
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    processFiles(e.dataTransfer.files);
  }
}

function handleImageSelect(e) {
  if (e.target.files && e.target.files.length > 0) {
    processFiles(e.target.files);
  }
}

function processFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) {
      showToast('يرجى رفع ملفات صور فقط', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImages.push(e.target.result);
      renderImagePreviews();
    };
    reader.readAsDataURL(file);
  });
}

function renderImagePreviews() {
  const grid = document.getElementById('imagePreviewGrid');
  if (!grid) return;
  grid.innerHTML = uploadedImages.map((src, index) => `
    <div style="position:relative;width:100px;height:100px;border-radius:8px;overflow:hidden;border:1px solid var(--border);">
      <img src="${src}" style="width:100%;height:100%;object-fit:cover;">
      <button type="button" onclick="event.stopPropagation(); removeImage(${index})" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);color:#fff;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;padding:0;">✕</button>
    </div>
  `).join('');
}

function removeImage(index) {
  uploadedImages.splice(index, 1);
  renderImagePreviews();
}

function buildSellForm() {
  if (!requireAuth('login.html')) return;

  // Types
  const typeEl = document.getElementById('propType');
  PROPERTY_TYPES.forEach(t => {
    const o = document.createElement('option');
    o.value = t.id; o.textContent = t.icon + ' ' + t.name;
    typeEl?.appendChild(o);
  });
  // Govs
  const govEl = document.getElementById('propGov');
  GOVERNORATES.forEach(g => {
    const o = document.createElement('option');
    o.value = g.id; o.textContent = g.icon + ' ' + g.name;
    govEl?.appendChild(o);
  });
  // Features checkboxes
  const featGrid = document.getElementById('featuresGrid');
  if (featGrid) {
    featGrid.innerHTML = FEATURES_OPTIONS.map(f => `
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:8px 12px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;transition:var(--transition);"
             onmouseenter="this.style.borderColor='var(--gold-500)'" onmouseleave="this.style.borderColor=selectedFeatures.includes('${f}')?'var(--gold-500)':'var(--border)'">
        <input type="checkbox" value="${f}" onchange="toggleFeature('${f}',this)" style="accent-color:var(--gold-500);width:16px;height:16px;">
        <span style="font-size:0.88rem;">${f}</span>
      </label>`).join('');
  }

  // Commission calculation
  const priceInput = document.getElementById('propPrice');
  const commissionDisplay = document.getElementById('commissionDisplay');
  if (priceInput && commissionDisplay) {
    priceInput.addEventListener('input', (e) => {
      const price = parseInt(e.target.value) || 0;
      if (price > 0) {
        const commission = price * 0.02;
        commissionDisplay.textContent = 'العمولة المستحقة للمنصة (2%): ' + formatPrice(commission);
        commissionDisplay.style.display = 'block';
      } else {
        commissionDisplay.style.display = 'none';
      }
    });
  }
}

function toggleFeature(f, checkbox) {
  if (checkbox.checked) selectedFeatures.push(f);
  else selectedFeatures = selectedFeatures.filter(x => x !== f);
  checkbox.closest('label').style.borderColor = checkbox.checked ? 'var(--gold-500)' : 'var(--border)';
  checkbox.closest('label').style.background   = checkbox.checked ? 'rgba(201,162,39,0.08)' : 'rgba(255,255,255,0.04)';
}

function validateForm() {
  const required = [
    { id:'propTitle',   label:'عنوان الإعلان'   },
    { id:'propType',    label:'نوع العقار'       },
    { id:'propListing', label:'نوع العرض'        },
    { id:'propDesc',    label:'وصف العقار'       },
    { id:'propGov',     label:'المحافظة'         },
    { id:'propArea',    label:'المساحة'          },
    { id:'propPrice',   label:'السعر'            },
    { id:'agentName',   label:'اسمك'             },
    { id:'agentPhone',  label:'رقم الهاتف'      },
  ];
  for (const r of required) {
    const el = document.getElementById(r.id);
    if (!el || !el.value.trim()) {
      showToast(`يرجى ملء حقل: ${r.label}`, 'error');
      el?.focus(); return false;
    }
  }

  const commissionAgree = document.getElementById('commissionAgree');
  if (commissionAgree && !commissionAgree.checked) {
    showToast('يرجى التعهد بدفع عمولة المنصة', 'error');
    commissionAgree.focus(); return false;
  }

  return true;
}

function submitProperty() {
  if (!validateForm()) return;
  const prop = {
    id:      Date.now(),
    title:   document.getElementById('propTitle').value.trim(),
    type:    document.getElementById('propType').value,
    listing: document.getElementById('propListing').value,
    desc:    document.getElementById('propDesc').value.trim(),
    gov:     document.getElementById('propGov').value,
    city:    document.getElementById('propCity').value.trim(),
    area:    parseInt(document.getElementById('propArea').value) || 0,
    price:   parseInt(document.getElementById('propPrice').value) || 0,
    rooms:   parseInt(document.getElementById('propRooms').value) || 0,
    baths:   parseInt(document.getElementById('propBaths').value) || 0,
    floor:   parseInt(document.getElementById('propFloor').value) || 0,
    year:    parseInt(document.getElementById('propYear').value) || 0,
    features: selectedFeatures,
    agent:   document.getElementById('agentName').value.trim(),
    agentPhone: document.getElementById('agentPhone').value.trim(),
    agentEmail: document.getElementById('agentEmail').value.trim(),
    featured: false,
    views:   0,
    date:    new Date().toISOString().split('T')[0],
    images:  uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'],
  };
  saveProperty(prop);
  // Webhook dispatch simulation
  dispatchWebhook('property.created', prop);
  openModal('successModal');
}

function previewProperty() {
  const title = document.getElementById('propTitle').value.trim();
  const price = document.getElementById('propPrice').value;
  const gov   = document.getElementById('propGov').value;
  if (!title) { showToast('أدخل عنوان الإعلان أولاً', 'info'); return; }
  showToast(`معاينة: "${title}" — ${formatPrice(parseInt(price)||0)} — ${getGovName(gov)}`, 'info');
}

function resetForm() {
  ['propTitle','propType','propListing','propDesc','propGov','propCity','propArea','propPrice','propRooms','propBaths','propFloor','propYear','agentName','agentPhone','agentEmail'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  selectedFeatures = [];
  document.querySelectorAll('#featuresGrid input[type=checkbox]').forEach(cb => {
    cb.checked = false;
    cb.closest('label').style.borderColor = 'var(--border)';
    cb.closest('label').style.background  = 'rgba(255,255,255,0.04)';
  });
  uploadedImages = [];
  renderImagePreviews();
}

// Webhook simulation
function dispatchWebhook(event, data) {
  const log = JSON.parse(localStorage.getItem('aqari_webhooks') || '[]');
  log.unshift({ event, data, timestamp: new Date().toISOString(), status: 'delivered' });
  localStorage.setItem('aqari_webhooks', JSON.stringify(log.slice(0, 50)));
}

document.addEventListener('DOMContentLoaded', buildSellForm);
