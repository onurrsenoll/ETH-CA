import { useState } from 'react';
import { useVL } from '../ValueLossContext';
import {
  Users, Plus, Phone, Mail, Edit3, Trash2, Check, X, Hash, UserPlus,
} from 'lucide-react';

export default function ValueLossLawyers() {
  const { lawyers, cases, addLawyer, updateLawyer, removeLawyer } = useVL();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ fullName: '', barNumber: '', phone: '', email: '' });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.fullName) return;

    if (editingId) {
      updateLawyer(editingId, form);
      setEditingId(null);
    } else {
      addLawyer(form);
    }
    setForm({ fullName: '', barNumber: '', phone: '', email: '' });
    setShowForm(false);
  }

  function handleEdit(lawyer) {
    setForm({
      fullName: lawyer.fullName,
      barNumber: lawyer.barNumber || '',
      phone: lawyer.phone || '',
      email: lawyer.email || '',
    });
    setEditingId(lawyer.id);
    setShowForm(true);
  }

  function handleDelete(id) {
    const activeCases = cases.filter(c => c.lawyerId === id && c.status !== 'closed').length;
    if (activeCases > 0) {
      alert(`Bu avukatin ${activeCases} aktif dosyasi var. Silmeden once dosyalari baska avukata atanmalidir.`);
      return;
    }
    if (confirm('Bu avukati silmek istediginize emin misiniz?')) {
      removeLawyer(id);
    }
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setForm({ fullName: '', barNumber: '', phone: '', email: '' });
  }

  function getLawyerStats(lawyerId) {
    const lawyerCases = cases.filter(c => c.lawyerId === lawyerId);
    const active = lawyerCases.filter(c => c.status !== 'closed').length;
    const closed = lawyerCases.filter(c => c.status === 'closed').length;
    const totalRevenue = lawyerCases
      .filter(c => c.settlement)
      .reduce((sum, c) => sum + (c.settlement.lawyerShare || 0), 0);
    return { active, closed, totalRevenue };
  }

  function getInitials(name) {
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div>
      <div className="vl-page-header">
        <div>
          <h2 className="vl-page-title">Avukatlarim</h2>
          <p className="vl-page-subtitle">Dosyalarinizi yoneten avukatlari yonetin</p>
        </div>
        <button className="vl-btn vl-btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setForm({ fullName: '', barNumber: '', phone: '', email: '' }); }}>
          <UserPlus size={18} />
          Avukat Ekle
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="vl-card" style={{ marginBottom: '1.5rem' }}>
          <div className="vl-card-title">
            {editingId ? <Edit3 size={18} /> : <Plus size={18} />}
            {editingId ? 'Avukat Duzenle' : 'Yeni Avukat Ekle'}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="vl-form-row">
              <div className="vl-form-group">
                <label className="vl-form-label">Ad Soyad</label>
                <input
                  type="text"
                  className="vl-form-input"
                  value={form.fullName}
                  onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                  placeholder="Av. Ad Soyad"
                  required
                />
              </div>
              <div className="vl-form-group">
                <label className="vl-form-label">Baro Sicil No</label>
                <input
                  type="text"
                  className="vl-form-input"
                  value={form.barNumber}
                  onChange={e => setForm(p => ({ ...p, barNumber: e.target.value }))}
                  placeholder="12345"
                />
              </div>
            </div>
            <div className="vl-form-row">
              <div className="vl-form-group">
                <label className="vl-form-label">Telefon</label>
                <input
                  type="tel"
                  className="vl-form-input"
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="0532 123 45 67"
                />
              </div>
              <div className="vl-form-group">
                <label className="vl-form-label">E-posta</label>
                <input
                  type="email"
                  className="vl-form-input"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="avukat@mail.com"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="vl-btn vl-btn-primary">
                <Check size={16} /> {editingId ? 'Guncelle' : 'Kaydet'}
              </button>
              <button type="button" className="vl-btn vl-btn-secondary" onClick={handleCancel}>
                <X size={16} /> Iptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lawyers Grid */}
      {lawyers.length === 0 ? (
        <div className="vl-card">
          <div className="vl-empty">
            <Users size={48} />
            <h3>Henuz avukat eklenmemis</h3>
            <p>Dosyalarinizi atamak icin avukat ekleyin.</p>
          </div>
        </div>
      ) : (
        <div className="vl-lawyer-grid">
          {lawyers.map(lawyer => {
            const stats = getLawyerStats(lawyer.id);
            return (
              <div key={lawyer.id} className="vl-lawyer-card">
                <div className="vl-lawyer-card-header">
                  <div className="vl-lawyer-avatar">{getInitials(lawyer.fullName)}</div>
                  <div>
                    <div className="vl-lawyer-name">Av. {lawyer.fullName}</div>
                    {lawyer.barNumber && (
                      <div className="vl-lawyer-baro">Baro No: {lawyer.barNumber}</div>
                    )}
                  </div>
                </div>

                {lawyer.phone && (
                  <div className="vl-lawyer-info-row">
                    <Phone size={14} /> {lawyer.phone}
                  </div>
                )}
                {lawyer.email && (
                  <div className="vl-lawyer-info-row">
                    <Mail size={14} /> {lawyer.email}
                  </div>
                )}

                <div className="vl-lawyer-stats">
                  <div className="vl-lawyer-stat">
                    <div className="vl-lawyer-stat-value">{stats.active}</div>
                    <div className="vl-lawyer-stat-label">Aktif Dosya</div>
                  </div>
                  <div className="vl-lawyer-stat">
                    <div className="vl-lawyer-stat-value">{stats.closed}</div>
                    <div className="vl-lawyer-stat-label">Kapanan</div>
                  </div>
                  <div className="vl-lawyer-stat">
                    <div className="vl-lawyer-stat-value" style={{ fontSize: '0.85rem' }}>
                      {new Intl.NumberFormat('tr-TR', {
                        style: 'currency', currency: 'TRY',
                        minimumFractionDigits: 0, maximumFractionDigits: 0,
                      }).format(stats.totalRevenue)}
                    </div>
                    <div className="vl-lawyer-stat-label">Kazanc</div>
                  </div>
                </div>

                <div className="vl-lawyer-card-actions">
                  <button className="vl-btn-icon" onClick={() => handleEdit(lawyer)} title="Duzenle">
                    <Edit3 size={16} />
                  </button>
                  <button className="vl-btn-icon danger" onClick={() => handleDelete(lawyer.id)} title="Sil">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
