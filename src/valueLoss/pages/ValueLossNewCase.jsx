import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVL } from '../ValueLossContext';
import {
  CheckCircle,
  AlertTriangle,
  User,
  FileText,
  CreditCard,
  UserCheck,
  Camera,
} from 'lucide-react';

export default function ValueLossNewCase() {
  const { addCase, lawyers, vlSettings } = useVL();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({
    vehicle: {
      plate: '', registrationDate: '', ownerName: '', ownerTC: '',
      brand: '', model: '', year: '', chassisNo: '', engineNo: '',
      color: '', enginePower: '',
    },
    driver: {
      lastName: '', firstName: '', birthDate: '', tcNo: '',
      issueDate: '', expiryDate: '', licenseNo: '', bloodType: '', licenseClass: 'B',
    },
    accident: {
      date: '', location: '', description: '', faultRate: '',
      reportNo: '', insuranceCompany: '', policyNo: '',
    },
    client: {
      fullName: '', tcNo: '', phone: '', email: '', iban: '', address: '',
    },
    feePercentage: vlSettings.defaultFeePercentage || 20,
    lawyerId: '',
  });

  function updateVehicle(field, value) {
    setForm(p => ({ ...p, vehicle: { ...p.vehicle, [field]: value } }));
  }
  function updateDriver(field, value) {
    setForm(p => ({ ...p, driver: { ...p.driver, [field]: value } }));
  }
  function updateAccident(field, value) {
    setForm(p => ({ ...p, accident: { ...p.accident, [field]: value } }));
  }
  function updateClient(field, value) {
    setForm(p => ({ ...p, client: { ...p.client, [field]: value } }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.vehicle.plate || !form.client.fullName) {
      setNotification({ type: 'error', text: 'Plaka ve magdur adi zorunludur!' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const newCase = addCase({
      vehicle: form.vehicle,
      driver: form.driver,
      accident: form.accident,
      client: form.client,
      feePercentage: parseFloat(form.feePercentage) || 20,
      lawyerId: form.lawyerId || null,
    });

    if (form.lawyerId) {
      // Directly assign lawyer if selected
    }

    setNotification({ type: 'success', text: `Dosya ${newCase.caseNo} basariyla olusturuldu!` });
    setTimeout(() => {
      navigate(`/deger-kaybi/dosya/${newCase.id}`);
    }, 1500);
  }

  return (
    <div>
      <div className="vl-page-header">
        <div>
          <h2 className="vl-page-title">Yeni Dosya Olustur</h2>
          <p className="vl-page-subtitle">Arac deger kaybi basvurusu icin tum bilgileri girin</p>
        </div>
      </div>

      {notification && (
        <div className={`vl-notification ${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          {notification.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ===== RUHSAT + EHLİYET KARTLARI ===== */}
        <div className="vl-doc-cards-grid">

          {/* ===== RUHSAT KARTI ===== */}
          <div className="ruhsat-card">
            <div className="ruhsat-header">
              <div className="ruhsat-header-flag">
                <span style={{ position: 'relative', zIndex: 1, fontSize: '0.5rem' }}>TC</span>
              </div>
              <div className="ruhsat-header-text">
                <h3>Turkiye Cumhuriyeti</h3>
                <h2>ARAC TESCIL BELGESI</h2>
              </div>
            </div>
            <div className="ruhsat-body">
              <div className="ruhsat-row">
                <div className="ruhsat-field">
                  <div className="ruhsat-field-label">
                    <span className="ruhsat-field-code">A</span> Plaka No
                  </div>
                  <input
                    type="text"
                    value={form.vehicle.plate}
                    onChange={e => updateVehicle('plate', e.target.value.toUpperCase())}
                    placeholder="34 ABC 123"
                    required
                  />
                </div>
                <div className="ruhsat-field">
                  <div className="ruhsat-field-label">
                    <span className="ruhsat-field-code">I</span> Ilk Tescil Tarihi
                  </div>
                  <input
                    type="date"
                    value={form.vehicle.registrationDate}
                    onChange={e => updateVehicle('registrationDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="ruhsat-row">
                <div className="ruhsat-field full">
                  <div className="ruhsat-field-label">
                    <span className="ruhsat-field-code">C.1</span> Arac Sahibi
                  </div>
                  <input
                    type="text"
                    value={form.vehicle.ownerName}
                    onChange={e => updateVehicle('ownerName', e.target.value)}
                    placeholder="Ad Soyad"
                  />
                </div>
              </div>

              <div className="ruhsat-row">
                <div className="ruhsat-field full">
                  <div className="ruhsat-field-label">
                    <span className="ruhsat-field-code">C.1.1</span> T.C. Kimlik No
                  </div>
                  <input
                    type="text"
                    value={form.vehicle.ownerTC}
                    onChange={e => updateVehicle('ownerTC', e.target.value)}
                    placeholder="12345678901"
                    maxLength={11}
                  />
                </div>
              </div>

              <div className="ruhsat-row">
                <div className="ruhsat-field">
                  <div className="ruhsat-field-label">
                    <span className="ruhsat-field-code">D.1</span> Marka
                  </div>
                  <input
                    type="text"
                    value={form.vehicle.brand}
                    onChange={e => updateVehicle('brand', e.target.value)}
                    placeholder="Toyota"
                  />
                </div>
                <div className="ruhsat-field">
                  <div className="ruhsat-field-label">
                    <span className="ruhsat-field-code">D.2</span> Model
                  </div>
                  <input
                    type="text"
                    value={form.vehicle.model}
                    onChange={e => updateVehicle('model', e.target.value)}
                    placeholder="Corolla"
                  />
                </div>
                <div className="ruhsat-field">
                  <div className="ruhsat-field-label">
                    <span className="ruhsat-field-code">D.3</span> Model Yili
                  </div>
                  <input
                    type="number"
                    value={form.vehicle.year}
                    onChange={e => updateVehicle('year', e.target.value)}
                    placeholder="2023"
                    min="1990"
                    max="2030"
                  />
                </div>
              </div>

              <div className="ruhsat-row">
                <div className="ruhsat-field wide">
                  <div className="ruhsat-field-label">
                    <span className="ruhsat-field-code">E</span> Sasi No
                  </div>
                  <input
                    type="text"
                    value={form.vehicle.chassisNo}
                    onChange={e => updateVehicle('chassisNo', e.target.value.toUpperCase())}
                    placeholder="WVWZZZ3CZWE123456"
                  />
                </div>
                <div className="ruhsat-field">
                  <div className="ruhsat-field-label">
                    <span className="ruhsat-field-code">P.5</span> Motor No
                  </div>
                  <input
                    type="text"
                    value={form.vehicle.engineNo}
                    onChange={e => updateVehicle('engineNo', e.target.value.toUpperCase())}
                    placeholder="ABC12345"
                  />
                </div>
              </div>

              <div className="ruhsat-row">
                <div className="ruhsat-field">
                  <div className="ruhsat-field-label">
                    <span className="ruhsat-field-code">R</span> Renk
                  </div>
                  <input
                    type="text"
                    value={form.vehicle.color}
                    onChange={e => updateVehicle('color', e.target.value)}
                    placeholder="Beyaz"
                  />
                </div>
                <div className="ruhsat-field">
                  <div className="ruhsat-field-label">
                    <span className="ruhsat-field-code">K</span> Motor Gucu (kW)
                  </div>
                  <input
                    type="text"
                    value={form.vehicle.enginePower}
                    onChange={e => updateVehicle('enginePower', e.target.value)}
                    placeholder="110"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== EHLİYET KARTI ===== */}
          <div className="ehliyet-card">
            <div className="ehliyet-header">
              <div className="ehliyet-header-flag">
                <span style={{ position: 'relative', zIndex: 1, fontSize: '0.5rem', color: 'white' }}>TC</span>
              </div>
              <div className="ehliyet-header-text">
                <h3>Turkiye Cumhuriyeti</h3>
                <h2>SURUCU BELGESI</h2>
              </div>
            </div>
            <div className="ehliyet-body">
              <div className="ehliyet-photo">
                <Camera size={28} />
                <span>Foto</span>
              </div>
              <div className="ehliyet-fields">
                <div className="ehliyet-field full">
                  <div className="ehliyet-field-label">
                    <span className="ehliyet-field-code">1</span> Soyadi
                  </div>
                  <input
                    type="text"
                    value={form.driver.lastName}
                    onChange={e => updateDriver('lastName', e.target.value.toUpperCase())}
                    placeholder="SOYADI"
                  />
                </div>
                <div className="ehliyet-field full">
                  <div className="ehliyet-field-label">
                    <span className="ehliyet-field-code">2</span> Adi
                  </div>
                  <input
                    type="text"
                    value={form.driver.firstName}
                    onChange={e => updateDriver('firstName', e.target.value.toUpperCase())}
                    placeholder="ADI"
                  />
                </div>
                <div className="ehliyet-row">
                  <div className="ehliyet-field">
                    <div className="ehliyet-field-label">
                      <span className="ehliyet-field-code">3</span> Dogum Tarihi
                    </div>
                    <input
                      type="date"
                      value={form.driver.birthDate}
                      onChange={e => updateDriver('birthDate', e.target.value)}
                    />
                  </div>
                  <div className="ehliyet-field">
                    <div className="ehliyet-field-label">
                      <span className="ehliyet-field-code">4d</span> T.C. Kimlik No
                    </div>
                    <input
                      type="text"
                      value={form.driver.tcNo}
                      onChange={e => updateDriver('tcNo', e.target.value)}
                      placeholder="12345678901"
                      maxLength={11}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="ehliyet-bottom">
              <div className="ehliyet-row">
                <div className="ehliyet-field">
                  <div className="ehliyet-field-label">
                    <span className="ehliyet-field-code">4a</span> Verilis Tarihi
                  </div>
                  <input
                    type="date"
                    value={form.driver.issueDate}
                    onChange={e => updateDriver('issueDate', e.target.value)}
                  />
                </div>
                <div className="ehliyet-field">
                  <div className="ehliyet-field-label">
                    <span className="ehliyet-field-code">4b</span> Gecerlilik Tarihi
                  </div>
                  <input
                    type="date"
                    value={form.driver.expiryDate}
                    onChange={e => updateDriver('expiryDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="ehliyet-row">
                <div className="ehliyet-field">
                  <div className="ehliyet-field-label">
                    <span className="ehliyet-field-code">5</span> Belge No
                  </div>
                  <input
                    type="text"
                    value={form.driver.licenseNo}
                    onChange={e => updateDriver('licenseNo', e.target.value)}
                    placeholder="A12B34567"
                  />
                </div>
                <div className="ehliyet-field">
                  <div className="ehliyet-field-label">
                    <span className="ehliyet-field-code">8</span> Kan Grubu
                  </div>
                  <input
                    type="text"
                    value={form.driver.bloodType}
                    onChange={e => updateDriver('bloodType', e.target.value)}
                    placeholder="A Rh+"
                  />
                </div>
                <div className="ehliyet-field">
                  <div className="ehliyet-field-label">
                    <span className="ehliyet-field-code">9</span> Sinif
                  </div>
                  <input
                    type="text"
                    value={form.driver.licenseClass}
                    onChange={e => updateDriver('licenseClass', e.target.value)}
                    placeholder="B"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== KAZA BİLGİLERİ ===== */}
        <div className="vl-section">
          <div className="vl-section-header">
            <AlertTriangle size={18} />
            Kaza Bilgileri
          </div>
          <div className="vl-section-body">
            <div className="vl-form-row">
              <div className="vl-form-group">
                <label className="vl-form-label">Kaza Tarihi</label>
                <input
                  type="date"
                  className="vl-form-input"
                  value={form.accident.date}
                  onChange={e => updateAccident('date', e.target.value)}
                />
              </div>
              <div className="vl-form-group">
                <label className="vl-form-label">Kaza Yeri</label>
                <input
                  type="text"
                  className="vl-form-input"
                  value={form.accident.location}
                  onChange={e => updateAccident('location', e.target.value)}
                  placeholder="Sehir, ilce, cadde..."
                />
              </div>
              <div className="vl-form-group">
                <label className="vl-form-label">Karsi Taraf Kusur Orani (%)</label>
                <input
                  type="number"
                  className="vl-form-input"
                  value={form.accident.faultRate}
                  onChange={e => updateAccident('faultRate', e.target.value)}
                  placeholder="100"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="vl-form-row">
              <div className="vl-form-group">
                <label className="vl-form-label">Kaza Tespit Tutanagi No</label>
                <input
                  type="text"
                  className="vl-form-input"
                  value={form.accident.reportNo}
                  onChange={e => updateAccident('reportNo', e.target.value)}
                  placeholder="Tutanak numarasi"
                />
              </div>
              <div className="vl-form-group">
                <label className="vl-form-label">Sigorta Sirketi</label>
                <input
                  type="text"
                  className="vl-form-input"
                  value={form.accident.insuranceCompany}
                  onChange={e => updateAccident('insuranceCompany', e.target.value)}
                  placeholder="Sigorta sirketi adi"
                />
              </div>
              <div className="vl-form-group">
                <label className="vl-form-label">Police No</label>
                <input
                  type="text"
                  className="vl-form-input"
                  value={form.accident.policyNo}
                  onChange={e => updateAccident('policyNo', e.target.value)}
                  placeholder="Police numarasi"
                />
              </div>
            </div>
            <div className="vl-form-group">
              <label className="vl-form-label">Kaza Aciklamasi</label>
              <textarea
                className="vl-form-textarea"
                value={form.accident.description}
                onChange={e => updateAccident('description', e.target.value)}
                placeholder="Kaza detaylarini yazin..."
              />
            </div>
          </div>
        </div>

        {/* ===== MAĞDUR / MÜVEKKİL BİLGİLERİ ===== */}
        <div className="vl-section">
          <div className="vl-section-header">
            <User size={18} />
            Magdur / Muvekkil Bilgileri
          </div>
          <div className="vl-section-body">
            <div className="vl-form-row">
              <div className="vl-form-group">
                <label className="vl-form-label">Ad Soyad</label>
                <input
                  type="text"
                  className="vl-form-input"
                  value={form.client.fullName}
                  onChange={e => updateClient('fullName', e.target.value)}
                  placeholder="Magdur adi soyadi"
                  required
                />
              </div>
              <div className="vl-form-group">
                <label className="vl-form-label">T.C. Kimlik No</label>
                <input
                  type="text"
                  className="vl-form-input"
                  value={form.client.tcNo}
                  onChange={e => updateClient('tcNo', e.target.value)}
                  placeholder="12345678901"
                  maxLength={11}
                />
              </div>
            </div>
            <div className="vl-form-row">
              <div className="vl-form-group">
                <label className="vl-form-label">Telefon</label>
                <input
                  type="tel"
                  className="vl-form-input"
                  value={form.client.phone}
                  onChange={e => updateClient('phone', e.target.value)}
                  placeholder="0532 123 45 67"
                />
              </div>
              <div className="vl-form-group">
                <label className="vl-form-label">E-posta</label>
                <input
                  type="email"
                  className="vl-form-input"
                  value={form.client.email}
                  onChange={e => updateClient('email', e.target.value)}
                  placeholder="ornek@mail.com"
                />
              </div>
            </div>
            <div className="vl-form-group">
              <label className="vl-form-label">IBAN (Tazminat odemesi icin)</label>
              <input
                type="text"
                className="vl-form-input"
                value={form.client.iban}
                onChange={e => updateClient('iban', e.target.value.toUpperCase())}
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                style={{ fontFamily: "'Courier New', monospace", letterSpacing: '1px' }}
              />
            </div>
            <div className="vl-form-group">
              <label className="vl-form-label">Adres</label>
              <textarea
                className="vl-form-textarea"
                value={form.client.address}
                onChange={e => updateClient('address', e.target.value)}
                placeholder="Acik adres..."
                style={{ minHeight: '60px' }}
              />
            </div>
          </div>
        </div>

        {/* ===== ÜCRET SÖZLEŞMESİ & AVUKAT ATAMA ===== */}
        <div className="vl-section">
          <div className="vl-section-header">
            <FileText size={18} />
            Ucret Sozlesmesi & Avukat Atama
          </div>
          <div className="vl-section-body">
            <div className="vl-form-row">
              <div className="vl-form-group">
                <label className="vl-form-label">Ucret Sozlesmesi Orani (%)</label>
                <input
                  type="number"
                  className="vl-form-input"
                  value={form.feePercentage}
                  onChange={e => setForm(p => ({ ...p, feePercentage: e.target.value }))}
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
              <div className="vl-form-group">
                <label className="vl-form-label">Sorumlu Avukat</label>
                <select
                  className="vl-form-input"
                  value={form.lawyerId}
                  onChange={e => setForm(p => ({ ...p, lawyerId: e.target.value }))}
                >
                  <option value="">-- Sonra Atanacak --</option>
                  {lawyers.map(l => (
                    <option key={l.id} value={l.id}>Av. {l.fullName}</option>
                  ))}
                </select>
              </div>
            </div>
            {lawyers.length === 0 && (
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                Henuz avukat eklenmemis. Avukatlar sayfasindan avukat ekleyebilirsiniz.
              </p>
            )}
          </div>
        </div>

        {/* ===== SUBMIT ===== */}
        <button type="submit" className="vl-btn vl-btn-primary vl-btn-full" style={{ marginBottom: '2rem' }}>
          <CheckCircle size={20} />
          Dosya Olustur
        </button>
      </form>
    </div>
  );
}
