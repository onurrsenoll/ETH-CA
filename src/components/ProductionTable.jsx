import { INSURANCE_TYPES, formatCurrency, formatNumber, formatPercent } from '../utils/constants';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function ChangeIndicator({ value }) {
  if (value > 0) return <span className="change-positive"><TrendingUp size={14} /> {formatPercent(value)}</span>;
  if (value < 0) return <span className="change-negative"><TrendingDown size={14} /> {formatPercent(value)}</span>;
  return <span className="change-neutral"><Minus size={14} /> %0</span>;
}

function ProgressBar({ value, color }) {
  const clamped = Math.min(Math.max(value || 0, 0), 100);
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
      <span className="progress-bar-text">{formatPercent(value)}</span>
    </div>
  );
}

export default function ProductionTable({ summary, totals }) {
  return (
    <div className="production-table-wrapper">
      <table className="production-table">
        <thead>
          <tr>
            <th>Branş</th>
            <th className="text-right">Cari Prim</th>
            <th className="text-right">Poliçe Adet</th>
            <th className="text-right">Önceki Dönem</th>
            <th className="text-center">Değişim</th>
            <th className="text-right">Hedef Prim</th>
            <th className="text-right">Hedef Adet</th>
            <th className="text-center" style={{ minWidth: 140 }}>Gerçekleşme</th>
          </tr>
        </thead>
        <tbody>
          {INSURANCE_TYPES.map(type => {
            const s = summary[type.key];
            if (!s) return null;
            return (
              <tr key={type.key}>
                <td>
                  <div className="branch-cell">
                    <span className="branch-dot" style={{ backgroundColor: type.color }} />
                    {type.label}
                  </div>
                </td>
                <td className="text-right font-semibold">{formatCurrency(s.currentPremium)}</td>
                <td className="text-right">{formatNumber(s.currentPolicyCount)}</td>
                <td className="text-right text-muted">{formatCurrency(s.prevPremium)}</td>
                <td className="text-center"><ChangeIndicator value={s.premiumChangeRate} /></td>
                <td className="text-right">{formatCurrency(s.targetPremium)}</td>
                <td className="text-right">{formatNumber(s.targetPolicyCount)}</td>
                <td className="text-center">
                  <ProgressBar value={s.premiumAchievementRate} color={type.color} />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="total-row">
            <td><strong>TOPLAM</strong></td>
            <td className="text-right font-semibold">{formatCurrency(totals.totalCurrentPremium)}</td>
            <td className="text-right">{formatNumber(totals.totalCurrentPolicyCount)}</td>
            <td className="text-right text-muted">{formatCurrency(totals.totalPrevPremium)}</td>
            <td className="text-center"><ChangeIndicator value={totals.overallChangeRate} /></td>
            <td className="text-right">{formatCurrency(totals.totalTargetPremium)}</td>
            <td className="text-right">{formatNumber(totals.totalTargetPolicyCount)}</td>
            <td className="text-center">
              <ProgressBar value={totals.overallAchievementRate} color="#1e3a8a" />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
