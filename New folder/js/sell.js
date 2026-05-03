// ===== SELL.JS — إضافة عقار مع رفع الصور المصحح =====

let selectedImages = [];
const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function initSellPage() {
  const user = getCurrentUser();
  if (!user) {
    showToast('يرجى تسجيل الدخول أولاً', 'error');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }

  // Populate selects
  const typeSel = document.getElementById('propType');
  const govSel = document.getElementById('propGov');

  PROPERTY_TYPES.forEach(t => {
    const o = document.createElement('option');
    o.value = t.id;
    o.textContent = t.icon + ' ' + t.name;
    if (typeSel) typeSel.appendChild(o);
  });

  GOVERNORATES.forEach(g => {
    const o = document.createElement('option');
    o.value = g.id;
    o.textContent = g.icon + ' ' + g.name;
    if (govSel) govSel.appendChild(o);
  });

  // Features
  const features = ['موقف سيارة', 'تكييف مركزي', 'مولد كهربائي', 'مصعد', 'شرفة', 'حديقة', 'مسبح', 'أمن 24/7', 'ديكور فاخر', 'مفروشة'];
  const featGrid = document.getElementById('featuresGrid');
  if (featGrid) {
    featGrid.innerHTML = features.map(f => `
      <label style="display:flex;align-items:center;gap:8px;padding:8px 14px;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:8px;cursor:pointer;">
        <input type="checkbox" value="${f}" style="accent-color:var(--gold-500);">
        <span style="font-size:0.88rem;">${f}</span>
      </label>`).join('');
  }

  // Auto-fill agent
  if (user) {
    const n = document.getElementById('agentName');
    const p = document.getElementById('agentPhone');
    const e = document.getElementById('agentEmail');
    if (n) n.value = user.name || '';
    if (p) p.value = user.phone || '';
    if (e) e.value = user.email || '';
  }

  // Image upload events
  setupImageUpload();
}

function setupImageUpload() {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('propImages');

  if (!uploadArea || !fileInput) return;

  // Click to upload
  uploadArea.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    fileInput.click();
  };

  // File input change
  fileInput.onchange = function (e) {
    e.preventDefault();
    if (this.files && this.files.length > 0) {
      processFiles(this.files);
    }
    this.value = ''; // Reset for re-select
  };

  // Drag and drop
  uploadArea.ondragover = function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.borderColor = 'var(--gold-500)';
    this.style.background = 'rgba(201,162,39,0.1)';
  };

  uploadArea.ondragleave = function (e) {
    e.preventDefault();
    this.style.borderColor = 'var(--border)';
    this.style.background = 'transparent';
  };

  uploadArea.ondrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.borderColor = 'var(--border)';
    this.style.background = 'transparent';

    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };
}

function processFiles(files) {
  const previewGrid = document.getElementById('imagePreviewGrid');
  if (!previewGrid) return;

  let addedCount = 0;

  Array.from(files).forEach(file => {
    // Validate type
    if (!file.type || !file.type.startsWith('image/')) {
      showToast(`"${file.name}" ليس ملف صورة`, 'error');
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      showToast(`"${file.name}" أكبر من 2MB`, 'error');
      return;
    }

    // Check limit
    if (selectedImages.length >= MAX_IMAGES) {
      showToast(`الحد الأقصى ${MAX_IMAGES} صور`, 'error');
      return;
    }

    // Read file
    const reader = new FileReader();

    reader.onload = function (e) {
      if (e.target && e.target.result) {
        selectedImages.push({
          name: file.name,
          data: e.target.result
        });
        addedCount++;
        renderPreviews();
      }
    };

    reader.onerror = function () {
      showToast(`خطأ في قراءة "${file.name}"`, 'error');
    };

    reader.readAsDataURL(file);
  });

  if (addedCount > 0) {
    showToast(`تم إضافة ${addedCount} صورة ✅`, 'success');
  }
}

