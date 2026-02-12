const VL_KEYS = {
  CASES: 'vl_cases',
  LAWYERS: 'vl_lawyers',
  SETTINGS: 'vl_settings',
};

function load(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore */ }
}

export function loadCases() {
  return load(VL_KEYS.CASES, []);
}

export function saveCases(cases) {
  save(VL_KEYS.CASES, cases);
}

export function loadLawyers() {
  return load(VL_KEYS.LAWYERS, []);
}

export function saveLawyers(lawyers) {
  save(VL_KEYS.LAWYERS, lawyers);
}

export function loadVLSettings() {
  return load(VL_KEYS.SETTINGS, { defaultFeePercentage: 20, profitSplit: 50 });
}

export function saveVLSettings(settings) {
  save(VL_KEYS.SETTINGS, settings);
}
