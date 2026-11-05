import { Router } from "express";
import { query } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await query(
    `SELECT * FROM reservations ORDER BY created_at DESC`
  );
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { spaceId, plate, reservedFor } = req.body;
  if (!spaceId || !plate || !reservedFor)
    return res.status(400).json({ error: "spaceId, plate, reservedFor required" });

  const space = await query(`SELECT status FROM spaces WHERE id = $1`, [spaceId]);
  if (space.rows.length === 0)
    return res.status(404).json({ error: "Space not found" });
  if (space.rows[0].status !== "available")
    return res.status(409).json({ error: "Space not available" });

  const r = await query(
    `INSERT INTO reservations (space_id, plate, reserved_for)
     VALUES ($1, $2, $3) RETURNING *`,
    [spaceId, plate.toUpperCase(), reservedFor]
  );

  await query(`UPDATE spaces SET status = 'reserved' WHERE id = $1`, [spaceId]);
  res.status(201).json(r.rows[0]);
});

router.post("/:id/convert", async (req, res) => {
  const r = await query(
    `UPDATE reservations SET status = 'converted'
     WHERE id = $1 AND status = 'active' RETURNING *`,
    [req.params.id]
  );
  if (r.rows.length === 0)
    return res.status(404).json({ error: "Active reservation not found" });

  const res0 = r.rows[0];

  await query(
    `UPDATE sessions SET status = 'ended', exited_at = NOW()
     WHERE space_id = $1 AND status = 'active'`,
    [res0.space_id]
  );

  const session = await query(
    `INSERT INTO sessions (space_id, plate) VALUES ($1, $2) RETURNING *`,
    [res0.space_id, res0.plate]
  );
  await query(`UPDATE spaces SET status = 'occupied' WHERE id = $1`, [
    res0.space_id,
  ]);

  res.json({ reservation: res0, session: session.rows[0] });
});

router.post("/:id/cancel", async (req, res) => {
  const r = await query(
    `UPDATE reservations SET status = 'cancelled'
     WHERE id = $1 AND status = 'active' RETURNING *`,
    [req.params.id]
  );
  if (r.rows.length === 0)
    return res.status(404).json({ error: "Active reservation not found" });

  await query(`UPDATE spaces SET status = 'available' WHERE id = $1`, [
    r.rows[0].space_id,
  ]);
  res.json(r.rows[0]);
});

export default router;