function renderPreviews() {
  const grid = document.getElementById('imagePreviewGrid');
  if (!grid) return;

  if (selectedImages.length === 0) {
    grid.innerHTML = '';
    return;
  }

  grid.innerHTML = selectedImages.map((img, i) => `
    <div style="position:relative;width:100px;height:100px;border-radius:8px;overflow:hidden;border:2px solid var(--border);flex-shrink:0;">
      <img src="${img.data}" alt="${img.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23333%22 width=%22100%22 height=%22100%22/><text fill=%22%23999%22 x=%2250%22 y=%2250%22 text-anchor=%22middle%22>صورة</text></svg>'">
      <button type="button" onclick="removeImage(${i})" style="position:absolute;top:4px;left:4px;width:24px;height:24px;background:rgba(244,63,94,0.9);color:#fff;border:none;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;cursor:pointer;line-height:1;">✕</button>
      ${i === 0 ? '<span style="position:absolute;bottom:0;left:0;right:0;background:var(--gold-500);color:var(--navy-900);font-size:0.65rem;font-weight:700;text-align:center;padding:2px;">رئيسية</span>' : ''}
    </div>
  `).join('');

  // Update upload area text
  const uploadArea = document.getElementById('uploadArea');
  if (uploadArea) {
    const textDiv = uploadArea.querySelector('div > div');
    if (textDiv) {
      textDiv.textContent = `تم اختيار ${selectedImages.length} صورة — اضغط لإضافة المزيد`;
    }
  }
}

function removeImage(index) {
  if (index >= 0 && index < selectedImages.length) {
    selectedImages.splice(index, 1);
    renderPreviews();
    showToast('تم حذف الصورة', 'info');
  }
}

function submitProperty() {
  // Validation
  const title = document.getElementById('propTitle')?.value.trim();
  const type = document.getElementById('propType')?.value;
  const listing = document.getElementById('propListing')?.value;
  const desc = document.getElementById('propDesc')?.value.trim();
  const gov = document.getElementById('propGov')?.value;
  const area = parseFloat(document.getElementById('propArea')?.value);
  const price = parseFloat(document.getElementById('propPrice')?.value);
  const agent = document.getElementById('agentName')?.value.trim();
  const phone = document.getElementById('agentPhone')?.value.trim();
  const commissionAgree = document.getElementById('commissionAgree')?.checked;

  if (!title) { showToast('يرجى إدخال عنوان الإعلان', 'error'); return; }
  if (!type) { showToast('يرجى اختيار نوع العقار', 'error'); return; }
  if (!listing) { showToast('يرجى اختيار نوع العرض', 'error'); return; }
  if (!desc) { showToast('يرجى كتابة وصف العقار', 'error'); return; }
  if (!gov) { showToast('يرجى اختيار المحافظة', 'error'); return; }
  if (!area || area <= 0) { showToast('يرجى إدخال المساحة', 'error'); return; }
  if (!price || price <= 0) { showToast('يرجى إدخال السعر', 'error'); return; }
  if (!agent) { showToast('يرجى إدخال اسمك', 'error'); return; }
  if (!phone) { showToast('يرجى إدخال رقم الهاتف', 'error'); return; }
  if (!commissionAgree) { showToast('يرجى الموافقة على شروط العمولة', 'error'); return; }

  // Collect features
  const features = [];
  document.querySelectorAll('#featuresGrid input:checked').forEach(cb => {
    features.push(cb.value);
  });

  // Create property
  const props = getProperties();
  const newId = props.length > 0 ? Math.max(...props.map(p => p.id)) + 1 : 1;

  const newProp = {
    id: newId,
    title,
    type,
    listing,
    gov,
    city: document.getElementById('propCity')?.value.trim() || '',
    area,
    price,
    currency: 'USD', // الدولار افتراضي
    desc,
    features,
    rooms: parseInt(document.getElementById('propRooms')?.value) || 0,
    baths: parseInt(document.getElementById('propBaths')?.value) || 0,
    floor: parseInt(document.getElementById('propFloor')?.value) || 0,
    year: parseInt(document.getElementById('propYear')?.value) || 0,
    agent,
    agentPhone: phone,
    agentEmail: document.getElementById('agentEmail')?.value.trim() || '',
    images: selectedImages.map(img => img.data),
    featured: false,
    views: 0,
    date: new Date().toISOString().split('T')[0]
  };

  saveProperty(newProp);
  showToast('تم نشر إعلانك بنجاح! 🎉', 'success');

  // Show success modal
  setTimeout(() => {
    openModal('successModal');
  }, 500);
}

function resetForm() {
  const fields = ['propTitle', 'propType', 'propListing', 'propDesc', 'propGov', 'propCity', 'propArea', 'propPrice', 'propRooms', 'propBaths', 'propFloor', 'propYear'];
  fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

  const commission = document.getElementById('commissionAgree');
  if (commission) commission.checked = false;

  document.querySelectorAll('#featuresGrid input').forEach(cb => cb.checked = false);

  selectedImages = [];
  renderPreviews();
}

document.addEventListener('DOMContentLoaded', initSellPage);
