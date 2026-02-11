import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INSURANCE_TYPES, STEPS, formatCurrency, formatNumber } from '../utils/constants';
import { Target, Save, CheckCircle } from 'lucide-react';

export default function Targets() {
  const { targets, updateTargets, settings, updateSettings } = useApp();
  const [localTargets, setLocalTargets] = useState({ ...targets });
  const [notification, setNotification] = useState(null);

  function handleChange(typeKey, field, value) {
    setLocalTargets(prev => ({
      ...prev,
      [typeKey]: {
        ...prev[typeKey],
        [field]: parseFloat(value) || 0,
      },
    }));
  }

  function handleSave() {
    updateTargets(localTargets);
    setNotification('Hedefler başarıyla kaydedildi!');
    setTimeout(() => setNotification(null), 3000);
  }

  function handleStepChange(level) {
    updateSettings({ currentStep: level });
  }

  const currentStep = STEPS.find(s => s.level === settings.currentStep) || STEPS[0];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Hedef & Basamak Ayarları</h2>
          <p className="page-subtitle">Şirketin belirlediği basamak ve hedefleri ayarlayın</p>
        </div>
      </div>

      {notification && (
        <div className="notification success">
          <CheckCircle size={18} />
          {notification}
        </div>
      )}

      <div className="form-card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="form-card-title">
          <Target size={20} />
          Basamak Seçimi
        </h3>
        <p className="form-description">
          Şirketin belirlediği basamak seviyesini seçin. Her basamak, hedeflere çarpan uygular.
        </p>
        <div className="step-selector">
          {STEPS.map(step => (
            <button
              key={step.level}
              className={`step-button ${settings.currentStep === step.level ? 'active' : ''}`}
              onClick={() => handleStepChange(step.level)}
            >
              <span className="step-level">{step.label}</span>
              <span className="step-multiplier">x{step.multiplier}</span>
            </button>
          ))}
        </div>
        <p className="form-hint">
          Seçili: <strong>{currentStep.label}</strong> (Çarpan: x{currentStep.multiplier})
        </p>
      </div>

      <div className="form-card">
        <h3 className="form-card-title">Branş Bazlı Temel Hedefler</h3>
        <p className="form-description">
          Temel hedef değerlerini girin. Basamak çarpanı otomatik uygulanacaktır.
        </p>

        <div className="targets-table-wrapper">
          <table className="targets-table">
            <thead>
              <tr>
                <th>Branş</th>
                <th>Temel Hedef Prim (₺)</th>
                <th>Temel Hedef Adet</th>
                <th>Basamaklı Hedef Prim</th>
                <th>Basamaklı Hedef Adet</th>
              </tr>
            </thead>
            <tbody>
              {INSURANCE_TYPES.map(type => {
                const t = localTargets[type.key] || { premium: 0, policyCount: 0 };
                return (
                  <tr key={type.key}>
                    <td>
                      <div className="branch-cell">
                        <span className="branch-dot" style={{ backgroundColor: type.color }} />
                        {type.label}
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input table-input"
                        value={t.premium || ''}
                        onChange={e => handleChange(type.key, 'premium', e.target.value)}
                        min="0"
                        step="1000"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input table-input"
                        value={t.policyCount || ''}
                        onChange={e => handleChange(type.key, 'policyCount', e.target.value)}
                        min="0"
                        step="1"
                      />
                    </td>
                    <td className="text-right text-muted">
                      {formatCurrency(t.premium * currentStep.multiplier)}
                    </td>
                    <td className="text-right text-muted">
                      {formatNumber(Math.round(t.policyCount * currentStep.multiplier))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} />
            Hedefleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
