import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const ParkingContext = createContext(null);

export function ParkingProvider({ children }) {
  const [slots, setSlots] = useState([]);
  const [activity, setActivity] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pushActivity = useCallback((entry) => {
    setActivity((prev) => [
      { ...entry, id: `act-${Date.now()}-${Math.random()}` },
      ...prev.slice(0, 7),
    ]);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const [spaces, resList, payList, rev] = await Promise.all([
        api.getSpaces(),
        api.getReservations(),
        api.getPayments(),
        api.getRevenue(),
      ]);

      setSlots(
        spaces.map((s) => ({
          id: s.id,
          floor: s.floor,
          type: s.type,
          status: s.status,
          plate: s.plate || undefined,
          duration: s.entered_at ? formatDuration(s.entered_at) : undefined,
        }))
      );

      setReservations(
        resList.map((r) => ({
          id: String(r.id),
          slotId: r.space_id,
          plate: r.plate,
          reservedFor: r.reserved_for,
          status: r.status,
          createdAt: r.created_at,
        }))
      );

      setPayments(
        payList.map((p) => ({
          id: String(p.id),
          slotId: p.space_id,
          plate: p.plate,
          amount: Number(p.amount),
          method: p.method,
          createdAt: p.created_at,
        }))
      );

      setRevenue(Number(rev.total));
      setError(null);
    } catch (e) {
      console.error("API refresh failed:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const startSession = async ({ slotId, plate }) => {
    await api.startSession(slotId, plate);
    pushActivity({
      icon: "↗", title: "Vehicle entered",
      description: `${plate} entered ${slotId}`,
      time: "just now", type: "success",
    });
    await refresh();
  };

  const endSession = async (slotId) => {
    const active = await api.getActiveSessions();
    const match = active.find((s) => s.space_id === slotId);
    if (!match) return;
    await api.endSession(match.id);
    pushActivity({
      icon: "↙", title: "Vehicle exited",
      description: `${match.plate} left ${slotId}`,
      time: "just now", type: "exit",
    });
    await refresh();
  };

  const reserveSlot = async ({ slotId, plate, reservedFor }) => {
    await api.createReservation(slotId, plate, reservedFor);
    pushActivity({
      icon: "◆", title: "Reservation created",
      description: `${slotId} reserved for ${plate}`,
      time: "just now", type: "reserved",
    });
    await refresh();
  };

  const convertReservation = async (reservationId) => {
    const r = reservations.find((x) => x.id === reservationId);
    await api.convertReservation(reservationId);
    pushActivity({
      icon: "↗", title: "Reservation converted",
      description: `${r?.plate} checked in at ${r?.slotId}`,
      time: "just now", type: "success",
    });
    await refresh();
  };

  const cancelReservation = async (reservationId) => {
    const r = reservations.find((x) => x.id === reservationId);
    await api.cancelReservation(reservationId);
    pushActivity({
      icon: "✕", title: "Reservation cancelled",
      description: `${r?.slotId} released`,
      time: "just now", type: "exit",
    });
    await refresh();
  };

  const recordPayment = async ({ slotId, plate, amount, method }) => {
    await api.recordPayment({ spaceId: slotId, plate, amount, method });
    pushActivity({
      icon: "₱", title: "Payment received",
      description: `₱${Number(amount).toFixed(2)} from ${plate} (${method})`,
      time: "just now", type: "payment",
    });
    await refresh();
  };

  const resetData = async () => {
    // DB is source of truth now. Reset = re-seed (run `npm run seed` in backend).
    await refresh();
  };

  const stats = useMemo(() => {
    const available = slots.filter((s) => s.status === "available").length;
    const occupied = slots.filter((s) => s.status === "occupied").length;
    const reserved = slots.filter((s) => s.status === "reserved").length;
    return { total: slots.length, available, occupied, reserved };
  }, [slots]);

  const value = {
    slots, activity, reservations, payments,
    stats, revenue, loading, error,
    startSession, endSession, reserveSlot,
    convertReservation, cancelReservation,
    recordPayment, resetData, refresh,
  };

  return (
    <ParkingContext.Provider value={value}>
      {children}
    </ParkingContext.Provider>
  );
}

function formatDuration(enteredAt) {
  const mins = Math.floor((Date.now() - new Date(enteredAt).getTime()) / 60000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export function useParking() {
  const ctx = useContext(ParkingContext);
  if (!ctx) throw new Error("useParking must be used inside <ParkingProvider>");
  return ctx;
}