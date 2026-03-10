import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAA } from '../AccidentAnalysisContext';
import { VIOLATION_ITEMS, generateAnalysis, analyzeImpactPoints } from '../utils/faultCalculation';
import { SBM_SCENARIOS, SBM_CATEGORIES } from '../utils/sbmScenarios';
import { Upload, FileText, Car, User, MapPin, AlertTriangle, ChevronDown, ChevronUp, X, Image, BookOpen, Search } from 'lucide-react';

const IMPACT_POINTS = [
  { id: 'front', label: 'Ön' },
  { id: 'front-left', label: 'Sol Ön' },
  { id: 'front-right', label: 'Sağ Ön' },
  { id: 'left', label: 'Sol' },
  { id: 'right', label: 'Sağ' },
  { id: 'rear', label: 'Arka' },
  { id: 'rear-left', label: 'Sol Arka' },
  { id: 'rear-right', label: 'Sağ Arka' },
];

const emptyVehicle = () => ({
  driverName: '',
  tcNo: '',
  licenseNo: '',
  licenseClass: '',
  issuedCity: '',
  phone: '',
  email: '',
  brand: '',
  model: '',
  plate: '',
  chassisNo: '',
  usage: '',
  insuranceCompany: '',
  insuranceHolder: '',
  insurancePhone: '',
  insuranceTcVkn: '',
  policyNo: '',
  policyStart: '',
  policyEnd: '',
  violations: [],
  impactPoint: '',
  statement: '',
});

