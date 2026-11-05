import { useParking } from "../context/ParkingContext";

export default function ParkingSessions() {
  const { slots, endSession } = useParking();
  const sessions = slots.filter((s) => s.status === "occupied");

  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">OPERATIONS</p>
          <h3>Parking Sessions</h3>
          <p className="muted">
            {sessions.length} active session{sessions.length === 1 ? "" : "s"}.
          </p>
        </div>
      </section>

      <div className="glass-card">
        <div className="card-header">
          <div>
            <p className="card-eyebrow">ACTIVE SESSIONS</p>
            <h3>Currently Parked</h3>
          </div>
        </div>

        {sessions.length === 0 ? (
          <p className="muted">No active sessions.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Slot</th>
                <th>Plate</th>
                <th>Type</th>
                <th>Duration</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.id}</strong></td>
                  <td>{s.plate || "—"}</td>
                  <td>{s.type}</td>
                  <td>{s.duration || "—"}</td>
                  <td>
                    <button
                      className="table-action"
                      onClick={() => endSession(s.id)}
                    >
                      End Session
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}