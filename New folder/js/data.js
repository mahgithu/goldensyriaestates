// ===== DATA STORE WITH USD CURRENCY =====

const GOVERNORATES = [
  { id:'damascus',     name:'دمشق',       icon:'🏛️' },
  { id:'aleppo',       name:'حلب',        icon:'🕌' },
  { id:'homs',         name:'حمص',        icon:'🏙️' },
  { id:'hama',         name:'حماة',       icon:'🌿' },
  { id:'latakia',      name:'اللاذقية',   icon:'🌊' },
  { id:'tartus',       name:'طرطوس',      icon:'⚓' },
  { id:'deir-ezzor',   name:'دير الزور',  icon:'🌾' },
  { id:'raqqa',        name:'الرقة',      icon:'🌅' },
  { id:'sweida',       name:'السويداء',   icon:'🏔️' },
  { id:'daraa',        name:'درعا',       icon:'🌻' },
  { id:'quneitra',     name:'القنيطرة',   icon:'🌄' },
  { id:'idlib',        name:'إدلب',       icon:'🌱' },
  { id:'hasakah',      name:'الحسكة',     icon:'🌿' },
  { id:'rif-damascus', name:'ريف دمشق',   icon:'🏡' },
];

const PROPERTY_TYPES = [
  { id:'apartment', name:'شقة',       icon:'🏢' },
  { id:'villa',     name:'فيلا',      icon:'🏰' },
  { id:'house',     name:'منزل',      icon:'🏠' },
  { id:'land',      name:'أرض',       icon:'🌍' },
  { id:'commercial',name:'محل تجاري', icon:'🏪' },
  { id:'farm',      name:'مزرعة',     icon:'🌾' },
  { id:'office',    name:'مكتب',      icon:'🏗️' },
  { id:'warehouse', name:'مستودع',    icon:'🏭' },
];

const LISTING_TYPES = [
  { id:'sale',   name:'للبيع' },
  { id:'rent',   name:'للإيجار' },
  { id:'invest', name:'للاستثمار' },
];

// ===== CURRENCY SYSTEM =====
const CURRENCIES = {
  SYP: { code: 'SYP', name: 'ليرة سورية', symbol: 'ل.س', flag: '🇸🇾' },
  USD: { code: 'USD', name: 'دولار أمريكي', symbol: '$', flag: '🇺🇸' }
};

let EXCHANGE_RATE = { USD_TO_SYP: 15000, SYP_TO_USD: 0.000067, lastUpdated: new Date().toISOString() };

function loadExchangeRate() {
  const saved = localStorage.getItem('aqari_exchange_rate');
  if (saved) { 
    try { 
      const p = JSON.parse(saved);
      EXCHANGE_RATE.USD_TO_SYP = p.USD_TO_SYP || 15000;
      EXCHANGE_RATE.SYP_TO_USD = 1 / EXCHANGE_RATE.USD_TO_SYP;
    } catch(e) {} 
  }
}

function saveExchangeRate() {
  EXCHANGE_RATE.lastUpdated = new Date().toISOString();
  localStorage.setItem('aqari_exchange_rate', JSON.stringify(EXCHANGE_RATE));
}

function updateExchangeRate(rate) {
  EXCHANGE_RATE.USD_TO_SYP = parseInt(rate) || 15000;
  EXCHANGE_RATE.SYP_TO_USD = 1 / EXCHANGE_RATE.USD_TO_SYP;
  saveExchangeRate();
}

function convertPrice(amount, from, to) {
  if (from === to) return Math.round(amount);
  amount = parseFloat(amount) || 0;
  if (from === 'SYP' && to === 'USD') return Math.round(amount / EXCHANGE_RATE.USD_TO_SYP);
  if (from === 'USD' && to === 'SYP') return Math.round(amount * EXCHANGE_RATE.USD_TO_SYP);
  return Math.round(amount);
}

