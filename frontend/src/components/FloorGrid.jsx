import ParkingSlot from "./ParkingSlot";

const PER_ROW = 4;

export default function FloorGrid({ slots, selectedId, onSelect }) {
  // Split into rows of 4 so any number of spaces per floor works
  const rows = [];
  for (let i = 0; i < slots.length; i += PER_ROW) rows.push(slots.slice(i, i + PER_ROW));

  return (
    <div className="parking-layout">
      <div className="entrance">
        <span>▼ ENTRANCE</span>
        <div className="entrance-line" />
      </div>

      {rows.map((row, i) => (
        <div key={i} className="lot-block">
          <div className="parking-row">
            {row.map((slot) => (
              <ParkingSlot
                key={slot.id}
                slot={slot}
                selected={selectedId === slot.id}
                onClick={(s) => onSelect(s.id)}
              />
            ))}
          </div>

          {i < rows.length - 1 && (
            <div className="driveway">
              <div className="arrow">→</div>
              <span>DRIVEWAY</span>
              <div className="arrow">→</div>
            </div>
          )}
        </div>
      ))}

      <div className="exit">
        <div className="exit-line" />
        <span>EXIT ▲</span>
      </div>
    </div>
  );
}