export default function NewAccidentAnalysis() {
  const navigate = useNavigate();
  const { addAnalysis } = useAA();
  const fileInputRef = useRef(null);

  const [accidentInfo, setAccidentInfo] = useState({
    date: '',
    time: '',
    city: '',
    district: '',
    neighborhood: '',
    street: '',
    road: '',
    description: '',
  });

  const [witness, setWitness] = useState({
    name: '',
    address: '',
    phone: '',
  });

  const [vehicleA, setVehicleA] = useState(emptyVehicle());
  const [vehicleB, setVehicleB] = useState(emptyVehicle());
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState('');
  const [scenarioFilter, setScenarioFilter] = useState('');
  const [scenarioCategoryFilter, setScenarioCategoryFilter] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    images: true,
    accident: true,
    witness: false,
    vehicleA: true,
    vehicleB: true,
    violationsA: true,
    violationsB: true,
    scenario: true,
  });
  const [notification, setNotification] = useState(null);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setUploadedImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type,
            data: ev.target.result,
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
    e.target.value = '';
  };

  const removeImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const toggleViolation = (vehicle, violationId) => {
    const setter = vehicle === 'A' ? setVehicleA : setVehicleB;
    setter(prev => {
      const violations = prev.violations.includes(violationId)
        ? prev.violations.filter(v => v !== violationId)
        : [...prev.violations, violationId];
      return { ...prev, violations };
    });
  };

  const filteredScenarios = useMemo(() => {
    return SBM_SCENARIOS.filter(s => {
      if (scenarioCategoryFilter && s.category !== scenarioCategoryFilter) return false;
      if (scenarioFilter) {
        const term = scenarioFilter.toLowerCase();
        return s.title.toLowerCase().includes(term) ||
          s.description.toLowerCase().includes(term) ||
          s.keywords.some(k => k.includes(term));
      }
      return true;
    });
  }, [scenarioFilter, scenarioCategoryFilter]);

  const handleSubmit = () => {
    if (!accidentInfo.date) {
      setNotification({ type: 'error', message: 'Kaza tarihi zorunludur.' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (!vehicleA.driverName && !vehicleB.driverName) {
      setNotification({ type: 'error', message: 'En az bir araç sürücü bilgisi girilmelidir.' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const impactAnalysis = analyzeImpactPoints(vehicleA.impactPoint, vehicleB.impactPoint);

    const analysisResult = generateAnalysis({
      vehicleA,
      vehicleB,
      accidentInfo,
      selectedScenarioId: selectedScenarioId || null,
    });

    const saved = addAnalysis({
      accidentInfo,
      witness,
      vehicleA,
      vehicleB,
      uploadedImages,
      impactAnalysis,
      result: analysisResult,
    });

    setNotification({ type: 'success', message: 'Analiz başarıyla oluşturuldu!' });
    setTimeout(() => {
      navigate(`/kaza-analiz/detay/${saved.id}`);
    }, 1000);
  };

  const SectionHeader = ({ title, icon: Icon, section, badge }) => (
    <div className="aa-section-header" onClick={() => toggleSection(section)}>
      <div className="aa-section-header-left">
        <Icon size={20} />
        <h3>{title}</h3>
        {badge && <span className="aa-badge">{badge}</span>}
      </div>
      {expandedSections[section] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </div>
  );

  return (
    <div className="aa-page">
      <div className="aa-page-header">
        <h1>Yeni Kaza Analizi</h1>
        <p>Trafik Kaza Tespit Tutanağı verilerini girerek kusur analizi yapın</p>
      </div>

      {notification && (
        <div className={`aa-notification aa-notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Görsel Yükleme */}
      <div className="aa-card">
        <SectionHeader title="Tutanak Görselleri / PDF" icon={Image} section="images" />
        {expandedSections.images && (
          <div className="aa-card-body">
            <p className="aa-help-text">
              Kaza tespit tutanağı ve olay yeri görsellerini yükleyin. Bu görseller raporda referans olarak kullanılacaktır.
            </p>
            <div className="aa-upload-area" onClick={() => fileInputRef.current?.click()}>
              <Upload size={40} />
              <span>Görsel veya PDF yüklemek için tıklayın</span>
              <small>JPG, PNG, PDF formatları desteklenir</small>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
            {uploadedImages.length > 0 && (
              <div className="aa-uploaded-images">
                {uploadedImages.map(img => (
                  <div key={img.id} className="aa-image-thumb">
                    {img.type.startsWith('image/') ? (
                      <img src={img.data} alt={img.name} />
                    ) : (
                      <div className="aa-pdf-thumb">
                        <FileText size={32} />
                        <span>PDF</span>
                      </div>
                    )}
                    <span className="aa-image-name">{img.name}</span>
                    <button className="aa-image-remove" onClick={() => removeImage(img.id)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Kaza Bilgileri */}
      <div className="aa-card">
        <SectionHeader title="Kaza Bilgileri" icon={MapPin} section="accident" />
        {expandedSections.accident && (
          <div className="aa-card-body">
            <div className="aa-form-row">
              <div className="aa-form-group">
                <label>Kaza Tarihi *</label>
                <input type="date" value={accidentInfo.date}
                  onChange={e => setAccidentInfo(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="aa-form-group">
                <label>Saat</label>
                <input type="time" value={accidentInfo.time}
                  onChange={e => setAccidentInfo(p => ({ ...p, time: e.target.value }))} />
              </div>
              <div className="aa-form-group">
                <label>İl</label>
                <input type="text" value={accidentInfo.city}
                  onChange={e => setAccidentInfo(p => ({ ...p, city: e.target.value }))} />
              </div>
              <div className="aa-form-group">
                <label>İlçe</label>
                <input type="text" value={accidentInfo.district}
                  onChange={e => setAccidentInfo(p => ({ ...p, district: e.target.value }))} />
              </div>
            </div>
            <div className="aa-form-row">
              <div className="aa-form-group">
                <label>Mahalle</label>
                <input type="text" value={accidentInfo.neighborhood}
                  onChange={e => setAccidentInfo(p => ({ ...p, neighborhood: e.target.value }))} />
              </div>
              <div className="aa-form-group">
                <label>Cadde / Sokak</label>
                <input type="text" value={accidentInfo.street}
                  onChange={e => setAccidentInfo(p => ({ ...p, street: e.target.value }))} />
              </div>
              <div className="aa-form-group aa-form-group-full">
                <label>Kaza Yeri Tarifi</label>
                <textarea rows={2} value={accidentInfo.description}
                  onChange={e => setAccidentInfo(p => ({ ...p, description: e.target.value }))} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Görgü Tanıkları */}
      <div className="aa-card">
        <SectionHeader title="Görgü Tanıkları" icon={User} section="witness" />
        {expandedSections.witness && (
          <div className="aa-card-body">
            <div className="aa-form-row">
              <div className="aa-form-group">
                <label>Adı Soyadı</label>
                <input type="text" value={witness.name}
                  onChange={e => setWitness(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="aa-form-group">
                <label>Telefon</label>
                <input type="text" value={witness.phone}
                  onChange={e => setWitness(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="aa-form-group aa-form-group-full">
                <label>Adres</label>
                <input type="text" value={witness.address}
                  onChange={e => setWitness(p => ({ ...p, address: e.target.value }))} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Araç A */}
      <VehicleForm
        title="Araç A - Sürücü ve Araç Bilgileri"
        vehicle={vehicleA}
        setVehicle={setVehicleA}
        expanded={expandedSections.vehicleA}
        toggle={() => toggleSection('vehicleA')}
        color="#3b82f6"
      />

      {/* Araç A İhlaller */}
      <div className="aa-card">
        <SectionHeader
          title="Araç A - Uygun Kutulara (x) İşareti"
          icon={AlertTriangle}
          section="violationsA"
          badge={vehicleA.violations.length > 0 ? `${vehicleA.violations.length} ihlal` : null}
        />
        {expandedSections.violationsA && (
          <div className="aa-card-body">
            <div className="aa-violations-grid">
              {VIOLATION_ITEMS.map(v => (
                <label key={v.id} className={`aa-violation-item ${vehicleA.violations.includes(v.id) ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={vehicleA.violations.includes(v.id)}
                    onChange={() => toggleViolation('A', v.id)}
                  />
                  <span className="aa-violation-text">{v.text}</span>
                  <span className="aa-violation-article">{v.article}</span>
                </label>
              ))}
            </div>
            <div className="aa-form-row" style={{ marginTop: '1rem' }}>
              <div className="aa-form-group">
                <label>Darbe Noktası</label>
                <select value={vehicleA.impactPoint}
                  onChange={e => setVehicleA(p => ({ ...p, impactPoint: e.target.value }))}>
                  <option value="">Seçiniz</option>
                  {IMPACT_POINTS.map(ip => (
                    <option key={ip.id} value={ip.id}>{ip.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="aa-form-group aa-form-group-full" style={{ marginTop: '0.5rem' }}>
              <label>Araç A Sürücüsünün Beyanı (11. Bölüm)</label>
              <textarea rows={3} value={vehicleA.statement}
                onChange={e => setVehicleA(p => ({ ...p, statement: e.target.value }))}
                placeholder="Sürücünün tutanağa yazdığı beyanı buraya girin..." />
            </div>
          </div>
        )}
      </div>

      {/* Araç B */}
      <VehicleForm
        title="Araç B - Sürücü ve Araç Bilgileri"
        vehicle={vehicleB}
        setVehicle={setVehicleB}
        expanded={expandedSections.vehicleB}
        toggle={() => toggleSection('vehicleB')}
        color="#8b5cf6"
      />

      {/* Araç B İhlaller */}
      <div className="aa-card">
        <SectionHeader
          title="Araç B - Uygun Kutulara (x) İşareti"
          icon={AlertTriangle}
          section="violationsB"
          badge={vehicleB.violations.length > 0 ? `${vehicleB.violations.length} ihlal` : null}
        />
        {expandedSections.violationsB && (
          <div className="aa-card-body">
            <div className="aa-violations-grid">
              {VIOLATION_ITEMS.map(v => (
                <label key={v.id} className={`aa-violation-item ${vehicleB.violations.includes(v.id) ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={vehicleB.violations.includes(v.id)}
                    onChange={() => toggleViolation('B', v.id)}
                  />
                  <span className="aa-violation-text">{v.text}</span>
                  <span className="aa-violation-article">{v.article}</span>
                </label>
              ))}
            </div>
            <div className="aa-form-row" style={{ marginTop: '1rem' }}>
              <div className="aa-form-group">
                <label>Darbe Noktası</label>
                <select value={vehicleB.impactPoint}
                  onChange={e => setVehicleB(p => ({ ...p, impactPoint: e.target.value }))}>
                  <option value="">Seçiniz</option>
                  {IMPACT_POINTS.map(ip => (
                    <option key={ip.id} value={ip.id}>{ip.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="aa-form-group aa-form-group-full" style={{ marginTop: '0.5rem' }}>
              <label>Araç B Sürücüsünün Beyanı (11. Bölüm)</label>
              <textarea rows={3} value={vehicleB.statement}
                onChange={e => setVehicleB(p => ({ ...p, statement: e.target.value }))}
                placeholder="Sürücünün tutanağa yazdığı beyanı buraya girin..." />
            </div>
          </div>
        )}
      </div>

      {/* SBM Senaryo Seçimi */}
      <div className="aa-card aa-card-highlight">
        <SectionHeader
          title="SBM Kaza Durum Senaryosu (Opsiyonel)"
          icon={BookOpen}
          section="scenario"
          badge={selectedScenarioId ? 'Seçildi' : null}
        />
        {expandedSections.scenario && (
          <div className="aa-card-body">
            <p className="aa-help-text">
              SBM (Sigortacılık Bilgi Merkezi) tarafından belirlenen kaza durum senaryolarından birini seçebilirsiniz.
              Senaryo seçilmezse, sistem işaretlenen ihlallere göre otomatik eşleşme yapacaktır.
            </p>

            <div className="aa-form-row">
              <div className="aa-form-group">
                <label>Kategori Filtresi</label>
                <select value={scenarioCategoryFilter} onChange={e => setScenarioCategoryFilter(e.target.value)}>
                  <option value="">Tüm Kategoriler</option>
                  {SBM_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="aa-form-group">
                <label>Arama</label>
                <div className="aa-search-bar" style={{ marginBottom: 0 }}>
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Senaryo ara..."
                    value={scenarioFilter}
                    onChange={e => setScenarioFilter(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {selectedScenarioId && (
              <div className="aa-scenario-selected">
                <span>Seçili: <strong>{SBM_SCENARIOS.find(s => s.id === selectedScenarioId)?.title}</strong></span>
                <button className="aa-btn aa-btn-ghost" onClick={() => setSelectedScenarioId('')}>
                  <X size={14} /> Kaldır
                </button>
              </div>
            )}

            <div className="aa-scenario-grid">
              {filteredScenarios.map(s => (
                <div
                  key={s.id}
                  className={`aa-scenario-card ${selectedScenarioId === s.id ? 'selected' : ''}`}
                  onClick={() => setSelectedScenarioId(selectedScenarioId === s.id ? '' : s.id)}
                >
                  <div className="aa-scenario-card-header">
                    <span className="aa-scenario-id">{s.id}</span>
                    <span className="aa-scenario-fault">A:%{s.faultA} / B:%{s.faultB}</span>
                  </div>
                  <div className="aa-scenario-desc">{s.description}</div>
                  <div className="aa-scenario-category">{s.legalBasis}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Analiz Butonu */}
      <div className="aa-submit-section">
        <button className="aa-btn aa-btn-primary aa-btn-lg" onClick={handleSubmit}>
          <FileText size={20} />
          Analiz Yap ve Rapor Oluştur
        </button>
      </div>
    </div>
  );
}

function VehicleForm({ title, vehicle, setVehicle, expanded, toggle, color }) {
  const update = (field, value) => setVehicle(prev => ({ ...prev, [field]: value }));

  return (
    <div className="aa-card" style={{ borderLeftColor: color }}>
      <div className="aa-section-header" onClick={toggle}>
        <div className="aa-section-header-left">
          <Car size={20} style={{ color }} />
          <h3>{title}</h3>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {expanded && (
        <div className="aa-card-body">
          <h4 className="aa-subsection-title">Sürücü Bilgileri</h4>
          <div className="aa-form-row">
            <div className="aa-form-group">
              <label>Adı Soyadı</label>
              <input type="text" value={vehicle.driverName} onChange={e => update('driverName', e.target.value)} />
            </div>
            <div className="aa-form-group">
              <label>T.C. Kimlik No</label>
              <input type="text" value={vehicle.tcNo} onChange={e => update('tcNo', e.target.value)} />
            </div>
            <div className="aa-form-group">
              <label>Sürücü Belge No ve Sınıfı</label>
              <input type="text" value={vehicle.licenseNo} onChange={e => update('licenseNo', e.target.value)} />
            </div>
            <div className="aa-form-group">
              <label>Alındığı Yer (İl/İlçe)</label>
              <input type="text" value={vehicle.issuedCity} onChange={e => update('issuedCity', e.target.value)} />
            </div>
          </div>
          <div className="aa-form-row">
            <div className="aa-form-group">
              <label>Cep Telefonu</label>
              <input type="text" value={vehicle.phone} onChange={e => update('phone', e.target.value)} />
            </div>
            <div className="aa-form-group">
              <label>E-posta</label>
              <input type="text" value={vehicle.email} onChange={e => update('email', e.target.value)} />
            </div>
          </div>

          <h4 className="aa-subsection-title">Araç Bilgileri</h4>
          <div className="aa-form-row">
            <div className="aa-form-group">
              <label>Marka ve Modeli</label>
              <input type="text" value={vehicle.brand} onChange={e => update('brand', e.target.value)} />
            </div>
            <div className="aa-form-group">
              <label>Plaka</label>
              <input type="text" value={vehicle.plate} onChange={e => update('plate', e.target.value)} />
            </div>
            <div className="aa-form-group">
              <label>Şasi No</label>
              <input type="text" value={vehicle.chassisNo} onChange={e => update('chassisNo', e.target.value)} />
            </div>
            <div className="aa-form-group">
              <label>Kullanım Şekli</label>
              <input type="text" value={vehicle.usage} onChange={e => update('usage', e.target.value)} />
            </div>
          </div>

          <h4 className="aa-subsection-title">Trafik Sigortası Poliçe Bilgileri</h4>
          <div className="aa-form-row">
            <div className="aa-form-group">
              <label>Sigorta Şirketi</label>
              <input type="text" value={vehicle.insuranceCompany} onChange={e => update('insuranceCompany', e.target.value)} />
            </div>
            <div className="aa-form-group">
              <label>Sigortalının Adı Soyadı</label>
              <input type="text" value={vehicle.insuranceHolder} onChange={e => update('insuranceHolder', e.target.value)} />
            </div>
            <div className="aa-form-group">
              <label>Sigortalı Cep Tel</label>
              <input type="text" value={vehicle.insurancePhone} onChange={e => update('insurancePhone', e.target.value)} />
            </div>
          </div>
          <div className="aa-form-row">
            <div className="aa-form-group">
              <label>T.C. Kimlik / Vergi No</label>
              <input type="text" value={vehicle.insuranceTcVkn} onChange={e => update('insuranceTcVkn', e.target.value)} />
            </div>
            <div className="aa-form-group">
              <label>Poliçe No</label>
              <input type="text" value={vehicle.policyNo} onChange={e => update('policyNo', e.target.value)} />
            </div>
            <div className="aa-form-group">
              <label>Poliçe Başlangıç</label>
              <input type="date" value={vehicle.policyStart} onChange={e => update('policyStart', e.target.value)} />
            </div>
            <div className="aa-form-group">
              <label>Poliçe Bitiş</label>
              <input type="date" value={vehicle.policyEnd} onChange={e => update('policyEnd', e.target.value)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