function formatPrice(price, currency) {
  price = parseFloat(price) || 0;
  currency = currency || 'USD';
  
  if (currency === 'USD') {
    if (price >= 1000000) return '$' + (price / 1000000).toFixed(1) + 'M';
    if (price >= 1000) return '$' + (price / 1000).toFixed(0) + 'K';
    return '$' + price.toLocaleString('en-US');
  }
  
  if (price >= 1000000000) return (price / 1000000000).toFixed(1) + 'B SYP';
  if (price >= 1000000) return (price / 1000000).toFixed(0) + 'M SYP';
  return price.toLocaleString('en-US') + ' SYP';
}

function getPreferredCurrency() { 
  if (!localStorage.getItem('aqari_currency')) {
    localStorage.setItem('aqari_currency', 'USD'); // افتراضي: دولار
  }
  return localStorage.getItem('aqari_currency');
}

function setPreferredCurrency(c) { localStorage.setItem('aqari_currency', c); }

loadExchangeRate();

// ===== PROPERTIES (أسعار بالدولار) =====
let PROPERTIES = [
  { id:1, title:'شقة فاخرة في قلب دمشق — المزة', type:'apartment', listing:'sale', gov:'damascus', city:'المزة', area:180, rooms:4, baths:2, floor:8, price:30000, currency:'USD', year:2019, desc:'شقة راقية بتشطيب سوبر لوكس في أرقى أحياء دمشق.', features:['موقف سيارة','تكييف مركزي','مولد كهربائي'], agent:'أحمد الخطيب', agentPhone:'0991234567', featured:true, views:1240, date:'2025-11-15', images:[] },
  { id:2, title:'فيلا فخمة مع حديقة — المالكية', type:'villa', listing:'sale', gov:'damascus', city:'المالكية', area:420, rooms:6, baths:4, price:120000, currency:'USD', year:2020, desc:'فيلا استثنائية مع حديقة 300 م٢ ومسبح خاص.', features:['حديقة خاصة','مسبح','كراج'], agent:'سمر الأسعد', agentPhone:'0992345678', featured:true, views:890, date:'2025-11-20', images:[] },
  { id:3, title:'شقة مميزة للإيجار — حلب', type:'apartment', listing:'rent', gov:'aleppo', city:'شارع بغداد', area:140, rooms:3, baths:2, floor:4, price:1500, currency:'USD', year:2018, desc:'شقة نظيفة ومميزة في حي راقي بحلب.', features:['مفروشة جزئياً','تكييف','انترنت'], agent:'مازن السعدي', agentPhone:'0993456789', featured:true, views:650, date:'2025-11-25', images:[] },
  { id:4, title:'أرض صناعية — حمص', type:'land', listing:'sale', gov:'homs', city:'المنطقة الصناعية', area:5000, price:50000, currency:'USD', features:['مسورة','وثائق كاملة'], agent:'خالد النوري', agentPhone:'0994567890', featured:false, views:320, date:'2025-11-10', images:[] },
  { id:5, title:'شالية بحري — اللاذقية', type:'villa', listing:'sale', gov:'latakia', city:'شاطئ الزراعة', area:250, rooms:4, baths:3, price:65000, currency:'USD', year:2021, desc:'شالية بحري فاخر على بُعد 50م من الشاطئ.', features:['إطلالة بحرية','بركة سباحة'], agent:'ريم الحسن', agentPhone:'0995678901', featured:true, views:1560, date:'2025-12-01', images:[] },
  { id:6, title:'محل تجاري — حماة', type:'commercial', listing:'sale', gov:'hama', city:'وسط المدينة', area:80, baths:1, price:22000, currency:'USD', year:2015, desc:'محل تجاري بموقع استراتيجي.', features:['موقع مميز','واجهة كبيرة'], agent:'بسام القاسم', agentPhone:'0996789012', featured:false, views:280, date:'2025-10-20', images:[] },
  { id:7, title:'شقة للإيجار — طرطوس', type:'apartment', listing:'rent', gov:'tartus', city:'شاطئ طرطوس', area:110, rooms:3, baths:2, floor:3, price:1200, currency:'USD', year:2017, desc:'شقة مطلة على البحر.', features:['إطلالة بحرية','شرفة'], agent:'لمى شاهين', agentPhone:'0997890123', featured:false, views:445, date:'2025-11-05', images:[] },
  { id:8, title:'مزرعة — ريف دمشق', type:'farm', listing:'sale', gov:'rif-damascus', city:'يبرود', area:15000, rooms:2, baths:1, price:45000, currency:'USD', desc:'مزرعة 15 دونم مزروعة بالزيتون.', features:['بئر مياه','منزل ريفي'], agent:'علي الزعبي', agentPhone:'0998901234', featured:false, views:390, date:'2025-10-15', images:[] },
  { id:9, title:'شقة استثمارية — السويداء', type:'apartment', listing:'invest', gov:'sweida', city:'مركز السويداء', area:130, rooms:3, baths:2, floor:2, price:18000, currency:'USD', year:2022, desc:'شقة حديثة مناسبة للاستثمار.', features:['بناء حديث','عائد استثماري'], agent:'نادين البرازي', agentPhone:'0999012345', featured:false, views:210, date:'2025-12-05', images:[] },
  { id:10, title:'فيلا — إدلب', type:'villa', listing:'sale', gov:'idlib', city:'إدلب المدينة', area:350, rooms:5, baths:3, price:35000, currency:'USD', year:2016, desc:'فيلا واسعة في حي هادئ.', features:['حديقة','مرآب'], agent:'سامر الرفاعي', agentPhone:'0990123456', featured:false, views:178, date:'2025-11-28', images:[] },
];

