import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { ParkingProvider } from "./context/ParkingContext";
import AppShell from "./layout/AppShell";
import Dashboard from "./pages/Dashboard";
import FloorPlan from "./pages/FloorPlan";
import Vehicles from "./pages/Vehicles";
import ParkingSessions from "./pages/ParkingSessions";
import Reservations from "./pages/Reservations";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <ParkingProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="floor-plan" element={<FloorPlan />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="parking-sessions" element={<ParkingSessions />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ParkingProvider>
  );
}