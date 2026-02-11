export const INSURANCE_TYPES = [
  { key: 'trafik', label: 'Trafik', color: '#3b82f6', icon: '🚗' },
  { key: 'kasko', label: 'Kasko', color: '#8b5cf6', icon: '🛡️' },
  { key: 'isyeri', label: 'İşyeri', color: '#f59e0b', icon: '🏢' },
  { key: 'konut', label: 'Konut', color: '#10b981', icon: '🏠' },
  { key: 'saglik', label: 'Sağlık', color: '#ef4444', icon: '❤️' },
  { key: 'dask', label: 'DASK', color: '#06b6d4', icon: '🏗️' },
  { key: 'diger', label: 'Diğer', color: '#6b7280', icon: '📋' },
];

export const STEPS = [
  { level: 1, label: 'Basamak 1', multiplier: 1.0 },
  { level: 2, label: 'Basamak 2', multiplier: 1.15 },
  { level: 3, label: 'Basamak 3', multiplier: 1.30 },
  { level: 4, label: 'Basamak 4', multiplier: 1.50 },
  { level: 5, label: 'Basamak 5', multiplier: 1.75 },
];

export const DEFAULT_TARGETS = {
  trafik: { premium: 5000000, policyCount: 2000 },
  kasko: { premium: 8000000, policyCount: 800 },
  isyeri: { premium: 3000000, policyCount: 500 },
  konut: { premium: 2000000, policyCount: 1000 },
  saglik: { premium: 4000000, policyCount: 600 },
  dask: { premium: 1500000, policyCount: 1500 },
  diger: { premium: 2000000, policyCount: 400 },
};

export const PERIOD_FILTERS = [
  { key: 'daily', label: 'Günlük' },
  { key: 'monthly', label: 'Aylık' },
  { key: 'yearly', label: 'Yıllık' },
];

export function formatCurrency(value) {
  if (value == null || isNaN(value)) return '0 ₺';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value) {
  if (value == null || isNaN(value)) return '0';
  return new Intl.NumberFormat('tr-TR').format(value);
}

export function formatPercent(value) {
  if (value == null || isNaN(value)) return '%0';
  return `%${Math.round(value)}`;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
