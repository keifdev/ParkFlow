import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { navItems } from "../data/mockData";
import { useParking } from "../context/ParkingContext";

const toPath = (label) => "/" + label.toLowerCase().replace(/\s+/g, "-");

export default function Topbar() {
  const { pathname } = useLocation();
  const { resetData } = useParking();

  // Live date + time (was hardcoded to "Monday, October 5, 2026")
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const match = navItems.find((item) => toPath(item.label) === pathname);
  const title = pathname === "/" ? "Dashboard" : match?.label || "Settings";

  return (
    <header className="topbar">
      <div>
        <div className="breadcrumb">
          <span>ParkFlow</span>
          <span>/</span>
          <strong>{title}</strong>
        </div>
        <h2>{title}</h2>
      </div>

      <div className="topbar-actions">
        <div className="system-status">
          <span className="status-dot" />
          System Online
        </div>

        <button className="icon-button notification-button" aria-label="Notifications">
          ♢
          <span className="notification-dot" />
        </button>

        <button
          className="icon-button"
          aria-label="Reset demo data"
          onClick={() => {
            if (window.confirm("Reset all demo data? This can't be undone.")) resetData();
          }}
          title="Reset demo data"
        >
          ↺
        </button>

        <div className="date-display">
          <span>
            {now.toLocaleDateString("en-PH", { weekday: "long" })} ·{" "}
            {now.toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" })}
          </span>
          <strong>
            {now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </strong>
        </div>
      </div>
    </header>
  );
}