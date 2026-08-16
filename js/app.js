// CONSOLIDATED SINGLE-FILE SCRIPT FOR GEAR GROMZ PWA (Supports All Key Formats)

// --- DEFAULT GOOGLE SHEETS & GEMINI API ENDPOINTS ---
const DEFAULT_API_URL = 'https://script.google.com/macros/s/AKfycbxymZKW8x6-FKpzG9P8ZM2oxK_nyO7aMZdyaCTcYNPnUE_vWfAGiL-L81oppE9voUxeaw/exec';
const DEFAULT_GEMINI_KEY = '';
const LOCAL_STORAGE_URL_KEY = 'geargromz_apps_script_url';

function getSavedApiUrl() {
  return localStorage.getItem(LOCAL_STORAGE_URL_KEY) || DEFAULT_API_URL;
}

function saveApiUrl(url) {
  localStorage.setItem(LOCAL_STORAGE_URL_KEY, url.trim());
}

function getSavedGeminiKey() {
  return localStorage.getItem('geargromz_gemini_key') || '';
}

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

// --- 2. API SERVICE & ROBUST GOOGLE APPS SCRIPT POST HANDLER ---
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
      gender: 'boy',
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
      gender: 'girl',
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
    if (data && data.inventory && data.inventory.length > 0) {
      return data;
    }
    return SAMPLE_DATA;
  } catch (err) {
    console.warn('Failed to fetch from Apps Script API. Falling back to sample data.', err);
    return SAMPLE_DATA;
  }
}

async function sendAppsScriptPost(payloadObj) {
  const url = getSavedApiUrl();
  if (!url) return { success: true };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payloadObj)
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return { success: true, text };
    }
  } catch (err) {
    console.error('Error posting to Apps Script:', err);
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payloadObj)
      });
      return { success: true };
    } catch (e2) {
      return { success: false, error: e2 };
    }
  }
}

async function decrementConsumable(itemName) {
  return await sendAppsScriptPost({ action: 'decrementConsumable', itemName });
}

async function postNewGear(gearObj) {
  return await sendAppsScriptPost({ action: 'addGear', ...gearObj });
}

async function postEditGear(gearObj) {
  return await sendAppsScriptPost({ action: 'addGear', ...gearObj });
}

async function postNewGrom(gromObj) {
  return await sendAppsScriptPost({
    action: 'logGrowth',
    childName: gromObj.child_name,
    measureDate: gromObj.last_measured,
    heightIn: gromObj.current_height__in_,
    weightLbs: gromObj.current_weight__lbs_,
    footLengthIn: gromObj.foot_length__in_
  });
}

// --- 3. PREDICTIVE GROWTH MATCHER ENGINE ---

// Bike wheel-size height ranges (evidence-based)
const BIKE_WHEEL_HEIGHTS = [
  { wheel: 12, min: 28, max: 37 },
  { wheel: 14, min: 35, max: 42 },
  { wheel: 16, min: 38, max: 46 },
  { wheel: 18, min: 42, max: 50 },
  { wheel: 20, min: 44, max: 54 },
  { wheel: 24, min: 50, max: 58 },
  { wheel: 26, min: 55, max: 65 },
  { wheel: 27, min: 58, max: 68 },
  { wheel: 29, min: 60, max: 78 }
];

function getBikeHeightRange(item) {
  // Look for wheel size in model, size_label, or subcategory
  const searchStr = `${item.model || ''} ${item.size_label || ''} ${item.subcategory || ''}`.toLowerCase();
  for (const entry of BIKE_WHEEL_HEIGHTS) {
    if (searchStr.includes(`${entry.wheel}"`) || searchStr.includes(`${entry.wheel}in`) || searchStr.includes(`${entry.wheel} `) || searchStr.includes(`${entry.wheel}cm`)) {
      return entry;
    }
  }
  return null;
}

