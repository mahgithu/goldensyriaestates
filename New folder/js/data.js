// ===== SYRIA REAL ESTATE — DATA STORE =====

const GOVERNORATES = [
  { id:'damascus',     name:'دمشق',       icon:'🏛️', count:284 },
  { id:'aleppo',       name:'حلب',        icon:'🕌', count:312 },
  { id:'homs',         name:'حمص',        icon:'🏙️', count:178 },
  { id:'hama',         name:'حماة',       icon:'🌿', count:134 },
  { id:'latakia',      name:'اللاذقية',   icon:'🌊', count:167 },
  { id:'tartus',       name:'طرطوس',      icon:'⚓', count:98  },
  { id:'deir-ezzor',   name:'دير الزور',  icon:'🌾', count:56  },
  { id:'raqqa',        name:'الرقة',      icon:'🌅', count:42  },
  { id:'sweida',       name:'السويداء',   icon:'🏔️', count:89  },
  { id:'daraa',        name:'درعا',       icon:'🌻', count:63  },
  { id:'quneitra',     name:'القنيطرة',   icon:'🌄', count:31  },
  { id:'idlib',        name:'إدلب',       icon:'🌱', count:74  },
  { id:'hasakah',      name:'الحسكة',     icon:'🌿', count:48  },
  { id:'rif-damascus', name:'ريف دمشق',   icon:'🏡', count:191 },
];

const PROPERTY_TYPES = [
  { id:'apartment', name:'شقة',           icon:'🏢' },
  { id:'villa',     name:'فيلا',          icon:'🏰' },
  { id:'house',     name:'منزل',          icon:'🏠' },
  { id:'land',      name:'أرض',           icon:'🌍' },
  { id:'commercial',name:'محل تجاري',     icon:'🏪' },
  { id:'farm',      name:'مزرعة',         icon:'🌾' },
  { id:'office',    name:'مكتب',          icon:'🏗️' },
  { id:'warehouse', name:'مستودع',        icon:'🏭' },
];

const LISTING_TYPES = [
  { id:'sale',   name:'للبيع'     },
  { id:'rent',   name:'للإيجار'  },
  { id:'invest', name:'للاستثمار'},
];

