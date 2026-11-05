import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useParking } from "../context/ParkingContext";
import StatCard from "../components/StatCard";
import Legend from "../components/Legend";
import FloorGrid from "../components/FloorGrid";
import SelectedSpaceCard from "../components/SelectedSpaceCard";
import Modal from "../components/Modal";
import NewSessionForm from "../components/NewSessionForm";
import ReserveForm from "../components/ReserveForm";
import PaymentForm from "../components/PaymentForm";

const peso = (n) =>
  `₱${Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ---------- chart pieces (heights are % so the chart fills its card) ---------- */

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="dz-chart" role="img" aria-label="Revenue for the last 7 days">
      {data.map((d) => {
        const h = d.value > 0 ? Math.max(4, (d.value / max) * 86) : 2;
        return (
          <div key={d.key} className={`dz-col ${d.today ? "today" : ""}`}>
            <div className="dz-plot">
              {d.value > 0 && (
                <span className="dz-val" style={{ bottom: `calc(${h}% + 4px)` }}>
                  {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
                </span>
              )}
              <div className="dz-bar" style={{ height: `${h}%` }} />
            </div>
            <span className="dz-label">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function Ring({ parts, size = 120, stroke = 14, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = parts.reduce((a, p) => a + p.value, 0) || 1;
  let offset = 0;
  return (
    <div className="pf-ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        {parts.map((p) => {
          const len = (p.value / total) * c;
          const el = (
            <circle
              key={p.label} cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke={p.color} strokeWidth={stroke}
              strokeDasharray={`${Math.max(len - 2, 0)} ${c}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="pf-ring-center">{children}</div>
    </div>
  );
}

/* ---------- page ---------- */

