import { useParking } from "../context/ParkingContext";

export default function Settings() {
  const { resetData } = useParking();

  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">SYSTEM</p>
          <h3>Settings</h3>
          <p className="muted">Facility configuration and system actions.</p>
        </div>
      </section>

      <div className="glass-card">
        <div className="card-header">
          <div>
            <p className="card-eyebrow">FACILITY</p>
            <h3>ParkFlow Demo Facility</h3>
          </div>
        </div>
        <div className="details-list">
          <div className="detail-row"><span>Floors</span><strong>2</strong></div>
          <div className="detail-row"><span>Spaces per floor</span><strong>12</strong></div>
          <div className="detail-row"><span>Timezone</span><strong>Asia/Manila</strong></div>
          <div className="detail-row"><span>Currency</span><strong>PHP (₱)</strong></div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <div>
            <p className="card-eyebrow">DANGER ZONE</p>
            <h3>Reset Data</h3>
          </div>
        </div>
        <p className="muted" style={{ marginBottom: 12 }}>
          Clears all sessions, reservations, and payments. Returns to demo seed data.
        </p>
        <button
          className="primary-button"
          onClick={() => {
            if (window.confirm("Reset all data?")) resetData();
          }}
        >
          Reset All Data
        </button>
      </div>
    </>
  );
}