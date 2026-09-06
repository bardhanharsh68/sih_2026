export default function ConfidenceGauge({ value, size = 140 }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (v) => {
    if (v >= 90) return 'var(--accent-safe)';
    if (v >= 75) return 'var(--accent-primary)';
    if (v >= 60) return 'var(--accent-caution)';
    return 'var(--accent-alert)';
  };

  return (
    <div className="confidence-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="bg-ring"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className="fg-ring"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(value)}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="confidence-value">
        <span className="confidence-number" style={{ color: getColor(value) }}>
          {value}%
        </span>
        <span className="confidence-label">confidence</span>
      </div>
    </div>
  );
}