export default function Dashboard() {
  const { slots, activity, stats, revenue, payments = [] } = useParking();

  const [selectedSlotId, setSelectedSlotId] = useState(slots[1]?.id);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentSlot, setPaymentSlot] = useState(null);

  // Floor switching lives on /floor-plan; the dashboard previews Floor 1
  const previewSlots = slots.filter((s) => s.floor === "Floor 1");

  const pct = (n) => (stats.total ? Math.round((n / stats.total) * 100) : 0);
  const occupancyPercentage = pct(stats.occupied);
  const floorCount = new Set(slots.map((s) => s.floor)).size;

  const openPayment = (slotId) => {
    setPaymentSlot(slotId);
    setPaymentOpen(true);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Revenue for the last 7 days, from real payments
  const { week, todayTotal, yesterdayTotal, weekTotal } = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { key: d.toDateString(), label: d.toLocaleDateString("en-US", { weekday: "short" }), value: 0, today: i === 6 };
    });
    payments.forEach((p) => {
      const day = days.find((d) => d.key === new Date(p.createdAt).toDateString());
      if (day) day.value += Number(p.amount) || 0;
    });
    return {
      week: days,
      todayTotal: days[6].value,
      yesterdayTotal: days[5].value,
      weekTotal: days.reduce((a, d) => a + d.value, 0),
    };
  }, [payments]);

  const revenueChange = yesterdayTotal
    ? `${todayTotal >= yesterdayTotal ? "+" : ""}${Math.round(((todayTotal - yesterdayTotal) / yesterdayTotal) * 100)}%`
    : todayTotal ? "New" : "—";

  const avgPayment = payments.length ? revenue / payments.length : 0;

  return (
    <div className="dz">
      {/* Header strip */}
      <section className="welcome-row dz-head">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h3>{greeting}, <span>Admin.</span></h3>
          <p className="muted">{stats.occupied} of {stats.total} spaces are in use right now.</p>
        </div>
        <div className="dz-actions">
          <button className="ghost-button" onClick={() => setReserveOpen(true)}>□ Reservation</button>
          <button className="ghost-button" onClick={() => setPaymentOpen(true)}>₱ Record Payment</button>
          <button className="primary-button" onClick={() => setSessionOpen(true)}>
            <span>＋</span> New Parking Session
          </button>
        </div>
      </section>

      {/* KPI row */}
      <section className="stats-grid dz-stats">
        <StatCard title="Total Spaces" value={stats.total} change={`${floorCount} floor${floorCount === 1 ? "" : "s"}`} description="Parking capacity" icon="⌗" className="blue" />
        <StatCard title="Available" value={stats.available} change={`${pct(stats.available)}%`} description="Spaces available" icon="✓" className="green" progress={pct(stats.available)} />
        <StatCard title="Occupied" value={stats.occupied} change={`${occupancyPercentage}%`} description="Currently parked" icon="▣" className="orange" progress={occupancyPercentage} />
        <StatCard title="Today's Revenue" value={peso(todayTotal)} change={revenueChange} description="vs. yesterday" icon="₱" className="purple" />
      </section>

      {/* Three columns: floor | revenue + capacity | selected space + activity */}
      <section className="dz-body">
        <div className="glass-card floor-card dz-floor">
          <div className="card-header">
            <div>
              <p className="card-eyebrow">LIVE FLOOR</p>
              <h3>Floor 1</h3>
            </div>
            <Link to="/floor-plan" className="text-button">Open full floor plan →</Link>
          </div>
          <div className="pf-floor-toolbar">
            <div className="legend">
              <Legend color="available" label="Available" />
              <Legend color="occupied" label="Occupied" />
              <Legend color="reserved" label="Reserved" />
            </div>
            <span className="live-indicator"><span />Live data</span>
          </div>
          <div className="dz-map">
            <FloorGrid slots={previewSlots} selectedId={selectedSlotId} onSelect={setSelectedSlotId} />
          </div>
        </div>

        <div className="dz-col-mid">
          <div className="glass-card dz-revenue">
            <div className="card-header">
              <div>
                <p className="card-eyebrow">REVENUE</p>
                <h3>Last 7 days</h3>
              </div>
              <div className="pf-kpis">
                <div><small>Week total</small><strong>{peso(weekTotal)}</strong></div>
                <div><small>Avg. payment</small><strong>{peso(avgPayment)}</strong></div>
              </div>
            </div>
            <BarChart data={week} />
          </div>

          <div className="glass-card dz-capacity">
            <div className="card-header">
              <div>
                <p className="card-eyebrow">CAPACITY</p>
                <h3>Occupancy</h3>
              </div>
              <span className="period">Live</span>
            </div>
            <div className="pf-capacity">
              <Ring
                parts={[
                  { label: "Occupied", value: stats.occupied, color: "#f59e0b" },
                  { label: "Reserved", value: stats.reserved, color: "#a855f7" },
                  { label: "Available", value: stats.available, color: "#22c55e" },
                ]}
              >
                <strong>{occupancyPercentage}%</strong>
                <span>occupied</span>
              </Ring>
              <div className="pf-capacity-list">
                <div><i className="number-dot available-dot" /><span>Available</span><strong>{stats.available}</strong></div>
                <div><i className="number-dot occupied-dot" /><span>Occupied</span><strong>{stats.occupied}</strong></div>
                <div><i className="number-dot reserved-dot" /><span>Reserved</span><strong>{stats.reserved}</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div className="dz-col-right">
          <SelectedSpaceCard slotId={selectedSlotId} onRecordPayment={openPayment} />

          <div className="glass-card dz-activity activity-card">
            <div className="card-header">
              <div>
                <p className="card-eyebrow">RECENT ACTIVITY</p>
                <h3>Latest Events</h3>
              </div>
              <Link to="/parking-sessions" className="text-button">View all →</Link>
            </div>
            <div className="activity-list dz-activity-list">
              {activity.length === 0 && <p className="muted">Nothing yet. Start a session to see activity here.</p>}
              {activity.map((item) => (
                <div className="activity-item" key={item.id}>
                  <div className={`activity-icon ${item.type}`}>{item.icon}</div>
                  <div className="activity-info">
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>
                  <time>{item.time}</time>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Modal open={sessionOpen} onClose={() => setSessionOpen(false)} title="New Parking Session">
        <NewSessionForm onDone={() => setSessionOpen(false)} />
      </Modal>
      <Modal open={reserveOpen} onClose={() => setReserveOpen(false)} title="New Reservation">
        <ReserveForm onDone={() => setReserveOpen(false)} />
      </Modal>
      <Modal open={paymentOpen} onClose={() => setPaymentOpen(false)} title="Record Payment">
        <PaymentForm onDone={() => setPaymentOpen(false)} presetSlotId={paymentSlot} />
      </Modal>
    </div>
  );
}