// ===== PROPERTIES DATA =====
let PROPERTIES = [
  { id:1, title:'شقة فاخرة في قلب دمشق — المزة', type:'apartment', listing:'sale', gov:'damascus', city:'المزة', area:180, rooms:4, baths:2, floor:8, price:450000000, currency:'SYP', year:2019, desc:'شقة راقية بتشطيب سوبر لوكس في أرقى أحياء دمشق. تتميز بإطلالة بانورامية رائعة وتشمل مطبخاً مجهزاً وغرفة خادمة وموقف سيارة خاص. قريبة من جميع الخدمات والمدارس الدولية.', features:['موقف سيارة','تكييف مركزي','مولد كهربائي','ديكور فاخر','شرفة'], agent:'أحمد الخطيب', agentPhone:'0991234567', agentEmail:'ahmad@aqari.sy', featured:true, views:1240, date:'2025-11-15', images:[] },
  { id:2, title:'فيلا فخمة مع حديقة — المالكية', type:'villa', listing:'sale', gov:'damascus', city:'المالكية', area:420, rooms:6, baths:4, floor:0, price:1800000000, currency:'SYP', year:2020, desc:'فيلا استثنائية على مساحة 420 م٢ مع حديقة 300 م٢. 6 غرف نوم بحمامات داخلية، صالة ضيافة فاخرة، مسبح خاص، غرفة خادمة، كراج مغطى.', features:['حديقة خاصة','مسبح','كراج','مولد','أمن 24/7'], agent:'سمر الأسعد', agentPhone:'0992345678', agentEmail:'samar@aqari.sy', featured:true, views:890, date:'2025-11-20', images:[] },
  { id:3, title:'شقة مميزة للإيجار — شارع بغداد', type:'apartment', listing:'rent', gov:'aleppo', city:'شارع بغداد', area:140, rooms:3, baths:2, floor:4, price:2500000, currency:'SYP', year:2018, desc:'شقة نظيفة ومميزة في حي راقي بحلب. قريبة من الجامعات والمستشفيات والمراكز التجارية. ديكور حديث ومطبخ مجهز بالكامل.', features:['مفروشة جزئياً','تكييف','انترنت','أمن'], agent:'مازن السعدي', agentPhone:'0993456789', agentEmail:'mazen@aqari.sy', featured:true, views:650, date:'2025-11-25', images:[] },
  { id:4, title:'أرض للبيع — منطقة صناعية حمص', type:'land', listing:'sale', gov:'homs', city:'المنطقة الصناعية', area:5000, rooms:0, baths:0, floor:0, price:750000000, currency:'SYP', year:0, desc:'أرض مسورة 5000 م٢ في المنطقة الصناعية. صالحة لكل أنواع المشاريع الصناعية والتجارية. وثائق قانونية كاملة.', features:['مسورة','وثائق كاملة','خدمات متوفرة','موقع استراتيجي'], agent:'خالد النوري', agentPhone:'0994567890', agentEmail:'khaled@aqari.sy', featured:false, views:320, date:'2025-11-10', images:[] },
  { id:5, title:'شالية بحري للبيع — اللاذقية', type:'villa', listing:'sale', gov:'latakia', city:'شاطئ الزراعة', area:250, rooms:4, baths:3, floor:0, price:980000000, currency:'SYP', year:2021, desc:'شالية بحري فاخر على بُعد 50م من الشاطئ. إطلالة بحرية خلابة، تراس واسع، بركة سباحة صغيرة، تشطيب سوبر لوكس.', features:['إطلالة بحرية','بركة سباحة','تراس','تشطيب ممتاز'], agent:'ريم الحسن', agentPhone:'0995678901', agentEmail:'reem@aqari.sy', featured:true, views:1560, date:'2025-12-01', images:[] },
  { id:6, title:'محل تجاري — سوق المدينة حماة', type:'commercial', listing:'sale', gov:'hama', city:'وسط المدينة', area:80, rooms:0, baths:1, floor:0, price:320000000, currency:'SYP', year:2015, desc:'محل تجاري بموقع استراتيجي في قلب سوق حماة. واجهة 8م، ارتفاع 4م، مناسب لكل الأنشطة التجارية.', features:['موقع مميز','واجهة كبيرة','قانوني','تجاري'], agent:'بسام القاسم', agentPhone:'0996789012', agentEmail:'bassam@aqari.sy', featured:false, views:280, date:'2025-10-20', images:[] },
  { id:7, title:'شقة للإيجار — طرطوس الشاطئ', type:'apartment', listing:'rent', gov:'tartus', city:'شاطئ طرطوس', area:110, rooms:3, baths:2, floor:3, price:1800000, currency:'SYP', year:2017, desc:'شقة مطلة على البحر في مبنى حديث. غرف واسعة، إضاءة طبيعية ممتازة، شرفة بإطلالة بحرية رائعة.', features:['إطلالة بحرية','شرفة','مصعد','تكييف'], agent:'لمى شاهين', agentPhone:'0997890123', agentEmail:'lama@aqari.sy', featured:false, views:445, date:'2025-11-05', images:[] },
  { id:8, title:'مزرعة للبيع — ريف دمشق', type:'farm', listing:'sale', gov:'rif-damascus', city:'يبرود', area:15000, rooms:2, baths:1, floor:0, price:650000000, currency:'SYP', year:0, desc:'مزرعة 15 دونم مزروعة بالزيتون والكرمة. بئر مياه خاصة، منزل ريفي، سور محيطي كامل. بيئة نظيفة ومناخ ممتاز.', features:['بئر مياه','منزل ريفي','مسورة','أشجار مثمرة'], agent:'علي الزعبي', agentPhone:'0998901234', agentEmail:'ali@aqari.sy', featured:false, views:390, date:'2025-10-15', images:[] },
  { id:9, title:'شقة استثمارية — السويداء', type:'apartment', listing:'invest', gov:'sweida', city:'مركز السويداء', area:130, rooms:3, baths:2, floor:2, price:280000000, currency:'SYP', year:2022, desc:'شقة حديثة بناء 2022، تشطيب لوكس، مناسبة للسكن أو الاستثمار. العائد الإيجاري 8% سنوياً.', features:['بناء حديث','عائد استثماري مرتفع','موقع مركزي'], agent:'نادين البرازي', agentPhone:'0999012345', agentEmail:'nadin@aqari.sy', featured:false, views:210, date:'2025-12-05', images:[] },
  { id:10, title:'فيلا مع حديقة — إدلب', type:'villa', listing:'sale', gov:'idlib', city:'إدلب المدينة', area:350, rooms:5, baths:3, floor:0, price:520000000, currency:'SYP', year:2016, desc:'فيلا واسعة في حي هادئ، 5 غرف نوم، صالون كبير، حديقة محيطة، غرفة خادمة، مرآب مغطى.', features:['حديقة','مرآب','هادئ','قانوني'], agent:'سامر الرفاعي', agentPhone:'0990123456', agentEmail:'samer@aqari.sy', featured:false, views:178, date:'2025-11-28', images:[] },
  { id:11, title:'أرض سكنية — الحسكة', type:'land', listing:'sale', gov:'hasakah', city:'القامشلي', area:800, rooms:0, baths:0, floor:0, price:120000000, currency:'SYP', year:0, desc:'قطعة أرض سكنية 800م² بموقع مميز في القامشلي. مخدومة بالكهرباء والماء، منطقة سكنية هادئة.', features:['مخدومة','سكنية','وثائق كاملة'], agent:'حسن التميمي', agentPhone:'0991111222', agentEmail:'hassan@aqari.sy', featured:false, views:145, date:'2025-10-30', images:[] },
  { id:12, title:'شقة للإيجار — الرقة', type:'apartment', listing:'rent', gov:'raqqa', city:'مركز الرقة', area:95, rooms:2, baths:1, floor:1, price:1200000, currency:'SYP', year:2016, desc:'شقة نظيفة مناسبة للعائلة أو الأزواج. منطقة خدمات كاملة، قريبة من المدارس والمستشفيات.', features:['نظيفة','هادئة','مصعد','خدمات'], agent:'إيمان دوسكي', agentPhone:'0992222333', agentEmail:'iman@aqari.sy', featured:false, views:98, date:'2025-11-18', images:[] },
];

