import CircularProgress from './CircularProgress';
import { formatCurrency, formatPercent } from '../utils/constants';

export default function MetricCard({ title, value, subtitle, percentage, color, isCurrency = true }) {
  return (
    <div className="metric-card">
      <div className="metric-card-content">
        <div className="metric-card-info">
          <p className="metric-card-title">{title}</p>
          <p className="metric-card-value">
            {isCurrency ? formatCurrency(value) : formatPercent(value)}
          </p>
          {subtitle && <p className="metric-card-subtitle">{subtitle}</p>}
        </div>
        {percentage != null && (
          <div className="metric-card-gauge">
            <CircularProgress value={percentage} size={70} strokeWidth={7} color={color} />
          </div>
        )}
      </div>
    </div>
  );
}
