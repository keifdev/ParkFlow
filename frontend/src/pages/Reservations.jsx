import { useParking } from "../context/ParkingContext";

export default function Reservations() {
  const { reservations, convertReservation, cancelReservation } = useParking();
  const active = reservations.filter((r) => r.status === "active");

  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">BOOKINGS</p>
          <h3>Reservations</h3>
          <p className="muted">
            {active.length} active reservation{active.length === 1 ? "" : "s"}.
          </p>
        </div>
      </section>

      <div className="glass-card">
        <div className="card-header">
          <div>
            <p className="card-eyebrow">ALL RESERVATIONS</p>
            <h3>Booking History</h3>
          </div>
        </div>

        {reservations.length === 0 ? (
          <p className="muted">No reservations yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Slot</th>
                <th>Plate</th>
                <th>Reserved For</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.slotId}</strong></td>
                  <td>{r.plate}</td>
                  <td>{new Date(r.reservedFor).toLocaleString()}</td>
                  <td>
                    <span className={`status-pill ${r.status === "active" ? "reserved" : "available"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="table-actions-cell">
                    {r.status === "active" && (
                      <>
                        <button
                          className="table-action"
                          onClick={() => convertReservation(r.id)}
                        >
                          Check In
                        </button>
                        <button
                          className="table-action danger"
                          onClick={() => cancelReservation(r.id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
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