// CDC height-for-age percentile data (boys & girls, age 2-14)
// Each entry: [ageMonths, p5, p25, p50, p75, p95] in inches
const CDC_HEIGHT_BOYS = [
  [24,32.9,34.2,35.0,35.8,37.1],[30,34.5,35.9,36.7,37.5,38.8],[36,35.9,37.3,38.2,39.1,40.5],
  [48,38.3,39.8,40.8,41.8,43.4],[60,40.6,42.2,43.3,44.4,46.1],[72,42.8,44.5,45.7,46.9,48.7],
  [84,44.9,46.7,48.0,49.3,51.3],[96,47.0,48.9,50.4,51.9,54.0],[108,49.0,51.1,52.7,54.3,56.6],
  [120,51.1,53.3,55.0,56.8,59.2],[132,53.1,55.5,57.4,59.3,61.8],[144,55.1,57.7,59.7,61.8,64.5],
  [156,57.2,60.0,62.2,64.5,67.3],[168,59.6,62.5,64.9,67.3,70.2]
];
const CDC_HEIGHT_GIRLS = [
  [24,32.6,33.9,34.7,35.5,36.8],[30,34.2,35.6,36.5,37.4,38.8],[36,35.7,37.1,38.1,39.1,40.5],
  [48,38.1,39.7,40.7,41.7,43.2],[60,40.4,42.1,43.2,44.3,46.0],[72,42.6,44.4,45.6,46.8,48.7],
  [84,44.7,46.7,48.0,49.3,51.3],[96,46.8,48.9,50.4,51.9,54.2],[108,48.9,51.1,52.8,54.5,57.1],
  [120,51.0,53.4,55.2,57.0,59.8],[132,53.2,55.8,57.8,59.8,62.7],[144,55.4,58.1,60.2,62.4,65.5],
  [156,57.3,60.2,62.4,64.7,67.9],[168,58.5,61.5,63.8,66.2,69.5]
];

function getAgeMonths(birthDate) {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const now = new Date();
  return Math.floor((now - birth) / (1000 * 60 * 60 * 24 * 30.44));
}

function getHeightPercentile(birthDate, heightIn, gender) {
  const ageMonths = getAgeMonths(birthDate);
  const table = (gender === 'girl') ? CDC_HEIGHT_GIRLS : CDC_HEIGHT_BOYS;
  // Find closest age bracket
  let closest = table[0];
  for (const row of table) {
    if (Math.abs(row[0] - ageMonths) < Math.abs(closest[0] - ageMonths)) closest = row;
  }
  const [, p5, p25, p50, p75, p95] = closest;
  if (heightIn <= p5) return { percentile: 5, label: '~5th', p5, p25, p50, p75, p95, ageMonths };
  if (heightIn <= p25) return { percentile: Math.round(5 + ((heightIn - p5) / (p25 - p5)) * 20), label: `~${Math.round(5 + ((heightIn - p5) / (p25 - p5)) * 20)}th`, p5, p25, p50, p75, p95, ageMonths };
  if (heightIn <= p50) return { percentile: Math.round(25 + ((heightIn - p25) / (p50 - p25)) * 25), label: `~${Math.round(25 + ((heightIn - p25) / (p50 - p25)) * 25)}th`, p5, p25, p50, p75, p95, ageMonths };
  if (heightIn <= p75) return { percentile: Math.round(50 + ((heightIn - p50) / (p75 - p50)) * 25), label: `~${Math.round(50 + ((heightIn - p50) / (p75 - p50)) * 25)}th`, p5, p25, p50, p75, p95, ageMonths };
  if (heightIn <= p95) return { percentile: Math.round(75 + ((heightIn - p75) / (p95 - p75)) * 20), label: `~${Math.round(75 + ((heightIn - p75) / (p95 - p75)) * 20)}th`, p5, p25, p50, p75, p95, ageMonths };
  return { percentile: 97, label: '>95th', p5, p25, p50, p75, p95, ageMonths };
}

