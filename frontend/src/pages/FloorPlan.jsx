import { useState } from "react";
import { useParking } from "../context/ParkingContext";
import Legend from "../components/Legend";
import FloorGrid from "../components/FloorGrid";
import SelectedSpaceCard from "../components/SelectedSpaceCard";
import Modal from "../components/Modal";
import PaymentForm from "../components/PaymentForm";

export default function FloorPlan() {
  const { slots, stats } = useParking();

  const [floor, setFloor] = useState("Floor 1");
  const [selectedSlotId, setSelectedSlotId] = useState(slots[1]?.id);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentSlot, setPaymentSlot] = useState(null);

  const visibleSlots = slots.filter((s) => s.floor === floor);
  const occupancyPercentage = stats.total
    ? Math.round((stats.occupied / stats.total) * 100)
    : 0;

  const openPayment = (slotId) => {
    setPaymentSlot(slotId);
    setPaymentOpen(true);
  };

  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">OPERATIONS</p>
          <h3>Live Floor Plan</h3>
          <p className="muted">
            Click any space to inspect it, start or end sessions, or record payments.
          </p>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="glass-card floor-card">
          <div className="card-header">
            <div>
              <p className="card-eyebrow">LIVE OCCUPANCY</p>
              <h3>Parking Floor Plan</h3>
            </div>
            <div className="floor-controls">
              <button
                className={`floor-button ${floor === "Floor 1" ? "selected" : ""}`}
                onClick={() => setFloor("Floor 1")}
              >
                Floor 1
              </button>
              <button
                className={`floor-button ${floor === "Floor 2" ? "selected" : ""}`}
                onClick={() => setFloor("Floor 2")}
              >
                Floor 2
              </button>
            </div>
          </div>

          <div className="floor-summary">
            <div className="legend">
              <Legend color="available" label="Available" />
              <Legend color="occupied" label="Occupied" />
              <Legend color="reserved" label="Reserved" />
            </div>
            <div className="occupancy-label">
              <strong>{occupancyPercentage}%</strong>
              <span>occupied</span>
            </div>
          </div>

          <FloorGrid
            slots={visibleSlots}
            selectedId={selectedSlotId}
            onSelect={setSelectedSlotId}
          />

          <div className="floor-footer">
            <span>
              Showing <strong>{visibleSlots.length}</strong> parking spaces
            </span>
            <span className="live-indicator">
              <span />
              Live data
            </span>
          </div>
        </div>

        <div className="right-column">
          <SelectedSpaceCard
            slotId={selectedSlotId}
            onRecordPayment={openPayment}
          />
        </div>
      </section>

      <Modal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        title="Record Payment"
      >
        <PaymentForm
          onDone={() => setPaymentOpen(false)}
          presetSlotId={paymentSlot}
        />
      </Modal>
    </>
  );
}