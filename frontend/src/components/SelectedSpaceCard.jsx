import { useParking } from "../context/ParkingContext";
import DetailRow from "./DetailRow";

export default function SelectedSpaceCard({ slotId, onRecordPayment }) {
  const {
    slots,
    reservations,
    endSession,
    convertReservation,
    startSession,
  } = useParking();

  const slot = slots.find((s) => s.id === slotId);
  if (!slot) return null;

  const reservation =
    slot.status === "reserved"
      ? reservations.find(
          (r) => r.slotId === slot.id && r.status === "active"
        )
      : null;

  return (
    <div className="glass-card selected-card">
      <div className="card-header">
        <div>
          <p className="card-eyebrow">SELECTED SPACE</p>
          <h3>{slot.id}</h3>
        </div>
        <span className={`status-pill ${slot.status}`}>{slot.status}</span>
      </div>

      <div className={`slot-preview ${slot.status}`}>
        <div className="car-placeholder">
          {slot.status === "occupied" ? "🚗" : slot.status === "reserved" ? "◷" : "P"}
        </div>
        <div className="slot-preview-info">
          <span className="preview-label">{slot.type} Space · {slot.floor}</span>
          {slot.plate ? (
            <span className="plate-badge">{slot.plate}</span>
          ) : (
            <strong>Ready for a vehicle</strong>
          )}
        </div>
      </div>

      <div className="details-list">
        <DetailRow label="Space ID" value={slot.id} />
        <DetailRow label="Type" value={slot.type} />
        <DetailRow label="License Plate" value={slot.plate || "—"} />
        <DetailRow label="Duration" value={slot.duration || "—"} />
      </div>

      {slot.status === "occupied" && (
        <div className="action-stack">
          <button
            className="secondary-button"
            onClick={() => endSession(slot.id)}
          >
            End Session<span>✓</span>
          </button>
          <button
            className="secondary-button"
            onClick={() => onRecordPayment(slot.id)}
          >
            Record Payment<span>₱</span>
          </button>
        </div>
      )}

      {slot.status === "available" && (
        <button
          className="secondary-button"
          onClick={() => startSession({ slotId: slot.id, plate: "WALK-IN" })}
        >
          Assign Vehicle<span>→</span>
        </button>
      )}

      {slot.status === "reserved" && reservation && (
        <div className="action-stack">
          <button
            className="secondary-button"
            onClick={() => convertReservation(reservation.id)}
          >
            Convert to Session<span>↗</span>
          </button>
        </div>
      )}
    </div>
  );
}