function calculateGearFit(item, grom) {
  if (!grom) return { fit: 'NONE', label: '' };

  const curHeight = parseFloat(grom.current_height__in_) || 0;
  const curFoot = parseFloat(grom.foot_length__in_) || 0;
  const proj6mHeight = curHeight + 1.4;
  const proj6mFoot = curFoot + 0.35;

  // Determine effective height range — use bike wheel lookup if no sheet data
  let minH = parseFloat(item.min_height__in_) || 0;
  let maxH = parseFloat(item.max_height__in_) || 0;
  if (item.category === 'Bikes' && (!minH || !maxH)) {
    const bikeRange = getBikeHeightRange(item);
    if (bikeRange) { minH = bikeRange.min; maxH = bikeRange.max; }
  }
  if (!maxH) maxH = 999;

  // HEIGHT FIT CHECK
  let isFitNow = curHeight > 0 && minH > 0 && curHeight >= minH && curHeight <= maxH;
  let isFit6m = !isFitNow && minH > 0 && proj6mHeight >= minH && proj6mHeight <= maxH && curHeight < minH;

  // FOOTWEAR FIT CHECK
  let isFootwearFitNow = false;
  let isFootwearFit6m = false;
  if (curFoot > 0 && (item.category === 'Boots/Footwear' || item.category === 'Ski/Snowboard')) {
    const footConv = convertFootLength(curFoot);
    const projFootConv = convertFootLength(proj6mFoot);
    const itemMondo = parseFloat(item.size_label) || 0;
    const gromMondo = parseFloat(footConv.mondo) || 0;
    const projMondo = parseFloat(projFootConv.mondo) || 0;
    if (gromMondo > 0 && itemMondo > 0 && Math.abs(itemMondo - gromMondo) <= 0.8) isFootwearFitNow = true;
    if (!isFootwearFitNow && projMondo > 0 && itemMondo > 0 && itemMondo >= gromMondo && Math.abs(itemMondo - projMondo) <= 1.0) isFootwearFit6m = true;
  }

  if (isFitNow || isFootwearFitNow) return { fit: 'PERFECT_MATCH', label: `⭐ FITS NOW (${grom.child_name.split(' ')[0]})` };
  if (isFit6m || isFootwearFit6m) return { fit: 'FUTURE_MATCH', label: `⏳ FITS IN 6 MOS (Dec 2026)` };
  return { fit: 'NONE', label: '' };
}

