import { useParking } from "../context/ParkingContext";

export default function Reports() {
  const { stats, revenue, payments, reservations } = useParking();

  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">ANALYTICS</p>
          <h3>Reports</h3>
          <p className="muted">Summary of today's operations.</p>
        </div>
      </section>

      <section className="stats-grid">
        <div className="glass-card stat-card blue">
          <p>Total Spaces</p>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="glass-card stat-card green">
          <p>Available</p>
          <div className="stat-value">{stats.available}</div>
        </div>
        <div className="glass-card stat-card orange">
          <p>Occupied</p>
          <div className="stat-value">{stats.occupied}</div>
        </div>
        <div className="glass-card stat-card purple">
          <p>Revenue</p>
          <div className="stat-value">
            ₱{revenue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </section>

      <div className="glass-card">
        <div className="card-header">
          <div>
            <p className="card-eyebrow">SUMMARY</p>
            <h3>Operational Metrics</h3>
          </div>
        </div>

        <div className="details-list">
          <div className="detail-row"><span>Occupancy Rate</span><strong>{Math.round((stats.occupied / stats.total) * 100)}%</strong></div>
          <div className="detail-row"><span>Total Reservations</span><strong>{reservations.length}</strong></div>
          <div className="detail-row"><span>Total Payments</span><strong>{payments.length}</strong></div>
          <div className="detail-row"><span>Average Payment</span><strong>₱{payments.length ? (revenue / payments.length).toFixed(2) : "0.00"}</strong></div>
        </div>
      </div>
    </>
  );
}