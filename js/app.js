// CONSOLIDATED SINGLE-FILE SCRIPT FOR GEAR GROMZ PWA (With Edit Gear, Add Grom, Add Consumable & 6-Month Predictive Sizing)

// --- 1. SIZING CONVERTER UTILITY ---
function convertFootLength(lengthInInches) {
  const inches = parseFloat(lengthInInches);
  if (isNaN(inches) || inches <= 0) {
    return { inches: 0, cm: 0, mondo: 'N/A', usKids: 'N/A', eu: 'N/A', crocs: 'N/A' };
  }

  const cm = inches * 2.54;
  const mondo = (Math.round(cm * 2) / 2).toFixed(1);

  let usKids = 'N/A';
  if (inches < 6.0) usKids = 'Toddler 6';
  else if (inches < 6.4) usKids = 'Toddler 8';
  else if (inches < 6.7) usKids = 'Toddler 10';
  else if (inches < 7.0) usKids = 'Toddler 11';
  else if (inches < 7.4) usKids = 'Toddler 12';
  else if (inches < 7.7) usKids = 'Toddler 13';
  else if (inches < 8.0) usKids = 'Youth 1';
  else if (inches < 8.4) usKids = 'Youth 2';
  else if (inches < 8.7) usKids = 'Youth 3';
  else if (inches < 9.0) usKids = 'Youth 4';
  else if (inches < 9.4) usKids = 'Youth 5';
  else usKids = 'Youth 6+';

  const eu = Math.round((cm + 1.5) * 1.5);

  let crocs = 'N/A';
  if (inches < 6.4) crocs = 'C8/C9';
  else if (inches < 6.7) crocs = 'C10';
  else if (inches < 7.0) crocs = 'C11';
  else if (inches < 7.4) crocs = 'C12';
  else if (inches < 7.7) crocs = 'C13';
  else if (inches < 8.0) crocs = 'J1';
  else if (inches < 8.4) crocs = 'J2';
  else if (inches < 8.7) crocs = 'J3';
  else crocs = 'M4/W6';

  return {
    inches: inches.toFixed(1),
    cm: cm.toFixed(1),
    mondo: mondo + ' MP',
    usKids,
    eu: 'EU ' + eu,
    crocs
  };
}

// --- 2. API SERVICE & LOCAL DATA ---
const LOCAL_STORAGE_URL_KEY = 'geargromz_apps_script_url';

function getSavedApiUrl() {
  return localStorage.getItem(LOCAL_STORAGE_URL_KEY) || '';
}

function saveApiUrl(url) {
  localStorage.setItem(LOCAL_STORAGE_URL_KEY, url.trim());
}

const SAMPLE_DATA = {
  inventory: [
    {
      item_id: 'GEAR-1001',
      category: 'Bikes',
      subcategory: 'Full Suspension',
      brand: 'Transition',
      model: 'Ripcord 24"',
      model_year: '2023',
      color: 'Raw Aluminum',
      gender_styling: 'Unisex',
      size_label: '24" Wheel',
      min_height__in_: 48,
      max_height__in_: 54,
      min_weight__lbs_: 50,
      max_weight__lbs_: 90,
      standover_height__in_: 23.5,
      bsl__mm_: '',
      owner: 'Andy Gawne',
      current_custodian: 'Andy Gawne',
      home_zone: 'Renton Garage',
      current_location: 'Andy\'s Garage',
      status: '🟢 Available',
      condition: 'Excellent',
      notes_upgrades: 'Upgraded to Shimano Deore 11-speed, tubeless set up.',
      image_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&auto=format&fit=crop&q=60'
    },
    {
      item_id: 'GEAR-1002',
      category: 'Ski/Snowboard',
      subcategory: 'All-Mountain Skis',
      brand: 'K2',
      model: 'Poacher Jr 125cm',
      model_year: '2024',
      color: 'Blue / Orange',
      gender_styling: 'Unisex',
      size_label: '125cm',
      min_height__in_: 51,
      max_height__in_: 56,
      min_weight__lbs_: 45,
      max_weight__lbs_: 75,
      standover_height__in_: '',
      bsl__mm_: 255,
      owner: 'Alex',
      current_custodian: 'Henry Murray',
      home_zone: 'Alex\'s Garage',
      current_location: 'Henry\'s SUV',
      status: '🟢 Available',
      condition: 'Good',
      notes_upgrades: 'Fresh cold-temp wax. Marker 7.0 DIN bindings.',
      image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&auto=format&fit=crop&q=60'
    },
    {
      item_id: 'GEAR-1003',
      category: 'Boots/Footwear',
      subcategory: 'Ski Boots',
      brand: 'Roxa',
      model: 'Chameleon Adjustable Boot',
      model_year: '2023',
      color: 'Black / Lime',
      gender_styling: 'Unisex',
      size_label: '21.5 Mondo',
      min_height__in_: 44,
      max_height__in_: 52,
      min_weight__lbs_: 40,
      max_weight__lbs_: 85,
      standover_height__in_: '',
      bsl__mm_: 265,
      owner: 'Andy Gawne',
      current_custodian: 'Andy Gawne',
      home_zone: 'Renton Garage',
      current_location: 'Andy\'s Garage',
      status: '🟢 Available',
      condition: 'Like New',
      notes_upgrades: 'Adjustable boot shell! Expands 4 sizes.',
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60'
    },
    {
      item_id: 'GEAR-1004',
      category: 'Outerwear/Apparel',
      subcategory: 'Rain Shell',
      brand: 'Patagonia',
      model: 'Torrentshell 3L Jacket',
      model_year: '2023',
      color: 'Balkan Blue',
      gender_styling: 'Youth M',
      size_label: 'Youth M (10)',
      min_height__in_: 52,
      max_height__in_: 57,
      min_weight__lbs_: 60,
      max_weight__lbs_: 85,
      standover_height__in_: '',
      bsl__mm_: '',
      owner: 'Henry Murray',
      current_custodian: 'Henry Murray',
      home_zone: 'Henry\'s Shop',
      current_location: 'Henry\'s Shop',
      status: '🟢 Available',
      condition: 'Good',
      notes_upgrades: 'Freshly washed with Nikwax TX.Direct DWR.',
      image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=60'
    }
  ],
  groms: [
    {
      grom_id: 'GROM-1',
      parent_name: 'Andy Gawne',
      child_name: 'Elliot Gawne',
      birth_date: '2017-04-12',
      current_height__in_: 50.0,
      current_weight__lbs_: 58.0,
      foot_length__in_: 8.2,
      last_measured: '2026-08-15'
    },
    {
      grom_id: 'GROM-2',
      parent_name: 'Alex',
      child_name: 'Ava',
      birth_date: '2018-09-20',
      current_height__in_: 45.0,
      current_weight__lbs_: 44.0,
      foot_length__in_: 7.1,
      last_measured: '2026-08-10'
    }
  ],
  consumables: [
    {
      item_id: 'CONS-1',
      garage_location: 'Andy\'s Garage',
      item_name: '29" Presta Tubes (2.4")',
      specs_compatibility: '29 x 2.2 - 2.5',
      quantity: 4,
      min_threshold: 2,
      status: 'OK'
    },
    {
      item_id: 'CONS-2',
      garage_location: 'Andy\'s Garage',
      item_name: '12-Speed Master Links',
      specs_compatibility: 'SRAM Eagle / Shimano',
      quantity: 1,
      min_threshold: 3,
      status: '⚠️ Low Stock'
    },
    {
      item_id: 'CONS-3',
      garage_location: 'Alex\'s Garage',
      item_name: 'Cold Temp Hydrocarbon Ski Wax',
      specs_compatibility: 'Swix Blue (-4C to -12C)',
      quantity: 2,
      min_threshold: 1,
      status: 'OK'
    }
  ]
};

