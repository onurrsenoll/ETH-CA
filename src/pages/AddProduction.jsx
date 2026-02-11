import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INSURANCE_TYPES, formatCurrency, formatNumber } from '../utils/constants';
import { PlusCircle, Trash2, CheckCircle } from 'lucide-react';

export default function AddProduction() {
  const { branches, productions, addProduction, removeProduction } = useApp();

  const [form, setForm] = useState({
    branchId: branches[0]?.id || '',
    insuranceType: 'trafik',
    premium: '',
    policyCount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [notification, setNotification] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.branchId || !form.premium) return;

    addProduction({
      branchId: form.branchId,
      insuranceType: form.insuranceType,
      premium: parseFloat(form.premium) || 0,
      policyCount: parseInt(form.policyCount) || 0,
      date: form.date,
      description: form.description,
    });

    setNotification('Üretim başarıyla kaydedildi!');
    setTimeout(() => setNotification(null), 3000);

    setForm(prev => ({
      ...prev,
      premium: '',
      policyCount: '',
      description: '',
    }));
  }

  const recentProductions = [...productions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 20);

  function getBranchName(id) {
    return branches.find(b => b.id === id)?.name || 'Bilinmeyen';
  }

  function getTypeName(key) {
    return INSURANCE_TYPES.find(t => t.key === key)?.label || key;
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Üretim Ekle</h2>
          <p className="page-subtitle">Yeni poliçe üretimi kaydedin</p>
        </div>
      </div>

      {notification && (
        <div className="notification success">
          <CheckCircle size={18} />
          {notification}
        </div>
      )}

      <div className="form-layout">
        <div className="form-card">
          <h3 className="form-card-title">Yeni Üretim</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Şube</label>
              <select
                className="form-input"
                value={form.branchId}
                onChange={e => setForm(prev => ({ ...prev, branchId: e.target.value }))}
                required
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} {b.isMain ? '(Merkez)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Branş</label>
              <select
                className="form-input"
                value={form.insuranceType}
                onChange={e => setForm(prev => ({ ...prev, insuranceType: e.target.value }))}
                required
              >
                {INSURANCE_TYPES.map(t => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prim Tutarı (₺)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0"
                  value={form.premium}
                  onChange={e => setForm(prev => ({ ...prev, premium: e.target.value }))}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Poliçe Adeti</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0"
                  value={form.policyCount}
                  onChange={e => setForm(prev => ({ ...prev, policyCount: e.target.value }))}
                  min="0"
                  step="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tarih</label>
              <input
                type="date"
                className="form-input"
                value={form.date}
                onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Açıklama (Opsiyonel)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Poliçe notu..."
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              <PlusCircle size={18} />
              Üretim Kaydet
            </button>
          </form>
        </div>

        <div className="recent-productions">
          <h3 className="form-card-title">Son Üretimler</h3>
          {recentProductions.length === 0 ? (
            <p className="empty-state">Henüz üretim kaydı bulunmuyor.</p>
          ) : (
            <div className="production-list">
              {recentProductions.map(prod => (
                <div key={prod.id} className="production-item">
                  <div className="production-item-info">
                    <div className="production-item-top">
                      <span className="production-type-badge" style={{
                        backgroundColor: INSURANCE_TYPES.find(t => t.key === prod.insuranceType)?.color + '22',
                        color: INSURANCE_TYPES.find(t => t.key === prod.insuranceType)?.color,
                      }}>
                        {getTypeName(prod.insuranceType)}
                      </span>
                      <span className="production-branch">{getBranchName(prod.branchId)}</span>
                    </div>
                    <div className="production-item-bottom">
                      <span className="production-premium">{formatCurrency(prod.premium)}</span>
                      <span className="production-count">{formatNumber(prod.policyCount)} adet</span>
                      <span className="production-date">{new Date(prod.date).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                  <button
                    className="btn-icon btn-danger-icon"
                    onClick={() => removeProduction(prod.id)}
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
