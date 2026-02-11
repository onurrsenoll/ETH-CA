import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import MetricCard from '../components/MetricCard';
import ProductionTable from '../components/ProductionTable';
import { ProductionBarChart, ProductionDoughnutChart, PolicyCountBarChart } from '../components/Charts';
import { calculateBranchSummary, calculateTotals, filterProductionsByPeriod } from '../utils/calculations';
import { PERIOD_FILTERS, STEPS, formatCurrency, formatPercent } from '../utils/constants';

export default function Dashboard() {
  const { branches, productions, targets, settings } = useApp();
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [period, setPeriod] = useState('yearly');

  const filteredProductions = useMemo(
    () => filterProductionsByPeriod(productions, period),
    [productions, period]
  );

  const summary = useMemo(
    () => calculateBranchSummary(filteredProductions, selectedBranch, targets, settings.currentStep),
    [filteredProductions, selectedBranch, targets, settings.currentStep]
  );

  const totals = useMemo(() => calculateTotals(summary), [summary]);

  const currentYear = new Date().getFullYear();
  const prevYear = currentYear - 1;

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h2 className="page-title">Satışlarım & Hedeflerim</h2>
          <p className="page-subtitle">
            {settings.companyName} - {currentYear} Üretim Takip Paneli
          </p>
        </div>
        <div className="page-header-actions">
          <select
            className="select-input"
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
          >
            <option value="all">Tüm Şubeler</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} {b.isMain ? '(Merkez)' : ''}
              </option>
            ))}
          </select>

          <div className="period-tabs">
            {PERIOD_FILTERS.map(p => (
              <button
                key={p.key}
                className={`period-tab ${period === p.key ? 'active' : ''}`}
                onClick={() => setPeriod(p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="metric-cards-grid">
        <MetricCard
          title={`${currentYear} Toplam Prim`}
          value={totals.totalCurrentPremium}
          subtitle={`Hedef: ${formatCurrency(totals.totalTargetPremium)}`}
          percentage={totals.overallAchievementRate}
          color="#1e3a8a"
        />
        <MetricCard
          title={`${prevYear} Toplam Prim`}
          value={totals.totalPrevPremium}
          subtitle={`Değişim: ${formatPercent(totals.overallChangeRate)}`}
          color="#6b7280"
        />
        <MetricCard
          title="Trafik Primi"
          value={summary.trafik?.currentPremium || 0}
          subtitle={`Hedef: ${formatCurrency(summary.trafik?.targetPremium || 0)}`}
          percentage={summary.trafik?.premiumAchievementRate}
          color="#3b82f6"
        />
        <MetricCard
          title="Trafik Oranı"
          value={totals.trafikRate}
          isCurrency={false}
          percentage={totals.trafikRate}
          color="#10b981"
        />
        <MetricCard
          title="Trafik Dışı Oto Oranı"
          value={totals.trafikDisiOtoRate}
          isCurrency={false}
          percentage={totals.trafikDisiOtoRate}
          color="#8b5cf6"
        />
        <MetricCard
          title="Genel Gerçekleşme"
          value={totals.overallAchievementRate}
          isCurrency={false}
          subtitle={`Basamak ${settings.currentStep}`}
          percentage={totals.overallAchievementRate}
          color={totals.overallAchievementRate >= 100 ? '#10b981' : '#f59e0b'}
        />
      </div>

      <ProductionTable summary={summary} totals={totals} />

      <div className="charts-grid">
        <ProductionBarChart summary={summary} />
        <ProductionDoughnutChart summary={summary} />
      </div>

      <div className="charts-grid single">
        <PolicyCountBarChart summary={summary} />
      </div>
    </div>
  );
}