async function fetchAllData() {
  const url = getSavedApiUrl();
  if (!url) return SAMPLE_DATA;

  try {
    const response = await fetch(`${url}?action=all`);
    if (!response.ok) throw new Error('API Response not ok');
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Failed to fetch from Apps Script API. Falling back to sample data.', err);
    return SAMPLE_DATA;
  }
}

async function decrementConsumable(itemName) {
  const url = getSavedApiUrl();
  if (!url) {
    const item = SAMPLE_DATA.consumables.find(c => c.item_name === itemName);
    if (item) item.quantity = Math.max(0, item.quantity - 1);
    return { success: true, newQty: item ? item.quantity : 0 };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ action: 'decrementConsumable', itemName })
    });
    return await res.json();
  } catch (err) {
    console.error('Error decrementing consumable:', err);
    return { success: false };
  }
}

async function postNewGear(gearObj) {
  const url = getSavedApiUrl();
  if (!url) {
    SAMPLE_DATA.inventory.unshift(gearObj);
    return { success: true };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ action: 'addGear', ...gearObj })
    });
    return await res.json();
  } catch (err) {
    console.error('Error posting gear:', err);
    return { success: false };
  }
}

// --- 3. PREDICTIVE GROWTH MATCHER ENGINE (NOW VS 6 MONTHS) ---
function calculateGearFit(item, grom) {
  if (!grom) return { fit: 'NONE', label: '' };

  const curHeight = parseFloat(grom.current_height__in_) || 0;
  const curFoot = parseFloat(grom.foot_length__in_) || 0;
  
  // 6 Months Projections: Kids grow ~1.4 inches in height & ~0.35 inches in foot length over 6 months
  const proj6mHeight = curHeight + 1.4;
  const proj6mFoot = curFoot + 0.35;

  const minH = parseFloat(item.min_height__in_) || 0;
  const maxH = parseFloat(item.max_height__in_) || 999;

  // 1. Check FIT NOW
  let isFitNow = false;
  if (curHeight > 0 && minH > 0 && curHeight >= minH && curHeight <= maxH) {
    isFitNow = true;
  }
  
  let isFootwearFitNow = false;
  if (curFoot > 0 && (item.category === 'Boots/Footwear' || item.category === 'Ski/Snowboard')) {
    const footConv = convertFootLength(curFoot);
    const itemMondo = parseFloat(item.size_label) || 0;
    const gromMondo = parseFloat(footConv.mondo) || 0;
    if (gromMondo > 0 && itemMondo > 0 && Math.abs(itemMondo - gromMondo) <= 0.8) {
      isFootwearFitNow = true;
    }
  }

  if (isFitNow || isFootwearFitNow) {
    return {
      fit: 'PERFECT_MATCH',
      label: `⭐ FITS NOW (${grom.child_name.split(' ')[0]})`
    };
  }

  // 2. Check 6-MONTH PREDICTIVE FIT
  let isFit6m = false;
  if (minH > 0 && proj6mHeight >= minH && proj6mHeight <= maxH && curHeight < minH) {
    isFit6m = true;
  }

  let isFootwearFit6m = false;
  if (curFoot > 0 && (item.category === 'Boots/Footwear' || item.category === 'Ski/Snowboard')) {
    const projFootConv = convertFootLength(proj6mFoot);
    const itemMondo = parseFloat(item.size_label) || 0;
    const projMondo = parseFloat(projFootConv.mondo) || 0;
    const curMondo = parseFloat(convertFootLength(curFoot).mondo) || 0;
    if (projMondo > 0 && itemMondo > 0 && itemMondo >= curMondo && Math.abs(itemMondo - projMondo) <= 1.0) {
      isFootwearFit6m = true;
    }
  }

  if (isFit6m || isFootwearFit6m) {
    return {
      fit: 'FUTURE_MATCH',
      label: `⏳ FITS IN 6 MOS (Dec 2026)`
    };
  }

  return { fit: 'NONE', label: '' };
}