// ===== CONTACTS =====
let CONTACTS = [
  { id:1, name:'أحمد الخطيب', role:'وكيل عقاري', gov:'damascus', phone:'0991234567', email:'ahmad@aqari.sy', speciality:'شقق وفلل دمشق', rating:4.9, deals:142, type:'agent', date:'2025-01-10' },
  { id:2, name:'سمر الأسعد', role:'مالكة عقار', gov:'damascus', phone:'0992345678', speciality:'فلل راقية', rating:4.7, deals:23, type:'owner', date:'2025-03-15' },
  { id:3, name:'مازن السعدي', role:'وكيل عقاري', gov:'aleppo', phone:'0993456789', speciality:'شقق حلب', rating:4.5, deals:89, type:'agent', date:'2025-02-20' },
  { id:4, name:'ريم الحسن', role:'وكيلة عقارية', gov:'latakia', phone:'0995678901', speciality:'شاليهات وعقارات بحرية', rating:4.8, deals:67, type:'agent', date:'2025-01-25' },
];

// ===== HELPERS =====
function loadData(key, fallback) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch(e) { return fallback; }
}
function saveData(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) {} }

function initData() {
  if (!loadData('aqari_properties', null)) saveData('aqari_properties', PROPERTIES);
  if (!loadData('aqari_contacts', null)) saveData('aqari_contacts', CONTACTS);
}
function getProperties() { return loadData('aqari_properties', PROPERTIES); }
function getContacts() { return loadData('aqari_contacts', CONTACTS); }

function saveProperty(prop) {
  const props = getProperties();
  const idx = props.findIndex(p => p.id === prop.id);
  if (idx >= 0) props[idx] = prop; else props.unshift(prop);
  saveData('aqari_properties', props);
}

function deleteProperty(id) {
  saveData('aqari_properties', getProperties().filter(p => p.id !== id));
}

function saveContact(c) {
  const contacts = getContacts();
  const idx = contacts.findIndex(x => x.id === c.id);
  if (idx >= 0) contacts[idx] = c; else contacts.unshift(c);
  saveData('aqari_contacts', contacts);
}

function deleteContact(id) {
  saveData('aqari_contacts', getContacts().filter(c => c.id !== id));
}

function getGovName(id) { return GOVERNORATES.find(g=>g.id===id)?.name || id; }
function getTypeName(id) { return PROPERTY_TYPES.find(t=>t.id===id)?.name || id; }
function getListingName(id) { return LISTING_TYPES.find(l=>l.id===id)?.name || id; }
function getTypeIcon(id) { return PROPERTY_TYPES.find(t=>t.id===id)?.icon || '🏠'; }

initData();
