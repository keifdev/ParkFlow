import { Router } from "express";
import { query } from "../db.js";

const router = Router();

router.get("/active", async (req, res) => {
  const { rows } = await query(`
    SELECT id, space_id, plate, entered_at,
           EXTRACT(EPOCH FROM (NOW() - entered_at))/60 AS minutes
    FROM sessions
    WHERE status = 'active'
    ORDER BY entered_at DESC
  `);
  res.json(rows);
});

router.post("/start", async (req, res) => {
  const { spaceId, plate } = req.body;
  if (!spaceId || !plate)
    return res.status(400).json({ error: "spaceId and plate required" });

  const space = await query(`SELECT status FROM spaces WHERE id = $1`, [spaceId]);
  if (space.rows.length === 0)
    return res.status(404).json({ error: "Space not found" });
  if (space.rows[0].status !== "available")
    return res.status(409).json({ error: "Space not available" });

  const session = await query(
    `INSERT INTO sessions (space_id, plate) VALUES ($1, $2) RETURNING *`,
    [spaceId, plate.toUpperCase()]
  );
  await query(`UPDATE spaces SET status = 'occupied' WHERE id = $1`, [spaceId]);

  res.status(201).json(session.rows[0]);
});

router.post("/:id/end", async (req, res) => {
  const { id } = req.params;

  const s = await query(
    `UPDATE sessions
     SET status = 'ended',
         exited_at = NOW(),
         duration_min = EXTRACT(EPOCH FROM (NOW() - entered_at))/60
     WHERE id = $1 AND status = 'active'
     RETURNING *`,
    [id]
  );

  if (s.rows.length === 0)
    return res.status(404).json({ error: "Active session not found" });

  await query(`UPDATE spaces SET status = 'available' WHERE id = $1`, [
    s.rows[0].space_id,
  ]);

  res.json(s.rows[0]);
});

export default router;