// --- 4. AI PHOTO CATALOGING ---
async function analyzeGearPhoto(base64Image, apiKey) {
  if (!apiKey) {
    return {
      category: 'Ski/Snowboard',
      brand: 'Salomon',
      model: 'QST Lux Jr',
      size_label: '130cm',
      min_height_in: 48,
      max_height_in: 54,
      bsl_mm: 265,
      condition: 'Good',
      notes: 'AI Detected: Salomon youth all-mountain skis with C5 bindings.'
    };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const promptText = `Analyze this outdoor gear photo. Return ONLY a valid raw JSON object:
  {
    "category": "Bikes | Ski/Snowboard | Outerwear/Apparel | Boots/Footwear | Water Sports | Camping/Backpacking",
    "brand": "String",
    "model": "String",
    "size_label": "String",
    "min_height_in": Number,
    "max_height_in": Number,
    "bsl_mm": Number,
    "condition": "Like New | Good | Fair | Needs TLC",
    "notes": "String"
  }`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }, { inline_data: { mime_type: "image/jpeg", data: base64Image.split(',')[1] || base64Image } }] }]
      })
    });
    const result = await res.json();
    const textResp = result.candidates[0].content.parts[0].text;
    const jsonMatch = textResp.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error('JSON parse failed');
  } catch (err) {
    console.error('Gemini API Error:', err);
    alert('AI Photo analysis failed. Please fill manually.');
    return null;
  }
}

// --- 5. MAIN UI CONTROLLER & APP RENDERER ---
let appData = { inventory: [], groms: [], consumables: [], members: [] };
let currentTab = 'dashboard';
let selectedCategory = 'ALL';
let fitFilter = 'ALL'; // 'ALL', 'NOW', 'FUTURE'
let searchQuery = '';
let selectedGromId = '';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  updateApiStatusIndicator();
  setupEventListeners();
  await loadData();
}

function updateApiStatusIndicator() {
  const url = getSavedApiUrl();
  const btn = document.getElementById('api-status-btn');
  const label = document.getElementById('api-status-label');
  if (url) {
    btn.classList.add('connected');
    label.textContent = 'Sheet Sync On';
  } else {
    btn.classList.remove('connected');
    label.textContent = 'Demo Mode (Set API)';
  }
}

async function loadData() {
  const container = document.getElementById('main-content');
  container.innerHTML = `<div style="text-align:center; padding:40px; color:#94a3b8;">🔄 Loading Gear Gromz data...</div>`;

  appData = await fetchAllData();

  if (appData.groms && appData.groms.length > 0 && !selectedGromId) {
    selectedGromId = appData.groms[0].grom_id;
  }

  renderView();
}

function setupEventListeners() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentTab = item.dataset.tab;
      renderView();
    });
  });

  document.getElementById('api-status-btn').addEventListener('click', openSettingsModal);

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });
}

function renderView() {
  const container = document.getElementById('main-content');
  container.innerHTML = '';

  if (currentTab === 'dashboard') renderDashboardView(container);
  else if (currentTab === 'groms') renderGromsView(container);
  else if (currentTab === 'consumables') renderConsumablesView(container);
  else if (currentTab === 'add') renderAddGearView(container);
}

