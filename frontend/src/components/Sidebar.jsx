import { NavLink } from "react-router-dom";
import { navItems } from "../data/mockData";
import { useParking } from "../context/ParkingContext";

// Turn "Parking Sessions" → "/parking-sessions"
const toPath = (label) => "/" + label.toLowerCase().replace(/\s+/g, "-");

export default function Sidebar() {
  const { stats } = useParking();
  const pct = stats.total ? Math.round((stats.occupied / stats.total) * 100) : 0;
  const linkClass = ({ isActive }) => `nav-item ${isActive ? "active" : ""}`;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><span>P</span></div>
        <div>
          <h1>ParkFlow</h1>
          <p>Parking Management</p>
        </div>
      </div>

      <div className="sidebar-section">
        <span className="section-label">MAIN MENU</span>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.label} to={toPath(item.label)} end className={linkClass}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {/* live count of active sessions instead of a hardcoded 12 */}
              {item.label === "Parking Sessions" && stats.occupied > 0 && (
                <span className="nav-badge">{stats.occupied}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-section bottom-menu">
        <span className="section-label">SYSTEM</span>
        <NavLink to="/settings" end className={linkClass}>
          <span className="nav-icon">⚙</span>
          <span>Settings</span>
        </NavLink>
      </div>

      <div className="sidebar-capacity">
        <div>
          <span>Facility capacity</span>
          <strong>{pct}%</strong>
        </div>
        <div className="sidebar-capacity-bar"><div style={{ width: `${pct}%` }} /></div>
        <small>{stats.occupied} of {stats.total} spaces in use</small>
      </div>

      <div className="sidebar-user">
        <div className="avatar">KT</div>
        <div className="user-info">
          <strong>Parking Admin</strong>
          <span>Administrator</span>
        </div>
        <button className="more-button" aria-label="User menu">•••</button>
      </div>
    </aside>
  );
}