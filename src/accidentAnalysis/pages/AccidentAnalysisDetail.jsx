import { useParams, useNavigate } from 'react-router-dom';
import { useAA } from '../AccidentAnalysisContext';
import { VIOLATION_ITEMS } from '../utils/faultCalculation';
import { generateAccidentPDF } from '../utils/accidentPdfExport';
import {
  ArrowLeft, Download, Trash2, Car, AlertTriangle,
  FileText, MapPin, User, Shield, Image, MessageSquare
} from 'lucide-react';
import { useState } from 'react';

export default function AccidentAnalysisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { analyses, removeAnalysis } = useAA();
  const [activeTab, setActiveTab] = useState('summary');

  const analysis = analyses.find(a => a.id === id);

  if (!analysis) {
    return (
      <div className="aa-page">
        <div className="aa-empty-state">
          <AlertTriangle size={48} />
          <h2>Analiz bulunamadı</h2>
          <button className="aa-btn aa-btn-primary" onClick={() => navigate('/kaza-analiz')}>
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const { result, accidentInfo, vehicleA, vehicleB, uploadedImages, witness, impactAnalysis } = analysis;

  const handleDelete = () => {
    if (window.confirm('Bu analizi silmek istediğinize emin misiniz?')) {
      removeAnalysis(id);
      navigate('/kaza-analiz');
    }
  };

  const handlePDF = () => {
    generateAccidentPDF(analysis);
  };

  const faultAColor = result.finalFault.faultA >= 50 ? '#ef4444' : '#10b981';
  const faultBColor = result.finalFault.faultB >= 50 ? '#ef4444' : '#10b981';

  return (
    <div className="aa-page">
      <div className="aa-page-header">
        <div className="aa-page-header-top">
          <button className="aa-btn aa-btn-ghost" onClick={() => navigate('/kaza-analiz')}>
            <ArrowLeft size={18} /> Geri
          </button>
          <div className="aa-page-header-actions">
            <button className="aa-btn aa-btn-primary" onClick={handlePDF}>
              <Download size={18} /> PDF İndir
            </button>
            <button className="aa-btn aa-btn-danger" onClick={handleDelete}>
              <Trash2 size={18} /> Sil
            </button>
          </div>
        </div>
        <h1>Kaza Analiz Raporu - {analysis.caseNumber}</h1>
        <p>Oluşturulma: {new Date(analysis.createdAt).toLocaleDateString('tr-TR')} {new Date(analysis.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      {/* Kusur Özet Kartları */}
      <div className="aa-fault-summary">
        <div className="aa-fault-card" style={{ borderColor: faultAColor }}>
          <div className="aa-fault-card-header">
            <Car size={24} style={{ color: '#3b82f6' }} />
            <span>Araç A</span>
          </div>
          <div className="aa-fault-driver">{vehicleA.driverName || 'Belirtilmemiş'}</div>
          <div className="aa-fault-plate">{vehicleA.plate || '-'}</div>
          <div className="aa-fault-vehicle">{vehicleA.brand || '-'}</div>
          <div className="aa-fault-percentage" style={{ color: faultAColor }}>
            %{result.finalFault.faultA}
          </div>
          <div className="aa-fault-label">Kusur Oranı</div>
          <div className="aa-fault-bar">
            <div className="aa-fault-bar-fill" style={{ width: `${result.finalFault.faultA}%`, backgroundColor: faultAColor }} />
          </div>
        </div>

        <div className="aa-fault-vs">VS</div>

        <div className="aa-fault-card" style={{ borderColor: faultBColor }}>
          <div className="aa-fault-card-header">
            <Car size={24} style={{ color: '#8b5cf6' }} />
            <span>Araç B</span>
          </div>
          <div className="aa-fault-driver">{vehicleB.driverName || 'Belirtilmemiş'}</div>
          <div className="aa-fault-plate">{vehicleB.plate || '-'}</div>
          <div className="aa-fault-vehicle">{vehicleB.brand || '-'}</div>
          <div className="aa-fault-percentage" style={{ color: faultBColor }}>
            %{result.finalFault.faultB}
          </div>
          <div className="aa-fault-label">Kusur Oranı</div>
          <div className="aa-fault-bar">
            <div className="aa-fault-bar-fill" style={{ width: `${result.finalFault.faultB}%`, backgroundColor: faultBColor }} />
          </div>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="aa-tabs">
        {[
          { id: 'summary', label: 'Rapor Özeti', icon: FileText },
          { id: 'details', label: 'Detaylar', icon: Car },
          { id: 'statements', label: 'Beyanlar', icon: MessageSquare },
          { id: 'images', label: 'Görseller', icon: Image },
        ].map(tab => (
          <button
            key={tab.id}
            className={`aa-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rapor Özeti */}
      {activeTab === 'summary' && (
        <div className="aa-tab-content">
          {/* Kaza Bilgileri */}
          <div className="aa-card">
            <div className="aa-card-header">
              <MapPin size={20} />
              <h3>Kaza Bilgileri</h3>
            </div>
            <div className="aa-card-body">
              <div className="aa-info-grid">
                <div className="aa-info-item">
                  <span className="aa-info-label">Tarih</span>
                  <span className="aa-info-value">{accidentInfo.date ? new Date(accidentInfo.date).toLocaleDateString('tr-TR') : '-'}</span>
                </div>
                <div className="aa-info-item">
                  <span className="aa-info-label">Saat</span>
                  <span className="aa-info-value">{accidentInfo.time || '-'}</span>
                </div>
                <div className="aa-info-item">
                  <span className="aa-info-label">İl / İlçe</span>
                  <span className="aa-info-value">{[accidentInfo.city, accidentInfo.district].filter(Boolean).join(' / ') || '-'}</span>
                </div>
                <div className="aa-info-item">
                  <span className="aa-info-label">Mahalle</span>
                  <span className="aa-info-value">{accidentInfo.neighborhood || '-'}</span>
                </div>
                <div className="aa-info-item">
                  <span className="aa-info-label">Cadde / Sokak</span>
                  <span className="aa-info-value">{accidentInfo.street || '-'}</span>
                </div>
                {accidentInfo.description && (
                  <div className="aa-info-item aa-info-full">
                    <span className="aa-info-label">Kaza Yeri Tarifi</span>
                    <span className="aa-info-value">{accidentInfo.description}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gerekçeli Değerlendirme */}
          <div className="aa-card aa-card-highlight">
            <div className="aa-card-header">
              <Shield size={20} />
              <h3>Gerekçeli Kusur Değerlendirmesi</h3>
            </div>
            <div className="aa-card-body">
              <div className="aa-reasoning">
                {result.reasoning.map((line, i) => (
                  <p key={i} className={line === '' ? 'aa-reasoning-spacer' : line.startsWith('  -') ? 'aa-reasoning-bullet' : line.startsWith('Sonuç:') || line.startsWith('Özel Durum') ? 'aa-reasoning-highlight' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* SBM Senaryo */}
          {result.selectedScenario && (
            <div className="aa-card" style={{ borderLeftColor: '#8b5cf6' }}>
              <div className="aa-card-header">
                <FileText size={20} style={{ color: '#8b5cf6' }} />
                <h3>SBM Kaza Durum Senaryosu</h3>
              </div>
              <div className="aa-card-body">
                <div className="aa-info-grid">
                  <div className="aa-info-item">
                    <span className="aa-info-label">Senaryo No</span>
                    <span className="aa-info-value">{result.selectedScenario.id}</span>
                  </div>
                  <div className="aa-info-item">
                    <span className="aa-info-label">Başlık</span>
                    <span className="aa-info-value">{result.selectedScenario.title}</span>
                  </div>
                  <div className="aa-info-item aa-info-full">
                    <span className="aa-info-label">Açıklama</span>
                    <span className="aa-info-value">{result.selectedScenario.description}</span>
                  </div>
                  <div className="aa-info-item">
                    <span className="aa-info-label">Yasal Dayanak</span>
                    <span className="aa-info-value">{result.selectedScenario.legalBasis}</span>
                  </div>
                  <div className="aa-info-item">
                    <span className="aa-info-label">Değerlendirme Yöntemi</span>
                    <span className="aa-info-value">
                      {result.faultBasis === 'sbm_manual' ? 'Manuel Senaryo Seçimi' :
                       result.faultBasis === 'sbm_auto' ? 'Otomatik Senaryo Eşleşmesi' : 'İhlal Ağırlıklı Hesaplama'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Özel Durumlar */}
          {result.specialCases.length > 0 && (
            <div className="aa-card aa-card-warning">
              <div className="aa-card-header">
                <AlertTriangle size={20} />
                <h3>Özel Durum Tespitleri</h3>
              </div>
              <div className="aa-card-body">
                {result.specialCases.map((sc, i) => (
                  <div key={i} className="aa-special-case">
                    <div className="aa-special-case-badge">
                      Araç {sc.vehicle} - {sc.type === 'rear_end_collision' ? 'Arkadan Çarpma' :
                        sc.type === 'red_light' ? 'Kırmızı Işık İhlali' :
                        sc.type === 'parked_vehicle_hit' ? 'Park Halindeki Araca Çarpma' :
                        sc.type === 'wrong_way' ? 'Karşı Yönden Gelme' : sc.type}
                    </div>
                    <p>{sc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Darbe Noktası Analizi */}
          {impactAnalysis && impactAnalysis.length > 0 && (
            <div className="aa-card">
              <div className="aa-card-header">
                <Car size={20} />
                <h3>Darbe Noktası Analizi</h3>
              </div>
              <div className="aa-card-body">
                {impactAnalysis.map((line, i) => (
                  <p key={i} className="aa-impact-line">{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* Görgü Tanığı */}
          {witness && witness.name && (
            <div className="aa-card">
              <div className="aa-card-header">
                <User size={20} />
                <h3>Görgü Tanığı</h3>
              </div>
              <div className="aa-card-body">
                <div className="aa-info-grid">
                  <div className="aa-info-item">
                    <span className="aa-info-label">Adı Soyadı</span>
                    <span className="aa-info-value">{witness.name}</span>
                  </div>
                  {witness.phone && (
                    <div className="aa-info-item">
                      <span className="aa-info-label">Telefon</span>
                      <span className="aa-info-value">{witness.phone}</span>
                    </div>
                  )}
                  {witness.address && (
                    <div className="aa-info-item aa-info-full">
                      <span className="aa-info-label">Adres</span>
                      <span className="aa-info-value">{witness.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detaylar */}
      {activeTab === 'details' && (
        <div className="aa-tab-content">
          <div className="aa-detail-columns">
            <VehicleDetailCard vehicle={vehicleA} label="A" color="#3b82f6" />
            <VehicleDetailCard vehicle={vehicleB} label="B" color="#8b5cf6" />
          </div>
        </div>
      )}

      {/* Beyanlar */}
      {activeTab === 'statements' && (
        <div className="aa-tab-content">
          <div className="aa-detail-columns">
            <div className="aa-card" style={{ borderLeftColor: '#3b82f6' }}>
              <div className="aa-card-header">
                <MessageSquare size={20} style={{ color: '#3b82f6' }} />
                <h3>Araç A Sürücüsü Beyanı</h3>
              </div>
              <div className="aa-card-body">
                <p className="aa-statement-text">{vehicleA.statement || 'Beyan girilmemiştir.'}</p>
              </div>
            </div>
            <div className="aa-card" style={{ borderLeftColor: '#8b5cf6' }}>
              <div className="aa-card-header">
                <MessageSquare size={20} style={{ color: '#8b5cf6' }} />
                <h3>Araç B Sürücüsü Beyanı</h3>
              </div>
              <div className="aa-card-body">
                <p className="aa-statement-text">{vehicleB.statement || 'Beyan girilmemiştir.'}</p>
              </div>
            </div>
          </div>

          {result.statementAnalysis && result.statementAnalysis.length > 0 && (
            <div className="aa-card aa-card-highlight" style={{ marginTop: '1rem' }}>
              <div className="aa-card-header">
                <Shield size={20} />
                <h3>Beyan Değerlendirmesi</h3>
              </div>
              <div className="aa-card-body">
                {result.statementAnalysis.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Görseller */}
      {activeTab === 'images' && (
        <div className="aa-tab-content">
          {uploadedImages && uploadedImages.length > 0 ? (
            <div className="aa-image-gallery">
              {uploadedImages.map(img => (
                <div key={img.id} className="aa-gallery-item">
                  {img.type.startsWith('image/') ? (
                    <img src={img.data} alt={img.name} />
                  ) : (
                    <div className="aa-pdf-preview">
                      <FileText size={48} />
                      <span>{img.name}</span>
                    </div>
                  )}
                  <div className="aa-gallery-name">{img.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="aa-empty-state">
              <Image size={48} />
              <h3>Görsel yüklenmemiş</h3>
              <p>Bu analiz için tutanak görseli yüklenmemiştir.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VehicleDetailCard({ vehicle, label, color }) {
  const violations = (vehicle.violations || [])
    .map(vid => VIOLATION_ITEMS.find(v => v.id === vid))
    .filter(Boolean);

  return (
    <div className="aa-card" style={{ borderLeftColor: color }}>
      <div className="aa-card-header">
        <Car size={20} style={{ color }} />
        <h3>Araç {label}</h3>
      </div>
      <div className="aa-card-body">
        <h4 className="aa-subsection-title">Sürücü Bilgileri</h4>
        <div className="aa-info-grid">
          <InfoItem label="Adı Soyadı" value={vehicle.driverName} />
          <InfoItem label="T.C. Kimlik No" value={vehicle.tcNo} />
          <InfoItem label="Sürücü Belge No" value={vehicle.licenseNo} />
          <InfoItem label="Alındığı Yer" value={vehicle.issuedCity} />
          <InfoItem label="Telefon" value={vehicle.phone} />
          <InfoItem label="E-posta" value={vehicle.email} />
        </div>

        <h4 className="aa-subsection-title">Araç Bilgileri</h4>
        <div className="aa-info-grid">
          <InfoItem label="Marka/Model" value={vehicle.brand} />
          <InfoItem label="Plaka" value={vehicle.plate} />
          <InfoItem label="Şasi No" value={vehicle.chassisNo} />
          <InfoItem label="Kullanım Şekli" value={vehicle.usage} />
        </div>

        <h4 className="aa-subsection-title">Sigorta Bilgileri</h4>
        <div className="aa-info-grid">
          <InfoItem label="Sigorta Şirketi" value={vehicle.insuranceCompany} />
          <InfoItem label="Sigortalı" value={vehicle.insuranceHolder} />
          <InfoItem label="Poliçe No" value={vehicle.policyNo} />
          <InfoItem label="Poliçe Dönemi" value={
            vehicle.policyStart && vehicle.policyEnd
              ? `${new Date(vehicle.policyStart).toLocaleDateString('tr-TR')} - ${new Date(vehicle.policyEnd).toLocaleDateString('tr-TR')}`
              : '-'
          } />
        </div>

        {violations.length > 0 && (
          <>
            <h4 className="aa-subsection-title">Tespit Edilen İhlaller</h4>
            <div className="aa-violation-list">
              {violations.map(v => (
                <div key={v.id} className="aa-violation-list-item">
                  <AlertTriangle size={14} style={{ color: '#ef4444' }} />
                  <span>{v.text}</span>
                  <span className="aa-violation-article">{v.article}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="aa-info-item">
      <span className="aa-info-label">{label}</span>
      <span className="aa-info-value">{value || '-'}</span>
    </div>
  );
}
