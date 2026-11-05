import { useState } from "react";
import { useParking } from "../context/ParkingContext";

export default function NewSessionForm({ onDone }) {
  const { slots, startSession } = useParking();
  const availableSlots = slots.filter((s) => s.status === "available");

  const [plate, setPlate] = useState("");
  const [slotId, setSlotId] = useState(availableSlots[0]?.id || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = plate.trim().toUpperCase();
    if (!trimmed) return setError("Plate number is required.");
    if (!slotId) return setError("Please select a slot.");

    startSession({ slotId, plate: trimmed, duration: "just now" });
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
          onChange={(e) => { setPlate(e.target.value); setError(""); }}
          autoFocus
        />
      </label>

      <label>
        <span>Assign to Slot</span>
        <select value={slotId} onChange={(e) => setSlotId(e.target.value)}>
          {availableSlots.length === 0 && <option value="">No available slots</option>}
          {availableSlots.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} — {s.type} ({s.floor})
            </option>
          ))}
        </select>
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="ghost-button" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="primary-button">
          Start Session
        </button>
      </div>
    </form>
  );
}