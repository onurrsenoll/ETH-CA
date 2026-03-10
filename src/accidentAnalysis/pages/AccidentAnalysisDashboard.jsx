import { useNavigate } from 'react-router-dom';
import { useAA } from '../AccidentAnalysisContext';
import { Plus, FileText, Trash2, Eye, Car, AlertTriangle, Search } from 'lucide-react';
import { useState } from 'react';

export default function AccidentAnalysisDashboard() {
  const navigate = useNavigate();
  const { analyses, removeAnalysis } = useAA();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = analyses.filter(a => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (a.caseNumber || '').toLowerCase().includes(term) ||
      (a.vehicleA?.driverName || '').toLowerCase().includes(term) ||
      (a.vehicleB?.driverName || '').toLowerCase().includes(term) ||
      (a.vehicleA?.plate || '').toLowerCase().includes(term) ||
      (a.vehicleB?.plate || '').toLowerCase().includes(term) ||
      (a.accidentInfo?.city || '').toLowerCase().includes(term)
    );
  });

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Bu analizi silmek istediğinize emin misiniz?')) {
      removeAnalysis(id);
    }
  };

  const totalAnalyses = analyses.length;
  const faultAMajority = analyses.filter(a => a.result?.finalFault?.faultA > 50).length;
  const faultBMajority = analyses.filter(a => a.result?.finalFault?.faultB > 50).length;
  const equalFault = analyses.filter(a => a.result?.finalFault?.faultA === 50).length;

  return (
    <div className="aa-page">
      <div className="aa-page-header">
        <div className="aa-page-header-top">
          <div>
            <h1>Kaza Analiz Paneli</h1>
            <p>Trafik Kaza Tespit Tutanağı Analiz Sistemi</p>
          </div>
          <button className="aa-btn aa-btn-primary" onClick={() => navigate('/kaza-analiz/yeni')}>
            <Plus size={18} /> Yeni Analiz
          </button>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="aa-stats-grid">
        <div className="aa-stat-card">
          <div className="aa-stat-icon" style={{ backgroundColor: '#eff6ff' }}>
            <FileText size={24} style={{ color: '#3b82f6' }} />
          </div>
          <div className="aa-stat-info">
            <span className="aa-stat-value">{totalAnalyses}</span>
            <span className="aa-stat-label">Toplam Analiz</span>
          </div>
        </div>
        <div className="aa-stat-card">
          <div className="aa-stat-icon" style={{ backgroundColor: '#fef2f2' }}>
            <Car size={24} style={{ color: '#ef4444' }} />
          </div>
          <div className="aa-stat-info">
            <span className="aa-stat-value">{faultAMajority}</span>
            <span className="aa-stat-label">Araç A Asli Kusurlu</span>
          </div>
        </div>
        <div className="aa-stat-card">
          <div className="aa-stat-icon" style={{ backgroundColor: '#f5f3ff' }}>
            <Car size={24} style={{ color: '#8b5cf6' }} />
          </div>
          <div className="aa-stat-info">
            <span className="aa-stat-value">{faultBMajority}</span>
            <span className="aa-stat-label">Araç B Asli Kusurlu</span>
          </div>
        </div>
        <div className="aa-stat-card">
          <div className="aa-stat-icon" style={{ backgroundColor: '#f0fdf4' }}>
            <AlertTriangle size={24} style={{ color: '#f59e0b' }} />
          </div>
          <div className="aa-stat-info">
            <span className="aa-stat-value">{equalFault}</span>
            <span className="aa-stat-label">Eşit Kusur</span>
          </div>
        </div>
      </div>

      {/* Arama */}
      <div className="aa-search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Dosya no, sürücü adı, plaka veya il ile ara..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Analiz Listesi */}
      {filtered.length === 0 ? (
        <div className="aa-empty-state">
          <FileText size={48} />
          <h3>{searchTerm ? 'Sonuç bulunamadı' : 'Henüz analiz yapılmamış'}</h3>
          <p>{searchTerm ? 'Arama kriterlerinize uygun analiz bulunamadı.' : 'İlk kaza analizinizi yapmak için "Yeni Analiz" butonuna tıklayın.'}</p>
          {!searchTerm && (
            <button className="aa-btn aa-btn-primary" onClick={() => navigate('/kaza-analiz/yeni')}>
              <Plus size={18} /> Yeni Analiz Oluştur
            </button>
          )}
        </div>
      ) : (
        <div className="aa-analysis-list">
          {filtered.map(a => (
            <div
              key={a.id}
              className="aa-analysis-row"
              onClick={() => navigate(`/kaza-analiz/detay/${a.id}`)}
            >
              <div className="aa-analysis-row-main">
                <div className="aa-analysis-case-number">{a.caseNumber}</div>
                <div className="aa-analysis-date">
                  {new Date(a.createdAt).toLocaleDateString('tr-TR')}
                </div>
                <div className="aa-analysis-location">
                  {[a.accidentInfo?.city, a.accidentInfo?.district].filter(Boolean).join(' / ') || '-'}
                </div>
              </div>

              <div className="aa-analysis-row-vehicles">
                <div className="aa-analysis-vehicle">
                  <span className="aa-vehicle-label" style={{ color: '#3b82f6' }}>A:</span>
                  <span>{a.vehicleA?.driverName || '-'}</span>
                  <span className="aa-vehicle-plate">{a.vehicleA?.plate || ''}</span>
                </div>
                <span className="aa-vs-small">vs</span>
                <div className="aa-analysis-vehicle">
                  <span className="aa-vehicle-label" style={{ color: '#8b5cf6' }}>B:</span>
                  <span>{a.vehicleB?.driverName || '-'}</span>
                  <span className="aa-vehicle-plate">{a.vehicleB?.plate || ''}</span>
                </div>
              </div>

              <div className="aa-analysis-row-fault">
                <div className="aa-fault-mini">
                  <span style={{ color: a.result?.finalFault?.faultA >= 50 ? '#ef4444' : '#10b981' }}>
                    %{a.result?.finalFault?.faultA ?? '-'}
                  </span>
                  <span className="aa-fault-mini-sep">-</span>
                  <span style={{ color: a.result?.finalFault?.faultB >= 50 ? '#ef4444' : '#10b981' }}>
                    %{a.result?.finalFault?.faultB ?? '-'}
                  </span>
                </div>
              </div>

              <div className="aa-analysis-row-actions">
                <button className="aa-btn aa-btn-icon" onClick={(e) => { e.stopPropagation(); navigate(`/kaza-analiz/detay/${a.id}`); }}>
                  <Eye size={16} />
                </button>
                <button className="aa-btn aa-btn-icon aa-btn-icon-danger" onClick={(e) => handleDelete(e, a.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
