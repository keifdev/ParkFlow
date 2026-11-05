import { useState } from "react";
import { useParking } from "../context/ParkingContext";

export default function ReserveForm({ onDone, presetSlotId }) {
  const { slots, reserveSlot } = useParking();

  // Available slots only (can't reserve occupied or already-reserved)
  const availableSlots = slots.filter((s) => s.status === "available");

  const [plate, setPlate] = useState("");
  const [slotId, setSlotId] = useState(
    presetSlotId || availableSlots[0]?.id || ""
  );
  const [reservedFor, setReservedFor] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = plate.trim().toUpperCase();
    if (!trimmed) return setError("Plate number is required.");
    if (!slotId) return setError("Please select a slot.");
    if (!reservedFor) return setError("Please pick a reservation time.");

    reserveSlot({
      slotId,
      plate: trimmed,
      reservedFor,
    });
    onDone();
  };

  return (
    <form className="session-form" onSubmit={handleSubmit}>
      <label>
        <span>License Plate</span>
        <input
          type="text"
          value={plate}
          placeholder="e.g. ABC 1234"
          onChange={(e) => {
            setPlate(e.target.value);
            setError("");
          }}
          autoFocus
        />
      </label>

      <label>
        <span>Reserve Slot</span>
        <select value={slotId} onChange={(e) => setSlotId(e.target.value)}>
          {availableSlots.length === 0 && (
            <option value="">No available slots</option>
          )}
          {availableSlots.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} — {s.type} ({s.floor})
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Reserved For</span>
        <input
          type="datetime-local"
          value={reservedFor}
          onChange={(e) => {
            setReservedFor(e.target.value);
            setError("");
          }}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="ghost-button" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="primary-button">
          Create Reservation
        </button>
      </div>
    </form>
  );
}