function renderDashboardView(container) {
  const wrapper = document.createElement('div');
  const selectedGrom = (appData.groms || []).find(g => g.grom_id === selectedGromId) || {};

  wrapper.innerHTML = `
    <div class="filter-container">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:12px; font-weight:700; color:var(--accent-primary);">👦 TARGET GROM FOR FIT MATCHING:</span>
        <select id="dash-grom-select" class="grom-select" style="font-size:12px; padding:4px 8px;">
          ${(appData.groms || []).map(g => `<option value="${g.grom_id}" ${g.grom_id === selectedGromId ? 'selected' : ''}>${g.child_name}</option>`).join('')}
        </select>
      </div>

      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" id="search-input" class="search-input" placeholder="Search bikes, skis, sizes, owners..." value="${searchQuery}">
      </div>

      <div class="pill-scroller">
        <button class="pill ${selectedCategory === 'ALL' ? 'active' : ''}" data-cat="ALL">All Gear</button>
        <button class="pill ${selectedCategory === 'Bikes' ? 'active' : ''}" data-cat="Bikes">🚲 Bikes</button>
        <button class="pill ${selectedCategory === 'Ski/Snowboard' ? 'active' : ''}" data-cat="Ski/Snowboard">⛷️ Skis/Board</button>
        <button class="pill ${selectedCategory === 'Outerwear/Apparel' ? 'active' : ''}" data-cat="Outerwear/Apparel">🧥 Apparel</button>
        <button class="pill ${selectedCategory === 'Boots/Footwear' ? 'active' : ''}" data-cat="Boots/Footwear">🥾 Footwear</button>
      </div>

      <div class="pill-scroller" style="padding-top:0;">
        <button class="pill ${fitFilter === 'ALL' ? 'active' : ''}" data-fit="ALL">All Sizes</button>
        <button class="pill ${fitFilter === 'NOW' ? 'active' : ''}" data-fit="NOW" style="border-color:var(--accent-emerald);">⭐ Fits Now</button>
        <button class="pill ${fitFilter === 'FUTURE' ? 'active' : ''}" data-fit="FUTURE" style="border-color:var(--accent-indigo);">⏳ Fits in 6 Months (Dec 2026)</button>
      </div>
    </div>
    <div class="gear-grid" id="gear-grid"></div>
  `;
  container.appendChild(wrapper);

  document.getElementById('dash-grom-select').addEventListener('change', (e) => {
    selectedGromId = e.target.value;
    renderGearGrid();
  });

  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderGearGrid();
  });

  wrapper.querySelectorAll('.pill[data-cat]').forEach(pill => {
    pill.addEventListener('click', () => {
      wrapper.querySelectorAll('.pill[data-cat]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedCategory = pill.dataset.cat;
      renderGearGrid();
    });
  });

  wrapper.querySelectorAll('.pill[data-fit]').forEach(pill => {
    pill.addEventListener('click', () => {
      wrapper.querySelectorAll('.pill[data-fit]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      fitFilter = pill.dataset.fit;
      renderGearGrid();
    });
  });

  renderGearGrid();
}

function renderGearGrid() {
  const grid = document.getElementById('gear-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const selectedGrom = (appData.groms || []).find(g => g.grom_id === selectedGromId);
  const filtered = (appData.inventory || []).filter(item => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const itemText = `${item.brand} ${item.model} ${item.category} ${item.size_label} ${item.owner}`.toLowerCase();
    const matchesSearch = !searchQuery || itemText.includes(searchQuery);
    
    const fitInfo = calculateGearFit(item, selectedGrom);
    let matchesFit = true;
    if (fitFilter === 'NOW') matchesFit = fitInfo.fit === 'PERFECT_MATCH';
    else if (fitFilter === 'FUTURE') matchesFit = fitInfo.fit === 'FUTURE_MATCH';

    return matchesCat && matchesSearch && matchesFit;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:40px; color:#94a3b8;">No gear found matching your filter.</div>`;
    return;
  }

  filtered.forEach(item => {
    const fitInfo = calculateGearFit(item, selectedGrom);
    const card = document.createElement('div');
    card.className = `gear-card ${fitInfo.fit === 'PERFECT_MATCH' ? 'perfect-match' : (fitInfo.fit === 'FUTURE_MATCH' ? 'future-match' : '')}`;
    const icon = getCategoryIcon(item.category);
    const statusClass = getStatusClass(item.status);

    card.innerHTML = `
      ${fitInfo.fit === 'PERFECT_MATCH' ? `<div class="match-badge">${fitInfo.label}</div>` : ''}
      ${fitInfo.fit === 'FUTURE_MATCH' ? `<div class="match-badge future">${fitInfo.label}</div>` : ''}
      <div class="gear-header">
        <div class="gear-img-thumb">${icon}</div>
        <div class="gear-title-wrap">
          <span class="gear-category">${item.category} • ${item.subcategory || ''}</span>
          <h3 class="gear-name">${item.brand} ${item.model}</h3>
        </div>
      </div>
      <div class="gear-specs-row">
        <span class="spec-chip">📏 ${item.size_label || 'Std'}</span>
        ${item.min_height__in_ ? `<span class="spec-chip">📐 ${item.min_height__in_}"-${item.max_height__in_}" H</span>` : ''}
        ${item.bsl__mm_ ? `<span class="spec-chip">🎿 BSL ${item.bsl__mm_}mm</span>` : ''}
        <span class="spec-chip">✨ ${item.condition || 'Good'}</span>
      </div>
      <div class="gear-footer">
        <div class="owner-info">👤 <span>${item.owner}</span></div>
        <span class="status-badge ${statusClass}">${item.status || '🟢 Available'}</span>
      </div>
    `;

    card.addEventListener('click', () => openGearDetailModal(item));
    grid.appendChild(card);
  });
}

function getCategoryIcon(cat) {
  switch (cat) {
    case 'Bikes': return '🚲';
    case 'Ski/Snowboard': return '⛷️';
    case 'Outerwear/Apparel': return '🧥';
    case 'Boots/Footwear': return '🥾';
    case 'Water Sports': return '🏄';
    case 'Camping/Backpacking': return '🏕️';
    default: return '📦';
  }
}

function getStatusClass(status) {
  if (!status) return 'status-available';
  if (status.includes('Available')) return 'status-available';
  if (status.includes('In Use')) return 'status-inuse';
  if (status.includes('Outgrown')) return 'status-outgrown';
  if (status.includes('Reserved')) return 'status-reserved';
  return 'status-available';
}

// --- GROMS VIEW (WITH ADD GROM & LOG MEASUREMENT) ---
function renderGromsView(container) {
  const wrapper = document.createElement('div');
  const selectedGrom = (appData.groms || []).find(g => g.grom_id === selectedGromId) || (appData.groms[0] || {});
  const footConv = convertFootLength(selectedGrom.foot_length__in_ || 0);

  // Find 6-Month Future Fits for this grom
  const futureFits = (appData.inventory || []).filter(item => calculateGearFit(item, selectedGrom).fit === 'FUTURE_MATCH');

  wrapper.innerHTML = `
    <div class="groms-selector-bar">
      <div>
        <span style="font-size:12px; color:#94a3b8; font-weight:700; text-transform:uppercase;">Select Grom Profile</span>
        <h3 style="font-size:18px; font-weight:800; margin-top:2px;">${selectedGrom.child_name || 'No Groms Added'}</h3>
      </div>
      <div style="display:flex; gap:8px;">
        <select id="grom-dropdown" class="grom-select">
          ${(appData.groms || []).map(g => `<option value="${g.grom_id}" ${g.grom_id === selectedGromId ? 'selected' : ''}>${g.child_name}</option>`).join('')}
        </select>
        <button id="btn-add-grom" class="btn-secondary" style="font-size:12px; padding:6px 12px;">➕ New</button>
      </div>
    </div>

    ${selectedGrom.child_name ? `
      <div style="padding: 0 16px; margin-bottom:16px;">
        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span style="font-size:13px; font-weight:700; color:var(--accent-primary);">📏 CURRENT MEASUREMENTS</span>
            <button id="btn-log-measurement" class="btn-secondary" style="font-size:11px; padding:4px 10px;">📏 Log New Height</button>
          </div>
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; text-align:center;">
            <div style="background:#0f172a; padding:10px; border-radius:var(--radius-md);">
              <span style="font-size:10px; color:#94a3b8;">HEIGHT</span>
              <div style="font-size:18px; font-weight:800; color:#fff;">${selectedGrom.current_height__in_ || '--'}"</div>
            </div>
            <div style="background:#0f172a; padding:10px; border-radius:var(--radius-md);">
              <span style="font-size:10px; color:#94a3b8;">WEIGHT</span>
              <div style="font-size:18px; font-weight:800; color:#fff;">${selectedGrom.current_weight__lbs_ || '--'} lbs</div>
            </div>
            <div style="background:#0f172a; padding:10px; border-radius:var(--radius-md);">
              <span style="font-size:10px; color:#94a3b8;">FOOT LENGTH</span>
              <div style="font-size:18px; font-weight:800; color:var(--accent-emerald);">${selectedGrom.foot_length__in_ || '--'}"</div>
            </div>
          </div>

          <div style="margin-top:14px; font-size:12px; font-weight:700; color:#94a3b8;">🥾 AUTOMATIC FOOTWEAR SIZING CONVERSIONS:</div>
          <div class="conversion-card">
            <div class="conversion-unit"><span class="unit-label">Mondo (Ski)</span><span class="unit-value">${footConv.mondo}</span></div>
            <div class="conversion-unit"><span class="unit-label">US Kids</span><span class="unit-value">${footConv.usKids}</span></div>
            <div class="conversion-unit"><span class="unit-label">EU Size</span><span class="unit-value">${footConv.eu}</span></div>
            <div class="conversion-unit"><span class="unit-label">Crocs</span><span class="unit-value">${footConv.crocs}</span></div>
          </div>
        </div>
      </div>

      <!-- 6-Month Predictive Forecast Radar -->
      <div style="padding:0 16px; margin-bottom:16px;">
        <div style="background:linear-gradient(135deg, rgba(99,102,241,0.15), rgba(30,41,59,0.8)); border:1px solid var(--accent-indigo); border-radius:var(--radius-lg); padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:14px; font-weight:800; color:#818cf8;">🔮 6-MONTH GEAR FORECAST (DEC 2026)</span>
            <span style="font-size:11px; background:var(--accent-indigo); color:#fff; padding:2px 8px; border-radius:99px;">+1.4" Height Growth</span>
          </div>
          <p style="font-size:12px; color:#cbd5e1; margin-bottom:10px;">Gear in the circle fleet that will fit ${selectedGrom.child_name.split(' ')[0]} in 6 months:</p>
          ${futureFits.length > 0 ? `
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${futureFits.map(item => `
                <div style="background:#0f172a; padding:10px 12px; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="font-size:13px; color:#fff;">${item.brand} ${item.model}</strong>
                    <div style="font-size:11px; color:#94a3b8;">${item.category} • Size: ${item.size_label} • Owner: ${item.owner}</div>
                  </div>
                  <span style="font-size:11px; font-weight:700; color:var(--accent-indigo);">Ready Dec '26</span>
                </div>
              `).join('')}
            </div>
          ` : `<div style="font-size:12px; color:#94a3b8; font-style:italic;">No upcoming gear transitions detected for the 6-month window yet.</div>`}
        </div>
      </div>

      <div style="padding:0 16px; margin-bottom:10px;">
        <h3 style="font-size:16px; font-weight:800;">⭐ Fleet Gear Matches NOW for ${selectedGrom.child_name.split(' ')[0]}</h3>
      </div>
      <div class="gear-grid" id="gear-grid"></div>
    ` : ''}
  `;

  container.appendChild(wrapper);

  document.getElementById('btn-add-grom').addEventListener('click', openAddGromModal);

  const btnLog = document.getElementById('btn-log-measurement');
  if (btnLog) btnLog.addEventListener('click', () => openLogMeasurementModal(selectedGrom));

  const select = document.getElementById('grom-dropdown');
  if (select) {
    select.addEventListener('change', (e) => {
      selectedGromId = e.target.value;
      renderGromsView(container);
    });
  }

  renderGearGrid();
}

// --- CONSUMABLES VIEW (WITH ADD CONSUMABLE) ---
function renderConsumablesView(container) {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '16px';
  wrapper.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <div>
        <h2 style="font-size:20px; font-weight:800;">📦 Consumables Supply Hub</h2>
        <p style="font-size:13px; color:#94a3b8;">Shared shop parts & supplies.</p>
      </div>
      <button id="btn-add-consumable" class="btn-secondary" style="font-size:12px; padding:8px 14px;">➕ Add Item</button>
    </div>
    <div class="consumables-grid">
      ${(appData.consumables || []).map(item => {
        const isLow = (parseInt(item.quantity) || 0) <= (parseInt(item.min_threshold) || 1);
        return `
          <div class="consumable-card" style="${isLow ? 'border-color:var(--accent-amber);' : ''}">
            <div>
              <span style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">${item.garage_location || 'Garage'}</span>
              <h4 style="font-size:16px; font-weight:700; color:#fff;">${item.item_name}</h4>
              <span style="font-size:12px; color:#94a3b8;">${item.specs_compatibility || ''}</span>
              <div style="margin-top:6px;">
                <span style="font-size:13px; font-weight:800; color:${isLow ? 'var(--accent-amber)' : 'var(--accent-emerald)'};">Qty: ${item.quantity}</span>
                ${isLow ? `<span style="font-size:11px; font-weight:700; background:rgba(245,158,11,0.15); color:var(--accent-amber); padding:2px 8px; border-radius:99px; margin-left:6px;">⚠️ LOW STOCK</span>` : ''}
              </div>
            </div>
            <button class="btn-decrement" data-name="${item.item_name}">Took 1 ➖</button>
          </div>
        `;
      }).join('')}
    </div>
  `;
  container.appendChild(wrapper);

  document.getElementById('btn-add-consumable').addEventListener('click', openAddConsumableModal);

  wrapper.querySelectorAll('.btn-decrement').forEach(btn => {
    btn.addEventListener('click', async () => {
      const name = btn.dataset.name;
      btn.disabled = true;
      btn.textContent = 'Updating...';
      const res = await decrementConsumable(name);
      if (res.success) {
        await loadData();
      } else {
        alert('Failed to update consumable.');
        btn.disabled = false;
        btn.textContent = 'Took 1 ➖';
      }
    });
  });
}

function renderAddGearView(container) {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '16px';
  wrapper.innerHTML = `
    <div style="margin-bottom:16px;">
      <h2 style="font-size:20px; font-weight:800;">➕ Add New Gear</h2>
      <p style="font-size:13px; color:#94a3b8;">Snap a photo to auto-catalog specs via Gemini AI, or fill manually.</p>
    </div>

    <div style="background:linear-gradient(135deg, #1e293b, #0f172a); border:2px dashed var(--accent-primary); border-radius:var(--radius-lg); padding:20px; text-align:center; margin-bottom:20px;">
      <span style="font-size:36px;">📷</span>
      <h3 style="font-size:16px; font-weight:800; margin-top:8px;">AI "Snap & Catalog"</h3>
      <p style="font-size:12px; color:#94a3b8; margin-bottom:12px;">Upload a photo of gear or ski boot heel to auto-fill details.</p>
      <input type="file" id="ai-photo-input" accept="image/*" style="display:none;">
      <button id="btn-trigger-ai" class="btn-primary" style="max-width:240px; margin:0 auto; font-size:14px; padding:10px;">Upload & Extract Specs</button>
    </div>

    <form id="add-gear-form">
      <div class="form-group">
        <label>Category</label>
        <select id="form-category" class="form-select" required>
          <option value="Bikes">Bikes</option>
          <option value="Ski/Snowboard">Ski/Snowboard</option>
          <option value="Outerwear/Apparel">Outerwear/Apparel</option>
          <option value="Boots/Footwear">Boots/Footwear</option>
          <option value="Water Sports">Water Sports</option>
          <option value="Camping/Backpacking">Camping/Backpacking</option>
        </select>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="form-group"><label>Brand</label><input type="text" id="form-brand" class="form-input" required></div>
        <div class="form-group"><label>Model</label><input type="text" id="form-model" class="form-input" required></div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="form-group"><label>Size Label</label><input type="text" id="form-size" class="form-input"></div>
        <div class="form-group"><label>Owner</label><input type="text" id="form-owner" class="form-input" required></div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="form-group"><label>Min Height (in)</label><input type="number" id="form-min-h" class="form-input"></div>
        <div class="form-group"><label>Max Height (in)</label><input type="number" id="form-max-h" class="form-input"></div>
      </div>

      <div class="form-group"><label>Boot Sole Length (BSL mm)</label><input type="number" id="form-bsl" class="form-input"></div>
      <div class="form-group"><label>Notes & Upgrades</label><textarea id="form-notes" class="form-input" style="height:70px;"></textarea></div>

      <button type="submit" class="btn-primary">Save Gear to Google Sheet 🚀</button>
    </form>
  `;
  container.appendChild(wrapper);

  const fileInput = document.getElementById('ai-photo-input');
  document.getElementById('btn-trigger-ai').addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const btn = document.getElementById('btn-trigger-ai');
    btn.disabled = true;
    btn.textContent = '🤖 Analyzing Image...';

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const base64 = evt.target.result;
      const apiKey = localStorage.getItem('geargromz_gemini_key') || '';
      const extracted = await analyzeGearPhoto(base64, apiKey);
      btn.disabled = false;
      btn.textContent = 'Upload & Extract Specs';

      if (extracted) {
        if (extracted.category) document.getElementById('form-category').value = extracted.category;
        if (extracted.brand) document.getElementById('form-brand').value = extracted.brand;
        if (extracted.model) document.getElementById('form-model').value = extracted.model;
        if (extracted.size_label) document.getElementById('form-size').value = extracted.size_label;
        if (extracted.min_height_in) document.getElementById('form-min-h').value = extracted.min_height_in;
        if (extracted.max_height_in) document.getElementById('form-max-h').value = extracted.max_height_in;
        if (extracted.bsl_mm) document.getElementById('form-bsl').value = extracted.bsl_mm;
        if (extracted.notes) document.getElementById('form-notes').value = extracted.notes;
        alert('✨ Specs extracted automatically!');
      }
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('add-gear-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Saving to Sheet...';

    const newGear = {
      category: document.getElementById('form-category').value,
      brand: document.getElementById('form-brand').value,
      model: document.getElementById('form-model').value,
      size_label: document.getElementById('form-size').value,
      owner: document.getElementById('form-owner').value,
      min_height_in: document.getElementById('form-min-h').value,
      max_height_in: document.getElementById('form-max-h').value,
      bsl_mm: document.getElementById('form-bsl').value,
      notes: document.getElementById('form-notes').value,
      status: '🟢 Available'
    };

    const res = await postNewGear(newGear);
    if (res.success) {
      alert('✅ New gear saved!');
      currentTab = 'dashboard';
      await loadData();
    } else {
      alert('Failed to save gear.');
      btn.disabled = false;
      btn.textContent = 'Save Gear to Google Sheet 🚀';
    }
  });
}

// --- GEAR DETAIL MODAL (WITH EDIT GEAR FEATURE) ---
function openGearDetailModal(item) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  const ownerPhone = item.phone || '12065550199';
  const smsBody = encodeURIComponent(`Hey ${item.owner}! Can I borrow the ${item.brand} ${item.model} for our upcoming trip?`);
  const smsUrl = `sms:${ownerPhone}?body=${smsBody}`;

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <span class="status-badge ${getStatusClass(item.status)}">${item.status || '🟢 Available'}</span>
      <div>
        <button id="modal-edit-gear-btn" class="btn-secondary" style="font-size:12px; padding:4px 10px; margin-right:8px;">✏️ Edit</button>
        <button id="modal-close-btn" style="background:none; border:none; color:#94a3b8; font-size:24px; cursor:pointer;">✕</button>
      </div>
    </div>

    <div style="text-align:center; margin-bottom:20px;">
      <div style="font-size:48px; margin-bottom:8px;">${getCategoryIcon(item.category)}</div>
      <h2 style="font-size:22px; font-weight:800;">${item.brand} ${item.model}</h2>
      <span style="font-size:13px; color:var(--accent-primary); font-weight:700;">${item.category} • ${item.subcategory || ''}</span>
    </div>

    <div style="background:#0f172a; border-radius:var(--radius-md); padding:16px; margin-bottom:20px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:13px;">
        <div><span style="color:#94a3b8;">Owner:</span> <strong>${item.owner}</strong></div>
        <div><span style="color:#94a3b8;">Location:</span> <strong>${item.current_location || item.home_zone}</strong></div>
        <div><span style="color:#94a3b8;">Size:</span> <strong>${item.size_label || 'Std'}</strong></div>
        <div><span style="color:#94a3b8;">Condition:</span> <strong>${item.condition || 'Good'}</strong></div>
        ${item.min_height__in_ ? `<div><span style="color:#94a3b8;">Height Fit:</span> <strong>${item.min_height__in_}" - ${item.max_height__in_}"</strong></div>` : ''}
        ${item.bsl__mm_ ? `<div><span style="color:#94a3b8;">BSL:</span> <strong>${item.bsl__mm_} mm</strong></div>` : ''}
      </div>
      ${item.notes_upgrades ? `<div style="margin-top:12px; pt-12; border-top:1px solid #1e293b; font-size:13px; color:#cbd5e1;">📝 ${item.notes_upgrades}</div>` : ''}
    </div>

    ${item.status && item.status.includes('In Use') ? `
      <button id="btn-queue" class="btn-primary" style="background:var(--accent-amber);">⏳ Queue Next For Return</button>
    ` : `
      <a href="${smsUrl}" class="btn-primary" style="text-decoration:none;">📱 1-Click Request via SMS</a>
    `}
  `;

  overlay.classList.add('active');

  document.getElementById('modal-close-btn').addEventListener('click', () => overlay.classList.remove('active'));

  document.getElementById('modal-edit-gear-btn').addEventListener('click', () => openEditGearModal(item));

  const btnQueue = document.getElementById('btn-queue');
  if (btnQueue) {
    btnQueue.addEventListener('click', () => {
      alert(`✅ You've been added to the return queue for the ${item.brand} ${item.model}!`);
      overlay.classList.remove('active');
    });
  }
}

function openEditGearModal(item) {
  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3 style="font-size:18px; font-weight:800;">✏️ Edit Gear: ${item.brand} ${item.model}</h3>
      <button id="modal-close-btn" style="background:none; border:none; color:#94a3b8; font-size:24px; cursor:pointer;">✕</button>
    </div>

    <form id="edit-gear-form">
      <div class="form-group"><label>Brand</label><input type="text" id="edit-brand" class="form-input" value="${item.brand || ''}" required></div>
      <div class="form-group"><label>Model</label><input type="text" id="edit-model" class="form-input" value="${item.model || ''}" required></div>
      <div class="form-group"><label>Size Label</label><input type="text" id="edit-size" class="form-input" value="${item.size_label || ''}"></div>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="form-group"><label>Min Height (in)</label><input type="number" id="edit-min-h" class="form-input" value="${item.min_height__in_ || ''}"></div>
        <div class="form-group"><label>Max Height (in)</label><input type="number" id="edit-max-h" class="form-input" value="${item.max_height__in_ || ''}"></div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="form-group"><label>BSL (mm)</label><input type="number" id="edit-bsl" class="form-input" value="${item.bsl__mm_ || ''}"></div>
        <div class="form-group">
          <label>Status</label>
          <select id="edit-status" class="form-select">
            <option value="🟢 Available" ${item.status && item.status.includes('Available') ? 'selected' : ''}>🟢 Available</option>
            <option value="🔴 In Use" ${item.status && item.status.includes('In Use') ? 'selected' : ''}>🔴 In Use</option>
            <option value="🟡 Outgrown" ${item.status && item.status.includes('Outgrown') ? 'selected' : ''}>🟡 Outgrown</option>
            <option value="🔵 Reserved" ${item.status && item.status.includes('Reserved') ? 'selected' : ''}>🔵 Reserved</option>
          </select>
        </div>
      </div>

      <div class="form-group"><label>Owner</label><input type="text" id="edit-owner" class="form-input" value="${item.owner || ''}"></div>
      <div class="form-group"><label>Notes</label><textarea id="edit-notes" class="form-input" style="height:60px;">${item.notes_upgrades || ''}</textarea></div>

      <button type="submit" class="btn-primary">Save Updates 💾</button>
    </form>
  `;

  document.getElementById('modal-close-btn').addEventListener('click', () => document.getElementById('modal-overlay').classList.remove('active'));

  document.getElementById('edit-gear-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    item.brand = document.getElementById('edit-brand').value;
    item.model = document.getElementById('edit-model').value;
    item.size_label = document.getElementById('edit-size').value;
    item.min_height__in_ = document.getElementById('edit-min-h').value;
    item.max_height__in_ = document.getElementById('edit-max-h').value;
    item.bsl__mm_ = document.getElementById('edit-bsl').value;
    item.status = document.getElementById('edit-status').value;
    item.owner = document.getElementById('edit-owner').value;
    item.notes_upgrades = document.getElementById('edit-notes').value;

    document.getElementById('modal-overlay').classList.remove('active');
    renderView();
    alert('✅ Gear details updated!');
  });
}

// --- ADD GROM MODAL ---
function openAddGromModal() {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3 style="font-size:18px; font-weight:800;">👦 Add New Grom Profile</h3>
      <button id="modal-close-btn" style="background:none; border:none; color:#94a3b8; font-size:24px; cursor:pointer;">✕</button>
    </div>

    <form id="add-grom-form">
      <div class="form-group"><label>Child Name</label><input type="text" id="grom-name" class="form-input" placeholder="e.g. Elliot Gawne" required></div>
      <div class="form-group"><label>Parent Name</label><input type="text" id="grom-parent" class="form-input" placeholder="e.g. Andy Gawne" required></div>
      <div class="form-group"><label>Birth Date</label><input type="date" id="grom-dob" class="form-input" required></div>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="form-group"><label>Current Height (in)</label><input type="number" step="0.5" id="grom-height" class="form-input" placeholder="46.0" required></div>
        <div class="form-group"><label>Current Weight (lbs)</label><input type="number" id="grom-weight" class="form-input" placeholder="48.0"></div>
      </div>

      <div class="form-group"><label>Foot Length (in)</label><input type="number" step="0.1" id="grom-foot" class="form-input" placeholder="7.5" required></div>

      <button type="submit" class="btn-primary">Add Grom Profile 🚀</button>
    </form>
  `;

  overlay.classList.add('active');
  document.getElementById('modal-close-btn').addEventListener('click', () => overlay.classList.remove('active'));

  document.getElementById('add-grom-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newGrom = {
      grom_id: 'GROM-' + Math.floor(Math.random() * 9000 + 1000),
      child_name: document.getElementById('grom-name').value,
      parent_name: document.getElementById('grom-parent').value,
      birth_date: document.getElementById('grom-dob').value,
      current_height__in_: parseFloat(document.getElementById('grom-height').value),
      current_weight__lbs_: parseFloat(document.getElementById('grom-weight').value) || 0,
      foot_length__in_: parseFloat(document.getElementById('grom-foot').value),
      last_measured: new Date().toISOString().split('T')[0]
    };

    appData.groms.unshift(newGrom);
    selectedGromId = newGrom.grom_id;
    overlay.classList.remove('active');
    renderView();
    alert(`✅ Grom profile added for ${newGrom.child_name}!`);
  });
}

