import { useParking } from "../context/ParkingContext";

export default function Vehicles() {
  const { slots } = useParking();
  const vehicles = slots.filter((s) => s.plate);

  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">REGISTRY</p>
          <h3>Vehicles</h3>
          <p className="muted">
            {vehicles.length} vehicle{vehicles.length === 1 ? "" : "s"} currently tracked.
          </p>
        </div>
      </section>

      <div className="glass-card">
        <div className="card-header">
          <div>
            <p className="card-eyebrow">ACTIVE</p>
            <h3>Parked &amp; Reserved</h3>
          </div>
        </div>

        {vehicles.length === 0 ? (
          <p className="muted">No vehicles yet. Start a session from the dashboard.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Plate</th>
                <th>Slot</th>
                <th>Type</th>
                <th>Floor</th>
                <th>Status</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td><strong>{v.plate}</strong></td>
                  <td>{v.id}</td>
                  <td>{v.type}</td>
                  <td>{v.floor}</td>
                  <td>
                    <span className={`status-pill ${v.status}`}>{v.status}</span>
                  </td>
                  <td>{v.duration || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}