// ===== CONTACTS DATA =====
let CONTACTS = [
  { id:1, name:'أحمد الخطيب', role:'وكيل عقاري', gov:'damascus', phone:'0991234567', email:'ahmad@aqari.sy', whatsapp:'963991234567', speciality:'شقق وفلل دمشق', rating:4.9, deals:142, avatar:'أ', color:'#C9A227', notes:'وكيل خبرة +10 سنوات في سوق دمشق', date:'2025-01-10', type:'agent' },
  { id:2, name:'سمر الأسعد', role:'مالكة عقار', gov:'damascus', phone:'0992345678', email:'samar@aqari.sy', whatsapp:'963992345678', speciality:'فلل راقية', rating:4.7, deals:23, avatar:'س', color:'#6366F1', notes:'بائعة عقارات خاصة — تملك 5 فلل', date:'2025-03-15', type:'owner' },
  { id:3, name:'مازن السعدي', role:'وكيل عقاري', gov:'aleppo', phone:'0993456789', email:'mazen@aqari.sy', whatsapp:'963993456789', speciality:'شقق حلب', rating:4.5, deals:89, avatar:'م', color:'#10B981', notes:'متخصص في منطقة حلب الجديدة', date:'2025-02-20', type:'agent' },
  { id:4, name:'خالد النوري', role:'مستثمر', gov:'homs', phone:'0994567890', email:'khaled@aqari.sy', whatsapp:'963994567890', speciality:'أراضي صناعية', rating:4.3, deals:31, avatar:'خ', color:'#F59E0B', notes:'يبحث عن أراضي صناعية في حمص وحماة', date:'2025-04-05', type:'buyer' },
  { id:5, name:'ريم الحسن', role:'وكيلة عقارية', gov:'latakia', phone:'0995678901', email:'reem@aqari.sy', whatsapp:'963995678901', speciality:'شاليهات وعقارات بحرية', rating:4.8, deals:67, avatar:'ر', color:'#F43F5E', notes:'متخصصة في عقارات الساحل', date:'2025-01-25', type:'agent' },
  { id:6, name:'بسام القاسم', role:'مالك عقار', gov:'hama', phone:'0996789012', email:'bassam@aqari.sy', whatsapp:'963996789012', speciality:'محلات تجارية', rating:4.2, deals:15, avatar:'ب', color:'#8B5CF6', notes:'يملك عدة محلات في وسط حماة', date:'2025-05-10', type:'owner' },
  { id:7, name:'نادين البرازي', role:'مشترية', gov:'sweida', phone:'0999012345', email:'nadin@aqari.sy', whatsapp:'963999012345', speciality:'شقق استثمارية', rating:4.6, deals:8, avatar:'ن', color:'#06B6D4', notes:'تبحث عن شقق استثمارية بعائد مرتفع', date:'2025-06-01', type:'buyer' },
  { id:8, name:'علي الزعبي', role:'وكيل عقاري', gov:'rif-damascus', phone:'0998901234', email:'ali@aqari.sy', whatsapp:'963998901234', speciality:'أراضي ومزارع', rating:4.4, deals:54, avatar:'ع', color:'#84CC16', notes:'خبير في عقارات ريف دمشق', date:'2025-02-14', type:'agent' },
];

