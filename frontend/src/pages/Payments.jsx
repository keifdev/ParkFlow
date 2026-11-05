import { useParking } from "../context/ParkingContext";

export default function Payments() {
  const { payments, revenue } = useParking();

  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">FINANCE</p>
          <h3>Payments</h3>
          <p className="muted">
            {payments.length} transaction{payments.length === 1 ? "" : "s"} · Total ₱
            {revenue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </section>

      <div className="glass-card">
        <div className="card-header">
          <div>
            <p className="card-eyebrow">LEDGER</p>
            <h3>Transaction History</h3>
          </div>
        </div>

        {payments.length === 0 ? (
          <p className="muted">No payments recorded yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Plate</th>
                <th>Slot</th>
                <th>Amount</th>
                <th>Method</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.plate}</strong></td>
                  <td>{p.slotId}</td>
                  <td>₱{p.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                  <td>{p.method}</td>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}