// `progress` (0-100) is optional: when given, a thin bar is drawn under the value.
export default function StatCard({ title, value, change, description, icon, className, progress }) {
  return (
    <div className={`glass-card stat-card ${className}`}>
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>
        <span className="stat-change">{change}</span>
      </div>
      <p>{title}</p>
      <div className="stat-value">{value}</div>
      {typeof progress === "number" && (
        <div className="stat-progress" aria-hidden="true">
          <div style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
        </div>
      )}
      <span className="stat-description">{description}</span>
    </div>
  );
}