export function StatCard({ icon: Icon, label, value, change, color = 'primary', delay = 0 }) {
  return (
    <div className={`stat-card stat-${color} animate-in`} style={{ animationDelay: `${delay}ms` }}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {change && <span className={`stat-change ${change.startsWith('+') ? 'up' : 'down'}`}>{change}</span>}
      </div>
    </div>
  );
}