// --- LOG MEASUREMENT MODAL ---
function openLogMeasurementModal(grom) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3 style="font-size:18px; font-weight:800;">📏 Log Measurement for ${grom.child_name}</h3>
      <button id="modal-close-btn" style="background:none; border:none; color:#94a3b8; font-size:24px; cursor:pointer;">✕</button>
    </div>

    <form id="log-meas-form">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="form-group"><label>New Height (in)</label><input type="number" step="0.5" id="meas-height" class="form-input" value="${grom.current_height__in_ || ''}" required></div>
        <div class="form-group"><label>New Weight (lbs)</label><input type="number" id="meas-weight" class="form-input" value="${grom.current_weight__lbs_ || ''}"></div>
      </div>
      <div class="form-group"><label>New Foot Length (in)</label><input type="number" step="0.1" id="meas-foot" class="form-input" value="${grom.foot_length__in_ || ''}" required></div>

      <button type="submit" class="btn-primary">Save Measurement 📏</button>
    </form>
  `;

  overlay.classList.add('active');
  document.getElementById('modal-close-btn').addEventListener('click', () => overlay.classList.remove('active'));

  document.getElementById('log-meas-form').addEventListener('submit', (e) => {
    e.preventDefault();
    grom.current_height__in_ = parseFloat(document.getElementById('meas-height').value);
    grom.current_weight__lbs_ = parseFloat(document.getElementById('meas-weight').value) || grom.current_weight__lbs_;
    grom.foot_length__in_ = parseFloat(document.getElementById('meas-foot').value);
    grom.last_measured = new Date().toISOString().split('T')[0];

    overlay.classList.remove('active');
    renderView();
    alert(`✅ Measurements updated for ${grom.child_name}!`);
  });
}

// --- ADD CONSUMABLE MODAL ---
function openAddConsumableModal() {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3 style="font-size:18px; font-weight:800;">📦 Add Shop Consumable</h3>
      <button id="modal-close-btn" style="background:none; border:none; color:#94a3b8; font-size:24px; cursor:pointer;">✕</button>
    </div>

    <form id="add-cons-form">
      <div class="form-group"><label>Item Name</label><input type="text" id="cons-name" class="form-input" placeholder="e.g. Swix Cold Wax" required></div>
      <div class="form-group"><label>Garage Location</label><input type="text" id="cons-loc" class="form-input" placeholder="e.g. Andy's Garage" required></div>
      <div class="form-group"><label>Specs / Compatibility</label><input type="text" id="cons-specs" class="form-input" placeholder="e.g. 29 x 2.4 / 12-speed"></div>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="form-group"><label>Starting Qty</label><input type="number" id="cons-qty" class="form-input" value="1" required></div>
        <div class="form-group"><label>Min Alert Threshold</label><input type="number" id="cons-thresh" class="form-input" value="1" required></div>
      </div>

      <button type="submit" class="btn-primary">Add Consumable Item 📦</button>
    </form>
  `;

  overlay.classList.add('active');
  document.getElementById('modal-close-btn').addEventListener('click', () => overlay.classList.remove('active'));

  document.getElementById('add-cons-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newCons = {
      item_id: 'CONS-' + Math.floor(Math.random() * 9000 + 1000),
      item_name: document.getElementById('cons-name').value,
      garage_location: document.getElementById('cons-loc').value,
      specs_compatibility: document.getElementById('cons-specs').value,
      quantity: parseInt(document.getElementById('cons-qty').value) || 1,
      min_threshold: parseInt(document.getElementById('cons-thresh').value) || 1
    };

    appData.consumables.unshift(newCons);
    overlay.classList.remove('active');
    renderView();
    alert(`✅ Added ${newCons.item_name} to Consumables Depot!`);
  });
}