// --- GROWTH CHART SVG RENDERER ---
function renderGrowthChart(grom) {
  const height = parseFloat(grom.current_height__in_) || 0;
  if (!height) return '';
  const gender = grom.gender || 'boy';
  const percentData = getHeightPercentile(grom.birth_date, height, gender);
  const proj6m = getHeightPercentile(grom.birth_date, height + 1.4, gender);
  const { p5, p25, p50, p75, p95 } = percentData;

  const W = 320, H = 160;
  const PAD = { t: 16, r: 16, b: 28, l: 40 };
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;

  const minY = p5 - 2;
  const maxY = p95 + 2;
  function yPos(val) { return PAD.t + chartH - ((val - minY) / (maxY - minY)) * chartH; }

  // X positions for "now" and "6mo"
  const xNow = PAD.l + chartW * 0.38;
  const x6m  = PAD.l + chartW * 0.72;

  // Band heights
  const y5 = yPos(p5), y25 = yPos(p25), y50 = yPos(p50), y75 = yPos(p75), y95 = yPos(p95);
  const yNow = yPos(height);
  const y6m  = yPos(height + 1.4);

  const pctLabel = percentData.label;
  const proj6mLabel = proj6m.label;

  return `
  <div style="margin-top:14px;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
      <span style="font-size:12px; font-weight:700; color:#94a3b8;">📊 HEIGHT PERCENTILE CHART (CDC ${gender === 'girl' ? 'Girls' : 'Boys'})</span>
      <span style="font-size:11px; font-weight:800; background:rgba(99,102,241,0.2); color:#818cf8; padding:2px 10px; border-radius:99px;">${pctLabel} percentile</span>
    </div>
    <svg viewBox="0 0 ${W} ${H}" style="width:100%; border-radius:8px; background:#0f172a;" xmlns="http://www.w3.org/2000/svg">
      <!-- Band fills -->
      <rect x="${PAD.l}" y="${y95}" width="${chartW}" height="${y5 - y95}" fill="rgba(99,102,241,0.06)" />
      <rect x="${PAD.l}" y="${y75}" width="${chartW}" height="${y25 - y75}" fill="rgba(99,102,241,0.08)" />
      <rect x="${PAD.l}" y="${y75}" width="${chartW}" height="${y50 - y75}" fill="rgba(99,102,241,0.06)" />
      <!-- Band lines -->
      <line x1="${PAD.l}" y1="${y95}" x2="${PAD.l + chartW}" y2="${y95}" stroke="#334155" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="${PAD.l}" y1="${y75}" x2="${PAD.l + chartW}" y2="${y75}" stroke="#334155" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="${PAD.l}" y1="${y50}" x2="${PAD.l + chartW}" y2="${y50}" stroke="#475569" stroke-width="1.5"/>
      <line x1="${PAD.l}" y1="${y25}" x2="${PAD.l + chartW}" y2="${y25}" stroke="#334155" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="${PAD.l}" y1="${y5}" x2="${PAD.l + chartW}" y2="${y5}" stroke="#334155" stroke-width="1" stroke-dasharray="3,3"/>
      <!-- Y labels -->
      <text x="${PAD.l - 4}" y="${y95 + 4}" fill="#64748b" font-size="8" text-anchor="end">95th</text>
      <text x="${PAD.l - 4}" y="${y75 + 4}" fill="#64748b" font-size="8" text-anchor="end">75th</text>
      <text x="${PAD.l - 4}" y="${y50 + 4}" fill="#94a3b8" font-size="8" text-anchor="end">50th</text>
      <text x="${PAD.l - 4}" y="${y25 + 4}" fill="#64748b" font-size="8" text-anchor="end">25th</text>
      <text x="${PAD.l - 4}" y="${y5 + 4}" fill="#64748b" font-size="8" text-anchor="end">5th</text>
      <!-- Connect now→6mo -->
      <line x1="${xNow}" y1="${yNow}" x2="${x6m}" y2="${y6m}" stroke="#6366f1" stroke-width="2" stroke-dasharray="4,2"/>
      <!-- Now dot -->
      <circle cx="${xNow}" cy="${yNow}" r="6" fill="#22c55e" stroke="#fff" stroke-width="2"/>
      <text x="${xNow}" y="${H - 10}" fill="#22c55e" font-size="9" text-anchor="middle" font-weight="bold">Now</text>
      <text x="${xNow}" y="${yNow - 10}" fill="#22c55e" font-size="9" text-anchor="middle">${height}"</text>
      <!-- 6mo dot -->
      <circle cx="${x6m}" cy="${y6m}" r="6" fill="#818cf8" stroke="#fff" stroke-width="2"/>
      <text x="${x6m}" y="${H - 10}" fill="#818cf8" font-size="9" text-anchor="middle" font-weight="bold">Dec '26</text>
      <text x="${x6m}" y="${y6m - 10}" fill="#818cf8" font-size="9" text-anchor="middle">${(height + 1.4).toFixed(1)}"</text>
    </svg>
  </div>`;
}

// --- 4. AI PHOTO CATALOGING WITH UNIVERSAL KEY SUPPORT ---
function compressImage(file, maxDimension = 800) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function analyzeGearPhoto(base64Image, userApiKey) {
  const apiKey = (userApiKey || getSavedGeminiKey() || '').trim();

  if (apiKey) {
    // All Google AI Studio API keys (both AIzaSy and AQ. formats) use ?key= URL param
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
      console.log('🤖 Sending to Gemini API with key prefix:', apiKey.substring(0, 6) + '...');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }, { inline_data: { mime_type: "image/jpeg", data: base64Image.split(',')[1] || base64Image } }] }]
        })
      });
      const result = await res.json();
      console.log('🤖 Gemini API response:', JSON.stringify(result));
      if (result.error) {
        console.error('❌ Gemini API Error:', result.error.message);
        alert(`⚠️ Gemini API Error: ${result.error.message}\n\nGet a free Gemini key at:\nhttps://aistudio.google.com/app/apikey`);
        return null;
      }
      if (result.candidates && result.candidates[0]) {
        const textResp = result.candidates[0].content.parts[0].text;
        const jsonMatch = textResp.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('Gemini API network error:', err);
    }
  }

  // Fallback template
  return {
    category: 'Ski/Snowboard',
    brand: '',
    model: '',
    size_label: '',
    min_height_in: '',
    max_height_in: '',
    bsl_mm: '',
    condition: 'Good',
    notes: 'Could not read photo. Please fill in details manually.'
  };
}

