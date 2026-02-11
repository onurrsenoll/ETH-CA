import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { INSURANCE_TYPES, formatCurrency } from '../utils/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

export function ProductionBarChart({ summary }) {
  const data = {
    labels: INSURANCE_TYPES.map(t => t.label),
    datasets: [
      {
        label: 'Cari Prim',
        data: INSURANCE_TYPES.map(t => summary[t.key]?.currentPremium || 0),
        backgroundColor: INSURANCE_TYPES.map(t => t.color + 'cc'),
        borderColor: INSURANCE_TYPES.map(t => t.color),
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Hedef Prim',
        data: INSURANCE_TYPES.map(t => summary[t.key]?.targetPremium || 0),
        backgroundColor: INSURANCE_TYPES.map(t => t.color + '44'),
        borderColor: INSURANCE_TYPES.map(t => t.color),
        borderWidth: 1,
        borderRadius: 4,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => {
            if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
            if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
            return val;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Branş Bazlı Üretim ve Hedef Karşılaştırması</h3>
      <div style={{ height: 300 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export function ProductionDoughnutChart({ summary }) {
  const data = {
    labels: INSURANCE_TYPES.map(t => t.label),
    datasets: [
      {
        data: INSURANCE_TYPES.map(t => summary[t.key]?.currentPremium || 0),
        backgroundColor: INSURANCE_TYPES.map(t => t.color + 'cc'),
        borderColor: INSURANCE_TYPES.map(t => t.color),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { padding: 12, usePointStyle: true },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
            return `${ctx.label}: ${formatCurrency(ctx.raw)} (%${pct})`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Prim Dağılımı</h3>
      <div style={{ height: 300 }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export function PolicyCountBarChart({ summary }) {
  const data = {
    labels: INSURANCE_TYPES.map(t => t.label),
    datasets: [
      {
        label: 'Poliçe Adet',
        data: INSURANCE_TYPES.map(t => summary[t.key]?.currentPolicyCount || 0),
        backgroundColor: '#3b82f6cc',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Hedef Adet',
        data: INSURANCE_TYPES.map(t => summary[t.key]?.targetPolicyCount || 0),
        backgroundColor: '#3b82f644',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Poliçe Adet Karşılaştırması</h3>
      <div style={{ height: 300 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
