import { useApp } from '../context/AppContext';
import {
  Eye, Shield, ShieldAlert, ShieldX, AlertTriangle, Skull
} from 'lucide-react';

const severityConfig = {
  none: { icon: Shield, className: 'severity-none' },
  mild: { icon: Eye, className: 'severity-mild' },
  moderate: { icon: AlertTriangle, className: 'severity-moderate' },
  severe: { icon: ShieldAlert, className: 'severity-severe' },
  proliferative: { icon: Skull, className: 'severity-proliferative' },
};

export default function SeverityBadge({ severity, size = 'md' }) {
  const { t } = useApp();
  const config = severityConfig[severity] || severityConfig.none;
  const Icon = config.icon;
  const iconSize = size === 'lg' ? 18 : 14;

  return (
    <span className={`severity-badge ${config.className} ${size === 'lg' ? 'severity-badge-lg' : ''}`}>
      <Icon size={iconSize} />
      {t(`severity.${severity}`)}
    </span>
  );
}
