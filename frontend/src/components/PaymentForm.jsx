import { useState } from "react";
import { useParking } from "../context/ParkingContext";

const METHODS = ["Cash", "Card", "GCash", "Maya"];

export default function PaymentForm({ onDone, presetSlotId }) {
  const { slots, recordPayment } = useParking();

  // Only occupied slots can be paid (someone's actually parked there)
  const occupiedSlots = slots.filter((s) => s.status === "occupied");

  const initialSlot = presetSlotId
    ? occupiedSlots.find((s) => s.id === presetSlotId)
    : occupiedSlots[0];

  const [slotId, setSlotId] = useState(initialSlot?.id || "");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [error, setError] = useState("");

  const selectedSlot = occupiedSlots.find((s) => s.id === slotId);

  const handleSubmit = (e) => {
    e.preventDefault();

    const num = Number(amount);
    if (!slotId) return setError("Please select a slot.");
    if (!Number.isFinite(num) || num <= 0)
      return setError("Amount must be a positive number.");

    recordPayment({
      slotId,
      plate: selectedSlot?.plate || "—",
      amount: num,
      method,
    });
    onDone();
  };

  return (
    <form className="session-form" onSubmit={handleSubmit}>
      <label>
        <span>Slot (Occupied Only)</span>
        <select value={slotId} onChange={(e) => setSlotId(e.target.value)}>
          {occupiedSlots.length === 0 && (
            <option value="">No occupied slots</option>
          )}
          {occupiedSlots.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} — {s.plate || "unregistered"} ({s.duration})
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Amount (₱)</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          placeholder="e.g. 120"
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
          }}
          autoFocus
        />
      </label>

      <label>
        <span>Payment Method</span>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
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
          Record Payment
        </button>
      </div>
    </form>
  );
}