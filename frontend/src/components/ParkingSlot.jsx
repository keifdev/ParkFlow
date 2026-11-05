const ICONS = { available: "P", occupied: "🚗", reserved: "◷" };

export default function ParkingSlot({ slot, selected, onClick }) {
  const taken = slot.status !== "available";

  return (
    <button
      type="button"
      className={`parking-slot ${slot.status} ${selected ? "selected" : ""}`}
      onClick={() => onClick(slot)}
      aria-label={`Space ${slot.id}, ${slot.status}`}
      aria-pressed={selected}
    >
      <span className="slot-number">{slot.id}</span>
      {slot.type && <span className="slot-type">{slot.type}</span>}

      <span className="slot-icon">{ICONS[slot.status] || "P"}</span>

      <span className="slot-plate">{taken ? slot.plate || "—" : "Open"}</span>

      <span className="slot-status">
        {slot.status === "occupied" && slot.duration ? slot.duration : slot.status}
      </span>
    </button>
  );
}