// ===== LOCALSTORAGE HELPERS =====
function loadData(key, fallback) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch(e) { return fallback; }
}
function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) {}
}

function initData() {
  const props = loadData('aqari_properties', null);
  const contacts = loadData('aqari_contacts', null);
  if (!props) saveData('aqari_properties', PROPERTIES);
  else PROPERTIES = props;
  if (!contacts) saveData('aqari_contacts', CONTACTS);
  else CONTACTS = contacts;
}

function getProperties() { return loadData('aqari_properties', PROPERTIES); }
function getContacts()   { return loadData('aqari_contacts', CONTACTS); }

function saveProperty(prop) {
  const props = getProperties();
  const idx = props.findIndex(p => p.id === prop.id);
  if (idx >= 0) props[idx] = prop; else props.unshift(prop);
  saveData('aqari_properties', props);
  PROPERTIES = props;
}

function deleteProperty(id) {
  const props = getProperties().filter(p => p.id !== id);
  saveData('aqari_properties', props);
  PROPERTIES = props;
}

function saveContact(contact) {
  const contacts = getContacts();
  const idx = contacts.findIndex(c => c.id === contact.id);
  if (idx >= 0) contacts[idx] = contact; else contacts.unshift(contact);
  saveData('aqari_contacts', contacts);
  CONTACTS = contacts;
}

function deleteContact(id) {
  const contacts = getContacts().filter(c => c.id !== id);
  saveData('aqari_contacts', contacts);
  CONTACTS = contacts;
}

// Format price
function formatPrice(price) {
  if (price >= 1000000000) return (price/1000000000).toFixed(1) + ' مليار ل.س';
  if (price >= 1000000)    return (price/1000000).toFixed(0) + ' مليون ل.س';
  if (price >= 1000)       return (price/1000).toFixed(0) + ' ألف ل.س';
  return price.toLocaleString('ar-SY') + ' ل.س';
}

function getGovName(id)  { return GOVERNORATES.find(g=>g.id===id)?.name  || id; }
function getTypeName(id) { return PROPERTY_TYPES.find(t=>t.id===id)?.name || id; }
function getListingName(id) { return LISTING_TYPES.find(l=>l.id===id)?.name || id; }
function getTypeIcon(id) { return PROPERTY_TYPES.find(t=>t.id===id)?.icon || '🏠'; }

initData();

