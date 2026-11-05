const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getSpaces: () => request("/spaces"),

  startSession: (spaceId, plate) =>
    request("/sessions/start", {
      method: "POST",
      body: JSON.stringify({ spaceId, plate }),
    }),
  endSession: (id) =>
    request(`/sessions/${id}/end`, { method: "POST" }),
  getActiveSessions: () => request("/sessions/active"),

  getReservations: () => request("/reservations"),
  createReservation: (spaceId, plate, reservedFor) =>
    request("/reservations", {
      method: "POST",
      body: JSON.stringify({ spaceId, plate, reservedFor }),
    }),
  convertReservation: (id) =>
    request(`/reservations/${id}/convert`, { method: "POST" }),
  cancelReservation: (id) =>
    request(`/reservations/${id}/cancel`, { method: "POST" }),

  getPayments: () => request("/payments"),
  getRevenue: () => request("/payments/revenue"),
  recordPayment: (payload) =>
    request("/payments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};