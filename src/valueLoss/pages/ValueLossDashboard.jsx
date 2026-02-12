import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVL } from '../ValueLossContext';
import {
  FolderPlus,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  Scale,
  FolderOpen,
} from 'lucide-react';

const STATUS_LABELS = {
  open: 'Acik',
  assigned: 'Atandi',
  applied: 'Basvuruldu',
  inProgress: 'Tahkim/Mahkeme',
  concluded: 'Sonuclandi',
  closed: 'Kapandi',
};

const FILTER_OPTIONS = [
  { key: 'all', label: 'Tumu' },
  { key: 'open', label: 'Acik' },
  { key: 'assigned', label: 'Atanmis' },
  { key: 'applied', label: 'Basvurulmus' },
  { key: 'inProgress', label: 'Devam Eden' },
  { key: 'concluded', label: 'Sonuclanan' },
  { key: 'closed', label: 'Kapanan' },
];

function formatCurrency(val) {
  if (!val && val !== 0) return '0 TL';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency', currency: 'TRY',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(val);
}

function formatDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('tr-TR');
}

export default function ValueLossDashboard() {
  const { cases, lawyers } = useVL();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const stats = useMemo(() => {
    const total = cases.length;
    const active = cases.filter(c => !['closed', 'concluded'].includes(c.status)).length;
    const closed = cases.filter(c => c.status === 'closed').length;
    const totalRevenue = cases
      .filter(c => c.settlement)
      .reduce((sum, c) => {
        const s = c.settlement;
        return sum + (s.feeFromCompensation || 0) + (s.counterAttorneyFee || 0)
          + (s.withholdingTax || 0) + (s.interestAmount || 0)
          + (s.otherIncomeItems || []).reduce((a, i) => a + (i.amount || 0), 0);
      }, 0);
    const totalExpenses = cases.reduce((sum, c) =>
      sum + c.expenses.reduce((a, e) => a + (e.amount || 0), 0), 0);

    return { total, active, closed, totalRevenue, totalExpenses };
  }, [cases]);

  const filteredCases = useMemo(() => {
    let list = [...cases].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (filter !== 'all') {
      list = list.filter(c => c.status === filter);
    }
    return list;
  }, [cases, filter]);

  function getLawyerName(id) {
    if (!id) return '-';
    return lawyers.find(l => l.id === id)?.fullName || '-';
  }

  return (
    <div>
      <div className="vl-page-header">
        <div>
          <h2 className="vl-page-title">Dosyalarim</h2>
          <p className="vl-page-subtitle">Arac Deger Kaybi dosyalarini yonetin ve takip edin</p>
        </div>
        <button className="vl-btn vl-btn-primary" onClick={() => navigate('/deger-kaybi/yeni-dosya')}>
          <FolderPlus size={18} />
          Yeni Dosya Olustur
        </button>
      </div>

      <div className="vl-stats-grid">
        <div className="vl-stat-card" style={{ borderLeftColor: '#0f766e' }}>
          <div className="vl-stat-card-label">Toplam Dosya</div>
          <div className="vl-stat-card-value">{stats.total}</div>
        </div>
        <div className="vl-stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="vl-stat-card-label">Aktif Dosya</div>
          <div className="vl-stat-card-value">{stats.active}</div>
        </div>
        <div className="vl-stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="vl-stat-card-label">Kapanan Dosya</div>
          <div className="vl-stat-card-value">{stats.closed}</div>
        </div>
        <div className="vl-stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="vl-stat-card-label">Toplam Kazanc</div>
          <div className="vl-stat-card-value">{formatCurrency(stats.totalRevenue)}</div>
          <div className="vl-stat-card-sub">Masraf: {formatCurrency(stats.totalExpenses)}</div>
        </div>
      </div>

      <div className="vl-filter-bar">
        {FILTER_OPTIONS.map(f => (
          <button
            key={f.key}
            className={`vl-filter-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredCases.length === 0 ? (
        <div className="vl-card">
          <div className="vl-empty">
            <FolderOpen size={48} />
            <h3>Henuz dosya bulunmuyor</h3>
            <p>Yeni bir arac deger kaybi dosyasi olusturmak icin yukaridaki butona tiklayin.</p>
          </div>
        </div>
      ) : (
        <div className="vl-cases-table-wrap">
          <table className="vl-cases-table">
            <thead>
              <tr>
                <th>Dosya No</th>
                <th>Plaka</th>
                <th>Magdur</th>
                <th>Avukat</th>
                <th>Durum</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map(c => (
                <tr key={c.id} onClick={() => navigate(`/deger-kaybi/dosya/${c.id}`)}>
                  <td><span className="vl-case-no">{c.caseNo}</span></td>
                  <td><span className="vl-case-plate">{c.vehicle?.plate || '-'}</span></td>
                  <td>{c.client?.fullName || '-'}</td>
                  <td>{getLawyerName(c.lawyerId)}</td>
                  <td><span className={`vl-status ${c.status}`}>{STATUS_LABELS[c.status]}</span></td>
                  <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
