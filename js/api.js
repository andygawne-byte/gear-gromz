// API SERVICE & LOCAL DATA MANAGER FOR GEAR GROMZ

const LOCAL_STORAGE_URL_KEY = 'geargromz_apps_script_url';

export function getSavedApiUrl() {
  return localStorage.getItem(LOCAL_STORAGE_URL_KEY) || '';
}

export function saveApiUrl(url) {
  localStorage.setItem(LOCAL_STORAGE_URL_KEY, url.trim());
}

// SAMPLE SEED DATA (Used when API URL is not set or offline)
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
      max_height__in_: 56,
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
      min_height__in_: 46,
      max_height__in_: 52,
      min_weight__lbs_: 45,
      max_weight__lbs_: 75,
      standover_height__in_: '',
      bsl__mm_: 255,
      owner: 'Alex',
      current_custodian: 'Henry Murray',
      home_zone: 'Alex\'s Garage',
      current_location: 'Henry\'s SUV',
      status: '🔴 In Use',
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
      size_label: '21.5 - 24.5 Mondo',
      min_height__in_: 44,
      max_height__in_: 54,
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
      min_height__in_: 50,
      max_height__in_: 55,
      min_weight__lbs_: 60,
      max_weight__lbs_: 85,
      standover_height__in_: '',
      bsl__mm_: '',
      owner: 'Henry Murray',
      current_custodian: 'Henry Murray',
      home_zone: 'Henry\'s Shop',
      current_location: 'Henry\'s Shop',
      status: '🟡 Outgrown',
      condition: 'Good',
      notes_upgrades: 'Freshly washed with Nikwax TX.Direct DWR.',
      image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=60'
    }
  ],
  groms: [
    {
      grom_id: 'GROM-1',
      parent_name: 'Andy Gawne',
      child_name: 'Liam Gawne',
      birth_date: '2017-04-12',
      current_height__in_: 50.5,
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

export async function fetchAllData() {
  const url = getSavedApiUrl();
  if (!url) {
    console.log('No Apps Script API URL configured. Returning sample seed data.');
    return SAMPLE_DATA;
  }

  try {
    const response = await fetch(`${url}?action=all`);
    if (!response.ok) throw new Error('API Response not ok');
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Failed to fetch from Apps Script API. Falling back to local/seed data.', err);
    return SAMPLE_DATA;
  }
}

export async function decrementConsumable(itemName) {
  const url = getSavedApiUrl();
  if (!url) {
    // Local fallback edit
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

export async function postNewGear(gearObj) {
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
