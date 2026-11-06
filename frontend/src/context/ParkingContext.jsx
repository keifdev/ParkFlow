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
      // 1. Fetch all data from the backend, including the new recent endpoints
      const [spaces, resList, payList, rev, recentSessions, recentPayments] = await Promise.all([
        api.getSpaces(),
        api.getReservations(),
        api.getPayments(),
        api.getRevenue(),
        api.getRecentSessions(),
        api.getRecentPayments(),
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

      // 2. Combine recent sessions and payments into one activity feed
      const combinedActivity = [
        ...(recentSessions || []).map((s) => {
          const isActive = s.status === "active";
          return {
            id: `sess-${s.id}`,
            icon: isActive ? "↗" : "↙",
            title: isActive ? "Vehicle entered" : "Vehicle exited",
            description: `${s.plate} ${isActive ? "entered" : "left"} ${s.space_id}`,
            time: formatTimeAgo(s.exited_at || s.entered_at),
            type: isActive ? "success" : "exit",
            timestamp: new Date(s.exited_at || s.entered_at).getTime(),
          };
        }),
        ...(recentPayments || []).map((p) => ({
          id: `pay-${p.id}`,
          icon: "₱",
          title: "Payment received",
          description: `₱${Number(p.amount).toFixed(2)} from ${p.plate || "Unknown"} (${p.method})`,
          time: formatTimeAgo(p.created_at),
          type: "payment",
          timestamp: new Date(p.created_at).getTime(),
        })),
      ];

      // 3. Sort by newest first, take the top 8
      combinedActivity.sort((a, b) => b.timestamp - a.timestamp);
      setActivity(combinedActivity.slice(0, 8));

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
    await refresh();
  };

  const endSession = async (slotId) => {
    const active = await api.getActiveSessions();
    const match = active.find((s) => s.space_id === slotId);
    if (!match) return;
    await api.endSession(match.id);
    await refresh();
  };

  const reserveSlot = async ({ slotId, plate, reservedFor }) => {
    await api.createReservation(slotId, plate, reservedFor);
    await refresh();
  };

  const convertReservation = async (reservationId) => {
    await api.convertReservation(reservationId);
    await refresh();
  };

  const cancelReservation = async (reservationId) => {
    await api.cancelReservation(reservationId);
    await refresh();
  };

  const recordPayment = async ({ slotId, plate, amount, method }) => {
    await api.recordPayment({ spaceId: slotId, plate, amount, method });
    await refresh();
  };

  const resetData = async () => {
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

function formatTimeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function useParking() {
  const ctx = useContext(ParkingContext);
  if (!ctx) throw new Error("useParking must be used inside <ParkingProvider>");
  return ctx;
}