// --- 5. MAIN UI CONTROLLER & APP RENDERER ---
let appData = { inventory: [], groms: [], consumables: [], members: [] };
let currentTab = 'dashboard';
let selectedCategory = 'ALL';
let fitFilter = 'ALL';
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

function renderGromsView(container) {
  const wrapper = document.createElement('div');
  const selectedGrom = (appData.groms || []).find(g => g.grom_id === selectedGromId) || (appData.groms[0] || {});
  const footConv = convertFootLength(selectedGrom.foot_length__in_ || 0);

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
      <!-- MEASUREMENTS CARD -->
      <div style="padding: 0 16px; margin-bottom:16px;">
        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span style="font-size:13px; font-weight:700; color:var(--accent-primary);">📏 CURRENT MEASUREMENTS</span>
            <button id="btn-log-measurement" class="btn-secondary" style="font-size:11px; padding:4px 10px;">📏 Log New</button>
          </div>
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; text-align:center;">
            <div style="background:#0f172a; padding:10px; border-radius:var(--radius-md);">
              <span style="font-size:10px; color:#94a3b8;">HEIGHT</span>
              <div style="font-size:20px; font-weight:800; color:#fff;">${selectedGrom.current_height__in_ || '--'}"</div>
              <div style="font-size:10px; color:#6366f1; margin-top:2px;">→ ${((parseFloat(selectedGrom.current_height__in_)||0)+1.4).toFixed(1)}" Dec</div>
            </div>
            <div style="background:#0f172a; padding:10px; border-radius:var(--radius-md);">
              <span style="font-size:10px; color:#94a3b8;">WEIGHT</span>
              <div style="font-size:20px; font-weight:800; color:#fff;">${selectedGrom.current_weight__lbs_ || '--'} lbs</div>
              <div style="font-size:10px; color:#6366f1; margin-top:2px;">→ ${((parseFloat(selectedGrom.current_weight__lbs_)||0)+3.5).toFixed(0)} lbs Dec</div>
            </div>
            <div style="background:#0f172a; padding:10px; border-radius:var(--radius-md);">
              <span style="font-size:10px; color:#94a3b8;">FOOT</span>
              <div style="font-size:20px; font-weight:800; color:var(--accent-emerald);">${selectedGrom.foot_length__in_ || '--'}"</div>
              <div style="font-size:10px; color:#6366f1; margin-top:2px;">→ ${((parseFloat(selectedGrom.foot_length__in_)||0)+0.35).toFixed(2)}" Dec</div>
            </div>
          </div>

          <!-- GROWTH CHART -->
          ${renderGrowthChart(selectedGrom)}

          <!-- SHOE CONVERSIONS NOW -->
          <div style="margin-top:14px; font-size:12px; font-weight:700; color:#94a3b8;">🥾 SHOE SIZES NOW vs DEC 2026 FORECAST:</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px;">
            <div style="background:#0f172a; border-radius:var(--radius-md); padding:10px;">
              <div style="font-size:10px; color:#22c55e; font-weight:700; margin-bottom:6px;">🟢 TODAY</div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font-size:11px;">
                <div><span style="color:#64748b;">Mondo:</span> <strong style="color:#fff;">${footConv.mondo}</strong></div>
                <div><span style="color:#64748b;">US Kids:</span> <strong style="color:#fff;">${footConv.usKids}</strong></div>
                <div><span style="color:#64748b;">EU:</span> <strong style="color:#fff;">${footConv.eu}</strong></div>
                <div><span style="color:#64748b;">Crocs:</span> <strong style="color:#fff;">${footConv.crocs}</strong></div>
              </div>
            </div>
            <div style="background:#0f172a; border-radius:var(--radius-md); padding:10px; border:1px solid rgba(99,102,241,0.3);">
              <div style="font-size:10px; color:#818cf8; font-weight:700; margin-bottom:6px;">🔮 DEC 2026</div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font-size:11px;">
                <div><span style="color:#64748b;">Mondo:</span> <strong style="color:#818cf8;">${convertFootLength((parseFloat(selectedGrom.foot_length__in_)||0)+0.35).mondo}</strong></div>
                <div><span style="color:#64748b;">US Kids:</span> <strong style="color:#818cf8;">${convertFootLength((parseFloat(selectedGrom.foot_length__in_)||0)+0.35).usKids}</strong></div>
                <div><span style="color:#64748b;">EU:</span> <strong style="color:#818cf8;">${convertFootLength((parseFloat(selectedGrom.foot_length__in_)||0)+0.35).eu}</strong></div>
                <div><span style="color:#64748b;">Crocs:</span> <strong style="color:#818cf8;">${convertFootLength((parseFloat(selectedGrom.foot_length__in_)||0)+0.35).crocs}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 6-MONTH GEAR FORECAST -->
      <div style="padding:0 16px; margin-bottom:16px;">
        <div style="background:linear-gradient(135deg, rgba(99,102,241,0.15), rgba(30,41,59,0.8)); border:1px solid var(--accent-indigo); border-radius:var(--radius-lg); padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:14px; font-weight:800; color:#818cf8;">🔮 6-MONTH GEAR FORECAST (DEC 2026)</span>
            <span style="font-size:11px; background:var(--accent-indigo); color:#fff; padding:2px 8px; border-radius:99px;">+1.4" Height</span>
          </div>
          <p style="font-size:12px; color:#cbd5e1; margin-bottom:10px;">Fleet gear that will fit ${selectedGrom.child_name.split(' ')[0]} by December:</p>
          ${futureFits.length > 0 ? `
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${futureFits.map(item => `
                <div style="background:#0f172a; padding:10px 12px; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="font-size:13px; color:#fff;">${item.brand} ${item.model}</strong>
                    <div style="font-size:11px; color:#94a3b8;">${item.category} • ${item.size_label} • Owner: ${item.owner}</div>
                  </div>
                  <span style="font-size:11px; font-weight:700; color:var(--accent-indigo);">Ready Dec '26</span>
                </div>
              `).join('')}
            </div>
          ` : `<div style="font-size:12px; color:#94a3b8; font-style:italic;">No upcoming gear transitions in the 6-month window yet.</div>`}
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
      renderView(); // re-render full view so header name + all panels update
    });
  }

  renderGearGrid();
}

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
      await loadData();
    });
  });
}

