import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVL } from '../ValueLossContext';
import {
  FolderOpen, UserCheck, Send, Scale, CheckCircle2, Archive,
  ArrowLeft, Trash2, Plus, Calculator, CreditCard, ChevronRight,
  AlertTriangle, Check,
} from 'lucide-react';

const STAGES = [
  { key: 'open', label: 'Dosya Acildi', icon: FolderOpen },
  { key: 'assigned', label: 'Avukata Atandi', icon: UserCheck },
  { key: 'applied', label: 'Basvuru Yapildi', icon: Send },
  { key: 'inProgress', label: 'Tahkim/Mahkeme', icon: Scale },
  { key: 'concluded', label: 'Sonuclandi', icon: CheckCircle2 },
  { key: 'closed', label: 'Dosya Kapandi', icon: Archive },
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

export default function ValueLossCaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    cases, lawyers,
    assignLawyer, advanceStage,
    addExpense, removeExpense, settleCase, removeCase,
  } = useVL();

  const caseData = cases.find(c => c.id === id);
  const [expenseLabel, setExpenseLabel] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [selectedLawyer, setSelectedLawyer] = useState('');
  const [stageNote, setStageNote] = useState('');

  // Settlement form state
  const [settlement, setSettlement] = useState({
    compensationAmount: '',
    counterAttorneyFee: '',
    withholdingTax: '',
    interestAmount: '',
    otherIncomeItems: [],
  });
  const [otherLabel, setOtherLabel] = useState('');
  const [otherAmount, setOtherAmount] = useState('');

  if (!caseData) {
    return (
      <div>
        <div className="vl-card">
          <div className="vl-empty">
            <FolderOpen size={48} />
            <h3>Dosya bulunamadi</h3>
            <p>Dosya silinmis veya mevcut degil.</p>
          </div>
        </div>
        <button className="vl-btn vl-btn-secondary" onClick={() => navigate('/deger-kaybi')} style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Geri Don
        </button>
      </div>
    );
  }

  const lawyer = lawyers.find(l => l.id === caseData.lawyerId);
  const currentStageIdx = STAGES.findIndex(s => s.key === caseData.status);

  function getNextStage() {
    const idx = currentStageIdx;
    if (idx < STAGES.length - 1) return STAGES[idx + 1];
    return null;
  }

  function handleAssignLawyer() {
    if (!selectedLawyer) return;
    assignLawyer(caseData.id, selectedLawyer);
    setSelectedLawyer('');
  }

  function handleAdvanceStage() {
    const next = getNextStage();
    if (!next) return;
    if (next.key === 'assigned' && !caseData.lawyerId) {
      alert('Once bir avukat atanmalidir!');
      return;
    }
    advanceStage(caseData.id, next.key, stageNote || next.label);
    setStageNote('');
  }

  function handleAddExpense() {
    if (!expenseLabel || !expenseAmount) return;
    addExpense(caseData.id, {
      label: expenseLabel,
      amount: parseFloat(expenseAmount) || 0,
    });
    setExpenseLabel('');
    setExpenseAmount('');
  }

  function handleAddOtherIncome() {
    if (!otherLabel || !otherAmount) return;
    setSettlement(prev => ({
      ...prev,
      otherIncomeItems: [
        ...prev.otherIncomeItems,
        { label: otherLabel, amount: parseFloat(otherAmount) || 0 },
      ],
    }));
    setOtherLabel('');
    setOtherAmount('');
  }

  function handleRemoveOtherIncome(idx) {
    setSettlement(prev => ({
      ...prev,
      otherIncomeItems: prev.otherIncomeItems.filter((_, i) => i !== idx),
    }));
  }

  // Financial calculations
  const calculations = useMemo(() => {
    const comp = parseFloat(settlement.compensationAmount) || 0;
    const fee = comp * (caseData.feePercentage / 100);
    const counter = parseFloat(settlement.counterAttorneyFee) || 0;
    const withholding = parseFloat(settlement.withholdingTax) || 0;
    const interest = parseFloat(settlement.interestAmount) || 0;
    const otherTotal = settlement.otherIncomeItems.reduce((s, i) => s + (i.amount || 0), 0);

    const totalRevenue = fee + counter + withholding + interest + otherTotal;
    const totalExpenses = caseData.expenses.reduce((s, e) => s + (e.amount || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const ownerShare = netProfit * 0.5;
    const lawyerShare = netProfit * 0.5;
    const clientPayment = comp - fee;

    return {
      comp, fee, counter, withholding, interest, otherTotal,
      totalRevenue, totalExpenses, netProfit, ownerShare, lawyerShare, clientPayment,
    };
  }, [settlement, caseData.expenses, caseData.feePercentage]);

  function handleSettleCase() {
    if (!settlement.compensationAmount) {
      alert('Tazminat tutari girilmelidir!');
      return;
    }
    settleCase(caseData.id, {
      compensationAmount: parseFloat(settlement.compensationAmount) || 0,
      feeFromCompensation: calculations.fee,
      counterAttorneyFee: parseFloat(settlement.counterAttorneyFee) || 0,
      withholdingTax: parseFloat(settlement.withholdingTax) || 0,
      interestAmount: parseFloat(settlement.interestAmount) || 0,
      otherIncomeItems: settlement.otherIncomeItems,
      totalRevenue: calculations.totalRevenue,
      totalExpenses: calculations.totalExpenses,
      netProfit: calculations.netProfit,
      ownerShare: calculations.ownerShare,
      lawyerShare: calculations.lawyerShare,
      clientPayment: calculations.clientPayment,
    });
  }

  function handleDeleteCase() {
    if (confirm('Bu dosyayi silmek istediginize emin misiniz?')) {
      removeCase(caseData.id);
      navigate('/deger-kaybi');
    }
  }

  const totalExpenses = caseData.expenses.reduce((s, e) => s + (e.amount || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="vl-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
            <button className="vl-btn-icon" onClick={() => navigate('/deger-kaybi')}>
              <ArrowLeft size={20} />
            </button>
            <h2 className="vl-page-title">{caseData.caseNo}</h2>
            <span className={`vl-status ${caseData.status}`}>
              {STAGES.find(s => s.key === caseData.status)?.label}
            </span>
          </div>
          <p className="vl-page-subtitle">
            {caseData.vehicle?.plate} - {caseData.client?.fullName}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {caseData.status !== 'closed' && (
            <button className="vl-btn vl-btn-danger vl-btn-sm" onClick={handleDeleteCase}>
              <Trash2 size={14} /> Sil
            </button>
          )}
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="vl-stage-timeline">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;
          const stageHistoryEntry = caseData.stageHistory.find(h => h.stage === stage.key);
          const Icon = stage.icon;

          return (
            <div key={stage.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div className="vl-stage-item">
                <div className={`vl-stage-dot ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                  {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span className={`vl-stage-label ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                  {stage.label}
                </span>
                <span className="vl-stage-date">
                  {stageHistoryEntry ? formatDate(stageHistoryEntry.date) : ''}
                </span>
              </div>
              {idx < STAGES.length - 1 && (
                <div className={`vl-stage-connector ${isCompleted ? 'completed' : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Advance Stage Action */}
      {caseData.status !== 'closed' && caseData.status !== 'concluded' && (
        <div className="vl-card" style={{ marginBottom: '1.5rem' }}>
          <div className="vl-card-title">
            <ChevronRight size={18} style={{ color: '#0f766e' }} />
            Sonraki Asama
          </div>

          {/* Lawyer assignment if not assigned yet */}
          {!caseData.lawyerId && caseData.status === 'open' && (
            <div style={{ marginBottom: '1rem' }}>
              <label className="vl-form-label">Avukat Ata (zorunlu)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  className="vl-form-input"
                  value={selectedLawyer}
                  onChange={e => setSelectedLawyer(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="">Avukat secin...</option>
                  {lawyers.map(l => (
                    <option key={l.id} value={l.id}>Av. {l.fullName}</option>
                  ))}
                </select>
                <button className="vl-btn vl-btn-primary vl-btn-sm" onClick={handleAssignLawyer}>
                  <UserCheck size={16} /> Ata
                </button>
              </div>
              {lawyers.length === 0 && (
                <p style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '0.3rem' }}>
                  Henuz avukat yok. Once Avukatlar sayfasindan ekleyin.
                </p>
              )}
            </div>
          )}

          {getNextStage() && (caseData.lawyerId || caseData.status !== 'open') && (
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label className="vl-form-label">Not (opsiyonel)</label>
                  <input
                    type="text"
                    className="vl-form-input"
                    value={stageNote}
                    onChange={e => setStageNote(e.target.value)}
                    placeholder="Asama notu..."
                  />
                </div>
                <button className="vl-btn vl-btn-success" onClick={handleAdvanceStage}>
                  <ChevronRight size={16} />
                  {getNextStage()?.label}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Grid */}
      <div className="vl-detail-grid">
        {/* Case Info */}
        <div className="vl-card">
          <div className="vl-card-title">
            <FolderOpen size={18} style={{ color: '#0f766e' }} />
            Dosya Bilgileri
          </div>
          <div className="vl-info-item">
            <div className="vl-info-label">Plaka</div>
            <div className="vl-info-value">{caseData.vehicle?.plate || '-'}</div>
          </div>
          <div className="vl-info-item">
            <div className="vl-info-label">Arac</div>
            <div className="vl-info-value">{caseData.vehicle?.brand} {caseData.vehicle?.model} {caseData.vehicle?.year}</div>
          </div>
          <div className="vl-info-item">
            <div className="vl-info-label">Arac Sahibi</div>
            <div className="vl-info-value">{caseData.vehicle?.ownerName || '-'}</div>
          </div>
          <div className="vl-info-item">
            <div className="vl-info-label">Magdur</div>
            <div className="vl-info-value">{caseData.client?.fullName || '-'}</div>
          </div>
          <div className="vl-info-item">
            <div className="vl-info-label">Magdur Telefon</div>
            <div className="vl-info-value">{caseData.client?.phone || '-'}</div>
          </div>
          <div className="vl-info-item">
            <div className="vl-info-label">IBAN</div>
            <div className="vl-info-value" style={{ fontFamily: "'Courier New', monospace", fontSize: '0.82rem' }}>
              {caseData.client?.iban || '-'}
            </div>
          </div>
          <div className="vl-info-item">
            <div className="vl-info-label">Sorumlu Avukat</div>
            <div className="vl-info-value">{lawyer ? `Av. ${lawyer.fullName}` : 'Atanmadi'}</div>
          </div>
          <div className="vl-info-item">
            <div className="vl-info-label">Ucret Sozlesmesi</div>
            <div className="vl-info-value">%{caseData.feePercentage}</div>
          </div>
        </div>

        {/* Expenses */}
        <div className="vl-card">
          <div className="vl-card-title">
            <CreditCard size={18} style={{ color: '#ef4444' }} />
            Masraf Kalemleri
          </div>
          {caseData.expenses.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Henuz masraf eklenmemis.</p>
          ) : (
            <div className="vl-expense-list">
              {caseData.expenses.map(exp => (
                <div key={exp.id} className="vl-expense-item">
                  <div className="vl-expense-item-info">
                    <span className="vl-expense-item-label">{exp.label}</span>
                    <span className="vl-expense-item-date">{formatDate(exp.date)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="vl-expense-item-amount">{formatCurrency(exp.amount)}</span>
                    {caseData.status !== 'closed' && (
                      <button className="vl-btn-icon danger" onClick={() => removeExpense(caseData.id, exp.id)}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="vl-expense-total">
            <span>Toplam Masraf</span>
            <span style={{ color: '#ef4444' }}>{formatCurrency(totalExpenses)}</span>
          </div>

          {caseData.status !== 'closed' && (
            <div className="vl-expense-add-row">
              <input
                type="text"
                value={expenseLabel}
                onChange={e => setExpenseLabel(e.target.value)}
                placeholder="Masraf adi (Harc, Posta...)"
              />
              <input
                type="number"
                value={expenseAmount}
                onChange={e => setExpenseAmount(e.target.value)}
                placeholder="Tutar"
                style={{ maxWidth: '120px' }}
                min="0"
              />
              <button className="vl-btn vl-btn-secondary vl-btn-sm" onClick={handleAddExpense}>
                <Plus size={14} /> Ekle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Kaza Bilgileri */}
      <div className="vl-card" style={{ marginBottom: '1.5rem' }}>
        <div className="vl-card-title">
          <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
          Kaza Bilgileri
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <div className="vl-info-item">
            <div className="vl-info-label">Kaza Tarihi</div>
            <div className="vl-info-value">{formatDate(caseData.accident?.date)}</div>
          </div>
          <div className="vl-info-item">
            <div className="vl-info-label">Kaza Yeri</div>
            <div className="vl-info-value">{caseData.accident?.location || '-'}</div>
          </div>
          <div className="vl-info-item">
            <div className="vl-info-label">Kusur Orani</div>
            <div className="vl-info-value">%{caseData.accident?.faultRate || '-'}</div>
          </div>
          <div className="vl-info-item">
            <div className="vl-info-label">Tutanak No</div>
            <div className="vl-info-value">{caseData.accident?.reportNo || '-'}</div>
          </div>
          <div className="vl-info-item">
            <div className="vl-info-label">Sigorta Sirketi</div>
            <div className="vl-info-value">{caseData.accident?.insuranceCompany || '-'}</div>
          </div>
          <div className="vl-info-item">
            <div className="vl-info-label">Police No</div>
            <div className="vl-info-value">{caseData.accident?.policyNo || '-'}</div>
          </div>
        </div>
        {caseData.accident?.description && (
          <div className="vl-info-item" style={{ marginTop: '0.5rem' }}>
            <div className="vl-info-label">Aciklama</div>
            <div className="vl-info-value" style={{ fontWeight: 400 }}>{caseData.accident.description}</div>
          </div>
        )}
      </div>

      {/* ===== SETTLEMENT / FINANCIAL CALCULATION ===== */}
      {(caseData.status === 'concluded' || caseData.status === 'closed') && (
        <div className="vl-settlement">
          <div className="vl-settlement-header">
            <Calculator size={22} />
            Dosya Kapanisi - Mali Hesaplama
          </div>
          <div className="vl-settlement-body">

            {/* If already closed, show final numbers */}
            {caseData.status === 'closed' && caseData.settlement ? (
              <>
                {/* Revenue Items */}
                <div className="vl-settlement-section">
                  <div className="vl-settlement-section-title">Kazanc Kalemleri</div>
                  <div className="vl-settlement-row">
                    <label>Tazminat Tutari</label>
                    <span className="amount">{formatCurrency(caseData.settlement.compensationAmount)}</span>
                  </div>
                  <div className="vl-settlement-row">
                    <label>Ucret Sozlesmesi Payi (%{caseData.feePercentage})</label>
                    <span className="amount positive">{formatCurrency(caseData.settlement.feeFromCompensation)}</span>
                  </div>
                  <div className="vl-settlement-row">
                    <label>Karsi Vekalet Ucreti</label>
                    <span className="amount positive">{formatCurrency(caseData.settlement.counterAttorneyFee)}</span>
                  </div>
                  <div className="vl-settlement-row">
                    <label>Stopaj</label>
                    <span className="amount positive">{formatCurrency(caseData.settlement.withholdingTax)}</span>
                  </div>
                  <div className="vl-settlement-row">
                    <label>Faiz</label>
                    <span className="amount positive">{formatCurrency(caseData.settlement.interestAmount)}</span>
                  </div>
                  {(caseData.settlement.otherIncomeItems || []).map((item, i) => (
                    <div className="vl-settlement-row" key={i}>
                      <label>{item.label}</label>
                      <span className="amount positive">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <div className="vl-settlement-total">
                    <span>TOPLAM KAZANC</span>
                    <span className="amount" style={{ color: '#10b981' }}>{formatCurrency(caseData.settlement.totalRevenue)}</span>
                  </div>
                </div>

                {/* Expense Items */}
                <div className="vl-settlement-section">
                  <div className="vl-settlement-section-title">Masraf Kalemleri</div>
                  {caseData.expenses.map(exp => (
                    <div className="vl-settlement-row" key={exp.id}>
                      <label>{exp.label}</label>
                      <span className="amount negative">{formatCurrency(exp.amount)}</span>
                    </div>
                  ))}
                  <div className="vl-settlement-total">
                    <span>TOPLAM MASRAF</span>
                    <span className="amount" style={{ color: '#ef4444' }}>{formatCurrency(caseData.settlement.totalExpenses)}</span>
                  </div>
                </div>

                {/* Net Profit */}
                <div className="vl-settlement-section">
                  <div className="vl-settlement-total" style={{ borderTop: '4px double #0f172a', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '1.15rem' }}>NET KAZANC</span>
                    <span className="amount" style={{ fontSize: '1.4rem', color: caseData.settlement.netProfit >= 0 ? '#10b981' : '#ef4444' }}>
                      {formatCurrency(caseData.settlement.netProfit)}
                    </span>
                  </div>
                </div>

                {/* Profit Split */}
                <div className="vl-settlement-split">
                  <div className="vl-settlement-split-title">Kazanc Paylasimi (%50 - %50)</div>
                  <div className="vl-split-row">
                    <label>Sistem Sahibi Payi (%50)</label>
                    <span className="amount">{formatCurrency(caseData.settlement.ownerShare)}</span>
                  </div>
                  <div className="vl-split-row">
                    <label>Avukat Payi (%50) {lawyer ? `- Av. ${lawyer.fullName}` : ''}</label>
                    <span className="amount">{formatCurrency(caseData.settlement.lawyerShare)}</span>
                  </div>
                </div>

                {/* Client Payment */}
                <div className="vl-client-payment">
                  <div className="vl-client-payment-title">Magdura Odenecek Tutar</div>
                  <div className="vl-client-payment-amount">{formatCurrency(caseData.settlement.clientPayment)}</div>
                  <div className="vl-client-payment-iban">
                    IBAN: {caseData.client?.iban || 'Belirtilmedi'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.5rem' }}>
                    Magdur: {caseData.client?.fullName}
                  </div>
                </div>
              </>
            ) : (
              /* Settlement Input Form (when status is 'concluded') */
              <>
                <div className="vl-settlement-section">
                  <div className="vl-settlement-section-title">Kazanc Kalemleri - Degerler Girin</div>

                  <div className="vl-settlement-row input-row">
                    <label>Tazminat Tutari</label>
                    <input
                      type="number"
                      value={settlement.compensationAmount}
                      onChange={e => setSettlement(p => ({ ...p, compensationAmount: e.target.value }))}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="vl-settlement-row">
                    <label>Ucret Sozlesmesi Payi (%{caseData.feePercentage})</label>
                    <span className="amount positive">{formatCurrency(calculations.fee)}</span>
                  </div>

                  <div className="vl-settlement-row input-row">
                    <label>Karsi Vekalet Ucreti</label>
                    <input
                      type="number"
                      value={settlement.counterAttorneyFee}
                      onChange={e => setSettlement(p => ({ ...p, counterAttorneyFee: e.target.value }))}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="vl-settlement-row input-row">
                    <label>Stopaj</label>
                    <input
                      type="number"
                      value={settlement.withholdingTax}
                      onChange={e => setSettlement(p => ({ ...p, withholdingTax: e.target.value }))}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="vl-settlement-row input-row">
                    <label>Faiz</label>
                    <input
                      type="number"
                      value={settlement.interestAmount}
                      onChange={e => setSettlement(p => ({ ...p, interestAmount: e.target.value }))}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  {/* Other income items */}
                  {settlement.otherIncomeItems.map((item, i) => (
                    <div className="vl-settlement-row" key={i}>
                      <label>{item.label}</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="amount positive">{formatCurrency(item.amount)}</span>
                        <button className="vl-btn-icon danger" onClick={() => handleRemoveOtherIncome(i)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="vl-expense-add-row" style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      value={otherLabel}
                      onChange={e => setOtherLabel(e.target.value)}
                      placeholder="Diger kazanc kalemi adi"
                    />
                    <input
                      type="number"
                      value={otherAmount}
                      onChange={e => setOtherAmount(e.target.value)}
                      placeholder="Tutar"
                      style={{ maxWidth: '120px' }}
                      min="0"
                    />
                    <button className="vl-btn vl-btn-secondary vl-btn-sm" onClick={handleAddOtherIncome}>
                      <Plus size={14} /> Ekle
                    </button>
                  </div>

                  <hr className="vl-settlement-divider" />

                  <div className="vl-settlement-total">
                    <span>TOPLAM KAZANC</span>
                    <span className="amount" style={{ color: '#10b981' }}>{formatCurrency(calculations.totalRevenue)}</span>
                  </div>
                </div>

                {/* Expenses summary */}
                <div className="vl-settlement-section">
                  <div className="vl-settlement-section-title">Masraf Kalemleri (Mevcut)</div>
                  {caseData.expenses.map(exp => (
                    <div className="vl-settlement-row" key={exp.id}>
                      <label>{exp.label}</label>
                      <span className="amount negative">{formatCurrency(exp.amount)}</span>
                    </div>
                  ))}
                  {caseData.expenses.length === 0 && (
                    <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Masraf kaydedilmemis.</p>
                  )}
                  <div className="vl-settlement-total">
                    <span>TOPLAM MASRAF</span>
                    <span className="amount" style={{ color: '#ef4444' }}>{formatCurrency(calculations.totalExpenses)}</span>
                  </div>
                </div>

                {/* Net Profit Preview */}
                <div className="vl-settlement-section">
                  <div className="vl-settlement-total" style={{ borderTop: '4px double #0f172a', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '1.15rem' }}>NET KAZANC</span>
                    <span className="amount" style={{ fontSize: '1.4rem', color: calculations.netProfit >= 0 ? '#10b981' : '#ef4444' }}>
                      {formatCurrency(calculations.netProfit)}
                    </span>
                  </div>
                </div>

                {/* Split Preview */}
                <div className="vl-settlement-split">
                  <div className="vl-settlement-split-title">Kazanc Paylasimi Onizleme (%50 - %50)</div>
                  <div className="vl-split-row">
                    <label>Sistem Sahibi Payi (%50)</label>
                    <span className="amount">{formatCurrency(calculations.ownerShare)}</span>
                  </div>
                  <div className="vl-split-row">
                    <label>Avukat Payi (%50) {lawyer ? `- Av. ${lawyer.fullName}` : ''}</label>
                    <span className="amount">{formatCurrency(calculations.lawyerShare)}</span>
                  </div>
                </div>

                {/* Client Payment Preview */}
                <div className="vl-client-payment">
                  <div className="vl-client-payment-title">Magdura Odenecek Tutar</div>
                  <div className="vl-client-payment-amount">{formatCurrency(calculations.clientPayment)}</div>
                  <div className="vl-client-payment-iban">
                    IBAN: {caseData.client?.iban || 'Belirtilmedi'}
                  </div>
                </div>

                {/* Settle Button */}
                <button
                  className="vl-btn vl-btn-warning vl-btn-full"
                  style={{ marginTop: '1.5rem', fontSize: '1.05rem' }}
                  onClick={handleSettleCase}
                >
                  <Archive size={20} />
                  Dosyayi Kapat ve Hesaplamayi Onayla
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
