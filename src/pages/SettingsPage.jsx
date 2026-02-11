import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Save, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, productions } = useApp();
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [notification, setNotification] = useState(null);

  function handleSave() {
    updateSettings(localSettings);
    setNotification('Ayarlar kaydedildi!');
    setTimeout(() => setNotification(null), 3000);
  }

  function handleClearAllData() {
    if (confirm('TÜM VERİLERİ silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
      if (confirm('Bu işlem tüm üretim kayıtlarını, şubeleri ve hedefleri silecek. Devam?')) {
        localStorage.clear();
        window.location.reload();
      }
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Ayarlar</h2>
          <p className="page-subtitle">Sistem ayarlarını düzenleyin</p>
        </div>
      </div>

      {notification && (
        <div className="notification success">
          <CheckCircle size={18} />
          {notification}
        </div>
      )}

      <div className="form-card" style={{ maxWidth: 500, marginBottom: '1.5rem' }}>
        <h3 className="form-card-title">
          <Settings size={20} />
          Genel Ayarlar
        </h3>

        <div className="form-group">
          <label className="form-label">Acente / Şirket Adı</label>
          <input
            type="text"
            className="form-input"
            value={localSettings.companyName}
            onChange={e => setLocalSettings(prev => ({ ...prev, companyName: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Takip Yılı</label>
          <input
            type="number"
            className="form-input"
            value={localSettings.currentYear}
            onChange={e => setLocalSettings(prev => ({ ...prev, currentYear: parseInt(e.target.value) }))}
            min="2020"
            max="2030"
          />
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} />
          Kaydet
        </button>
      </div>

      <div className="form-card" style={{ maxWidth: 500 }}>
        <h3 className="form-card-title text-danger">
          <AlertTriangle size={20} />
          Tehlikeli Bölge
        </h3>
        <p className="form-description">
          Toplam {productions.length} üretim kaydı mevcut. Aşağıdaki işlem tüm verileri siler.
        </p>
        <button className="btn btn-danger" onClick={handleClearAllData}>
          <AlertTriangle size={18} />
          Tüm Verileri Sil
        </button>
      </div>
    </div>
  );
}
