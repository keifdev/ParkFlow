export const parkingSlots = [
  { id: "P01", status: "available", type: "Regular", floor: "Floor 1" },
  { id: "P02", status: "occupied", type: "Regular", floor: "Floor 1", plate: "ABC 1234", duration: "1h 42m" },
  { id: "P03", status: "available", type: "Regular", floor: "Floor 1" },
  { id: "P04", status: "reserved", type: "VIP", floor: "Floor 1", plate: "XYZ 5678" },
  { id: "P05", status: "available", type: "Regular", floor: "Floor 1" },
  { id: "P06", status: "occupied", type: "Regular", floor: "Floor 1", plate: "NCR 4821", duration: "32m" },
  { id: "P07", status: "available", type: "Regular", floor: "Floor 1" },
  { id: "P08", status: "available", type: "PWD", floor: "Floor 1" },
  { id: "P09", status: "occupied", type: "Regular", floor: "Floor 1", plate: "KLM 9012", duration: "2h 15m" },
  { id: "P10", status: "available", type: "Regular", floor: "Floor 1" },
  { id: "P11", status: "reserved", type: "VIP", floor: "Floor 1", plate: "JHG 3345" },
  { id: "P12", status: "available", type: "Regular", floor: "Floor 1" },
];

export const activity = [
  { id: "seed-1", icon: "↗", title: "Vehicle entered", description: "ABC 1234 entered P02", time: "2 mins ago", type: "success" },
  { id: "seed-2", icon: "₱", title: "Payment received", description: "₱120.00 from NCR 4821", time: "8 mins ago", type: "payment" },
  { id: "seed-3", icon: "↙", title: "Vehicle exited", description: "DEF 7788 left P14", time: "14 mins ago", type: "exit" },
  { id: "seed-4", icon: "◆", title: "Reservation created", description: "P11 reserved for 6:30 PM", time: "21 mins ago", type: "reserved" },
];

export const navItems = [
  { label: "Dashboard", icon: "▦" },
  { label: "Floor Plan", icon: "⌗" },
  { label: "Vehicles", icon: "▣" },
  { label: "Parking Sessions", icon: "◷" },
  { label: "Reservations", icon: "□" },
  { label: "Payments", icon: "₱" },
  { label: "Reports", icon: "⌁" },
];