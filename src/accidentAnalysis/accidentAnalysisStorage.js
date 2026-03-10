const STORAGE_KEYS = {
  analyses: 'aa_analyses',
  settings: 'aa_settings',
};

export function loadAnalyses() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.analyses);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAnalyses(analyses) {
  localStorage.setItem(STORAGE_KEYS.analyses, JSON.stringify(analyses));
}

export function loadAASettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.settings);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveAASettings(settings) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}