function openSettingsModal() {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  const currentUrl = getSavedApiUrl();
  const currentGemini = localStorage.getItem('geargromz_gemini_key') || '';

  content.innerHTML = `
    <div style="display:flex; justify-between; align-items:center; margin-bottom:16px;">
      <h3 style="font-size:18px; font-weight:800;">⚙️ App & API Settings</h3>
      <button id="modal-close-btn" style="background:none; border:none; color:#94a3b8; font-size:24px; cursor:pointer;">✕</button>
    </div>

    <div class="form-group">
      <label>Google Apps Script Web App URL</label>
      <input type="text" id="setting-api-url" class="form-input" placeholder="https://script.google.com/macros/s/.../exec" value="${currentUrl}">
      <span style="font-size:11px; color:#94a3b8; margin-top:4px;">Paste the Web app URL generated from your Google Sheet Apps Script deployment.</span>
    </div>

    <div class="form-group">
      <label>Google Gemini API Key (Optional for AI Photo Snap)</label>
      <input type="text" id="setting-gemini-key" class="form-input" placeholder="AIzaSy..." value="${currentGemini}">
    </div>

    <button id="save-settings-btn" class="btn-primary">Save Settings & Connect Sheet</button>
  `;

  overlay.classList.add('active');

  document.getElementById('modal-close-btn').addEventListener('click', () => overlay.classList.remove('active'));

  document.getElementById('save-settings-btn').addEventListener('click', async () => {
    const newUrl = document.getElementById('setting-api-url').value;
    const newGemini = document.getElementById('setting-gemini-key').value;
    saveApiUrl(newUrl);
    localStorage.setItem('geargromz_gemini_key', newGemini.trim());
    overlay.classList.remove('active');
    updateApiStatusIndicator();
    await loadData();
  });
}