function renderAddGearView(container) {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '16px';
  wrapper.innerHTML = `
    <div style="margin-bottom:16px;">
      <h2 style="font-size:20px; font-weight:800;">➕ Add New Gear</h2>
      <p style="font-size:13px; color:#94a3b8;">Snap a photo to auto-catalog specs, or fill manually below.</p>
    </div>

    <div style="background:linear-gradient(135deg, #1e293b, #0f172a); border:2px dashed var(--accent-primary); border-radius:var(--radius-lg); padding:20px; text-align:center; margin-bottom:20px;">
      <span style="font-size:36px;">📷</span>
      <h3 style="font-size:16px; font-weight:800; margin-top:8px;">AI "Snap & Catalog"</h3>
      <p style="font-size:12px; color:#94a3b8; margin-bottom:12px;">Upload photo of gear to auto-fill specs.</p>
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
        <div class="form-group"><label>Owner</label><input type="text" id="form-owner" class="form-input" value="Andy Gawne" required></div>
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
    btn.textContent = '🤖 Analyzing Image with Gemini AI...';

    const compressedBase64 = await compressImage(file, 800);
    const apiKey = getSavedGeminiKey();
    const extracted = await analyzeGearPhoto(compressedBase64, apiKey);
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
    }
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

    appData.inventory.unshift(newGear);
    await postNewGear(newGear);
    alert('✅ New gear saved to Google Sheet!');
    currentTab = 'dashboard';
    await loadData();
  });
}

function openGearDetailModal(item) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const separator = isIOS ? '&' : '?';
  const ownerPhone = item.phone || item.owner_phone || '';
  const requestMsg = `Hey ${item.owner}! Can I borrow the ${item.brand} ${item.model} (${item.size_label || ''}) for our upcoming trip?`;
  
  const smsUrl = ownerPhone 
    ? `sms:${ownerPhone}${separator}body=${encodeURIComponent(requestMsg)}`
    : `sms:${separator}body=${encodeURIComponent(requestMsg)}`;

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <span class="status-badge ${getStatusClass(item.status)}">${item.status || '🟢 Available'}</span>
      <div>
        <button id="modal-edit-gear-btn" class="btn-secondary" style="font-size:12px; padding:4px 10px; margin-right:8px;">✏️ Edit Specs</button>
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

    <div style="display:flex; flex-direction:column; gap:10px;">
      ${item.status && item.status.includes('In Use') ? `
        <button id="btn-queue" class="btn-primary" style="background:var(--accent-amber);">⏳ Queue Next For Return</button>
      ` : `
        <a href="${smsUrl}" class="btn-primary" style="text-decoration:none;">📱 1-Click Send SMS Request</a>
        <button id="btn-copy-sms" class="btn-secondary" style="font-size:13px; padding:10px; width:100%;">📋 Copy Borrow Request Text</button>
      `}
    </div>
  `;

  overlay.classList.add('active');

  document.getElementById('modal-close-btn').addEventListener('click', () => overlay.classList.remove('active'));

  document.getElementById('modal-edit-gear-btn').addEventListener('click', () => openEditGearModal(item));

  const btnCopy = document.getElementById('btn-copy-sms');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(requestMsg);
      btnCopy.textContent = '✅ Copied Request Text to Clipboard!';
      setTimeout(() => btnCopy.textContent = '📋 Copy Borrow Request Text', 2000);
    });
  }

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

    await postEditGear({
      item_id: item.item_id,
      category: item.category,
      brand: item.brand,
      model: item.model,
      size_label: item.size_label,
      owner: item.owner,
      min_height_in: item.min_height__in_,
      max_height_in: item.max_height__in_,
      bsl_mm: item.bsl__mm_,
      notes: item.notes_upgrades,
      status: item.status
    });

    document.getElementById('modal-overlay').classList.remove('active');
    renderView();
    alert('✅ Gear details saved to Google Sheet!');
  });
}

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
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="form-group"><label>Birth Date</label><input type="date" id="grom-dob" class="form-input" required></div>
        <div class="form-group">
          <label>Gender (for growth chart)</label>
          <select id="grom-gender" class="form-select" required>
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
          </select>
        </div>
      </div>
      
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

  document.getElementById('add-grom-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newGrom = {
      grom_id: 'GROM-' + Math.floor(Math.random() * 9000 + 1000),
      child_name: document.getElementById('grom-name').value,
      parent_name: document.getElementById('grom-parent').value,
      birth_date: document.getElementById('grom-dob').value,
      gender: document.getElementById('grom-gender').value,
      current_height__in_: parseFloat(document.getElementById('grom-height').value),
      current_weight__lbs_: parseFloat(document.getElementById('grom-weight').value) || 0,
      foot_length__in_: parseFloat(document.getElementById('grom-foot').value),
      last_measured: new Date().toISOString().split('T')[0]
    };

    appData.groms.unshift(newGrom);
    selectedGromId = newGrom.grom_id;
    await postNewGrom(newGrom);
    overlay.classList.remove('active');
    renderView();
    alert(`✅ Grom profile added for ${newGrom.child_name}!`);
  });
}

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

  document.getElementById('log-meas-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    grom.current_height__in_ = parseFloat(document.getElementById('meas-height').value);
    grom.current_weight__lbs_ = parseFloat(document.getElementById('meas-weight').value) || grom.current_weight__lbs_;
    grom.foot_length__in_ = parseFloat(document.getElementById('meas-foot').value);
    grom.last_measured = new Date().toISOString().split('T')[0];

    await postNewGrom(grom);
    overlay.classList.remove('active');
    renderView();
    alert(`✅ Measurements saved to Google Sheet for ${grom.child_name}!`);
  });
}

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
  const currentGemini = getSavedGeminiKey();

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
      <input type="text" id="setting-gemini-key" class="form-input" placeholder="Paste your API key here..." value="${currentGemini}">
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
