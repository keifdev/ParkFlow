import { useLocation, useNavigate } from "react-router-dom";
import { navItems } from "../data/mockData";

export default function Placeholder() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Find which nav item matches the current URL so we can show its label + icon
  const match = navItems.find(
    (item) => `/${item.label.toLowerCase().replace(/\s+/g, "-")}` === pathname
  );

  const title = match?.label || "Settings";
  const icon = match?.icon || "⚙";

  return (
    <section className="placeholder-page glass-card">
      <div className="placeholder-icon">{icon}</div>
      <p className="card-eyebrow">PARKFLOW MODULE</p>
      <h3>{title}</h3>
      <p>
        This module is ready for development. We'll connect it to the backend
        after the dashboard and floor plan are completed.
      </p>
      <button className="primary-button" onClick={() => navigate("/")}>
        ← Back to Dashboard
      </button>
    </section>
  );
}