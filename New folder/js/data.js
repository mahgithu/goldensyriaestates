// ===== SYRIA REAL ESTATE — DATA STORE WITH USD =====

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

// ===== CURRENCY SYSTEM (USD افتراضي) =====
const CURRENCIES = {
  SYP: { code: 'SYP', name: 'ليرة سورية', symbol: 'ل.س', flag: '🇸🇾' },
  USD: { code: 'USD', name: 'دولار أمريكي', symbol: '$', flag: '🇺🇸' }
};

// سعر الصرف: 1 دولار = 15000 ليرة (يمكن تغييره من لوحة التحكم)
let EXCHANGE_RATE = { 
  SYP_TO_USD: 0.000067,  // 1 ليرة = 0.000067 دولار
  USD_TO_SYP: 15000,     // 1 دولار = 15000 ليرة
  lastUpdated: new Date().toISOString() 
};

function loadExchangeRate() {
  const saved = localStorage.getItem('aqari_exchange_rate');
  if (saved) { 
    try { 
      const parsed = JSON.parse(saved);
      EXCHANGE_RATE.USD_TO_SYP = parsed.USD_TO_SYP || 15000;
      EXCHANGE_RATE.SYP_TO_USD = 1 / EXCHANGE_RATE.USD_TO_SYP;
      EXCHANGE_RATE.lastUpdated = parsed.lastUpdated || new Date().toISOString();
    } catch(e) {} 
  }
}

function saveExchangeRate() {
  EXCHANGE_RATE.lastUpdated = new Date().toISOString();
  localStorage.setItem('aqari_exchange_rate', JSON.stringify(EXCHANGE_RATE));
}

function updateExchangeRate(usdToSyp) {
  EXCHANGE_RATE.USD_TO_SYP = parseInt(usdToSyp) || 15000;
  EXCHANGE_RATE.SYP_TO_USD = 1 / EXCHANGE_RATE.USD_TO_SYP;
  saveExchangeRate();
}

function convertPrice(amount, from, to) {
  if (from === to) return amount;
  amount = parseFloat(amount) || 0;
  if (from === 'SYP' && to === 'USD') return Math.round(amount * EXCHANGE_RATE.SYP_TO_USD);
  if (from === 'USD' && to === 'SYP') return Math.round(amount * EXCHANGE_RATE.USD_TO_SYP);
  return amount;
}

// تنسيق السعر بالعملة المحددة
function formatPrice(price, currency = 'USD') {
  price = parseFloat(price) || 0;
  
  if (currency === 'USD') {
    if (price >= 1000000) return '$' + (price / 1000000).toFixed(2) + 'M';
    if (price >= 1000) return '$' + (price / 1000).toFixed(1) + 'K';
    return '$' + price.toLocaleString('en-US');
  }
  
  // SYP
  if (price >= 1000000000) return (price / 1000000000).toFixed(1) + ' مليار ل.س';
  if (price >= 1000000) return (price / 1000000).toFixed(0) + ' مليون ل.س';
  if (price >= 1000) return (price / 1000).toFixed(0) + ' ألف ل.س';
  return price.toLocaleString('ar-SY') + ' ل.س';
}

// العملة الافتراضية: دولار
function getPreferredCurrency() { 
  return localStorage.getItem('aqari_currency') || '
