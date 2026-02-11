const STORAGE_KEYS = {
  BRANCHES: 'eth_ca_branches',
  PRODUCTIONS: 'eth_ca_productions',
  TARGETS: 'eth_ca_targets',
  SETTINGS: 'eth_ca_settings',
};

export function loadFromStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function loadBranches() {
  return loadFromStorage(STORAGE_KEYS.BRANCHES, [
    { id: 'merkez', name: 'Merkez Şube', isMain: true },
  ]);
}

export function saveBranches(branches) {
  return saveToStorage(STORAGE_KEYS.BRANCHES, branches);
}

export function loadProductions() {
  return loadFromStorage(STORAGE_KEYS.PRODUCTIONS, []);
}

export function saveProductions(productions) {
  return saveToStorage(STORAGE_KEYS.PRODUCTIONS, productions);
}

export function loadTargets() {
  return loadFromStorage(STORAGE_KEYS.TARGETS, null);
}

export function saveTargets(targets) {
  return saveToStorage(STORAGE_KEYS.TARGETS, targets);
}

export function loadSettings() {
  return loadFromStorage(STORAGE_KEYS.SETTINGS, {
    companyName: 'Acente Adı',
    currentYear: new Date().getFullYear(),
    currentStep: 1,
  });
}

export function saveSettings(settings) {
  return saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}
