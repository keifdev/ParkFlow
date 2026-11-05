export default function Legend({ color, label }) {
  return (
    <div className="legend-item">
      <span className={`legend-dot ${color}`} />
      {label}
    </div>
  );
}